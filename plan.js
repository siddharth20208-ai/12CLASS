// Study plan: chapter priority (from estimated marks), study order, today's tasks, day-by-day timetable.
// Marks: HSC uses the published table in weightage.js; CBSE falls back to each chapter's estimated `wt`.
const EXAM_KEY = "iq_exam";

window.PLAN = {
  marks: (u) => window.HSC_WEIGHT[u.t] ?? Math.max(0, ...(String(u.wt || "").match(/\d+(\.\d+)?/g) || ["0"]).map(Number)),
  // Rank chapters by marks (ties: textbook order) and split into thirds.
  priority(s, u) {
    const rank = s.units.map((x, i) => ({ x, i, m: this.marks(x) }))
      .sort((a, b) => b.m - a.m || a.i - b.i).findIndex((r) => r.x === u);
    const third = s.units.length / 3;
    return rank < third ? "High" : rank < third * 2 ? "Medium" : "Low";
  },
  // Not-done chapters of all subjects: highest marks first within a subject, subjects interleaved.
  order(subs, board) {
    const queues = Object.entries(subs).filter(([, s]) => s).map(([key, s]) =>
      s.units.map((u, i) => ({ key, i, u, s, m: this.marks(u) }))
        .filter((c) => !window.PROGRESS.isDone(board, c.key, c.i))
        .sort((a, b) => b.m - a.m));
    const out = [];
    while (queues.some((q) => q.length)) queues.forEach((q) => q.length && out.push(q.shift()));
    return out;
  },
  examDate: () => localStorage.getItem(EXAM_KEY) || "",
  setExamDate: (v) => localStorage.setItem(EXAM_KEY, v),
  daysLeft() {
    const d = this.examDate();
    if (!d) return null;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return Math.round((new Date(d + "T00:00:00") - today) / 864e5);
  },
  // Split days into: learn new chapters, then final revision (last ~20%, 3-14 days), then exam.
  schedule(subs, board) {
    const left = this.daysLeft();
    if (left === null || left < 1) return null;
    const todo = this.order(subs, board);
    const revDays = Math.min(14, Math.max(3, Math.round(left * 0.2)));
    const learnDays = Math.max(1, left - revDays);
    const perDay = Math.max(1, Math.ceil(todo.length / learnDays));
    const keys = Object.keys(subs).filter((k) => subs[k]);
    const days = [];
    for (let d = 0; d < left; d++) {
      const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() + d);
      const learn = d < learnDays ? todo.slice(d * perDay, d * perDay + perDay) : [];
      const paper = d >= learnDays ? keys[(d - learnDays) % keys.length] : null;
      days.push({ date, learn, paper });
    }
    return { days, perDay, learnDays, revDays, total: todo.length };
  },
  // Today's to-do: next chapters to learn + chapters due for revision + weak chapters.
  today(subs, board) {
    const sch = this.schedule(subs, board);
    const learn = sch ? sch.days[0].learn : this.order(subs, board).slice(0, 2);
    const due = [], weak = [];
    if (board === "hsc") Object.entries(subs).forEach(([key, s]) => s && s.units.forEach((u, i) => {
      if (window.PROGRESS.isDue(key, i)) due.push({ key, i, u });
      else if (window.PROGRESS.isWeak(key, i)) weak.push({ key, i, u });
    }));
    return { learn, due, weak, paper: sch ? sch.days[0].paper : null };
  },
};
