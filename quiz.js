// Chapter MCQ test: loads mcq/<subject>/<idx>.json = [{ q, o:[4], a, why }], instant feedback + score.
window.loadQuiz = async function (el, s, i) {
  let qs;
  try {
    const res = await fetch(`mcq/${s}/${i}.json`, { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);
    qs = await res.json();
  } catch (e) {
    el.innerHTML = `<p class="lead">The MCQ test for this chapter is being prepared. Check back soon.</p>`;
    return;
  }
  let answered = 0, right = 0;
  el.innerHTML = qs.map((x, n) => `
    <div class="unit mcq" data-n="${n}">
      <p class="mq"><b>Q${n + 1}.</b> ${fmt(x.q)}</p>
      ${x.o.map((o, k) => `<button class="opt" data-k="${k}">${"ABCD"[k]}. ${fmt(o)}</button>`).join("")}
      <div class="why" hidden></div>
    </div>`).join("") + `<div class="unit score" hidden></div>`;

  el.querySelectorAll(".mcq").forEach((box) => box.addEventListener("click", (e) => {
    const btn = e.target.closest(".opt");
    if (!btn || box.dataset.done) return;
    box.dataset.done = "1";
    const x = qs[box.dataset.n], k = +btn.dataset.k, ok = k === x.a;
    box.querySelectorAll(".opt")[x.a].classList.add("ok");
    if (ok) right++; else btn.classList.add("bad");
    const why = box.querySelector(".why");
    why.hidden = false;
    why.innerHTML = `<b>${ok ? "Correct!" : "Wrong."}</b> ${fmt(x.why)}`;
    if (++answered === qs.length) showScore(el, s, i, right, qs.length);
  }));
};

function showScore(el, s, i, right, total) {
  window.PROGRESS.saveScore(s, i, right, total);
  const pct = Math.round((right / total) * 100);
  const msg = right >= window.PROGRESS.PASS
    ? "Passed! This chapter is now done. It will come back for a quick re-test after a few days."
    : `You need ${window.PROGRESS.PASS}/10 to complete this chapter. Revise the notes and retry.`;
  const box = el.querySelector(".score");
  box.hidden = false;
  box.innerHTML = `<h2>Your score: ${right} / ${total} (${pct}%)</h2><p>${msg}</p>
    <button class="navbtn" onclick="window.loadQuiz(this.closest('#quiz'), '${s}', ${i}); window.scrollTo(0,0)">Retry test</button>`;
  box.scrollIntoView({ behavior: "smooth" });
}
