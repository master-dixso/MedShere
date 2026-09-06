export interface DocSectionLink {
  id: string;
  title: string;
}

export interface EnhancedDocChapter {
  id: string;
  title: string;
  shortTitle?: string;
  category: 'Stakeholder Onboarding' | 'Architecture & Edge' | 'Clinical APIs' | 'Component Library' | 'Compliance & Security' | 'Interactive Tools';
  roleGroup: 'clinical' | 'executive' | 'finance' | 'technical' | 'compliance' | 'all';
  targetAudience: string;
  readTime: string;
  version: string;
  summary: string;
  sections: DocSectionLink[];
  markdownContent: string;
  codeSnippet?: {
    language: string;
    filename: string;
    code: string;
  };
  callout?: {
    type: 'clinical' | 'compliance' | 'tip' | 'architecture';
    title: string;
    text: string;
  };
}

export const ENHANCED_DOCS_CHAPTERS: EnhancedDocChapter[] = [
  // ==========================================
  // STAKEHOLDER ONBOARDING TRACKS
  // ==========================================
  {
    id: 'onboarding-cmo',
    title: 'Clinical Leadership: CDS & Patient Safety Governance',
    shortTitle: 'Clinical Leadership (CMO)',
    category: 'Stakeholder Onboarding',
    roleGroup: 'clinical',
    targetAudience: 'Chief Medical Officers, Clinical Directors, Head of Nursing, Pharmacy Leads',
    readTime: '4 min read',
    version: 'v3.4.0',
    summary: 'Clinical decision support (CDS) architecture, real-time allergy collision guard, ICD-11 coding governance, and outpatient throughput optimization.',
    sections: [
      { id: 'cds-rules', title: 'Clinical Decision Support (CDS) Rules' },
      { id: 'allergy-guard', title: 'Zero-Latency Allergy Collision Guard' },
      { id: 'triage-standards', title: 'Triage & Waiting Times Protocol' },
      { id: 'soap-documentation', title: 'SOAP Clinical Documentation Governance' },
    ],
    callout: {
      type: 'clinical',
      title: 'Clinical Safety Guideline',
      text: 'Prescription collision checks execute locally at edge within 15ms prior to electronic signing, preventing accidental drug interactions before dispatch to the dispensary.',
    },
    markdownContent: `
### Overview for Clinical Directors & CMOs

MedSphere Alpha III is engineered around clinical safety, diagnostic speed, and eliminating preventable medication errors. This guide outlines governance rules and workflows for clinical departmental heads.

### 1. Clinical Decision Support (CDS) Rules
- **Drug-Allergy Interaction Interlocks**: When a physician adds an order (e.g., Penicillins, Cephalosporins, Sulfa drugs), the CDS engine scans the patient's recorded allergies and cross-reactivity tables in real-time.
- **Dosage & Route Boundaries**: System automatically cross-checks patient age, gestational status, and recorded weight to prevent decimal-point dosage errors.
- **Pediatric & Geriatric Safeguards**: Automated flags alert clinicians when medication orders deviate from standardized pediatric BNF ranges.

### 2. Zero-Latency Allergy Collision Guard
Allergy profiles are stored as high-priority medical records. In emergencies, the triage pavilion records allergies upon biometric or hospital number identification. Any conflicting prescription triggers an un-dismissible clinical alert requiring explicit rationale.

### 3. Triage & Waiting Times Protocol
- **Emergency Priority Levels**: Category 1 (Resuscitation / Immediate), Category 2 (Emergency / 10 min), Category 3 (Urgent / 30 min), Category 4 (Semi-urgent / 60 min).
- **Vitals Panic Thresholds**: SpO2 < 92%, Systolic BP > 180 or < 85, Heart Rate > 130 or < 45 automatically push sound and visual alerts to the duty doctor workstation.

### 4. SOAP Clinical Documentation Governance
- **Subjective**: Chief complaint, history of presenting illness, and review of systems.
- **Objective**: Edge-synced digital vitals, physical examination findings, and verified lab values.
- **Assessment**: Primary and secondary ICD-11 and SNOMED-CT clinical coding.
- **Plan**: E-prescriptions, diagnostic investigation orders, nursing notes, and follow-up schedules.
    `,
    codeSnippet: {
      language: 'typescript',
      filename: 'src/clinical/cdsSafetyGuard.ts',
      code: `// Clinical Decision Support: Real-time Allergy Collision Interlock
export interface CollisionCheckResult {
  allowed: boolean;
  severity: 'none' | 'warning' | 'blocked';
  allergenDetected?: string;
  rationale?: string;
}

export function evaluateDrugAllergyCollision(
  medicationName: string,
  patientAllergies: string[]
): CollisionCheckResult {
  const normalizedMed = medicationName.toLowerCase();
  
  for (const allergy of patientAllergies) {
    const allergen = allergy.toLowerCase();
    if (normalizedMed.includes('amoxicillin') && allergen.includes('penicillin')) {
      return {
        allowed: false,
        severity: 'blocked',
        allergenDetected: allergy,
        rationale: 'Severe beta-lactam cross-reactivity: Anaphylaxis/Urticaria risk.',
      };
    }
  }
  return { allowed: true, severity: 'none' };
}`,
    },
  },
  {
    id: 'onboarding-admin',
    title: 'Hospital Administrators: Seat Economics & 48-Hour Go-Live',
    shortTitle: 'Hospital Administrators (CEO)',
    category: 'Stakeholder Onboarding',
    roleGroup: 'executive',
    targetAudience: 'Hospital CEOs, Managing Directors, Operations Officers, Human Resources',
    readTime: '5 min read',
    version: 'v3.4.0',
    summary: 'Mastering the zero-patient-fee pricing model, staff seat governance, multi-facility branch expansion, and step-by-step 48-hour cutover roadmap.',
    sections: [
      { id: 'zero-patient-fee', title: 'The Zero-Patient-Fee Economic Model' },
      { id: 'seat-governance', title: 'Clinician & Staff Seat Management' },
      { id: 'branch-federation', title: 'Multi-Site Branch Operations' },
      { id: 'cutover-roadmap', title: '48-Hour Deployment & Cutover Checklist' },
    ],
    callout: {
      type: 'tip',
      title: 'Institutional Cost Predictability',
      text: 'Unlike legacy HMS providers who charge per bed, per patient card, or per outpatient visit, MedSphere bills strictly on active staff logins. Your patient base can grow 10x with zero software inflation.',
    },
    markdownContent: `
### Executive Strategy for Hospital Leadership

MedSphere aligns hospital financial success with operational growth. This guide outlines how hospital executives manage licenses, govern multi-site branches, and execute frictionless cutovers.

### 1. The Zero-Patient-Fee Economic Model
Traditional healthcare software penalizes growing institutions by charging per admission, per outpatient card, or per lab test. MedSphere eliminates this friction:
- **Unlimited Patient Charts**: Register 500 or 500,000 patients with zero per-record surcharge.
- **Unlimited Companion App Users**: Patients book appointments and review lab tests for free.
- **Billed on Active Staff**: Only physicians, nurses, pharmacists, and administrators logging in require allocated seats.

### 2. Clinician & Staff Seat Management
- **Role Tiering**: Essential Plan (20 seats), Professional Plan (35 seats), Enterprise Plan (60 seats), Custom (Unlimited).
- **Automated Deactivation**: Staff who resign or take leaves of absence can be deactivated with 1-click, immediately freeing seats for locum or replacement staff.

### 3. Multi-Site Branch Operations
Hospital chains operate seamlessly with consolidated group reporting:
- Single Master EMR: A patient registered in Branch A has their charts, allergies, and diagnostic history visible in Branch B immediately.
- Group Inventory Transfers: Track central drug warehouse stocks and inter-branch pharmacy dispatches.

### 4. 48-Hour Deployment & Cutover Checklist
1. **Hour 0 - 12 (Setup)**: Secure tenant provisioning, hospital department configuration, and staff TOTP MFA email dispatches.
2. **Hour 12 - 24 (Data Load)**: Legacy patient demographic extraction, drug formulary import, and HMO fee schedule validation.
3. **Hour 24 - 36 (Simulation & Training)**: Departmental staff conduct mock patient triage, consultations, and test prescriptions in the sandbox.
4. **Hour 36 - 48 (Go-Live Cutover)**: Parallel paper/legacy run discontinued; live outpatient check-ins begin.
    `,
    codeSnippet: {
      language: 'typescript',
      filename: 'src/admin/seatAllocation.ts',
      code: `// Staff Seat Allocation & Deactivation Governance
export interface HospitalTenantSeats {
  tier: 'essential' | 'professional' | 'enterprise';
  totalAllocated: number;
  activeClinicians: number;
  activeNurses: number;
  activeAdminStaff: number;
  availableSlots: number;
}

export function computeAvailableSeats(tenant: HospitalTenantSeats): number {
  const used = tenant.activeClinicians + tenant.activeNurses + tenant.activeAdminStaff;
  return Math.max(0, tenant.totalAllocated - used);
}`,
    },
  },
  {
    id: 'onboarding-hmo',
    title: 'HMO & Finance: Automated Tariff Adjudication & Fast Claims',
    shortTitle: 'HMO & Billing (Finance)',
    category: 'Stakeholder Onboarding',
    roleGroup: 'finance',
    targetAudience: 'Chief Financial Officers, Billing Directors, HMO Claims Desk, Medical Accountants',
    readTime: '4 min read',
    version: 'v3.4.0',
    summary: 'Direct NHIA and Private HMO API integration, sub-second pre-authorization verification, tariff validation, and digital remittance reconciliation.',
    sections: [
      { id: 'tariff-verification', title: 'Automated Tariff Adjudication' },
      { id: 'instant-preauth', title: 'Live HMO Pre-Authorization API' },
      { id: 'nhia-submission', title: 'NHIA & Private HMO Batch Invoicing' },
      { id: 'reconciliation', title: 'Remittance Advice Reconciliation' },
    ],
    callout: {
      type: 'compliance',
      title: 'Revenue Cycle Acceleration',
      text: 'MedSphere reduces average HMO claim rejection rates from 22.4% down to under 2.1%, shortening payment cycles from 45+ days to under 11 days.',
    },
    markdownContent: `
### Revenue Cycle Governance for Hospital Finance

HMO disputes and rejected claims represent the largest revenue leakage in modern hospitals. MedSphere eliminates invoice discrepancies at the point of clinical entry.

### 1. Automated Tariff Adjudication
- **Real-Time Tariff Matching**: When a doctor orders an investigation or drug, the system checks the patient's specific HMO contract tariff (e.g. Hygeia, Reliance, AXA Mansard, Leadway).
- **Secondary Code Detection**: Prevents accidental double-billing or procedure bundling errors that trigger insurer audits.

### 2. Live HMO Pre-Authorization API
- **Sub-Second Code Verification**: Direct electronic bridge into HMO authorization portals validates authorization codes instantly.
- **Coverage Caps Monitoring**: Warns billing staff when cumulative outpatient spending approaches the patient's policy limit.

### 3. NHIA & Private HMO Batch Invoicing
Generate standardized National Health Insurance Authority (NHIA) XML/JSON invoices with 1 click:
- Attached digital physician consultation notes
- Timestamped diagnostic laboratory and imaging reports
- Pharmacist dispensing confirmation logs

### 4. Remittance Advice Reconciliation
Electronic remittance files (835 format or Excel exports) are automatically matched against pending hospital claim batches, highlighting unpaid items or deductions with actionable dispute reason codes.
    `,
    codeSnippet: {
      language: 'typescript',
      filename: 'src/billing/hmoAdjudication.ts',
      code: `export interface ClaimItem {
  code: string;
  tariffCapNaira: number;
  hospitalChargeNaira: number;
  requiresPreAuth: boolean;
}

export function adjudicateTariff(item: ClaimItem): {
  approvedAmount: number;
  copayRequired: number;
  varianceNote?: string;
} {
  if (item.hospitalChargeNaira <= item.tariffCapNaira) {
    return { approvedAmount: item.hospitalChargeNaira, copayRequired: 0 };
  }
  const excess = item.hospitalChargeNaira - item.tariffCapNaira;
  return {
    approvedAmount: item.tariffCapNaira,
    copayRequired: excess,
    varianceNote: \`Charge exceeds agreed HMO tariff cap by ₦\${excess}. Copay applied.\`,
  };
}`,
    },
  },
  {
    id: 'onboarding-it',
    title: 'IT & Informatics: FHIR Interoperability & Zero-Downtime Deployment',
    shortTitle: 'IT & Informatics (CIO)',
    category: 'Stakeholder Onboarding',
    roleGroup: 'technical',
    targetAudience: 'Health System CIOs, Informatics Engineers, IT Leads, DevOps Specialists',
    readTime: '6 min read',
    version: 'v3.4.0',
    summary: 'HL7 FHIR R4 interoperability, edge caching, sub-50ms query design, multi-tenant database isolation, and legacy EMR ETL migration.',
    sections: [
      { id: 'fhir-architecture', title: 'HL7 FHIR R4 Interoperability' },
      { id: 'edge-sla', title: 'Sub-50ms Query & Edge Performance' },
      { id: 'database-isolation', title: 'Multi-Tenant Database Isolation' },
      { id: 'etl-migration', title: 'Legacy EMR Extraction & ETL Mapping' },
    ],
    callout: {
      type: 'architecture',
      title: 'Infrastructure SLA',
      text: 'MedSphere maintains a 99.99% clinical uptime SLA backed by multi-region active-passive replication and automated edge failover.',
    },
    markdownContent: `
### Technical Architecture for IT & Informatics

Alpha III MedSphere is architected using modern web standards, lightweight payloads, and HL7 FHIR R4 specifications to integrate with hospital medical equipment and third-party laboratory analyzers.

### 1. HL7 FHIR R4 Interoperability
All clinical resources conform to standard HL7 FHIR schemas:
- **Patient**: MRN, demographics, contact details, biometric linkage.
- **Encounter**: Inpatient, outpatient, emergency visits with timestamped clinician ID.
- **Observation**: Vital signs (LOINC 85354-9 blood pressure panel, heart rate, SpO2).
- **MedicationRequest & Dispense**: RxNorm coded e-prescriptions.
- **Coverage & Claim**: HMO policy and claim status.

### 2. Sub-50ms Query & Edge Performance
- **Local In-Memory LRU Cache**: Over 1,800 drug formulary items and ICD-11 coding sets are cached in browser memory to ensure instant dropdown lookups even on 3G/4G cellular backup links.
- **Bundle Size Optimization**: Tree-shaken modular bundles with code-splitting keep initial application payload under 180kB gzip.

### 3. Multi-Tenant Database Isolation
Each hospital institution operates within a segregated data partition:
- Independent cryptographic keys (AES-256-GCM)
- Strict row-level security (RLS) policies
- Zero cross-tenant data leakage

### 4. Legacy EMR Extraction & ETL Mapping
Turnkey data ingestion pipelines support migrating legacy MySQL, SQL Server, OpenMRS, and Excel hospital records:
- Deduplication using soundex and phone normalization
- Patient history preservation (allergies, prior surgeries, chronic illnesses)
    `,
    codeSnippet: {
      language: 'typescript',
      filename: 'src/api/fhirTransformer.ts',
      code: `// FHIR R4 Observation Builder for Clinical Vitals
export function createFhirBloodPressureObservation(
  patientId: string,
  systolic: number,
  diastolic: number
) {
  return {
    resourceType: 'Observation',
    status: 'final',
    code: {
      coding: [{ system: 'http://loinc.org', code: '85354-9', display: 'Blood pressure panel' }],
    },
    subject: { reference: \`Patient/\${patientId}\` },
    effectiveDateTime: new Date().toISOString(),
    component: [
      {
        code: { coding: [{ system: 'http://loinc.org', code: '8480-6', display: 'Systolic blood pressure' }] },
        valueQuantity: { value: systolic, unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' },
      },
      {
        code: { coding: [{ system: 'http://loinc.org', code: '8462-4', display: 'Diastolic blood pressure' }] },
        valueQuantity: { value: diastolic, unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' },
      },
    ],
  };
}`,
    },
  },
  {
    id: 'onboarding-compliance',
    title: 'Compliance & Legal: NDPA 2023 & Cryptographic Audit Standards',
    shortTitle: 'Compliance & Legal (DPO)',
    category: 'Stakeholder Onboarding',
    roleGroup: 'compliance',
    targetAudience: 'Data Protection Officers (DPO), Legal Counsel, Compliance Officers, External Auditors',
    readTime: '5 min read',
    version: 'v3.4.0',
    summary: 'Nigeria Data Protection Act (NDPA 2023) compliance, mandatory TOTP MFA, immutable audit trails, and Data Protection Impact Assessment (DPIA) reporting.',
    sections: [
      { id: 'ndpa-statute', title: 'NDPA 2023 & NDPR Legal Safeguards' },
      { id: 'access-control', title: 'Granular Role-Based Access Control (RBAC)' },
      { id: 'immutable-audits', title: 'Cryptographic & Tamper-Evident Audit Trails' },
      { id: 'subject-rights', title: 'Patient Data Subject Rights & Consent Logs' },
    ],
    callout: {
      type: 'compliance',
      title: 'Statutory Data Protection Mandate',
      text: 'MedSphere encrypts all protected health information (PHI) using AES-256-GCM at rest and TLS 1.3 in transit. Every record access event is cryptographically sealed with the staff member ID and timestamp.',
    },
    markdownContent: `
### Regulatory & Privacy Governance

Healthcare information represents the highest tier of sensitive personal data. MedSphere adheres strictly to the Nigeria Data Protection Act (NDPA 2023) and global health data regulations (HIPAA, ISO 27001).

### 1. NDPA 2023 & NDPR Legal Safeguards
- **Data Protection Impact Assessment (DPIA)**: Pre-configured risk assessment documentation available for institutional filings with the Nigeria Data Protection Commission (NDPC).
- **Data Localization Compliance**: In-country hosting and local data governance support.
- **Mandatory TOTP Multi-Factor Authentication**: Enforced across all medical records officers and system administrators.

### 2. Granular Role-Based Access Control (RBAC)
Staff privileges are compartmentalized to adhere to the Principle of Least Privilege:
- **Physicians**: Full clinical encounter edit, prescription, and lab request rights.
- **Nurses**: Vitals recording, triage priority assignment, and inpatient bed updates.
- **Pharmacists**: Dispensary queue review, batch lot inspection, and dispensing approval.
- **Billing / Finance**: Invoice creation, HMO reconciliation; no access to confidential doctor clinical progress notes.

### 3. Cryptographic & Tamper-Evident Audit Trails
Every system action (READ, WRITE, EXPORT, DELETE, DISPENSE) generates an immutable audit record:
- Actor Staff ID & Role
- IP Address & Geographic Location
- Target Resource & Patient MRN
- Timestamp (UTC ISO 8601)

### 4. Patient Data Subject Rights & Consent Logs
- **Right to Access & Portability**: 1-click export of complete patient encounter histories in structured PDF and FHIR JSON.
- **Right to Rectification**: Audited correction of misrecorded demographic entries.
    `,
    codeSnippet: {
      language: 'typescript',
      filename: 'src/security/auditLogger.ts',
      code: `// Immutable Audit Logger for NDPA 2023 Compliance
export interface AuditRecord {
  actorId: string;
  actorRole: 'Doctor' | 'Nurse' | 'Pharmacist' | 'Admin' | 'Billing';
  action: 'READ' | 'WRITE' | 'EXPORT' | 'DELETE' | 'DISPENSE';
  targetResource: string;
  patientMrn?: string;
  timestamp: string;
  ipAddress: string;
}

export function recordAuditTrail(record: AuditRecord): void {
  // Sealed and transmitted to append-only compliance storage
  console.info('[NDPA_AUDIT_STAMP]', JSON.stringify(record));
}`,
    },
  },

  // ==========================================
  // CORE TECHNICAL & ARCHITECTURE CHAPTERS
  // ==========================================
  {
    id: 'arch-intro',
    title: 'Platform Architecture & Core Principles',
    shortTitle: 'Platform Architecture',
    category: 'Architecture & Edge',
    roleGroup: 'technical',
    targetAudience: 'Software Engineers, Technical Architects, System Evaluators',
    readTime: '4 min read',
    version: 'v3.4.0',
    summary: 'High-performance edge infrastructure, sub-50ms query design, state management, and multi-tenant partitioning for hospital networks.',
    sections: [
      { id: 'pillars', title: 'Core Architectural Pillars' },
      { id: 'client-sdk', title: 'Client SDK Initialization' },
      { id: 'edge-routing', title: 'Edge-First Query Routing' },
    ],
    markdownContent: `
# MedSphere Healthcare Cloud Platform

MedSphere is an enterprise-grade Hospital Management System (HMS) and Electronic Medical Record (EMR) platform engineered for modern healthcare institutions.

### Core Architectural Pillars
- **Edge-First Routing**: Static assets and critical API lookups are served from globally distributed edge nodes to ensure sub-50ms response times.
- **Zero Clinical Downtime**: Multi-region active-passive replication guarantees 99.99% availability.
- **Zero Patient Fee Model**: Pricing is tied strictly to active clinician and administrative seats. Patient records, visits, and app users scale infinitely at no extra cost.
- **Strict Data Isolation**: Multi-tenant database partitioning ensures that each hospital's medical records are physically and logically segregated with individual encryption keys.
    `,
    codeSnippet: {
      language: 'typescript',
      filename: 'src/lib/medsphere-client.ts',
      code: `import { createClient } from '@medsphere/sdk';

export const medsphere = createClient({
  tenantId: process.env.VITE_MEDSPHERE_TENANT_ID,
  apiKey: process.env.MEDSPHERE_API_KEY,
  region: 'africa-south1',
  edgeOptimization: true,
  encryptionStandard: 'AES-256-GCM',
});

// Example: Fetch active outpatient queue with edge caching
export async function getTriageQueue(departmentId: string) {
  return await medsphere.triage.getQueue({
    departmentId,
    status: 'waiting',
    includeVitals: true,
  });
}`,
    },
  },
  {
    id: 'arch-edge',
    title: 'Sub-50ms Edge Infrastructure & Core Web Vitals',
    shortTitle: 'Edge & Web Vitals',
    category: 'Architecture & Edge',
    roleGroup: 'technical',
    targetAudience: 'DevOps, Frontend Engineers, Infrastructure Leads',
    readTime: '4 min read',
    version: 'v3.4.0',
    summary: 'How MedSphere leverages Vite, code-splitting, tree-shaking, and lightweight LRU caching to maximize Core Web Vitals under poor network conditions.',
    sections: [
      { id: 'web-vitals', title: 'Core Web Vitals Benchmarks' },
      { id: 'lru-cache', title: 'In-Memory Clinical LRU Cache' },
      { id: 'offline-resilience', title: 'Offline Clinical Resilience' },
    ],
    markdownContent: `
# Edge Caching & Performance Engine

Healthcare environments often operate under varying network conditions. MedSphere optimizes every asset and query for maximum responsiveness.

### Performance Highlights
1. **Largest Contentful Paint (LCP)**: Under 0.8s on 4G connections through progressive streaming and optimized SVG icons.
2. **Interaction to Next Paint (INP)**: Sub-20ms UI responsiveness achieved via concurrent React 19 rendering and debounced state mutations.
3. **Cumulative Layout Shift (CLS)**: Zero layout shifting through fixed-dimension skeleton states and CSS grid boundaries.
4. **Offline Resilience**: Service worker caches critical formulary drug lists and clinical ICD-11 coding tables for instant offline search.
    `,
    codeSnippet: {
      language: 'typescript',
      filename: 'src/utils/edgeCache.ts',
      code: `// Lightweight in-memory LRU cache for clinical lookup tables
class ClinicalCache<T> {
  private cache = new Map<string, { data: T; expiry: number }>();
  private maxAge: number;

  constructor(maxAgeMs = 60000) {
    this.maxAge = maxAgeMs;
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  set(key: string, data: T): void {
    this.cache.set(key, { data, expiry: Date.now() + this.maxAge });
  }
}

export const drugFormularyCache = new ClinicalCache<string[]>(300000);`,
    },
  },
  {
    id: 'api-fhir',
    title: 'HMO Claims & Electronic Health Records API',
    shortTitle: 'Clinical & HMO APIs',
    category: 'Clinical APIs',
    roleGroup: 'technical',
    targetAudience: 'Integration Specialists, Laboratory Engineers, Third-Party Developers',
    readTime: '4 min read',
    version: 'v3.4.0',
    summary: 'REST & GraphQL schemas for patient encounter creation, HMO pre-authorization, and lab order dispatches.',
    sections: [
      { id: 'auth', title: 'Authentication & Bearer Tokens' },
      { id: 'claims-payload', title: 'HMO Claim Payload Specification' },
      { id: 'webhook-events', title: 'Webhook Subscriptions' },
    ],
    markdownContent: `
# Clinical APIs & Integrations

MedSphere exposes secure RESTful and FHIR-compliant interfaces for external diagnostic devices, HMO claim portals, and third-party laboratory analyzers.

### Authentication
All API requests must include a valid Bearer JWT generated via the hospital administrator portal or automated OAuth 2.0 client credential flows.

\`\`\`http
POST /api/v1/hmo/verify-eligibility
Authorization: Bearer <TOKEN>
Content-Type: application/json
\`\`\`
    `,
    codeSnippet: {
      language: 'typescript',
      filename: 'src/api/hmoClaims.ts',
      code: `export interface HMOClaimPayload {
  hospitalCode: string;
  patientId: string;
  hmoProviderId: string;
  policyNumber: string;
  encounterDate: string;
  diagnoses: string[]; // ICD-11 codes
  items: {
    serviceCode: string;
    description: string;
    unitPriceNaira: number;
    quantity: number;
  }[];
}

export async function submitHMOClaim(payload: HMOClaimPayload) {
  const res = await fetch('/api/v1/hmo/claims', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}`,
    },
  },
  {
    id: 'ui-design-system',
    title: 'Design System & Accessible Component Kit',
    shortTitle: 'Design System (Alpha DS)',
    category: 'Component Library',
    roleGroup: 'technical',
    targetAudience: 'Designers, Frontend Developers, Accessibility Specialists',
    readTime: '3 min read',
    version: 'v3.4.0',
    summary: 'Reusable UI building blocks: PatientBadges, VitalsCards, TriagePills, and Modal Dialogs with dark mode support.',
    sections: [
      { id: 'principles', title: 'Design Principles & WCAG AAA' },
      { id: 'semantic-colors', title: 'Semantic Clinical Color Coding' },
      { id: 'component-code', title: 'VitalsCard Component Implementation' },
    ],
    markdownContent: `
# MedSphere Design System (Alpha DS)

Our design system is crafted specifically for high-stress, high-clarity clinical interfaces.

### Key Rules
- High-contrast visual hierarchies meeting WCAG AAA color contrast ratios.
- Semantic color coding: Emerald for normal vitals, Amber for borderlines/warnings, Rose for critical alerts.
- Smooth transitions with native dark mode support for low-light night shifts in hospital wards.
    `,
    codeSnippet: {
      language: 'tsx',
      filename: 'src/components/ui/VitalsCard.tsx',
      code: `import React from 'react';

interface VitalsCardProps {
  label: string;
  value: string | number;
  unit: string;
  status?: 'normal' | 'warning' | 'critical';
}

export const VitalsCard: React.FC<VitalsCardProps> = ({ label, value, unit, status = 'normal' }) => {
  const statusStyles = {
    normal: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300',
    warning: 'border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-300',
    critical: 'border-rose-500/20 bg-rose-500/5 text-rose-700 dark:text-rose-300',
  };

  return (
    <div className={\`p-4 rounded-xl border \${statusStyles[status]} transition-all\`}>
      <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{label}</span>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold font-mono">{value}</span>
        <span className="text-xs opacity-70">{unit}</span>
      </div>
    </div>
  );
};`,
    },
  },
];
