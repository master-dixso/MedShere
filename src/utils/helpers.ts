export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('NGN', '₦');
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  } else {
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      textArea.remove();
      return Promise.resolve(true);
    } catch {
      textArea.remove();
      return Promise.resolve(false);
    }
  }
}

export function calculatePricingEstimate(
  planId: 'essential' | 'professional' | 'enterprise' | 'custom',
  billingCycle: 'monthly' | 'annual',
  additionalBranches: number = 0,
  selectedAddOns: string[] = []
): {
  baseCost: number;
  branchCost: number;
  addOnCost: number;
  totalCost: number;
  monthlyEquivalent: number;
  savingsNaira: number;
} {
  const baseMonthly = {
    essential: 20000,
    professional: 35000,
    enterprise: 60000,
    custom: 150000,
  }[planId];

  const branchMultiplier = 0.8; // 20% discount on additional branches
  const addOnCostMonthly = selectedAddOns.length * 5000;

  if (billingCycle === 'monthly') {
    const baseCost = baseMonthly;
    const branchCost = additionalBranches * (baseMonthly * branchMultiplier);
    const addOnCost = addOnCostMonthly;
    const totalCost = baseCost + branchCost + addOnCost;
    return {
      baseCost,
      branchCost,
      addOnCost,
      totalCost,
      monthlyEquivalent: totalCost,
      savingsNaira: 0,
    };
  } else {
    // Annual: 10 months price for 12 months (2 months free)
    const annualBase = baseMonthly * 10;
    const annualBranchCost = additionalBranches * (baseMonthly * 10 * branchMultiplier);
    const annualAddOns = addOnCostMonthly * 10;
    const totalCost = annualBase + annualBranchCost + annualAddOns;
    const standardCost = (baseMonthly + additionalBranches * (baseMonthly * branchMultiplier) + addOnCostMonthly) * 12;
    const savingsNaira = standardCost - totalCost;
    return {
      baseCost: annualBase,
      branchCost: annualBranchCost,
      addOnCost: annualAddOns,
      totalCost,
      monthlyEquivalent: Math.round(totalCost / 12),
      savingsNaira,
    };
  }
}
