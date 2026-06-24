import { z } from "zod/v4";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  FLOWISE_URL: z.string().optional(),
  FLOWISE_API_KEY: z.string().optional(),
  AGENT_TRENDYAI_CORE: z.string().optional(),
  AGENT_CLIENT_FLOW: z.string().optional(),
  AGENT_CONTENT_SMITH: z.string().optional(),
  AGENT_STRATO_BOSS: z.string().optional(),
  AGENT_WEB_WIZ: z.string().optional(),
  AGENT_PIXEL_DEX: z.string().optional(),
  AGENT_MEDIA_WIZ: z.string().optional(),
  AGENT_PULSE_PILOT: z.string().optional(),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_SERVICE_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
});

try {
  // eslint-disable-next-line node/no-process-env
  envSchema.parse(process.env);
}
catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Missing environment variables:", error.issues.flatMap(issue => issue.path));
  }
  else {
    console.error(error);
  }
  process.exit(1);
}

// eslint-disable-next-line node/no-process-env
export const env = envSchema.parse(process.env);
