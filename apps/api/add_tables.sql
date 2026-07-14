-- Run this in your Supabase SQL Editor to add the new tables

-- Create a table for patients
create table patients (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  ndis_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for tenant settings
create table tenant_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null unique,
  system_prompt text not null default 'You are a helpful AI assistant for an NDIS provider. Answer questions politely.',
  primary_color text not null default '#2563eb',
  welcome_message text not null default 'Hi there! 👋 How can I help you today?',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
