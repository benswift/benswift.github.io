---
id: TASK-31
title: Email Kiera the 900-word THE cut of the shallow-moats follow-up
status: Done
assignee: []
created_date: '2026-07-25 06:41'
updated_date: '2026-07-27 23:03'
labels:
  - writing
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Kiera O'Brien (Times Higher Education) read the blog version of 'Shallow moats, eighteen months on' and asked for a trim to 800-900 words, saying she'd flag any spots needing more context for the average reader on the new draft. She also wants 'The moats are still shallow, but the stakes are much higher' as the headline. The cut is drafted at src/content/blog/2026/07/25/shallow-moats-times-higher-education.md (published: false, 900 words, footnotes dropped, date-agnostic phrasing, and three post-publication developments folded in: Anthropic's Opus 5, the Nvidia/Microsoft/Meta open-weight letter, and the Kimi K3 Redis zero-days). What's left is sending it and settling two things only Kiera can answer.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Reply sent to Kiera with the ~900-word cut
- [x] #2 Email confirms her suggested headline and notes the closing line was reworded so it no longer echoes it
- [x] #3 Email summarises what was cut (footnotes, Stratechery/Fireworks detail, duplicated valuations) and what was added since she read it (Opus 5, the open-weight letter, the K3 Redis result)
- [x] #4 Email asks whether THE is republishing or linking out, since the draft says 'in these pages'
- [x] #5 Kimi K3 weights status re-checked at send time (due 27 July 2026) and the opening paragraph updated if they have landed
- [x] #6 Email invites her to mark the places she wants more context for the average reader
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
28 July 2026: sent the threaded reply to Kiera from the ANU account with a 902-word .docx attached (also at ~/Downloads/shallow-moats-THE-cut.docx).

Pre-send review turned up more than expected. AI-trope scan came back clean (no trope vocabulary, 3 em dashes in the body, sentence lengths 1-35 with mean 18.7), but the trim had introduced register drift and four factual problems:

- zero verbal contractions, against ~10 in the blog original and 7+ in the Feb 2025 piece THE published; restored three
- "that advice" had lost its antecedent when the trim deleted the closing re-anchor; now reads "stay provider-agnostic"
- bare "Then," paragraph opener, and an ambiguous "counter-evidence" sentence
- LEDE ERROR: claimed Moonshot released K3's weights the day before Xi's keynote. It launched the model then and only promised the weights, which landed ~11 days later. Reworded.
- the open-weight letter: Google also declined to sign (not just OpenAI and Anthropic), and the 25 signatories include Mistral, Black Forest Labs, non-profits and VC firms, so "twenty other American companies" was wrong twice over
- Opus 5 shipped the same day the Redis findings were reported, not "days later"
- ExploitGym is a public benchmark run internally, so "internal evaluation" not "internal benchmark"
- Redis result given its real numbers: nineteen zero-days, and the 27 minutes was the exploit alone

Verified against primary sources (incl. the letter PDF itself): Xi quote, $852bn/$965bn valuations, 3-6 month gap, Anthropic's two model forms, the HF incident and its recommendation, OpenAI's acknowledgement, Opus 5 pricing and the 85% figure, and the 29%/under-4% gateway split. NOT re-verified, carried over from the blog post: Epoch's 2025 gap claim, the ~$700bn capex figure, Moonshot's docs, the 2023 Google memo quote.

AC#4 resolved rather than asked: "argued in these pages" is now a link to the THE original (https://www.timeshighereducation.com/campus/deepseek-and-shallow-moats-what-does-it-mean-higher-education), so the self-reference resolves whether THE republishes or links out. The email flags it and invites correction instead of posing the either/or.

Commits: 190ac136f, 3ae6198f5, dfa508685, 56f07caf5.

Follow-up (done, d60141594): the live blog post (2026/07/19) said the K3 weights were "promised as a free download by the end of the month", with a footnote making a point of the promise/download-link distinction. Added an `:::info[Update]` callout noting they shipped, rather than rewriting the original prediction. Ben notes the blog post may come down entirely if the THE piece goes live.
<!-- SECTION:NOTES:END -->
