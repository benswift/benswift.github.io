---
title: AI systems in Higher Education: feedback loops, opportunities and things to watch out for
---

AI applications are already part of the Higher Education experience for
students, instructors, and administrators. Some of them are chatbots/intelligent
tutoring systems, some are auto-grading and feedback apps, some use AI in
academic integrity breach detection and exam proctoring. We're also on the crest
of a wave of new AI apps for text/image/video synthesis, where you give the AI a
_prompt_ like "What role did Sir John Kerr play in the 1975 Australian
Constitutional Crisis?" or "draw a picture of a red unicorn playing a Fender
Stratocaster" and it will spit out a _response_ which (while not always perfect)
in most cases could pass for something hacked together by a harried student in
the few hours before the assessment deadline.

To understand the way that AI will transform higher education, we must consider
these networks of interacting human and AI components as systems, rather than
focusing on individual components. There are opportunities here for instructors
and students alike, but there are also pitfalls and dead ends, and this article
shows how a "systems perspective" can help us steer towards the best uses of AI
in Higher Education.

I'm writing as someone with ten years experience as an lecturer and course
convenor in Computer Science. I've taught large (500 student) compulsory courses
and I've taught small special-interest electives. I've also built and used
infrastructure for automating some aspects of course admin, although more
commonly with standard "if-then-else" programs than "input-deep magic-output" AI
ones. However, as an AI researcher I also build AI powered tools, and I can
certainly see the convergence between the "AI research and tool-building" part
of my job and the teaching part.





it's about flows of information: assignment spec to student, student
(synthesising many sources) produces assignment artefact

some implications

- hard to see it making the best student work better, but it'll allow students
  who only care about passing to do so with much less effort

- there are going to be feedback loops involved; e.g. a bit selling point of the
  AI ITS stuff is that you can teach larger classes (or start new classes you)
  than you otherwise have the instructors to support. However, this means that
  the other parts of the. End-game: student demand is fully tapped (which in
  some disciplines, such as CS, seems to be a long way away) but we're quite
  reliant on our AI tools to handle that teaching workload without burning out
  all the humans involved in the process. And humans _will_ still be involved;
  (almost) nobody is proposing that we have purely automated classes in higher
  education.

- AI text summarisation will help with grading/triaging (especially because,
  let's be honest, we often don't budget the TA hours to look carefully at the
  submitted work)

- if you're grading an text/image/video artefact, it's now _much_ harder to tell
  whether the artefact is the work "only" of the student, or whether they used
  an AI tool to create it... so **design assessments where that doesn't
  matter**. In other words, if the question "was an AI involved in the creation
  of this artefact" really matters, you're gonna be in trouble (because it'll be
  increasingly hard to give a definitive answer, especially without specialised
  expertise and under the time pressures that we're all under in our grading).
  
- it might make the contract cheating thing less profitable as a business...
  because the humans which provide that service will be automated away
  
- human-AI co-creation isn't going anywhere, so make it part of your assessments
  (reverse assignments are cool, too). get students to design frontends &
  workflows, which other students can try out. How about an essay-writing
  assignment where the students are encouraged to write the topic sentences for
  each paragraph use an AI to complete the rest (perhaps including the
  introduction and conclusion)? And then to critically reflect on their process
  of iteratively poking the AI (via the topic sentence prompts) to ensure a
  coherent overall argument for the essay? How about getting an AI to write an
  assignment spec, and have the students come up with a rubric (and suggested
  improvements to your assignment spec) as their deliverable?

- cop shit is not the answer

- in-person invigilated assessment is probably not the answer either, especially
  in post-covid world

- there are some opportunities in auto-grading & feedback, especially combined
  with human feedback

- how will _human_ students and instructors change their behaviour in response?
  Sometimes you can predict this in advance, but you also need to be observant
  to emergent trends.

in many cases these tools provide leverage---students can churn out passable
essays faster, but instructors can also grade them faster. It's unclear which
"end" of this transaction will win out, and it's important to design your class
so that such "AI content arms races" aren't so likely.
  
There's a dystopian "future of AI in education" scenario where AI-generated
assignments are submitted and graded by AI grading and feedback bots, with
dull-eyed human teachers and students largely disconnected and disenfranchised.
But I'm not in this dystopian camp.

AI proctoring doesn't seem to work anyway, cf that recent study.
