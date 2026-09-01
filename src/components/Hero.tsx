import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  Sparkles,
  Users,
  Building2,
  TrendingUp,
  Cpu,
  Clock,
  ChevronRight,
  FileCheck,
} from 'lucide-react';
import { NavRoute } from '../types';

interface HeroProps {
  onOpenSandbox: () => void;
  onOpenBookDemo: () => void;
  onNavigate: (route: NavRoute) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenSandbox,
  onOpenBookDemo,
  onNavigate,
}) => {
  const [activePersona, setActivePersona] = useState<'doctor' | 'finance' | 'admin' | 'it'>('doctor');

  const personas = {
    doctor: {
      role: 'Chief Medical Officer & Doctors',
      icon: Users,
      badge: 'Zero Chart Lag',
      stat: '< 45ms',
      statLabel: 'Patient Chart Lookup',
      benefit: 'Paperless SOAP encounters, automated drug allergy warnings, and instant ICD-11 diagnosis search.',
      quote: '“My doctors complete ward rounds 40 minutes faster with real-time mobile charts.”',
    },
    finance: {
      role: 'Hospital CFO & Finance',
      icon: TrendingUp,
      badge: 'Revenue Accelerator',
      stat: '₦18.4M+',
      statLabel: 'Recovered HMO Claims',
      benefit: 'Eliminate rejected HMO claims with live tariff validation, automated pre-authorization, and fast reconciliation.',
      quote: '“Our claim dispute rate dropped from 22% to under 2% in our very first billing cycle.”',
    },
    admin: {
      role: 'Hospital Directors & Ops',
      icon: Building2,
      badge: 'Operational Control',
      stat: '62%',
      statLabel: 'Faster Patient Triage',
      benefit: 'Real-time ward occupancy matrix, automated nursing rosters, and seamless department handoffs.',
      quote: '“Full visibility across OPD, emergency, maternity, and lab queues from a single dashboard.”',
    },
    it: {
      role: 'Health IT & Security Leads',
      icon: Cpu,
      badge: 'Edge-First & NDPA 2023',
      stat: '99.99%',
      statLabel: 'Verified Uptime SLA',
      benefit: 'Mandatory TOTP MFA, end-to-end AES-256 encryption, immutable audit logs, and self-serve ETL data migration.',
      quote: '“Zero downtime cutover. Migrated 45,000 legacy records into MedSphere without losing a byte.”',
    },
  };

  const currentPersona = personas[activePersona];

  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#020617] dark:via-[#070E20] dark:to-[#020617] border-b border-slate-200/70 dark:border-slate-800/80">
      {/* Subtle Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f60d_1px,transparent_1px),linear-gradient(to_bottom,#3b82f60d_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/90 dark:border-blue-800/80 text-blue-800 dark:text-blue-300 text-xs font-semibold shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Next-Gen Hospital Operating System & EHR</span>
              <span className="text-slate-400 dark:text-slate-600">|</span>
              <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400">NDPA 2023 Ready</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Healthcare at the{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-clip-text text-transparent">
                Speed of Modern Cloud.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Alpha III MedSphere unifies Electronic Medical Records (EMR), automated HMO claims, 
              diagnostic lab queues, and pharmacy workflows into a high-performance clinical engine 
              designed for zero downtime and instant doctor charting.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-book-demo-cta"
                onClick={onOpenBookDemo}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all cursor-pointer"
              >
                <span>Book Guided Walkthrough</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-sandbox-cta"
                onClick={onOpenSandbox}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-white dark:bg-[#0B1120] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-sm transition-all cursor-pointer ring-1 ring-transparent hover:ring-blue-500/30"
              >
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Launch Interactive Demo</span>
              </button>

              <button
                id="hero-pricing-cta"
                onClick={() => onNavigate('pricing')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl font-semibold text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                <span>View Transparent Pricing</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-slate-200/60 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">NDPA 2023 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">&lt; 45ms Edge Speed</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Admin TOTP MFA</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">45+ HMO Adapters</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Role-Based Value Terminal */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[#0B1120] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative ring-1 ring-black/5 dark:ring-blue-500/10">
              {/* Terminal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="ml-2 text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                    medsphere-cloud-v3.4
                  </span>
                </div>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  HEALTH ENGINE ACTIVE
                </span>
              </div>

              {/* Persona Tabs */}
              <div className="pt-4 pb-2">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Explore tailored benefits for your team:
                </p>
                <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/40 dark:border-slate-800">
                  {(['doctor', 'finance', 'admin', 'it'] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => setActivePersona(key)}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                        activePersona === key
                          ? 'bg-white dark:bg-[#0B1120] text-blue-600 dark:text-blue-400 shadow-xs border border-transparent dark:border-blue-800/40'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Persona Content Card */}
              <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-[#020617] dark:to-blue-950/30 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      <currentPersona.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {currentPersona.role}
                      </h4>
                      <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                        {currentPersona.badge}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                      {currentPersona.stat}
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                      {currentPersona.statLabel}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentPersona.benefit}
                </p>

                <div className="p-3 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200/60 dark:border-slate-800/80 text-xs italic text-slate-600 dark:text-slate-300">
                  {currentPersona.quote}
                </div>
              </div>

              {/* Interactive Quick Try CTA */}
              <div className="mt-5 pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>3-Minute Live Interactive Sandbox</span>
                </div>
                <button
                  onClick={onOpenSandbox}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>Test Live Charting</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
