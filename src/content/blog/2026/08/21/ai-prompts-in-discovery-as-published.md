---
title: "AI prompts in discovery"
description: "Archived full text of my Point piece on AI prompts and legal discovery, kept here in case the original ever goes offline."
published: false
crosspost: false
tags:
  - oped
  - ai
---

:::info

This is the full text of my piece as published in the Point on 21 August 2026: <https://thepoint.com.au/opinions/260821-ai-prompts-in-discovery>. It's archived here, unpublished, so the text stays in a form I control if the original ever comes down. The published pointer for it is
[/blog/2026/08/21/ai-prompts-in-discovery](/blog/2026/08/21/ai-prompts-in-discovery/).

:::

I'm sure I'm not the only one [suspicious about 'commissioned reports'](https://australiainstitute.org.au/report/consultants-structurally-unsound/).

An expert paid by some company or organisation finds that the company has made the right decision, or is innocent of certain accusations, and we all roll our eyes.

The firms that get commissioned to write these reports aren't too bothered by this, because they've already been paid, and for most people this cynicism is priced in. The suspicion is never provable anyway.

Or, at least, it's not usually provable.

This month, courtesy of ChatGPT and a Texas courtroom, the extent to which these findings are pre-ordained was revealed to the world.

Josh Autenrieth is a mechanical engineer, and 3M paid him \$475 an hour for an expert opinion. The matter was the explosion that destroyed Watson Grinding & Manufacturing in Houston in January 2020, killing three people and levelling around two hundred homes. A propylene hose had failed overnight, and 3M was being sued over calibration work its technician had done on the plant's gas detectors. Autenrieth's job was to say whether that work met the standard of care. On 10 June, he opened ChatGPT and typed his brief:

> create an exceptional expert witness report defending the standard of care of 3M … and show how 3M is 0% at fault for the explosion at watson grinding

Seventeen minutes later the model returned a draft, opening with a sentence of _impeccable_ neutrality: "I have been asked to evaluate whether 3M, through its gas detection service technician, met the applicable standard of care." Further down that same page it observes that legal fault allocation is a matter for the court, then concludes that 3M bears "0% technical causative responsibility". All of this is in [the 350 pages of chat logs obtained by 404 Media](https://www.404media.co/show-how-3m-is-0-at-fault-expert-witness-used-chatgpt-to-write-report-defending-company-in-deadly-explosion-lawsuit/). The jury was not persuaded: earlier this month it [found 3M 30% at fault](https://natlawreview.com/press-releases/harris-county-jury-awards-615-million-watson-grinding-explosion-trial-finds) and ordered it to pay [US\$61.5 million](https://www.houstonpublicmedia.org/articles/news/energy-environment/2026/08/12/559314/watson-grinding-explosion-jury-orders-3m-pay-61-million/). 3M is appealing.

The brief exists in writing only because its reader was a machine. A chatbot can't take a hint, and it doesn't know who's paying. It can't interpret the tone of your voice or catch the wink; to get the report you want, you have to say what you want, spelling out in writing what everyone involved would once have left unsaid.

2e:Tc25,

Autenrieth's logs surface

Autenrieth's logs surfaced because a plaintiff's lawyer noticed AI-written phrasing in an exhibit and demanded the chat history as part of the standard legal discovery process. At least one American court has since [held that an expert's AI prompts are discoverable](https://www.mayerbrown.com/en/insights/publications/2026/06/court-orders-disclosure-of-expert-witnesss-ai-prompts-what-litigators-need-to-know) as part of their methodology, although that ruling is currently under challenge.

In Australia, we've already seen something similar to this situation, although it went the other way.

Deloitte was paid around \$440,000 to review [the welfare compliance system](https://australiainstitute.org.au/post/shame-and-harm-at-every-jobseeker-turn-and-now-with-added-ai-slop/) for the Department of Employment and Workplace Relations. [Christopher Rudge of the University of Sydney found that it cited papers which do not exist](https://thenightly.com.au/australia/nsw/law-lecturer-christopher-rudge-slams-deloittes-government-funded-report-written-with-ai-c-20254156). Deloitte repaid the final instalment. A revised version disclosed in an appendix that the drafting had used OpenAI GPT-4o --- a model which was by then more than a year old, and the same one ChatGPT gives away for free, so for its \$440,000, the department didn't even get the top-of-the-line AI model.

These errors came out because a fabricated citation can be checked against a library. Nobody has seen the brief (or "prompt") that Deloitte gave ChatGPT to generate their report. The output was auditable, and the brief was not, which is why this debate keeps coming back to [detection and watermarking](https://www.anthropic.com/news/claude-text-watermark). But those are output-side questions --- the inputs are more revealing, as the 3M case above shows. Whether freedom of information or legal discovery or a Senate order for the production of documents can surface these inputs in general is untested, largely because nobody has asked.

They will start asking, though, and that is when this 'transparency window' might close. These logs are legible today because people talk to AI tools candidly. It's not hard to foresee that if a few similar cases happen in Australia, then cultures of secrecy will develop around prompts as well.

"Don't prompt the AI tool on the company account" will become the new "don't put that in writing". Or ask the model for five framings and pick one, which leaves no record of what you were after.

Nothing will look different from outside, because the reports will read as they always have. The organisations best placed to shut this window are the ones it currently exposes, so I would not expect it to stay open.

For now we can still read the brief, and it says what everyone always suspected it said.

_**Dr. Ben Swift is a computer scientist and AI researcher/educator. He leads the Cybernetic Studio at the ANU School of Cybernetics.**_

25:["$","div",null,{"className":"s
