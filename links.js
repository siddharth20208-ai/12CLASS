// External study resources. Shaalaa subject IDs checked in a live browser on 2026-11-16.
// ponytail: links to Shaalaa's subject-level pages, not per-question pages (their per-question URLs
// can't be predicted). Per-question lookups use a site:shaalaa.com search instead.
const SH = "https://www.shaalaa.com";
const SH_COURSE = "maharashtra-board-12th-standard-board-exam-hsc-science-general_573";
const SH_SUBJ = { physics: "class-physics_754", chemistry: "chemistry_760", biology: "biology_763", math: "mathematics-statistics-arts-science_756" };
const q = encodeURIComponent;

window.LINKS = {
  papers: (s) => `${SH}/search-question-papers/${SH_COURSE}?subjects=${SH_SUBJ[s]}`,
  important: (s) => `${SH}/search-important-solutions/${SH_COURSE}?subjects=${SH_SUBJ[s]}`,
  bank: (s) => `${SH}/search-question-bank-solutions/${SH_COURSE}?subjects=${SH_SUBJ[s]}`,
  video: (topic, s) => `https://www.youtube.com/results?search_query=${q(`${topic} ${s === "math" ? "maths" : s} class 12 maharashtra board`)}`,
  shaalaaSearch: (text) => `https://www.google.com/search?q=${q(`site:shaalaa.com ${String(text).slice(0, 120)}`)}`,
};

// Small link row used under topics and questions.
window.linkRow = (items) => `<div class="links-row">${items
  .map(([label, href]) => `<a class="xlink" href="${href}" target="_blank" rel="noopener">${label} ↗</a>`)
  .join("")}</div>`;
