export interface ScamPatternDefinition {
  id: string;
  name: string;
  shortDescription: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  commonIndicators: string[];
  modusOperandi: string;
  whatLegitimateCompaniesDo: string;
  safeAction: string;
}

export const SCAM_PATTERN_LIBRARY: ScamPatternDefinition[] = [
  {
    id: 'recruitment-fee-scam',
    name: 'Recruitment & Registration Fee Scam',
    shortDescription: 'Demanding upfront registration, slot-booking, or interview fees before hiring.',
    severity: 'CRITICAL',
    commonIndicators: [
      'Candidate asked to pay a "refundable registration fee"',
      'Fee required to "book an interview slot" or "secure candidate ID"',
      'Payment demanded via UPI, personal bank transfer, or crypto',
      'Promise that fees will be reimbursed with the first month salary',
    ],
    modusOperandi:
      'Fraudsters claim high competition for positions and demand a fee to register your application or lock in an interview schedule. Once money is sent, communication ceases or further fees are demanded.',
    whatLegitimateCompaniesDo:
      'Legitimate employers and authorized recruitment agencies NEVER charge candidates for applying, testing, or interviewing. Corporate recruitment costs are funded entirely by the employer.',
    safeAction: 'Never transfer funds for an interview slot or application registration under any circumstances.',
  },
  {
    id: 'fake-interview-scam',
    name: 'Fake Interview / Questionnaire-Only Scam',
    shortDescription: 'Issuing job offers after only text questionnaires, Google Forms, or automated Telegram chats without real interviews.',
    severity: 'HIGH',
    commonIndicators: [
      'Immediate selection based solely on a Google Form or email questionnaire',
      'No live video or face-to-face interview with verified team members',
      'Extremely quick hiring cycle (e.g., job offer within 2–6 hours of first contact)',
      'Interviewer refuses to turn on camera or uses generic automated text',
    ],
    modusOperandi:
      'Scammers send a questionnaire consisting of generic questions (e.g., "Are you hardworking?"). Within hours, they declare you "selected" for a high-paying role to create artificial excitement before requesting money or bank details.',
    whatLegitimateCompaniesDo:
      'Authentic companies conduct multi-stage evaluations including live interactive technical/behavioral interviews, manager discussions, and HR rounds before any offer.',
    safeAction: 'Treat any "offer" issued without live audio/video interaction with real company personnel as high-risk.',
  },
  {
    id: 'fake-offer-letter',
    name: 'Fake Offer Letter Scam',
    shortDescription: 'Fabricated offer letters with copied corporate logos, grammatical oddities, or suspicious stipulations.',
    severity: 'HIGH',
    commonIndicators: [
      'Letter contains mismatched logos, irregular fonts, or amateur stamps',
      'Includes clauses requiring pre-joining deposits or hardware buy-ins',
      'Sender email address uses generic domain (@gmail, @outlook) or lookalike domain',
      'No verifiable HR manager name or corporate physical address that matches corporate registries',
    ],
    modusOperandi:
      'Scammers download legitimate company letterheads from online sources, edit in the candidate\'s name and an inflated compensation package, and insert clauses requiring advance deposits or equipment purchases.',
    whatLegitimateCompaniesDo:
      'Official offer letters originate from corporate HR management platforms (Workday, Greenhouse, Lever) or verified corporate email domains, followed by structured background screening through accredited providers.',
    safeAction: 'Cross-check the signatory and offer terms directly with the company\'s official HR department using contact details found on their primary website.',
  },
  {
    id: 'impersonation-scam',
    name: 'Executive & Brand Impersonation',
    shortDescription: 'Posers pretending to be HR executives, recruiters, or talent partners of renowned global brands.',
    severity: 'CRITICAL',
    commonIndicators: [
      'Recruiter claims to represent Microsoft, Amazon, Google, or TCS from a free Gmail/Outlook/Telegram account',
      'Email address uses a lookalike domain (e.g., @tcs-careers-portal.com instead of @tcs.com)',
      'LinkedIn profile has very few connections, recently created, or stolen photos',
      'Refusal to send an official confirmation from a corporate @company.com address',
    ],
    modusOperandi:
      'Criminals capitalize on the trusted reputation of Fortune 500 or well-known tech firms. They create plausible personas to lure candidates into believing they have been scouted by an elite employer.',
    whatLegitimateCompaniesDo:
      'Corporate recruiters at major firms communicate exclusively via company-owned domain emails, verified LinkedIn Recruiter accounts, or official applicant portals.',
    safeAction: 'Request that the recruiter message you from their verified corporate email address. If they make excuses, cease communication.',
  },
  {
    id: 'work-from-home-scam',
    name: 'High-Pay Vague Work-from-Home Scam',
    shortDescription: 'Exorbitant payouts for trivial remote tasks (data entry, video liking, app reviews).',
    severity: 'HIGH',
    commonIndicators: [
      'Claims of ₹5,000–₹15,000/day or $300/day for 1–2 hours of simple remote tasks',
      'No specific technical or professional skills required',
      'Task involves "liking YouTube videos", "rating hotel listings", or "optimizing merchant apps"',
      'Early small payouts designed to build trust before requesting a large deposit',
    ],
    modusOperandi:
      'Known as task-based or brush scams. Victims perform trivial tasks and receive a small payout (e.g. ₹500). Then they are asked to deposit ₹5,000 to "unlock high-tier VIP tasks" and withdraw accumulated earnings, which are subsequently frozen.',
    whatLegitimateCompaniesDo:
      'Real remote roles require genuine professional skills, standard employment contracts, tax forms, and realistic market-rate compensation based on hourly or salaried structures.',
    safeAction: 'Never participate in jobs that ask you to deposit money in order to unlock tasks or withdraw earnings.',
  },
  {
    id: 'equipment-purchase-scam',
    name: 'Hardware & Equipment Advance Check Scam',
    shortDescription: 'Instructing candidates to purchase home-office laptops or software from a specific "vendor".',
    severity: 'CRITICAL',
    commonIndicators: [
      'Offer promises a "home office allowance" but directs you to an exclusive online vendor',
      'Candidate is sent a counterfeit check to deposit and wire money to the vendor',
      'Request to buy gift cards or cryptocurrency to pay the company\'s IT distributor',
      'Urgent pressure to make hardware purchases before orientation day',
    ],
    modusOperandi:
      'The scammer sends a fake digital check or wire transfer. The bank temporarily credits the funds. The victim sends money to the "vendor" (controlled by the scammer). Days later, the check bounces and the victim owes the bank the full amount.',
    whatLegitimateCompaniesDo:
      'Legitimate enterprises ship company-configured hardware directly to remote employees, or utilize approved enterprise procurement portals without requiring personal employee payments.',
    safeAction: 'Never accept checks to buy equipment from a third-party vendor, and never use personal funds to purchase company hardware.',
  },
  {
    id: 'training-fee-scam',
    name: 'Mandatory Pre-Joining Training Fee',
    shortDescription: 'Requiring candidate to pay for mandatory certification, training modules, or software licenses before joining.',
    severity: 'HIGH',
    commonIndicators: [
      'Employment contingent on purchasing a specific training module from an unaccredited platform',
      'Recruiter promises that training fees will be reimbursed on completion',
      'Training portal looks improvised or created solely for the job vacancy',
      'Trainer and recruiter are closely linked or operating from the same phone number',
    ],
    modusOperandi:
      'The job offer is merely bait to sell low-quality or non-existent training packages. Once the candidate pays for the course, the promised job role disappears.',
    whatLegitimateCompaniesDo:
      'Legitimate employer onboarding and job-specific training are provided free of cost by the company during paid working hours.',
    safeAction: 'Do not pay for mandatory private training courses as a prerequisite for a job offer.',
  },
  {
    id: 'identity-theft-attempt',
    name: 'Recruitment Identity Theft Phishing',
    shortDescription: 'Demanding Aadhaar/SSN, passport scans, bank account logins, or biometric proofs early in the process.',
    severity: 'CRITICAL',
    commonIndicators: [
      'Asking for passport, national ID card, or bank account login details before an interview',
      'Requesting photo of candidate holding their ID card (selfie verification) before any formal offer',
      'Sending links to unverified external portals requesting credit scores or bank passwords',
      'Asking for date of birth, mother\'s maiden name, and complete bank account credentials',
    ],
    modusOperandi:
      'Identity thieves harvest sensitive KYC documents under the guise of "pre-employment background screening" to open fraudulent credit lines, mule bank accounts, or crypto wallets.',
    whatLegitimateCompaniesDo:
      'Sensitive background checks only occur AFTER a formal offer is signed, and are conducted through recognized screening firms with clear privacy compliance.',
    safeAction: 'Do not provide full national ID numbers, bank statements, or selfie-ID photos until you have confirmed a legitimate offer through official corporate channels.',
  },
  {
    id: 'phishing-recruitment',
    name: 'Credential Phishing Links',
    shortDescription: 'Sending suspicious links, password-protected archives, or fake login portals to steal credentials.',
    severity: 'CRITICAL',
    commonIndicators: [
      'Link sent to "fill out your employment profile" on an unverified domain',
      'Requires candidate to log in with their Google, LinkedIn, or Microsoft credentials on a third-party page',
      'Candidate receives a .zip or .rar file claiming to be "test specs" or "job description"',
      'Files containing executable scripts (.exe, .scr, .bat, macro-enabled .docm)',
    ],
    modusOperandi:
      'Attackers disguise malware or credential-stealing phishing sites as job application portals or coding challenges.',
    whatLegitimateCompaniesDo:
      'Legitimate companies use established portals (LinkedIn, Greenhouse, Lever, SmartRecruiters) or public job boards without asking you to sign into external services.',
    safeAction: 'Never enter account passwords on unverified sites or open compressed archive attachments from unknown recruiters.',
  },
  {
    id: 'crypto-payment-scam',
    name: 'Cryptocurrency & Gift Card Scam',
    shortDescription: 'Demanding or offering compensation exclusively in cryptocurrency, gift cards, or untraceable channels.',
    severity: 'CRITICAL',
    commonIndicators: [
      'Recruiter insists on paying or receiving funds via USDT, Bitcoin, or Apple/Amazon gift cards',
      'Job description involves "transferring funds" or "cryptocurrency arbitrage testing"',
      'No standard payroll tax deduction (TDS, W-2, PAYE) discussed',
      'Wallet address provided for "verification collateral"',
    ],
    modusOperandi:
      'Cryptocurrency and gift cards are irreversible. Fraudsters use victims as money mules or steal funds with zero possibility of bank chargeback.',
    whatLegitimateCompaniesDo:
      'Corporate payroll operates through regulated banking channels with proper tax documentation and direct bank deposits.',
    safeAction: 'Cease contact immediately if any party requests payments in crypto tokens or retail gift cards.',
  },
  {
    id: 'telegram-whatsapp-scam',
    name: 'Solely Messaging-App Recruitment',
    shortDescription: 'Recruitment strictly conducted through encrypted messaging without corporate email verification.',
    severity: 'HIGH',
    commonIndicators: [
      'Initial cold message via WhatsApp from an international country code (e.g., +234, +62, +880, +1)',
      'Insistence on migrating immediately to Telegram secretly',
      'Refusal to provide an official corporate email or phone number',
      'Profile pictures depicting generic corporate models or copied executive headshots',
    ],
    modusOperandi:
      'WhatsApp and Telegram allow scammers to operate anonymously from disposable numbers and delete entire chat histories for both parties if detected.',
    whatLegitimateCompaniesDo:
      'While recruiters may initially reach out on WhatsApp/LinkedIn, formal interview scheduling and documentation always proceed through verifiable corporate email.',
    safeAction: 'Insist on continuing the hiring process through a corporate email address ending in the company\'s official web domain.',
  },
  {
    id: 'fake-internship',
    name: 'Pay-for-Internship / Certificate Mills',
    shortDescription: 'Charging fresh graduates or students money for an "internship letter" or "live project experience".',
    severity: 'MEDIUM',
    commonIndicators: [
      'Student asked to pay ₹1,500–₹10,000 for "industrial training and guaranteed internship"',
      'No meaningful interview or prerequisite skills evaluated',
      'Internship consists solely of watching pre-recorded videos or recruiting other students',
      'Certificate issued without any practical evaluation or team collaboration',
    ],
    modusOperandi:
      'Commercial training vendors pose as IT software development agencies offering internships, exploiting student desperation for academic credit.',
    whatLegitimateCompaniesDo:
      'Legitimate internships provide hands-on mentorship, and in reputable technology companies, interns are compensated with a stipend rather than charged.',
    safeAction: 'Avoid paying for internships; look for university-verified campus drives or transparent open-source apprenticeships.',
  },
];
