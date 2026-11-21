// Last-day revision: one short page per chapter built from existing data —
// exam focus, one-line definitions, formulas, diagrams and the top exam questions (no answers).
window.loadRevise = async function (el, s, i, u) {
  let notes = [];
  try { const r = await fetch(`notes/${s}/${i}.json`, { cache: "no-cache" }); if (r.ok) notes = await r.json(); } catch (e) { /* notes missing */ }
  const defs = notes.map((n) => `<li><b>${fmt(n.t)}:</b> ${fmt(n.def || "")}</li>`).join("");
  const formulas = notes.filter((n) => n.formula).map((n) => `<div class="formula">${fmt(n.formula)}</div>`).join("");
  const pics = notes.filter((n) => n.diagram && n.diagram.svg)
    .map((n) => `<figure class="revfig"><img class="dia" src="${n.diagram.svg}" alt="${fmt(n.t)}" loading="lazy"><figcaption>${fmt(n.t)}</figcaption></figure>`).join("");
  const qs = (u.questions || []).map((q) => `<li>${fmt(q.q)}</li>`).join("");
  el.innerHTML = `
    <div class="prep freq"><b>⭐ Most asked in exam:</b> ${fmt(u.core)}</div>
    ${defs ? `<div class="unit"><h3 class="sechead">🧠 Remember these</h3><ul class="revlist">${defs}</ul></div>` : ""}
    ${formulas ? `<div class="unit"><h3 class="sechead">🧮 Formulas</h3>${formulas}</div>` : ""}
    ${pics ? `<div class="unit"><h3 class="sechead">✏️ Diagrams to practise</h3><div class="revpics">${pics}</div></div>` : ""}
    ${qs ? `<div class="unit"><h3 class="sechead">❓ Can you answer these?</h3><ol class="revlist">${qs}</ol>
      <p class="pnote">Say the answer out loud. Not sure? Open the full chapter.</p></div>` : ""}
    <p class="more"><a href="#/${s}/practice/${i}">📖 Open full chapter →</a></p>`;
};
