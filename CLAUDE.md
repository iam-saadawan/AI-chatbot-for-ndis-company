# Pathways2Care NDIS Chatbot (embeddable chatbot SaaS)

This is the AI chatbot project — portfolio-first spec build for Pathways2Care
(Saad's employer, NOT a client yet), designed multi-tenant for future resale.

**Before any task, load context from the Second Brain:**
1. `/Users/saad/Second Brain/CLAUDE.md` — operating manual and standing rules
2. `/Users/saad/Second Brain/clients/pathway2care/` — profile, RULES (read rules.md
   first — NDIS compliance is non-negotiable), preferences, history
3. `/Users/saad/Second Brain/skills/SKILL_BIBLE_ndis_compliance.md` — language rules,
   must/must-not list, adversarial test set

The QA/compliance SOP (run before every deploy or demo):
`/Users/saad/Second Brain/directives/ndis_chatbot_qa.md`

Decided stack: embeddable JS widget, Supabase pgvector RAG, claude-haiku-4-5,
Next.js dashboard + Node/Express API. Current status and next step:
`/Users/saad/Second Brain/brain/references/pathway2care-chatbot-status.md`.
Log meaningful outcomes to `clients/pathway2care/history.md` in the Second Brain.
