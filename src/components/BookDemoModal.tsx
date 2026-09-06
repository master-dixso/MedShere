import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookDemoModal: React.FC<BookDemoModalProps> = ({ isOpen, onClose }) => {
  const [hospitalName, setHospitalName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [staffSize, setStaffSize] = useState('20-50');
  const [currentSystem, setCurrentSystem] = useState('Paper & Excel');
  const [demoDate, setDemoDate] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-walkthrough-title"
    >
      <div className="bg-white dark:bg-[#0B1120] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close walkthrough booking dialog"
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 id="modal-walkthrough-title" className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Schedule Clinical Walkthrough
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  See how MedSphere eliminates chart lag and accelerates HMO claims
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hospital / Practice Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cedarcrest Specialist Hospital"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020617] text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Full Name & Role *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. / Director Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020617] text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@hospital.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020617] text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020617] text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Approximate Staff Seats
                  </label>
                  <select
                    value={staffSize}
                    onChange={(e) => setStaffSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020617] text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1-20">1 - 20 Staff (Essential Tier)</option>
                    <option value="20-35">20 - 35 Staff (Professional Tier)</option>
                    <option value="35-60">35 - 60 Staff (Enterprise Tier)</option>
                    <option value="60+">60+ Staff (Health System Network)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current EMR / Record Keeping Setup
                </label>
                <select
                  value={currentSystem}
                  onChange={(e) => setCurrentSystem(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020617] text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Paper & Excel">Paper Folders & Physical Case Notes</option>
                  <option value="Legacy Server">Legacy In-House Server EMR (MySQL/Access)</option>
                  <option value="OpenMRS">OpenMRS / Open Source Software</option>
                  <option value="Third-Party Cloud">Other Cloud Provider (Looking to switch)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-800 dark:text-blue-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>NDA & Clinical Privacy Guaranteed under NDPA 2023.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Confirm Walkthrough Booking</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Walkthrough Scheduled!
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{contactName}</strong>. A clinical solutions architect has reserved a guided demonstration session for <strong>{hospitalName}</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 text-left space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Next Steps:</span>
              </div>
              <p>1. Calendar invitation with secure video link dispatched to <strong>{email}</strong>.</p>
              <p>2. Pre-demo questionnaire with migration sizing sent to your team.</p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
