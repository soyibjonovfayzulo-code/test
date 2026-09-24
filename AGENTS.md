# ORZUTALIM — DEVELOPMENT RULES & GUIDELINES

## Core Principles
1. **ONE FEATURE → ONE MAIN IMPLEMENTATION → ONE SOURCE OF TRUTH.**
2. **Existing File First:** Modify existing files instead of creating new ones whenever possible.
3. **No Duplicates:** Never create `*-v2.*`, `*-new.*`, `*-final.*`, `*-probe.*`, `*-check.*` files.
4. **Clean Project Root:** Do not leave temporary text outputs (`*.out.txt`, `*.txt`, `*.bak`, `*.log`) in project root or committed to git.
5. **Testing Standard:** Automated tests belong in `audit-tests.cjs`, `github-team-bot/test/`, or `server/*.test.cjs`.
