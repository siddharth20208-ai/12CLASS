// New features: numericals, organic reactions, SVG diagrams, full mock test scoring.
// usage: node tests/e2e3.mjs <site root>
import fs from 'fs';
import { load } from './harness.mjs';
const ROOT = process.argv[2] || '..';
const { $, $$, sleep, go, check } = load(ROOT);

$('button[data-board=hsc]').click();
await go('#/physics/practice/7');
check('physics chapter shows 8 solved + 6 practice numericals', $$('#sums .sum').length === 14);
await go('#/chemistry/practice/2');
check('physical chemistry chapter shows numericals', $$('#sums .sum').length === 14);
await go('#/chemistry/practice/11');
check('organic chapter has no numericals section', !$('#sums'));
check('organic chapter shows named reactions + 8 conversions', $$('#reactions .rx').length >= 8 && $$('#reactions details.steps').length === 8);

// a topic with an svg diagram renders an <img> pointing at an existing file
let svgTopic = null;
for (const s of ['physics', 'chemistry', 'biology', 'math']) for (const f of fs.readdirSync(`${ROOT}/notes/${s}`)) {
  JSON.parse(fs.readFileSync(`${ROOT}/notes/${s}/${f}`)).forEach((t, k) => { if (!svgTopic && t.diagram?.svg) svgTopic = { s, i: parseInt(f), k, svg: t.diagram.svg }; });
}
check('at least one svg diagram exists', !!svgTopic);
if (svgTopic) {
  await go(`#/${svgTopic.s}/practice/${svgTopic.i}`);
  const img = $$('#notes img.dia')[0];
  check('svg diagram shown as image', img && img.getAttribute('src') === svgTopic.svg && fs.existsSync(`${ROOT}/${svgTopic.svg}`));
}

// mock test: answer all MCQs right, tick every marking point in B only, nothing else
await go('#/physics/mock');
check('mock list shows 2 papers', $$('.chcard').length === 2);
await go('#/physics/mock/0');
const paper = JSON.parse(fs.readFileSync(`${ROOT}/mock/physics/0.json`));
const A = paper.sections[0], B = paper.sections[1];
A.items.forEach((x, ii) => { if (x.type === 'mcq') $(`[data-id="0-${ii}"] input[value="${x.a}"]`).checked = true; });
B.items.forEach((x, ii) => $$(`[data-id="1-${ii}"] .mpt input`).forEach((c) => { c.checked = true; }));
$('[data-act="submit"]').click(); await sleep(30);
const mcqMarks = A.items.filter((x) => x.type === 'mcq').reduce((t, x) => t + x.marks, 0);
const expect = mcqMarks + 16; // B: best 8 of 12 two-mark items, all full
check(`mock score = all MCQs (${mcqMarks}) + best 8 of section B (16)`, new RegExp(`Your score: ${expect} / 70`).test($('#mresult').textContent));
check('mock lists chapters to revise', $$('#mresult .task').length > 0);
await go('#/physics/mock');
check('mock list remembers best score', $$('.chcard')[0].textContent.includes(`Best: ${expect}/70`));
