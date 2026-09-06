import React, { useState } from 'react';
import {
  Check,
  X,
  Minus,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  ArrowRight,
  HelpCircle,
  Layers,
  Scale,
} from 'lucide-react';

interface CompetitiveMatrixProps {
  onOpenBookDemo: () => void;
  onOpenSandbox: () => void;
}

interface ComparisonDimension {
  id: string;
  category: 'Performance & Speed' | 'Billing & HMO' | 'Deployment & Migration' | 'Data & Sovereignty';
  feature: string;
  explanation: string;
  medsphere: {
    value: string;
    status: 'win' | 'partial' | 'loss';
    detail: string;
  };
  legacyOnPrem: {
    value: string;
    status: 'win' | 'partial' | 'loss';
    detail: string;
  };
  globalGiants: {
    value: string;
    status: 'win' | 'partial' | 'loss';
    detail: string;
  };
  paperExcel: {
    value: string;
    status: 'win' | 'partial' | 'loss';
    detail: string;
  };
}

export const CompetitiveMatrix: React.FC<CompetitiveMatrixProps> = ({
  onOpenBookDemo,
  onOpenSandbox,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const dimensions: ComparisonDimension[] = [
    {
      id: 'chart-latency',
      category: 'Performance & Speed',
      feature: 'Patient Chart & History Retrieval Speed',
      explanation: 'Time taken to open comprehensive longitudinal patient records during high-volume OPD clinics.',
      medsphere: {
        value: '< 45ms (Sub-50ms)',
        status: 'win',
        detail: 'Distributed edge caching with pre-fetched ICD-11 coding.',
      },
      legacyOnPrem: {
        value: '3.5s - 12s',
        status: 'loss',
        detail: 'Bottlenecked by old in-house spinning disk servers.',
      },
      globalGiants: {
        value: '1.2s - 2.8s',
        status: 'partial',
        detail: 'Heavy multi-tier overseas cloud architecture.',
      },
      paperExcel: {
        value: '15 - 45 Mins',
        status: 'loss',
        detail: 'Manual retrieval from paper records file room.',
      },
    },
    {
      id: 'hmo-claims',
      category: 'Billing & HMO',
      feature: 'Direct Local HMO & NHIA Claims API',
      explanation: 'Automated real-time policy verification, pre-authorization codes, and digital electronic batch submission.',
      medsphere: {
        value: '45+ Live Direct Adapters',
        status: 'win',
        detail: 'Integrated with Hygeia, Reliance, AXA, Leadway, and NHIA.',
      },
      legacyOnPrem: {
        value: 'Zero Direct APIs',
        status: 'loss',
        detail: 'Requires double manual typing on external insurer portals.',
      },
      globalGiants: {
        value: 'Requires Custom Coding',
        status: 'loss',
        detail: 'Rigid US-centric billing requiring millions in custom bridge software.',
      },
      paperExcel: {
        value: '100% Manual Forms',
        status: 'loss',
        detail: 'Physical paper claim forms; 22%+ dispute rate.',
      },
    },
    {
      id: 'offline-edge',
      category: 'Performance & Speed',
      feature: 'Network Downtime & Offline Resilience',
      explanation: 'Ability for clinical encounters, vitals, and dispensing to continue uninterrupted during internet outages.',
      medsphere: {
        value: 'Hybrid Edge Node Sync',
        status: 'win',
        detail: 'Local edge caching buffers offline encounters and auto-syncs upon reconnect.',
      },
      legacyOnPrem: {
        value: 'LAN Only / No Remote',
        status: 'partial',
        detail: 'Works within physical clinic only; zero secure remote doctor access.',
      },
      globalGiants: {
        value: 'Strict Online Dependency',
        status: 'loss',
        detail: 'Clinical charting freezes completely during upstream fiber cuts.',
      },
      paperExcel: {
        value: 'Offline but Unsynced',
        status: 'loss',
        detail: 'Creates disjointed paper notes that require retrospective scanning.',
      },
    },
    {
      id: 'migration-timeline',
      category: 'Deployment & Migration',
      feature: 'Turnkey Historical Data Migration & Cutover',
      explanation: 'Speed and accuracy of extracting, sanitizing, and migrating 10+ years of legacy patient records into the new system.',
      medsphere: {
        value: '< 48-Hour Weekend Cutover',
        status: 'win',
        detail: 'Turnkey ETL scripts for legacy SQL, Access, and OpenMRS databases.',
      },
      legacyOnPrem: {
        value: 'Manual Database Locks',
        status: 'loss',
        detail: 'Fragile SQL exports prone to record corruption.',
      },
      globalGiants: {
        value: '9 to 18 Months',
        status: 'loss',
        detail: 'Massive enterprise consultant overhead and expensive change management.',
      },
      paperExcel: {
        value: 'Indefinite Backlog',
        status: 'loss',
        detail: 'Requires typing thousands of historical cards by hand.',
      },
    },
    {
      id: 'data-compliance',
      category: 'Data & Sovereignty',
      feature: 'NDPA 2023 & In-Country Data Sovereignty',
      explanation: 'Strict adherence to Nigeria Data Protection Act, role-based access audits, and localized data governance.',
      medsphere: {
        value: '100% NDPA & NDPR Compliant',
        status: 'win',
        detail: 'AES-256 vault, TOTP MFA, cryptographic audit ledger, and DPO tools.',
      },
      legacyOnPrem: {
        value: 'Unencrypted Local Storage',
        status: 'loss',
        detail: 'Cleartext local hard drives vulnerable to theft and ransomware.',
      },
      globalGiants: {
        value: 'Foreign Cloud Sovereignty',
        status: 'partial',
        detail: 'Data stored abroad, complicating national health data privacy laws.',
      },
      paperExcel: {
        value: 'Zero Audit Trail',
        status: 'loss',
        detail: 'No record of who viewed, copied, or modified patient files.',
      },
    },
    {
      id: 'pricing-model',
      category: 'Billing & HMO',
      feature: 'Pricing Transparency & Per-Patient Cost',
      explanation: 'Predictable cost structure with zero surprise charges for high patient registrations or mobile app access.',
      medsphere: {
        value: 'Zero Per-Patient Charges',
        status: 'win',
        detail: 'Transparent Naira SaaS plans strictly based on active clinician seats.',
      },
      legacyOnPrem: {
        value: 'High Server Maintenance Fees',
        status: 'partial',
        detail: 'Unexpected hardware breakdowns, UPS batteries, and IT contractor retainers.',
      },
      globalGiants: {
        value: '₦250M - ₦800M+ Multi-Year',
        status: 'loss',
        detail: 'Exorbitant foreign currency licensing and mandatory recurring consultant fees.',
      },
      paperExcel: {
        value: 'Hidden Paper Waste & Loss',
        status: 'loss',
        detail: '₦12M+/year in stationery, storage space, and unrecoverable rejected claims.',
      },
    },
  ];

  const filteredDimensions = dimensions.filter((d) =>
    activeCategory === 'all' ? true : d.category === activeCategory
  );

  const renderStatusBadge = (status: 'win' | 'partial' | 'loss', value: string, detail: string, isMedSphere: boolean = false) => {
    if (isMedSphere) {
      return (
        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/80 shadow-xs">
          <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-bold text-xs">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{value}</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-tight">
            {detail}
          </p>
        </div>
      );
    }

    if (status === 'loss') {
      return (
        <div className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
          <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-semibold text-xs">
            <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>{value}</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
            {detail}
          </p>
        </div>
      );
    }

    return (
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold text-xs">
          <Minus className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>{value}</span>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
          {detail}
        </p>
      </div>
    );
  };

  return (
    <section id="competitive-matrix-section" className="py-20 bg-white dark:bg-[#070E20] border-b border-slate-200 dark:border-slate-800 scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-200 dark:border-blue-800/60">
            <Scale className="w-3.5 h-3.5 text-blue-500" />
            <span>Market Positioning & Competitive Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Modern Healthcare Systems Choose MedSphere
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            See how Alpha III MedSphere outperforms legacy on-premise servers, expensive overseas enterprise suites, and fragmented manual record systems across every clinical dimension.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap mt-7">
            {[
              { id: 'all', label: 'All Dimensions' },
              { id: 'Performance & Speed', label: 'Speed & Edge' },
              { id: 'Billing & HMO', label: 'HMO & Billing' },
              { id: 'Deployment & Migration', label: 'ETL & Cutover' },
              { id: 'Data & Sovereignty', label: 'Security & NDPA' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Table / Bento Matrix */}
        <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-[#0B1120]">
          <table className="w-full text-left border-collapse min-w-[860px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-[#020617]/90 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="p-4 sm:p-5 w-1/4">Evaluation Criteria</th>
                <th className="p-4 sm:p-5 w-1/4 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-x border-blue-200/60 dark:border-blue-800/60">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span>Alpha III MedSphere</span>
                  </div>
                </th>
                <th className="p-4 sm:p-5 w-1/6">Legacy On-Prem EMR</th>
                <th className="p-4 sm:p-5 w-1/6">Overseas Suites (Epic/Cerner)</th>
                <th className="p-4 sm:p-5 w-1/6">Paper & Spreadsheets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {filteredDimensions.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  {/* Criteria Column */}
                  <td className="p-4 sm:p-5 align-top">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                      {row.category}
                    </span>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                      {row.feature}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {row.explanation}
                    </p>
                  </td>

                  {/* MedSphere Column */}
                  <td className="p-4 sm:p-5 align-top bg-blue-50/30 dark:bg-blue-950/20 border-x border-blue-100 dark:border-blue-900/40">
                    {renderStatusBadge(
                      row.medsphere.status,
                      row.medsphere.value,
                      row.medsphere.detail,
                      true
                    )}
                  </td>

                  {/* Legacy On-Prem Column */}
                  <td className="p-4 sm:p-5 align-top">
                    {renderStatusBadge(
                      row.legacyOnPrem.status,
                      row.legacyOnPrem.value,
                      row.legacyOnPrem.detail
                    )}
                  </td>

                  {/* Global Giants Column */}
                  <td className="p-4 sm:p-5 align-top">
                    {renderStatusBadge(
                      row.globalGiants.status,
                      row.globalGiants.value,
                      row.globalGiants.detail
                    )}
                  </td>

                  {/* Paper/Excel Column */}
                  <td className="p-4 sm:p-5 align-top">
                    {renderStatusBadge(
                      row.paperExcel.status,
                      row.paperExcel.value,
                      row.paperExcel.detail
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Call to Action Ribbon */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-white">
              Ready to Upgrade Your Hospital to the Speed of Modern Cloud?
            </h4>
            <p className="text-xs text-blue-200">
              Schedule a tailored demonstration with our health informatics engineers or test live charting in our sandbox.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenBookDemo}
              className="px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-blue-50 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Book Guided Walkthrough</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenSandbox}
              className="px-4 py-3 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white font-bold text-xs border border-blue-400/30 transition-all cursor-pointer"
            >
              <span>Launch Demo</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
