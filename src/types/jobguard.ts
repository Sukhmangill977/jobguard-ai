export interface AttachmentData {
  filename: string;
  mimeType: string;
  base64Data: string; // raw base64 without prefix
  sizeBytes?: number;
}

export type PaymentAskedOption = 'no' | 'yes' | 'not_sure';

export interface JobSubmission {
  jobTitle?: string;
  companyName?: string;
  salary?: string;
  location?: string;
  jobUrl?: string;
  jobDescription: string;
  
  recruiterName?: string;
  recruiterEmail?: string;
  recruiterPhone?: string;
  recruiterLinkedIn?: string;
  recruiterMessagingHandle?: string;
  recruiterMessage?: string;
  
  interviewInvitation?: string;
  offerLetterText?: string;
  attachment?: AttachmentData;
  
  paymentAsked: PaymentAskedOption;
  paymentReasons: string[];
  paymentDetails?: string;
}

export type RiskLevel =
  | 'LOW'
  | 'GENERALLY_LOW'
  | 'CAUTION'
  | 'HIGH'
  | 'VERY_HIGH'
  | 'INSUFFICIENT_EVIDENCE';

export type RiskVerdict =
  | 'Appears Low Risk'
  | 'Proceed With Caution'
  | 'High Risk'
  | 'Very High Risk'
  | 'Insufficient Evidence';

export type RecommendedDecision =
  | 'Proceed'
  | 'Proceed After Verification'
  | 'Pause and Verify'
  | 'Do Not Pay / Do Not Proceed Until Verified'
  | 'Not Enough Information';

export interface RedFlag {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  whyItMatters: string;
  evidenceQuote: string;
  category: string;
}

export interface PositiveSignal {
  id: string;
  title: string;
  detail: string;
  evidenceQuote?: string;
}

export interface UnknownItem {
  id: string;
  item: string;
  impact: string;
  howToVerify: string;
}

export interface EvidenceItem {
  signal: string;
  evidence: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Neutral' | 'Unknown';
  confidence: 'High' | 'Medium' | 'Low' | 'Unknown';
  category: string;
}

export interface MatchedScamPattern {
  name: string;
  matched: boolean;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  relevanceExplanation: string;
}

export interface CategoryAssessment {
  status: 'healthy' | 'caution' | 'warning' | 'unknown';
  notes: string;
}

export interface VerificationChecklistStep {
  stepNumber: number;
  title: string;
  instruction: string;
  criticalWarning?: string;
}

export interface RiskAnalysisResult {
  id: string;
  timestamp: string;
  jobTitle: string;
  companyName: string;
  summary: string;
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  verdict: RiskVerdict;
  verdictHeadline: string;
  recommendedDecision: RecommendedDecision;
  decisionRationale: string;
  redFlags: RedFlag[];
  positiveSignals: PositiveSignal[];
  unknowns: UnknownItem[];
  evidenceTable: EvidenceItem[];
  matchedScamPatterns: MatchedScamPattern[];
  categories: {
    companyAuthenticity: CategoryAssessment;
    recruiterAuthenticity: CategoryAssessment;
    jobDescriptionRisk: CategoryAssessment;
    paymentRisk: CategoryAssessment;
    communicationRisk: CategoryAssessment;
    offerLetterRisk: CategoryAssessment;
    linkWebsiteRisk: CategoryAssessment;
  };
  recommendedActions: {
    doNow: string[];
    beforeProceeding: string[];
    ifVerified: string[];
  };
  verificationChecklist: VerificationChecklistStep[];
  doNotDo: string[];
  sensitiveDataDetectedInInput?: boolean;
}
