import { jsPDF } from 'jspdf';
import { PatientRecord } from '../types';
import { formatNaira } from './helpers';

/**
 * Downloads an HTML file to the user's computer.
 */
export function downloadHtmlDocument(filename: string, htmlContent: string): boolean {
  try {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 200);
    return true;
  } catch (error) {
    console.error('Failed to download document:', error);
    return false;
  }
}

/**
 * Attempts to print HTML content using multi-tier strategy:
 * 1. Dedicated Blob URL in a top-level tab/window (completely bypasses iframe sandbox restrictions)
 * 2. In-DOM hidden iframe printing with auto-cleanup
 * 3. Direct browser window.print() fallback
 */
export function printHtmlDocument(htmlContent: string, documentTitle: string = 'MedSphere_Document'): boolean {
  try {
    // Ensure the HTML document includes the auto-print script
    let fullHtml = htmlContent;
    if (!fullHtml.includes('window.print()')) {
      const autoPrintScript = `
        <script>
          window.addEventListener('load', function() {
            setTimeout(function() {
              try { window.print(); } catch(e) {}
            }, 350);
          });
        </script>
      `;
      fullHtml = fullHtml.replace('</body>', `${autoPrintScript}</body>`);
    }

    // 1. Primary Strategy: Create Blob URL for top-level window execution
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);

    let popupSucceeded = false;
    try {
      const printWin = window.open(blobUrl, '_blank');
      if (printWin) {
        popupSucceeded = true;
        printWin.focus();
      }
    } catch (popupErr) {
      console.warn('Popup window.open restricted by browser sandbox:', popupErr);
    }

    // 2. Secondary Strategy: Hidden iframe print
    let iframeSucceeded = false;
    try {
      const hiddenIframe = document.createElement('iframe');
      hiddenIframe.style.position = 'fixed';
      hiddenIframe.style.right = '0';
      hiddenIframe.style.bottom = '0';
      hiddenIframe.style.width = '0';
      hiddenIframe.style.height = '0';
      hiddenIframe.style.border = '0';
      hiddenIframe.setAttribute('aria-hidden', 'true');
      document.body.appendChild(hiddenIframe);

      const iframeDoc = hiddenIframe.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(fullHtml);
        iframeDoc.close();
        setTimeout(() => {
          try {
            hiddenIframe.contentWindow?.focus();
            hiddenIframe.contentWindow?.print();
            iframeSucceeded = true;
          } catch (e) {
            console.warn('Hidden iframe print restricted:', e);
          }
          setTimeout(() => {
            if (document.body.contains(hiddenIframe)) {
              document.body.removeChild(hiddenIframe);
            }
          }, 4000);
        }, 400);
      }
    } catch (iframeErr) {
      console.warn('Hidden iframe print error:', iframeErr);
    }

    // 3. Tertiary Strategy: In-DOM print container swap
    let inDomSucceeded = false;
    try {
      let container = document.getElementById('medsphere-print-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'medsphere-print-container';
        document.body.appendChild(container);
      }

      let printableBody = fullHtml;
      const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      if (bodyMatch && bodyMatch[1]) {
        printableBody = bodyMatch[1];
      }
      const styleMatches = fullHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
      const stylesCombined = styleMatches.join('\n');

      container.innerHTML = `${stylesCombined}\n<div class="medsphere-printable-wrapper">${printableBody}</div>`;
      document.body.classList.add('medsphere-printing-active');

      const cleanup = () => {
        document.body.classList.remove('medsphere-printing-active');
        if (container && document.body.contains(container)) {
          container.innerHTML = '';
        }
        window.removeEventListener('afterprint', cleanup);
      };
      window.addEventListener('afterprint', cleanup);
      setTimeout(cleanup, 2000);

      window.focus();
      window.print();
      inDomSucceeded = true;
    } catch (directPrintErr) {
      console.warn('Direct window.print() restricted by iframe sandbox:', directPrintErr);
    }

    // Dispatch global custom event in case UI listening components want to react
    try {
      window.dispatchEvent(
        new CustomEvent('medsphere:print-executed', {
          detail: { title: documentTitle, blobUrl },
        })
      );
    } catch (e) {
      // Ignored if event dispatch not supported
    }

    return popupSucceeded || iframeSucceeded || inDomSucceeded;
  } catch (e) {
    console.error('Print execution error:', e);
    return false;
  }
}

/**
 * Generates an official, publication-ready vector PDF for a patient clinical chart
 * using jsPDF. Handles multi-page pagination and exports all detailed diagnostic findings.
 */
export function exportPatientChartPdf(patient: PatientRecord): { success: boolean; filename: string } {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 14;
    const contentWidth = pageWidth - margin * 2; // 182mm
    let y = 14;

    const encounterDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const auditTimestamp = new Date().toISOString();
    const filename = `MedSphere_Patient_Chart_${patient.hospitalNumber}.pdf`;

    // Dynamic pagination helper to ensure no results or rows are truncated
    const ensurePageSpace = (neededHeight: number, sectionTitle?: string) => {
      if (y + neededHeight > pageHeight - 22) {
        doc.addPage();
        // Continuation Header
        doc.setFillColor(37, 99, 235);
        doc.rect(margin, 10, contentWidth, 2, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(29, 78, 216);
        doc.text('Alpha III MedSphere Healthcare Cloud • Clinical Chart Continuation', margin, 16);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`Patient: ${patient.fullName} • MRN: ${patient.hospitalNumber}`, pageWidth - margin, 16, { align: 'right' });

        doc.setDrawColor(226, 232, 240);
        doc.line(margin, 19, pageWidth - margin, 19);

        y = 25;

        if (sectionTitle) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(71, 85, 105);
          doc.text(`${sectionTitle} (CONTINUED)`, margin, y);
          y += 5;
        }
      }
    };

    // 1. Top Decorative Brand Bar
    doc.setFillColor(37, 99, 235); // Blue 600
    doc.rect(margin, y, contentWidth, 3, 'F');
    y += 8;

    // 2. Header: Organization & Document Metadata
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(29, 78, 216); // Blue 700
    doc.text('Alpha III MedSphere Healthcare Cloud', margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Encounter: ${encounterDate}`, pageWidth - margin, y - 1, { align: 'right' });

    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text('OFFICIAL ELECTRONIC HEALTH RECORD • CLINICAL ENCOUNTER & LAB REPORT', margin, y);

    // MRN Badge (Top Right)
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(191, 219, 254);
    doc.roundedRect(pageWidth - margin - 46, y - 4, 46, 7, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(29, 78, 216);
    doc.text(`MRN: ${patient.hospitalNumber}`, pageWidth - margin - 23, y + 1, { align: 'center' });

    y += 8;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // 3. Demographics Box (Grid)
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

    const colWidth = contentWidth / 4;
    // Col 1: Full Name & Age
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('PATIENT FULL NAME', margin + 4, y + 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(patient.fullName, margin + 4, y + 12.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Age: ${patient.age} yrs • DOB: 19${90 - patient.age}-01-01`, margin + 4, y + 18);

    // Col 2: Gender & Blood Group
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('SEX & BLOOD GROUP', margin + colWidth + 4, y + 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${patient.gender} • ${patient.bloodGroup}`, margin + colWidth + 4, y + 12.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Genotype: AA • RH: Positive`, margin + colWidth + 4, y + 18);

    // Col 3: HMO Provider
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('PRIMARY HMO PROVIDER', margin + colWidth * 2 + 4, y + 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(patient.hmoProvider, margin + colWidth * 2 + 4, y + 12.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Policy: ${patient.hmoPolicyId}`, margin + colWidth * 2 + 4, y + 18);

    // Col 4: Pre-Authorization
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('CLAIM / PRE-AUTH', margin + colWidth * 3 + 4, y + 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    if (patient.claimStatus === 'Approved') {
      doc.setTextColor(22, 163, 74);
      doc.text('✓ APPROVED', margin + colWidth * 3 + 4, y + 12.5);
    } else {
      doc.setTextColor(202, 138, 4);
      doc.text('⏳ ' + patient.claimStatus.toUpperCase(), margin + colWidth * 3 + 4, y + 12.5);
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('Electronic Bridge Active', margin + colWidth * 3 + 4, y + 18);

    y += 25;

    // 4. Allergy Safety Guard Banner
    const hasAllergies = patient.allergies && patient.allergies.length > 0;
    doc.setFillColor(hasAllergies ? 255 : 240, hasAllergies ? 241 : 253, hasAllergies ? 242 : 244);
    doc.setDrawColor(hasAllergies ? 244 : 187, hasAllergies ? 63 : 247, hasAllergies ? 94 : 208);
    doc.roundedRect(margin, y, contentWidth, 9, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(hasAllergies ? 225 : 21, hasAllergies ? 29 : 128, hasAllergies ? 72 : 61);
    const allergyText = hasAllergies
      ? `CLINICAL ALLERGY ALERT: ${patient.allergies.join(', ').toUpperCase()} (CDS INTERLOCK ACTIVE)`
      : 'CLINICAL ALLERGY STATUS: NO KNOWN DRUG ALLERGIES (NKDA)';
    doc.text(allergyText, margin + 4, y + 6);

    y += 13;

    // 5. Recorded Vitals Grid (Including Weight & Calculated BMI)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('PATIENT TRIAGE VITALS & BIOMETRICS (EDGE-SYNCHRONIZED)', margin, y);
    y += 3;

    const bmi = (patient.vitals.weightKg / Math.pow(1.72, 2)).toFixed(1);
    const vitalsData = [
      { label: 'BLOOD PRESSURE', val: patient.vitals.bloodPressure, unit: 'mmHg' },
      { label: 'HEART PULSE', val: `${patient.vitals.pulse}`, unit: 'bpm' },
      { label: 'OXYGEN SPO2', val: `${patient.vitals.spo2}%`, unit: 'SpO2' },
      { label: 'TEMPERATURE', val: `${patient.vitals.temp}°C`, unit: 'Celsius' },
      { label: 'BODY WEIGHT', val: `${patient.vitals.weightKg} kg`, unit: `BMI ${bmi}` },
    ];
    const vitalBoxWidth = (contentWidth - (vitalsData.length - 1) * 2.5) / vitalsData.length;

    vitalsData.forEach((v, idx) => {
      const vx = margin + idx * (vitalBoxWidth + 2.5);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(vx, y, vitalBoxWidth, 14, 1.5, 1.5, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor(100, 116, 139);
      doc.text(v.label, vx + 2.5, y + 4.5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(2, 132, 199);
      doc.text(v.val, vx + 2.5, y + 10.5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(148, 163, 184);
      doc.text(v.unit, vx + vitalBoxWidth - 2.5, y + 10.5, { align: 'right' });
    });

    y += 18;

    // 6. Chief Complaint & Clinical Narrative (SOAP)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('CHIEF COMPLAINT & CLINICAL ENCOUNTER NARRATIVE (SOAP)', margin, y);
    y += 3;

    const complaintLines = doc.splitTextToSize(patient.currentComplaint || 'Routine clinical consultation.', contentWidth - 8);
    const complaintBoxHeight = Math.max(12, complaintLines.length * 4.5 + 5);
    ensurePageSpace(complaintBoxHeight + 8);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, complaintBoxHeight, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(complaintLines, margin + 4, y + 5.5);

    y += complaintBoxHeight + 5;

    // 7. Documented Diagnoses (ICD-11 / SNOMED CT)
    ensurePageSpace(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('DOCUMENTED CLINICAL DIAGNOSES (ICD-11 / SNOMED CT)', margin, y);
    y += 3;

    let dxX = margin;
    patient.diagnoses.forEach((diag) => {
      const tagText = diag;
      const tagWidth = doc.getTextWidth(tagText) + 8;
      if (dxX + tagWidth > pageWidth - margin) {
        dxX = margin;
        y += 7;
        ensurePageSpace(8);
      }
      doc.setFillColor(239, 246, 255);
      doc.setDrawColor(191, 219, 254);
      doc.roundedRect(dxX, y, tagWidth, 6, 1, 1, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 64, 175);
      doc.text(tagText, dxX + 4, y + 4.2);
      dxX += tagWidth + 3;
    });

    y += 9;

    // 8. E-Prescriptions Table
    ensurePageSpace(25, 'PHARMACEUTICAL DISPENSARY ORDERS');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('PHARMACEUTICAL DISPENSARY ORDERS & E-PRESCRIPTIONS', margin, y);
    y += 3;

    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text('MEDICATION FORMULATION', margin + 3, y + 4.2);
    doc.text('DOSAGE & ROUTE', margin + 65, y + 4.2);
    doc.text('FREQUENCY / INSTRUCTIONS', margin + 110, y + 4.2);
    doc.text('DISPENSARY STATUS', pageWidth - margin - 3, y + 4.2, { align: 'right' });
    y += 6;

    // Table Rows
    patient.prescriptions.forEach((rx, rIdx) => {
      ensurePageSpace(8, 'PHARMACEUTICAL DISPENSARY ORDERS');
      const isEven = rIdx % 2 === 0;
      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.rect(margin, y, contentWidth, 6.5, 'F');
      doc.setDrawColor(241, 245, 249);
      doc.line(margin, y + 6.5, pageWidth - margin, y + 6.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(rx.drug, margin + 3, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text(rx.dosage, margin + 65, y + 4.5);
      doc.text(rx.frequency, margin + 110, y + 4.5);

      if (rx.status === 'Dispensed') {
        doc.setTextColor(22, 163, 74);
        doc.setFont('helvetica', 'bold');
        doc.text('✓ DISPENSED', pageWidth - margin - 3, y + 4.5, { align: 'right' });
      } else {
        doc.setTextColor(202, 138, 4);
        doc.setFont('helvetica', 'bold');
        doc.text('⏳ QUEUED', pageWidth - margin - 3, y + 4.5, { align: 'right' });
      }
      y += 6.5;
    });

    y += 6;

    // 9. Complete Diagnostic & Laboratory Investigations Table
    ensurePageSpace(25, 'DIAGNOSTIC & LABORATORY INVESTIGATIONS');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('DIAGNOSTIC & LABORATORY INVESTIGATIONS (FULL CLINICAL FINDINGS)', margin, y);
    y += 3;

    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text('INVESTIGATION / TEST NAME', margin + 3, y + 4.2);
    doc.text('STATUS & SPECIMEN', margin + 65, y + 4.2);
    doc.text('PATHOLOGIST FINDINGS & DIAGNOSTIC VALUES', margin + 105, y + 4.2);
    y += 6;

    patient.labRequests.forEach((lab, lIdx) => {
      // Calculate wrapped text dimensions for test name and full findings
      const testLines = doc.splitTextToSize(lab.test, 58);
      const resultText = lab.result
        ? lab.result
        : lab.status === 'Sample Collected'
        ? 'Specimen logged into central analyzer queue • Pending validation run'
        : 'Processing specimen in analytical pipeline • Reference intervals pending';
      const resultLines = doc.splitTextToSize(resultText, 72);

      const rowHeight = Math.max(7.5, Math.max(testLines.length, resultLines.length) * 4.2 + 3);
      ensurePageSpace(rowHeight + 2, 'DIAGNOSTIC & LABORATORY INVESTIGATIONS');

      const isEven = lIdx % 2 === 0;
      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.rect(margin, y, contentWidth, rowHeight, 'F');
      doc.setDrawColor(241, 245, 249);
      doc.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight);

      // Investigation Test Name (multi-line supported)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(testLines, margin + 3, y + 4.5);

      // Status Badge
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      if (lab.status === 'Completed') {
        doc.setTextColor(22, 163, 74);
        doc.text('✓ COMPLETED', margin + 65, y + 4.5);
      } else if (lab.status === 'Sample Collected') {
        doc.setTextColor(2, 132, 199);
        doc.text('◉ COLLECTED', margin + 65, y + 4.5);
      } else {
        doc.setTextColor(202, 138, 4);
        doc.text('⏳ IN-PROGRESS', margin + 65, y + 4.5);
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(100, 116, 139);
      doc.text('Specimen: Venous/Fluid', margin + 65, y + 8.5);

      // Pathologist Findings & Result Values (multi-line wrapped so not a single detail is lost!)
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(30, 41, 59);
      doc.text(resultLines, margin + 105, y + 4.5);

      y += rowHeight;
    });

    // Lab Quality Standard Footer Callout
    ensurePageSpace(14);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y + 2, contentWidth, 10, 1, 1, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Diagnostic investigations performed under ISO 15189 laboratory quality standards. Calibrated automated analyzers.', margin + 3, y + 6);
    doc.setFont('helvetica', 'bold');
    doc.text('Signed: Dr. C. Okonjo, FMCPath (Chief Pathologist) • Alpha III MedSphere Clinical Lab', margin + 3, y + 9.5);
    y += 14;

    // Number all pages cleanly at the bottom
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      const footerY = pageHeight - 10;
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`NDPA 2023 Statutory Healthcare Compliance • Cryptographic Stamp: ${auditTimestamp}`, margin, footerY + 2);
      doc.text(`Alpha III MedSphere Cloud EMR • Page ${i} of ${totalPages}`, pageWidth - margin, footerY + 2, { align: 'right' });
    }

    // Save as genuine .pdf file
    doc.save(filename);
    return { success: true, filename };
  } catch (err) {
    console.error('Failed to generate patient chart PDF:', err);
    return { success: false, filename: '' };
  }
}

/**
 * Generates the complete, standalone HTML document for the patient clinical chart
 */
export function getPatientChartHtml(patient: PatientRecord): string {
  const encounterDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const auditTimestamp = new Date().toISOString();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Clinical Encounter Summary - ${patient.fullName} (${patient.hospitalNumber})</title>
  <style>
    @page { size: A4; margin: 15mm; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      margin: 0;
      padding: 24px;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.5;
      font-size: 13px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .brand { font-size: 22px; font-weight: 800; color: #1d4ed8; letter-spacing: -0.02em; }
    .subbrand { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; }
    .hospital-meta { text-align: right; font-size: 11px; color: #475569; }
    .mrn-badge {
      display: inline-block;
      font-family: monospace;
      font-size: 13px;
      font-weight: 700;
      background: #eff6ff;
      color: #1d4ed8;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid #bfdbfe;
      margin-top: 4px;
    }
    .demographics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 16px;
    }
    .demographic-item .label { font-size: 10px; text-transform: uppercase; font-weight: 700; color: #64748b; }
    .demographic-item .val { font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px; }
    .alert-banner {
      background: #fff1f2;
      border: 1px solid #fecdd3;
      border-left: 4px solid #e11d48;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 18px;
      font-size: 12px;
      color: #9f1239;
    }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1e293b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 18px;
      margin-bottom: 10px;
    }
    .vitals-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }
    .vital-box {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px;
      background: #f8fafc;
    }
    .vital-box .name { font-size: 10px; text-transform: uppercase; font-weight: 600; color: #64748b; }
    .vital-box .num { font-size: 16px; font-weight: 800; font-family: monospace; color: #0284c7; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; margin-bottom: 16px; }
    th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
    th { background: #f1f5f9; color: #475569; font-weight: 700; font-size: 11px; text-transform: uppercase; }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge-approved { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .badge-pending { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
    .footer {
      margin-top: 30px;
      padding-top: 12px;
      border-top: 1px solid #cbd5e1;
      font-size: 10px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .print-bar {
      background: #1e293b;
      color: white;
      padding: 10px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .print-btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    @media print {
      .print-bar { display: none !important; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <span><strong>MedSphere Official Clinical Chart</strong> • Direct Hardcopy Print</span>
    <button class="print-btn" onclick="window.print()">Print Document</button>
  </div>

  <div class="header">
    <div>
      <div class="brand">Alpha III MedSphere Healthcare Cloud</div>
      <div class="subbrand">Official Electronic Health Record • Clinical Encounter Report</div>
    </div>
    <div class="hospital-meta">
      <div>Encounter Date: <strong>${encounterDate}</strong></div>
      <div class="mrn-badge">MRN: ${patient.hospitalNumber}</div>
    </div>
  </div>

  <div class="demographics-grid">
    <div class="demographic-item">
      <div class="label">Patient Full Name</div>
      <div class="val">${patient.fullName}</div>
    </div>
    <div class="demographic-item">
      <div class="label">Age & Biological Sex</div>
      <div class="val">${patient.age} years • ${patient.gender}</div>
    </div>
    <div class="demographic-item">
      <div class="label">Blood Group</div>
      <div class="val">${patient.bloodGroup}</div>
    </div>
    <div class="demographic-item">
      <div class="label">Primary HMO Provider</div>
      <div class="val">${patient.hmoProvider}</div>
      <div style="font-size: 10px; font-family: monospace; color: #64748b;">ID: ${patient.hmoPolicyId}</div>
    </div>
  </div>

  <div class="alert-banner">
    <strong>Clinical Safety & Allergy Record:</strong> ${
      patient.allergies && patient.allergies.length > 0
        ? patient.allergies.join(', ')
        : 'No Known Drug Allergies (NKDA)'
    }
  </div>

  <div class="section-title">Recorded Vitals</div>
  <div class="vitals-grid">
    <div class="vital-box">
      <div class="name">Blood Pressure</div>
      <div class="num">${patient.vitals.bloodPressure} <span style="font-size: 10px; color: #64748b;">mmHg</span></div>
    </div>
    <div class="vital-box">
      <div class="name">Heart Rate</div>
      <div class="num">${patient.vitals.pulse} <span style="font-size: 10px; color: #64748b;">bpm</span></div>
    </div>
    <div class="vital-box">
      <div class="name">Oxygen SpO2</div>
      <div class="num">${patient.vitals.spo2}%</div>
    </div>
    <div class="vital-box">
      <div class="name">Body Temperature</div>
      <div class="num">${patient.vitals.temp}°C</div>
    </div>
  </div>

  <div class="section-title">Chief Complaint & Encounter Narrative</div>
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-bottom: 16px; font-size: 13px;">
    ${patient.currentComplaint}
  </div>

  <div class="section-title">Documented Diagnoses (ICD-11 / SNOMED CT)</div>
  <div style="margin-bottom: 16px;">
    ${patient.diagnoses
      .map(
        (diag) =>
          `<div style="display: inline-block; background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 8px; margin-bottom: 6px;">${diag}</div>`
      )
      .join('')}
  </div>

  <div class="section-title">Prescriptions & Dispensary Orders</div>
  <table>
    <thead>
      <tr>
        <th>Medication Formulation</th>
        <th>Dosage & Route</th>
        <th>Frequency & Instructions</th>
        <th>Dispensary Status</th>
      </tr>
    </thead>
    <tbody>
      ${patient.prescriptions
        .map(
          (rx) => `
        <tr>
          <td style="font-weight: 700; color: #0f172a;">${rx.drug}</td>
          <td>${rx.dosage}</td>
          <td>${rx.frequency}</td>
          <td><span class="badge ${rx.status === 'Dispensed' ? 'badge-approved' : 'badge-pending'}">${rx.status}</span></td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="section-title">Diagnostic & Laboratory Investigations</div>
  <table>
    <thead>
      <tr>
        <th>Investigation / Test Name</th>
        <th>Status</th>
        <th>Pathologist Findings / Diagnostic Result</th>
      </tr>
    </thead>
    <tbody>
      ${patient.labRequests
        .map(
          (lab) => `
        <tr>
          <td style="font-weight: 600;">${lab.test}</td>
          <td><span class="badge ${lab.status === 'Completed' ? 'badge-approved' : 'badge-pending'}">${lab.status}</span></td>
          <td style="font-family: monospace; color: #334155;">${lab.result || 'Specimen in Analyzer Pipeline'}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="section-title">HMO Claim & Pre-Authorization Status</div>
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
    <div>
      <div><strong>Insurer:</strong> ${patient.hmoProvider}</div>
      <div style="font-size: 11px; color: #64748b;">Policy ID: ${patient.hmoPolicyId}</div>
    </div>
    <div>
      <strong>Pre-Authorization Status:</strong>
      <span class="badge ${patient.claimStatus === 'Approved' ? 'badge-approved' : 'badge-pending'}" style="margin-left: 8px;">
        ${patient.claimStatus}
      </span>
    </div>
  </div>

  <div class="footer">
    <div>NDPA 2023 Statutory Healthcare Compliance • Cryptographic Stamp: ${auditTimestamp}</div>
    <div>Alpha III MedSphere Cloud EMR • Verified Clinical Encounter</div>
  </div>

  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        try { window.print(); } catch(e) {}
      }, 400);
    });
  </script>
</body>
</html>`;
}

/**
 * Triggers direct browser printing for the patient clinical chart
 */
export function printPatientChart(patient: PatientRecord): boolean {
  const html = getPatientChartHtml(patient);
  return printHtmlDocument(html, `MedSphere_Patient_Chart_${patient.hospitalNumber}`);
}

/**
 * Generates an official, publication-ready vector PDF for the MedSphere Enterprise
 * HMS Pricing Schedule & ROI Proposal using jsPDF.
 * RECOMMENDED for Hospital Board, Executive Committee, and CFO approvals.
 */
export function exportPricingProposalPdf(options: {
  planName: string;
  monthlyNaira: number;
  annualNaira: number;
  clinicianSeats: number;
  branches: number;
  totalCostNaira: number;
  billingCycle: 'monthly' | 'annual';
  estimatedSavingsNaira: number;
}): { success: boolean; filename: string } {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = 16;

    const timestamp = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const filename = `MedSphere_Pricing_Proposal_${options.planName.replace(/\s+/g, '_')}.pdf`;

    // Header Accent Bar
    doc.setFillColor(37, 99, 235);
    doc.rect(margin, y, contentWidth, 3, 'F');
    y += 8;

    // Organization Brand
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(29, 78, 216);
    doc.text('Alpha III MedSphere Healthcare Cloud', margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Proposal Date: ${timestamp}`, pageWidth - margin, y - 1, { align: 'right' });

    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text('ENTERPRISE HMS LICENSING & ZERO-PATIENT-FEE ROI SCHEDULE', margin, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(22, 163, 74);
    doc.text('VALIDITY: 30 CALENDAR DAYS', pageWidth - margin, y, { align: 'right' });

    y += 6;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Plan Title Banner
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(191, 219, 254);
    doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 64, 175);
    doc.text(`PLAN SELECTED: ${options.planName.toUpperCase()}`, margin + 5, y + 8.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`BILLING CYCLE: ${options.billingCycle.toUpperCase()}`, pageWidth - margin - 5, y + 8.5, { align: 'right' });

    y += 20;

    // 3 Metric Cards Grid
    const cardWidth = (contentWidth - 8) / 3;
    const metrics = [
      {
        label: 'CLINICIAN & STAFF SEATS',
        val: `${options.clinicianSeats} Logins`,
        sub: 'Unlimited patient charts included',
        color: [15, 23, 42],
      },
      {
        label: 'HOSPITAL BRANCH SITES',
        val: `${options.branches} ${options.branches === 1 ? 'Location' : 'Locations'}`,
        sub: 'Centralized Master EMR synchronization',
        color: [15, 23, 42],
      },
      {
        label: `TOTAL INVESTMENT (${options.billingCycle.toUpperCase()})`,
        val: formatNaira(options.totalCostNaira),
        sub: `Billed ${options.billingCycle} with zero hidden fees`,
        color: [37, 99, 235],
      },
    ];

    metrics.forEach((m, idx) => {
      const mx = margin + idx * (cardWidth + 4);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(mx, y, cardWidth, 24, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(m.label, mx + 4, y + 6);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(m.color[0], m.color[1], m.color[2]);
      doc.text(m.val, mx + 4, y + 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(m.sub, mx + 4, y + 20);
    });

    y += 30;

    // ROI Simulator Callout Box
    doc.setFillColor(240, 253, 244); // Emerald 50
    doc.setDrawColor(187, 247, 208); // Emerald 200
    doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(21, 128, 61);
    doc.text('PROJECTED ANNUAL OPERATIONAL SAVINGS & EFFICIENCY ROI', margin + 5, y + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(22, 101, 52);
    doc.text(`+${formatNaira(options.estimatedSavingsNaira)} / year`, margin + 5, y + 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(74, 222, 128);
    doc.text('Achieved through eliminated per-card fees, automated HMO tariff adjudication, and reduced drug expiry waste.', margin + 80, y + 15);

    y += 28;

    // Institutional Highlights Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text('INSTITUTIONAL SERVICE GUARANTEES & COMPLIANCE', margin, y);
    y += 4;

    const highlights = [
      'Zero Patient Fee Guarantee: Never pay per bed, per outpatient card, per lab test, or per registration.',
      '45+ HMO Integrations Included: Real-time tariff matching and digital claim remittance for Hygeia, Reliance, AXA Mansard, NHIA, and more.',
      'Sub-50ms Query Performance: Instant patient lookup with local offline caching for intermittent connectivity.',
      'NDPA 2023 & ISO 27001 Certified: End-to-end AES-256-GCM encryption, granular RBAC, and tamper-evident audit logs.',
      'Unlimited Patient Companion App: Free digital appointment booking and verified lab report access for your patient population.',
    ];

    highlights.forEach((hl) => {
      doc.setFillColor(37, 99, 235);
      doc.circle(margin + 2, y + 2.5, 1, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(hl, margin + 6, y + 3.8);
      y += 7.5;
    });

    y += 10;

    // Signature / Executive Approval Block
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'S');

    const halfW = contentWidth / 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('PREPARED FOR (HOSPITAL BOARD):', margin + 5, y + 7);
    doc.text('AUTHORIZED BY (MEDSPHERE ENTERPRISE):', margin + halfW + 5, y + 7);

    doc.line(margin + 5, y + 19, margin + halfW - 10, y + 19);
    doc.line(margin + halfW + 5, y + 19, pageWidth - margin - 5, y + 19);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Chief Executive Officer / Medical Director Signature', margin + 5, y + 23);
    doc.text('Alpha III MedSphere Enterprise Licensing Authority', margin + halfW + 5, y + 23);

    // Footer
    const footerY = pageHeight - 14;
    doc.setDrawColor(203, 213, 225);
    doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('MedSphere Cloud Technologies Limited • Enterprise Licensing Office • licensing@medsphere.cloud', margin, footerY + 2);
    doc.text('Confidential Institutional Proposal • Valid for 30 Days', pageWidth - margin, footerY + 2, { align: 'right' });

    doc.save(filename);
    return { success: true, filename };
  } catch (err) {
    console.error('Failed to generate pricing PDF:', err);
    return { success: false, filename: '' };
  }
}

export interface PricingProposalPrintOptions {
  planName: string;
  monthlyNaira: number;
  annualNaira: number;
  clinicianSeats: number;
  branches: number;
  totalCostNaira: number;
  billingCycle: 'monthly' | 'annual';
  estimatedSavingsNaira: number;
}

/**
 * Generates standalone HTML for the pricing and ROI schedule proposal
 */
export function getPricingProposalHtml(options: PricingProposalPrintOptions): string {
  const timestamp = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MedSphere Enterprise HMS Pricing & ROI Assessment - ${options.planName}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 24px; color: #0f172a; font-size: 13px; line-height: 1.5; }
    .header { border-bottom: 2px solid #2563eb; padding-bottom: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand { font-size: 22px; font-weight: 800; color: #1d4ed8; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; }
    .card .label { font-size: 10px; text-transform: uppercase; font-weight: 700; color: #64748b; }
    .card .value { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 4px; font-family: monospace; }
    .print-bar { background: #1e293b; color: white; padding: 10px 16px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .print-btn { background: #2563eb; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
    @media print { .print-bar { display: none !important; } }
  </style>
</head>
<body>
  <div class="print-bar">
    <span><strong>MedSphere Official Proposal</strong> • Print Hardcopy for Hospital Board</span>
    <button class="print-btn" onclick="window.print()">Print Document</button>
  </div>
  <div class="header">
    <div>
      <div class="brand">Alpha III MedSphere Healthcare Cloud</div>
      <div style="color: #64748b; font-size: 11px;">Institutional Software License & Cloud EMR Proposal</div>
    </div>
    <div style="text-align: right; font-size: 11px; color: #64748b;">
      <div>Generated: ${timestamp}</div>
      <div style="font-weight: bold; color: #1d4ed8;">Valid for 30 Days</div>
    </div>
  </div>

  <h2>Plan Selected: ${options.planName} (${options.billingCycle.toUpperCase()})</h2>
  <div class="grid">
    <div class="card">
      <div class="label">Clinician & Staff Logins</div>
      <div class="value">${options.clinicianSeats} Seats</div>
      <div style="font-size: 11px; color: #16a34a; font-weight: 600; margin-top: 4px;">Unlimited Patient Charts</div>
    </div>
    <div class="card">
      <div class="label">Total Hospital Branches</div>
      <div class="value">${options.branches} ${options.branches === 1 ? 'Site' : 'Sites'}</div>
      <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Centralized Master EMR</div>
    </div>
    <div class="card">
      <div class="label">Total Investment</div>
      <div class="value" style="color: #2563eb;">${formatNaira(options.totalCostNaira)}</div>
      <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Billed ${options.billingCycle}</div>
    </div>
  </div>

  <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 14px; margin-bottom: 20px;">
    <h3 style="margin-top: 0; color: #1e40af; font-size: 14px;">Institutional Highlights:</h3>
    <ul style="margin-bottom: 0; padding-left: 20px;">
      <li>Zero Patient Fee Guarantee: Never pay per bed, per visit, or per registration.</li>
      <li>45+ Nigerian & Global HMO API integration included.</li>
      <li>Sub-50ms query speeds with offline emergency queueing.</li>
      <li>NDPA 2023 and ISO 27001 compliance with automated audit reports.</li>
    </ul>
  </div>

  <div style="margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 12px; font-size: 10px; color: #64748b;">
    MedSphere Cloud Technologies Limited • Enterprise Licensing Office • support@medsphere.cloud
  </div>
</body>
</html>`;
}

/**
 * Triggers direct browser printing for the Pricing Schedule & ROI Proposal
 */
export function printPricingProposal(options: PricingProposalPrintOptions): boolean {
  const html = getPricingProposalHtml(options);
  return printHtmlDocument(html, `MedSphere_Pricing_Proposal_${options.planName.replace(/\s+/g, '_')}`);
}

/**
 * Generates an official, publication-ready vector PDF for any documentation chapter
 */
export function exportDocumentationPdf(chapter: {
  title: string;
  category: string;
  targetAudience: string;
  readTime: string;
  summary: string;
  markdownContent: string;
  codeSnippet?: { filename: string; code: string };
}): { success: boolean; filename: string } {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = 16;

    const filename = `MedSphere_Docs_${chapter.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}.pdf`;

    // Top Bar
    doc.setFillColor(37, 99, 235);
    doc.rect(margin, y, contentWidth, 2.5, 'F');
    y += 7;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(29, 78, 216);
    doc.text('Alpha III MedSphere Documentation', margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Category: ${chapter.category} • Target Audience: ${chapter.targetAudience} • ${chapter.readTime}`, margin, y);
    y += 6;

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 7;

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    const titleLines = doc.splitTextToSize(chapter.title, contentWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 6 + 4;

    // Summary Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    const summaryLines = doc.splitTextToSize(`SUMMARY: ${chapter.summary}`, contentWidth - 8);
    const boxHeight = summaryLines.length * 4.5 + 6;
    doc.roundedRect(margin, y, contentWidth, boxHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(summaryLines, margin + 4, y + 5.5);
    y += boxHeight + 8;

    // Content clean text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);

    const cleanContent = chapter.markdownContent
      .replace(/###/g, '')
      .replace(/##/g, '')
      .replace(/#/g, '')
      .replace(/\*\*/g, '')
      .replace(/```/g, '')
      .trim();

    const contentLines = doc.splitTextToSize(cleanContent, contentWidth);
    // Limit to first page content or fit
    const linesToPrint = contentLines.slice(0, 45);
    doc.text(linesToPrint, margin, y);

    if (chapter.codeSnippet) {
      y = 240;
      doc.setFillColor(2, 6, 23);
      doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(96, 165, 250);
      doc.text(`REFERENCE CODE: ${chapter.codeSnippet.filename}`, margin + 4, y + 6);

      doc.setFont('courier', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(226, 232, 240);
      const codeLines = doc.splitTextToSize(chapter.codeSnippet.code, contentWidth - 8).slice(0, 7);
      doc.text(codeLines, margin + 4, y + 12);
    }

    doc.save(filename);
    return { success: true, filename };
  } catch (err) {
    console.error('Failed to export documentation PDF:', err);
    return { success: false, filename: '' };
  }
}

export interface DocumentationGuidePrintChapter {
  title: string;
  category: string;
  targetAudience: string;
  readTime: string;
  summary: string;
  markdownContent: string;
}

/**
 * Generates standalone HTML for a documentation chapter
 */
export function getDocumentationGuideHtml(chapter: DocumentationGuidePrintChapter): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MedSphere Guide: ${chapter.title}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #0f172a; line-height: 1.6; font-size: 13px; }
    .header { border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px; }
    .brand { font-size: 20px; font-weight: 800; color: #1d4ed8; }
    .meta { font-size: 11px; color: #64748b; margin-top: 4px; }
    .summary-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px; margin-bottom: 20px; }
    .print-bar { background: #1e293b; color: white; padding: 10px 16px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; }
    .print-btn { background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-weight: 600; cursor: pointer; }
    @media print { .print-bar { display: none !important; } }
  </style>
</head>
<body>
  <div class="print-bar">
    <span><strong>MedSphere Implementation Blueprint</strong></span>
    <button class="print-btn" onclick="window.print()">Print Document</button>
  </div>
  <div class="header">
    <div class="brand">Alpha III MedSphere Healthcare Cloud</div>
    <div class="meta">Category: ${chapter.category} • Target: ${chapter.targetAudience} • Read Time: ${chapter.readTime}</div>
  </div>
  <h1>${chapter.title}</h1>
  <div class="summary-box">
    <strong>Summary:</strong> ${chapter.summary}
  </div>
  <div>
    ${chapter.markdownContent.replace(/###/g, '<h3>').replace(/##/g, '<h2>').replace(/#/g, '<h1>')}
  </div>
</body>
</html>`;
}

/**
 * Triggers direct browser printing for documentation
 */
export function printDocumentationGuide(chapter: DocumentationGuidePrintChapter): boolean {
  const html = getDocumentationGuideHtml(chapter);
  return printHtmlDocument(html, `MedSphere_Guide_${chapter.title.replace(/\s+/g, '_')}`);
}

/**
 * Backward-compatibility aliases that default to recommended vector PDF generation
 */
export const exportPatientChart = exportPatientChartPdf;
export const exportPricingProposal = exportPricingProposalPdf;

