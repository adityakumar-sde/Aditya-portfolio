# SPEC.md — ATS Resume Builder

> **Status**: `FINALIZED`

## Vision
Provide a premium, editable software engineering resume builder inside the existing portfolio. The app preview should be polished and responsive, while the printable A4 output remains concise, text-first, ATS-friendly, and consistent with the displayed content.

## Goals
1. **Accurate identity and experience** — Use the supplied headline, phone, email, social URLs, summary, TAM Infosoft role/dates, and ThinkNext internship without inventing metrics.
2. **Prioritized projects** — Show TAM CRM/Dialer first, Ticket Booking second as an academic project, and the verified AI-enabled 3D portfolio third; keep other academic projects compact.
3. **Relevant skills** — Emphasize Java, Spring Boot, REST APIs, SQL/databases, microservices, React, testing/debugging, Git, CI/CD, and telephony; label learning topics clearly.
4. **Complete resume sections** — Include all supplied education, certifications/training, and publication data.
5. **Reliable ATS PDF** — Print the same content shown in the builder as selectable text on A4, and empirically verify the normal default resume is one page.
6. **Editable drafts** — Keep resume content editable and migrate only exact legacy defaults, preserving user customizations.

## Non-Goals (Out of Scope)
- Force arbitrarily long user-entered content onto one page if doing so would make it unreadable.
- Invent project outcomes, employment details, or performance metrics.
- Present planned AI/ML or AI-agent integrations as shipped dialer features.
- Claim that Ticket Booking, lead-processing, or employer-confidential systems are implemented beyond user-provided descriptions or verifiable repo evidence.
- Add server-side resume storage or a PDF generation dependency.

## Constraints
- Use user-provided current role and technology details, supplemented by existing portfolio education and career data.
- Keep the resume text-based, single-column, and readable by ATS software.
- Preserve existing user-edited drafts.
- Keep ATS print output selectable, text-based, and single-column.

## Success Criteria
- [ ] The supplied profile, experience, education, skills, certifications, and publication appear in the resume.
- [ ] Projects render in the requested priority/order with professional, academic, and independent work clearly distinguished.
- [ ] Common Java/backend hiring keywords are present only when supported by the user's experience or clearly marked as learning.
- [ ] Normal default resume prints/downloads as one A4 page with selectable text; editor controls are absent.
- [ ] Legacy saved content cannot silently restore obsolete projects/sections, and edited fields remain preserved.
- [ ] Frontend build, focused lint, and Edge PDF page/content checks pass.

---

*Last updated: 2026-10-02*