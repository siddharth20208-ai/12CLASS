// Parses every mermaid diagram in notes/*/*.json with the real mermaid parser. Exit 1 on any failure.
// usage: node tests/diagrams.mjs <site root>
import { JSDOM } from 'jsdom';
import fs from 'fs';
const dom = new JSDOM('<!doctype html><body></body>');
globalThis.window = dom.window; globalThis.document = dom.window.document;
const { default: mermaid } = await import('mermaid');
mermaid.initialize({ startOnLoad: false });
const root = process.argv[2] || '..'; let n = 0; const bad = [];
for (const s of ['physics', 'chemistry', 'biology', 'math']) for (const f of fs.readdirSync(`${root}/notes/${s}`)) {
  for (const t of JSON.parse(fs.readFileSync(`${root}/notes/${s}/${f}`))) {
    const m = t.diagram && t.diagram.mermaid; if (!m) continue; n++;
    try { await mermaid.parse(m); } catch (e) { bad.push(`${s}/${f} :: ${t.t} :: ${String(e.message || e).split('\n')[0].slice(0, 90)}`); }
  }
}
console.log('mermaid parsed', n, 'failed', bad.length); bad.forEach((b) => console.log('FAIL ' + b));
if (bad.length) process.exitCode = 1;
