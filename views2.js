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
      ${isHsc() ? `<a class="card" href="#/${key}/mock"><h3>⏱ Full mock test</h3><p>A complete 3-hour paper in the real board pattern. Get your score out of ${window.PATTERN[key].total} and your weak chapters.</p></a>` : ""}
      ${isHsc() ? `<a class="card" href="#/${key}/revise"><h3>⚡ Last-day revision</h3><p>One short page per chapter: key points, formulas, diagrams and top questions.</p></a>` : ""}
      ${isHsc() ? `<a class="card" href="${window.LINKS.textbook(key)}" target="_blank" rel="noopener"><h3>📘 Textbook solutions ↗</h3><p>Every Balbharati textbook exercise solved (free, on Shaalaa).</p></a>` : ""}
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
  const mixed = window.MIXED.blocks(s.units.length).map(([a, b], k) => {
    const r = window.MIXED.best(key, k);
    return `<a class="card chcard mixcard" href="#/${key}/mixed/${k}"><span class="chno c-${key}">Mixed test ${k + 1}</span>
      <h3>Chapters ${a + 1}–${b + 1}</h3><div class="meta"><span>${(b - a + 1) * 5} MCQs</span><span>${r.best !== undefined ? `Best: ${r.best}/${r.total}` : "Not attempted"}</span></div></a>`;
  }).join("");
  return `${head(key, `${esc(s.name)} · Step 2: Practice`, `#/${key}`, esc(s.name))}
    <p class="lead">Board-pattern MCQs (like Section A of the HSC paper). Pick an answer to see if it's right and why.</p>
    <h3 class="pickhead">📝 Chapter tests</h3>
    <div class="grid">${items}</div>
    <h3 class="pickhead">🔀 Mixed tests — every 4 chapters</h3>
    <p class="big">Questions from 4 chapters together, so you don't forget old chapters.</p>
    <div class="grid">${mixed}</div>`;
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

function mockList(key) {
  const s = subjectsOf()[key];
  const cards = [0, 1].map((n) => {
    const b = window.mockBest(key, n);
    return `<a class="card chcard" href="#/${key}/mock/${n}"><span class="chno c-${key}">Paper ${n + 1}</span>
      <h3>Mock test ${n + 1}</h3><div class="meta"><span>3 hours · ${window.PATTERN[key].total} marks</span><span>${b.best !== undefined ? `Best: ${b.best}/${b.max}` : "Not attempted"}</span></div></a>`;
  }).join("");
  return `${head(key, `${esc(s.name)} · Mock Tests`, `#/${key}/pyq`, "Exam Prep")}
    <p class="lead">Sit like the real exam: start the timer, write answers on paper, then tick the marking points. Only the best questions you're allowed to attempt are counted.</p>
    <div class="grid">${cards}</div>`;
}

function mockPage(key, n) {
  return `${head(key, `${esc(subjectsOf()[key].name)} · Mock Test ${n + 1}`, `#/${key}/mock`, "All mock tests")}
    <div id="mock" data-subject="${key}" data-n="${n}"><p class="lead">Loading paper…</p></div>`;
}

function reviseList(key) {
  const s = subjectsOf()[key];
  const items = s.units.map((u, i) => `<a class="card chcard" href="#/${key}/revise/${i}"><span class="chno c-${key}">Ch ${i + 1}</span><h3>${esc(u.t)}</h3></a>`).join("");
  return `${head(key, `${esc(s.name)} · ⚡ Last-day revision`, `#/${key}/pyq`, "Exam Prep")}
    <p class="big">One short page per chapter. Read it the night before your exam.</p><div class="grid">${items}</div>`;
}

function revisePage(key, i) {
  const u = subjectsOf()[key].units[i];
  if (!u) return reviseList(key);
  return `${head(key, `⚡ Ch ${i + 1} · ${esc(u.t)}`, `#/${key}/revise`, "All chapters")}
    <div id="revise" data-subject="${key}" data-idx="${i}"><p class="lead">Loading…</p></div>`;
}

function mixedPage(key, k) {
  const [a, b] = window.MIXED.blocks(subjectsOf()[key].units.length)[k] || [];
  if (a === undefined) return quizList(key);
  return `${head(key, `🔀 Mixed test ${k + 1} · Chapters ${a + 1}–${b + 1}`, `#/${key}/quiz`, "All tests")}
    <p class="big">Tap an answer. You'll see right or wrong straight away. At the end you'll see which chapters to revise.</p>
    <div id="mixed" data-subject="${key}" data-k="${k}"><p class="lead">Loading questions…</p></div>`;
}
