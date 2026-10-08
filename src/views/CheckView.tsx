import React, { useState, useMemo } from 'react';
import {
  Shield,
  Upload,
  AlertTriangle,
  FileText,
  DollarSign,
  User,
  Briefcase,
  Link as LinkIcon,
  X,
  FileCheck,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { JobSubmission, AttachmentData, PaymentAskedOption } from '../types/jobguard';
import { scanForSensitiveData, redactSensitiveData } from '../utils/privacyGuard';
import { SensitiveDataBanner } from '../components/SensitiveDataBanner';
import { DEMO_PRESETS, DemoPreset } from '../data/demos';

interface CheckViewProps {
  initialSubmission?: JobSubmission;
  onSubmit: (submission: JobSubmission) => void;
  isLoading: boolean;
}

const PAYMENT_REASON_OPTIONS = [
  'Registration',
  'Training',
  'Security deposit',
  'Equipment',
  'Background verification',
  'Interview processing',
  'Visa/work permit',
  'Other',
];

export const CheckView: React.FC<CheckViewProps> = ({
  initialSubmission,
  onSubmit,
  isLoading,
}) => {
  const [jobTitle, setJobTitle] = useState(initialSubmission?.jobTitle || '');
  const [companyName, setCompanyName] = useState(initialSubmission?.companyName || '');
  const [salary, setSalary] = useState(initialSubmission?.salary || '');
  const [location, setLocation] = useState(initialSubmission?.location || '');
  const [jobUrl, setJobUrl] = useState(initialSubmission?.jobUrl || '');
  const [jobDescription, setJobDescription] = useState(initialSubmission?.jobDescription || '');

  const [recruiterName, setRecruiterName] = useState(initialSubmission?.recruiterName || '');
  const [recruiterEmail, setRecruiterEmail] = useState(initialSubmission?.recruiterEmail || '');
  const [recruiterPhone, setRecruiterPhone] = useState(initialSubmission?.recruiterPhone || '');
  const [recruiterLinkedIn, setRecruiterLinkedIn] = useState(initialSubmission?.recruiterLinkedIn || '');
  const [recruiterMessagingHandle, setRecruiterMessagingHandle] = useState(
    initialSubmission?.recruiterMessagingHandle || ''
  );
  const [recruiterMessage, setRecruiterMessage] = useState(initialSubmission?.recruiterMessage || '');

  const [interviewInvitation, setInterviewInvitation] = useState(
    initialSubmission?.interviewInvitation || ''
  );
  const [offerLetterText, setOfferLetterText] = useState(initialSubmission?.offerLetterText || '');
  const [attachment, setAttachment] = useState<AttachmentData | undefined>(
    initialSubmission?.attachment
  );

  const [paymentAsked, setPaymentAsked] = useState<PaymentAskedOption>(
    initialSubmission?.paymentAsked || 'no'
  );
  const [paymentReasons, setPaymentReasons] = useState<string[]>(
    initialSubmission?.paymentReasons || []
  );
  const [paymentDetails, setPaymentDetails] = useState(initialSubmission?.paymentDetails || '');

  const [activeTab, setActiveTab] = useState<'posting' | 'recruiter' | 'offer' | 'payment'>('posting');

  // Live sensitive information scanner
  const combinedText = useMemo(() => {
    return [
      jobDescription,
      recruiterMessage,
      interviewInvitation,
      offerLetterText,
      paymentDetails,
    ].join(' ');
  }, [jobDescription, recruiterMessage, interviewInvitation, offerLetterText, paymentDetails]);

  const sensitiveScan = useMemo(() => {
    return scanForSensitiveData(combinedText);
  }, [combinedText]);

  const handleRedactAll = () => {
    setJobDescription((prev) => redactSensitiveData(prev));
    setRecruiterMessage((prev) => redactSensitiveData(prev));
    setInterviewInvitation((prev) => redactSensitiveData(prev));
    setOfferLetterText((prev) => redactSensitiveData(prev));
    setPaymentDetails((prev) => redactSensitiveData(prev));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds 8MB limit. Please upload a smaller screenshot or text excerpt.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      const base64Index = resultStr.indexOf(';base64,');
      if (base64Index !== -1) {
        const base64 = resultStr.substring(base64Index + 8);
        setAttachment({
          filename: file.name,
          mimeType: file.type || 'application/pdf',
          base64Data: base64,
          sizeBytes: file.size,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = () => {
    setAttachment(undefined);
  };

  const togglePaymentReason = (reason: string) => {
    setPaymentReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  const loadPreset = (preset: DemoPreset) => {
    setJobTitle(preset.submission.jobTitle || '');
    setCompanyName(preset.submission.companyName || '');
    setSalary(preset.submission.salary || '');
    setLocation(preset.submission.location || '');
    setJobUrl(preset.submission.jobUrl || '');
    setJobDescription(preset.submission.jobDescription || '');
    setRecruiterName(preset.submission.recruiterName || '');
    setRecruiterEmail(preset.submission.recruiterEmail || '');
    setRecruiterPhone(preset.submission.recruiterPhone || '');
    setRecruiterLinkedIn(preset.submission.recruiterLinkedIn || '');
    setRecruiterMessagingHandle(preset.submission.recruiterMessagingHandle || '');
    setRecruiterMessage(preset.submission.recruiterMessage || '');
    setInterviewInvitation(preset.submission.interviewInvitation || '');
    setOfferLetterText(preset.submission.offerLetterText || '');
    setPaymentAsked(preset.submission.paymentAsked);
    setPaymentReasons(preset.submission.paymentReasons || []);
    setPaymentDetails(preset.submission.paymentDetails || '');
    setAttachment(undefined);
  };

  const handleClear = () => {
    setJobTitle('');
    setCompanyName('');
    setSalary('');
    setLocation('');
    setJobUrl('');
    setJobDescription('');
    setRecruiterName('');
    setRecruiterEmail('');
    setRecruiterPhone('');
    setRecruiterLinkedIn('');
    setRecruiterMessagingHandle('');
    setRecruiterMessage('');
    setInterviewInvitation('');
    setOfferLetterText('');
    setAttachment(undefined);
    setPaymentAsked('no');
    setPaymentReasons([]);
    setPaymentDetails('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submission: JobSubmission = {
      jobTitle: jobTitle.trim(),
      companyName: companyName.trim(),
      salary: salary.trim(),
      location: location.trim(),
      jobUrl: jobUrl.trim(),
      jobDescription: jobDescription.trim(),
      recruiterName: recruiterName.trim(),
      recruiterEmail: recruiterEmail.trim(),
      recruiterPhone: recruiterPhone.trim(),
      recruiterLinkedIn: recruiterLinkedIn.trim(),
      recruiterMessagingHandle: recruiterMessagingHandle.trim(),
      recruiterMessage: recruiterMessage.trim(),
      interviewInvitation: interviewInvitation.trim(),
      offerLetterText: offerLetterText.trim(),
      attachment,
      paymentAsked,
      paymentReasons,
      paymentDetails: paymentDetails.trim(),
    };

    onSubmit(submission);
  };

  const hasAnyInput =
    jobDescription.trim().length > 0 ||
    recruiterMessage.trim().length > 0 ||
    offerLetterText.trim().length > 0 ||
    interviewInvitation.trim().length > 0 ||
    !!attachment ||
    paymentAsked === 'yes';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Title & Presets Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Check Job Opportunity
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Provide whatever evidence you have: job description, recruiter chat, email, or offer letter.
          </p>
        </div>

        {/* Demo Preset Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Load Demo:</span>
          <button
            type="button"
            onClick={() => loadPreset(DEMO_PRESETS[0])}
            className="px-2.5 py-1 text-xs rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 transition-colors"
          >
            Suspicious Fee Scam
          </button>
          <button
            type="button"
            onClick={() => loadPreset(DEMO_PRESETS[1])}
            className="px-2.5 py-1 text-xs rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 transition-colors"
          >
            Legitimate Role
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-2 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Mandatory Safety Warning Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <Shield className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-slate-200">
            ⚠️ Safety Notice: Never upload passwords, OTPs, bank PINs, debit/credit cards, or sensitive identity secrets.
          </p>
          <p className="text-slate-400 text-[11px] mt-0.5">
            JobGuard analyzes recruitment language and claims. Real hiring processes never require authentication passwords or bank access.
          </p>
        </div>
      </div>

      {/* Sensitive Data Scanner Alert if triggered */}
      <SensitiveDataBanner scanResult={sensitiveScan} onRedact={handleRedactAll} />

      {/* Structured Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('posting')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'posting'
                ? 'bg-slate-800 text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>A. Job Posting</span>
            {jobDescription && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recruiter')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'recruiter'
                ? 'bg-slate-800 text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>B. Recruiter Details</span>
            {recruiterMessage && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('offer')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'offer'
                ? 'bg-slate-800 text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>C. Offer & Document</span>
            {(offerLetterText || attachment) && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payment')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'payment'
                ? 'bg-slate-800 text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>D. Payment Demands</span>
            {paymentAsked === 'yes' && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
          </button>
        </div>

        {/* Section A: Job Posting */}
        {activeTab === 'posting' && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <span>Job Posting & Description</span>
                <span className="text-[10px] text-slate-400 font-normal">(Paste whatever is available)</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Job Title (Optional)</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Junior Data Analyst, Marketing Executive"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Company Name (Optional)</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corporation, Global Tech Ltd"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Offered Salary / Stipend</label>
                <input
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. ₹80,000/month, $120k/yr, ₹5,000 daily"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Job URL / Portal Link</label>
                <input
                  type="text"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="e.g. https://company.com/careers/job-123 or bit.ly link"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 placeholder-slate-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium text-xs mb-1">
                Paste Job Description <span className="text-emerald-400">*</span>
              </label>
              <textarea
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job advertisement, requirements, qualifications, work hours, or claimed tasks..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 placeholder-slate-600 text-xs focus:outline-none leading-relaxed font-mono"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('recruiter')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Next: Recruiter Info</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Section B: Recruiter Information */}
        {activeTab === 'recruiter' && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <span>Recruiter & Contact Details</span>
                <span className="text-[10px] text-slate-400 font-normal">(Helps check domain and impersonation)</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Recruiter Name</label>
                <input
                  type="text"
                  value={recruiterName}
                  onChange={(e) => setRecruiterName(e.target.value)}
                  placeholder="e.g. Priya Sharma, John Doe"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Recruiter Email Address</label>
                <input
                  type="email"
                  value={recruiterEmail}
                  onChange={(e) => setRecruiterEmail(e.target.value)}
                  placeholder="e.g. hr@company.com or john.company@gmail.com"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Phone / WhatsApp Number</label>
                <input
                  type="text"
                  value={recruiterPhone}
                  onChange={(e) => setRecruiterPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210 or +234..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Telegram Handle / Messaging ID</label>
                <input
                  type="text"
                  value={recruiterMessagingHandle}
                  onChange={(e) => setRecruiterMessagingHandle(e.target.value)}
                  placeholder="e.g. @HR_TalentRecruiter"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-medium mb-1">Recruiter LinkedIn URL</label>
                <input
                  type="text"
                  value={recruiterLinkedIn}
                  onChange={(e) => setRecruiterLinkedIn(e.target.value)}
                  placeholder="e.g. https://linkedin.com/in/recruiter-profile"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 placeholder-slate-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium text-xs mb-1">
                Complete Message Received from Recruiter
              </label>
              <textarea
                rows={4}
                value={recruiterMessage}
                onChange={(e) => setRecruiterMessage(e.target.value)}
                placeholder="Paste the full WhatsApp message, cold email, SMS, or Telegram conversation..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 placeholder-slate-600 text-xs focus:outline-none leading-relaxed font-mono"
              />
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('posting')}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Back: Job Posting
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('offer')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Next: Offer & Document</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Section C: Offer & Document */}
        {activeTab === 'offer' && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                Offer Letter & Interview Invitation
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Paste interview instructions, offer letter text, or upload a document/screenshot.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-medium text-xs mb-1">
                Paste Interview Invitation Text
              </label>
              <textarea
                rows={3}
                value={interviewInvitation}
                onChange={(e) => setInterviewInvitation(e.target.value)}
                placeholder="e.g. Schedule details, video links, questionnaire forms, or interview conditions..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 placeholder-slate-600 text-xs focus:outline-none leading-relaxed font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium text-xs mb-1">
                Paste Offer Letter Text (if received)
              </label>
              <textarea
                rows={4}
                value={offerLetterText}
                onChange={(e) => setOfferLetterText(e.target.value)}
                placeholder="Paste the clauses, terms, onboarding conditions, or clauses mentioned in the offer letter..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 placeholder-slate-600 text-xs focus:outline-none leading-relaxed font-mono"
              />
            </div>

            {/* Document Upload Area */}
            <div className="pt-2">
              <label className="block text-slate-300 font-medium text-xs mb-1.5">
                Or Upload Document / Screenshot (PDF, PNG, JPG)
              </label>

              {!attachment ? (
                <label className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-950/40 hover:bg-slate-950/80 transition-all text-center">
                  <Upload className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-300">
                    Click to select offer letter or screenshot
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Supports PDF, PNG, JPG up to 8MB. Analyzed securely by multimodal AI.
                  </span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-slate-200 font-medium">
                    <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate max-w-xs">{attachment.filename}</span>
                    <span className="text-[10px] text-slate-500">
                      ({Math.round((attachment.sizeBytes || 0) / 1024)} KB)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveAttachment}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('recruiter')}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Back: Recruiter Info
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('payment')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Next: Payment Demands</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Section D: Payment Demands */}
        {activeTab === 'payment' && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <span>Payment Requests</span>
                <span className="text-[11px] text-red-400 font-semibold">(Highest Risk Indicator)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Legitimate corporate hiring is funded by the employer. Candidates are never charged for applications or slots.
              </p>
            </div>

            {/* Question 1: Has anyone asked you to pay money? */}
            <div>
              <label className="block text-slate-200 font-semibold text-xs mb-2">
                Has anyone asked you to pay money or purchase anything?
              </label>

              <div className="grid grid-cols-3 gap-2">
                {(['no', 'yes', 'not_sure'] as PaymentAskedOption[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setPaymentAsked(option)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-colors ${
                      paymentAsked === option
                        ? option === 'yes'
                          ? 'bg-red-500/20 text-red-300 border-red-500/40 font-bold'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {option === 'no' ? 'No, 0 charges' : option === 'yes' ? 'Yes, money asked' : 'Not sure yet'}
                  </button>
                ))}
              </div>
            </div>

            {/* Conditional Payment Details */}
            {paymentAsked === 'yes' && (
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 space-y-3 animate-in fade-in">
                <label className="block text-red-300 font-semibold text-xs">
                  What were you asked to pay for? (Select all that apply)
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PAYMENT_REASON_OPTIONS.map((reason) => {
                    const isChecked = paymentReasons.includes(reason);
                    return (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => togglePaymentReason(reason)}
                        className={`px-2.5 py-1.5 rounded-md text-xs font-medium text-left border transition-colors flex items-center justify-between ${
                          isChecked
                            ? 'bg-red-500/20 text-red-200 border-red-500/50'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span>{reason}</span>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-slate-300 font-medium text-xs mb-1">
                    Describe the payment instructions or demands
                  </label>
                  <input
                    type="text"
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                    placeholder="e.g. Asked for ₹2,999 slot fee via UPI, or $200 equipment check, or refundable deposit..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-200 placeholder-slate-600 text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('offer')}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Back: Offer Letter
              </button>
              <span className="text-[11px] text-slate-500">Ready for evaluation</span>
            </div>
          </div>
        )}

        {/* Submission Submit Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 space-y-0.5 text-center sm:text-left">
            <p className="text-slate-200 font-semibold">
              Evidence-based evaluation ready
            </p>
            <p className="text-[11px]">
              Distinguishes facts from inferences. Will generate transparent indicator score & verification checklist.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !hasAnyInput}
            className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
              !hasAnyInput
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 cursor-pointer'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Run JobGuard Risk Assessment</span>
          </button>
        </div>
      </form>
    </div>
  );
};
