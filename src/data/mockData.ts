import {
  PricingPlan,
  ClinicalModule,
  SolutionItem,
  FAQItem,
  DocChapter,
  TestCase,
  PatientRecord,
} from '../types';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: 'Small practices, private clinics, and outpatient centres',
    monthlyNaira: 20000,
    annualNaira: 200000, // 2 months free (16.6k/mo equivalent)
    clinicianLimit: 20,
    targetFacilities: 'Up to 20 active clinician & staff seats. Solo practices, nursing homes, and compact outpatient centres.',
    features: [
      'Full Electronic Medical Records (EMR)',
      'Outpatient & Inpatient Registration',
      'Prescription & Dispensing Queue',
      'Basic Laboratory Order Management',
      'HMO Eligibility Check & Basic Claims',
      'Individual Staff Logins & RBAC',
      'NDPA 2023 Compliant Encrypted Vault',
      'Email & Community Help Desk Support',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'Multi-department hospitals, community health & PHCs',
    monthlyNaira: 35000,
    annualNaira: 350000,
    clinicianLimit: 35,
    popular: true,
    badge: 'Most Popular',
    targetFacilities: 'Up to 35 active staff seats. Growing multi-specialty hospitals, surgical clinics, and busy community health centers.',
    features: [
      'Everything in Essential, plus:',
      'Ward Bed Management & Nursing Rosters',
      'Surgical Theatre & Maternity Logs',
      'Automated HMO Pre-Auth & Submission Adapter',
      'Radiology DICOM Image Viewer Link',
      'Automated Drug Stock Expiry Alerts',
      'Real-time Clinical Operations Intelligence',
      'Admin TOTP Two-Factor Authentication (MFA)',
      'Priority 24/7 Live Support via Portal',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Large hospitals, teaching institutions & health systems',
    monthlyNaira: 60000,
    annualNaira: 600000,
    clinicianLimit: 60,
    badge: 'High Performance',
    targetFacilities: 'Up to 60 active clinician seats. Mid-size to large private hospitals, specialist clinics, and multi-ward facilities.',
    features: [
      'Everything in Professional, plus:',
      'Cross-Facility Record Exchange & Interoperability',
      'Legacy EMR CSV/JSON Migration Toolkit',
      'ICU Real-time Vital Stream Monitor',
      'Telemedicine Video Consultation Engine',
      'Automated NHIA & Private HMO Reconciliation',
      'Custom Role Permissions & Granular Audit Trails',
      'Dedicated Customer Success & Onboarding Lead',
      'Custom Edge Cache & Sub-50ms Response SLA',
    ],
  },
  {
    id: 'custom',
    name: 'Health System Network',
    tagline: 'Multi-site hospital conglomerates, state networks & HMO consortiums',
    monthlyNaira: 150000,
    annualNaira: 1500000,
    clinicianLimit: 500,
    badge: 'Custom Architecture',
    targetFacilities: 'Unlimited / Custom staff capacity. State-wide hospital networks, multi-branch hospital chains, and federal medical centres.',
    features: [
      'Unlimited Clinician & Administrative Seats',
      'Multi-Branch Tenant Orchestrator & Centralized Billing',
      'Dedicated Managed ETL Data Migration Ops',
      'Self-Hosted or Dedicated Cloud Virtual Private Cloud (VPC)',
      'Custom Direct HL7 / FHIR API Integrations',
      '24/7 SLA with 15-Minute Guaranteed Incident Response',
      'Custom Clinical Workflow Blueprint Engineering',
      'Executive Governance & DPIA Compliance Support',
    ],
  },
];

export const CLINICAL_MODULES: ClinicalModule[] = [
  {
    id: 'emr',
    name: 'Electronic Medical Record (EMR)',
    tagline: 'Comprehensive patient health records, SOAP notes, and clinical histories',
    description: 'Instant longitudinal patient charts with ICD-11 coding, drug allergy checks, vitals timelines, and paperless encounter flows.',
    category: 'core',
    icon: 'FileText',
    color: '#0ea5e9',
    badge: 'Core Engine',
    metrics: [
      { label: 'Chart Load Speed', value: '< 45ms' },
      { label: 'Uptime Guarantee', value: '99.99%' },
      { label: 'Data Encryption', value: 'AES-256' },
    ],
    keyFeatures: [
      'Fast SOAP Encounter Documentation',
      'Automated Drug Interaction & Allergy Alerts',
      'Vitals Trend Graphs & BMI Auto-calculation',
      'Lifetime Medical Record Export (FHIR/PDF)',
    ],
    mockUiPreview: {
      title: 'Dr. Chidi Okafor — Active Encounter',
      subtext: 'Patient: Aisha Bello (MED-90241) • Age 34 • O+',
      badges: ['No Known Drug Allergies', 'HMO: Hygeia Gold', 'Status: Triage Complete'],
      rows: [
        { label: 'Chief Complaint', detail: 'Recurrent migraine with visual aura for 4 days' },
        { label: 'Blood Pressure', detail: '124 / 82 mmHg (Normal resting)', status: 'normal' },
        { label: 'Pulse & SpO2', detail: '74 bpm • 99% Room Air', status: 'optimal' },
        { label: 'Diagnosis', detail: 'G43.109 - Migraine with aura, not intractable' },
      ],
    },
  },
  {
    id: 'hms',
    name: 'Hospital Operations (HMS)',
    tagline: 'Scheduling, bed allocation, staff rosters, and department routing',
    description: 'Complete inpatient and outpatient hospital operating system for admissions, bed occupancy, doctor rosters, and patient queue triage.',
    category: 'core',
    icon: 'Building2',
    color: '#14b8a6',
    badge: 'Operational Backbone',
    metrics: [
      { label: 'Avg Triage Reduction', value: '62%' },
      { label: 'Bed Turnover Speed', value: '+40%' },
      { label: 'Roster Automation', value: '1-Click' },
    ],
    keyFeatures: [
      'Interactive Ward & Bed Occupancy Matrix',
      'Automated Triage Prioritization Queue',
      'Doctor & Nursing Shift Scheduling',
      'Departmental Billing & Instant Invoicing',
    ],
    mockUiPreview: {
      title: 'Facility Operations Matrix — Main Wing',
      subtext: 'Total Capacity: 84 Beds • Occupied: 68 (81%) • Available: 16',
      badges: ['Emergency: 2 Open', 'ICU: 1 Open', 'Maternity: 5 Open'],
      rows: [
        { label: 'Ward A (Male Medical)', detail: '18 / 20 Beds Occupied (90%)', status: 'high' },
        { label: 'Ward B (Female Surgical)', detail: '14 / 20 Beds Occupied (70%)', status: 'optimal' },
        { label: 'Pediatric Unit', detail: '12 / 16 Beds Occupied (75%)', status: 'optimal' },
        { label: 'Active Triage Queue', detail: '8 Patients waiting • Avg wait 14 mins' },
      ],
    },
  },
  {
    id: 'lab',
    name: 'Laboratory Information System (LIS)',
    tagline: 'Sample tracking, test order workflows, auto-validation, and pathologist sign-off',
    description: 'Seamless diagnostic lab pipeline with barcode specimen tracking, automated normal range validation, and instant doctor notifications.',
    category: 'core',
    icon: 'FlaskConical',
    color: '#8b5cf6',
    metrics: [
      { label: 'Result Turnaround', value: '3.2x Faster' },
      { label: 'Critical Alert Speed', value: 'Real-time' },
      { label: 'Analyzer Integration', value: 'HL7 Compliant' },
    ],
    keyFeatures: [
      'Barcode Specimen Tube Identification',
      'Critical Panic Value Push Alerts',
      'Digital Pathologist Authorization',
      'Historical Trend Comparative Views',
    ],
    mockUiPreview: {
      title: 'Diagnostic Lab Dispatch — Analyzer L-400',
      subtext: 'Batch #8921 • 14 Specimens in process • 3 Ready for sign-off',
      badges: ['Full Blood Count', 'Lipid Profile', 'HbA1c Validated'],
      rows: [
        { label: 'FBC - Aisha Bello', detail: 'WBC: 6.4 x10^9/L | Hb: 13.8 g/dL (Normal)', status: 'passed' },
        { label: 'Serum Electrolytes', detail: 'Na: 139 mmol/L | K: 4.1 mmol/L (Normal)', status: 'passed' },
        { label: 'Blood Glucose (Fasting)', detail: '94 mg/dL — Verified by Dr. M. Danladi' },
      ],
    },
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy & Dispensing Queue',
    tagline: 'Real-time drug inventory, e-prescribing, dosage verification, and batch tracking',
    description: 'Eliminate dispensing errors with automated stock depletion, expiry date alerts, FEFO batching, and instant prescriber clarifications.',
    category: 'core',
    icon: 'Pill',
    color: '#f59e0b',
    metrics: [
      { label: 'Dispensing Accuracy', value: '99.98%' },
      { label: 'Stock Out Reduction', value: '88%' },
      { label: 'Expiry Waste Savings', value: '₦4.2M/yr' },
    ],
    keyFeatures: [
      'Prescription Queue with Dose Safety Checks',
      'First-Expire-First-Out (FEFO) Stock Control',
      'Automated Low Stock Purchase Alerts',
      'Patient Medication Usage Instructions (SMS/App)',
    ],
    mockUiPreview: {
      title: 'Central Dispensary Queue',
      subtext: 'Pending Orders: 4 • Dispensed Today: 142 items',
      badges: ['Active Formularies: 1,840', 'Zero Stock-Outs This Week'],
      rows: [
        { label: 'Rx #7712 (Aisha Bello)', detail: 'Sumatriptan 50mg Tab • 6 tabs • Dispensed', status: 'dispensed' },
        { label: 'Rx #7713 (Emeka Obi)', detail: 'Amoxiclav 625mg • 14 tabs • Ready for pickup', status: 'ready' },
        { label: 'Batch Warning', detail: 'Paracetamol IV 100ml — Expiry in 45 days (Batch 2024B)' },
      ],
    },
  },
  {
    id: 'claims',
    name: 'HMO & Insurer Claims Engine',
    tagline: 'Automated tariff verification, live pre-authorization, and batch submission',
    description: 'Direct integrations with Nigerian and international HMOs, automated tariff adjudication, NHIA format generation, and fast reconciliation.',
    category: 'operations',
    icon: 'ShieldCheck',
    color: '#ec4899',
    badge: 'Revenue Accelerator',
    metrics: [
      { label: 'Claim Rejection Rate', value: '< 2.1%' },
      { label: 'Payout Cycle', value: '11 Days vs 45 Days' },
      { label: 'Supported HMOs', value: '45+ Adapters' },
    ],
    keyFeatures: [
      'Live HMO Eligibility & Pre-Auth Code Fetcher',
      'Automated Tariff Discrepancy Prevention',
      '1-Click NHIA / Private HMO Batch Submission',
      'Remittance Advice Reconciliation Dashboard',
    ],
    mockUiPreview: {
      title: 'HMO Claims Terminal — Hygeia / Reliance / AXA',
      subtext: 'Claims Total: ₦18,420,500 • Adjudicated: 94.2% Success',
      badges: ['Pre-Auth Instant Valid', 'Zero Duplicate Invoices'],
      rows: [
        { label: 'Claim #HYG-9021', detail: 'Aisha Bello • Consult + Meds • ₦24,500 • APPROVED', status: 'approved' },
        { label: 'Claim #AXA-8819', detail: 'Babajide Cole • Appendectomy • ₦450,000 • PRE-AUTH OK', status: 'approved' },
        { label: 'Batch Submission #41', detail: '48 Claims bundled • Sent to Reliance HMO API' },
      ],
    },
  },
  {
    id: 'analytics',
    name: 'Clinical Intelligence & KPI Dashboard',
    tagline: 'Executive analytics, patient throughput, revenue analytics, and clinical metrics',
    description: 'Transform hospital operational data into actionable clarity with real-time throughput metrics, doctor performance, and disease incidence reports.',
    category: 'operations',
    icon: 'BarChart3',
    color: '#6366f1',
    metrics: [
      { label: 'Report Generation', value: 'Instant' },
      { label: 'Revenue Leakage Stopped', value: '₦12M/yr' },
      { label: 'Clinical Auditing', value: '100% Automated' },
    ],
    keyFeatures: [
      'Daily Revenue & Departmental Yield Tracking',
      'Inpatient Length-of-Stay (LOS) Optimization',
      'Morbidity & Mortality Statutory Reporting (NDPR/MOH)',
      'Physician Workload & Patient Satisfaction Analytics',
    ],
    mockUiPreview: {
      title: 'Hospital Executive KPI Summary',
      subtext: 'Reporting Period: August 2026 • Facility Yield: +18.4% YoY',
      badges: ['Patient Satisfaction: 96.4%', 'Bed Utilization: 84%'],
      rows: [
        { label: 'Monthly Encounters', detail: '3,842 Patients (+12% vs last month)' },
        { label: 'Avg Emergency Response', detail: '6.2 Minutes (Target: < 10 mins)' },
        { label: 'Pharmacy Revenue Yield', detail: '₦34.8M Gross • 31.2% Margin' },
      ],
    },
  },
  {
    id: 'telemedicine',
    name: 'Telemedicine & Remote Consultation',
    tagline: 'Encrypted HD video consults, digital prescriptions, and patient remote monitoring',
    description: 'High-definition WebRTC video consults with in-call chart access, instant e-prescriptions, and remote vital monitoring for chronic care.',
    category: 'specialty',
    icon: 'Video',
    color: '#22c55e',
    metrics: [
      { label: 'Video Quality', value: 'Adaptive HD' },
      { label: 'Bandwidth Resilience', value: 'Sub-100kbps 3G/4G' },
      { label: 'Consult Completion', value: '98.5%' },
    ],
    keyFeatures: [
      'Sub-100ms Low-Latency Video Consults',
      'Simultaneous In-Call Charting & Prescribing',
      'Automated SMS & WhatsApp Appointment Reminders',
      'Integrated Online Card & Bank Transfer Payments',
    ],
    mockUiPreview: {
      title: 'Virtual Consultation Room #4',
      subtext: 'Dr. Ngozi Eze with Patient: Tunde Bakare',
      badges: ['Encrypted WebRTC', 'Duration: 12:45', 'Camera Active'],
      rows: [
        { label: 'Bandwidth Status', detail: 'Solid 4G (1.8 Mbps) • Zero Frame Drops', status: 'optimal' },
        { label: 'In-Call Order', detail: 'Lab test ordered: Fasting Lipid Profile' },
        { label: 'Prescription', detail: 'Atorvastatin 20mg nocte • Sent to Pharmacy' },
      ],
    },
  },
  {
    id: 'maternity',
    name: 'Maternity & Antenatal (ANC) Suite',
    tagline: 'Trimester tracking, partograph charting, delivery records, and immunization schedules',
    description: 'Specialized obstetrics and gynecology module with digital WHO partographs, high-risk pregnancy tags, and neonatal birth registries.',
    category: 'specialty',
    icon: 'HeartHandshake',
    color: '#f43f5e',
    metrics: [
      { label: 'Maternal Tracking', value: '100% Digital' },
      { label: 'Partograph Precision', value: 'WHO Standard' },
      { label: 'Vaccination Adherence', value: '97.2%' },
    ],
    keyFeatures: [
      'Interactive Digital WHO Partograph with Cervical Dilatation Curve',
      'High-Risk Pregnancy Flagging & Early Warning Score (MEOWS)',
      'Neonatal APGAR Scoring & Birth Certificate Generator',
      'Automated NPI Immunization Milestone Reminders',
    ],
    mockUiPreview: {
      title: 'Antenatal Clinical Record — ANC #4489',
      subtext: 'Mother: Fatima Ibrahim • Gestational Age: 36w 2d • EDD: Sept 24',
      badges: ['Gravida 2 Para 1', 'Blood Group: A+', 'MEOWS: Normal'],
      rows: [
        { label: 'Fetal Heart Rate', detail: '142 bpm (Regular rhythm, good variability)' },
        { label: 'Fundal Height', detail: '36 cm • Cephalic presentation • Longitudinal lie' },
        { label: 'Ultrasound Scan', detail: 'AFI: 14.2cm • Estimated Fetal Weight: 2.85kg' },
      ],
    },
  },
  {
    id: 'theatre',
    name: 'Surgical Theatre & Anaesthesia',
    tagline: 'Surgical bookings, WHO safe surgery checklist, anaesthetic logs, and post-op care',
    description: 'Comprehensive theatre management for surgical scheduling, swab counts, anaesthesia time-series logs, and recovery room handoffs.',
    category: 'specialty',
    icon: 'Stethoscope',
    color: '#0284c7',
    metrics: [
      { label: 'Checklist Compliance', value: '100%' },
      { label: 'Theatre Utilization', value: '88%' },
      { label: 'Recovery Tracking', value: 'Real-time' },
    ],
    keyFeatures: [
      'Digital WHO Surgical Safety Checklist (Sign In, Time Out, Sign Out)',
      'Real-Time Intra-Operative Anaesthesia Vital Graphing',
      'Instrument & Swab Count Reconciliation Safety Check',
      'Post-Anaesthesia Care Unit (PACU) Aldrete Scoring',
    ],
    mockUiPreview: {
      title: 'Theatre Suite 2 — Elective Laparoscopy',
      subtext: 'Lead Surgeon: Prof. K. Adeyemi • Anaesthetist: Dr. U. Bello',
      badges: ['WHO Checklist: Verified', 'Swab Count: Correct 20/20'],
      rows: [
        { label: 'Procedure', detail: 'Diagnostic Laparoscopy with Adhesiolysis' },
        { label: 'Anaesthesia Type', detail: 'General Anaesthesia with Endotracheal Intubation' },
        { label: 'Estimated Blood Loss', detail: '50 mL • Hemodynamically Stable' },
      ],
    },
  },
  {
    id: 'radiology',
    name: 'Radiology & PACS Imaging Hub',
    tagline: 'DICOM image linking, reporting templates, sonography logs, and urgent findings',
    description: 'Link MRI, CT, X-ray, and ultrasound findings directly to the patient’s primary medical record with structured radiologist reporting.',
    category: 'specialty',
    icon: 'Scan',
    color: '#7c3aed',
    metrics: [
      { label: 'DICOM Viewer Speed', value: '< 200ms' },
      { label: 'Report Dispatch', value: 'Instant' },
      { label: 'Cloud Storage', value: 'Redundant' },
    ],
    keyFeatures: [
      'Integrated Web DICOM Viewer with Pan, Zoom & Windowing',
      'Standardized Structured Reporting Templates',
      'Urgent / Critical Radiologic Finding Push Notifications',
      'Direct Modality Worklist (MWL) Integration',
    ],
    mockUiPreview: {
      title: 'Radiology Report — Chest X-Ray PA View',
      subtext: 'Patient: Musa Garba • Modality: Digital Radiography',
      badges: ['Quality: Diagnostic', 'Verified by: Dr. F. Okoro'],
      rows: [
        { label: 'Findings', detail: 'Lung fields clear bilaterally. No focal consolidation or pneumothorax.' },
        { label: 'Cardiothoracic Ratio', detail: 'CTR = 0.48 (Normal cardiac contour)' },
        { label: 'Impression', detail: 'Normal chest radiograph. No acute cardiopulmonary disease.' },
      ],
    },
  },
  {
    id: 'icu',
    name: 'ICU & Critical Care Monitoring',
    tagline: 'Continuous telemetry stream, SOFA/APACHE II scoring, and ventilator tracking',
    description: 'High-acuity intensive care tracking with high-frequency vital signs telemetry, invasive pressure lines, and automated acuity scoring.',
    category: 'specialty',
    icon: 'Activity',
    color: '#dc2626',
    metrics: [
      { label: 'Stream Latency', value: '< 20ms' },
      { label: 'Early Warning Score', value: 'Auto-Trigger' },
      { label: 'Alarm Fatigue Filter', value: 'Smart AI' },
    ],
    keyFeatures: [
      'Continuous Vital Telemetry Dashboard (Arterial Line, CVP, SpO2, EtCO2)',
      'Automated SOFA, APACHE II & GCS Acuity Scoring',
      'Ventilator Settings & Arterial Blood Gas (ABG) Log',
      'Fluid Balance (In/Out) Calculation with Hourly Rates',
    ],
    mockUiPreview: {
      title: 'ICU Bed 3 — Critical Care Monitoring',
      subtext: 'Patient: Ibrahim Sanusi • Diagnosis: Septic Shock (Recovering)',
      badges: ['SOFA Score: 4 (Down from 9)', 'GCS: 14/15', 'Noradrenaline: Weaned to 0.04'],
      rows: [
        { label: 'Arterial Blood Pressure', detail: '118/74 mmHg (MAP: 88 mmHg)', status: 'normal' },
        { label: 'Ventilator Mode', detail: 'SIMV-PS • PEEP 5 • FiO2 35% • PaO2/FiO2: 340' },
        { label: '24h Fluid Balance', detail: 'Total In: 2,400 mL | Total Out: 2,650 mL (Net -250 mL)' },
      ],
    },
  },
  {
    id: 'migration',
    name: 'Legacy EMR Migration & Cutover',
    tagline: 'Automated ETL, CSV/JSON mapping, data sanitization, and parallel-run cutover',
    description: 'Migrate thousands of historical patient charts, lab results, and billing histories from legacy or paper systems into MedSphere without clinical downtime.',
    category: 'infrastructure',
    icon: 'RefreshCw',
    color: '#d97706',
    badge: 'Zero Downtime',
    metrics: [
      { label: 'Migration Accuracy', value: '99.999%' },
      { label: 'Average Cutover Time', value: '< 48 Hours' },
      { label: 'Historical Record Support', value: '15+ Years' },
    ],
    keyFeatures: [
      'Self-Serve CSV/Excel Column Mapping Importer',
      'Enterprise Managed Bulk Database Extraction (SQL, Access, FileMaker)',
      'Automated Patient Deduplication & Fuzzy Matching Algorithm',
      'Clinician Chart Merge & Historical Visit Viewer',
    ],
    mockUiPreview: {
      title: 'Data Migration Pipeline — Pipeline #LGC-2026',
      subtext: 'Source: Legacy Custom MySQL Database • Target: MedSphere Encrypted Vault',
      badges: ['34,200 Records Migrated', 'Zero Data Loss', 'Cutover: Complete'],
      rows: [
        { label: 'Patient Demographics', detail: '34,200 / 34,200 (100% matched & verified)' },
        { label: 'Encounter Notes & SOAP', detail: '128,450 historical notes transformed into FHIR format' },
        { label: 'Lab & Diagnostic History', detail: '89,120 past lab records mapped with LOINC codes' },
      ],
    },
  },
];

export const SOLUTIONS_LIST: SolutionItem[] = [
  {
    id: 'private',
    title: 'Private Hospitals & Multi-Specialty Clinics',
    shortTitle: 'Private Hospitals',
    tagline: 'Maximize clinical throughput, eliminate revenue leakage, and thrill patients',
    description: 'Tailored for private healthcare providers looking to modernize operations, automate HMO billing, provide paperless consultations, and ensure seamless patient follow-up.',
    targetAudience: 'Medical Directors, Practice Managers, Private Hospital Owners',
    icon: 'Building',
    highlights: [
      'Sub-50ms chart lookups for ultra-fast outpatient consultations',
      'Automated HMO pre-authorization to prevent unrecoverable claim rejections',
      'Integrated pharmacy dispensing with real-time inventory and expiry alerts',
      'Online appointment booking and integrated cashless POS / Paystack payments',
    ],
    caseStudy: {
      client: 'Cedarcrest Specialist Clinic',
      location: 'Lagos & Abuja, Nigeria',
      metric: '74% reduction in patient wait times, ₦18M monthly HMO recovery boost',
      quote: 'MedSphere replaced our slow 8-year-old software in a weekend. Our doctors spend time with patients rather than typing passwords.',
      author: 'Dr. Anthony Adebayo, Medical Director',
    },
  },
  {
    id: 'public',
    title: 'Public Health Systems & Teaching Hospitals',
    shortTitle: 'Public Hospitals',
    tagline: 'High-volume resilience, NHIA compliance, and statutory health reporting',
    description: 'Engineered for massive patient volumes, resident doctor rotas, state health insurance schemes, and federal ministry of health disease surveillance.',
    targetAudience: 'Chief Medical Directors (CMDs), Health Commissioners, State Hospital Boards',
    icon: 'Landmark',
    highlights: [
      'Multi-tier residency and consultant sign-off hierarchies',
      'NHIA (National Health Insurance Authority) standard electronic claim export',
      'Offline-tolerant edge nodes for unpredictable hospital network connectivity',
      'Statutory epidemiology tracking with automated weekly IDSR returns',
    ],
    caseStudy: {
      client: 'St. Luke State District Hospital',
      location: 'Enugu, Nigeria',
      metric: 'Over 4,200 daily patient encounters processed with zero downtime',
      quote: 'The system handled our morning OPD crush without breaking a sweat. The queue management alone transformed our triage pavilion.',
      author: 'Dr. Ifeoma Nnamani, Head of Clinical Services',
    },
  },
  {
    id: 'multi-site',
    title: 'Multi-Site Hospital Groups & Diagnostics Chains',
    shortTitle: 'Multi-Site Groups',
    tagline: 'Centralized governance, consolidated financials, and cross-branch health records',
    description: 'Empower hospital chains to operate as a single coordinated health network. Share patient records across branches securely with unified billing and supply chain.',
    targetAudience: 'Hospital CEOs, Group Operations Directors, Healthcare CFOs',
    icon: 'Network',
    highlights: [
      'Cross-facility instant record sharing with patient biometric/phone lookup',
      'Consolidated group financial reporting and inter-branch inventory transfers',
      'Centralized admin dashboard with granular branch-level access control',
      'Unified HMO contract tariff management across all regional locations',
    ],
    caseStudy: {
      client: 'Apex Health Alliance (6 Facilities)',
      location: 'Port Harcourt, Lagos, Ibadan',
      metric: '40% cost reduction in group pharmaceutical procurement',
      quote: 'A patient seen in our Port Harcourt branch can walk into our Lagos hospital and their CT scans and lab history are available instantly.',
      author: 'Engr. David Okon, Chief Technology Officer',
    },
  },
  {
    id: 'legacy-emr',
    title: 'Legacy EMR Cutover & Data Migration',
    shortTitle: 'Legacy EMR Cutover',
    tagline: 'Seamlessly transition from legacy servers and paper to modern cloud EMR',
    description: 'Alpha III provides turnkey data extraction, cleaning, and migration tools to bring 10+ years of historical patient records into MedSphere without losing a single record.',
    targetAudience: 'Hospital IT Directors, Lead Informatics Officers, Health System CIOs',
    icon: 'HardDriveDownload',
    highlights: [
      'Turnkey ETL scripts for legacy SQL, Access, OpenMRS, and custom software',
      'Automated patient deduplication with soundex and phone normalization',
      'Parallel-run testing environment so staff train on real migrated data',
      'Zero clinical downtime cutover on scheduled changeover weekends',
    ],
    caseStudy: {
      client: 'Greenland Medical Centre',
      location: 'Abuja, Nigeria',
      metric: '185,000 legacy records migrated in 36 hours with zero errors',
      quote: 'We were terrified of losing 12 years of patient history. Alpha III migration team mapped everything cleanly and our go-live was seamless.',
      author: 'Dr. Aisha Mahmud, Chief of Staff',
    },
  },
  {
    id: 'insurer',
    title: 'Insurer & HMO-Led Provider Networks',
    shortTitle: 'HMO Networks',
    tagline: 'Direct API integrations for live pre-auth, tariff rules, and digital remittances',
    description: 'Bridge the communication gap between healthcare providers and health maintenance organizations for instant eligibility verification and paperless claims.',
    targetAudience: 'HMO Operations Executives, Underwriters, Claims Managers',
    icon: 'Layers',
    highlights: [
      'Sub-second policy validation and active member eligibility checks',
      'Automated secondary diagnosis tariff rules to prevent invoice padding',
      'Standardized digital claim bundles with attached digital prescriptions and labs',
      'Automated reconciliation reducing payment cycles from 60 days to 10 days',
    ],
    caseStudy: {
      client: 'Integrated Health Managed Care',
      location: 'Nationwide Network',
      metric: '82% faster claim turnaround and 99.4% audit compliance',
      quote: 'Receiving claims electronically directly from MedSphere hospitals eliminated paper sorting and reduced dispute resolution times by over 80%.',
      author: 'Olumide Jacobs, Head of Provider Relations',
    },
  },
  {
    id: 'patient-engagement',
    title: 'Patient Engagement & Companion App',
    shortTitle: 'Patient Mobile App',
    tagline: 'Empower patients with their own health records, appointment booking, and reminders',
    description: 'Give patients continuous access to their verified lab results, doctor discharge summaries, medication schedules, and digital prescription refills on mobile.',
    targetAudience: 'Patients, Families, Chronic Disease Care Coordinators',
    icon: 'Smartphone',
    highlights: [
      'Instant access to authenticated doctor visit summaries and lab results',
      'Automated SMS & WhatsApp medication dosage and refill reminders',
      'Digital appointment scheduling with doctor calendar sync',
      'Secure payment of hospital bills, deposits, and telemedicine fees',
    ],
    caseStudy: {
      client: 'MedSphere Patient Network',
      location: 'Over 85,000 active app users',
      metric: '48% increase in chronic hypertension medication adherence',
      quote: 'Patients love having their test results on their phone. It eliminated crowds waiting around our records department for paper printouts.',
      author: 'Sister Grace Nwosu, Nursing Director',
    },
  },
];

export const FAQS_DATA: FAQItem[] = [
  {
    id: 'deploy-speed',
    category: 'deployment',
    q: 'How fast can our hospital deploy Alpha III MedSphere?',
    a: 'Most hospitals go live within 3 to 7 days after payment validation and guided onboarding. Self-serve CSV data imports run immediately. For hospitals with large historical databases, our managed migration engineering team conducts parallel ETL testing to ensure a smooth, zero-downtime weekend cutover.',
    keywords: ['deploy', 'time', 'fast', 'onboard', 'timeline', 'go live', 'setup'],
  },
  {
    id: 'migrate-emr',
    category: 'deployment',
    q: 'Can we migrate from our old in-house server or legacy EMR?',
    a: 'Yes. We support managed ETL migration from legacy MySQL, SQL Server, Access, OpenMRS, or custom software, as well as CSV/Excel column mapping for self-serve bulk imports. Historical records, diagnoses, and lab results are mapped into standard FHIR structures and linked to patient profiles.',
    keywords: ['migrate', 'emr', 'legacy', 'excel', 'csv', 'openmrs', 'data', 'history'],
  },
  {
    id: 'cross-facility',
    category: 'general',
    q: 'Do you support cross-facility record sharing between branches?',
    a: 'Yes. Authorized hospital groups can search partner facilities in their network, grant temporary record access, and export portable patient health summaries. Patients also retain complete consent control via the companion mobile application.',
    keywords: ['cross-facility', 'branches', 'share', 'network', 'multi-site', 'interoperability'],
  },
  {
    id: 'hmo-claims',
    category: 'billing',
    q: 'Do you support live HMO claim submission and pre-authorizations?',
    a: 'Yes. Built-in adapter integrations support instant policy verification, live pre-auth request submission, and automated electronic claim batching directly from the hospital billing module, eliminating duplicate paperwork and manual billing entries.',
    keywords: ['hmo', 'nhia', 'claim', 'submit', 'pre-auth', 'insurance', 'billing'],
  },
  {
    id: 'admin-mfa',
    category: 'security',
    q: 'Is Multi-Factor Authentication (MFA) required for hospital administrators?',
    a: 'Yes. To comply with NDPA 2023 and protect sensitive clinical data, all hospital administrator accounts must enroll in TOTP-based Multi-Factor Authentication (Google Authenticator, Microsoft Authenticator, or hardware keys) before accessing clinical databases or exporting records.',
    keywords: ['mfa', 'totp', 'security', '2fa', 'authenticator', 'admin', 'password'],
  },
  {
    id: 'seats-plans',
    category: 'billing',
    q: 'How do clinician seats map to HMS subscription plans?',
    a: 'Our plans are based on active clinical & administrative staff logins (Essential: 20 seats, Professional: 35 seats, Enterprise: 60 seats, Custom: Unlimited). Patients, registered visitors, and patient app users are completely unlimited with zero per-patient charges.',
    keywords: ['seats', 'plan', 'pricing', 'staff', 'clinician', 'limits', 'cost'],
  },
  {
    id: 'after-paystack',
    category: 'billing',
    q: 'What happens immediately after completing subscription checkout?',
    a: 'Once your payment is validated via Paystack or direct wire, your unique Hospital Tenant Code is generated instantly. You receive an automated onboarding email containing your secure workspace URL and single-use setup token to configure your hospital admin credentials.',
    keywords: ['paystack', 'checkout', 'payment', 'activate', 'activation', 'onboarding'],
  },
  {
    id: 'reset-password',
    category: 'security',
    q: 'How can hospital staff reset their passwords safely?',
    a: 'Staff members can initiate self-serve password resets using their registered corporate hospital email. For administrative security, support staff will never ask for your password or TOTP MFA token over the phone or email.',
    keywords: ['reset', 'password', 'forgot', 'email', 'security', 'login'],
  },
  {
    id: 'ndpa-compliance',
    category: 'compliance',
    q: 'Is Alpha III MedSphere compliant with NDPA 2023 and NDPR standards?',
    a: 'Yes. MedSphere is architected in strict adherence to the Nigeria Data Protection Act (NDPA 2023) and NDPR guidelines. We provide AES-256 encryption at rest, TLS 1.3 in transit, role-based audit logs, automated Data Protection Impact Assessment (DPIA) reporting, and designated DPO controls.',
    keywords: ['ndpa', 'ndpr', 'compliance', 'privacy', 'gdpr', 'security', 'encryption'],
  },
  {
    id: 'support-how',
    category: 'general',
    q: 'How does your 24/7 technical support work?',
    a: 'You can use the 24/7 AI Healthcare Assistant directly inside the portal for instant answers, or chat with our live support team. For urgent clinical emergencies or network issues, our engineering response team is available via priority phone and dedicated support channels.',
    keywords: ['support', 'help', 'contact', 'agent', 'phone', 'email', '24/7'],
  },
];

export const DOCUMENTATION_CHAPTERS: DocChapter[] = [
  {
    id: 'intro',
    category: 'Getting Started',
    title: 'Platform Architecture & Core Principles',
    summary: 'High-performance edge infrastructure, sub-50ms query design, and state management for healthcare applications.',
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
    id: 'edge-caching',
    category: 'Architecture & Edge',
    title: 'Sub-50ms Edge Infrastructure & Core Web Vitals',
    summary: 'How MedSphere leverages Vite, code-splitting, tree-shaking, and lightweight caching to maximize Core Web Vitals.',
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
    id: 'clinical-apis',
    category: 'Clinical APIs',
    title: 'HMO Claims & Electronic Health Records API',
    summary: 'REST & GraphQL schemas for patient encounter creation, HMO pre-authorization, and lab order dispatches.',
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
    id: 'component-library',
    category: 'Component Library',
    title: 'Design System & Accessible Component Kit',
    summary: 'Reusable UI building blocks: PatientBadges, VitalsCards, TriagePills, and Modal Dialogs with dark mode support.',
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
  {
    id: 'security-compliance',
    category: 'Compliance & Security',
    title: 'NDPA 2023, NDPR & ISO 27001 Security Blueprint',
    summary: 'End-to-end data encryption, granular RBAC permissions, audit logging, and automated DPIA compliance.',
    markdownContent: `
# Security & Statutory Compliance

Healthcare records contain the most sensitive human data. Alpha III MedSphere enforces defense-in-depth security principles.

### Key Security Safeguards
1. **Mandatory TOTP MFA**: Enforced across all administrator and medical records director accounts.
2. **Immutable Audit Trails**: Every chart view, export, prescription change, or diagnosis edit is cryptographically recorded with staff ID and IP timestamp.
3. **Data Protection Officer (DPO) Toolkit**: Built-in tools for patient data portability requests, rectification, and statutory breach notifications.
    `,
    codeSnippet: {
      language: 'typescript',
      filename: 'src/security/auditLogger.ts',
      code: `export interface AuditEvent {
  actorId: string;
  actorRole: 'Doctor' | 'Nurse' | 'Pharmacist' | 'Admin' | 'Billing';
  action: 'READ' | 'WRITE' | 'EXPORT' | 'DELETE' | 'DISPENSE';
  targetResource: string;
  patientId?: string;
  timestamp: string;
  ipAddress: string;
}

export function logAuditEvent(event: AuditEvent): void {
  // Dispatched asynchronously to immutable compliance ledger
  console.info('[MEDSPHERE_AUDIT]', JSON.stringify(event));
}`,
    },
  },
];

export const INITIAL_TEST_CASES: TestCase[] = [
  {
    id: 'test-1',
    suite: 'Unit: Core Utilities',
    name: 'Currency & Naira Formatting',
    description: 'Verifies accurate formatting for subscription tiers, discount multipliers, and HMO billing numbers.',
    status: 'passed',
    durationMs: 4,
    assertion: 'expect(formatNaira(35000)).toBe("₦35,000")',
  },
  {
    id: 'test-2',
    suite: 'Unit: Pricing Engine',
    name: 'Annual Subscription 2-Month Discount Calculation',
    description: 'Validates that annual plan pricing correctly computes 10x monthly rate (giving 2 months free).',
    status: 'passed',
    durationMs: 6,
    assertion: 'expect(calculateAnnualCost(20000)).toBe(200000)',
  },
  {
    id: 'test-3',
    suite: 'Unit: Pricing Engine',
    name: 'Multi-Branch Add-on & Seat Tier Calculation',
    description: 'Ensures secondary hospital branch seats inherit group discounts while maintaining proper isolation.',
    status: 'passed',
    durationMs: 8,
    assertion: 'expect(calculateBranchCost(3, "professional")).toBe(105000)',
  },
  {
    id: 'test-4',
    suite: 'Integration: HMO Claims',
    name: 'Pre-Authorization & Tariff Validation Rule',
    description: 'Simulates direct HMO policy verification and tariff validation against standard medical procedure codes.',
    status: 'passed',
    durationMs: 14,
    assertion: 'expect(verifyHmoEligibility("HYG-9021")).resolves.toMatchObject({ eligible: true, tariffCap: 500000 })',
  },
  {
    id: 'test-5',
    suite: 'Integration: Patient Encounters',
    name: 'Clinical SOAP Note Creation & Allergy Collision Detection',
    description: 'Verifies that adding a penicillin prescription to a patient with a documented penicillin allergy throws an instant block.',
    status: 'passed',
    durationMs: 11,
    assertion: 'expect(() => prescribe("Amoxicillin", ["Penicillin"])).toThrow(/Allergy Alert/)',
  },
  {
    id: 'test-6',
    suite: 'Edge & Core Web Vitals',
    name: 'Sub-50ms Drug Formulary Cache Latency',
    description: 'Tests local LRU in-memory cache lookup time for 1,800+ hospital drugs.',
    status: 'passed',
    durationMs: 2,
    assertion: 'expect(measureFormularyLookupTime("Paracetamol")).toBeLessThan(5)',
  },
  {
    id: 'test-6b',
    suite: 'Edge & Core Web Vitals',
    name: 'Largest Contentful Paint (LCP) Benchmark',
    description: 'Verifies page primary viewport load achieves sub-2.5s rendering SLA on 4G network profile.',
    status: 'passed',
    durationMs: 3,
    assertion: 'expect(window.__medSphereVitals.getMetrics().lcp || 420).toBeLessThan(2500)',
  },
  {
    id: 'test-6c',
    suite: 'Edge & Core Web Vitals',
    name: 'Cumulative Layout Shift (CLS) Stability Budget',
    description: 'Monitors dynamic DOM hydration and layout shift stability threshold below Google 0.10 guideline.',
    status: 'passed',
    durationMs: 1,
    assertion: 'expect(window.__medSphereVitals.getMetrics().cls).toBeLessThan(0.10)',
  },
  {
    id: 'test-7',
    suite: 'Accessibility & Security',
    name: 'WCAG AAA Contrast & TOTP MFA Validation Guard',
    description: 'Confirms that administrative routes strictly guard against unauthenticated or non-MFA sessions.',
    status: 'passed',
    durationMs: 5,
    assertion: 'expect(checkAdminAccess({ role: "Admin", mfaVerified: false })).toBe(false)',
  },
  {
    id: 'test-8',
    suite: 'Integration: HMO Claims',
    name: 'NHIA Batch Electronic Invoice Generation',
    description: 'Validates that NHIA XML/JSON batch formatting passes national health insurance structural schemas.',
    status: 'passed',
    durationMs: 18,
    assertion: 'expect(generateNHIABatch(sampleClaims).valid).toBe(true)',
  },
];

export const MOCK_PATIENT_RECORDS: PatientRecord[] = [
  {
    id: 'pat-1',
    hospitalNumber: 'MED-90241',
    fullName: 'Aisha Bello',
    age: 34,
    gender: 'Female',
    bloodGroup: 'O+',
    allergies: ['Penicillin (Severe Urticaria)', 'Sulfa Drugs'],
    hmoProvider: 'Hygeia HMO',
    hmoPolicyId: 'HYG-992-04B',
    vitals: {
      bloodPressure: '124/82',
      pulse: 74,
      temp: 36.8,
      spo2: 99,
      weightKg: 64,
    },
    currentComplaint: 'Recurrent throbbing right-sided headache with photophobia and nausea for 3 days.',
    diagnoses: ['G43.109 - Migraine with aura', 'R51.9 - Headache, unspecified'],
    prescriptions: [
      { drug: 'Sumatriptan 50mg', dosage: '1 tablet', frequency: 'Stat at onset of migraine', status: 'Dispensed' },
      { drug: 'Metoclopramide 10mg', dosage: '1 tablet', frequency: 'TDS PRN for nausea', status: 'Dispensed' },
    ],
    labRequests: [
      { test: 'Full Blood Count (FBC)', status: 'Completed', result: 'Hb: 13.6 g/dL, WBC: 6.2 x10^9/L (Normal)' },
      { test: 'Serum Electrolytes, Urea & Creatinine', status: 'Completed', result: 'Na: 140, K: 4.2, Creatinine: 78 umol/L' },
    ],
    claimStatus: 'Approved',
  },
  {
    id: 'pat-2',
    hospitalNumber: 'MED-90242',
    fullName: 'Emeka Chukwudi Obi',
    age: 48,
    gender: 'Male',
    bloodGroup: 'A+',
    allergies: ['No Known Drug Allergies (NKDA)'],
    hmoProvider: 'Reliance HMO',
    hmoPolicyId: 'REL-440-19A',
    vitals: {
      bloodPressure: '148/92',
      pulse: 82,
      temp: 37.1,
      spo2: 98,
      weightKg: 86,
    },
    currentComplaint: 'Routine hypertension follow-up. Occasional morning dizziness.',
    diagnoses: ['I10 - Essential (primary) hypertension', 'E78.5 - Hyperlipidemia, unspecified'],
    prescriptions: [
      { drug: 'Amlodipine 10mg', dosage: '1 tablet', frequency: 'Once daily mane', status: 'Pending' },
      { drug: 'Atorvastatin 20mg', dosage: '1 tablet', frequency: 'Once daily nocte', status: 'Pending' },
    ],
    labRequests: [
      { test: 'Fasting Lipid Profile', status: 'In-Progress' },
      { test: '12-Lead Electrocardiogram (ECG)', status: 'Completed', result: 'Sinus rhythm. No acute ST-T changes.' },
    ],
    claimStatus: 'Submitted',
  },
  {
    id: 'pat-3',
    hospitalNumber: 'MED-90243',
    fullName: 'Fatima Ibrahim',
    age: 29,
    gender: 'Female',
    bloodGroup: 'B+',
    allergies: ['Aspirin (Mild Gastritis)'],
    hmoProvider: 'AXA Mansard Health',
    hmoPolicyId: 'AXA-701-92X',
    vitals: {
      bloodPressure: '116/72',
      pulse: 78,
      temp: 36.6,
      spo2: 100,
      weightKg: 71,
    },
    currentComplaint: 'Antenatal checkup at 36 weeks gestation. Good fetal kicks reported.',
    diagnoses: ['Z34.80 - Supervision of other normal pregnancy, third trimester'],
    prescriptions: [
      { drug: 'Ferrous Sulphate 200mg', dosage: '1 tablet', frequency: 'Once daily', status: 'Dispensed' },
      { drug: 'Folic Acid 5mg', dosage: '1 tablet', frequency: 'Once daily', status: 'Dispensed' },
    ],
    labRequests: [
      { test: 'Obstetric Ultrasound Scan (3rd Trimester)', status: 'Completed', result: 'Live singleton fetus in cephalic presentation. AFI 14.2cm.' },
    ],
    claimStatus: 'Approved',
  },
];
