import React, { useState, useEffect } from 'react';
import { MOCK_PATIENT_RECORDS } from '../data/mockData';
import { PatientRecord } from '../types';
import {
  X,
  Activity,
  Heart,
  Stethoscope,
  FlaskConical,
  Pill,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Clock,
  Sparkles,
  FileText,
  User,
  Search,
  AlertTriangle,
  Code2,
  Download,
  Check,
  Printer,
  FileDown,
  Trash2,
} from 'lucide-react';
import { copyToClipboard } from '../utils/helpers';
import { exportPatientChartPdf, printPatientChart, getPatientChartHtml } from '../utils/exportUtils';
import { PrintPreviewModal } from './PrintPreviewModal';

interface HospitalSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HospitalSandboxModal: React.FC<HospitalSandboxModalProps> = ({ isOpen, onClose }) => {
  const [patients, setPatients] = useState<PatientRecord[]>(MOCK_PATIENT_RECORDS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(MOCK_PATIENT_RECORDS[0].id);
  const [activeTab, setActiveTab] = useState<'soap' | 'vitals' | 'lab' | 'pharmacy' | 'hmo' | 'fhir'>('soap');

  // Form states for interactive actions
  const [newSoapNote, setNewSoapNote] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newLabTest, setNewLabTest] = useState('');
  const [newLabResult, setNewLabResult] = useState('');
  const [editingLabIndex, setEditingLabIndex] = useState<number | null>(null);
  const [editingLabResultText, setEditingLabResultText] = useState<string>('');
  const [newDrug, setNewDrug] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [hmoChecking, setHmoChecking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [allergyWarning, setAllergyWarning] = useState<string | null>(null);
  const [copiedFhir, setCopiedFhir] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddDiagnosis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiagnosis.trim()) return;
    setPatients((prev) =>
      prev.map((p) =>
        p.id === currentPatient.id
          ? { ...p, diagnoses: [...p.diagnoses, newDiagnosis.trim()] }
          : p
      )
    );
    setNewDiagnosis('');
    triggerToast('Diagnosis added to clinical chart');
  };

  const handleDeleteDiagnosis = (diagIndex: number) => {
    const diagToRemove = currentPatient.diagnoses[diagIndex];
    setPatients((prev) =>
      prev.map((p) =>
        p.id === currentPatient.id
          ? {
              ...p,
              diagnoses: p.diagnoses.filter((_, idx) => idx !== diagIndex),
            }
          : p
      )
    );
    triggerToast(`✓ Removed diagnosis: "${diagToRemove || 'Condition'}"`);
  };

  const handleAddLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabTest.trim()) return;
    const testName = newLabTest.trim();
    const testResult = newLabResult.trim();
    setPatients((prev) =>
      prev.map((p) =>
        p.id === currentPatient.id
          ? {
              ...p,
              labRequests: [
                ...p.labRequests,
                {
                  test: testName,
                  status: testResult ? 'Completed' : 'Sample Collected',
                  result: testResult || undefined,
                },
              ],
            }
          : p
      )
    );
    setNewLabTest('');
    setNewLabResult('');
    triggerToast(`✓ Dispatched lab order: ${testName}`);
  };

  const handleDeleteLab = (labIndex: number) => {
    const testToRemove = currentPatient.labRequests[labIndex]?.test;
    setPatients((prev) =>
      prev.map((p) =>
        p.id === currentPatient.id
          ? {
              ...p,
              labRequests: p.labRequests.filter((_, idx) => idx !== labIndex),
            }
          : p
      )
    );
    if (editingLabIndex === labIndex) {
      setEditingLabIndex(null);
      setEditingLabResultText('');
    }
    triggerToast(`✓ Deleted mistake lab order: "${testToRemove || 'Investigation'}"`);
  };

  const handleSimulateLabResult = (labIndex: number) => {
    const lab = currentPatient.labRequests[labIndex];
    if (!lab) return;
    const testLower = lab.test.toLowerCase();
    let simulated = 'Diagnostic analysis validated. Values within normal reference interval.';

    if (
      testLower.includes('fbc') ||
      testLower.includes('blood count') ||
      testLower.includes('hemoglobin') ||
      testLower.includes('haemoglobin')
    ) {
      simulated = 'Hb: 13.8 g/dL, WBC: 6.4 x10^9/L, Platelets: 260 x10^9/L (Normal Adult Reference)';
    } else if (
      testLower.includes('malaria') ||
      testLower.includes('mp') ||
      testLower.includes('rdt')
    ) {
      simulated = 'No malaria parasites seen on thick/thin Giemsa-stained blood films (Negative)';
    } else if (
      testLower.includes('sugar') ||
      testLower.includes('glucose') ||
      testLower.includes('fbs') ||
      testLower.includes('hba1c')
    ) {
      simulated = 'Fasting Blood Glucose: 92 mg/dL (Normal Fasting: 70-99 mg/dL)';
    } else if (testLower.includes('lipid') || testLower.includes('cholesterol')) {
      simulated = 'Total Chol: 182 mg/dL, HDL: 54 mg/dL, LDL: 104 mg/dL, Trig: 120 mg/dL (Optimal)';
    } else if (testLower.includes('urinalysis') || testLower.includes('urine')) {
      simulated = 'pH 6.0, SG 1.020, Protein: Nil, Glucose: Nil, Nitrite: Negative, Leucocytes: Trace';
    } else if (testLower.includes('widal') || testLower.includes('typhoid')) {
      simulated = 'S. typhi TO < 1:80, TH < 1:80 (Non-significant titer / Negative)';
    } else if (
      testLower.includes('electrolyte') ||
      testLower.includes('creatinine') ||
      testLower.includes('urea') ||
      testLower.includes('e/u/cr')
    ) {
      simulated = 'Na: 139 mmol/L, K: 4.1 mmol/L, Urea: 3.6 mmol/L, Creatinine: 76 umol/L (Normal Renal Panel)';
    } else if (testLower.includes('calcium') || testLower.includes('serum calcium')) {
      simulated = 'Total Calcium: 2.35 mmol/L (Normal reference range: 2.15 - 2.55 mmol/L)';
    } else if (
      testLower.includes('liver') ||
      testLower.includes('lft') ||
      testLower.includes('ast') ||
      testLower.includes('alt')
    ) {
      simulated = 'ALT: 22 U/L, AST: 24 U/L, Total Bilirubin: 12 umol/L, Albumin: 42 g/L (Normal Hepatic Profile)';
    }

    setPatients((prev) =>
      prev.map((p) =>
        p.id === currentPatient.id
          ? {
              ...p,
              labRequests: p.labRequests.map((l, idx) =>
                idx === labIndex
                  ? { ...l, status: 'Completed', result: simulated }
                  : l
              ),
            }
          : p
      )
    );
    triggerToast(`✓ Automated analyzer findings logged for ${lab.test}`);
  };

  const handleSaveLabResult = (labIndex: number) => {
    if (!editingLabResultText.trim()) return;
    setPatients((prev) =>
      prev.map((p) =>
        p.id === currentPatient.id
          ? {
              ...p,
              labRequests: p.labRequests.map((l, idx) =>
                idx === labIndex
                  ? {
                      ...l,
                      status: 'Completed',
                      result: editingLabResultText.trim(),
                    }
                  : l
              ),
            }
          : p
      )
    );
    setEditingLabIndex(null);
    setEditingLabResultText('');
    triggerToast('✓ Lab result findings updated on clinical chart');
  };

  const handleDeletePrescription = (rxIndex: number) => {
    const drugToRemove = currentPatient.prescriptions[rxIndex]?.drug;
    setPatients((prev) =>
      prev.map((p) =>
        p.id === currentPatient.id
          ? {
              ...p,
              prescriptions: p.prescriptions.filter((_, idx) => idx !== rxIndex),
            }
          : p
      )
    );
    triggerToast(`✓ Removed prescription: "${drugToRemove || 'Medication'}"`);
  };

  const handleAddPrescription = (e: React.FormEvent, overrideAllergy: boolean = false) => {
    e.preventDefault();
    if (!newDrug.trim()) return;

    const drugLower = newDrug.toLowerCase();
    const hasPenicillinAllergy = currentPatient.allergies.some((a) =>
      a.toLowerCase().includes('penicillin')
    );

    // Clinical Decision Support (CDS) allergy rule check
    if (
      !overrideAllergy &&
      hasPenicillinAllergy &&
      (drugLower.includes('penicillin') ||
        drugLower.includes('amoxicillin') ||
        drugLower.includes('augmentin') ||
        drugLower.includes('ampicillin') ||
        drugLower.includes('amoxil'))
    ) {
      setAllergyWarning(
        `CRITICAL ALLERGY ALERT: Patient has a documented Penicillin allergy. Prescribing "${newDrug}" creates a severe anaphylaxis risk. Please select an alternative (e.g. Azithromycin, Ciprofloxacin) or override with clinical justification.`
      );
      return;
    }

    setAllergyWarning(null);
    setPatients((prev) =>
      prev.map((p) =>
        p.id === currentPatient.id
          ? {
              ...p,
              prescriptions: [
                ...p.prescriptions,
                {
                  drug: newDrug.trim(),
                  dosage: newDosage || '1 Tab TDS',
                  frequency: 'Prescribed in Clinic',
                  status: 'Pending',
                },
              ],
            }
          : p
      )
    );
    setNewDrug('');
    setNewDosage('');
    triggerToast('Prescription sent to Pharmacy Queue');
  };

  const handleDispenseDrug = (drugIndex: number) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== currentPatient.id) return p;
        const updatedRx = [...p.prescriptions];
        updatedRx[drugIndex] = { ...updatedRx[drugIndex], status: 'Dispensed' };
        return { ...p, prescriptions: updatedRx };
      })
    );
    triggerToast('Medication verified and dispensed');
  };

  const handleVerifyHMO = () => {
    setHmoChecking(true);
    setTimeout(() => {
      setHmoChecking(false);
      setPatients((prev) =>
        prev.map((p) =>
          p.id === currentPatient.id ? { ...p, claimStatus: 'Approved' } : p
        )
      );
      triggerToast('HMO Pre-Authorization Verified & Approved');
    }, 900);
  };

  const fhirBundleJson = JSON.stringify(
    {
      resourceType: 'Bundle',
      type: 'collection',
      timestamp: new Date().toISOString(),
      entry: [
        {
          resource: {
            resourceType: 'Patient',
            id: currentPatient.id,
            identifier: [{ system: 'medsphere.cloud/mrn', value: currentPatient.hospitalNumber }],
            name: [{ text: currentPatient.fullName }],
            gender: currentPatient.gender.toLowerCase(),
            birthDate: `19${90 - currentPatient.age}-01-01`,
          },
        },
        {
          resource: {
            resourceType: 'Observation',
            status: 'final',
            code: { coding: [{ system: 'http://loinc.org', code: '85354-9', display: 'Blood pressure panel' }] },
            subject: { reference: `Patient/${currentPatient.id}` },
            valueString: currentPatient.vitals.bloodPressure,
          },
        },
        {
          resource: {
            resourceType: 'Coverage',
            status: 'active',
            subscriberId: currentPatient.hmoPolicyId,
            payor: [{ display: currentPatient.hmoProvider }],
          },
        },
      ],
    },
    null,
    2
  );

  const handleCopyFhir = () => {
    copyToClipboard(fhirBundleJson).then((success) => {
      if (success) {
        setCopiedFhir(true);
        setTimeout(() => setCopiedFhir(false), 2000);
      }
    });
  };

  const handleExportPdf = () => {
    const res = exportPatientChartPdf(currentPatient);
    if (res.success) {
      triggerToast(`✓ Generated & downloaded official .PDF clinical chart for ${currentPatient.fullName} (${currentPatient.hospitalNumber})!`);
    } else {
      triggerToast('Generating PDF chart. Check browser downloads.');
    }
  };

  const handlePrintChart = () => {
    setIsPrintPreviewOpen(true);
    printPatientChart(currentPatient);
    triggerToast(`✓ Opened Print Station for ${currentPatient.fullName} (${currentPatient.hospitalNumber})`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200 font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-sandbox-title"
    >
      <div className="bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden font-sans">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span id="modal-sandbox-title" className="font-bold text-sm text-slate-900 dark:text-white">
                  MedSphere Interactive Clinical Sandbox
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono border border-emerald-200 dark:border-emerald-500/30">
                  LIVE WORKSPACE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Experience real-time chart updates, CDS allergy collision warnings, and instant HMO pre-authorizations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPdf}
              title="Export official patient clinical chart (PDF)"
              className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <button
              onClick={handlePrintChart}
              title="Print clinical chart"
              className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close Clinical Sandbox"
              className="no-print p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 animate-in slide-in-from-top">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Patient Selector Sidebar */}
          <div className="lg:col-span-4 p-4 border-r border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#020617]/60 overflow-y-auto space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 type-scale-2xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span>Active Patients ({patients.length})</span>
              <span className="type-scale-3xs font-mono font-bold text-blue-600 dark:text-blue-400">TODAY'S CLINIC</span>
            </div>

            <div className="space-y-2">
              {patients.map((pat) => {
                const isSelected = pat.id === currentPatient.id;
                return (
                  <button
                    key={pat.id}
                    onClick={() => {
                      setSelectedPatientId(pat.id);
                      setAllergyWarning(null);
                    }}
                    className={`w-full p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 ring-1 ring-blue-500/40 text-blue-900 dark:text-white shadow-xs'
                        : 'bg-white dark:bg-[#0B1120] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold type-scale-xs">{pat.fullName}</span>
                      <span className="type-scale-3xs font-mono opacity-70">{pat.hospitalNumber}</span>
                    </div>
                    <div className="type-scale-2xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                      <span>{pat.age} yrs • {pat.gender}</span>
                      <span>•</span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">{pat.hmoProvider}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 type-scale-3xs">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#020617] text-slate-700 dark:text-slate-300 font-mono font-medium">
                        BP: {pat.vitals.bloodPressure}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-semibold ${
                        pat.claimStatus === 'Approved'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}>
                        HMO: {pat.claimStatus}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Summary Pill */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#0B1120]/90 border border-slate-200 dark:border-slate-800 type-scale-2xs text-slate-600 dark:text-slate-400 space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-200 block">NDPA 2023 & Clinical Guard</span>
              <p className="leading-relaxed">Real-time drug allergy collision checks and immutable cryptographic audit trails active.</p>
            </div>
          </div>

          {/* Patient Details & Clinical Tools */}
          <div className="lg:col-span-8 p-4 sm:p-6 overflow-y-auto space-y-5 bg-white dark:bg-[#0B1120]">
            {/* Patient Hero Info */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                  {currentPatient.fullName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-extrabold type-scale-base text-slate-900 dark:text-white">
                    {currentPatient.fullName}
                  </h3>
                  <div className="type-scale-2xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="font-mono">{currentPatient.hospitalNumber}</span>
                    <span>•</span>
                    <span>Blood: {currentPatient.bloodGroup}</span>
                    <span>•</span>
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">
                      Allergies: {currentPatient.allergies.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleVerifyHMO}
                  disabled={hmoChecking || currentPatient.claimStatus === 'Approved'}
                  className="px-3.5 py-2 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 hover:bg-blue-200 dark:hover:bg-blue-500/30 type-scale-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{hmoChecking ? 'Checking Tariff...' : currentPatient.claimStatus === 'Approved' ? 'HMO Approved' : 'Verify HMO'}</span>
                </button>
              </div>
            </div>

            {/* Quick Vitals Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 type-scale-3xs uppercase font-bold tracking-wider">Blood Pressure</span>
                <div className="type-scale-lg font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 metric-numeric">
                  {currentPatient.vitals.bloodPressure} <span className="type-scale-3xs text-slate-500 dark:text-slate-400 font-sans font-medium">mmHg</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 type-scale-3xs uppercase font-bold tracking-wider">Heart Rate</span>
                <div className="type-scale-lg font-extrabold font-mono text-blue-600 dark:text-blue-400 mt-0.5 metric-numeric">
                  {currentPatient.vitals.pulse} <span className="type-scale-3xs text-slate-500 dark:text-slate-400 font-sans font-medium">bpm</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 type-scale-3xs uppercase font-bold tracking-wider">Oxygen SpO2</span>
                <div className="type-scale-lg font-extrabold font-mono text-teal-600 dark:text-teal-400 mt-0.5 metric-numeric">
                  {currentPatient.vitals.spo2}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 type-scale-3xs uppercase font-bold tracking-wider">Body Temp</span>
                <div className="type-scale-lg font-extrabold font-mono text-amber-600 dark:text-amber-400 mt-0.5 metric-numeric">
                  {currentPatient.vitals.temp}°C
                </div>
              </div>
            </div>

            {/* Action Tabs */}
            <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
              {[
                { id: 'soap', label: 'SOAP Notes & Diagnosis', icon: FileText },
                { id: 'lab', label: `Labs (${currentPatient.labRequests.length})`, icon: FlaskConical },
                { id: 'pharmacy', label: `Pharmacy (${currentPatient.prescriptions.length})`, icon: Pill },
                { id: 'hmo', label: 'HMO Tariff & Pre-Auth', icon: ShieldCheck },
                { id: 'fhir', label: 'FHIR R4 JSON Payload', icon: Code2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl type-scale-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Allergy Conflict Alert Box */}
            {allergyWarning && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900/60 type-scale-xs text-rose-800 dark:text-rose-300 space-y-2.5 animate-in slide-in-from-top">
                <div className="flex items-center gap-2 font-bold text-rose-900 dark:text-rose-200 type-scale-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>MedSphere Clinical Decision Support (CDS) Safety Interlock</span>
                </div>
                <p className="leading-relaxed type-scale-xs">{allergyWarning}</p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setAllergyWarning(null)}
                    className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 type-scale-xs font-bold hover:bg-rose-100 cursor-pointer"
                  >
                    Cancel & Change Medication
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleAddPrescription(e as any, true)}
                    className="px-3.5 py-2 rounded-lg bg-rose-600 text-white type-scale-xs font-bold hover:bg-rose-500 cursor-pointer"
                  >
                    Override with Documented Clinical Justification
                  </button>
                </div>
              </div>
            )}

            {/* Tab Contents */}
            {activeTab === 'soap' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="type-scale-xs font-bold text-slate-800 dark:text-slate-300">Chief Complaint & History:</div>
                  <p className="type-scale-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {currentPatient.currentComplaint}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="type-scale-xs font-bold text-slate-800 dark:text-slate-300">Current Documented Diagnoses:</div>
                  <div className="flex flex-wrap gap-2">
                    {currentPatient.diagnoses.map((diag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 type-scale-xs font-medium inline-flex items-center gap-1.5"
                      >
                        <span>{diag}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteDiagnosis(idx)}
                          className="hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer transition-colors"
                          title="Remove mistaken diagnosis"
                          aria-label={`Remove ${diag}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Add Diagnosis Form */}
                <form onSubmit={handleAddDiagnosis} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Enter ICD-11 diagnosis (e.g. J06.9 - Acute upper respiratory infection)"
                    value={newDiagnosis}
                    onChange={(e) => setNewDiagnosis(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 type-scale-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold type-scale-xs transition-colors cursor-pointer"
                  >
                    Add Diagnosis
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'lab' && (
              <div className="space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="type-scale-xs font-bold text-slate-800 dark:text-slate-300">
                      Dispatched Diagnostic Orders & Laboratory Investigations:
                    </span>
                    <span className="type-scale-3xs text-slate-500 dark:text-slate-400 font-mono">
                      {currentPatient.labRequests.length} on chart
                    </span>
                  </div>

                  {currentPatient.labRequests.length === 0 ? (
                    <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#020617] border border-dashed border-slate-300 dark:border-slate-800 text-center">
                      <p className="type-scale-xs text-slate-500 dark:text-slate-400">
                        No active laboratory orders on chart. Use the dispatch form below to order investigations.
                      </p>
                    </div>
                  ) : (
                    currentPatient.labRequests.map((lab, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="type-scale-xs font-bold text-slate-900 dark:text-white truncate">
                              {lab.test}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded type-scale-3xs font-mono font-bold shrink-0 ${
                                lab.status === 'Completed'
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                  : lab.status === 'Sample Collected'
                                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                  : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              }`}
                            >
                              {lab.status}
                            </span>
                          </div>

                          {/* Result display or inline editing */}
                          {editingLabIndex === idx ? (
                            <div className="mt-2 flex items-center gap-2">
                              <input
                                type="text"
                                value={editingLabResultText}
                                onChange={(e) => setEditingLabResultText(e.target.value)}
                                placeholder="Enter diagnostic findings (e.g. Hb: 13.8 g/dL, Normal)"
                                className="flex-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-blue-400 type-scale-2xs text-slate-900 dark:text-white focus:outline-hidden"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveLabResult(idx)}
                                className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold type-scale-3xs cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingLabIndex(null)}
                                className="px-2 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 type-scale-3xs cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="mt-1 flex items-start gap-2">
                              <span className="type-scale-2xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                                Findings:
                              </span>
                              <span
                                className={`type-scale-2xs ${
                                  lab.result
                                    ? 'text-slate-800 dark:text-slate-200 font-mono font-medium'
                                    : 'text-amber-600 dark:text-amber-400 italic'
                                }`}
                              >
                                {lab.result || 'Pending analyzer run • Sample logged in specimen queue'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons: Add/Edit findings and Delete Mistake */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                          {editingLabIndex !== idx && (
                            <>
                              {lab.status !== 'Completed' && (
                                <button
                                  type="button"
                                  onClick={() => handleSimulateLabResult(idx)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 type-scale-3xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                                  title="Simulate automated analyzer results"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>Simulate Findings</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingLabIndex(idx);
                                  setEditingLabResultText(lab.result || '');
                                }}
                                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 type-scale-3xs font-semibold transition-colors cursor-pointer"
                                title="Edit or record pathologist findings"
                              >
                                {lab.result ? 'Edit Result' : 'Enter Result'}
                              </button>
                            </>
                          )}

                          {/* Delete mistake lab order */}
                          <button
                            type="button"
                            onClick={() => handleDeleteLab(idx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 transition-colors cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-800/80"
                            title="Delete mistake lab order"
                            aria-label={`Delete ${lab.test} order mistake`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Quick Presets for Lab Investigations */}
                <div className="pt-1">
                  <div className="type-scale-3xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">
                    Quick Clinical Investigation Presets:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'Full Blood Count (FBC)', result: 'Hb: 13.6 g/dL, WBC: 6.2 x10^9/L (Normal)' },
                      { name: 'Serum Electrolytes & Urea', result: 'Na: 140 mmol/L, K: 4.2 mmol/L, Urea: 3.8 mmol/L' },
                      { name: 'Malaria Parasite Smear', result: 'Negative for Plasmodium falciparum' },
                      { name: 'Fasting Blood Glucose', result: '92 mg/dL (Normal ref: 70-99 mg/dL)' },
                      { name: 'Lipid Profile', result: 'Total Chol: 180 mg/dL, HDL: 52 mg/dL, LDL: 104 mg/dL' },
                      { name: 'Urinalysis (Dipstick)', result: 'Protein: Nil, Glucose: Nil, Nitrite: Neg' },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setNewLabTest(preset.name);
                          setNewLabResult(preset.result);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80 hover:bg-purple-100 dark:hover:bg-purple-900/60 type-scale-2xs font-medium cursor-pointer transition-colors"
                      >
                        + {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order Lab Form */}
                <form onSubmit={handleAddLab} className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-7">
                      <input
                        type="text"
                        placeholder="Investigation name (e.g. Serum Calcium, Widal, HbA1c)"
                        value={newLabTest}
                        onChange={(e) => setNewLabTest(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 type-scale-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-purple-500"
                      />
                    </div>
                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        placeholder="Diagnostic result (optional, or leave blank)"
                        value={newLabResult}
                        onChange={(e) => setNewLabResult(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 type-scale-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="type-scale-3xs text-slate-500 dark:text-slate-400">
                      Orders can be dispatched without results and updated or deleted anytime.
                    </p>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold type-scale-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Dispatch Lab Order</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'pharmacy' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  {currentPatient.prescriptions.map((rx, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="type-scale-xs font-bold text-slate-900 dark:text-white">{rx.drug}</div>
                        <div className="type-scale-2xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {rx.dosage} • {rx.frequency}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {rx.status === 'Pending' ? (
                          <button
                            type="button"
                            onClick={() => handleDispenseDrug(idx)}
                            className="px-3.5 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40 hover:bg-amber-200 dark:hover:bg-amber-500/30 type-scale-xs font-bold transition-colors cursor-pointer"
                          >
                            Dispense Now
                          </button>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 type-scale-3xs font-mono font-bold">
                            DISPENSED
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeletePrescription(idx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 transition-colors cursor-pointer"
                          title="Remove mistaken prescription"
                          aria-label={`Remove ${rx.drug}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Prescribe Preset Buttons */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="type-scale-3xs font-bold uppercase text-slate-400 tracking-wider">Try Prescribing:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setNewDrug('Augmentin 625mg');
                      setNewDosage('1 tab BD for 7 days');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 type-scale-2xs font-semibold cursor-pointer hover:bg-rose-100"
                  >
                    Augmentin (Tests Allergy Safety Trigger)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewDrug('Azithromycin 500mg');
                      setNewDosage('1 tab Daily for 3 days');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 type-scale-2xs font-semibold cursor-pointer hover:bg-emerald-100"
                  >
                    Azithromycin (Safe Antibiotic)
                  </button>
                </div>

                {/* E-Prescribe Form */}
                <form onSubmit={handleAddPrescription} className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2">
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      placeholder="Medication (e.g. Paracetamol 500mg)"
                      value={newDrug}
                      onChange={(e) => setNewDrug(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 type-scale-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Dosage (e.g. 2 tabs TDS for 5 days)"
                      value={newDosage}
                      onChange={(e) => setNewDosage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 type-scale-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold type-scale-xs transition-colors cursor-pointer"
                    >
                      Prescribe
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'hmo' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="type-scale-2xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Insurer / HMO Provider</span>
                      <div className="type-scale-sm font-bold text-slate-900 dark:text-white mt-0.5">{currentPatient.hmoProvider}</div>
                    </div>
                    <span className="font-mono type-scale-xs text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                      ID: {currentPatient.hmoPolicyId}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center type-scale-xs">
                    <span className="text-slate-500 dark:text-slate-400">Live Claim Adjudication Status:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{currentPatient.claimStatus}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 type-scale-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                  <p>
                    Direct HMO Adapter connected. When treatments are documented, automated pre-authorization requests and digital claim bundles are synchronized without double entry.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'fhir' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="type-scale-xs font-bold text-slate-800 dark:text-slate-300">
                    HL7 FHIR R4 Standard Interoperability Payload:
                  </div>
                  <button
                    onClick={handleCopyFhir}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 type-scale-xs font-semibold cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900"
                  >
                    {copiedFhir ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Code2 className="w-3.5 h-3.5" />}
                    <span>{copiedFhir ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono type-scale-2xs overflow-x-auto max-h-64 border border-slate-800">
                  {fhirBundleJson}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {isPrintPreviewOpen && (
        <PrintPreviewModal
          isOpen={isPrintPreviewOpen}
          onClose={() => setIsPrintPreviewOpen(false)}
          title={`Clinical Encounter Summary - ${currentPatient.fullName}`}
          subtitle={`MRN: ${currentPatient.hospitalNumber} • Blood: ${currentPatient.bloodGroup} • HMO: ${currentPatient.hmoProvider}`}
          htmlContent={getPatientChartHtml(currentPatient)}
          documentTitle={`MedSphere_Patient_Chart_${currentPatient.hospitalNumber}`}
          onExportPdf={handleExportPdf}
        />
      )}
    </div>
  );
};
