# AI Chatbot for Businesses (Pathways2Care Pilot)

A full-stack, multi-tenant AI chatbot platform designed specifically for NDIS providers, but architected to scale to any SMB.

## Architecture

This monorepo contains a complete, production-ready system:

- **`/apps/api` (Backend Express Server)**
  - Handles RAG (Retrieval-Augmented Generation) using Supabase `pgvector`.
  - Embeddings powered by `gemini-embedding-2`.
  - Chat generation powered by `meta/llama-3.1-8b-instruct` (NVIDIA NIM) for blazing-fast inference.
  - Fully hardened with `helmet` security headers, strict CORS, rate limiting (20 req/min), and global error handlers.

- **`/apps/dashboard` (Admin Next.js Frontend)**
  - Built with Next.js App Router, Tailwind CSS, and Recharts.
  - **Conversations & Analytics**: Live monitoring of chat transcripts and key performance metrics (Token usage, volume, trends).
  - **CRM**: Patient records management and the ability to manually link anonymous chatbot sessions to specific patient profiles.
  - **Settings**: Tenant-level widget configuration (colors, custom prompts).

- **`/apps/widget` (Embeddable Frontend)**
  - Vanilla JS, injected via `<script>` tag into any website.
  - Fetches dynamic settings (like primary color and welcome message) directly from the dashboard configurations.

## Database & Security

Powered by Supabase PostgreSQL. The database is strictly secured:
- **Row Level Security (RLS)** is enabled on all tables.
- Public data access is completely blocked. 
- The backend API and dashboard utilize the `SUPABASE_SERVICE_ROLE_KEY` to securely bypass RLS for administrative operations.

## Development

1. **Dashboard**: `cd apps/dashboard && npm run dev` (Runs on port 3002)
2. **API**: `cd apps/api && npm run dev` (Runs on port 3000)
3. **Widget**: `cd apps/widget && npm run dev` (Runs on port 5173)

*Note: Ensure you have populated `.env` in the API and `.env.local` in the dashboard before starting the servers.*
