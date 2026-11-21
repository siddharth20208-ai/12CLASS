// Beginner UX: welcome card, board pick, help page, simple header. usage: node tests/e2e4.mjs <site root>
import { load } from './harness.mjs';
const { w, $, $$, go, check } = load(process.argv[2] || '..');
await go('#/');
check('first visit shows welcome card with 2 board buttons', !!$('.welcome') && $$('.pickbtn').length === 2);
check('welcome explains 4 steps', $$('.welcome .how').length === 4);
$('[data-action="pick-board"][data-board="hsc"]').click();
check('picking HSC switches board', $('.boardsw button.on').dataset.board === 'hsc' && /Maharashtra HSC/.test($('.hero').textContent));
check('home shows 4 big subject cards with icons', $$('.subj').length === 4 && $$('.subjicon').length === 4);
$('[data-action="dismiss-welcome"]').click();
check('welcome hidden after Got it', !$('.welcome'));
await go('#/'); check('welcome stays hidden on next visit', !$('.welcome'));
check('header has only Home, My Plan, Help', $$('.links a').map((a) => a.getAttribute('href')).join(' ') === '#/ #/plan #/help');
await go('#/help');
check('help page explains steps, colours and questions', $$('.how').length === 4 && $$('.tag').length >= 4 && $$('details.q').length >= 5);
