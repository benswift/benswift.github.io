---
title: "A static site that takes pull requests"
description: "Out of Office stores its data in a JSON file in git, not a database. Why,
  and when this pattern fits."
tags: [astro, svelte, github]
---

[Out of Office](https://www.outofoffice.cv) catalogues post-parliament gigs
taken by Australian politicians. The data is structured: each gig holds a
pollie[^pollie] slug, role description, organisation, dates, source URL, and a
[zod](https://zod.dev/)-validated shape. The site runs on Astro and GitHub
Pages, with no server or database of my own. Contributions go in via PRs
against `gigs.json` in the public data repo.

[^pollie]: Australian slang for politician. I love it.

On the face of it, this is a CRUD app: typed records, validated input, and an
audit trail. The off-the-shelf answer is Postgres plus an admin panel, or a
headless CMS like [Decap](https://decapcms.org/),
[Sveltia](https://sveltiacms.app/), or [TinaCMS](https://tina.io/).

I went the other way for two reasons. The first is that there's no server:
GitHub Pages handles the site, and any 3am page about a memory leak is
GitHub's problem. The whole thing costs nothing to run.

The second is that git is already a perfectly good audit trail. Every gig
change is a commit with an author, a timestamp, and a diff. Reviewing a
contribution means reading a PR; reverting a bad entry is a one-click revert.
A CRUD app would require an `audit_log` table and an admin UI you'd have to
write yourself.

The one real wrinkle is auth: skipping the backend kills the OAuth dance,
since there's no proxy to exchange a code for a token. Two options remain for
hitting the GitHub API from the browser. OAuth needs a stateful callback URL
handled by a backend, which is exactly the dependency I'm trying to avoid.
The other option is a fine-grained personal access token (PAT), pasted into a
form and stored in localStorage.

A PAT skips the dance entirely. In their GitHub settings, the user mints one
scoped to the data repo. They paste it into the form, and the site uses it to
open PRs on their behalf.

The user has to know what a PAT is, and how to scope one (`contents:write` on
the data repo, nothing else). They also have to trust the site's JS, which
lives in a public repo. None of that is a friendly first-time experience. The
audience for Out of Office filters itself, and that filter doubles as abuse
prevention.[^filter] The people who would file a PR usually know what a PAT
is. If not, they're willing to learn.

[^filter]:
    Bots don't tend to have fine-grained PATs scoped to your specific repo,
    mostly because there's no easy way to mass-produce them.

Whether this pattern fits your site is mostly a question about the data and
the audience. The good cases share a shape: a canonical data file with typed
fields, contributions infrequent enough to avoid concurrent PRs, and a small
motivated audience. When the conditions don't hold, the pattern breaks. A
site aimed at the general public can't demand a PAT; the friction is fatal.
Hundreds of submissions per day will hit GitHub's rate limits, and the merge
queue will take longer to triage than writing the data conventionally.

If you want to copy or fork it, the full source is at
[github.com/out-of-office-cv/out-of-office-cv-website](https://github.com/out-of-office-cv/out-of-office-cv-website).
The contribution form is one Svelte component and three small stores (auth,
drafts, PR), with under 200 lines of GitHub API code. It runs on free GitHub
Pages, and I built it in an afternoon.
