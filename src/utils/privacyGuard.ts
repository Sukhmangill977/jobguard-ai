export interface SensitiveMatch {
  type: string;
  matchedText: string;
  startIndex: number;
  endIndex: number;
}

export interface SensitiveScanResult {
  hasSensitiveData: boolean;
  warnings: string[];
  matches: SensitiveMatch[];
}

export function scanForSensitiveData(text: string): SensitiveScanResult {
  if (!text) return { hasSensitiveData: false, warnings: [], matches: [] };

  const matches: SensitiveMatch[] = [];
  const warnings: string[] = [];

  // 1. Credit / Debit card patterns (13-19 digits, with spaces or dashes)
  const cardRegex = /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|[0-9]{4}[ -][0-9]{4}[ -][0-9]{4}[ -][0-9]{4})\b/g;
  let cardMatch: RegExpExecArray | null;
  while ((cardMatch = cardRegex.exec(text)) !== null) {
    matches.push({
      type: 'Payment Card Number',
      matchedText: cardMatch[0],
      startIndex: cardMatch.index,
      endIndex: cardMatch.index + cardMatch[0].length,
    });
    if (!warnings.includes('Potential payment card or debit card number detected')) {
      warnings.push('Potential payment card or debit card number detected');
    }
  }

  // 2. OTP / Verification code patterns (e.g., "OTP: 123456", "code is 849201")
  const otpRegex = /\b(?:otp|one[- ]time[- ]password|verification code|security code)[:\s=]+([0-9]{4,8})\b/gi;
  let otpMatch: RegExpExecArray | null;
  while ((otpMatch = otpRegex.exec(text)) !== null) {
    matches.push({
      type: 'One-Time Password (OTP)',
      matchedText: otpMatch[0],
      startIndex: otpMatch.index,
      endIndex: otpMatch.index + otpMatch[0].length,
    });
    if (!warnings.includes('One-Time Password (OTP) or authentication code detected')) {
      warnings.push('One-Time Password (OTP) or authentication code detected');
    }
  }

  // 3. Bank PIN / CVV / Password indicators
  const passwordRegex = /\b(?:password|passwd|pin|cvv|cvc)[:\s=]+([^\s,]{3,30})\b/gi;
  let pwdMatch: RegExpExecArray | null;
  while ((pwdMatch = passwordRegex.exec(text)) !== null) {
    matches.push({
      type: 'Password or PIN',
      matchedText: pwdMatch[0],
      startIndex: pwdMatch.index,
      endIndex: pwdMatch.index + pwdMatch[0].length,
    });
    if (!warnings.includes('Password, bank PIN, or CVV pattern detected')) {
      warnings.push('Password, bank PIN, or CVV pattern detected');
    }
  }

  // 4. Aadhaar / SSN format (e.g., XXX-XX-XXXX or XXXX XXXX XXXX)
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  let ssnMatch: RegExpExecArray | null;
  while ((ssnMatch = ssnRegex.exec(text)) !== null) {
    matches.push({
      type: 'Social Security Number (SSN)',
      matchedText: ssnMatch[0],
      startIndex: ssnMatch.index,
      endIndex: ssnMatch.index + ssnMatch[0].length,
    });
    if (!warnings.includes('Government identification format (e.g., SSN) detected')) {
      warnings.push('Government identification format (e.g., SSN) detected');
    }
  }

  return {
    hasSensitiveData: matches.length > 0,
    warnings,
    matches,
  };
}

export function redactSensitiveData(text: string): string {
  if (!text) return '';
  let cleaned = text;

  // Redact credit cards
  cleaned = cleaned.replace(
    /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|[0-9]{4}[ -][0-9]{4}[ -][0-9]{4}[ -][0-9]{4})\b/g,
    '[REDACTED CARD NUMBER]'
  );

  // Redact OTPs
  cleaned = cleaned.replace(
    /\b((?:otp|one[- ]time[- ]password|verification code|security code)[:\s=]+)[0-9]{4,8}\b/gi,
    '$1[REDACTED OTP]'
  );

  // Redact Passwords/PINs
  cleaned = cleaned.replace(
    /\b((?:password|passwd|pin|cvv|cvc)[:\s=]+)[^\s,]{3,30}\b/gi,
    '$1[REDACTED SECRET]'
  );

  // Redact SSN
  cleaned = cleaned.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED SSN]');

  return cleaned;
}
