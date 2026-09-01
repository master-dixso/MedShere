import React, { useState } from 'react';
import { PRICING_PLANS } from '../data/mockData';
import { formatNaira, calculatePricingEstimate } from '../utils/helpers';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PricingCalculatorProps {
  onOpenBookDemo: () => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({ onOpenBookDemo }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlanId, setSelectedPlanId] = useState<'essential' | 'professional' | 'enterprise' | 'custom'>('professional');
  const [additionalBranches, setAdditionalBranches] = useState<number>(0);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'confirm' | 'success'>('details');
  const [hospitalName, setHospitalName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [generatedTenantCode, setGeneratedTenantCode] = useState('');

  const pricing = calculatePricingEstimate(
    selectedPlanId,
    billingCycle,
    additionalBranches,
    selectedAddOns
  );

  const activePlan = PRICING_PLANS.find((p) => p.id === selectedPlanId) || PRICING_PLANS[1];

  const handleStartCheckout = (planId: typeof selectedPlanId) => {
    setSelectedPlanId(planId);
    setCheckoutStep('details');
    setShowCheckoutModal(true);
  };

  const handleCompleteSimulatedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalName || !adminEmail) return;

    const tenantCode = `HOSP-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedTenantCode(tenantCode);
    setCheckoutStep('success');

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignored
    }
  };

  return (
    <section id="pricing-section" className="py-20 bg-slate-50 dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-emerald-200 dark:border-emerald-800/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Predictable Healthcare SaaS Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Transparent Pricing. Zero Per-Patient Charges.
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Every plan includes our full clinical suite with unlimited patient charts, visits, and companion mobile users. You only pay for active staff logins.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-slate-200/80 dark:bg-[#0B1120] border border-slate-300/60 dark:border-slate-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                billingCycle === 'annual'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-900 text-[10px] font-extrabold uppercase">
                Save 17% (2 Mo Free)
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PRICING_PLANS.map((plan) => {
            const isPopular = plan.popular;
            const isSelected = plan.id === selectedPlanId;
            const cost = billingCycle === 'annual' ? Math.round(plan.annualNaira / 12) : plan.monthlyNaira;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                  isPopular
                    ? 'bg-white dark:bg-[#0B1120] border-2 border-blue-500 shadow-xl shadow-blue-500/10 ring-4 ring-blue-500/10'
                    : 'bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">
                    {plan.tagline}
                  </p>

                  <div className="mt-5 pb-5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white">
                        {formatNaira(cost)}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        / month
                      </span>
                    </div>
                    {billingCycle === 'annual' && (
                      <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                        Billed {formatNaira(plan.annualNaira)} annually
                      </p>
                    )}

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>Capacity: Up to {plan.clinicianLimit} staff seats</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="mt-5 space-y-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Included in Plan:
                    </span>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleStartCheckout(plan.id)}
                    className={`w-full py-3 rounded-xl font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isPopular
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/25'
                        : 'bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                    }`}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Multi-Branch & Add-on Sizing Simulator */}
        <div className="bg-white dark:bg-[#0B1120] rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Building2 className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Dynamic Multi-Branch & Sizing Calculator
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Select Base Tier */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Select Base Tier:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRICING_PLANS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlanId(p.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedPlanId === p.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-xs">{p.name}</div>
                      <div className="text-[11px] opacity-70 font-mono mt-0.5">{p.clinicianLimit} Seats</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Branches Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-2">
                  <span className="uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Additional Facility Branches (20% Group Discount):
                  </span>
                  <span className="font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    +{additionalBranches} Additional {additionalBranches === 1 ? 'Branch' : 'Branches'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={additionalBranches}
                  onChange={(e) => setAdditionalBranches(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>Single Facility</span>
                  <span>5 Branches</span>
                  <span>10+ Branches</span>
                </div>
              </div>
            </div>

            {/* Right Summary Box */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-[#020617] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Calculated Investment Breakdown
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Base Plan ({activePlan.name}):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatNaira(pricing.baseCost)}
                  </span>
                </div>

                {additionalBranches > 0 && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>{additionalBranches} Additional Branches (-20% discount):</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      +{formatNaira(pricing.branchCost)}
                    </span>
                  </div>
                )}

                {pricing.savingsNaira > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Annual Discount Applied:</span>
                    <span className="font-mono">-{formatNaira(pricing.savingsNaira)}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Total {billingCycle === 'annual' ? 'Annual' : 'Monthly'} Cost:
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Includes all updates, encryption & backups
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
                    {formatNaira(pricing.totalCost)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleStartCheckout(selectedPlanId)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to Instant Provisioning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout / Provisioning Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0B1120] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {checkoutStep === 'success' ? 'Workspace Provisioned!' : 'Hospital Tenant Provisioning'}
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Plan: {activePlan.name} ({billingCycle})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {checkoutStep === 'details' && (
              <form onSubmit={handleCompleteSimulatedPayment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hospital / Facility Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. St. Nicholas Specialist Hospital"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Lead Admin Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="admin@hospital.org"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+234 803 000 0000"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <div className="flex justify-between font-semibold text-slate-900 dark:text-white">
                    <span>Due Now ({billingCycle}):</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">{formatNaira(pricing.totalCost)}</span>
                  </div>
                  <p className="text-[11px]">Paystack Direct Debit / Card Gateway / Bank Transfer</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                >
                  Confirm & Generate Hospital Workspace
                </button>
              </form>
            )}

            {checkoutStep === 'success' && (
              <div className="text-center space-y-4 py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Hospital Tenant Activated!
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Your dedicated encrypted workspace for <strong>{hospitalName}</strong> has been provisioned on our edge network.
                </p>

                <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Your Hospital Tenant Code:
                  </span>
                  <code className="text-lg font-mono font-extrabold text-blue-600 dark:text-blue-400">
                    {generatedTenantCode}
                  </code>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  An activation link with single-use TOTP setup instructions has been sent to <strong>{adminEmail}</strong>.
                </p>

                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs cursor-pointer"
                >
                  Close & Open Hospital Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
