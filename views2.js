// Pages: preparation, past papers, MCQ tests, formula sheet.
function prep(key) {
  const s = subjectsOf()[key];
  const units = s.units.map((u, i) => `
    <div class="unit">
      <span class="wt">${esc(u.wt)}</span>
      <h2><span class="chno c-${key}">Ch ${i + 1}</span> ${esc(u.t)}</h2>
      ${u.explain ? `<p class="explain">${esc(u.explain)}</p>` : ""}
      <div class="prep freq"><b>⭐ Frequently asked:</b> ${esc(u.core)}</div>
      <div class="prep"><b>How to prepare:</b> ${esc(u.prep)}</div>
      ${u.questions ? `<h4>Most important questions</h4>${qaBlock(u.questions)}` : ""}
      <p class="more"><a href="#/${key}/practice/${i}">Open full chapter notes with diagrams →</a></p>
    </div>`).join("");
  return `${head(key, `${esc(s.name)} · Most Important Questions`, `#/${key}/pyq`, esc(s.name))}
    <p class="lead">Every chapter's high-yield topics, the most important questions with solutions, and how to prepare each.</p>
    ${units}`;
}

function pyq(key) {
  const s = subjectsOf()[key];
  const official = isHsc() ? `
    <div class="unit official">
      <h2>Official HSC board papers with solutions</h2>
      <p class="explain">Real Maharashtra Board question papers (including 2024–25 official and recent model sets) with step-by-step solutions, hosted on Shaalaa.</p>
      ${window.linkRow([["Open official past papers", window.LINKS.papers(key)], ["Important questions", window.LINKS.important(key)], ["Question bank", window.LINKS.bank(key)]])}
    </div>` : "";
  const papers = window.buildPapers(s).map((p, n) => `
    <div class="unit">
      <h2>Practice paper ${n + 1} <span class="wt">${p.questions.length} Q · board pattern</span></h2>
      ${qaBlock(p.questions)}
    </div>`).join("");
  const tools = `<div class="grid">
      ${isHsc() ? `<a class="card" href="#/${key}/pattern"><h3>🧭 Exam pattern & time plan</h3><p>Sections, marks, how many to attempt, and how to split 3 hours.</p></a>` : ""}
      ${isHsc() ? `<a class="card" href="#/${key}/formulas"><h3>🧮 Formula sheet</h3><p>Every formula of the subject on one page.</p></a>` : ""}
      <a class="card" href="#/${key}/prep"><h3>⭐ Most important questions</h3><p>Top questions of every chapter with answers — revise in one go.</p></a>
    </div>`;
  return `${head(key, `${esc(s.name)} · Step 3: Exam Prep`, `#/${key}`, esc(s.name))}
    <p class="lead">Revise with the formula sheet and important questions, then solve real past papers under exam timing.</p>
    ${tools}
    ${official}
    <h4 class="sect">Our board-pattern practice papers (written for this site, not official papers)</h4>
    ${papers}`;
}

function quizList(key) {
  const s = subjectsOf()[key];
  const items = s.units.map((u, i) => {
    const b = window.PROGRESS.best(key, i);
    return `<a class="card chcard" href="#/${key}/quiz/${i}">
      <span class="chno c-${key}">Ch ${i + 1}</span>
      <h3>${esc(u.t)}</h3>
      <div class="meta"><span>10 MCQs</span><span>${b ? `Best: ${b.right}/${b.total}` : "Not attempted"}</span></div>
    </a>`;
  }).join("");
  return `${head(key, `${esc(s.name)} · Step 2: Practice`, `#/${key}`, esc(s.name))}
    <p class="lead">Board-pattern MCQs (like Section A of the HSC paper). Pick an answer to see if it's right and why.</p>
    <div class="grid">${items}</div>`;
}

function quizPage(key, idx) {
  const u = subjectsOf()[key].units[idx];
  if (!u) return quizList(key);
  return `${head(key, `Ch ${idx + 1} · ${esc(u.t)} — MCQ Test`, `#/${key}/quiz`, "All tests")}
    <p class="lead">10 questions. Click an option — the answer and reason appear instantly. Your best score is saved.</p>
    <div id="quiz" data-subject="${key}" data-idx="${idx}"><p class="lead">Loading questions…</p></div>
    <p class="more"><a href="#/${key}/practice/${idx}">← Revise this chapter's notes</a></p>`;
}

function formulasPage(key) {
  const s = subjectsOf()[key];
  return `${head(key, `${esc(s.name)} · Formula Sheet`, `#/${key}/pyq`, esc(s.name))}
    <p class="lead">All key formulas, laws and reactions, chapter by chapter. Revise this the night before the exam.</p>
    <div id="formulas" data-subject="${key}"><p class="lead">Loading formulas…</p></div>`;
}
