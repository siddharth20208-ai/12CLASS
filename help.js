// Beginner help: subject icons, first-visit welcome card, and the Help page (#/help).
window.ICONS = { physics: "⚛️", chemistry: "🧪", biology: "🧬", math: "➗" };
const SEEN_KEY = "iq_seen_welcome";

const howSteps = () => [
  ["1", "📚", "Pick a subject", "Tap Physics, Chemistry, Biology or Maths."],
  ["2", "📖", "Learn a chapter", "Read from top to bottom. Tap any topic or question to open it."],
  ["3", "✍️", "Take the 10-question test", isHsc() ? "Get 7 or more right and the chapter is done ✓" : "Check yourself, then tap “Mark chapter as done”."],
  ["4", "📅", "Follow Today's plan", "The home page tells you what to study each day."],
].map(([n, icon, title, text]) => `<div class="how"><span class="hownum">${n}</span><span class="howicon">${icon}</span>
  <div><b>${title}</b><p>${text}</p></div></div>`).join("");

function welcomeCard() {
  if (localStorage.getItem(SEEN_KEY)) return "";
  return `<div class="unit welcome">
    <h2>👋 Welcome! Let's start.</h2>
    <p class="big">First, which board is your exam?</p>
    <div class="boardpick">
      <button class="pickbtn${board === "hsc" ? " on" : ""}" data-action="pick-board" data-board="hsc">🟠 Maharashtra HSC</button>
      <button class="pickbtn${board === "cbse" ? " on" : ""}" data-action="pick-board" data-board="cbse">🔵 CBSE</button>
    </div>
    <p class="big">Then it's just 4 easy steps:</p>
    ${howSteps()}
    <button class="bigbtn b-biology" data-action="dismiss-welcome">👍 Got it — let's study!</button>
  </div>`;
}

function helpPage() {
  const q = (title, body) => `<details class="q"><summary><span class="qn">?</span> ${title}</summary><div class="ans big">${body}</div></details>`;
  return `${head("biology", "❓ How to use this site", "#/", "Home")}
    <div class="unit">${howSteps()}</div>
    <div class="unit"><h3 class="sechead">What do the colours and words mean?</h3>
      <p class="big"><span class="tag t-learn">Learn</span> a new chapter to study today</p>
      <p class="big"><span class="tag t-due">Revise</span> an old chapter — take its test again so you don't forget</p>
      <p class="big"><span class="tag t-weak">Weak</span> you scored less than 7 — read it again, then retry the test</p>
      <p class="big"><span class="tag t-paper">Paper</span> solve a full exam paper in 3 hours</p>
      <p class="big"><span class="prio p-High">High marks</span> chapters that give the most marks — study these first</p></div>
    <div class="unit"><h3 class="sechead">Common questions</h3>
      ${q("Where are my answers saved?", "On this phone or computer only. If you change your phone, your progress starts again.")}
      ${q("Why is my chapter not ticked ✓?", isHsc() ? "A chapter is done only when you score 7 or more out of 10 in its test. Retry the test — you can try many times." : "Tap “Mark chapter as done” at the bottom of the chapter.")}
      ${q("Why does a chapter come back again?", "Your brain forgets after a few days. So a done chapter comes back for a quick test after 3, 7 and 21 days. This helps you remember it for the exam.")}
      ${q("How do I make a study timetable?", `Tap <a href="#/plan">📅 My Plan</a>, choose your exam date, and tap “Make my plan”.`)}
      ${q("How do mock tests work?", "Open a subject → Exam Prep → Full mock test. Start the 3-hour timer and write answers on paper. Then open each model answer and tick the points you wrote. The site adds up your marks.")}
      ${q("Can I change the board later?", "Yes. Use the CBSE / Maharashtra HSC switch at the top of the page.")}
    </div>`;
}

window.dismissWelcome = () => localStorage.setItem(SEEN_KEY, "1");
