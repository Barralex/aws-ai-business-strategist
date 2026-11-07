<div align="center">

<img src="assets/readme/banner.png" width="100%" alt="AI Business Strategist: AWS Certified AIB-C01 study log, with the AI, ML and GenAI circles nested inside each other">
<br><br>

<!-- badges:start -->
[![Exam](https://img.shields.io/badge/exam-AIB--C01-1B2440?style=flat-square)](#the-brief)
[![Domain](https://img.shields.io/badge/domain%201-8%2F23%20lessons-E0A13A?style=flat-square)](#progress)
[![Accuracy](https://img.shields.io/badge/exam--style%20accuracy-91%25%20%2821%2F23%29-2E9E83?style=flat-square)](#progress)
[![Mocks](https://img.shields.io/badge/mock%20exams-0%2F4-5F6073?style=flat-square)](#progress)
[![License](https://img.shields.io/badge/license-proprietary-4A4E6D?style=flat-square)](LICENSE)
<!-- badges:end -->

### Studying for the AWS Certified AI Business Strategist, out loud.

A personal tutor for the AIB-C01 exam, run by Claude Code.<br>
Every lesson is explained, tied to real client work and tested with exam-style questions.

</div>

---

<img src="assets/readme/progress.png" width="100%" alt="Study progress: lessons done in the current domain, exam-style accuracy, weak spots, mock exams, the four domains and the latest lessons with their scores">

---

## The brief

The AIB-C01 is a business exam, not a technical one: when AI is the right tool, what it costs and returns, and how it is governed and kept working. Watching slides about that is the slowest way to learn it. So the course runs through a tutor instead.

Each lesson goes in as a transcript and comes back as a short explanation, what the exam will ask about it, an example from real work (small businesses in Uruguay, websites, Google Ads and Meta Ads campaigns) and two or three scenario questions, one at a time. A wrong answer gets a hint before it gets the answer. Every miss becomes a weak spot, and the next session opens with questions on it. Each domain closes with a 10-question mock exam, no hints.

## Under the hood

No app, no server. The tutor is [Claude Code](https://claude.com/claude-code) following [CLAUDE.md](CLAUDE.md), which sets the method, the language (Rioplatense Spanish, exam terms kept in English) and the rules: short answers, one idea at a time, nothing taught that is not in the course or the official exam guide.

[progress.md](progress.md) is the single source of truth: lessons, scores, weak spots and mock exams. `node design/readme/build.mjs` reads it, rewrites the badges and the table below, and renders the banner and the progress card above from two HTML pages in headless Chrome or Edge. No dependencies beyond Node.

The course transcripts and slides stay on my machine: they belong to the course and are not in this repository.

## Progress

<!-- progress:start -->
| | Domain | Lessons | Exam-style | |
|---|---|---|---|---|
| 1 | AI Fundamentals and Literacy | 8/23 | 21/23 | ![in progress](https://img.shields.io/badge/-in%20progress-E0A13A?style=flat-square) |
| 2 | _not reached yet_ | – | – | ![not started](https://img.shields.io/badge/-not%20started-5F6073?style=flat-square) |
| 3 | _not reached yet_ | – | – | ![not started](https://img.shields.io/badge/-not%20started-5F6073?style=flat-square) |
| 4 | _not reached yet_ | – | – | ![not started](https://img.shields.io/badge/-not%20started-5F6073?style=flat-square) |

**Next up:** 13 (título a confirmar)

**Weak spots under review** (logged in Spanish, as studied):

- Jerarquía AI ⊃ ML ⊃ GenAI: la invirtió (dijo que GenAI incluye a ML). GenAI es el círculo de adentro y hereda training data, inference y drift. (lección 7)
- Tipo de dato antes que volumen: para un asistente sobre documentos eligió la facturación (más registros) y después "pasar los PDF a Excel". Un asistente que lee necesita unstructured; el volumen nunca compensa el tipo equivocado. (lección 10)

<sub>Generated from [progress.md](progress.md) by `node design/readme/build.mjs`. Last session: 2026-11-06.</sub>
<!-- progress:end -->

## License

&copy; 2026 [Luis Barral](https://barral.dev). All rights reserved. The code and notes are public to read, not to reuse: copying or adapting them needs written permission. See [LICENSE](LICENSE).

AWS and AWS Certified AI Business Strategist are trademarks of Amazon.com, Inc. or its affiliates. This is a personal study log, not affiliated with or endorsed by AWS, Udemy or the course author.

<div align="center">

**[Luis Barral](https://barral.dev)** &middot; All rights reserved

<a href="CLAUDE.md"><img src="assets/readme/signature.svg" height="29" alt="co-assisted by Claude Opus 5.5"></a>

</div>
