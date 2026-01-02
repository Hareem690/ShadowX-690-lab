
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Type } from '@google/genai';
import { PasswordAnalysis } from '../types';

export const analyzePasswordWithAI = async (password: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this password for security vulnerabilities (DO NOT repeat the password in your response): "${password}". 
    Provide a concise technical report including:
    1. Pattern analysis (common words, keyboard sequences).
    2. Estimated resilience against dictionary attacks.
    3. Suggestions for improvement.
    Format the response as Markdown with a focus on a "Cyber Security Consultant" persona.`,
    config: {
      temperature: 0.2,
      thinkingConfig: { thinkingBudget: 0 }
    },
  });

  return response.text || "No AI analysis available.";
};

export const getSecurityMetrics = (password: string, hashesPerSecond: number): PasswordAnalysis => {
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;

  const combinations = Math.pow(charsetSize || 1, password.length);
  const entropy = Math.log2(combinations || 1);
  const crackingTimeSeconds = combinations / (hashesPerSecond || 1);

  const vulnerabilities: string[] = [];
  if (password.length < 8) vulnerabilities.push("Too short (under 8 chars)");
  if (!/[^a-zA-Z0-9]/.test(password)) vulnerabilities.push("Missing special characters");
  if (!/[0-9]/.test(password)) vulnerabilities.push("Missing numbers");
  
  let score = Math.min(100, (entropy / 80) * 100);
  if (password.length < 6) score *= 0.5;

  return {
    entropy,
    crackingTimeSeconds,
    vulnerabilities,
    score
  };
};
