import React, { useState } from 'react';
import { SOLUTIONS_LIST } from '../data/mockData';
import {
  Building2,
  Landmark,
  Network,
  HardDriveDownload,
  Layers,
  Smartphone,
  CheckCircle2,
  Quote,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { SolutionItem } from '../types';

interface SolutionsSectionProps {
  onOpenBookDemo: () => void;
  selectedSolutionId?: string;
  onSelectSolution?: (solutionId: string) => void;
}

export const SolutionsSection: React.FC<SolutionsSectionProps> = ({
  onOpenBookDemo,
  selectedSolutionId: propSelectedSolutionId,
  onSelectSolution,
}) => {
  const [internalSelectedSolutionId, setInternalSelectedSolutionId] = useState<string>(
    propSelectedSolutionId || SOLUTIONS_LIST[0].id
  );

  React.useEffect(() => {
    if (propSelectedSolutionId) {
      setInternalSelectedSolutionId(propSelectedSolutionId);
    }
  }, [propSelectedSolutionId]);

  const selectedSolutionId = propSelectedSolutionId || internalSelectedSolutionId;

  const handleSelectSolution = (id: string) => {
    setInternalSelectedSolutionId(id);
    onSelectSolution?.(id);
  };

  const selectedSolution =
    SOLUTIONS_LIST.find((s) => s.id === selectedSolutionId) || SOLUTIONS_LIST[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building':
        return <Building2 className="w-5 h-5" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5" />;
      case 'Network':
        return <Network className="w-5 h-5" />;
      case 'HardDriveDownload':
        return <HardDriveDownload className="w-5 h-5" />;
      case 'Layers':
        return <Layers className="w-5 h-5" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5" />;
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  return (
    <section id="solutions-section" className="py-20 bg-slate-50 dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-200 dark:border-blue-800/60">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Healthcare Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered for Every Tier of Modern Medicine
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            From single outpatient surgeries to multi-facility conglomerates and national insurance networks, MedSphere scales precisely to your clinical operational architecture.
          </p>
        </div>

        {/* Horizontal Solution Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {SOLUTIONS_LIST.map((sol) => {
            const isSelected = sol.id === selectedSolutionId;
            return (
              <button
                key={sol.id}
                onClick={() => handleSelectSolution(sol.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-[#0B1120] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {getIcon(sol.icon)}
                <span>{sol.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Active Solution Showcase Box */}
        <div className="bg-white dark:bg-[#0B1120] rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Solution Breakdown */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
                  Target: {selectedSolution.targetAudience}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {selectedSolution.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedSolution.description}
                </p>
              </div>

              {/* Highlights List */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Architectural Capabilities:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedSolution.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200/70 dark:border-slate-800 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={onOpenBookDemo}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <span>Request Custom Blueprint for {selectedSolution.shortTitle}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right: Verified Case Study Card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/60 dark:from-[#020617] dark:to-blue-950/30 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Quote className="w-5 h-5 text-blue-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Verified Clinical Impact
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    CASE STUDY
                  </span>
                </div>

                {/* Primary Metric Badge */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#0B1120] border border-blue-200 dark:border-blue-800/80 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                    Measurable Operational Outcome
                  </span>
                  <p className="text-base font-extrabold text-blue-600 dark:text-blue-400 leading-snug">
                    {selectedSolution.caseStudy.metric}
                  </p>
                </div>

                <blockquote className="text-xs sm:text-sm italic text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedSolution.caseStudy.quote}
                </blockquote>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {selectedSolution.caseStudy.author}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {selectedSolution.caseStudy.client} • {selectedSolution.caseStudy.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
