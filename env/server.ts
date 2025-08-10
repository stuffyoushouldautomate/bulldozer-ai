// https://env.t3.gg/docs/nextjs#create-your-schema
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const serverEnv = createEnv({
  server: {
    // Core required AI APIs
    OPENAI_API_KEY: z.string().min(1),
    ANTHROPIC_API_KEY: z.string().min(1),
    GROQ_API_KEY: z.string().min(1),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
    
    // Core required services
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    REDIS_URL: z.string().min(1),
    BLOB_READ_WRITE_TOKEN: z.string().min(1),
    CRON_SECRET: z.string().min(1),
    
    // Upstash Redis for database caching
    UPSTASH_REDIS_REST_URL: z.string().min(1),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    
    // Upstash QStash for background job processing
    QSTASH_URL: z.string().min(1),
    QSTASH_TOKEN: z.string().min(1),
    QSTASH_CURRENT_SIGNING_KEY: z.string().min(1),
    QSTASH_NEXT_SIGNING_KEY: z.string().min(1),
    
    // Required search APIs
    TAVILY_API_KEY: z.string().min(1),
    EXA_API_KEY: z.string().min(1),
    FIRECRAWL_API_KEY: z.string().min(1),
    
    // Required Google services
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_MAPS_API_KEY: z.string().min(1),
    
    // Required for maps and location
    MAPBOX_ACCESS_TOKEN: z.string().min(1),
    OPENWEATHER_API_KEY: z.string().min(1),
    
    // Required for media
    TMDB_API_KEY: z.string().min(1),
    YT_ENDPOINT: z.string().min(1),
    ELEVENLABS_API_KEY: z.string().min(1),
    
    // Required memory/MCP
    MEM0_API_KEY: z.string().min(1),
    MEM0_ORG_ID: z.string().min(1),
    MEM0_PROJECT_ID: z.string().min(1),
    SMITHERY_API_KEY: z.string().min(1),
    
    // Optional APIs (can be disabled/unused)
    XAI_API_KEY: z.string().optional(),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    TWITTER_CLIENT_ID: z.string().optional(),
    TWITTER_CLIENT_SECRET: z.string().optional(),
    AMADEUS_API_KEY: z.string().optional(),
    AMADEUS_API_SECRET: z.string().optional(),
    COINGECKO_API_KEY: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    DAYTONA_API_KEY: z.string().optional(),
    
    // Payment APIs (optional if payments are disabled)
    DODO_PAYMENTS_API_KEY: z.string().optional(),
    DODO_PAYMENTS_WEBHOOK_SECRET: z.string().optional(),
    POLAR_ACCESS_TOKEN: z.string().optional(),
    POLAR_WEBHOOK_SECRET: z.string().optional(),
    
    // Always optional
    ALLOWED_ORIGINS: z.string().optional().default('http://localhost:3000'),
  },
  experimental__runtimeEnv: process.env,
});
