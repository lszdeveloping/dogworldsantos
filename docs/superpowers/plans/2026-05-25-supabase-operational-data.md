# Supabase Operational Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Store DogWorld operational data in Supabase instead of browser localStorage.

**Architecture:** Keep the existing page/component props intact by replacing `useLocalStorage` usage in `app/page.tsx` with a Supabase-backed hook that returns `[items, setItems]`. Use one table per collection with typed columns, RLS allowing authenticated DogWorld users to read and write shared data.

**Tech Stack:** Next.js 16, React 19, Supabase JS, PostgreSQL/RLS, Vitest.

---

### Task 1: Data Mapping

**Files:**
- Create: `lib/supabase-data.ts`
- Test: `tests/supabase-data.test.ts`

- [ ] Write a failing Vitest test that maps app camelCase fields to Supabase snake_case rows and back.
- [ ] Run `npm test -- tests/supabase-data.test.ts` and confirm it fails because the mapper does not exist.
- [ ] Implement `toSupabaseRow`, `fromSupabaseRow`, and `collectionConfigs` for dogs, presences, payments, grooming appointments, service prices, and alerts.
- [ ] Run `npm test -- tests/supabase-data.test.ts` and confirm it passes.

### Task 2: Database Schema

**Files:**
- Create: `supabase/schema.sql`

- [ ] Add SQL that creates `dogs`, `presences`, `payments`, `grooming_appointments`, `service_prices`, and `alerts`.
- [ ] Enable RLS on each table.
- [ ] Add shared authenticated policies for select, insert, update, and delete.
- [ ] Add `updated_at` trigger support.

### Task 3: React Hook

**Files:**
- Create: `hooks/use-supabase-collection.ts`
- Modify: `app/page.tsx`

- [ ] Implement `useSupabaseCollection(collectionName, initialValue)` with the same setter contract as `useState`.
- [ ] Load rows from Supabase after auth succeeds.
- [ ] Diff previous and next arrays on every setter call and issue upsert/delete operations.
- [ ] Keep optimistic UI updates so existing sections need minimal changes.
- [ ] Replace all `useLocalStorage` calls in `app/page.tsx`.

### Task 4: Verification

**Files:**
- Verify modified source and generated lockfile.

- [ ] Run `npm test`.
- [ ] Run `npx tsc --noEmit --incremental false`.
- [ ] Run `npm run build`.
- [ ] Record any known setup step, especially that `supabase/schema.sql` must be run once in the Supabase SQL Editor.
