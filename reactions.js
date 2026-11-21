// Organic chemistry: reactions/chemistry/<idx>.json = { named: [{ name, eq, cond, tip }], conversions: [{ q, steps[], ans }] }
window.hasReactions = (s, i) => s === "chemistry" && i >= 9 && i <= 12;

window.loadReactions = async function (el, s, i) {
  let d;
  try { const r = await fetch(`reactions/${s}/${i}.json`, { cache: "no-cache" }); if (!r.ok) throw 0; d = await r.json(); }
  catch (e) { el.innerHTML = `<p class="lead">Named reactions for this chapter are being prepared.</p>`; return; }
  const named = d.named.map((x) => `
    <div class="sum"><div class="sumhead"><span class="qn">${fmt(x.name)}</span></div>
      <div class="formula rx">${fmt(x.eq)}</div>
      <p class="pnote"><b>Conditions:</b> ${fmt(x.cond)}</p>
      ${x.tip ? `<p class="pnote">🎯 ${fmt(x.tip)}</p>` : ""}</div>`).join("");
  const conv = d.conversions.map((x, n) => `
    <div class="sum"><div class="sumhead"><span class="qn">Convert ${n + 1}</span></div>
      <p class="sumq">${fmt(x.q)}</p>
      <details class="steps"><summary>Show the route</summary>
        <ol>${x.steps.map((st) => `<li>${fmt(st)}</li>`).join("")}</ol><div class="sumans">${fmt(x.ans)}</div></details></div>`).join("");
  el.innerHTML = `<p class="lead">Learn each reaction with its conditions — examiners give marks for the reagent and condition, not just the product.</p>
    ${named}<h4 class="sect">Conversions — try on paper first, then open the route</h4>${conv}`;
};
