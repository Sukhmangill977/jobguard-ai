import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { JobSubmission, RiskAnalysisResult } from './src/types/jobguard.js';
import { runHeuristicAnalysis } from './src/server/heuristicAnalyzer.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '15mb' }));

// Shared server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('GEMINI_API_KEY not found in environment; heuristic analyzer will serve as primary engine.');
}

const SYSTEM_PROMPT = `You are JobGuard AI, an evidence-based recruitment and job scam risk analyzer.
Your mission is to evaluate job opportunities, recruiter communications, interview invites, and offer letters to determine whether they contain indicators of fraud, impersonation, or suspicious recruitment behavior.

CRITICAL RULES:
1. Never say "This is definitely a scam." Use cautious, evidence-grounded language like:
   - "High-risk indicators detected."
   - "The available evidence strongly suggests caution."
   - "This opportunity contains multiple indicators commonly associated with fraudulent recruitment."
2. Never invent evidence. Only cite facts from user input.
3. Distinguish confirmed evidence, strong indicators, weak indicators, and unknown/unverified information.
4. Never assume a company is fraudulent merely because it is small, unfamiliar, or remote.
5. Never treat poor grammar or informal language alone as strong evidence of fraud.
6. Payment requests carry the HIGHEST risk weight (registration fees, security deposits, training payments, equipment money, crypto, gift cards).
7. If very little information is provided, return riskLevel="INSUFFICIENT_EVIDENCE", verdict="Insufficient Evidence", recommendedDecision="Not Enough Information".
8. Never ask for or expose passwords, OTPs, or financial secrets.
9. Return a transparent "Risk Indicator Score" from 0 to 100:
   - 0-19: Low Risk
   - 20-39: Generally Low Risk
   - 40-59: Caution
   - 60-79: High Risk
   - 80-100: Very High Risk
10. The risk score represents indicator severity, not a probabilistic certainty of crime.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    jobTitle: { type: Type.STRING },
    companyName: { type: Type.STRING },
    summary: { type: Type.STRING, description: '2-3 sentence overview of the assessment' },
    riskScore: { type: Type.INTEGER, description: 'Score between 0 and 100' },
    riskLevel: {
      type: Type.STRING,
      enum: ['LOW', 'GENERALLY_LOW', 'CAUTION', 'HIGH', 'VERY_HIGH', 'INSUFFICIENT_EVIDENCE'],
    },
    confidence: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] },
    verdict: {
      type: Type.STRING,
      enum: [
        'Appears Low Risk',
        'Proceed With Caution',
        'High Risk',
        'Very High Risk',
        'Insufficient Evidence',
      ],
    },
    verdictHeadline: { type: Type.STRING },
    recommendedDecision: {
      type: Type.STRING,
      enum: [
        'Proceed',
        'Proceed After Verification',
        'Pause and Verify',
        'Do Not Pay / Do Not Proceed Until Verified',
        'Not Enough Information',
      ],
    },
    decisionRationale: { type: Type.STRING },
    redFlags: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] },
          whyItMatters: { type: Type.STRING },
          evidenceQuote: { type: Type.STRING },
          category: { type: Type.STRING },
        },
        required: ['id', 'title', 'severity', 'whyItMatters', 'evidenceQuote', 'category'],
      },
    },
    positiveSignals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          detail: { type: Type.STRING },
          evidenceQuote: { type: Type.STRING },
        },
        required: ['id', 'title', 'detail'],
      },
    },
    unknowns: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          item: { type: Type.STRING },
          impact: { type: Type.STRING },
          howToVerify: { type: Type.STRING },
        },
        required: ['id', 'item', 'impact', 'howToVerify'],
      },
    },
    evidenceTable: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          signal: { type: Type.STRING },
          evidence: { type: Type.STRING },
          severity: {
            type: Type.STRING,
            enum: ['Critical', 'High', 'Medium', 'Low', 'Neutral', 'Unknown'],
          },
          confidence: {
            type: Type.STRING,
            enum: ['High', 'Medium', 'Low', 'Unknown'],
          },
          category: { type: Type.STRING },
        },
        required: ['signal', 'evidence', 'severity', 'confidence', 'category'],
      },
    },
    matchedScamPatterns: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          matched: { type: Type.BOOLEAN },
          severity: { type: Type.STRING, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] },
          description: { type: Type.STRING },
          relevanceExplanation: { type: Type.STRING },
        },
        required: ['name', 'matched', 'severity', 'description', 'relevanceExplanation'],
      },
    },
    categories: {
      type: Type.OBJECT,
      properties: {
        companyAuthenticity: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['healthy', 'caution', 'warning', 'unknown'] },
            notes: { type: Type.STRING },
          },
          required: ['status', 'notes'],
        },
        recruiterAuthenticity: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['healthy', 'caution', 'warning', 'unknown'] },
            notes: { type: Type.STRING },
          },
          required: ['status', 'notes'],
        },
        jobDescriptionRisk: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['healthy', 'caution', 'warning', 'unknown'] },
            notes: { type: Type.STRING },
          },
          required: ['status', 'notes'],
        },
        paymentRisk: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['healthy', 'caution', 'warning', 'unknown'] },
            notes: { type: Type.STRING },
          },
          required: ['status', 'notes'],
        },
        communicationRisk: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['healthy', 'caution', 'warning', 'unknown'] },
            notes: { type: Type.STRING },
          },
          required: ['status', 'notes'],
        },
        offerLetterRisk: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['healthy', 'caution', 'warning', 'unknown'] },
            notes: { type: Type.STRING },
          },
          required: ['status', 'notes'],
        },
        linkWebsiteRisk: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['healthy', 'caution', 'warning', 'unknown'] },
            notes: { type: Type.STRING },
          },
          required: ['status', 'notes'],
        },
      },
      required: [
        'companyAuthenticity',
        'recruiterAuthenticity',
        'jobDescriptionRisk',
        'paymentRisk',
        'communicationRisk',
        'offerLetterRisk',
        'linkWebsiteRisk',
      ],
    },
    recommendedActions: {
      type: Type.OBJECT,
      properties: {
        doNow: { type: Type.ARRAY, items: { type: Type.STRING } },
        beforeProceeding: { type: Type.ARRAY, items: { type: Type.STRING } },
        ifVerified: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['doNow', 'beforeProceeding', 'ifVerified'],
    },
    verificationChecklist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          title: { type: Type.STRING },
          instruction: { type: Type.STRING },
          criticalWarning: { type: Type.STRING },
        },
        required: ['stepNumber', 'title', 'instruction'],
      },
    },
    doNotDo: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: [
    'jobTitle',
    'companyName',
    'summary',
    'riskScore',
    'riskLevel',
    'confidence',
    'verdict',
    'verdictHeadline',
    'recommendedDecision',
    'decisionRationale',
    'redFlags',
    'positiveSignals',
    'unknowns',
    'evidenceTable',
    'matchedScamPatterns',
    'categories',
    'recommendedActions',
    'verificationChecklist',
    'doNotDo',
  ],
};

app.post('/api/analyze', async (req, res) => {
  try {
    const submission: JobSubmission = req.body;

    if (!submission) {
      return res.status(400).json({ error: 'Empty submission payload.' });
    }

    const hasContent =
      (submission.jobDescription || '').trim().length > 0 ||
      (submission.recruiterMessage || '').trim().length > 0 ||
      (submission.offerLetterText || '').trim().length > 0 ||
      (submission.interviewInvitation || '').trim().length > 0 ||
      (submission.attachment && submission.attachment.base64Data);

    if (!hasContent && submission.paymentAsked === 'not_sure') {
      return res.status(400).json({
        error: 'Please provide at least a job description, recruiter message, offer letter text, or document.',
      });
    }

    // Try AI analysis first if client available
    if (aiClient) {
      try {
        const parts: any[] = [];

        // If file attachment exists (image or PDF)
        if (submission.attachment && submission.attachment.base64Data) {
          parts.push({
            inlineData: {
              mimeType: submission.attachment.mimeType || 'application/pdf',
              data: submission.attachment.base64Data,
            },
          });
        }

        const promptText = `Analyze the following job recruitment submission thoroughly:

[JOB POSTING DETAILS]
- Job Title: ${submission.jobTitle || 'Not specified'}
- Company Name: ${submission.companyName || 'Not specified'}
- Claimed Salary: ${submission.salary || 'Not specified'}
- Location: ${submission.location || 'Not specified'}
- Job URL: ${submission.jobUrl || 'Not specified'}
- Job Description:
"""
${submission.jobDescription || 'None provided'}
"""

[RECRUITER INFORMATION]
- Recruiter Name: ${submission.recruiterName || 'Not specified'}
- Recruiter Email: ${submission.recruiterEmail || 'Not specified'}
- Recruiter Phone: ${submission.recruiterPhone || 'Not specified'}
- Recruiter LinkedIn: ${submission.recruiterLinkedIn || 'Not specified'}
- WhatsApp / Telegram Handle: ${submission.recruiterMessagingHandle || 'Not specified'}
- Recruiter Message:
"""
${submission.recruiterMessage || 'None provided'}
"""

[OFFER & INTERVIEW DETAILS]
- Interview Invitation:
"""
${submission.interviewInvitation || 'None provided'}
"""
- Offer Letter Text:
"""
${submission.offerLetterText || 'None provided'}
"""

[PAYMENT STATUS]
- Was payment asked: ${submission.paymentAsked}
- Purpose(s) of payment asked: ${submission.paymentReasons?.join(', ') || 'None'}
- Payment Details & Instructions: ${submission.paymentDetails || 'None'}

Evaluate this opportunity against the 7 risk pillars (Company, Recruiter, JD, Payment, Communication, Offer Letter, Links), produce transparent indicator scoring (0-100), identify confirmed red flags with user citations, positive signals, unknowns, verification checklist, and safe recommended actions.`;

        parts.push({ text: promptText });

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts },
          config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
            temperature: 0.1,
          },
        });

        const rawJson = response.text?.trim() || '';
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          const result: RiskAnalysisResult = {
            ...parsed,
            id: 'jg-' + Date.now(),
            timestamp: new Date().toISOString(),
          };
          return res.json(result);
        }
      } catch (geminiError: any) {
        console.error('Gemini generation encountered issue; falling back to heuristic engine:', geminiError?.message);
      }
    }

    // Heuristic fallback
    const heuristicResult = runHeuristicAnalysis(submission);
    return res.json(heuristicResult);
  } catch (error: any) {
    console.error('Error processing recruitment analysis:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred while analyzing the job opportunity. Please try again.',
    });
  }
});

// Setup Vite dev server or static production files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`JobGuard AI server listening at http://0.0.0.0:${port}`);
  });
}

startServer();
