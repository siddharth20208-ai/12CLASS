// Shared state and render helpers used by views.js / views2.js / app.js.
const app = document.getElementById("app");
const esc = window.fmt; // escape + render r^2 as superscript (defined in notes.js)
let board = localStorage.getItem("iq_board") || "cbse";
const subjectsOf = () => (window.BOARDS[board] || {}).subjects || {};
const isHsc = () => board === "hsc";

function head(key, title, backHref, backLabel) {
  return `<a class="back" href="${backHref}">← ${backLabel}</a>
    <div class="subhead"><h1 class="c-${key}">${title}</h1></div>`;
}

function progressBar(key, s) {
  const done = window.PROGRESS.doneCount(board, key, s.units.length), total = s.units.length;
  const pct = Math.round((done / total) * 100);
  return `<div class="pbar"><div class="pfill b-${key}" style="width:${pct}%"></div></div>
    <p class="pnote">${done} of ${total} chapters done (${pct}%)</p>`;
}

function topicList(topics) {
  if (!topics || !topics.length) return "";
  return `<div class="qa">${topics.map((t) => {
    const name = typeof t === "string" ? t : t.t;
    const body = typeof t === "string" ? "Detailed explanation coming soon." : esc(t.e);
    return `<details class="q"><summary><span class="qn">▸</span> ${esc(name)}</summary><div class="ans">${body}</div></details>`;
  }).join("")}</div>`;
}

function qaBlock(list) {
  if (!list || !list.length) return "";
  return `<div class="qa">${list.map((q, i) => `
    <details class="q">
      <summary><span class="qn">Q${i + 1}</span> ${esc(q.q)}${q.from ? `<em class="src">${esc(q.from)}</em>` : ""}</summary>
      <div class="ans"><b>Solution.</b> ${esc(q.a)}
        ${window.linkRow([["Find similar solved questions on Shaalaa", window.LINKS.shaalaaSearch(q.q)]])}
      </div>
    </details>`).join("")}</div>`;
}
