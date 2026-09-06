import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { NavRoute } from '../types';
import {
  Activity,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Building2,
  FileText,
  Code2,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Database,
  Smartphone,
  ShieldCheck,
  Zap,
  FlaskConical,
  Pill,
  BarChart3,
  Video,
  HeartHandshake,
  Stethoscope,
  Scan,
  RefreshCw,
  Landmark,
  Network,
  HardDriveDownload,
} from 'lucide-react';

interface NavbarProps {
  currentRoute: NavRoute;
  setCurrentRoute: (route: NavRoute) => void;
  onOpenSandbox: () => void;
  onOpenBookDemo: () => void;
  onSelectModule?: (moduleId: string) => void;
  onSelectCategory?: (category: 'all' | 'core' | 'specialty' | 'operations' | 'infrastructure') => void;
  onSelectSolution?: (solutionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  setCurrentRoute,
  onOpenSandbox,
  onOpenBookDemo,
  onSelectModule,
  onSelectCategory,
  onSelectSolution,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileModulesOpen, setMobileModulesOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [solutionsDropdown, setSolutionsDropdown] = useState(false);
  const [modulesDropdown, setModulesDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const modulesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const solutionsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleModulesMouseEnter = () => {
    if (modulesTimeoutRef.current) clearTimeout(modulesTimeoutRef.current);
    setModulesDropdown(true);
  };

  const handleModulesMouseLeave = () => {
    modulesTimeoutRef.current = setTimeout(() => {
      setModulesDropdown(false);
    }, 150);
  };

  const handleSolutionsMouseEnter = () => {
    if (solutionsTimeoutRef.current) clearTimeout(solutionsTimeoutRef.current);
    setSolutionsDropdown(true);
  };

  const handleSolutionsMouseLeave = () => {
    solutionsTimeoutRef.current = setTimeout(() => {
      setSolutionsDropdown(false);
    }, 150);
  };

  const scrollToSection = (sectionId: string, fallbackRoute: NavRoute) => {
    setMobileMenuOpen(false);
    setSolutionsDropdown(false);
    setModulesDropdown(false);

    if (currentRoute !== 'home' && currentRoute !== fallbackRoute) {
      setCurrentRoute('home');
    }

    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 60);
  };

  const handleNavClick = (route: NavRoute) => {
    setMobileMenuOpen(false);
    setSolutionsDropdown(false);
    setModulesDropdown(false);

    if (route === 'home') {
      setCurrentRoute('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (route === 'solutions') {
      if (currentRoute === 'home') {
        scrollToSection('solutions-section', 'solutions');
      } else {
        setCurrentRoute('solutions');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (route === 'modules') {
      if (currentRoute === 'home') {
        scrollToSection('modules-showcase-section', 'modules');
      } else {
        setCurrentRoute('modules');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (route === 'pricing') {
      if (currentRoute === 'home') {
        scrollToSection('pricing-section', 'pricing');
      } else {
        setCurrentRoute('pricing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (route === 'help') {
      if (currentRoute === 'home') {
        scrollToSection('help-faqs-section', 'help');
      } else {
        setCurrentRoute('help');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setCurrentRoute(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleModuleItemClick = (moduleId: string) => {
    setModulesDropdown(false);
    setMobileMenuOpen(false);
    if (onSelectModule) {
      onSelectModule(moduleId);
    } else {
      scrollToSection('modules-showcase-section', 'modules');
    }
  };

  const handleCategoryItemClick = (category: 'all' | 'core' | 'specialty' | 'operations' | 'infrastructure') => {
    setModulesDropdown(false);
    setMobileMenuOpen(false);
    if (onSelectCategory) {
      onSelectCategory(category);
    } else {
      scrollToSection('modules-showcase-section', 'modules');
    }
  };

  const handleSolutionItemClick = (solutionId: string) => {
    setSolutionsDropdown(false);
    setMobileMenuOpen(false);
    if (onSelectSolution) {
      onSelectSolution(solutionId);
    } else {
      scrollToSection('solutions-section', 'solutions');
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#020617]/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 dark:border-slate-800'
          : 'bg-white dark:bg-[#020617] border-b border-slate-200/60 dark:border-slate-800/80'
      }`}
    >
      {/* Top Banner Alert: Edge Status */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-[#020617] text-white text-xs py-1.5 px-4 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium text-[11px] border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Edge Infrastructure
            </span>
            <span className="hidden sm:inline text-slate-300 font-normal">
              Alpha III MedSphere v3.4 — Sub-50ms Chart Lookups & NDPA 2023 Certified
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <button
              onClick={() => handleNavClick('tests')}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>QA & Test Suite (100% Passed)</span>
            </button>
            <span className="hidden md:inline text-slate-500">•</span>
            <button
              onClick={() => handleNavClick('docs')}
              className="hidden md:flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <Code2 className="w-3 h-3 text-blue-400" />
              <span>Developer Docs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo */}
          <div className="flex items-center shrink-0">
            <button
              id="brand-logo-btn"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Activity className="w-4.5 h-4.5" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-[17px] font-extrabold tracking-tight text-slate-900 dark:text-white">
                    ALPHA III
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 uppercase tracking-wide border border-blue-200 dark:border-blue-800">
                    MedSphere
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  Healthcare Cloud Platform
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 text-xs xl:text-[13px] font-semibold text-slate-600 dark:text-slate-300">
            <button
              id="nav-overview-btn"
              onClick={() => handleNavClick('home')}
              className={`px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'home'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Overview
            </button>

            {/* Solutions Dropdown Menu */}
            <div
              className="relative"
              onMouseEnter={handleSolutionsMouseEnter}
              onMouseLeave={handleSolutionsMouseLeave}
            >
              <button
                id="nav-solutions-btn"
                onClick={() => handleNavClick('solutions')}
                className={`flex items-center gap-1 px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-colors cursor-pointer ${
                  currentRoute === 'solutions'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
                aria-expanded={solutionsDropdown}
                aria-haspopup="true"
              >
                <span>Solutions</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${solutionsDropdown ? 'rotate-180 text-blue-600 dark:text-blue-400' : 'opacity-70'}`} />
              </button>

              {solutionsDropdown && (
                <div
                  className="absolute top-full left-0 w-76 xl:w-80 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={handleSolutionsMouseEnter}
                  onMouseLeave={handleSolutionsMouseLeave}
                >
                  <div className="bg-white dark:bg-[#0B1120] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 space-y-1">
                    <button
                      onClick={() => handleSolutionItemClick('private')}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-start gap-2.5 transition-colors cursor-pointer group"
                    >
                      <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-xs">
                          Private Hospitals & Clinics
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Rapid triage, paperless charts & HMO automation
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSolutionItemClick('public')}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-start gap-2.5 transition-colors cursor-pointer group"
                    >
                      <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                        <Landmark className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-xs">
                          Public & Teaching Hospitals
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          NHIA integration, high-volume queues & rotas
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSolutionItemClick('multi-site')}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-start gap-2.5 transition-colors cursor-pointer group"
                    >
                      <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                        <Network className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-xs">
                          Multi-Site Hospital Groups
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Cross-branch charts & unified group inventory
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSolutionItemClick('legacy-emr')}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-start gap-2.5 transition-colors cursor-pointer group"
                    >
                      <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
                        <HardDriveDownload className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-xs">
                          Legacy EMR Cutover & ETL
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Zero-downtime historical database migration
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSolutionItemClick('insurer')}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-start gap-2.5 transition-colors cursor-pointer group"
                    >
                      <div className="p-1.5 rounded-lg bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 group-hover:bg-pink-600 group-hover:text-white transition-colors shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-xs">
                          Insurer / HMO Networks
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Direct API pre-auth & digital remittances
                        </div>
                      </div>
                    </button>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 px-2 py-1">
                      <button
                        onClick={() => scrollToSection('solutions-section', 'solutions')}
                        className="w-full py-1.5 text-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>View All Solutions & Case Studies</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modules Dropdown Menu with Full Categorized Submenu */}
            <div
              className="relative"
              onMouseEnter={handleModulesMouseEnter}
              onMouseLeave={handleModulesMouseLeave}
            >
              <button
                id="nav-modules-btn"
                onClick={() => handleNavClick('modules')}
                className={`flex items-center gap-1 px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-colors cursor-pointer ${
                  currentRoute === 'modules'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
                aria-expanded={modulesDropdown}
                aria-haspopup="true"
              >
                <span>Modules</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${modulesDropdown ? 'rotate-180 text-blue-600 dark:text-blue-400' : 'opacity-70'}`} />
              </button>

              {modulesDropdown && (
                <div
                  className="absolute top-full -left-16 xl:-left-24 w-[580px] xl:w-[610px] pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={handleModulesMouseEnter}
                  onMouseLeave={handleModulesMouseLeave}
                >
                  <div className="bg-white dark:bg-[#0B1120] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3.5">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          12 Clinical Modules — Click to inspect
                        </span>
                      </div>
                      <button
                        onClick={() => handleCategoryItemClick('all')}
                        className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        View All 12 →
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {/* Column 1: Core Clinical */}
                      <div className="space-y-1">
                        <button
                          onClick={() => handleCategoryItemClick('core')}
                          className="w-full text-left text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                        >
                          <span>Core Clinical</span>
                          <ArrowRight className="w-3 h-3 opacity-60" />
                        </button>

                        <button
                          onClick={() => handleModuleItemClick('emr')}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>EMR & Charting</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 pl-5">
                            SOAP notes, vitals & allergies
                          </div>
                        </button>

                        <button
                          onClick={() => handleModuleItemClick('hms')}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                            <Building2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                            <span>HMS Operations</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 pl-5">
                            Bed matrix & doctor rosters
                          </div>
                        </button>

                        <button
                          onClick={() => handleModuleItemClick('lab')}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                            <FlaskConical className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                            <span>Laboratory (LIS)</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 pl-5">
                            Barcode tracking & sign-off
                          </div>
                        </button>

                        <button
                          onClick={() => handleModuleItemClick('pharmacy')}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                            <Pill className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>Pharmacy Dispense</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 pl-5">
                            FEFO batch & e-prescribe
                          </div>
                        </button>
                      </div>

                      {/* Column 2: Specialty Care */}
                      <div className="space-y-1">
                        <button
                          onClick={() => handleCategoryItemClick('specialty')}
                          className="w-full text-left text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                        >
                          <span>Specialty Care</span>
                          <ArrowRight className="w-3 h-3 opacity-60" />
                        </button>

                        <button
                          onClick={() => handleModuleItemClick('maternity')}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                            <HeartHandshake className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>Maternity & ANC</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 pl-5">
                            WHO partograph & MEOWS
                          </div>
                        </button>

                        <button
                          onClick={() => handleModuleItemClick('theatre')}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                            <Stethoscope className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                            <span>Surgical Theatre</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 pl-5">
                            Safe surgery checklist & logs
                          </div>
                        </button>

                        <button
                          onClick={() => handleModuleItemClick('radiology')}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 group-hover:text-violet-600 dark:group-hover:text-violet-400">
                            <Scan className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                            <span>Radiology & PACS</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 pl-5">
                            DICOM viewer & findings
                          </div>
                        </button>

                        <button
                          onClick={() => handleModuleItemClick('icu')}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 group-hover:text-red-600 dark:group-hover:text-red-400">
                            <Activity className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <span>ICU & Critical Care</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 pl-5">
                            Vital telemetry stream
                          </div>
                        </button>
                      </div>

                      {/* Column 3: Operations & Infrastructure */}
                      <div className="space-y-1">
                        <button
                          onClick={() => handleCategoryItemClick('operations')}
                          className="w-full text-left text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                        >
                          <span>Operations & Billing</span>
                          <ArrowRight className="w-3 h-3 opacity-60" />
                        </button>

                        <button
                          onClick={() => handleModuleItemClick('claims')}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 group-hover:text-pink-600 dark:group-hover:text-pink-400">
                            <ShieldCheck className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                            <span>HMO Claims Engine</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 pl-5">
                            Live pre-auth & batch adjudication
                          </div>
                        </button>

                        <button
                          onClick={() => handleModuleItemClick('telemedicine')}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            <Video className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>Telemedicine</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 pl-5">
                            HD consults & remote vitals
                          </div>
                        </button>

                        <button
                          onClick={() => handleModuleItemClick('analytics')}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            <BarChart3 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span>Clinical KPIs & Intel</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 pl-5">
                            Revenue & mortality returns
                          </div>
                        </button>

                        <button
                          onClick={() => handleModuleItemClick('migration')}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                            <RefreshCw className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>Data Migration (ETL)</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 pl-5">
                            Zero-downtime DB cutover
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Unified FHIR & HL7 Standard Engine
                      </span>
                      <button
                        onClick={() => scrollToSection('modules-showcase-section', 'modules')}
                        className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Full Showcase</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              id="nav-pricing-btn"
              onClick={() => handleNavClick('pricing')}
              className={`px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'pricing'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Pricing
            </button>

            <button
              id="nav-docs-btn"
              onClick={() => handleNavClick('docs')}
              className={`px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'docs'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Docs
            </button>

            <button
              id="nav-tests-btn"
              onClick={() => handleNavClick('tests')}
              className={`px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'tests'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Test Suite
            </button>

            <button
              id="nav-help-btn"
              onClick={() => handleNavClick('help')}
              className={`px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'help'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Help & FAQs
            </button>
          </nav>

          {/* Action Buttons & Theme Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer border border-transparent dark:border-slate-800"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-700" />}
            </button>

            {/* Sandbox Live Experience */}
            <button
              id="header-sandbox-btn"
              onClick={onOpenSandbox}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/80 border border-blue-200/80 dark:border-blue-800/80 transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Live Hospital Demo</span>
            </button>

            {/* Book Demo / Onboard */}
            <button
              id="header-book-demo-btn"
              onClick={onOpenBookDemo}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 xl:px-4 xl:py-2 text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer"
            >
              <span>Book Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer-menu"
          className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] px-4 pt-3 pb-6 space-y-3 max-h-[85vh] overflow-y-auto"
        >
          {/* Main Route Buttons */}
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={() => handleNavClick('home')}
              className={`p-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer ${
                currentRoute === 'home'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => handleNavClick('pricing')}
              className={`p-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer ${
                currentRoute === 'pricing'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Pricing Calculator
            </button>

            <button
              onClick={() => handleNavClick('docs')}
              className={`p-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer ${
                currentRoute === 'docs'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Developer Docs
            </button>

            <button
              onClick={() => handleNavClick('tests')}
              className={`p-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer ${
                currentRoute === 'tests'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Test Suite (QA)
            </button>

            <button
              onClick={() => handleNavClick('help')}
              className={`p-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer ${
                currentRoute === 'help'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              FAQs & Help
            </button>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </div>

          {/* Mobile Accordion: Clinical Modules Submenu */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <button
              onClick={() => setMobileModulesOpen(!mobileModulesOpen)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Clinical Modules (12 Modules)</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileModulesOpen ? 'rotate-180' : ''}`} />
            </button>

            {mobileModulesOpen && (
              <div className="p-2 space-y-2 bg-white dark:bg-[#0B1120] max-h-72 overflow-y-auto">
                {/* Mobile Category Quick Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'core', label: 'Core' },
                    { id: 'specialty', label: 'Specialty' },
                    { id: 'operations', label: 'Billing' },
                    { id: 'infrastructure', label: 'ETL' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryItemClick(cat.id as any)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 shrink-0 cursor-pointer"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  {[
                    { id: 'emr', name: 'EMR & Patient Charting', icon: FileText, desc: 'SOAP notes & vitals' },
                    { id: 'hms', name: 'HMS Hospital Operations', icon: Building2, desc: 'Bed matrix & rosters' },
                    { id: 'lab', name: 'Laboratory LIS', icon: FlaskConical, desc: 'Specimens & sign-off' },
                    { id: 'pharmacy', name: 'Pharmacy & FEFO Dispense', icon: Pill, desc: 'Prescriptions & stock' },
                    { id: 'claims', name: 'HMO Claims & Pre-Auth', icon: ShieldCheck, desc: 'Tariffs & auto adjudication' },
                    { id: 'telemedicine', name: 'Telemedicine HD Consult', icon: Video, desc: 'Video & remote vitals' },
                    { id: 'maternity', name: 'Maternity & ANC Suite', icon: HeartHandshake, desc: 'WHO partograph' },
                    { id: 'theatre', name: 'Surgical Theatre', icon: Stethoscope, desc: 'Safety checklists' },
                    { id: 'radiology', name: 'Radiology & PACS', icon: Scan, desc: 'DICOM imaging' },
                    { id: 'icu', name: 'ICU Critical Care Telemetry', icon: Activity, desc: 'Live vital streams' },
                    { id: 'analytics', name: 'Clinical Analytics & KPI', icon: BarChart3, desc: 'Revenue & throughput' },
                    { id: 'migration', name: 'Legacy EMR Data Migration', icon: RefreshCw, desc: 'Zero downtime cutover' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleModuleItemClick(item.id)}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-blue-500 shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {item.desc}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Accordion: Healthcare Solutions Submenu */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <button
              onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                <span>Healthcare Solutions (5 Tiers)</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileSolutionsOpen ? 'rotate-180' : ''}`} />
            </button>

            {mobileSolutionsOpen && (
              <div className="p-2 space-y-1 bg-white dark:bg-[#0B1120]">
                {[
                  { id: 'private', name: 'Private Hospitals & Clinics', desc: 'Outpatient triage & HMO automation' },
                  { id: 'public', name: 'Public Health Systems', desc: 'NHIA compliance & high volume' },
                  { id: 'multi-site', name: 'Multi-Site Hospital Groups', desc: 'Cross-branch patient records' },
                  { id: 'legacy-emr', name: 'Legacy EMR Data Migration', desc: 'Zero downtime ETL cutover' },
                  { id: 'insurer', name: 'Insurer / HMO Networks', desc: 'Live pre-auth & digital remittances' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSolutionItemClick(item.id)}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {item.desc}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSandbox();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Launch Live Hospital Demo</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookDemo();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>Schedule Walkthrough</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
