import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}
if (!process.env.GEMINI_API_KEY) {
  console.error("Missing Gemini API key in .env");
  process.exit(1);
}

// Initialize clients
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/chat', async (req, res) => {
  const { message, tenant_id, session_id } = req.body;
  
  if (!message || !tenant_id) {
    return res.status(400).json({ error: "Missing message or tenant_id" });
  }

  try {
    // 1. Generate embedding for the user's message using Gemini
    const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
    const embedResponse = await embedModel.embedContent(message);
    const queryEmbedding = embedResponse.embedding.values;

    // 2. Query Supabase for relevant context
    const { data: documents, error: matchError } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.3, // Lowered threshold to ensure we catch relevant docs
      match_count: 5,
      p_tenant_id: tenant_id
    });

    if (matchError) {
      console.error("Supabase match error:", matchError);
      return res.status(500).json({ error: "Failed to retrieve context" });
    }

    console.log(`Matched ${documents?.length || 0} documents from Supabase`);
    const contextText = documents?.map((doc: any) => doc.content).join('\n\n') || "No specific context found.";

    // 3. Build the prompt with NDIS Compliance Rules
    const systemPrompt = `You are a helpful customer support AI for Pathways2Care, an NDIS provider.
    
CRITICAL NDIS COMPLIANCE RULES:
1. NEVER give medical, clinical, or therapeutic advice.
2. NEVER assess or comment on anyone's NDIS eligibility.
3. NEVER promise funding outcomes or say what the NDIS "will pay for". 
4. If asked about funding, ALWAYS refer them to their plan manager, support coordinator, or the NDIA.
5. ALWAYS offer a human escalation path (e.g., "Would you like me to arrange a callback from our team?").
6. If the user mentions self-harm, abuse, or neglect, immediately provide emergency contacts (000, Lifeline 13 11 14) and offer human escalation.
7. You must identify yourself as an AI assistant if asked.
8. ALWAYS keep your responses extremely concise (1-3 short paragraphs max). Do not ramble.

Use the following context from the business's knowledge base to answer the user's question. If the answer is not in the context, do not make it up; politely explain what the business offers or offer to escalate to a human.

BUSINESS CONTEXT:
${contextText}
`;

    // 4. Call Nvidia API to generate the response (OpenAI compatible)
    const openai = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });

    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.1-8b-instruct", // Using the 8B model which is blazingly fast!
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.2,
      max_tokens: 300,
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`API Server listening on port ${port}`);
});
