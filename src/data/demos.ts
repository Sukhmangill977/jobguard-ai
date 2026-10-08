import { JobSubmission } from '../types/jobguard';

export interface DemoPreset {
  id: string;
  name: string;
  tagline: string;
  expectedRiskLevel: 'HIGH' | 'LOW' | 'CAUTION';
  submission: JobSubmission;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'suspicious-registration-fee',
    name: 'Suspicious Job (Registration Fee Request)',
    tagline: 'High compensation, WhatsApp contact, demanding ₹2,999 upfront slot fee',
    expectedRiskLevel: 'HIGH',
    submission: {
      jobTitle: 'Junior Data Analyst & Business Associate',
      companyName: 'Global Tech Careers Ltd',
      salary: '₹80,000 – ₹120,000 / month',
      location: 'Remote / Work From Home',
      jobUrl: 'https://tinyurl.com/gtc-careers-apply',
      jobDescription: `We are urgently hiring 25 freshers and professionals for Junior Data Analyst position.
No prior experience needed! Full training will be provided during onboarding.
Working hours: 2-3 hours per day from home. Flexible timings.
Monthly stipend/salary: ₹80,000 to ₹120,000 + performance bonuses.
Requirements: Basic knowledge of mobile phone or laptop, good English, instant availability.`,
      recruiterName: 'Priya Sharma (HR Talent Director)',
      recruiterEmail: 'priya.sharma.gtccareers@gmail.com',
      recruiterPhone: '+91 98765 43210',
      recruiterLinkedIn: '',
      recruiterMessagingHandle: '@GlobalTechHR_Official (Telegram)',
      recruiterMessage: `Congratulations! Your profile has been shortlisted from our portal.
You have been directly selected for the final interview round.
Please note: Due to heavy candidate volume, you must pay a refundable interview slot booking & candidate registration fee of ₹2,999 today before 5:00 PM to confirm your seat.
This amount is 100% refundable with your first month salary voucher.
Pay via UPI to: globalhrcareers@okaxis. Send screenshot immediately.`,
      interviewInvitation: `Your slot code is #GT-4091. Final verification interview scheduled for tomorrow 11:00 AM on Telegram call once registration clearance is paid.`,
      offerLetterText: `PRE-EMPLOYMENT CONDITIONAL OFFER
Dear Candidate,
We are pleased to offer you the position of Junior Data Analyst at Global Tech Careers at an annual CTC of ₹12,00,000.
To activate this appointment letter, submit the onboarding security clearance deposit of ₹2,999 within 24 hours.`,
      paymentAsked: 'yes',
      paymentReasons: ['Registration', 'Interview processing', 'Security deposit'],
      paymentDetails: 'Recruiter asked for ₹2,999 refundable slot booking fee via UPI to confirm interview slot today.',
    },
  },
  {
    id: 'legitimate-corporate-job',
    name: 'Normal Corporate Job (Legitimate Pattern)',
    tagline: 'Verified corporate domain, detailed technical scope, 0 fees, standard multi-round interview',
    expectedRiskLevel: 'LOW',
    submission: {
      jobTitle: 'Frontend Engineer (React / TypeScript)',
      companyName: 'CloudScale Systems Inc.',
      salary: '$110,000 – $135,000 per year',
      location: 'Hybrid (Bengaluru, India / Remote)',
      jobUrl: 'https://www.cloudscalesystems.com/careers/frontend-engineer',
      jobDescription: `CloudScale Systems is seeking a Frontend Engineer with 2-4 years of experience building scalable web applications.
Responsibilities:
- Build responsive, accessible user interfaces using React 19, TypeScript, and modern CSS frameworks.
- Collaborate with backend engineers, UX designers, and product managers in 2-week agile sprints.
- Write robust unit and integration tests using Vitest and React Testing Library.
- Optimize web application core web vitals and client-side performance.
Requirements:
- Strong foundations in JavaScript/TypeScript, DOM fundamentals, and React lifecycle.
- Familiarity with RESTful APIs, Git version control, and CI/CD pipelines.
- Bachelor's degree in Computer Science, related field, or equivalent practical experience.
Benefits: Comprehensive health insurance, wellness stipend, 401(k) / PF match, flexible PTO.`,
      recruiterName: 'Sarah Jenkins',
      recruiterEmail: 'sarah.jenkins@cloudscalesystems.com',
      recruiterPhone: '+1 (415) 555-0192',
      recruiterLinkedIn: 'https://linkedin.com/in/sarah-jenkins-cloudscale',
      recruiterMessagingHandle: '',
      recruiterMessage: `Hi, thank you for applying for the Frontend Engineer position through our careers portal at cloudscalesystems.com.
Our engineering team was impressed by your GitHub projects and open-source contributions.
I would love to set up a preliminary 30-minute introductory call via Google Meet to discuss the team roadmap and learn more about your background.
Please select a convenient time from my official calendar link: https://cloudscalesystems.com/meet/sarah-jenkins
Looking forward to speaking with you!`,
      interviewInvitation: `Introductory Recruiter Screen (30 mins) -> Technical Coding Assessment (CoderPad, 60 mins) -> System Architecture Round (60 mins) -> Values & Team Match (45 mins). No application fees or charges ever apply.`,
      offerLetterText: '',
      paymentAsked: 'no',
      paymentReasons: [],
      paymentDetails: '',
    },
  },
  {
    id: 'vague-low-evidence',
    name: 'Vague Telegram Outreach (Insufficient Evidence / Caution)',
    tagline: 'Cold message on WhatsApp with minimal company details and no clear role description',
    expectedRiskLevel: 'CAUTION',
    submission: {
      jobTitle: 'Assistant Operations',
      companyName: '',
      salary: '₹5,000 per day',
      location: 'Work from home',
      jobUrl: '',
      jobDescription: '',
      recruiterName: 'David',
      recruiterEmail: '',
      recruiterPhone: '+234 812 345 6789',
      recruiterLinkedIn: '',
      recruiterMessagingHandle: '@David_HRM',
      recruiterMessage: `Hello, are you looking for part-time remote work? We saw your resume on a job board. You can earn ₹3,000–₹5,000 daily working 1 hour on your phone. Message me back if interested.`,
      interviewInvitation: '',
      offerLetterText: '',
      paymentAsked: 'not_sure',
      paymentReasons: [],
      paymentDetails: 'They haven\'t asked for money yet, but the message came out of nowhere from an unknown foreign number.',
    },
  },
];
