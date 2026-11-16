// Per-device study progress in localStorage.
// HSC: a chapter is "done" (mastered) only after scoring >= PASS on its test; it then comes back
// for re-tests after GAPS days (spaced revision). CBSE has no tests, so it uses a manual done tick.
// ponytail: localStorage only — no sync across devices. Add accounts + a DB to sync.
const PKEY = "iq_progress", PASS = 7, GAPS = [3, 7, 21], DAY = 864e5;
const pLoad = () => { try { return JSON.parse(localStorage.getItem(PKEY)) || {}; } catch { return {}; } };
const pSave = (d) => localStorage.setItem(PKEY, JSON.stringify(d));
const rec = (s, i) => {
  const r = (pLoad().quiz || {})[`${s}/${i}`];
  return r && r.best === undefined ? { best: r.right, last: r.right, total: r.total } : r; // old format
};
const dueAt = (r) => (r.stage >= GAPS.length ? Infinity : r.passAt + GAPS[r.stage] * DAY);

window.PROGRESS = {
  PASS,
  isDone(b, s, i) {
    if (b === "hsc") return !!(rec(s, i) || {}).passAt;
    return !!(pLoad().done || {})[`${b}/${s}/${i}`];
  },
  toggle(b, s, i) {
    const d = pLoad(); d.done = d.done || {};
    const k = `${b}/${s}/${i}`;
    if (d.done[k]) delete d.done[k]; else d.done[k] = 1;
    pSave(d);
  },
  doneCount(b, s, n) { let c = 0; for (let i = 0; i < n; i++) if (this.isDone(b, s, i)) c++; return c; },
  best: (s, i) => { const r = rec(s, i); return r && { right: r.best, total: r.total }; },
  // weak = last attempt below pass mark
  isWeak: (s, i) => { const r = rec(s, i); return !!r && r.last < PASS; },
  // due for revision re-test: mastered and its next gap has passed
  isDue: (s, i, now = Date.now()) => { const r = rec(s, i); return !!(r && r.passAt) && dueAt(r) <= now; },
  stage: (s, i) => (rec(s, i) || {}).stage,
  saveScore(s, i, right, total, now = Date.now()) {
    const d = pLoad(); d.quiz = d.quiz || {};
    const r = rec(s, i) || {};
    r.total = total; r.last = right; r.best = Math.max(r.best || 0, right);
    if (right >= PASS) {
      if (!r.passAt) { r.passAt = now; r.stage = 0; }
      else if (dueAt(r) <= now) { r.passAt = now; r.stage = Math.min(r.stage + 1, GAPS.length); }
    }
    d.quiz[`${s}/${i}`] = r;
    pSave(d);
  },
};
