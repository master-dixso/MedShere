import React from 'react';
import { NavRoute } from '../types';
import {
  Activity,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  Globe,
  ArrowUpRight,
  Heart,
  CheckCircle2,
} from 'lucide-react';

interface FooterProps {
  setCurrentRoute: (route: NavRoute) => void;
  onOpenBookDemo: () => void;
  onOpenSandbox: () => void;
  onSelectModule?: (moduleId: string) => void;
  onSelectCategory?: (category: 'all' | 'core' | 'specialty' | 'operations' | 'infrastructure') => void;
  onSelectSolution?: (solutionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentRoute,
  onOpenBookDemo,
  onOpenSandbox,
  onSelectModule,
  onSelectCategory,
  onSelectSolution,
}) => {
  const handleNav = (route: NavRoute) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModuleClick = (moduleId: string) => {
    if (onSelectModule) {
      onSelectModule(moduleId);
    } else {
      setCurrentRoute('modules');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSolutionClick = (solutionId: string) => {
    if (onSelectSolution) {
      onSelectSolution(solutionId);
    } else {
      setCurrentRoute('solutions');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-100 dark:bg-[#020617] text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                  ALPHA III MEDSPHERE
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-none">
                  Healthcare Cloud & Clinical OS
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              The high-performance electronic health records and hospital operations platform. Engineered for sub-50ms chart lookups, automated HMO pre-authorization, and paperless clinical workflows.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#0B1120] text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-800 font-medium text-[11px] shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                NDPA 2023 Certified
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#0B1120] text-blue-700 dark:text-blue-400 border border-slate-200 dark:border-slate-800 font-medium text-[11px] shadow-xs">
                <Lock className="w-3.5 h-3.5" />
                Admin TOTP MFA
              </span>
            </div>
          </div>

          {/* Col 2: Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Solutions
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleSolutionClick('private')}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Private Hospitals & Clinics
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSolutionClick('public')}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Public & Teaching Hospitals
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSolutionClick('multi-site')}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Multi-Site Hospital Chains
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSolutionClick('legacy-emr')}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Legacy EMR Data Migration
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSolutionClick('insurer')}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Insurer / HMO Networks
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Modules & Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Clinical Suite
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleModuleClick('emr')}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Electronic Medical Records (EMR)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleModuleClick('hms')}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Hospital Operations (HMS)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleModuleClick('lab')}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Laboratory LIS & Pathologist Sign-Off
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleModuleClick('pharmacy')}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Pharmacy & FEFO Dispensing
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleModuleClick('claims')}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  HMO Claims & Pre-Auth
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSandbox}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold cursor-pointer text-left"
                >
                  Interactive Live Sandbox ↗
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Developers & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform & QA
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('pricing')}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Transparent Pricing & Sizing
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('docs')}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Developer Documentation Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('tests')}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Unit & E2E Test Suite (QA)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('help')}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Knowledge Base & FAQs
                </button>
              </li>
              <li>
                <a
                  href="mailto:alphaiiicorporations@gmail.com"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>alphaiiicorporations@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 Alpha III Corporation. MedSphere™ is a registered healthcare technology platform. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
            <span>NDPA 2023 / NDPR Compliant</span>
            <span>•</span>
            <span>Edge Cloud Infrastructure</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              99.99% Systems Normal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
