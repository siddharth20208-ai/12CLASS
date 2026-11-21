// Mixed test after every 4 chapters: 5 MCQs from each chapter in the block (20 total).
// Each retry rotates to the other 5 questions of every chapter, so a retry is not the same paper.
const MIX_KEY = (s, k) => `iq_mixed_${s}_${k}`;
window.MIXED = {
  blocks: (n) => Array.from({ length: Math.ceil(n / 4) }, (_, k) => [k * 4, Math.min(n, k * 4 + 4) - 1]),
  best: (s, k) => JSON.parse(localStorage.getItem(MIX_KEY(s, k)) || "{}"),
};

window.loadMixed = async function (el, s, k, units) {
  const [from, to] = window.MIXED.blocks(units.length)[k] || [];
  if (from === undefined) { el.innerHTML = `<p class="lead">No such test.</p>`; return; }
  const rec = window.MIXED.best(s, k), half = (rec.tries || 0) % 2; // alternate question halves
  const qs = [];
  for (let i = from; i <= to; i++) {
    try {
      const all = await (await fetch(`mcq/${s}/${i}.json`, { cache: "no-cache" })).json();
      all.slice(half * 5, half * 5 + 5).forEach((x) => qs.push({ ...x, ch: i, from: `Ch ${i + 1}` }));
    } catch (e) { /* chapter MCQs missing: skip it */ }
  }
  if (!qs.length) { el.innerHTML = `<p class="lead">This mixed test is being prepared.</p>`; return; }
  window.renderMcqs(el, qs, (right, okList) => {
    const wrongCh = [...new Set(qs.filter((x, n) => !okList[n]).map((x) => x.ch))];
    const r = window.MIXED.best(s, k);
    localStorage.setItem(MIX_KEY(s, k), JSON.stringify({ best: Math.max(r.best || 0, right), total: qs.length, tries: (r.tries || 0) + 1 }));
    const box = el.querySelector(".score");
    box.hidden = false;
    box.innerHTML = `<h2>Your score: ${right} / ${qs.length}</h2>
      ${wrongCh.length ? `<h4>Revise these chapters</h4>${wrongCh.map((i) =>
        `<a class="task" href="#/${s}/practice/${i}"><span class="tag t-weak">Revise</span><span>Ch ${i + 1} · ${fmt(units[i].t)}</span></a>`).join("")}`
        : "<p>🎉 All correct! You remember these chapters well.</p>"}
      <button class="navbtn" onclick="window.loadMixed(this.closest('#mixed'), '${s}', ${k}, subjectsOf()['${s}'].units); window.scrollTo(0,0)">Retry with new questions</button>`;
    box.scrollIntoView({ behavior: "smooth" });
  });
};
