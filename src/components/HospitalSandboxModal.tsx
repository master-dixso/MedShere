import React, { useState } from 'react';
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
} from 'lucide-react';

interface HospitalSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HospitalSandboxModal: React.FC<HospitalSandboxModalProps> = ({ isOpen, onClose }) => {
  const [patients, setPatients] = useState<PatientRecord[]>(MOCK_PATIENT_RECORDS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(MOCK_PATIENT_RECORDS[0].id);
  const [activeTab, setActiveTab] = useState<'soap' | 'vitals' | 'lab' | 'pharmacy' | 'hmo'>('soap');

  // Form states for interactive actions
  const [newSoapNote, setNewSoapNote] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newLabTest, setNewLabTest] = useState('');
  const [newDrug, setNewDrug] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [hmoChecking, setHmoChecking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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

  const handleAddLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabTest.trim()) return;
    setPatients((prev) =>
      prev.map((p) =>
        p.id === currentPatient.id
          ? {
              ...p,
              labRequests: [
                ...p.labRequests,
                { test: newLabTest.trim(), status: 'Sample Collected' },
              ],
            }
          : p
      )
    );
    setNewLabTest('');
    triggerToast('Laboratory investigation dispatched');
  };

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrug.trim()) return;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden font-sans">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  MedSphere Interactive Clinical Sandbox
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono border border-emerald-200 dark:border-emerald-500/30">
                  LIVE WORKSPACE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Experience real-time chart updates, lab dispatches, and HMO approvals
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
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
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span>Active Patients ({patients.length})</span>
              <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400">TODAY'S CLINIC</span>
            </div>

            <div className="space-y-2">
              {patients.map((pat) => {
                const isSelected = pat.id === currentPatient.id;
                return (
                  <button
                    key={pat.id}
                    onClick={() => setSelectedPatientId(pat.id)}
                    className={`w-full p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 ring-1 ring-blue-500/40 text-blue-900 dark:text-white shadow-xs'
                        : 'bg-white dark:bg-[#0B1120] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{pat.fullName}</span>
                      <span className="text-[10px] font-mono opacity-70">{pat.hospitalNumber}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                      <span>{pat.age} yrs • {pat.gender}</span>
                      <span>•</span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">{pat.hmoProvider}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#020617] text-slate-700 dark:text-slate-300 font-mono">
                        BP: {pat.vitals.bloodPressure}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-medium ${
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
            <div className="p-3 rounded-xl bg-white dark:bg-[#0B1120]/90 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
              <span className="font-semibold text-slate-900 dark:text-slate-200 block">NDPA 2023 Shield</span>
              <p>Audit logging is enabled. All chart mutations are cryptographically tagged.</p>
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
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {currentPatient.fullName}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span className="font-mono">{currentPatient.hospitalNumber}</span>
                    <span>•</span>
                    <span>Blood: {currentPatient.bloodGroup}</span>
                    <span>•</span>
                    <span>Policy: {currentPatient.hmoPolicyId}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleVerifyHMO}
                  disabled={hmoChecking || currentPatient.claimStatus === 'Approved'}
                  className="px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 hover:bg-blue-200 dark:hover:bg-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{hmoChecking ? 'Checking Tariff...' : currentPatient.claimStatus === 'Approved' ? 'HMO Approved' : 'Verify HMO'}</span>
                </button>
              </div>
            </div>

            {/* Quick Vitals Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Blood Pressure</span>
                <div className="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {currentPatient.vitals.bloodPressure} <span className="text-[10px] text-slate-500 dark:text-slate-400">mmHg</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Heart Rate</span>
                <div className="text-base font-extrabold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                  {currentPatient.vitals.pulse} <span className="text-[10px] text-slate-500 dark:text-slate-400">bpm</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Oxygen SpO2</span>
                <div className="text-base font-extrabold font-mono text-teal-600 dark:text-teal-400 mt-0.5">
                  {currentPatient.vitals.spo2}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Body Temp</span>
                <div className="text-base font-extrabold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
                  {currentPatient.vitals.temp}°C
                </div>
              </div>
            </div>

            {/* Action Tabs */}
            <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
              {[
                { id: 'soap', label: 'SOAP Notes & Diagnosis', icon: FileText },
                { id: 'lab', label: `Labs (${currentPatient.labRequests.length})`, icon: FlaskConical },
                { id: 'pharmacy', label: `Pharmacy (${currentPatient.prescriptions.length})`, icon: Pill },
                { id: 'hmo', label: 'HMO Claim Status', icon: ShieldCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            {activeTab === 'soap' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-300">Chief Complaint & History:</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {currentPatient.currentComplaint}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-300">Current Documented Diagnoses:</div>
                  <div className="flex flex-wrap gap-2">
                    {currentPatient.diagnoses.map((diag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-medium"
                      >
                        {diag}
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
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Add Diagnosis
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'lab' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  {currentPatient.labRequests.map((lab, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{lab.test}</div>
                        {lab.result && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{lab.result}</div>
                        )}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        lab.status === 'Completed'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}>
                        {lab.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Lab Form */}
                <form onSubmit={handleAddLab} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Order new investigation (e.g. Serum Calcium, Urinalysis, Widal Test)"
                    value={newLabTest}
                    onChange={(e) => setNewLabTest(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Dispatch Lab Order
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'pharmacy' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  {currentPatient.prescriptions.map((rx, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{rx.drug}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {rx.dosage} • {rx.frequency}
                        </div>
                      </div>

                      {rx.status === 'Pending' ? (
                        <button
                          onClick={() => handleDispenseDrug(idx)}
                          className="px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40 hover:bg-amber-200 dark:hover:bg-amber-500/30 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Dispense Now
                        </button>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-mono font-bold">
                          DISPENSED
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* E-Prescribe Form */}
                <form onSubmit={handleAddPrescription} className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2">
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      placeholder="Medication (e.g. Paracetamol 500mg)"
                      value={newDrug}
                      onChange={(e) => setNewDrug(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Dosage (e.g. 2 tabs TDS for 5 days)"
                      value={newDosage}
                      onChange={(e) => setNewDosage(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors cursor-pointer"
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
                      <span className="text-xs text-slate-500 dark:text-slate-400">Insurer / HMO Provider</span>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{currentPatient.hmoProvider}</div>
                    </div>
                    <span className="font-mono text-xs text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 px-2 py-1 rounded">
                      ID: {currentPatient.hmoPolicyId}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Live Claim Adjudication Status:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{currentPatient.claimStatus}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-800 dark:text-blue-300">
                  <p>
                    Direct HMO Adapter connected. When treatments are documented, automated pre-authorization requests and digital claim bundles are synchronized without double entry.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
