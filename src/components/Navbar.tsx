import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';

interface NavbarProps {
  currentRoute: NavRoute;
  setCurrentRoute: (route: NavRoute) => void;
  onOpenSandbox: () => void;
  onOpenBookDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  setCurrentRoute,
  onOpenSandbox,
  onOpenBookDemo,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsDropdown, setSolutionsDropdown] = useState(false);
  const [modulesDropdown, setModulesDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (route: NavRoute) => {
    setCurrentRoute(route);
    setMobileMenuOpen(false);
    setSolutionsDropdown(false);
    setModulesDropdown(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-btn"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                    ALPHA III
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 uppercase tracking-wide border border-blue-200 dark:border-blue-800">
                    MedSphere
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                  Healthcare Cloud Platform
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            <button
              id="nav-home-btn"
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'home'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold border border-transparent dark:border-blue-800/40'
                  : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Overview
            </button>

            {/* Solutions Dropdown Menu */}
            <div
              className="relative"
              onMouseEnter={() => setSolutionsDropdown(true)}
              onMouseLeave={() => setSolutionsDropdown(false)}
            >
              <button
                id="nav-solutions-btn"
                onClick={() => handleNavClick('solutions')}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentRoute === 'solutions'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold border border-transparent dark:border-blue-800/40'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>Solutions</span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </button>

              {solutionsDropdown && (
                <div className="absolute top-full left-0 w-80 pt-2 z-50">
                  <div className="bg-white dark:bg-[#0B1120] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 space-y-1">
                    <button
                      onClick={() => handleNavClick('solutions')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-start gap-3 transition-colors cursor-pointer"
                    >
                      <Building2 className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
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
                      onClick={() => handleNavClick('solutions')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-start gap-3 transition-colors cursor-pointer"
                    >
                      <Layers className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-xs">
                          Multi-Site Hospital Groups
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Cross-facility records & unified group inventory
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavClick('solutions')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-start gap-3 transition-colors cursor-pointer"
                    >
                      <Database className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
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
                      onClick={() => handleNavClick('solutions')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-start gap-3 transition-colors cursor-pointer"
                    >
                      <Smartphone className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-xs">
                          Patient Mobile Companion
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Lab results, appointment sync & dosage alerts
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modules Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setModulesDropdown(true)}
              onMouseLeave={() => setModulesDropdown(false)}
            >
              <button
                id="nav-modules-btn"
                onClick={() => handleNavClick('modules')}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentRoute === 'modules'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold border border-transparent dark:border-blue-800/40'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>Modules</span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </button>

              {modulesDropdown && (
                <div className="absolute top-full left-0 w-96 pt-2 z-50">
                  <div className="bg-white dark:bg-[#0B1120] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleNavClick('modules')}
                      className="text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                    >
                      <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-500" />
                        <span>EMR & Charting</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        SOAP notes, vitals & allergies
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavClick('modules')}
                      className="text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                    >
                      <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-teal-500" />
                        <span>HMS Operations</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Bed matrix & staff rosters
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavClick('modules')}
                      className="text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                    >
                      <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-pink-500" />
                        <span>HMO Claims</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Pre-auth & auto batching
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavClick('modules')}
                      className="text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                    >
                      <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Pharmacy Dispensing</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        FEFO stock & e-prescribe
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              id="nav-pricing-btn"
              onClick={() => handleNavClick('pricing')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'pricing'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold border border-transparent dark:border-blue-800/40'
                  : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Pricing
            </button>

            <button
              id="nav-docs-btn"
              onClick={() => handleNavClick('docs')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'docs'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold border border-transparent dark:border-blue-800/40'
                  : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Docs & Playground
            </button>

            <button
              id="nav-tests-btn"
              onClick={() => handleNavClick('tests')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'tests'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold border border-transparent dark:border-blue-800/40'
                  : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Test Suite
            </button>

            <button
              id="nav-help-btn"
              onClick={() => handleNavClick('help')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'help'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold border border-transparent dark:border-blue-800/40'
                  : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              FAQs & Help
            </button>
          </nav>

          {/* Action Buttons & Theme Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer border border-transparent dark:border-slate-800"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Sandbox Live Experience */}
            <button
              id="header-sandbox-btn"
              onClick={onOpenSandbox}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/80 border border-blue-200/80 dark:border-blue-800/80 transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Live Hospital Demo</span>
            </button>

            {/* Book Demo / Onboard */}
            <button
              id="header-book-demo-btn"
              onClick={onOpenBookDemo}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer"
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
          className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] px-4 pt-3 pb-6 space-y-2 max-h-[80vh] overflow-y-auto"
        >
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
              onClick={() => handleNavClick('solutions')}
              className={`p-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer ${
                currentRoute === 'solutions'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Solutions
            </button>
            <button
              onClick={() => handleNavClick('modules')}
              className={`p-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer ${
                currentRoute === 'modules'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Clinical Modules
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
              FAQs & Guides
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

          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSandbox();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Launch Live Hospital Demo</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookDemo();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-blue-600 text-white flex items-center justify-center gap-2 shadow cursor-pointer"
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
