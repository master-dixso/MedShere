import React, { useState, useEffect, useRef } from 'react';
import {
  Printer,
  Download,
  ExternalLink,
  X,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  FileText,
  Sparkles,
  Info,
} from 'lucide-react';

export interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  htmlContent: string;
  documentTitle?: string;
  onExportPdf?: () => void;
  pdfFilename?: string;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  htmlContent,
  documentTitle = 'MedSphere_Document',
  onExportPdf,
  pdfFilename,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Generate a Blob URL for direct user link access and top-level tab printing
  useEffect(() => {
    if (!htmlContent) return;

    // Ensure the HTML document includes the auto-print script for top-level window execution
    let processedHtml = htmlContent;
    if (!processedHtml.includes('window.print()')) {
      const scriptTag = `
        <script>
          window.addEventListener('load', function() {
            setTimeout(function() {
              try { window.print(); } catch(e) { console.warn('Auto-print error:', e); }
            }, 350);
          });
        </script>
      `;
      processedHtml = processedHtml.replace('</body>', `${scriptTag}</body>`);
    }

    const blob = new Blob([processedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [htmlContent]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDirectPrint = () => {
    let triggered = false;

    // 1. Try hidden iframe printing
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.focus();
        iframeRef.current.contentWindow.print();
        triggered = true;
      } catch (err) {
        console.warn('Iframe print restricted:', err);
      }
    }

    // 2. Try window.open popup with the blob URL (auto-invokes window.print() in top-level context)
    if (!triggered && blobUrl) {
      try {
        const win = window.open(blobUrl, '_blank');
        if (win) {
          triggered = true;
          win.focus();
        }
      } catch (err) {
        console.warn('Popup window.open restricted:', err);
      }
    }

    // 3. Fallback: direct window.print()
    if (!triggered) {
      try {
        window.print();
        triggered = true;
      } catch (err) {
        console.warn('Direct print restricted:', err);
      }
    }

    showToast(
      triggered
        ? '✓ Print dialog requested. If blocked by browser sandbox, click "Open System Print Dialog" button below.'
        : 'Printing initiated. Click "Open System Print Dialog" to bypass sandbox restrictions.'
    );
  };

  const handleDownloadHtml = () => {
    try {
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${documentTitle.replace(/\s+/g, '_')}_Printable.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('✓ Downloaded standalone printable HTML document.');
    } catch (e) {
      console.error('Download error:', e);
      showToast('Unable to download HTML file.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs font-sans animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-modal-title"
    >
      <div className="bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white rounded-3xl max-w-5xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden font-sans">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="print-modal-title" className="font-bold text-base text-slate-900 dark:text-white">
                  {title}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[10px] font-mono border border-blue-200 dark:border-blue-500/30">
                  PRINT STATION
                </span>
              </div>
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              aria-label="Close Print Dialog"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="p-3 sm:px-5 bg-white dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Primary Print Button */}
            <button
              onClick={handleDirectPrint}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              title="Trigger browser print dialog"
            >
              <Printer className="w-4 h-4" />
              <span>Send to Printer</span>
            </button>

            {/* Direct Open in New Window/Tab (100% Bypasses iframe sandbox) */}
            {blobUrl && (
              <a
                href={blobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                title="Opens high-resolution print stream in a top-level tab (bypasses iframe restrictions)"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open System Print Dialog</span>
              </a>
            )}

            {/* Export PDF */}
            {onExportPdf && (
              <button
                onClick={onExportPdf}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                title="Download publication-ready vector PDF"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Save as PDF</span>
              </button>
            )}

            {/* Download Standalone HTML */}
            <button
              onClick={handleDownloadHtml}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              title="Download standalone HTML document file"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Download HTML</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setZoomLevel((z) => Math.max(60, z - 15))}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-300 min-w-[3.5rem] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Zoom In"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="px-2 py-1 text-[10px] font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Reset Zoom"
            >
              100%
            </button>
          </div>
        </div>

        {/* Sandbox Notice Banner */}
        <div className="bg-blue-50/80 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/50 px-4 py-2 flex items-center justify-between text-xs text-blue-900 dark:text-blue-300">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              <strong>Iframe Preview Note:</strong> If your browser blocks modal print popups within preview windows, click{' '}
              <strong className="underline cursor-pointer" onClick={handleDirectPrint}>
                Open System Print Dialog
              </strong>{' '}
              to launch native printing in a clean browser window.
            </span>
          </div>
          <span className="hidden sm:inline text-[11px] text-blue-700 dark:text-blue-400 font-medium">
            A4 Standard • 300 DPI Rendering
          </span>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 animate-in slide-in-from-top">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Print Preview Canvas */}
        <div className="flex-1 bg-slate-200 dark:bg-[#020617] p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-190px)] flex justify-center">
          <div
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              width: '210mm',
              minHeight: '297mm',
            }}
            className="bg-white text-slate-900 shadow-2xl rounded-xs border border-slate-300 transition-transform duration-150 flex flex-col"
          >
            <iframe
              ref={iframeRef}
              srcDoc={htmlContent}
              title={title}
              className="w-full min-h-[297mm] border-0 rounded-xs bg-white"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-[#020617] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>MedSphere Healthcare Cloud Print Engine • NDPA 2023 Audited</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-[10px]">Esc</kbd> to return</span>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
