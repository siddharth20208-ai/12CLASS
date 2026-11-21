// Full mock paper: mock/<subject>/<n>.json = { sections: [{ s, attempt?, items: [...] }] }
// Section A: mcq (auto-marked) + vsa (self-marked). B/C/D: written, self-marked by ticking marking points;
// only the best `attempt` items of a section count, like the real "attempt any N".
// ponytail: written answers are self-marked by the student (honest system); upgrade = teacher marking.
const MOCK_SECS = 3 * 3600;
const mockKey = (s, n) => `iq_mock_${s}_${n}`;

window.loadMock = async function (el, s, n) {
  let p;
  try { const r = await fetch(`mock/${s}/${n}.json`, { cache: "no-cache" }); if (!r.ok) throw 0; p = await r.json(); }
  catch (e) { el.innerHTML = `<p class="lead">This mock paper is being prepared. Check back soon.</p>`; return; }
  const item = (x, si, ii) => {
    const id = `${si}-${ii}`, head = `<p class="mq"><b>Q${ii + 1}.</b> ${fmt(x.q)} <span class="src">${x.marks} mark${x.marks > 1 ? "s" : ""}</span></p>`;
    if (x.type === "mcq") return `<div class="mitem" data-id="${id}">${head}${x.o.map((o, k) =>
      `<label class="mopt"><input type="radio" name="m${id}" value="${k}"> ${"ABCD"[k]}. ${fmt(o)}</label>`).join("")}<div class="why" hidden>${fmt(x.why || "")}</div></div>`;
    const pts = x.points || [{ p: "Answer matches the model answer", m: x.marks }];
    return `<div class="mitem" data-id="${id}">${head}<details class="steps"><summary>Show model answer (after writing yours)</summary>
      <p>${fmt(x.answer)}</p><p class="pnote">Tick each point your answer has:</p>
      ${pts.map((q, k) => `<label class="mpt"><input type="checkbox" data-m="${q.m}" data-k="${k}"> ${fmt(q.p)} <b>(${q.m})</b></label>`).join("")}</details></div>`;
  };
  el.innerHTML = `<div class="timerbar"><span id="mtimer">3:00:00</span><button class="navbtn" data-act="start">▶ Start 3-hour timer</button></div>
    ${p.sections.map((sec, si) => `<div class="unit"><h2>Section ${sec.s} ${sec.attempt ? `<span class="wt">Attempt any ${sec.attempt}</span>` : ""}</h2>
      ${sec.items.map((x, ii) => item(x, si, ii)).join("")}</div>`).join("")}
    <button class="bigbtn b-${s}" data-act="submit">Submit paper & see my score</button><div id="mresult"></div>`;
  el.onclick = (e) => {
    const a = e.target.closest("[data-act]")?.dataset.act;
    if (a === "start") startTimer(s, n);
    if (a === "submit") showMockResult(el, p, s, n);
  };
  tickTimer(s, n);
};

function startTimer(s, n) {
  const k = mockKey(s, n), st = JSON.parse(localStorage.getItem(k) || "{}");
  if (!st.start) { st.start = Date.now(); localStorage.setItem(k, JSON.stringify(st)); }
  tickTimer(s, n);
}

function tickTimer(s, n) {
  clearInterval(window._mockTick);
  const st = JSON.parse(localStorage.getItem(mockKey(s, n)) || "{}");
  if (!st.start) return;
  const draw = () => {
    const el = document.getElementById("mtimer");
    if (!el) return clearInterval(window._mockTick);
    const left = Math.max(0, MOCK_SECS - Math.floor((Date.now() - st.start) / 1000));
    el.textContent = left ? `${Math.floor(left / 3600)}:${String(Math.floor(left / 60) % 60).padStart(2, "0")}:${String(left % 60).padStart(2, "0")} left` : "⏰ Time over — submit now";
  };
  draw(); window._mockTick = setInterval(draw, 1000);
}

// Score per item, then per section keep only the best `attempt` items.
function showMockResult(el, p, s, n) {
  const units = subjectsOf()[s].units, weak = new Set();
  let total = 0, max = 0;
  const rows = p.sections.map((sec, si) => {
    const scores = sec.items.map((x, ii) => {
      const box = el.querySelector(`[data-id="${si}-${ii}"]`);
      let got = 0;
      if (x.type === "mcq") {
        const pick = box.querySelector("input:checked");
        got = pick && +pick.value === x.a ? x.marks : 0;
        box.querySelectorAll(".mopt")[x.a].classList.add("ok");
        if (pick && +pick.value !== x.a) pick.parentElement.classList.add("bad");
        box.querySelector(".why").hidden = false;
      } else got = [...box.querySelectorAll(".mpt input:checked")].reduce((t, c) => t + +c.dataset.m, 0);
      if (got < x.marks && x.ch !== undefined && units[x.ch]) weak.add(x.ch);
      return { got, marks: x.marks };
    });
    const take = sec.attempt || scores.length;
    const best = [...scores].sort((a, b) => b.got - a.got).slice(0, take).reduce((t, x) => t + x.got, 0);
    const secMax = [...scores].sort((a, b) => b.marks - a.marks).slice(0, take).reduce((t, x) => t + x.marks, 0);
    total += best; max += secMax;
    return `<tr><td>Section ${sec.s}</td><td><b>${best}</b> / ${secMax}</td></tr>`;
  }).join("");
  const pct = Math.round((total / max) * 100);
  const prev = JSON.parse(localStorage.getItem(mockKey(s, n)) || "{}");
  localStorage.setItem(mockKey(s, n), JSON.stringify({ ...prev, best: Math.max(prev.best || 0, total), max, start: undefined }));
  clearInterval(window._mockTick);
  el.querySelector("#mresult").innerHTML = `<div class="unit today"><h2>Your score: ${total} / ${max} (${pct}%)</h2>
    <table class="ptable">${rows}</table>
    ${weak.size ? `<h4>Revise these chapters</h4>${[...weak].sort((a, b) => a - b).map((i) =>
      `<a class="task" href="#/${s}/practice/${i}"><span class="tag t-weak">Revise</span><span>Ch ${i + 1} · ${esc(units[i].t)}</span></a>`).join("")}` : "<p>Full marks in every question you attempted. Excellent!</p>"}</div>`;
  el.querySelector("#mresult").scrollIntoView({ behavior: "smooth" });
}

window.mockBest = (s, n) => JSON.parse(localStorage.getItem(mockKey(s, n)) || "{}");
