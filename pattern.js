// Maharashtra HSC theory paper pattern, copied from the "General Instructions" of the actual
// Feb/March 2024 board papers (Physics, Chemistry, Biology, Maths & Stats). Checked 2026-11-16.
// Time plans are our suggestion (they add up to 180 min), not a board rule.
const SCI = {
  total: 70, attempt: "37 questions",
  sections: [
    { s: "A", what: "Q1: 10 MCQs × 1 mark + Q2: 8 very short answers × 1 mark", attempt: "All 18", marks: 18, min: 20 },
    { s: "B", what: "12 short answers × 2 marks (Q3–Q14)", attempt: "Any 8", marks: 16, min: 30 },
    { s: "C", what: "12 short answers × 3 marks (Q15–Q26)", attempt: "Any 8", marks: 24, min: 55 },
    { s: "D", what: "5 long answers × 4 marks (Q27–Q31)", attempt: "Any 3", marks: 12, min: 45 },
  ],
};
const RULES = [
  "Time: 3 hours. Use of log table is allowed. Calculator is NOT allowed — practise arithmetic and log-table use.",
  "MCQs: only your FIRST attempt is evaluated — don't overwrite. Write the option letter AND the answer, e.g. (B) 2MR^2.",
  "Start each section on a new page.",
];
window.PATTERN = {
  physics: { ...SCI, extra: ["Physical constants (e, h, c, g, epsilon0, mu0...) are printed in the paper — you don't need to memorise their values."] },
  chemistry: { ...SCI, extra: ["Learn named reactions with conditions — they appear in Sections B, C and D."] },
  biology: { ...SCI, extra: ["Labelled diagrams earn marks in Sections C and D — practise drawing them neatly."] },
  math: {
    total: 80, attempt: "33 questions",
    sections: [
      { s: "A", what: "Q1: 8 MCQs × 2 marks + Q2: 4 very short answers × 1 mark", attempt: "All 12", marks: 20, min: 25 },
      { s: "B", what: "12 short answers × 2 marks (Q3–Q14)", attempt: "Any 8", marks: 16, min: 30 },
      { s: "C", what: "12 short answers × 3 marks (Q15–Q26)", attempt: "Any 8", marks: 24, min: 45 },
      { s: "D", what: "8 long answers × 4 marks (Q27–Q34)", attempt: "Any 5", marks: 20, min: 50 },
    ],
    extra: ["Graph paper is not needed — a rough sketch is enough for graph questions (e.g. LPP)."],
  },
  rules: RULES,
  readMin: 10, reviseMin: 20,
};
