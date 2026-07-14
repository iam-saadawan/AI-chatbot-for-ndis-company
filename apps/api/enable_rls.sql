-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_settings ENABLE ROW LEVEL SECURITY;

-- Note: Right now, our Node.js API (apps/api) and our Next.js Server Components 
-- both use the SUPABASE_SERVICE_ROLE_KEY to bypass RLS entirely.
-- By enabling RLS and not adding any public policies, we completely block the 
-- NEXT_PUBLIC_SUPABASE_ANON_KEY from being abused in the browser to steal data.
-- If you later build a frontend dashboard that uses user authentication tokens (instead of the service role),
-- you would add policies here like:
-- CREATE POLICY "Users can view their own tenant" ON tenants FOR SELECT USING (auth.uid() = user_id);
