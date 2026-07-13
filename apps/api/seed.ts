import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}
if (!process.env.GEMINI_API_KEY) {
  console.error("Missing Gemini API key in .env");
  process.exit(1);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function seed() {
  console.log("Seeding Database...");

  // 1. Check if Pathways2Care tenant exists, if not create it
  let { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .select('*')
    .eq('name', 'Pathways2Care')
    .single();

  if (tenantError && tenantError.code !== 'PGRST116') {
    console.error("Error fetching tenant:", tenantError);
    return;
  }

  if (!tenant) {
    console.log("Creating Pathways2Care tenant...");
    const { data: newTenant, error: createError } = await supabase
      .from('tenants')
      .insert({ name: 'Pathways2Care' })
      .select()
      .single();
    
    if (createError) {
      console.error("Error creating tenant:", createError);
      return;
    }
    tenant = newTenant;
  }

  const tenantId = tenant.id;
  console.log(`Tenant ID: ${tenantId}`);

  // 2. Read the knowledge base file
  const kbPath = path.join(__dirname, '../../pathways2care_kb.txt');
  if (!fs.existsSync(kbPath)) {
    console.error(`Knowledge base not found at ${kbPath}`);
    return;
  }
  
  const kbText = fs.readFileSync(kbPath, 'utf-8');

  // Simple chunking strategy
  const chunks = kbText.split(/(?<=\.)\s+(?=[A-Z])/).filter(c => c.trim().length > 20);
  
  console.log(`Split knowledge base into ${chunks.length} chunks.`);

  // 3. Generate embeddings and upload to Supabase
  const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-2" });

  for (let i = 0; i < chunks.length; i++) {
    const chunkText = chunks[i];
    try {
      const embedResponse = await embedModel.embedContent(chunkText);
      const embedding = embedResponse.embedding.values;

      const { error: insertError } = await supabase
        .from('documents')
        .insert({
          tenant_id: tenantId,
          content: chunkText,
          embedding: embedding
        });

      if (insertError) {
        console.error(`Failed to insert chunk ${i}:`, insertError);
      } else {
        console.log(`Inserted chunk ${i + 1}/${chunks.length}`);
      }
    } catch (err) {
      console.error(`Error processing chunk ${i}:`, err);
    }
  }

  console.log("Seeding complete!");
}

seed();
