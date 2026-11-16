// Subject formula sheet: collects every topic's `formula` from notes/<subject>/<i>.json.
window.loadFormulas = async function (el, s, units) {
  const all = await Promise.all(units.map((u, i) =>
    fetch(`notes/${s}/${i}.json`).then((r) => (r.ok ? r.json() : [])).catch(() => [])));
  const html = all.map((notes, i) => {
    const rows = notes.filter((n) => n.formula);
    if (!rows.length) return "";
    return `<div class="unit">
      <h2><span class="chno c-${s}">Ch ${i + 1}</span> ${fmt(units[i].t)}</h2>
      ${rows.map((n) => `<div class="frow"><span class="ftopic">${fmt(n.t)}</span><div class="formula">${fmt(n.formula)}</div></div>`).join("")}
    </div>`;
  }).join("");
  el.innerHTML = html || `<p class="lead">Formula sheet coming soon.</p>`;
};
