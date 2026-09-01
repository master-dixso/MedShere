import React, { useState } from 'react';
import { DOCUMENTATION_CHAPTERS } from '../data/mockData';
import { copyToClipboard } from '../utils/helpers';
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
} from 'lucide-react';
import Markdown from 'react-markdown';

export const DocsHub: React.FC = () => {
  const [activeChapterId, setActiveChapterId] = useState<string>(DOCUMENTATION_CHAPTERS[0].id);
  const [copied, setCopied] = useState<boolean>(false);

  // Playground interactive state
  const [playgroundVitalsLabel, setPlaygroundVitalsLabel] = useState('Blood Pressure');
  const [playgroundVitalsValue, setPlaygroundVitalsValue] = useState('120/80');
  const [playgroundVitalsUnit, setPlaygroundVitalsUnit] = useState('mmHg');
  const [playgroundVitalsStatus, setPlaygroundVitalsStatus] = useState<'normal' | 'warning' | 'critical'>('normal');

  const currentChapter =
    DOCUMENTATION_CHAPTERS.find((c) => c.id === activeChapterId) || DOCUMENTATION_CHAPTERS[0];

  const handleCopyCode = (code: string) => {
    copyToClipboard(code).then((success) => {
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    });
  };

  return (
    <section id="developer-docs-section" className="py-20 bg-slate-50 dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-200 dark:border-blue-800/60">
            <Code2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Developer Hub & Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Comprehensive Documentation & Component Playground
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Structured Markdown guides, live code snippets, and interactive UI components to expedite onboarding and ensure scalable maintainability.
          </p>
        </div>

        {/* Documentation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Chapter Navigation Sidebar */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0B1120] rounded-3xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              Documentation Chapters
            </div>

            <div className="space-y-1.5 pt-1">
              {DOCUMENTATION_CHAPTERS.map((chap) => {
                const isActive = chap.id === activeChapterId;
                return (
                  <button
                    key={chap.id}
                    onClick={() => setActiveChapterId(chap.id)}
                    className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex flex-col ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/70 border border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider font-bold opacity-60">
                      {chap.category}
                    </span>
                    <span className="text-xs font-bold mt-0.5">{chap.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Live Component Playground Tab Button */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveChapterId('playground')}
                className={`w-full p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between ${
                  activeChapterId === 'playground'
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25'
                    : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  <span className="text-xs font-bold">Interactive Component Sandbox</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/20">
                  LIVE
                </span>
              </button>
            </div>
          </div>

          {/* Chapter Content & Code Viewer */}
          <div className="lg:col-span-8 space-y-6">
            {activeChapterId === 'playground' ? (
              /* Interactive Component Playground */
              <div className="bg-white dark:bg-[#0B1120] rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Live Component Playground: VitalsCard
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    REACT 19 COMPATIBLE
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Test and inspect the design system primitives in real-time. Adjust the properties below to see the rendered UI update instantly.
                </p>

                {/* Controls */}
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

                {/* Live Preview Render */}
                <div className="p-6 rounded-2xl bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[160px]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 mb-3">
                    Rendered Component Output
                  </span>

                  <div className={`p-5 rounded-2xl border max-w-xs w-full transition-all ${
                    playgroundVitalsStatus === 'normal'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300'
                      : playgroundVitalsStatus === 'warning'
                      ? 'border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-300'
                      : 'border-rose-500/30 bg-rose-500/10 text-rose-900 dark:text-rose-300'
                  }`}>
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
              /* Standard Markdown Chapter View */
              <div className="bg-white dark:bg-[#0B1120] rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
                <div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {currentChapter.category}
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {currentChapter.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
                    {currentChapter.summary}
                  </p>
                </div>

                {/* Markdown Body */}
                <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
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
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                    </div>

                    <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed">
                      <code>{currentChapter.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
