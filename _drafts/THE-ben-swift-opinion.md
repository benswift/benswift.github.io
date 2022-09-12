---
title: "AI systems in Higher Education: feedback loops, opportunities and things to watch out for"
---

AI applications are already part of the Higher Education experience for
students, instructors, and administrators. Some of them are chatbots/intelligent
tutoring systems, some are auto-grading and feedback apps, some use AI in
academic integrity breach detection and exam proctoring. We're also on the crest
of a wave of [new](https://openai.com) [AI](https://openai.com)
[apps](https://stability.ai/blog/stable-diffusion-announcement) for text/image
synthesis, where you give the AI a _prompt_ like "What role did Sir John Kerr
play in the 1975 Australian Constitutional Crisis?" or "draw a picture of a red
unicorn playing a Fender Stratocaster" and it will spit out a _response_ which
(while not always perfect) in most cases could pass for something hacked
together by a harried student in the few hours before the assessment deadline.

I'm writing as someone with ten years experience as an lecturer and course
convenor in [Computer Science](https://comp.anu.edu.au/people/ben-swift/) and
[Cybernetics](https://cybernetics.anu.edu.au/people/ben-swift/). I've taught
both large (500 student) compulsory courses and 10 student
[special-interest](https://comp.anu.edu.au/courses/laptop-ensemble/). I've also
built infrastructure for automating some aspects these courses, although more
commonly using normal "if-then-else" programs than "input-deep magic-output" AI
ones. However, as an AI researcher I also build AI powered tools, and I can
certainly see the convergence between the "AI research and tool-building" part
of my job and the teaching part.

To understand the way that AI will transform higher education, we must consider
these networks of interacting human and AI components as systems, rather than
focusing on individual components. There are opportunities here for instructors
and students alike, but there are also pitfalls and dead ends, and this article
shows how a "systems perspective" can help us steer towards the best uses of AI
in Higher Education.

To understand what is happening with the introduction of AI into the higher
education experience, it's crucial to realise that so much of the student and
instructor experience in a course is about **flows of information**. For
example, an instructor creates an assignment spec which is sent to the student.
In response, the student (synthesising many sources of information, from both
the course curriculum and elsewhere) produces and creates an assignment artefact
(e.g. an essay). This artefact is graded by an instructor, and both a numerical
mark and qualitative feedback are sent back to the student---another information
flow which will inform the students work in subsequent assignments.

Don't get me wrong, I'm not saying that this is _all_ there is to participating
in a university course---crucially the human community aspect is missing in the
above description. However, thinking about the above information flow gives us a
helpful perspective for considering where AI might amplify or dampen the
different information flows within the system, or where it give rise to new
ones. In particular, there are three potential "system dynamics" I'm on the
lookout for as AI becomes more deeply integrated into higher education.

Firstly, while it's less clear that the AI text/image synthesis tools will
making the best student work better, it's pretty clear that it'll allow students
who only care about passing without actually attaining the course learning
outcomes to do so with much less effort. The implication for instructors is that
if you're grading an text/image artefact, it's now _much_ harder to tell whether
the artefact is the work "only" of the student, or whether they had the help of
an AI tool to create it. In other words, if the question "was an AI involved in
the creation of this artefact" really matters, it'll be increasingly hard to
give a definitive answer, especially without specialised expertise and under the
time pressures that we're all under in our grading.

Secondly, there are going to be feedback loops involved; for example a big
selling point of the AI chatbot products is that you can teach larger classes
(or create new classes) than you otherwise wouldn't have the instructors to
support. AI text summarisation tools could also help with grading/triaging,
especially because---let's be honest---we often don't budget the TA hours to
look carefully at the submitted work anyway. One potential endgame for this
dynamic is that instead of having to [cap places in
high-demand](https://www.dailycal.org/2022/08/24/campus-college-of-letters-and-science-plans-to-limit-high-demand-majors/),
class sizes could grow until student demand is satisfied. The risk here is that
such a class would be incredibly reliant on those AI tools to handle that
teaching workload without burning out all the humans involved in the process.
And humans _will_ still be involved; (almost) nobody is proposing that we have
purely automated classes in higher education.

Thirdly, human-AI co-creation isn't going anywhere, so make it part of your
assessments. Get students to design new frontends & workflows, which other
students can try out. How about an essay-writing assignment where the students
are encouraged to write the topic sentences for each paragraph use an AI to
complete the rest (perhaps including the introduction and conclusion)? And then
to critically reflect on their process of iteratively poking the AI (via the
topic sentence prompts) to ensure a coherent overall argument for the essay?
Alternatively, the "reverse assignment" approach---the instructor could enlist
the help of an AI to write an assignment spec, and have the students come up
with a rubric and suggested improvements to your assignment spec as _their_
deliverable?

Finally, I do wonder (and hope!) that some of these AI tools might make contract
cheating less profitable as a business, because the humans which provide those
service will be automated away as well. Although certainly the
cheating-industrial-complex is well positioned to take advantage of the
AI-enabled future of higher education---they've probably got the best databases
of instructor and student-created content on the planet.

The main take-away is here that AI tools in higher education won't operate in
isolatation, they'll become part of the system of higher education---students
can churn out passable essays faster, but instructors can also grade them
faster. It's unclear which "end" of this transaction will win out, or which
balancing mechanisms (natural or regulatory) will be required in response, so
it's important to design your class so that such "AI content arms races" aren't
so likely.
  
There's a dystopian "future of AI in education" scenario where AI-generated
assignments are submitted and graded by AI grading and feedback bots, with
dull-eyed human teachers and students largely disconnected and disenfranchised.
But I'm not in this dystopian camp. I am, however, keeping an eye out for how
_human_ students and instructors change their behaviour in response to these
changes in the information ecosystem in which we exist?
