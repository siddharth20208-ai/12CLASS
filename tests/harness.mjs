// Loads the real index.html + all site scripts into jsdom, with fetch served from disk and a movable clock.
import { JSDOM } from 'jsdom';
import fs from 'fs';

export function load(ROOT) {
  const html = fs.readFileSync(`${ROOT}/index.html`, 'utf8')
    .replace(/<script type="module">[\s\S]*?<\/script>/, '') // mermaid CDN: not needed for logic tests
    .replace(/<script src="([\w-]+\.js)\?v=\d+"><\/script>/g, (_, f) => `<script>${fs.readFileSync(`${ROOT}/${f}`, 'utf8')}</script>`);
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/#/', pretendToBeVisual: true });
  const w = dom.window;
  w.fetch = async (u) => {
    const p = `${ROOT}/${String(u).split('?')[0]}`, ok = fs.existsSync(p);
    return { ok, status: ok ? 200 : 404, json: async () => JSON.parse(fs.readFileSync(p, 'utf8')) };
  };
  w.scrollTo = () => {}; w.Element.prototype.scrollIntoView = () => {};
  const clock = { offset: 0 }; const realNow = w.Date.now.bind(w.Date); w.Date.now = () => realNow() + clock.offset;
  const $ = (s) => w.document.querySelector(s), $$ = (s) => [...w.document.querySelectorAll(s)];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const go = async (h) => {
    w.location.hash = h; await sleep(80);
    w.dispatchEvent(new w.HashChangeEvent('hashchange')); await sleep(80);
  };
  const check = (name, cond) => { console.log((cond ? 'PASS ' : 'FAIL ') + name); if (!cond) process.exitCode = 1; };
  async function takeQuiz(s, i, nRight) {
    await go(`#/${s}/quiz/${i}`);
    const qs = JSON.parse(fs.readFileSync(`${ROOT}/mcq/${s}/${i}.json`));
    $$('#quiz .mcq').forEach((b, n) => b.querySelectorAll('.opt')[n < nRight ? qs[n].a : (qs[n].a + 1) % 4].click());
    await sleep(20);
  }
  return { w, $, $$, sleep, go, check, takeQuiz, clock, DAY: 864e5 };
}
