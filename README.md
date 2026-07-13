# Pathways2Care AI Chatbot & Widget

A multi-tenant, AI-powered customer support chatbot designed specifically for NDIS providers. Built with a fast, modern tech stack for instantaneous responses, complete with an embeddable widget.

## Architecture & Tech Stack

This project is a monorepo containing the backend API and the embeddable frontend widget.

- **Backend API (`apps/api`)**
  - **Node.js & Express**: Handles chat requests and semantic search.
  - **Database**: Supabase `pgvector` for storing and querying text embeddings.
  - **Embeddings**: Gemini API (`gemini-embedding-2`) for lightning-fast knowledge base vectorization.
  - **Generation**: NVIDIA NIM (`meta/llama-3.1-8b-instruct`) using the OpenAI SDK for blazing-fast inference.
  - **Compliance**: Strict NDIS guardrails baked into the system prompt to prevent giving medical advice or commenting on eligibility.

- **Frontend Widget (`apps/widget`)**
  - **Vanilla TypeScript/JS**: Zero-dependency frontend logic ensuring maximum compatibility on any website (WordPress, Elementor, etc.).
  - **Vite & CSS Injection**: Built using Vite with `vite-plugin-css-injected-by-js` to output a single, universally embeddable `main.js` file.
  - **Design**: Premium glassmorphism styling, micro-animations, and dynamic configuration via dataset attributes.

## How It Works (RAG System)

1. The company's knowledge base is scraped and chunked.
2. The chunks are embedded using Gemini and stored in Supabase `pgvector`.
3. When a user asks a question via the frontend widget, the backend API uses Gemini to embed the query and searches Supabase for the most relevant context using cosine similarity.
4. The relevant context is passed to the NVIDIA NIM LLM, strictly bound by NDIS compliance rules, which returns a concise, accurate response.

## Getting Started

### 1. Environment Setup

Create an `.env` file in `apps/api/` (refer to `.env.example`):
```bash
PORT=3000
SUPABASE_URL="your-supabase-url"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
GEMINI_API_KEY="your-gemini-key"
NVIDIA_API_KEY="your-nvidia-key"
```

### 2. Backend (API)
```bash
cd apps/api
npm install
npx tsx seed.ts  # (Optional) Seed the vector database with the knowledge base
npx tsx index.ts # Start the API server
```

### 3. Frontend (Widget)
```bash
cd apps/widget
npm install
npm run dev # Test the widget locally
npm run build # Build the single-file embed script for production
```
