import React, { useState } from 'react';
import { FAQS_DATA } from '../data/mockData';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { FAQItem } from '../types';

interface HelpCenterProps {
  onOpenLiveChat: () => void;
  onOpenBookDemo: () => void;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({
  onOpenLiveChat,
  onOpenBookDemo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'deployment' | 'billing' | 'compliance' | 'security'>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(FAQS_DATA[0].id);

  const filteredFaqs = FAQS_DATA.filter((faq) => {
    const matchesCategory = categoryFilter === 'all' ? true : faq.category === categoryFilter;
    const matchesQuery =
      searchQuery.trim() === '' ||
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const toggleFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="help-faqs-section" className="py-20 bg-slate-50 dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 font-sans scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-200 dark:border-blue-800/60">
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
            <span>Support & Knowledge Center</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Answered Questions & Technical Guides
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Find immediate answers regarding hospital deployment speed, legacy database migration, HMO claim workflows, and NDPA compliance.
          </p>

          {/* Instant Search Bar */}
          <div className="mt-8 relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by keyword (e.g. 'Paystack', 'MFA', 'ETL', 'Claims', 'HMO')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white shadow-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap mt-5">
            {[
              { id: 'all', label: 'All Topics' },
              { id: 'deployment', label: 'Deployment & Setup' },
              { id: 'billing', label: 'Billing & Plans' },
              { id: 'compliance', label: 'NDPA Compliance' },
              { id: 'security', label: 'Security & MFA' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-[#0B1120] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-4xl mx-auto space-y-3 mb-14">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#0B1120] rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
              No matching questions found for "{searchQuery}". Try asking our 24/7 AI Assistant.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-[#0B1120] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {faq.q}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-blue-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Escalation Support Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-[#020617] text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden border border-slate-800 ring-1 ring-blue-500/20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Have a Complex Hospital Sizing or Migration Requirement?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Our healthcare deployment specialists and data engineers are on standby to evaluate your clinical workflows, legacy database structure, and multi-branch network needs.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-2.5">
              <button
                onClick={onOpenLiveChat}
                className="w-full py-3 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Chat with 24/7 AI Assistant</span>
              </button>
              <button
                onClick={onOpenBookDemo}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 cursor-pointer"
              >
                <span>Schedule Executive Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
