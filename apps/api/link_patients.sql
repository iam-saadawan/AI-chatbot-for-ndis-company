-- Run this in your Supabase SQL Editor to link conversations to patients

ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS patient_id UUID REFERENCES patients(id) ON DELETE SET NULL;
