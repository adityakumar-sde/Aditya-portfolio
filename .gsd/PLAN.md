---
phase: 1
plan: 1
wave: 1
gap_closure: false
---

# Plan 1.1: Skills-and-Projects-First One-Page Resume

**Status:** In progress — expanded resume content and default project order.

## Objective
Upgrade the existing resume builder using the supplied career profile, prioritize dialer and ticket-booking work, preserve factual boundaries, and verify the actual A4 PDF output.

## Context
Load these files for context:
- .gsd/SPEC.md
- frontend/src/components/ResumeModal.tsx
- frontend/src/components/ResumeModal.css
- frontend/src/data/portfolioData.ts

## Tasks

<task type="auto">
  <name>Add editable featured projects to the resume</name>
  <files>
    frontend/src/components/ResumeModal.tsx
  </files>
  <action>
    Use the supplied exact professional title, contact details, summary, TAM Infosoft dates/responsibilities, ThinkNext internship, all education, certificates, publication, and relevant skills. Order projects: TAM dialer first, user-described academic Ticket Booking second, verified AI-enabled portfolio third; keep other academics compact. Do not invent dates/metrics or claim unverified implementation details. Migrate only known exact legacy defaults while preserving edits.

    AVOID: Unsupported metrics or invented project claims because ATS keywords must remain truthful.
    USE: User-provided current role and stack details; retain portfolio education and earlier experience.
  </action>
  <verify>pnpm --dir frontend build</verify>
  <done>The resume defaults contain the supplied professional content and prioritized projects; all sections remain editable and factual.</done>
</task>

<task type="auto">
  <name>Tune one-page print layout</name>
  <files>
    frontend/src/components/ResumeModal.css
  </files>
  <action>
    Keep the builder responsive and polished, but print only the resume root. Use one A4 page for concise defaults, selectable text, visible contact links, no editor controls, and sensible pagination for custom overlong content. Ensure section groups can flow instead of forcing whole large sections to new pages.

    AVOID: Hiding overflow or shrinking text to unreadable sizes to force arbitrary custom content onto one page.
    USE: The concise default content and compact print typography.
  </action>
  <verify>pnpm --dir frontend exec oxlint src/components/ResumeModal.tsx</verify>
  <done>Edge print output shows the complete normal resume on one A4 page; long user-edited content remains readable and may paginate.</done>
</task>

## Must-Haves
After all tasks complete, verify:
- [ ] Supplied profile, experience, education, certifications, and publication are displayed.
- [ ] Project order is dialer, ticket booking, verified AI portfolio, then compact academics.
- [ ] Legacy draft migration preserves user edits without rendering obsolete extra sections.
- [ ] Build and focused lint pass.
- [ ] Edge PDF contains the complete default resume on exactly one A4 page.

## Success Criteria
- [ ] All tasks verified passing.
- [ ] Must-haves confirmed.