export interface BusinessFormData {
  name: string;
  website: string;
  businessType: 'saas' | 'ecommerce' | 'mobile' | 'other';
  jurisdictions: string[];
  dataPractices: {
    collectsPersonalData: boolean;
    collectsPaymentData: boolean;
    usesCookies: boolean;
    sharesDataWithThirdParties: boolean;
    dataRetentionPeriod: string;
    userRights: string[];
  };
}

export interface GeneratedDocument {
  content: string;
  compliance: {
    gdpr: boolean;
    ccpa: boolean;
    dpdp: boolean;
  };
  recommendations: string[];
}

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const BUSINESS_TYPES: Array<{ value: string; label: string; description: string; icon: string }> = [
  {
    value: 'saas',
    label: 'SaaS Platform',
    description: 'Software as a Service applications',
    icon: 'fas fa-cloud'
  },
  {
    value: 'ecommerce',
    label: 'E-commerce',
    description: 'Online retail and marketplaces',
    icon: 'fas fa-shopping-cart'
  },
  {
    value: 'mobile',
    label: 'Mobile App',
    description: 'iOS and Android applications',
    icon: 'fas fa-mobile-alt'
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Custom business model',
    icon: 'fas fa-ellipsis-h'
  }
];

export const JURISDICTIONS = [
  {
    value: 'gdpr',
    label: 'European Union (GDPR)',
    description: 'General Data Protection Regulation',
    required: false,
    badge: 'Comprehensive'
  },
  {
    value: 'ccpa',
    label: 'California, USA (CCPA)',
    description: 'California Consumer Privacy Act',
    required: false,
    badge: 'Recommended'
  },
  {
    value: 'dpdp',
    label: 'India (DPDP Act)',
    description: 'Digital Personal Data Protection Act',
    required: false,
    badge: 'New'
  }
];

export const DOCUMENT_TYPES: DocumentType[] = [
  {
    id: 'privacy_policy',
    name: 'Privacy Policy',
    description: 'Comprehensive privacy policy covering data collection, usage, and user rights',
    icon: 'fas fa-shield-alt'
  },
  {
    id: 'terms_of_service',
    name: 'Terms of Service',
    description: 'Legal terms and conditions for using your service',
    icon: 'fas fa-file-contract'
  }
];
