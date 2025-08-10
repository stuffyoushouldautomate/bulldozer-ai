import { wrapLanguageModel, customProvider, extractReasoningMiddleware } from 'ai';

import { openai } from '@ai-sdk/openai';

const middleware = extractReasoningMiddleware({
  tagName: 'think',
});

export const bulldozer = customProvider({
  languageModels: {
    'bulldozer-default': openai('gpt-4o'),
    'bulldozer-research': openai('gpt-4o'),
    'bulldozer-vision': openai('gpt-4o'),
    'bulldozer-mini': openai('gpt-4o-mini'),
    'bulldozer-o1': openai('o1'),
    'bulldozer-o1-mini': openai('o1-mini'),
    
    // Legacy model aliases for backward compatibility
    'scira-default': openai('gpt-4o'),
    'scira-nano': openai('gpt-4o-mini'),
    'scira-g2': openai('gpt-4o'),
    'scira-x-fast': openai('gpt-4o'),
    'scira-x-fast-mini': openai('gpt-4o-mini'),
    'scira-grok-4': openai('gpt-4o'),
  },
});

// Legacy alias for backward compatibility
export const scira = bulldozer;

export const models = [
  // Labor Union Research Models
  {
    value: 'bulldozer-default',
    label: 'Bulldozer Research',
    description: "Primary model for labor organizing research and company analysis.",
    vision: true,
    reasoning: true,
    experimental: false,
    category: 'Research',
    pdf: true,
    pro: false,
    requiresAuth: false,
    freeUnlimited: true,
    maxOutputTokens: 128000,
  },
  {
    value: 'bulldozer-research',
    label: 'Company Analysis',
    description: "Specialized model for deep company research and union organizing intelligence.",
    vision: true,
    reasoning: true,
    experimental: false,
    category: 'Research',
    pdf: true,
    pro: false,
    requiresAuth: false,
    freeUnlimited: true,
    maxOutputTokens: 128000,
  },
  {
    value: 'bulldozer-vision',
    label: 'Document Scanner',
    description: "Analyze images, PDFs, charts, and documents for organizing research.",
    vision: true,
    reasoning: true,
    experimental: false,
    category: 'Research',
    pdf: true,
    pro: false,
    requiresAuth: false,
    freeUnlimited: true,
    maxOutputTokens: 128000,
  },
  {
    value: 'bulldozer-mini',
    label: 'Quick Research',
    description: "Fast responses for quick fact-checking and basic company lookups.",
    vision: false,
    reasoning: false,
    experimental: false,
    category: 'Research',
    pdf: false,
    pro: false,
    requiresAuth: false,
    freeUnlimited: true,
    maxOutputTokens: 16000,
  },
  {
    value: 'bulldozer-o1',
    label: 'Deep Analysis',
    description: "Advanced reasoning for complex labor strategy and legal analysis.",
    vision: false,
    reasoning: true,
    experimental: false,
    category: 'Analysis',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 65536,
  },
  {
    value: 'bulldozer-o1-mini',
    label: 'Strategic Planning',
    description: "Reasoning model for organizing strategy and tactical planning.",
    vision: false,
    reasoning: true,
    experimental: false,
    category: 'Analysis',
    pdf: false,
    pro: false,
    requiresAuth: true,
    freeUnlimited: true,
    maxOutputTokens: 65536,
  },
];

// Helper functions for model access checks
export function getModelConfig(modelValue: string) {
  return models.find((model) => model.value === modelValue);
}

export function requiresAuthentication(modelValue: string): boolean {
  const model = getModelConfig(modelValue);
  return model?.requiresAuth ?? false;
}

export function requiresProSubscription(modelValue: string): boolean {
  const model = getModelConfig(modelValue);
  return model?.pro ?? false;
}

export function hasVisionSupport(modelValue: string): boolean {
  const model = getModelConfig(modelValue);
  return model?.vision ?? false;
}

export function hasPdfSupport(modelValue: string): boolean {
  const model = getModelConfig(modelValue);
  return model?.pdf ?? false;
}

export function getAcceptedFileTypes(modelValue: string, isProUser: boolean = false): string {
  const model = getModelConfig(modelValue);
  if (!model?.vision) {
    return '';
  }
  
  let acceptedTypes = 'image/*';
  if (model?.pdf && isProUser) {
    acceptedTypes += ',application/pdf';
  }
  
  return acceptedTypes;
}

export function shouldBypassRateLimits(modelValue: string, user: any): boolean {
  const model = getModelConfig(modelValue);
  if (!model) return false;
  
  // If the model has freeUnlimited flag, bypass rate limits
  if (model.freeUnlimited) return true;
  
  // If user is pro, bypass rate limits for pro models
  if (user?.isProUser && model.pro) return true;
  
  // If user is authenticated and model doesn't require pro, bypass limits
  if (user && !model.pro) return true;
  
  return false;
}