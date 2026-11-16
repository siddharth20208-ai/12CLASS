// Loads per-chapter topic notes from notes/<subject>/<idx>.json (HSC board) and renders them.
// Note shape: { t, def, points[], formula?, diagram?: {mermaid?|draw?}, example?, tip? }
const rawEsc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
// Escape, then render math shorthand: r^2 -> r², e^(-kt) -> superscript, sqrt( -> √(
window.fmt = (s) => rawEsc(s)
  .replace(/\^\(([^)]+)\)/g, "<sup>$1</sup>")
  .replace(/\^(-?\w+(?:\.\d+)?)/g, "<sup>$1</sup>")
  .replace(/\bsqrt\(/g, "√(");
const nEsc = window.fmt;

function noteHtml(n, i, subject) {
  const sec = (label, body) => body ? `<div class="nsec"><h5>${label}</h5>${body}</div>` : "";
  const d = n.diagram || {};
  const diagram = d.mermaid
    ? `<pre class="mermaid">${rawEsc(d.mermaid)}</pre>`
    : d.draw ? `<div class="draw">How to draw: ${nEsc(d.draw)}</div>` : "";
  return `
    <details class="q note">
      <summary><span class="qn">${i + 1}</span> ${nEsc(n.t)}</summary>
      <div class="ans">
        ${sec("Definition", n.def && `<p>${nEsc(n.def)}</p>`)}
        ${sec("Easy explanation", n.points && `<ol>${n.points.map((p) => `<li>${nEsc(p)}</li>`).join("")}</ol>`)}
        ${sec("Formula / Key fact", n.formula && `<div class="formula">${nEsc(n.formula)}</div>`)}
        ${sec("Diagram", diagram)}
        ${sec("Example", n.example && `<p>${nEsc(n.example)}</p>`)}
        ${n.tip ? `<div class="prep freq"><b>Board exam tip:</b> ${nEsc(n.tip)}</div>` : ""}
        ${window.linkRow([["Watch video lecture", window.LINKS.video(n.t, subject)], ["Solved questions on Shaalaa", window.LINKS.shaalaaSearch(n.t)]])}
      </div>
    </details>`;
}

window.loadNotes = async function (el, subject, idx) {
  try {
    const res = await fetch(`notes/${subject}/${idx}.json`, { cache: "no-cache" });
    if (!res.ok) return; // keep fallback topic list already rendered
    const notes = await res.json();
    el.innerHTML = `<div class="qa">${notes.map((n, i) => noteHtml(n, i, subject)).join("")}</div>`;
    el.querySelectorAll("details.note").forEach((det) =>
      det.addEventListener("toggle", () => {
        if (det.open && window.mermaid) window.mermaid.run({ nodes: det.querySelectorAll("pre.mermaid:not([data-processed])") });
      }));
  } catch (e) { /* offline or bad JSON: fallback stays */ }
};
