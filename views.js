// Pages: home, subject hub, chapter list, chapter detail.
function home() {
  const subs = subjectsOf();
  const cards = Object.entries(subs).filter(([, s]) => s).map(([key, s]) => {
    const done = window.PROGRESS.doneCount(board, key, s.units.length);
    return `<a class="card" href="#/${key}">
      <span class="pill c-${key}"><span class="dot b-${key}"></span>${s.marks} marks</span>
      <h3>${esc(s.name)}</h3>
      <p>${esc(s.blurb)}</p>
      <div class="meta"><span>${s.units.length} chapters</span><span>${done} done</span></div>
    </a>`;
  }).join("");
  const total = Object.values(subs).filter(Boolean).reduce((n, s) => n + s.units.length, 0);
  return `
    <section class="hero">
      <h1>Master <em>Class 12</em> — one step a day.</h1>
      <p>Follow today's plan below: learn a chapter, pass its test, revise on time. ${window.BOARDS[board].label} · ${total} chapters.</p>
    </section>
    ${todayCard()}
    <div class="grid">${cards || '<p class="lead">Loading content…</p>'}</div>`;
}

function hub(key) {
  const s = subjectsOf()[key];
  const nextIdx = s.units.findIndex((u, i) => !window.PROGRESS.isDone(board, key, i));
  const step = (n, href, title, desc) =>
    `<a class="card step" href="${href}"><span class="stepno b-${key}">${n}</span><h3>${title}</h3><p>${desc}</p></a>`;
  const math = isHsc() && key === "math";
  return `${head(key, esc(s.name), "#/", "All subjects")}
    ${progressBar(key, s)}
    ${nextIdx >= 0 ? `<a class="bigbtn b-${key}" href="#/${key}/practice/${nextIdx}">▶ Continue: Ch ${nextIdx + 1} · ${esc(s.units[nextIdx].t)}</a>`
      : `<p class="lead">🎉 All chapters done! Go to Step 3 and solve the past papers.</p>`}
    <div class="grid steps3">
      ${step(1, `#/${key}/practice`, "Learn", math ? "Solved sums step by step, then easy notes for each chapter."
        : isHsc() && key !== "biology" ? "Easy notes with diagrams, solved numericals and important questions, chapter by chapter."
        : "Easy notes with diagrams and solved important questions, chapter by chapter.")}
      ${step(2, isHsc() ? `#/${key}/quiz` : `#/${key}/prep`, "Practice", isHsc() ? "Test yourself: 10 MCQs per chapter with instant answers and score." : "Most important questions of every chapter with solutions.")}
      ${step(3, `#/${key}/pyq`, "Exam Prep", isHsc() ? "Exam pattern & time plan, formula sheet, important questions and real past papers." : "Past board papers with solutions and last-minute revision.")}
    </div>`;
}

function practiceList(key) {
  const s = subjectsOf()[key];
  const items = s.units.map((u, i) => {
    const done = window.PROGRESS.isDone(board, key, i);
    return `<a class="card chcard${done ? " done" : ""}" href="#/${key}/practice/${i}">
      <span class="chno c-${key}">Ch ${i + 1}</span>${done ? '<span class="tick">✓ Done</span>' : ""}
      <h3>${esc(u.t)}</h3>
      <div class="meta"><span class="prio p-${window.PLAN.priority(s, u)}">${window.PLAN.priority(s, u)} marks</span>${window.PROGRESS.isWeak(key, i) ? '<span class="tag t-weak">Weak</span>' : ""}</div>
    </a>`;
  }).join("");
  return `${head(key, `${esc(s.name)} · Step 1: Learn`, `#/${key}`, esc(s.name))}
    <p class="lead">Start with <b>High marks</b> chapters. ${isHsc() ? `A chapter is done when you score ${window.PROGRESS.PASS}/10 in its test.` : "Read it top to bottom, then mark it done."}</p>
    ${progressBar(key, s)}
    <div class="grid">${items}</div>`;
}

function chapter(key, idx) {
  const s = subjectsOf()[key];
  const u = s.units[idx];
  if (!u) return practiceList(key);
  const done = window.PROGRESS.isDone(board, key, idx);
  const math = isHsc() && key === "math";
  // Worked numericals exist for HSC Maths, Physics and Physical Chemistry (chemistry ch 1-6).
  const sums = isHsc() && (math || key === "physics" || (key === "chemistry" && idx <= 5));
  let n = 0;
  const sec = (title, body) => `<div class="unit"><h3 class="sechead"><span class="stepno b-${key}">${++n}</span>${title}</h3>${body}</div>`;
  const next = idx < s.units.length - 1 ? `<a class="navbtn" href="#/${key}/practice/${idx + 1}">Next chapter →</a>` : "";
  return `
    <a class="back" href="#/${key}/practice">← All chapters</a>
    <div class="subhead"><span class="chno c-${key}">Ch ${idx + 1}</span><h1 class="c-${key}">${esc(u.t)}</h1></div>
    <div class="prep freq"><b>⭐ Exam focus:</b> ${esc(u.core)}<br><b>How to study it:</b> ${esc(u.prep)}</div>
    ${u.explain ? sec("What this chapter is about", `<p class="explain">${esc(u.explain)}</p>`) : ""}
    ${sums ? sec(math ? "Solved sums — try first, then open the solution" : "Solved numericals — try first, then open the solution", `<div id="sums" data-subject="${key}" data-idx="${idx}"></div>`) : ""}
    ${sec(math ? "Theory — tap a topic to open it" : "Learn the topics — tap one to open its full explanation",
      `<div id="notes" data-subject="${key}" data-idx="${idx}">${topicList(u.topics)}</div>`)}
    ${sec("Important exam questions — tap to see the answer", qaBlock(u.questions) || "<p>No questions yet.</p>")}
    ${sec("Finished? Check yourself", `<div class="actions">
      ${isHsc() ? `<a class="navbtn" href="#/${key}/quiz/${idx}">📝 Take the 10-question test</a>` : ""}
      ${isHsc() ? `<span class="gate${done ? " on" : ""}">${done ? `✓ Chapter mastered (best ${window.PROGRESS.best(key, idx).right}/10)` : `Score ${window.PROGRESS.PASS}/10 in the test to complete this chapter`}</span>`
        : `<button class="navbtn${done ? " on" : ""}" data-action="toggle-done" data-key="${key}" data-idx="${idx}">${done ? "✓ Chapter done" : "✓ Mark chapter as done"}</button>`}
      ${next}
    </div>`)}`;
}
