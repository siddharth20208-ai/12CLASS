// Pages: "Today" card (home) and My Study Plan (#/plan).
const chLabel = (c) => `${esc(subjectsOf()[c.key].name)} · Ch ${c.i + 1} ${esc(c.u.t)}`;
const task = (tag, cls, href, text) =>
  `<a class="task" href="${href}"><span class="tag ${cls}">${tag}</span><span>${text}</span></a>`;
const fmtDate = (d) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

function todayCard() {
  const subs = subjectsOf(), t = window.PLAN.today(subs, board), left = window.PLAN.daysLeft();
  const rows = [
    ...t.due.map((c) => task("Revise", "t-due", `#/${c.key}/quiz/${c.i}`, `Re-test: ${chLabel(c)}`)),
    ...t.weak.map((c) => task("Weak", "t-weak", `#/${c.key}/practice/${c.i}`, `Revise, then retake test: ${chLabel(c)}`)),
    ...t.learn.map((c) => task("Learn", "t-learn", `#/${c.key}/practice/${c.i}`, chLabel(c))),
    ...(t.paper ? [task("Paper", "t-paper", `#/${t.paper}/pyq`, `Solve a ${esc(subs[t.paper].name)} past paper under exam timing (3 hours)`)] : []),
  ];
  return `<div class="unit today">
    <div class="todayhead"><h2>📅 Today's plan</h2>
      ${left !== null && left > 0 ? `<span class="pill-big">${left} days to exam</span>` : `<a class="xlink" href="#/plan">Set your exam date →</a>`}</div>
    ${rows.length ? rows.join("") : `<p class="explain">🎉 Everything is done. Keep solving past papers!</p>`}
    <p class="more"><a href="#/plan">See full study plan →</a></p>
  </div>`;
}

function patternPage(key) {
  const s = subjectsOf()[key], P = window.PATTERN, p = P[key];
  const rows = p.sections.map((x) => `<tr><td><b>${x.s}</b></td><td>${x.what}</td><td>${x.attempt}</td><td><b>${x.marks}</b></td><td>${x.min} min</td></tr>`).join("");
  const steps = [`Read the whole paper, tick the questions you know best — ${P.readMin} min`,
    ...p.sections.map((x) => `Section ${x.s} (${x.marks} marks) — ${x.min} min`), `Re-check answers, units and MCQ letters — ${P.reviseMin} min`];
  return `${head(key, `${esc(s.name)} · Exam Pattern`, `#/${key}/pyq`, "Exam Prep")}
    <p class="lead">Maharashtra HSC theory paper: <b>${p.total} marks · 3 hours</b> · you attempt ${p.attempt}. Taken from the official 2024 board paper instructions.</p>
    <div class="unit"><table class="ptable"><thead><tr><th>Section</th><th>Questions</th><th>Attempt</th><th>Marks</th><th>Suggested time</th></tr></thead>
      <tbody>${rows}</tbody><tfoot><tr><td></td><td>Total</td><td></td><td><b>${p.total}</b></td><td>180 min</td></tr></tfoot></table></div>
    <div class="unit"><h3 class="sechead">⏱ How to use your 3 hours</h3><ol class="tplan">${steps.map((t) => `<li>${t}</li>`).join("")}</ol>
      <p class="pnote">Suggested split — adjust to your speed. In "attempt any 8", answer the ones you are surest of first.</p></div>
    <div class="unit"><h3 class="sechead">📌 Rules from the paper</h3><ul class="rules">${[...P.rules, ...p.extra].map((r) => `<li>${esc(r)}</li>`).join("")}</ul></div>`;
}

function planPage() {
  const subs = subjectsOf(), sch = window.PLAN.schedule(subs, board), left = window.PLAN.daysLeft();
  const form = `<div class="unit">
    <h3 class="sechead">When is your first board exam?</h3>
    <div class="actions"><input type="date" id="examdate" value="${window.PLAN.examDate()}" class="dateinp">
      <button class="navbtn on" data-action="save-exam">Make my plan</button></div>
    <p class="pnote">Check the official date on your hall ticket or the board timetable.</p>
  </div>`;
  if (!sch) return `${head("physics", "My Study Plan", "#/", "Home")}${form}
    ${left !== null && left < 1 ? `<p class="lead">That date has passed — pick your upcoming exam date.</p>` : ""}`;
  const rules = `<div class="prep freq"><b>How this plan works:</b> ${sch.total} chapters left → about ${sch.perDay} per day for
    ${sch.learnDays} days, highest-mark chapters first, subjects mixed. The last ${sch.revDays} days are only for past papers
    and revision. ${isHsc() ? `A chapter counts as done only when you score ${window.PROGRESS.PASS}/10 in its test; done chapters come back for quick re-tests after 3, 7 and 21 days.` : ""}</div>`;
  const days = sch.days.map((d, n) => `<div class="dayrow${n === 0 ? " now" : ""}">
    <div class="daydate">${n === 0 ? "Today" : fmtDate(d.date)}</div>
    <div class="daytasks">${d.learn.map((c) => task(window.PLAN.priority(c.s, c.u), "t-learn", `#/${c.key}/practice/${c.i}`, chLabel(c))).join("")}
      ${d.paper ? task("Paper", "t-paper", `#/${d.paper}/pyq`, `${esc(subs[d.paper].name)} past paper + formula sheet revision`) : ""}
      ${!d.learn.length && !d.paper ? `<span class="pnote">Buffer day — catch up or revise weak chapters</span>` : ""}</div>
  </div>`).join("");
  return `${head("physics", "My Study Plan", "#/", "Home")}${form}${rules}<div class="unit">${days}</div>`;
}
