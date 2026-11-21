// Gap features: textbook solutions links, last-day revision, mixed tests. usage: node tests/e2e5.mjs <site root>
import fs from 'fs';
import { load } from './harness.mjs';
const ROOT = process.argv[2] || '..';
const { $, $$, sleep, go, check } = load(ROOT);

$('button[data-board=hsc]').click();
await go('#/biology/pyq');
const tb = $$('a.card').find((a) => /Textbook solutions/.test(a.textContent));
check('exam prep has textbook solutions link to Shaalaa biology', tb && tb.href.includes('search-textbook-solutions') && tb.href.includes('biology_763'));
check('exam prep has last-day revision card', !!$('a[href="#/biology/revise"]'));
await go('#/physics/practice/3');
check('chapter page links quick revision + textbook solutions', !!$('a[href="#/physics/revise/3"]') && $$('.actions a').some((a) => a.href.includes('class-physics_754')));

await go('#/physics/revise'); check('revision list has 16 chapters', $$('.chcard').length === 16);
await go('#/physics/revise/0'); await sleep(60);
const notes = JSON.parse(fs.readFileSync(`${ROOT}/notes/physics/0.json`));
check('revision page: one definition per topic', $$('#revise .revlist')[0]?.querySelectorAll('li').length === notes.length);
check('revision page: formulas + exam focus + questions', $$('#revise .formula').length >= 1 && !!$('#revise .freq') && $$('#revise ol.revlist li').length >= 1);

await go('#/math/quiz');
check('practice page shows 4 mixed tests for 15 maths chapters', $$('.mixcard').length === 4);
await go('#/physics/mixed/0'); await sleep(80);
const boxes = $$('#mixed .mcq');
check('mixed test 1 has 20 questions from chapters 1-4', boxes.length === 20 && new Set($$('#mixed .mq .src').map((e) => e.textContent)).size === 4);
const firstQ = $('#mixed .mq').textContent;
// answer: all right except every question from Ch 2
const qsets = [0, 1, 2, 3].map((i) => JSON.parse(fs.readFileSync(`${ROOT}/mcq/physics/${i}.json`)).slice(0, 5));
boxes.forEach((b, n) => { const ch = Math.floor(n / 5), x = qsets[ch][n % 5]; b.querySelectorAll('.opt')[ch === 1 ? (x.a + 1) % 4 : x.a].click(); });
await sleep(20);
check('mixed score 15/20', /Your score: 15 \/ 20/.test($('#mixed .score').textContent));
check('mixed test points to exactly Ch 2 to revise', $$('#mixed .score .task').length === 1 && /Ch 2/.test($('#mixed .score .task').textContent));
await go('#/physics/mixed/0'); await sleep(80);
check('retry gives different questions', $('#mixed .mq').textContent !== firstQ);
await go('#/physics/quiz');
check('practice page remembers mixed best 15/20', $$('.mixcard')[0].textContent.includes('Best: 15/20'));
