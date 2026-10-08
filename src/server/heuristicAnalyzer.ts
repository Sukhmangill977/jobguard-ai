import { JobSubmission, RiskAnalysisResult } from '../types/jobguard';

export function runHeuristicAnalysis(input: JobSubmission): RiskAnalysisResult {
  const fullText = [
    input.jobTitle || '',
    input.companyName || '',
    input.jobDescription || '',
    input.recruiterName || '',
    input.recruiterEmail || '',
    input.recruiterPhone || '',
    input.recruiterMessagingHandle || '',
    input.recruiterMessage || '',
    input.interviewInvitation || '',
    input.offerLetterText || '',
    input.paymentDetails || '',
  ].join(' ').toLowerCase();

  const isMinimalInput =
    (input.jobDescription || '').trim().length < 40 &&
    (input.recruiterMessage || '').trim().length < 30 &&
    (input.offerLetterText || '').trim().length < 30 &&
    input.paymentAsked === 'not_sure';

  if (isMinimalInput) {
    return {
      id: 'jg-' + Date.now(),
      timestamp: new Date().toISOString(),
      jobTitle: input.jobTitle || 'Unspecified Role',
      companyName: input.companyName || 'Unspecified Organization',
      summary: 'Insufficient factual evidence provided to establish an authentic or fraudulent pattern. Crucial details such as full job scope, verified employer channels, and formal communication are missing.',
      riskScore: 25,
      riskLevel: 'INSUFFICIENT_EVIDENCE',
      confidence: 'LOW',
      verdict: 'Insufficient Evidence',
      verdictHeadline: 'Evidence Is Too Sparse for a Confident Assessment',
      recommendedDecision: 'Not Enough Information',
      decisionRationale: 'The submission does not contain enough verified text, recruiter communication, or formal documentation to evaluate recruitment integrity safely.',
      redFlags: [],
      positiveSignals: [],
      unknowns: [
        {
          id: 'u-1',
          item: 'Official Employer Identity & Web Presence',
          impact: 'Cannot determine if the hiring entity is an established organization or an unverified persona.',
          howToVerify: 'Ask the recruiter for the exact corporate website and careers portal link.',
        },
        {
          id: 'u-2',
          item: 'Recruiter Affiliation & Corporate Channel',
          impact: 'No corporate email or verifiable business phone was provided.',
          howToVerify: 'Request that all interview details be sent to your email from a company-owned domain.',
        },
      ],
      evidenceTable: [
        {
          signal: 'Input Completeness',
          evidence: 'Very brief summary with missing job details',
          severity: 'Unknown',
          confidence: 'Low',
          category: 'Evidence Quality',
        },
      ],
      matchedScamPatterns: [],
      categories: {
        companyAuthenticity: { status: 'unknown', notes: 'Company name and domain not provided for evaluation.' },
        recruiterAuthenticity: { status: 'unknown', notes: 'Recruiter credentials could not be checked.' },
        jobDescriptionRisk: { status: 'unknown', notes: 'Detailed duties and qualifications were omitted.' },
        paymentRisk: { status: 'healthy', notes: 'No explicit payment request was logged in the submission.' },
        communicationRisk: { status: 'caution', notes: 'Communication channel is informal or incomplete.' },
        offerLetterRisk: { status: 'unknown', notes: 'No formal written offer provided.' },
        linkWebsiteRisk: { status: 'unknown', notes: 'No employer website link provided.' },
      },
      recommendedActions: {
        doNow: [
          'Do not share personal government documents (e.g., passport, national ID) until company identity is clear.',
          'Request an official job specification document and corporate email from the contact.',
        ],
        beforeProceeding: [
          'Locate the hiring company on official business registers or corporate directories.',
          'Confirm that the person contacting you is listed in the organization.',
        ],
        ifVerified: [
          'Request a formal video interview with members of the department.',
        ],
      },
      verificationChecklist: [
        {
          stepNumber: 1,
          title: 'Obtain Official Company Name and Website',
          instruction: 'Ask the sender for the registered legal name of the enterprise and their official public website.',
        },
        {
          stepNumber: 2,
          title: 'Request Email from Corporate Domain',
          instruction: 'Instruct the sender to dispatch interview guidelines from an email ending in @companyname.com.',
        },
      ],
      doNotDo: [
        'Do not send money or advance fees.',
        'Do not provide bank account logins, OTPs, or passwords.',
        'Do not download unverified archive files (.zip, .exe).',
      ],
    };
  }

  // Calculate weighted risks
  let riskScore = 12;
  const redFlags: RiskAnalysisResult['redFlags'] = [];
  const positiveSignals: RiskAnalysisResult['positiveSignals'] = [];
  const unknowns: RiskAnalysisResult['unknowns'] = [];
  const evidenceTable: RiskAnalysisResult['evidenceTable'] = [];
  const matchedPatterns: RiskAnalysisResult['matchedScamPatterns'] = [];

  // Check 1: Payment Request (CRITICAL)
  if (input.paymentAsked === 'yes' || /registration fee|slot booking|training fee|security deposit|refundable fee|pay ₹|pay rs|wire transfer|crypto|upi|gpay/i.test(fullText)) {
    riskScore += 55;
    const paymentDetail = input.paymentDetails || (input.paymentReasons.length ? input.paymentReasons.join(', ') : 'Fee required before interview/offer');
    redFlags.push({
      id: 'rf-payment',
      title: 'Upfront Payment Requested Before Hiring',
      severity: 'CRITICAL',
      whyItMatters: 'Legitimate employers never require candidates to pay registration, interview booking, security deposits, or background check fees.',
      evidenceQuote: paymentDetail,
      category: 'Payment Risk',
    });
    evidenceTable.push({
      signal: 'Upfront Payment Requirement',
      evidence: paymentDetail,
      severity: 'Critical',
      confidence: 'High',
      category: 'Payment Risk',
    });
    matchedPatterns.push({
      name: 'Recruitment & Registration Fee Scam',
      matched: true,
      severity: 'CRITICAL',
      description: 'Demanding upfront registration, slot-booking, or interview fees before hiring.',
      relevanceExplanation: `The recruiter or offer specifies payment requirement (${paymentDetail}), which strongly mirrors fee-solicitation tactics.`,
    });
  } else if (input.paymentAsked === 'no') {
    positiveSignals.push({
      id: 'ps-no-payment',
      title: 'Zero Payment Demanded',
      detail: 'No request for candidate fees, security deposits, or software buy-in was reported.',
    });
    evidenceTable.push({
      signal: 'Monetary Charges',
      evidence: 'Candidate confirmed no payment was requested',
      severity: 'Neutral',
      confidence: 'High',
      category: 'Payment Risk',
    });
  }

  // Check 2: Free email service for claimed corporate recruiter
  const email = (input.recruiterEmail || '').toLowerCase();
  const isFreeEmail = /@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|rediffmail\.com|proton\.me)$/i.test(email);
  if (isFreeEmail) {
    riskScore += 18;
    redFlags.push({
      id: 'rf-email',
      title: 'Free Webmail Address Used for Corporate Hiring',
      severity: 'HIGH',
      whyItMatters: 'Established corporate recruiters communicate through organization-owned domains (e.g. name@company.com), not public consumer webmail.',
      evidenceQuote: input.recruiterEmail || '',
      category: 'Recruiter Authenticity',
    });
    evidenceTable.push({
      signal: 'Recruiter Email Domain',
      evidence: `Consumer mailbox (${input.recruiterEmail}) instead of corporate domain`,
      severity: 'High',
      confidence: 'High',
      category: 'Recruiter Authenticity',
    });
    matchedPatterns.push({
      name: 'Executive & Brand Impersonation',
      matched: true,
      severity: 'HIGH',
      description: 'Using generic consumer email accounts while claiming to represent a corporate entity.',
      relevanceExplanation: `Recruiter uses a free webmail provider (${input.recruiterEmail}) rather than an authenticated enterprise mailbox.`,
    });
  } else if (email && !isFreeEmail) {
    positiveSignals.push({
      id: 'ps-corp-email',
      title: 'Custom Corporate Email Domain',
      detail: `Sender email (${email}) originates from a proprietary domain rather than free webmail.`,
      evidenceQuote: email,
    });
    evidenceTable.push({
      signal: 'Recruiter Email Domain',
      evidence: email,
      severity: 'Neutral',
      confidence: 'High',
      category: 'Recruiter Authenticity',
    });
  }

  // Check 3: WhatsApp / Telegram Sole Recruitment Channel & International Cold Contact
  const messaging = (input.recruiterMessagingHandle || '') + ' ' + (input.recruiterPhone || '') + ' ' + (input.recruiterMessage || '');
  if (/telegram|whatsapp|wa\.me|t\.me/i.test(messaging) && !input.jobUrl && !email) {
    riskScore += 16;
    redFlags.push({
      id: 'rf-messaging-only',
      title: 'Recruitment Solely Conducted on Instant Messaging',
      severity: 'HIGH',
      whyItMatters: 'Scammers frequently route candidates through Telegram or WhatsApp to evade corporate email logging, domain verification, and traceability.',
      evidenceQuote: input.recruiterMessagingHandle || input.recruiterPhone || 'Telegram/WhatsApp communication',
      category: 'Communication Risk',
    });
    matchedPatterns.push({
      name: 'Solely Messaging-App Recruitment',
      matched: true,
      severity: 'HIGH',
      description: 'Recruitment strictly conducted through encrypted messaging without corporate email verification.',
      relevanceExplanation: 'Candidate outreach and interview coordination are confined to instant messaging platforms.',
    });
  }

  // Check 4: Unrealistic salary promises / Vague Duties
  if (/no experience needed|2-3 hours per day|earn 80000|earn 100000|120000|daily income|daily payout|instant selection|congratulations! you have been selected/i.test(fullText)) {
    riskScore += 16;
    redFlags.push({
      id: 'rf-unrealistic',
      title: 'Unusually High Compensation for Trivial Requirements',
      severity: 'HIGH',
      whyItMatters: 'Offering premium executive compensation (e.g. ₹80k–₹120k/month or daily cash) for basic tasks with zero experience is an established scam lure.',
      evidenceQuote: input.salary ? `Salary: ${input.salary}` : 'Promises of substantial income for minimal effort',
      category: 'Job Description Risk',
    });
    evidenceTable.push({
      signal: 'Compensation vs Requirement Balance',
      evidence: input.salary || 'Inflated payout for entry-level tasks',
      severity: 'High',
      confidence: 'High',
      category: 'Job Description Risk',
    });
    matchedPatterns.push({
      name: 'High-Pay Vague Work-from-Home Scam',
      matched: true,
      severity: 'HIGH',
      description: 'Exorbitant payouts promised for trivial remote tasks.',
      relevanceExplanation: 'Compensation claims appear disproportional to the low technical barrier described.',
    });
  }

  // Check 5: Lookalike / Shortened Links
  const url = (input.jobUrl || '') + ' ' + fullText;
  if (/tinyurl\.com|bit\.ly|t\.co|is\.gd|cutt\.ly|linktr\.ee/i.test(url)) {
    riskScore += 12;
    redFlags.push({
      id: 'rf-shortened-url',
      title: 'Shortened or Obfuscated URL in Job Notice',
      severity: 'MEDIUM',
      whyItMatters: 'Legitimate enterprises link candidates directly to transparent corporate career portals rather than masked short links.',
      evidenceQuote: input.jobUrl || 'Shortened URL link found in text',
      category: 'Link / Website Risk',
    });
    evidenceTable.push({
      signal: 'Job Listing Link Security',
      evidence: 'Masked/shortened URL detected',
      severity: 'Medium',
      confidence: 'High',
      category: 'Link / Website Risk',
    });
  }

  // Check 6: Urgency & High-Pressure Deadlines
  if (/urgent|today before|within 24 hours|strictly today|slot expires|limited seats/i.test(fullText)) {
    riskScore += 10;
    redFlags.push({
      id: 'rf-urgency',
      title: 'Artificial Urgency and Pressure Tactics',
      severity: 'MEDIUM',
      whyItMatters: 'Imposing strict same-day deadlines to send fees or accept offers prevents candidates from conferring with advisors or verifying company facts.',
      evidenceQuote: 'Urgent deadline imposed in communication',
      category: 'Communication Risk',
    });
  }

  // Check 7: Clear Job Description / Legitimate indicators
  if ((input.jobDescription || '').length > 300 && /responsibilities|requirements|qualifications|benefits/i.test(input.jobDescription)) {
    riskScore = Math.max(5, riskScore - 12);
    positiveSignals.push({
      id: 'ps-detailed-jd',
      title: 'Structured Job Responsibilities and Qualifications',
      detail: 'The listing includes articulated scope of work, technical requirements, and standard team responsibilities.',
    });
  }

  // Check 8: Official company website
  if (input.jobUrl && input.jobUrl.startsWith('https://') && !/tinyurl|bit\.ly/i.test(input.jobUrl)) {
    positiveSignals.push({
      id: 'ps-transparent-link',
      title: 'Transparent HTTPS Career Link',
      detail: 'Provided link uses standard secure protocol and unmasked domain path.',
      evidenceQuote: input.jobUrl,
    });
  }

  // Unknowns
  if (!input.companyName) {
    unknowns.push({
      id: 'u-company',
      item: 'Registered Employer Legal Entity',
      impact: 'Cannot verify whether the hiring organization has genuine corporate incorporation.',
      howToVerify: 'Ask the recruiter for the exact registered name and tax/business registration identifier.',
    });
  } else {
    unknowns.push({
      id: 'u-recruiter-id',
      item: `Recruiter Affiliation with ${input.companyName}`,
      impact: 'Independent verification needed to confirm whether this individual actually works for the company.',
      howToVerify: `Search for ${input.recruiterName || 'the recruiter'} on ${input.companyName}'s official LinkedIn staff directory or switchboard.`,
    });
  }

  if (!input.recruiterLinkedIn) {
    unknowns.push({
      id: 'u-linkedin',
      item: 'Recruiter Professional Profile',
      impact: 'No professional employment history or peer endorsements available for review.',
      howToVerify: 'Search for the recruiter on LinkedIn or request their official profile link.',
    });
  }

  // Clamp risk score
  const finalScore = Math.min(96, Math.max(8, riskScore));

  let riskLevel: RiskAnalysisResult['riskLevel'] = 'LOW';
  let verdict: RiskAnalysisResult['verdict'] = 'Appears Low Risk';
  let verdictHeadline = 'Signals Align with Standard Recruitment Practices';
  let recommendedDecision: RiskAnalysisResult['recommendedDecision'] = 'Proceed';

  if (finalScore >= 80) {
    riskLevel = 'VERY_HIGH';
    verdict = 'Very High Risk';
    verdictHeadline = 'Multiple Severe Recruitment Fraud Indicators Detected';
    recommendedDecision = 'Do Not Pay / Do Not Proceed Until Verified';
  } else if (finalScore >= 60) {
    riskLevel = 'HIGH';
    verdict = 'High Risk';
    verdictHeadline = 'High-Risk Indicators Detected in Recruitment Process';
    recommendedDecision = 'Do Not Pay / Do Not Proceed Until Verified';
  } else if (finalScore >= 40) {
    riskLevel = 'CAUTION';
    verdict = 'Proceed With Caution';
    verdictHeadline = 'Unusual Patterns Detected Requiring Independent Verification';
    recommendedDecision = 'Pause and Verify';
  } else if (finalScore >= 20) {
    riskLevel = 'GENERALLY_LOW';
    verdict = 'Appears Low Risk';
    verdictHeadline = 'Few Risk Indicators Detected; Standard Caution Recommended';
    recommendedDecision = 'Proceed After Verification';
  }

  const decisionRationale = finalScore >= 60
    ? 'The available evidence strongly suggests caution. High-severity indicators—including payment solicitation, non-corporate messaging channels, or artificial urgency—strongly deviate from ethical hiring standards.'
    : finalScore >= 40
    ? 'While not definitively fraudulent, several signals warrant careful scrutiny before you submit private documents or commit personal time.'
    : 'The recruitment process appears consistent with standard industry hiring practices. Always maintain standard cybersecurity vigilance.';

  return {
    id: 'jg-' + Date.now(),
    timestamp: new Date().toISOString(),
    jobTitle: input.jobTitle || 'Identified Position',
    companyName: input.companyName || 'Hiring Entity',
    summary: finalScore >= 60
      ? `This opportunity exhibits multiple indicators commonly associated with recruitment fraud, primarily relating to ${redFlags.map((r) => r.title.toLowerCase()).slice(0, 2).join(' and ')}.`
      : redFlags.length > 0
      ? `This opportunity contains risk indicators requiring independent verification, specifically regarding ${redFlags.map((r) => r.title.toLowerCase()).slice(0, 2).join(' and ')}.`
      : `The opportunity shows structured characteristics consistent with legitimate recruitment, with no major financial or identity demands reported.`,
    riskScore: finalScore,
    riskLevel,
    confidence: finalScore >= 60 ? 'HIGH' : 'MEDIUM',
    verdict,
    verdictHeadline,
    recommendedDecision,
    decisionRationale,
    redFlags,
    positiveSignals,
    unknowns,
    evidenceTable,
    matchedScamPatterns: matchedPatterns,
    categories: {
      companyAuthenticity: {
        status: input.companyName && !isFreeEmail ? 'healthy' : 'caution',
        notes: input.companyName ? `Claimed as ${input.companyName}` : 'Company details incomplete.',
      },
      recruiterAuthenticity: {
        status: isFreeEmail ? 'warning' : email ? 'healthy' : 'unknown',
        notes: isFreeEmail ? 'Using consumer webmail address.' : 'Recruiter details logged.',
      },
      jobDescriptionRisk: {
        status: /unrealistic/i.test(JSON.stringify(redFlags)) ? 'warning' : 'healthy',
        notes: 'Evaluated against market expectations for responsibilities and compensation.',
      },
      paymentRisk: {
        status: input.paymentAsked === 'yes' ? 'warning' : 'healthy',
        notes: input.paymentAsked === 'yes' ? 'Payment requested from candidate.' : 'No candidate fee demanded.',
      },
      communicationRisk: {
        status: /messaging-only/i.test(JSON.stringify(redFlags)) ? 'warning' : 'healthy',
        notes: 'Communication channels and urgency factors evaluated.',
      },
      offerLetterRisk: {
        status: input.offerLetterText ? (/deposit|fee/i.test(input.offerLetterText) ? 'warning' : 'caution') : 'unknown',
        notes: input.offerLetterText ? 'Offer document contents inspected.' : 'No formal letter text submitted.',
      },
      linkWebsiteRisk: {
        status: /shortened-url/i.test(JSON.stringify(redFlags)) ? 'warning' : 'healthy',
        notes: input.jobUrl ? 'Job URL format analyzed.' : 'No specific job link supplied.',
      },
    },
    recommendedActions: {
      doNow: finalScore >= 60
        ? [
            'Do not send any payment, registration fee, or security deposit.',
            'Do not share OTPs, passwords, bank logins, or Aadhaar/SSN scans.',
            'Do not install remote management tools or unverified software packages.',
            'Cease high-pressure conversation on private instant messaging.',
          ]
        : [
            'Record the recruiter’s details and the exact job requisition title.',
            'Review the candidate interview syllabus and prepare questions regarding the role.',
          ],
      beforeProceeding: [
        `Locate the official corporate website for ${input.companyName || 'the employer'} directly through an independent search engine.`,
        'Verify that the job vacancy is advertised on their official Careers / Openings page.',
        'Request written confirmation sent to your email from the corporate domain (@company.com).',
      ],
      ifVerified: [
        'Proceed with the formal multi-round interview process.',
        'Ensure all subsequent communication remains documented on official corporate channels.',
      ],
    },
    verificationChecklist: [
      {
        stepNumber: 1,
        title: 'Find the Official Corporate Website Independently',
        instruction: `Search for "${input.companyName || 'the hiring company'}" via a trusted search engine. Do not click links provided in suspicious emails or text messages.`,
        criticalWarning: 'Never trust lookalike domains created recently with hyphens or extra words.',
      },
      {
        stepNumber: 2,
        title: 'Navigate to the Official Careers Section',
        instruction: 'Find the Careers, Jobs, or Work With Us link in the website header or footer.',
      },
      {
        stepNumber: 3,
        title: 'Search for the Exact Job Requisition',
        instruction: `Look for the title "${input.jobTitle || 'the advertised role'}". If the role does not exist on their official careers site, treat with extreme skepticism.`,
      },
      {
        stepNumber: 4,
        title: 'Check Recruiter Existence on Company Channels',
        instruction: `Search for ${input.recruiterName || 'the recruiter'} on LinkedIn or company staff pages to ensure they are an active, accredited representative.`,
      },
      {
        stepNumber: 5,
        title: 'Contact Company via Independently Found Numbers',
        instruction: 'Call the main switchboard or send an inquiry to careers@company.com to verify whether this recruiter and opening are genuine.',
        criticalWarning: 'Never use the recruiter\'s provided WhatsApp number to "verify" their own authenticity!',
      },
      {
        stepNumber: 6,
        title: 'Verify Offer Terms and Zero-Fee Policy',
        instruction: 'Ask the company HR department to confirm whether candidate fees or equipment deposits are ever charged. Genuine employers will firmly confirm they are not.',
      },
    ],
    doNotDo: [
      'Never send money for registration, interviews, uniforms, training, or equipment.',
      'Never share one-time passwords (OTPs) or banking credentials.',
      'Never provide government identification (Aadhaar, SSN, passport) before a verified offer.',
      'Never accept checks to buy equipment from a designated third-party supplier.',
      'Never download or run unknown .exe or .zip attachments.',
      'Never permit remote desktop access (AnyDesk, TeamViewer) under the guise of an assessment.',
    ],
  };
}
