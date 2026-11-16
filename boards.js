// Assemble both boards. HSC data files set window.HSC_* (may be missing while loading).
window.BOARDS = {
  cbse: { label: "CBSE", subjects: window.SUBJECTS },
  hsc: {
    label: "Maharashtra HSC",
    subjects: {
      physics: window.HSC_PHYSICS,
      chemistry: window.HSC_CHEMISTRY,
      biology: window.HSC_BIOLOGY,
      math: window.HSC_MATH
    }
  }
};

// Build "last 5 years" HSC-pattern practice papers by pooling chapter questions.
// Honest framing: these are HSC-FORMAT practice sets with solutions, not verbatim official papers.
window.buildPapers = function (subject) {
  const pool = [];
  (subject.units || []).forEach((u) =>
    (u.questions || []).forEach((q) => pool.push({ ...q, from: u.t }))
  );
  if (!pool.length) return [];
  const years = [2024, 2023, 2022, 2021, 2020];
  const perPaper = Math.max(4, Math.ceil(pool.length / years.length));
  return years.map((yr, i) => ({
    year: yr,
    questions: pool.slice(i * perPaper, i * perPaper + perPaper)
  })).filter((p) => p.questions.length);
};
