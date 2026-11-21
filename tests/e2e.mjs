// Core pages: hub, notes, quiz, sums, formulas, past papers, board switch. usage: node tests/e2e.mjs <site root>
import fs from 'fs';
import { load } from './harness.mjs';
const ROOT = process.argv[2] || '..';
const { w, $, $$, sleep, go, check } = load(ROOT);

$('button[data-board=hsc]').click(); await go('#/physics');
check('hub has exactly 3 steps Learn/Practice/Exam Prep', $$('.step h3').map((e) => e.textContent.replace(/[^A-Za-z ]/g, '').trim()).join('|') === 'Learn|Practice|Exam Prep');
check('hub continue button points to Ch 1', /Continue: Ch 1/.test($('.bigbtn')?.textContent));
check('hub progress bar 0/16', /0 of 16 chapters done/.test($('.pnote')?.textContent));

await go('#/physics/practice/0');
check('chapter notes loaded (5 topics)', $$('#notes details.note').length === 5);
check('topic has video + shaalaa links', $$('#notes .xlink').some((a) => a.href.includes('youtube.com')) && $$('#notes .xlink').some((a) => a.href.includes('site%3Ashaalaa.com')));
check('superscript rendered in notes', $('#notes').innerHTML.includes('r<sup>2</sup>'));
check('question has shaalaa link', $$('.qa .ans .xlink').some((a) => a.textContent.includes('Shaalaa')));

await go('#/physics/quiz/0');
const boxes = $$('#quiz .mcq');
check('quiz shows 10 questions', boxes.length === 10);
const qs = JSON.parse(fs.readFileSync(`${ROOT}/mcq/physics/0.json`));
boxes.forEach((b, n) => b.querySelectorAll('.opt')[n < 7 ? qs[n].a : (qs[n].a + 1) % 4].click());
check('wrong answer marked red + correct green', boxes[9].querySelector('.opt.bad') && boxes[9].querySelector('.opt.ok'));
check('score shows 7 / 10', /7 \/ 10/.test($('.score').textContent));
await go('#/physics/quiz');
check('quiz list shows best 7/10', $$('.chcard .meta').some((m) => m.textContent.includes('Best: 7/10')));

await go('#/math/practice/0');
check('math chapter shows 12 solved sums with steps', $$('#sums .sum').length === 20 && $$('#sums details.steps ol').length === 12);
check('math sums come before theory', $('#sums').compareDocumentPosition($('#notes')) & 4);
await go('#/biology/practice/0');
check('biology chapter has no sums section', !$('#sums'));
await go('#/physics/pyq');
check('exam prep links pattern + formula sheet + important Qs', ['pattern', 'formulas', 'prep'].every((r) => $(`a[href="#/physics/${r}"]`)));
await go('#/physics/pattern');
check('pattern page: 4 sections totalling 70', $$('.ptable tbody tr').length === 4 && /70/.test($('.ptable tfoot').textContent));
await go('#/chemistry/formulas'); await sleep(100);
check('formula sheet has chapters', $$('#formulas .unit').length >= 10);
await go('#/biology/pyq');
check('pyq links to official shaalaa biology papers', $$('.official .xlink').some((a) => a.href.includes('search-question-papers') && a.href.includes('biology_763')));
check('practice papers labelled honestly', /not official papers/.test($('.sect').textContent));
$('button[data-board=cbse]').click(); await go('#/physics');
check('CBSE Practice step goes to important questions', $$('.step')[1].getAttribute('href') === '#/physics/prep');
