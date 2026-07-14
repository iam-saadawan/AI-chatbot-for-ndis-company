import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function check() {
  const { data: pData, error: pError } = await supabase.from('patients').select('*');
  console.log("Patients:", pData ? pData.length : 'null');
  console.log("Patients Error:", pError);

  const { data: sData, error: sError } = await supabase.from('tenant_settings').select('*');
  console.log("Settings:", sData ? sData.length : 'null');
  console.log("Settings Error:", sError);
}

check();
