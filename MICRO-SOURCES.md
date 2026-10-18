# Wyatt’s Microeconomics — supplied study guide

## Source and scope

- Source: user-supplied `Study guide 1 micro (1) (1).docx`, preserved unchanged at `assets/micro/study-guide-1.docx`.
- Dataset: `micro-source.json` — 90 Q&A items with stable IDs and one-based Word body paragraph ranges (blank paragraphs count).
- `micro-match.json` supplies 42 concise, source-linked study paraphrases (six per chapter) so matching uses readable terms and definitions rather than entire answer paragraphs. The original answers and clarifications remain available below each board.
- Actual sections: chapters **1, 3, 5, 7, 9, 10, 11**, containing **16, 14, 18, 10, 12, 10, 10** items respectively.
- The opening line says “Macroeconomics chapters 1,2,4,5,7,9,10,11.” The supplied body governs this room’s content; missing chapters have not been invented and Wyatt’s requested Microeconomics subject has not been relabeled.
- Source questions and answers retain their wording. Line breaks are preserved and Word equation fractions/subscripts are transcribed into readable plain text. Both elasticity examples are complete; the second was not visible in basic DOCX text extraction.
- Separate `note` annotations clarify economic assumptions and imprecise source statements. They are study explanations, not source quotations or an instructor-approved answer key. Review annotations when studying answers, especially unit elasticity, marginal comparisons, market efficiency, permits, and public goods.
- No proprietary textbook, unseen syllabus, or instructor authorship is asserted. This is coverage of the supplied study guide, not confirmation of an exam’s complete scope.

## Verification and regeneration

`python tests/micro-source-check.py` independently checks the original document against all item paragraph ranges, coverage, IDs, chapter counts, recovered equation inputs, and numeric results. The second midpoint fraction is also manually checked against its nested OMML structure.

Run `npm test` for browser regressions. With a preview running, `node scripts/verify-micro-live.cjs` exercises the main study loops; set `BASE_URL` to a public URL ending in `/` to verify repository-subpath deployment.

To regenerate:

```sh
python scripts/extract-micro.py "PATH/Study guide 1 micro (1) (1).docx"
python tests/micro-source-check.py
```

Use the original filename to retain its attribution. The extractor writes only `micro-source.json`; it does not alter the DOCX.

Numeric checks include midpoint elasticity **−2/3 ≈ −0.67** for price 10→14 and quantity 100→80; **−1** for `Q_d = −2P + 100`, price 20→30; and the revenue/percentage-convention caveat for the source’s literal +10%/−10% example. A source-preservation pass is not a claim that every supplied statement is precise without its annotation.
