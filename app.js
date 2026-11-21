// Router. Routes:
//  #/  ·  #/<s>  ·  #/<s>/practice[/<i>]  ·  #/<s>/prep  ·  #/<s>/pyq  ·  #/<s>/quiz[/<i>]  ·  #/<s>/formulas
// quiz + formulas exist only for the HSC board (their content is HSC notes/MCQs).
function route(p) {
  if (p[0] === "plan") return planPage();
  if (p[0] === "help") return helpPage();
  const s = subjectsOf()[p[0]];
  if (!p[0] || !s) return home();
  const i = p[2] !== undefined ? +p[2] : undefined;
  switch (p[1]) {
    case "practice": return i !== undefined ? chapter(p[0], i) : practiceList(p[0]);
    case "prep": return prep(p[0]);
    case "pyq": return pyq(p[0]);
    case "quiz": if (isHsc()) return i !== undefined ? quizPage(p[0], i) : quizList(p[0]); break;
    case "formulas": if (isHsc()) return formulasPage(p[0]); break;
    case "pattern": if (isHsc()) return patternPage(p[0]); break;
    case "revise": if (isHsc()) return i !== undefined ? revisePage(p[0], i) : reviseList(p[0]); break;
    case "mixed": if (isHsc() && i !== undefined) return mixedPage(p[0], i); break;
    case "mock": if (isHsc()) return i !== undefined ? mockPage(p[0], i) : mockList(p[0]); break;
  }
  return hub(p[0]);
}

function render() {
  const p = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  app.innerHTML = route(p);
  const notesEl = document.getElementById("notes");
  if (notesEl && isHsc()) window.loadNotes(notesEl, notesEl.dataset.subject, notesEl.dataset.idx);
  const sumsEl = document.getElementById("sums");
  if (sumsEl) window.loadSums(sumsEl, sumsEl.dataset.subject, +sumsEl.dataset.idx);
  const rxEl = document.getElementById("reactions");
  if (rxEl) window.loadReactions(rxEl, rxEl.dataset.subject, +rxEl.dataset.idx);
  const mockEl = document.getElementById("mock");
  if (mockEl) window.loadMock(mockEl, mockEl.dataset.subject, +mockEl.dataset.n);
  const revEl = document.getElementById("revise");
  if (revEl) window.loadRevise(revEl, revEl.dataset.subject, +revEl.dataset.idx, subjectsOf()[revEl.dataset.subject].units[+revEl.dataset.idx]);
  const mixEl = document.getElementById("mixed");
  if (mixEl) window.loadMixed(mixEl, mixEl.dataset.subject, +mixEl.dataset.k, subjectsOf()[mixEl.dataset.subject].units);
  const quizEl = document.getElementById("quiz");
  if (quizEl) window.loadQuiz(quizEl, quizEl.dataset.subject, +quizEl.dataset.idx);
  const fEl = document.getElementById("formulas");
  if (fEl) window.loadFormulas(fEl, fEl.dataset.subject, subjectsOf()[fEl.dataset.subject].units);
  document.querySelectorAll(".boardsw button").forEach((b) => b.classList.toggle("on", b.dataset.board === board));
  window.scrollTo(0, 0);
}

app.addEventListener("click", (e) => {
  const pick = e.target.closest('[data-action="pick-board"]');
  if (pick) { board = pick.dataset.board; localStorage.setItem("iq_board", board); render(); return; }
  if (e.target.closest('[data-action="dismiss-welcome"]')) { window.dismissWelcome(); render(); return; }
  if (e.target.closest('[data-action="save-exam"]')) {
    const v = document.getElementById("examdate").value;
    if (v) { window.PLAN.setExamDate(v); render(); }
    return;
  }
  const btn = e.target.closest('[data-action="toggle-done"]');
  if (!btn) return;
  window.PROGRESS.toggle(board, btn.dataset.key, btn.dataset.idx);
  const y = window.scrollY;
  render();
  window.scrollTo(0, y);
});

document.querySelectorAll(".boardsw button").forEach((b) =>
  b.addEventListener("click", () => {
    board = b.dataset.board;
    localStorage.setItem("iq_board", board);
    if (!subjectsOf()[location.hash.replace(/^#\/?/, "").split("/")[0]]) location.hash = "#/";
    render();
  }));
window.addEventListener("hashchange", render);
render();
