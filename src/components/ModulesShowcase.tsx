import React, { useState } from 'react';
import { CLINICAL_MODULES } from '../data/mockData';
import {
  FileText,
  Building2,
  FlaskConical,
  Pill,
  ShieldCheck,
  BarChart3,
  Video,
  HeartHandshake,
  Stethoscope,
  Scan,
  Activity,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { ClinicalModule } from '../types';

interface ModulesShowcaseProps {
  onOpenSandbox: () => void;
  selectedModuleId?: string;
  onSelectModule?: (moduleId: string) => void;
  selectedCategory?: 'all' | 'core' | 'specialty' | 'operations' | 'infrastructure';
  onSelectCategory?: (category: 'all' | 'core' | 'specialty' | 'operations' | 'infrastructure') => void;
}

export const ModulesShowcase: React.FC<ModulesShowcaseProps> = ({
  onOpenSandbox,
  selectedModuleId: propSelectedModuleId,
  onSelectModule,
  selectedCategory: propSelectedCategory,
  onSelectCategory,
}) => {
  const [internalSelectedModuleId, setInternalSelectedModuleId] = useState<string>(
    propSelectedModuleId || CLINICAL_MODULES[0].id
  );
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'core' | 'specialty' | 'operations' | 'infrastructure'>(
    propSelectedCategory || 'all'
  );
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Smooth scroll helper to bring modules section / cards / inspector into clear view
  const scrollToFocus = (moduleId?: string) => {
    setTimeout(() => {
      // 1. Scroll window so the modules showcase section is in prime focus
      const sectionEl = document.getElementById('modules-showcase-section');
      if (sectionEl) {
        const headerOffset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = sectionEl.getBoundingClientRect().top;
        const offsetPosition = elementRect - bodyRect - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }

      // 2. Scroll the specific card into view within the scrollable cards column
      const targetId = moduleId || propSelectedModuleId || internalSelectedModuleId;
      if (targetId) {
        const cardEl = document.getElementById(`module-card-${targetId}`);
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }, 50);
  };

  // Sync internal selected module when prop changes
  React.useEffect(() => {
    if (propSelectedModuleId) {
      setInternalSelectedModuleId(propSelectedModuleId);
      const targetMod = CLINICAL_MODULES.find((m) => m.id === propSelectedModuleId);
      if (targetMod && categoryFilter !== 'all' && targetMod.category !== categoryFilter) {
        setCategoryFilter('all');
      }
      setHighlightedId(propSelectedModuleId);
      const timer = setTimeout(() => setHighlightedId(null), 1200);
      scrollToFocus(propSelectedModuleId);
      return () => clearTimeout(timer);
    }
  }, [propSelectedModuleId]);

  // Sync internal category when prop changes
  React.useEffect(() => {
    if (propSelectedCategory && propSelectedCategory !== categoryFilter) {
      setCategoryFilter(propSelectedCategory);
      if (propSelectedCategory !== 'all') {
        const firstInCat = CLINICAL_MODULES.find((m) => m.category === propSelectedCategory);
        if (firstInCat) {
          setInternalSelectedModuleId(firstInCat.id);
          onSelectModule?.(firstInCat.id);
        }
      }
      scrollToFocus();
    }
  }, [propSelectedCategory]);

  const selectedModuleId = propSelectedModuleId || internalSelectedModuleId;

  const handleSelectModule = (id: string) => {
    setInternalSelectedModuleId(id);
    setHighlightedId(id);
    onSelectModule?.(id);

    const targetMod = CLINICAL_MODULES.find((m) => m.id === id);
    if (targetMod && categoryFilter !== 'all' && targetMod.category !== categoryFilter) {
      setCategoryFilter('all');
    }

    scrollToFocus(id);
    setTimeout(() => setHighlightedId(null), 1200);
  };

  const handleCategoryFilterClick = (catId: 'all' | 'core' | 'specialty' | 'operations' | 'infrastructure') => {
    setCategoryFilter(catId);
    onSelectCategory?.(catId);

    // When clicking a category, automatically highlight the first module in that category
    let targetId = selectedModuleId;
    if (catId !== 'all') {
      const firstInCat = CLINICAL_MODULES.find((m) => m.category === catId);
      if (firstInCat) {
        targetId = firstInCat.id;
        setInternalSelectedModuleId(firstInCat.id);
        onSelectModule?.(firstInCat.id);
      }
    }

    setHighlightedId(targetId);
    scrollToFocus(targetId);
    setTimeout(() => setHighlightedId(null), 1200);
  };

  const filteredModules = CLINICAL_MODULES.filter((mod) =>
    categoryFilter === 'all' ? true : mod.category === categoryFilter
  );

  const activeModule = CLINICAL_MODULES.find((m) => m.id === selectedModuleId) || CLINICAL_MODULES[0];

  const renderModuleIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5' };
    switch (iconName) {
      case 'FileText':
        return <FileText {...props} />;
      case 'Building2':
        return <Building2 {...props} />;
      case 'FlaskConical':
        return <FlaskConical {...props} />;
      case 'Pill':
        return <Pill {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      case 'BarChart3':
        return <BarChart3 {...props} />;
      case 'Video':
        return <Video {...props} />;
      case 'HeartHandshake':
        return <HeartHandshake {...props} />;
      case 'Stethoscope':
        return <Stethoscope {...props} />;
      case 'Scan':
        return <Scan {...props} />;
      case 'Activity':
        return <Activity {...props} />;
      case 'RefreshCw':
        return <RefreshCw {...props} />;
      default:
        return <Activity {...props} />;
    }
  };

  return (
    <section id="modules-showcase-section" className="py-20 bg-white dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-200 dark:border-blue-800/60">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Modular Clinical Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            12 Integrated Modules. One Unified Cloud.
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Every clinical department connects natively without brittle third-party bridges, data duplication, or sync lag.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {[
            { id: 'all', label: 'All 12 Modules' },
            { id: 'core', label: 'Core Clinical' },
            { id: 'specialty', label: 'Specialty Care' },
            { id: 'operations', label: 'Operations & Billing' },
            { id: 'infrastructure', label: 'Data & ETL' },
          ].map((cat) => (
            <button
              key={cat.id}
              id={`category-filter-${cat.id}`}
              onClick={() => handleCategoryFilterClick(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/40'
                  : 'bg-slate-100 dark:bg-[#0B1120] border border-transparent dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Module Grid & Live Interactive Inspector */}
        <div id="modules-interactive-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Module Card Grid */}
          <div
            id="modules-cards-container"
            className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[580px] overflow-y-auto pr-1 scroll-smooth"
          >
            {filteredModules.map((mod) => {
              const isSelected = mod.id === selectedModuleId;
              const isHighlighted = highlightedId === mod.id;
              return (
                <button
                  key={mod.id}
                  id={`module-card-${mod.id}`}
                  onClick={() => handleSelectModule(mod.id)}
                  className={`text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/50 shadow-md ring-2 ring-blue-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] hover:bg-slate-50 dark:hover:bg-slate-850'
                  } ${isHighlighted ? 'scale-[1.02] ring-4 ring-blue-500/40 z-10' : ''}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="p-2.5 rounded-xl text-white shadow-xs"
                        style={{ backgroundColor: mod.color }}
                      >
                        {renderModuleIcon(mod.icon)}
                      </div>
                      {mod.badge ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent dark:border-slate-700">
                          {mod.badge}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400 capitalize">
                          {mod.category === 'infrastructure' ? 'Data & ETL' : mod.category}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {mod.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {mod.tagline}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    <span>{isSelected ? 'Active in Inspector' : 'Inspect Details & Live UI'}</span>
                    <ArrowRight className={`w-3 h-3 transition-transform ${isSelected ? 'translate-x-0.5' : ''}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Active Module Live UI Inspector */}
          <div
            id="active-module-inspector"
            className={`lg:col-span-6 bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6 ring-1 ring-blue-500/10 transition-all duration-300 ${
              highlightedId === activeModule.id ? 'ring-2 ring-blue-500/40 shadow-2xl' : ''
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className="p-2.5 rounded-xl text-white shadow-xs"
                  style={{ backgroundColor: activeModule.color }}
                >
                  {renderModuleIcon(activeModule.icon)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {activeModule.name}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {activeModule.tagline}
                  </span>
                </div>
              </div>

              <button
                onClick={onOpenSandbox}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 hover:bg-blue-100 dark:hover:bg-blue-500/30 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                <span>Test in Live Sandbox</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeModule.description}
            </p>

            {/* Performance Benchmarks */}
            <div className="grid grid-cols-3 gap-2 py-2">
              {activeModule.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center"
                >
                  <span className="text-sm sm:text-base font-extrabold font-mono text-blue-600 dark:text-blue-400 block">
                    {m.value}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Key Capabilities List */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Core Clinical Features:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeModule.keyFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Live UI Terminal Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 space-y-3 font-sans">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {activeModule.mockUiPreview.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {activeModule.mockUiPreview.subtext}
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  REAL-TIME EMIT
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {activeModule.mockUiPreview.badges.map((b, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                  >
                    {b}
                  </span>
                ))}
              </div>

              <div className="space-y-1.5 pt-1">
                {activeModule.mockUiPreview.rows.map((row, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs shadow-2xs"
                  >
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">{row.label}</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold text-right text-[11px]">
                      {row.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
