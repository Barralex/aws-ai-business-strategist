<div align="center">

<img src="assets/readme/banner.png" width="100%" alt="AI Business Strategist: AWS Certified AIB-C01 study log, with the AI, ML and GenAI circles nested inside each other">
<br><br>

<!-- badges:start -->
[![Exam](https://img.shields.io/badge/exam-AIB--C01-1B2440?style=flat-square)](#the-brief)
[![Domain](https://img.shields.io/badge/domain%201-20%2F23%20lessons-E0A13A?style=flat-square)](#progress)
[![Accuracy](https://img.shields.io/badge/exam--style%20accuracy-94%25%20%2863%2F67%29-2E9E83?style=flat-square)](#progress)
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
| 1 | AI Fundamentals and Literacy | 20/23 | 51/54 | ![in progress](https://img.shields.io/badge/-in%20progress-E0A13A?style=flat-square) |
| 2 | AI Strategy and Business Value Creation | 5/18 | 12/13 | ![in progress](https://img.shields.io/badge/-in%20progress-E0A13A?style=flat-square) |
| 3 | _not reached yet_ | – | – | ![not started](https://img.shields.io/badge/-not%20started-5F6073?style=flat-square) |
| 4 | _not reached yet_ | – | – | ![not started](https://img.shields.io/badge/-not%20started-5F6073?style=flat-square) |

**Next up:** 30. Moving a Live Process to AI

**Weak spots under review** (logged in Spanish, as studied):

- Sunk cost vs pause: ante "ya invertimos 2 millones, no podemos abandonarlo" (sin uso ni mejora) eligió pausar para arreglar datos que no eran el problema. Pause solo si podés nombrar problema, arreglo y fecha; si el único argumento es lo ya gastado, es sunk cost → terminate. La sacó con pista. (lección 29)
- Bias drift vs data drift: con el total estable y un grupo que cae (interior de 85% a 62%), eligió data drift. Total estable y un grupo peor = bias drift; data drift es que los inputs ya no se parecen a los de training. La sacó con pista. (lección 15)

<sub>Generated from [progress.md](progress.md) by `node design/readme/build.mjs`. Last session: 2026-11-08.</sub>
<!-- progress:end -->

## License

&copy; 2026 [Luis Barral](https://barral.dev). All rights reserved. The code and notes are public to read, not to reuse: copying or adapting them needs written permission. See [LICENSE](LICENSE).

AWS and AWS Certified AI Business Strategist are trademarks of Amazon.com, Inc. or its affiliates. This is a personal study log, not affiliated with or endorsed by AWS, Udemy or the course author.

<div align="center">

**[Luis Barral](https://barral.dev)** &middot; All rights reserved

<a href="CLAUDE.md"><img src="assets/readme/signature.svg" height="29" alt="co-assisted by Claude Opus 5.5"></a>

</div>
