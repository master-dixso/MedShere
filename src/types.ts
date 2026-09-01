export type NavRoute = 
  | 'home'
  | 'product'
  | 'platform'
  | 'features'
  | 'modules'
  | 'pricing'
  | 'solutions'
  | 'docs'
  | 'tests'
  | 'help'
  | 'about'
  | 'updates'
  | 'book'
  | 'contact';

export interface PricingPlan {
  id: 'essential' | 'professional' | 'enterprise' | 'custom';
  name: string;
  tagline: string;
  monthlyNaira: number;
  annualNaira: number;
  clinicianLimit: number;
  targetFacilities: string;
  features: string[];
  popular?: boolean;
  badge?: string;
}

export interface ClinicalModule {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'core' | 'specialty' | 'operations' | 'infrastructure';
  icon: string;
  color: string;
  badge?: string;
  metrics: { label: string; value: string }[];
  keyFeatures: string[];
  mockUiPreview: {
    title: string;
    subtext: string;
    badges: string[];
    rows: { label: string; detail: string; status?: string }[];
  };
}

export interface SolutionItem {
  id: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  targetAudience: string;
  icon: string;
  highlights: string[];
  caseStudy: {
    client: string;
    location: string;
    metric: string;
    quote: string;
    author: string;
  };
}

export interface FAQItem {
  id: string;
  category: 'general' | 'deployment' | 'billing' | 'compliance' | 'security';
  q: string;
  a: string;
  keywords: string[];
}

export interface DocChapter {
  id: string;
  title: string;
  category: 'Getting Started' | 'Architecture & Edge' | 'Clinical APIs' | 'Component Library' | 'Compliance & Security';
  summary: string;
  markdownContent: string;
  codeSnippet?: {
    language: string;
    filename: string;
    code: string;
  };
}

export interface TestCase {
  id: string;
  suite: 'Unit: Core Utilities' | 'Unit: Pricing Engine' | 'Integration: HMO Claims' | 'Integration: Patient Encounters' | 'Edge & Core Web Vitals' | 'Accessibility & Security';
  name: string;
  description: string;
  status: 'passed' | 'running' | 'failed' | 'idle';
  durationMs: number;
  assertion: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
}

export interface PatientRecord {
  id: string;
  hospitalNumber: string;
  fullName: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  bloodGroup: string;
  hmoProvider: string;
  hmoPolicyId: string;
  vitals: {
    bloodPressure: string;
    pulse: number;
    temp: number;
    spo2: number;
    weightKg: number;
  };
  currentComplaint: string;
  diagnoses: string[];
  prescriptions: { drug: string; dosage: string; frequency: string; status: 'Dispensed' | 'Pending' }[];
  labRequests: { test: string; status: 'Completed' | 'In-Progress' | 'Sample Collected'; result?: string }[];
  claimStatus: 'Approved' | 'Pre-Auth Required' | 'Submitted' | 'Reconciled';
}
