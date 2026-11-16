// Worked sums for a chapter: sums/<subject>/<idx>.json =
//   { solved: [{ topic, marks, q, steps[], ans }], practice: [{ topic, q, hint, ans }] }
window.loadSums = async function (el, s, i) {
  let d;
  try {
    const res = await fetch(`sums/${s}/${i}.json`, { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);
    d = await res.json();
  } catch (e) {
    el.innerHTML = `<p class="lead">Solved sums for this chapter are being prepared. Check back soon.</p>`;
    return;
  }
  const solved = d.solved.map((x, n) => `
    <div class="sum">
      <div class="sumhead"><span class="qn">Sum ${n + 1}</span><span class="src">${fmt(x.topic)} · ${x.marks} marks</span></div>
      <p class="sumq">${fmt(x.q)}</p>
      <details class="steps"><summary>Show step-by-step solution</summary>
        <ol>${x.steps.map((st) => `<li>${fmt(st)}</li>`).join("")}</ol>
        <div class="sumans">Answer: ${fmt(x.ans)}</div>
      </details>
    </div>`).join("");
  const practice = d.practice.map((x, n) => `
    <div class="sum">
      <div class="sumhead"><span class="qn">Try ${n + 1}</span><span class="src">${fmt(x.topic)}</span></div>
      <p class="sumq">${fmt(x.q)}</p>
      <details class="steps"><summary>Stuck? Show hint</summary><p>${fmt(x.hint)}</p></details>
      <details class="steps"><summary>Check your answer</summary><div class="sumans">Answer: ${fmt(x.ans)}</div></details>
    </div>`).join("");
  el.innerHTML = `
    <p class="lead">Read the question, try it on paper first, then open the solution and compare each step.</p>
    ${solved}
    <h4 class="sect">Practice sums — solve yourself, then check the answer</h4>
    ${practice}`;
};
