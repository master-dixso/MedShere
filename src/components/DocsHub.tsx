import React, { useState, useMemo } from 'react';
import { ENHANCED_DOCS_CHAPTERS, EnhancedDocChapter } from '../data/docsData';
import { copyToClipboard } from '../utils/helpers';
import { exportDocumentationPdf, printDocumentationGuide, getDocumentationGuideHtml } from '../utils/exportUtils';
import { PrintPreviewModal } from './PrintPreviewModal';
import {
  Code2,
  BookOpen,
  Copy,
  Check,
  Play,
  Terminal,
  Sparkles,
  Layers,
  Cpu,
  ShieldAlert,
  Sliders,
  Search,
  Menu,
  X,
  ChevronRight,
  Printer,
  Download,
  FileDown,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Users,
  Stethoscope,
  Building2,
  Coins,
  ShieldCheck,
  ListChecks,
  Bookmark,
  Share2,
  HelpCircle,
  FileText,
} from 'lucide-react';
import Markdown from 'react-markdown';

export const DocsHub: React.FC = () => {
  const [activeChapterId, setActiveChapterId] = useState<string>('onboarding-cmo');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Playground interactive state
  const [playgroundVitalsLabel, setPlaygroundVitalsLabel] = useState('Blood Pressure');
  const [playgroundVitalsValue, setPlaygroundVitalsValue] = useState('120/80');
  const [playgroundVitalsUnit, setPlaygroundVitalsUnit] = useState('mmHg');
  const [playgroundVitalsStatus, setPlaygroundVitalsStatus] = useState<'normal' | 'warning' | 'critical'>('normal');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Stakeholder Readiness Checklist State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'infra-internet': true,
    'staff-roster': true,
    'hmo-contracts': false,
    'legacy-data': false,
    'totp-mfa': true,
    'training-sessions': false,
  });

  const checklistMilestones = [
    {
      id: 'infra-internet',
      label: 'Primary & Backup Internet Connectivity',
      detail: 'Hospital premises have dual-ISP or 4G LTE cellular failover configured for zero-downtime routing.',
      category: 'Infrastructure',
    },
    {
      id: 'staff-roster',
      label: 'Institutional Staff Roster & Department Allocation',
      detail: 'Complete list of physicians, nurses, pharmacists, and medical records officers with role permissions.',
      category: 'Clinical Governance',
    },
    {
      id: 'hmo-contracts',
      label: 'HMO Tariff & Fee Schedule Verification',
      detail: 'Agreed procedure caps and copay rules uploaded for Hygeia, Reliance, AXA Mansard, and NHIA.',
      category: 'Finance & Billing',
    },
    {
      id: 'legacy-data',
      label: 'Legacy EMR & Paper Record Extraction',
      detail: 'Historical patient demographics and active chronic condition registries cleaned for ETL ingestion.',
      category: 'Health Informatics',
    },
    {
      id: 'totp-mfa',
      label: 'Mandatory TOTP MFA Enforcement Policy',
      detail: 'Security standard mandated across all medical directors and departmental admin accounts.',
      category: 'Compliance & Security',
    },
    {
      id: 'training-sessions',
      label: 'Simulated Sandbox Departmental Drills',
      detail: 'Nurses, doctors, and pharmacy technicians trained in mock outpatient triage and prescription flows.',
      category: 'Operational Readiness',
    },
  ];

  const toggleChecklistItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const readinessPercent = Math.round((completedCount / checklistMilestones.length) * 100);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter chapters based on search and role filter
  const filteredChapters = useMemo(() => {
    return ENHANCED_DOCS_CHAPTERS.filter((chap) => {
      const matchesRole =
        selectedRoleFilter === 'all' ||
        chap.roleGroup === selectedRoleFilter ||
        chap.roleGroup === 'all';
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        chap.title.toLowerCase().includes(q) ||
        chap.summary.toLowerCase().includes(q) ||
        chap.category.toLowerCase().includes(q) ||
        chap.targetAudience.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [selectedRoleFilter, searchQuery]);

  const currentChapter =
    ENHANCED_DOCS_CHAPTERS.find((c) => c.id === activeChapterId) || ENHANCED_DOCS_CHAPTERS[0];

  // Group chapters by category for structured sidebar tree
  const groupedChapters = useMemo(() => {
    const groups: Record<string, EnhancedDocChapter[]> = {};
    filteredChapters.forEach((chap) => {
      if (!groups[chap.category]) {
        groups[chap.category] = [];
      }
      groups[chap.category].push(chap);
    });
    return groups;
  }, [filteredChapters]);

  // Next / Previous Chapter navigation indices
  const currentChapterIndex = ENHANCED_DOCS_CHAPTERS.findIndex((c) => c.id === activeChapterId);
  const prevChapter = currentChapterIndex > 0 ? ENHANCED_DOCS_CHAPTERS[currentChapterIndex - 1] : null;
  const nextChapter =
    currentChapterIndex < ENHANCED_DOCS_CHAPTERS.length - 1
      ? ENHANCED_DOCS_CHAPTERS[currentChapterIndex + 1]
      : null;

  const handleCopyCode = (code: string) => {
    copyToClipboard(code).then((success) => {
      if (success) {
        setCopiedCode(true);
        showToast('Code copied to clipboard');
        setTimeout(() => setCopiedCode(false), 2000);
      }
    });
  };

  const handleCopyLink = () => {
    copyToClipboard(window.location.href).then((success) => {
      if (success) {
        showToast('Link to documentation chapter copied!');
      }
    });
  };

  const handleExportPdf = () => {
    const res = exportDocumentationPdf(currentChapter);
    if (res.success) {
      showToast(`✓ Downloaded ${currentChapter.shortTitle || currentChapter.title} PDF! (Recommended for offline stakeholder onboarding)`);
    } else {
      showToast('Generating documentation PDF...');
    }
  };

  const handlePrintGuide = () => {
    setIsPrintModalOpen(true);
    printDocumentationGuide(currentChapter);
    showToast(`✓ Opened Print Station for ${currentChapter.shortTitle || currentChapter.title}.`);
  };

  const getRoleIcon = (roleGroup: string) => {
    switch (roleGroup) {
      case 'clinical':
        return <Stethoscope className="w-3.5 h-3.5 text-blue-500" />;
      case 'executive':
        return <Building2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'finance':
        return <Coins className="w-3.5 h-3.5 text-amber-500" />;
      case 'technical':
        return <Cpu className="w-3.5 h-3.5 text-indigo-500" />;
      case 'compliance':
        return <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <BookOpen className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <section
      id="developer-docs-section"
      className="py-12 sm:py-16 bg-slate-50 dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 font-sans scroll-mt-24 sm:scroll-mt-28"
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hub Top Bar & Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-blue-200 dark:border-blue-800/60">
                <Code2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Documentation & Stakeholder Onboarding</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Enterprise Knowledge Hub & Implementation Blueprints
              </h1>
              <p className="mt-1.5 text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-3xl">
                Structured onboarding tracks for hospital executives, clinical directors, HMO partners, and IT architects with interactive sandboxes.
              </p>
            </div>

            {/* Quick Stakeholder Persona Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
              {[
                { id: 'all', label: 'All Guides' },
                { id: 'clinical', label: 'Clinical / CMO' },
                { id: 'executive', label: 'Executive / CEO' },
                { id: 'finance', label: 'HMO / Finance' },
                { id: 'technical', label: 'IT / Engineering' },
                { id: 'compliance', label: 'Legal / DPO' },
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRoleFilter(role.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedRoleFilter === role.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-[#0B1120] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Trigger Bar (Visible only on mobile/tablet) */}
          <div className="lg:hidden mt-4 p-3 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white cursor-pointer"
            >
              <Menu className="w-4 h-4 text-blue-500" />
              <span>Browse Docs Sidebar ({ENHANCED_DOCS_CHAPTERS.length} chapters)</span>
            </button>
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 truncate max-w-[180px]">
              {activeChapterId === 'playground'
                ? 'Component Sandbox'
                : activeChapterId === 'checklist'
                ? 'Readiness Checklist'
                : currentChapter.shortTitle || currentChapter.title}
            </span>
          </div>
        </div>

        {/* Dedicated Documentation Layout (Responsive Sidebar + Main Reading Area) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ========================================================
              RESPONSIVE SIDEBAR NAVIGATION (Desktop Sticky + Mobile Drawer)
             ======================================================== */}
          {/* Mobile Drawer Overlay */}
          {isMobileDrawerOpen && (
            <div
              className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs lg:hidden flex"
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              <div
                className="w-80 max-w-[85vw] h-full bg-white dark:bg-[#0B1120] p-5 flex flex-col shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      Documentation Index
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search Input in Mobile Drawer */}
                <div className="relative mb-4">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search docs & guides..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden"
                  />
                </div>

                {/* Sidebar Navigation Items (Reused) */}
                <div className="space-y-4 flex-1">
                  {Object.entries(groupedChapters).map(([category, chapters]) => (
                    <div key={category} className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
                        {category}
                      </div>
                      {chapters.map((chap) => {
                        const isActive = chap.id === activeChapterId;
                        return (
                          <button
                            key={chap.id}
                            onClick={() => {
                              setActiveChapterId(chap.id);
                              setIsMobileDrawerOpen(false);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between text-xs ${
                              isActive
                                ? 'bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {getRoleIcon(chap.roleGroup)}
                              <span className="truncate">{chap.shortTitle || chap.title}</span>
                            </div>
                            <span className="text-[10px] font-mono opacity-60 shrink-0 ml-1">
                              {chap.readTime}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}

                  {/* Interactive Sandboxes in Drawer */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                      Interactive Tools
                    </div>
                    <button
                      onClick={() => {
                        setActiveChapterId('checklist');
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between text-xs ${
                        activeChapterId === 'checklist'
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ListChecks className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Readiness Checklist</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                        {readinessPercent}%
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveChapterId('playground');
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between text-xs ${
                        activeChapterId === 'playground'
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Play className="w-3.5 h-3.5 text-blue-400" />
                        <span>Vitals Component Sandbox</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20">
                        LIVE
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Persistent Sticky Sidebar */}
          <aside className="hidden lg:block w-80 shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar bg-white dark:bg-[#0B1120] rounded-3xl p-5 shadow-xs border border-slate-200 dark:border-slate-800 space-y-4">
            {/* Search Input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                Documentation Search
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter chapters & topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Categorized Navigation Tree */}
            <div className="space-y-4 pt-1">
              {Object.entries(groupedChapters).map(([category, chapters]) => (
                <div key={category} className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 flex items-center justify-between">
                    <span>{category}</span>
                    <span className="text-[9px] font-mono opacity-60">({chapters.length})</span>
                  </div>
                  {chapters.map((chap) => {
                    const isActive = chap.id === activeChapterId;
                    return (
                      <button
                        key={chap.id}
                        onClick={() => setActiveChapterId(chap.id)}
                        className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between text-xs ${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {getRoleIcon(chap.roleGroup)}
                          <span className="truncate">{chap.shortTitle || chap.title}</span>
                        </div>
                        <span className="text-[10px] font-mono opacity-60 shrink-0 ml-1.5">
                          {chap.readTime}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Interactive Tools Section in Sidebar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Interactive Sandboxes
              </div>

              {/* Stakeholder Readiness Checklist */}
              <button
                onClick={() => setActiveChapterId('checklist')}
                className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between text-xs ${
                  activeChapterId === 'checklist'
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ListChecks className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Readiness Checklist</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">
                  {readinessPercent}%
                </span>
              </button>

              {/* Component Playground */}
              <button
                onClick={() => setActiveChapterId('playground')}
                className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between text-xs ${
                  activeChapterId === 'playground'
                    ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/25'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-blue-400" />
                  <span>Vitals Sandbox</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20">
                  LIVE
                </span>
              </button>
            </div>
          </aside>

          {/* ========================================================
              DEDICATED READER & MAIN CONTENT CONTAINER
             ======================================================== */}
          <main className="flex-1 min-w-0 space-y-6">
            {/* Mode 1: Stakeholder Readiness Checklist Tool */}
            {activeChapterId === 'checklist' ? (
              <div className="bg-white dark:bg-[#0B1120] rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 dark:border-slate-800 space-y-6 font-sans">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <ListChecks className="w-5 h-5 text-emerald-500" />
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                        Stakeholder Implementation & Go-Live Checklist
                      </h2>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Track and verify organizational prerequisites prior to institutional go-live cutover.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {completedCount} of {checklistMilestones.length} Complete
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                        {readinessPercent}% Go-Live Ready
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${readinessPercent}%` }}
                  />
                </div>

                {/* Interactive Checklist Items */}
                <div className="grid grid-cols-1 gap-3">
                  {checklistMilestones.map((item) => {
                    const isChecked = !!checkedItems[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleChecklistItem(item.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          isChecked
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                            : 'bg-white dark:bg-[#020617] border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 transition-colors ${
                            isChecked
                              ? 'bg-emerald-600 text-white'
                              : 'border-2 border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold ${
                                isChecked
                                  ? 'text-emerald-900 dark:text-emerald-200'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {item.label}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Completion Summary Box */}
                {readinessPercent === 100 ? (
                  <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-medium flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Congratulations!</strong> All organizational, technical, and regulatory readiness gates are verified. Your hospital is clear for immediate production cutover.
                    </span>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300 text-xs flex items-center justify-between">
                    <span>
                      Need assistance verifying HMO contracts or extracting legacy records?
                    </span>
                    <button
                      onClick={() => setActiveChapterId('onboarding-it')}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Read Informatics Guide</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : activeChapterId === 'playground' ? (
              /* Mode 2: Interactive Component Sandbox */
              <div className="bg-white dark:bg-[#0B1120] rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 dark:border-slate-800 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      Live Component Playground: VitalsCard Primitives
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    REACT 19 COMPATIBLE
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Inspect and interact with MedSphere's design system primitives in real-time. Adjust properties below to verify responsive rendering, contrast ratios, and state tokens.
                </p>

                {/* Controls Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Label Text
                    </label>
                    <input
                      type="text"
                      value={playgroundVitalsLabel}
                      onChange={(e) => setPlaygroundVitalsLabel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Vitals Value
                    </label>
                    <input
                      type="text"
                      value={playgroundVitalsValue}
                      onChange={(e) => setPlaygroundVitalsValue(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Status Preset
                    </label>
                    <select
                      value={playgroundVitalsStatus}
                      onChange={(e) => setPlaygroundVitalsStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden"
                    >
                      <option value="normal">Normal (Emerald)</option>
                      <option value="warning">Warning (Amber)</option>
                      <option value="critical">Critical (Rose)</option>
                    </select>
                  </div>
                </div>

                {/* Rendered Component Output */}
                <div className="p-8 rounded-2xl bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[180px]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 mb-3 tracking-wider">
                    Rendered Component Output
                  </span>

                  <div
                    className={`p-5 rounded-2xl border max-w-xs w-full transition-all shadow-xs ${
                      playgroundVitalsStatus === 'normal'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300'
                        : playgroundVitalsStatus === 'warning'
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-300'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-900 dark:text-rose-300'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                      {playgroundVitalsLabel}
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold font-mono">{playgroundVitalsValue}</span>
                      <span className="text-xs opacity-70 font-semibold">{playgroundVitalsUnit}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Mode 3: Dedicated Chapter Reader Layout */
              <article className="bg-white dark:bg-[#0B1120] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs border border-slate-200 dark:border-slate-800 space-y-8 font-sans">
                {/* Breadcrumbs & Action Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                    <span>Documentation</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {currentChapter.category}
                    </span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-blue-600 dark:text-blue-400 font-bold truncate max-w-[200px]">
                      {currentChapter.shortTitle || currentChapter.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={handleCopyLink}
                      title="Copy link to chapter"
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Share</span>
                    </button>

                    {/* Export PDF Button */}
                    <button
                      onClick={handleExportPdf}
                      title="Export guide as PDF"
                      className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>

                    {/* Print Button */}
                    <button
                      onClick={handlePrintGuide}
                      title="Print guide"
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                {/* Chapter Title & Stakeholder Audience Banner */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider">
                      {currentChapter.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{currentChapter.readTime}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">• {currentChapter.version}</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                    {currentChapter.title}
                  </h1>

                  <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                    <Users className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Primary Stakeholder Audience
                      </div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {currentChapter.targetAudience}
                      </div>
                    </div>
                  </div>
                </div>

                {/* On This Page Table of Contents */}
                {currentChapter.sections && currentChapter.sections.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      On This Page
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {currentChapter.sections.map((sec, idx) => (
                        <div
                          key={sec.id}
                          className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                        >
                          <span className="text-[10px] font-mono font-bold text-blue-500">
                            0{idx + 1}.
                          </span>
                          <span className="font-semibold">{sec.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Callout Card (If defined) */}
                {currentChapter.callout && (
                  <div
                    className={`p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed ${
                      currentChapter.callout.type === 'clinical'
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                        : currentChapter.callout.type === 'compliance'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : currentChapter.callout.type === 'tip'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold mb-0.5">
                        {currentChapter.callout.title}
                      </strong>
                      <span>{currentChapter.callout.text}</span>
                    </div>
                  </div>
                )}

                {/* Markdown Body with Clean Typography */}
                <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-6">
                  <Markdown>{currentChapter.markdownContent}</Markdown>
                </div>

                {/* Code Snippet Box */}
                {currentChapter.codeSnippet && (
                  <div className="rounded-2xl overflow-hidden bg-[#020617] border border-slate-800 text-slate-100">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-blue-400" />
                        <span className="font-mono text-slate-300 font-semibold">
                          {currentChapter.codeSnippet.filename}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopyCode(currentChapter.codeSnippet!.code)}
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedCode ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                    </div>

                    <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed">
                      <code>{currentChapter.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}

                {/* Pagination: Next & Previous Chapter Navigation */}
                <div className="pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {prevChapter ? (
                    <button
                      onClick={() => setActiveChapterId(prevChapter.id)}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left transition-all cursor-pointer flex items-center gap-3"
                    >
                      <ArrowLeft className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Previous Chapter
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate block mt-0.5">
                          {prevChapter.shortTitle || prevChapter.title}
                        </span>
                      </div>
                    </button>
                  ) : (
                    <div />
                  )}

                  {nextChapter ? (
                    <button
                      onClick={() => setActiveChapterId(nextChapter.id)}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-right transition-all cursor-pointer flex items-center justify-end gap-3"
                    >
                      <div className="truncate">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Next Chapter
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate block mt-0.5">
                          {nextChapter.shortTitle || nextChapter.title}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-blue-500 shrink-0" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveChapterId('checklist')}
                      className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-right transition-all cursor-pointer flex items-center justify-end gap-3"
                    >
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-600 block">
                          Next Step
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block mt-0.5">
                          Stakeholder Readiness Checklist
                        </span>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    </button>
                  )}
                </div>
              </article>
            )}
          </main>
        </div>
      </div>

      {isPrintModalOpen && (
        <PrintPreviewModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          title={`Documentation Guide: ${currentChapter.title}`}
          subtitle={`Category: ${currentChapter.category} • Target: ${currentChapter.targetAudience} • Read Time: ${currentChapter.readTime}`}
          htmlContent={getDocumentationGuideHtml(currentChapter)}
          documentTitle={`MedSphere_Guide_${currentChapter.title.replace(/\s+/g, '_')}`}
          onExportPdf={handleExportPdf}
        />
      )}
    </section>
  );
};
