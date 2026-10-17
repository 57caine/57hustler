#!/usr/bin/env node
// Static audit only. A8 a8mat prefix is NOT proof of registered site or conversion attribution.
import fs from 'node:fs';

const files = [
  ['lens-navi', 'app/ranking/page.tsx'],
  ['lens-navi', 'app/karakon/page.tsx'],
  ['lens-navi', 'data/products.json'],
  ['lens-navi', 'data/prices.json'],
  ['school-navi (stopped)', 'school-navi/data/schools.json'],
];
const rows = [];
const byPrefix = new Map();
for (const [project, path] of files) {
  const source = fs.readFileSync(path, 'utf8');
  const codes = [...source.matchAll(/(?:https?:\\?\/\\?\/)?px\.a8\.net[^\s"'<>]*?a8mat=([A-Za-z0-9]+)\+([A-Za-z0-9]+)/g)];
  const counts = new Map();
  for (const match of codes) {
    const prefix = match[1];
    counts.set(prefix, (counts.get(prefix) || 0) + 1);
    if (!byPrefix.has(prefix)) byPrefix.set(prefix, new Set());
    byPrefix.get(prefix).add(project);
  }
  for (const [prefix, count] of counts) rows.push({project, path, prefix, count});
}
const shared = [...byPrefix.entries()].filter(([, projects]) => projects.size > 1);
const lines = [
  '# A8 link identifier audit (static, selected files)',
  '',
  'Read-only sample of selected repository files; does not cover generated pages or all links.',
  'The first segment of a8mat is an identifier for grouping, NOT verified site registration, link ownership, conversion or confirmed commission.',
  '',
  '| Project | File | a8mat first segment | Occurrences |',
  '|---|---|---|---:|',
  ...rows.map(r => `| ${r.project} | \`${r.path}\` | \`${r.prefix}\` | ${r.count} |`),
  '',
  '## Identifiers present in multiple projects',
  ...shared.map(([prefix, projects]) => `- \`${prefix}\`: ${[...projects].join(', ')} — requires A8 dashboard verification`),
  ...(shared.length ? [] : ['- None found in selected files']),
  '',
  '**Do not change affiliate URLs based on this audit alone.** Confirm site registration and per-site link issuance in A8.net.',
  '',
];
console.log(lines.join('\n'));
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n'));
