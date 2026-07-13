-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table for tenants (businesses)
create table tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for knowledge base documents
create table documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  content text not null,
  embedding vector(3072), -- Google Gemini embeddings are 3072 dimensions
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for conversations
create table conversations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  session_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for messages
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a function to search for documents
create or replace function match_documents (
  query_embedding vector(3072),
  match_threshold float,
  match_count int,
  p_tenant_id uuid
)
returns table (
  id uuid,
  content text,
  similarity float
)
language sql stable
as $$
  select
    documents.id,
    documents.content,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where documents.tenant_id = p_tenant_id
  and 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
