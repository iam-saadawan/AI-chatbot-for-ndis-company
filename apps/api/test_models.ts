import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function main() {
  console.log("Checking available models...");
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log(JSON.stringify(data.models.map((m: any) => m.name), null, 2));
  } catch (error) {
    console.error("Error fetching models:", error);
  }
}

main();
