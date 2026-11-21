// Study system: priority, 7/10 gate, weak list, spaced revision (moving clock), study plan.
// usage: node tests/e2e2.mjs <site root>
import { load } from './harness.mjs';
const ROOT = process.argv[2] || '..';
const { w, $, $$, sleep, go, check, takeQuiz, clock, DAY } = load(ROOT);

$('button[data-board=hsc]').click(); await go('#/');
check('home shows Today card with Learn tasks', !!$('.today') && $$('.today .t-learn').length > 0);
check('home asks for exam date when not set', /Set your exam date/.test($('.today').textContent));
await go('#/physics/practice');
check('chapter list shows priority labels', $$('.prio').length === 16 && $$('.p-High').length === 6);
check('Electromagnetic Induction is High', $$('.chcard').find((c) => /Electromagnetic Induction/.test(c.textContent)).querySelector('.p-High'));

await go('#/physics/practice/0');
check('HSC chapter has test gate, no manual done button', /Score 7\/10/.test($('.gate')?.textContent) && !$('[data-action="toggle-done"]'));
await takeQuiz('physics', 0, 6);
check('6/10 does NOT complete chapter', /You need 7\/10/.test($('.score').textContent));
await go('#/physics');
check('progress still 0/16 after failing', /0 of 16/.test($('.pnote').textContent));
await go('#/');
check('failed chapter appears as Weak on Today', $$('.today .task').some((t) => /Weak/.test(t.textContent) && /Rotational Dynamics/.test(t.textContent)));

await takeQuiz('physics', 0, 8);
check('8/10 passes and says so', /Passed!/.test($('.score').textContent));
await go('#/physics');
check('progress 1/16 after passing', /1 of 16/.test($('.pnote').textContent));
check('continue button moves to Ch 2', /Continue: Ch 2/.test($('.bigbtn').textContent));
await go('#/physics/practice/0');
check('chapter shows mastered with best score', /mastered \(best 8\/10\)/.test($('.gate').textContent));
await go('#/');
check('weak entry gone after passing', !$$('.today .task').some((t) => /Weak/.test(t.textContent)));
check('no revision due on day 0', !$$('.today .t-due').length);

clock.offset = 3 * DAY + 1000; await go('#/');
check('day 3: Rotational Dynamics due for re-test', $$('.today .task').some((t) => /Revise/.test(t.textContent) && /Rotational Dynamics/.test(t.textContent)));
await takeQuiz('physics', 0, 9); await go('#/');
check('after re-test pass, not due again immediately', !$$('.today .t-due').length);
clock.offset = (3 + 6) * DAY; await go('#/');
check('6 days after re-test: not yet due (gap is 7)', !$$('.today .t-due').length);
clock.offset = (3 + 7) * DAY + 1000; await go('#/');
check('7 days after re-test: due again', $$('.today .t-due').length === 1);
clock.offset = 0;

await go('#/plan');
const d = new w.Date(); d.setDate(d.getDate() + 60);
$('#examdate').value = d.toISOString().slice(0, 10);
$('[data-action="save-exam"]').click(); await sleep(30);
const rows = $$('.dayrow');
check('plan has one row per day until exam (60)', rows.length === 60);
check('first row is Today', rows[0].querySelector('.daydate').textContent === 'Today');
check('plan schedules all 61 not-done chapters exactly once', rows.reduce((n, r) => n + r.querySelectorAll('.t-learn').length, 0) === 61);
check('last 12 days are past-paper days', rows.slice(-12).every((r) => r.querySelector('.t-paper') && !r.querySelector('.t-learn')));
check('day 1 starts with High-mark chapters', [...rows[0].querySelectorAll('.task .tag')].every((t) => t.textContent === 'High'));
check('subjects are mixed on day 1', new Set([...rows[0].querySelectorAll('.task')].map((t) => t.textContent.split('·')[0])).size >= 2);
await go('#/');
check('Today card shows days left', /60 days to exam/.test($('.pill-big')?.textContent));
$('button[data-board=cbse]').click(); await go('#/physics/practice/0');
check('CBSE keeps manual done button', !!$('[data-action="toggle-done"]'));
