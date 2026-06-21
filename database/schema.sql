-- CodeMorph AI - Supabase PostgreSQL Schema
-- Run this in your Supabase SQL editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  reset_otp TEXT,
  reset_otp_expiry TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Translations table
CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  source_code TEXT NOT NULL,
  translated_code TEXT,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  translation_id UUID UNIQUE REFERENCES translations(id) ON DELETE CASCADE,
  summary TEXT,
  time_complexity TEXT,
  space_complexity TEXT,
  readability_score NUMERIC,
  maintainability_score NUMERIC,
  issues JSONB DEFAULT '[]',
  suggestions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_translations_user_id ON translations(user_id);
CREATE INDEX IF NOT EXISTS idx_translations_created_at ON translations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_translation_id ON analyses(translation_id);

-- Grant full access to service_role (used by the backend)
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.translations TO service_role;
GRANT ALL ON public.analyses TO service_role;

-- Row Level Security (disabled — backend authenticates via JWT, not Supabase Auth)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE translations DISABLE ROW LEVEL SECURITY;
ALTER TABLE analyses DISABLE ROW LEVEL SECURITY;
