#!/usr/bin/env node
/**
 * `node design/readme/build.mjs`: turns progress.md into the README's pictures and tables.
 *
 * 1. Parses progress.md (lessons, scores, weak points, mock exams).
 * 2. Writes design/readme/data.js, which banner.html and progress.html read.
 * 3. Screenshots both pages with headless Chrome or Edge into assets/readme/.
 * 4. Rewrites the README blocks between <!-- name:start --> and <!-- name:end -->.
 *
 * No dependencies: Node 18+ and a Chromium browser. Set CHROME to override the browser path.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const HERE = fileURLToPath(new URL('.', import.meta.url));
const OUT = join(ROOT, 'assets', 'readme');
const DOMAINS = 4; // the exam has four domains (lesson 6)
const SHOTS = [
  { page: 'banner.html', file: 'banner.png', width: 1800, height: 450 },
  { page: 'progress.html', file: 'progress.png', width: 1800, height: 830 },
];
const BROWSERS = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

// ---------- 1. parse progress.md ----------

function parse(md) {
  const lines = md.split(/\r?\n/);
  const sections = [];
  const weak = [];
  const mocks = [];
  const log = [];
  let block = null;
  let section = null;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      block = line.slice(3).trim().toLowerCase();
      section = null;
      continue;
    }
    const head = line.match(/^### Sección (\d+): (.+?)(?: \((\d+) lecciones[^)]*\))?$/);
    if (head) {
      const domain = head[2].match(/^Domain (\d+): (.+)$/);
      section = {
        number: Number(head[1]),
        title: domain ? domain[2] : head[2],
        domain: domain ? Number(domain[1]) : null,
        total: head[3] ? Number(head[3]) : null,
        lessons: [],
        extras: [], // Udemy quizzes and role plays: count toward the domain total, not the score
      };
      sections.push(section);
      continue;
    }
    const extra = line.match(/^- (?:Cuestionario|Role play) \d+: (.+)$/);
    if (extra && section) {
      section.extras.push({ done: /\((?:[^)]*\d+\/\d+|hecho)[^)]*\)/i.test(extra[1]) });
      continue;
    }
    const lesson = line.match(/^- \[( |x|~)\] (\d+)\. (.+?)(?: \(([^)]*)\))?$/);
    if (lesson && section) {
      const score = lesson[4]?.match(/(\d+)\/(\d+)/);
      section.lessons.push({
        number: Number(lesson[2]),
        title: lesson[3],
        state: { x: 'done', '~': 'skipped', ' ': 'todo' }[lesson[1]],
        right: score ? Number(score[1]) : null,
        asked: score ? Number(score[2]) : null,
      });
      continue;
    }
    const item = line.match(/^- (.+)$/);
    if (!item) continue;
    if (block === 'puntos flojos') weak.push(item[1]);
    else if (block === 'simulacros') mocks.push(item[1]);
    else if (block === 'registro') log.push(item[1]);
  }

  const all = sections.flatMap((s) => s.lessons);
  const scored = all.filter((l) => l.asked);
  const right = scored.reduce((n, l) => n + l.right, 0);
  const asked = scored.reduce((n, l) => n + l.asked, 0);

  const domains = Array.from({ length: DOMAINS }, (_, i) => {
    const s = sections.find((x) => x.domain === i + 1);
    if (!s) return { number: i + 1, title: null, done: 0, total: null, right: 0, asked: 0 };
    const sc = s.lessons.filter((l) => l.asked);
    return {
      number: i + 1,
      title: s.title,
      done:
        s.lessons.filter((l) => l.state === 'done').length + s.extras.filter((e) => e.done).length,
      total: s.total ?? s.lessons.length + s.extras.length,
      open: s.total == null, // no total in the heading yet: the domain is still being studied
      right: sc.reduce((n, l) => n + l.right, 0),
      asked: sc.reduce((n, l) => n + l.asked, 0),
    };
  });

  const current = domains.find((d) => d.done && (d.open || d.done < d.total)) ?? domains[0];
  const next = md.match(/^Próxima lección: (.+)$/m)?.[1]?.trim() ?? null;
  const dates = log.map((l) => l.match(/^(\d{4}-\d{2}-\d{2})/)?.[1]).filter(Boolean);

  return {
    updated: dates.at(-1) ?? null,
    started: dates[0] ?? null,
    days: new Set(dates).size,
    lessonsDone: all.filter((l) => l.state === 'done').length,
    skipped: all.filter((l) => l.state === 'skipped').length,
    right,
    asked,
    accuracy: asked ? Math.round((right / asked) * 100) : null,
    domains,
    current: current.number,
    next,
    recent: all
      .filter((l) => l.state === 'done' && l.asked)
      .slice(-5)
      .reverse(),
    weak: weak.filter((w) => !/^ninguno/i.test(w)),
    mocks: mocks.filter((m) => !/^ninguno/i.test(m)),
  };
}

// ---------- 2. README blocks ----------

// Badges are drawn here as SVG files in the repo, not linked from shields.io: GitHub's image proxy
// times out on fresh shields.io URLs and shows a broken image.
const BADGES = join(OUT, 'badges');
const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const textWidth = (s) =>
  [...s].reduce((w, c) => {
    if (/[ il.,:;!|'()\/\[\]1fjtrI]/.test(c)) return w + 3.9;
    if (/[mwMW%]/.test(c)) return w + 10;
    if (/[A-Z0-9]/.test(c)) return w + 7.4;
    return w + 6.6;
  }, 0);

/** Writes assets/readme/badges/<slot>.svg (flat-square look) and returns its README path. */
function badge(slot, label, value, color) {
  const part = (text) => (text ? Math.round(textWidth(text)) + 12 : 0);
  const lw = part(label);
  const vw = part(value);
  const text = (s, x, w) =>
    `<text x="${x + w / 2}" y="14" textLength="${w - 12}" lengthAdjust="spacingAndGlyphs">${xml(s)}</text>`;
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${lw + vw}" height="20" role="img" aria-label="${xml([label, value].filter(Boolean).join(': '))}">`,
    lw ? `<rect width="${lw}" height="20" fill="#555"/>` : '',
    `<rect x="${lw}" width="${vw}" height="20" fill="#${color}"/>`,
    `<g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">`,
    lw ? text(label, 0, lw) : '',
    text(value, lw, vw),
    '</g></svg>',
  ].join('');
  mkdirSync(BADGES, { recursive: true });
  writeFileSync(join(BADGES, `${slot}.svg`), svg + '\n');
  return `assets/readme/badges/${slot}.svg`;
}

function badgesBlock(d) {
  const acc = d.accuracy ?? 0;
  const accColor = acc >= 85 ? '2E9E83' : acc >= 70 ? 'E0A13A' : 'C9544A';
  const cur = d.domains[d.current - 1];
  return [
    `[![Exam](${badge('exam', 'exam', 'AIB-C01', '1B2440')})](#the-brief)`,
    `[![Domain](${badge('domain', `domain ${cur.number}`, `${cur.done}/${cur.open ? '?' : cur.total ?? '?'} lessons`, 'E0A13A')})](#progress)`,
    `[![Accuracy](${badge('accuracy', 'exam-style accuracy', `${acc}% (${d.right}/${d.asked})`, accColor)})](#progress)`,
    `[![Mocks](${badge('mocks', 'mock exams', `${d.mocks.length}/${DOMAINS}`, '5F6073')})](#progress)`,
    `[![License](${badge('license', 'license', 'proprietary', '4A4E6D')})](LICENSE)`,
  ].join('\n');
}

function progressBlock(d) {
  const pill = (slot, text, color) => `![${text}](${badge(slot, '', text, color)})`;
  const rows = d.domains.map((dom) => {
    const name = dom.title ?? '_not reached yet_';
    const slot = `status-domain-${dom.number}`;
    let status;
    if (!dom.total || dom.done === 0) status = pill(slot, 'not started', '5F6073');
    else if (!dom.open && dom.done >= dom.total) status = pill(slot, 'done', '2E9E83');
    else status = pill(slot, 'in progress', 'E0A13A');
    const lessons = dom.total ? `${dom.done}/${dom.open ? '?' : dom.total}` : '–';
    const score = dom.asked ? `${dom.right}/${dom.asked}` : '–';
    return `| ${dom.number} | ${name} | ${lessons} | ${score} | ${status} |`;
  });
  const out = [
    '| | Domain | Lessons | Exam-style | |',
    '|---|---|---|---|---|',
    ...rows,
    '',
    d.next ? `**Next up:** ${d.next}` : '',
    '',
  ];
  if (d.weak.length) {
    out.push('**Weak spots under review** (logged in Spanish, as studied):', '');
    for (const w of d.weak) out.push(`- ${w}`);
    out.push('');
  }
  out.push(
    `<sub>Generated from [progress.md](progress.md) by \`node design/readme/build.mjs\`. Last session: ${d.updated ?? '–'}.</sub>`,
  );
  return out.join('\n');
}

function replaceBlock(text, name, body) {
  const re = new RegExp(`(<!-- ${name}:start -->)[\\s\\S]*?(<!-- ${name}:end -->)`);
  if (!re.test(text)) throw new Error(`README is missing the ${name} block.`);
  return text.replace(re, `$1\n${body}\n$2`);
}

// ---------- 3. screenshots ----------

function shoot(browser, shot) {
  const profile = mkdtempSync(join(tmpdir(), 'aib-readme-'));
  try {
    const r = spawnSync(
      browser,
      [
        '--headless=new',
        '--hide-scrollbars',
        '--disable-gpu',
        '--force-device-scale-factor=1',
        `--window-size=${shot.width},${shot.height}`,
        '--virtual-time-budget=3000',
        `--user-data-dir=${profile}`,
        `--screenshot=${join(OUT, shot.file)}`,
        pathToFileURL(join(HERE, shot.page)).href,
      ],
      { stdio: 'ignore', timeout: 60000 },
    );
    if (r.status !== 0 || !existsSync(join(OUT, shot.file))) {
      throw new Error(`Could not render ${shot.page}.`);
    }
  } finally {
    rmSync(profile, { recursive: true, force: true });
  }
}

// ---------- main ----------

const data = parse(readFileSync(join(ROOT, 'progress.md'), 'utf8'));
writeFileSync(
  join(HERE, 'data.js'),
  `// Generated by build.mjs from progress.md. Do not edit by hand.\nwindow.DATA = ${JSON.stringify(data, null, 2)};\n`,
);

const readmePath = join(ROOT, 'README.md');
let readme = readFileSync(readmePath, 'utf8');
readme = replaceBlock(readme, 'badges', badgesBlock(data));
readme = replaceBlock(readme, 'progress', progressBlock(data));
writeFileSync(readmePath, readme);

const browser = BROWSERS.find((b) => b && existsSync(b));
if (!browser) throw new Error('No Chrome or Edge found; set CHROME to its path.');
mkdirSync(OUT, { recursive: true });
for (const shot of SHOTS) shoot(browser, shot);

console.log(
  `README updated: ${data.lessonsDone} lessons, ${data.right}/${data.asked} right, ${data.weak.length} weak spot(s).`,
);
