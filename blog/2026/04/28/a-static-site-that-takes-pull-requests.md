---
title: "A static site that takes pull requests"
description: "Why I hand-rolled a contribution flow for Out of Office instead of
  reaching for Decap CMS, and what the bespoke version buys you."
tags: [astro, svelte, github]
---

[Out of Office](https://www.outofoffice.cv) catalogues post-parliament gigs
taken by Australian politicians. The data is structured: each gig holds a
pollie slug, role description, organisation, dates, source URL, and a
zod-validated shape. The site runs on Astro and GitHub Pages, which means
there's no server, no database, and no API of my own. Contributions go in
via PRs against `gigs.json` in the public data repo.

The naive contribution flow is "fork the repo, edit the JSON, send a PR."
That works for people who'd already do it without prompting. The goal is to
lower the friction. Someone arriving from a tweet, with a fact and two
minutes, should be able to submit it without forking the repo.[^audience]

[^audience]:
    The audience is approximately "people who already file PRs," but
    the goal is still to make the marginal contributor's life easier.

A free-text comments box would not cut it, because the data has typed
fields, validated shapes, and downstream code that depends on both. Whatever
takes contributions has to enforce that shape at the form level, not just
at PR review time.

A pile of mature tools already cover this territory. Decap CMS (formerly
Netlify CMS), Sveltia, and TinaCMS all give you a content editor that
commits to a GitHub repo. They're well-built, well-documented, and
battle-tested. For a generic content site, picking one of them is the right
answer.

Out of Office is not a generic content site. The data is a flat array of
typed records validated by a zod schema. Adding a gig means resolving a
politician by slug and picking a role type from a closed enum. Date ranges
have to be validated against parliamentary tenure. The form has to know all
of that, and Decap and friends are markdown-frontmatter editors. Pointing
them at structured JSON is possible, but the configuration ends up being
most of the work, and the result still feels like a generic CMS bolted onto
your site. The visual register is wrong: the form lives in an admin shell,
not in the same design system as the rest of the site.

There's a deployment problem too. Decap's GitHub auth needs a backend
somewhere. The choice is Netlify Identity or a self-hosted OAuth proxy, and
both are backends. The "static site, no backend" premise dies on contact
with the auth flow.

What I built instead is a Svelte component that talks to the GitHub API
directly, with the user's PAT as the credential. Configuration is replaced
with code, which I'd be writing for the form anyway. The contribution form
is one component, but its logic is three separate factories. Each owns one
concern. Reactivity comes from runes. Persistence comes from localStorage.
The PR store handles the network.

`github-auth.svelte.ts` is the PAT lifecycle. It validates the token via
Octokit. The token gets persisted to localStorage on success. The store
also exposes a separate `isValidatingToken` flag, which the form uses to
disable submit while validation is in flight.

```ts
export function createGitHubAuth() {
  let token = $state("");
  let username = $state("");
  let isAuthenticated = $derived(!!username);

  async function saveToken() {
    const user = await validateToken(token);
    if (user) {
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
      username = user;
    }
  }

  return {
    get token() {
      return token;
    },
    set token(v) {
      token = v;
    },
    get username() {
      return username;
    },
    get isAuthenticated() {
      return isAuthenticated;
    },
    saveToken,
  };
}
```

`draft-gigs.svelte.ts` is the localStorage-backed CRUD layer for in-progress
entries. The store keeps an array of `DraftGig` (each with a
`crypto.randomUUID()` id) and writes through to localStorage on every
mutation. The id is the only thing that distinguishes a draft from a real
Gig; once the PR merges, the ids vanish.[^uuid]

[^uuid]:
    I considered keeping the UUIDs for traceability, then decided that
    a Gig is a fact about the world, not a contributor's row. Stripping the id
    at merge time felt right.

```ts
export function createDraftGigs() {
  let gigs = $state<DraftGig[]>([]);

  function addGig(gig: Omit<DraftGig, "id">) {
    gigs.push({ ...gig, id: crypto.randomUUID() });
    saveDrafts();
  }

  function generateFileUpdate(content: string): string {
    const existingGigs: Gig[] = JSON.parse(content);
    const newGigs: Gig[] = gigs.map(({ id: _id, ...gig }) => gig);
    return JSON.stringify([...existingGigs, ...newGigs], null, 2) + "\n";
  }

  return {
    get gigs() {
      return gigs;
    },
    addGig,
    updateGig,
    deleteGig,
    clearDrafts,
    generateFileUpdate,
  };
}
```

`pull-request.svelte.ts` does the actual API dance. It reads the base ref
and fetches the current file. The caller passes in a callback that
transforms the content (in practice, the `generateFileUpdate` from the
drafts store). From there, the store commits to a new branch and opens the
PR. Polling for merge happens on a 5-second interval.

```ts
export function createPullRequest(getStoredToken: () => string | null) {
  let status = $state<PrStatus>("idle");
  let url = $state("");

  async function createPR(options: {
    branchPrefix: string;
    title: string;
    updateFile: (content: string) => string;
    onMerged: () => void;
  }) {
    // get base ref, read file, transform, commit, open PR, poll
  }

  return {
    get status() {
      return status;
    },
    get url() {
      return url;
    },
    createPR,
    resetStatus,
  };
}
```

The form reads from each store's getters. It calls the methods directly.
There's no central coordinator, no middleware, and no event bus. The stores
compose by being small enough to compose.

The credential is the choice where the bespoke version's tradeoff lives.
The two options are an OAuth app or a personal access token. For a hosted
Decap-style flow, OAuth is the obvious answer. You register an app and set
up a callback URL. A proxy then exchanges the code for a token, which the
site stores in a session cookie. For a static site without a backend, every
step in that list except "register an app" is a problem.

A PAT skips the dance. The user creates a fine-grained PAT in their GitHub
settings and scopes it to the data repo. They paste it into a form, and the
site stores it in localStorage. Skipping OAuth eliminates several pieces:
an app registration, a proxy server, and the token-exchange code that
connects them. The deployment story stays "GitHub Pages, full stop."

The cost is real, though. The user has to know what a fine-grained PAT is.
They have to scope it correctly: `contents:write` on the data repo, nothing
else. They have to paste it into a form whose security model is "trust the
site's JavaScript, which lives in a public repo." None of that is a
friendly first-time experience.

For Out of Office, the audience filters itself. The people who would file a
PR generally know what a PAT is, or are willing to learn. The filter
doubles as abuse prevention.[^filter]

[^filter]:
    Bots don't tend to have fine-grained PATs scoped to your specific
    repo, mostly because there's no easy way to mass-produce them.

For a different audience, the calculation flips. A site asking
general-public users to contribute, like recipe submissions or neighbourhood
reports, cannot ask them to mint a PAT. That site needs OAuth, and OAuth
means a backend, which means the static-site claim is fictional.

The PR flow itself reads main and writes back a version with drafts
applied. If `newContent === currentContent` after that operation, abort:
someone else has already made these changes. No three-way merge, no
conflict UI. For low-write-frequency data, that's enough.

```ts
const currentContent = base64ToUtf8(fileData.content);
const newContent = options.updateFile(currentContent);

if (newContent === currentContent) {
  error = "These changes have already been made by another user.";
  status = "error";
  return;
}
```

The check is naive. It cannot tell the difference between "you're stale"
and "someone else made the same change." Both produce identical content,
so the flow aborts in both cases. The user message hedges: "These changes
have already been made by another user." Strictly true, regardless of which
case fired. For a site where the same gig getting filed twice in the same
minute would be remarkable, that's enough. A real merge engine would be
more code than the rest of the contribution flow combined.

Once the PR opens, the contribution still isn't finished. The user has done
their part, but the data hasn't actually changed yet. From their
perspective, the gig might have vanished into someone else's review queue.
The flow needs to close the loop.

After the PR opens, the store starts polling `pulls.get` on a 5-second
interval. The handler checks two states. If `pr.merged` is true, the merge
has happened, and the store clears local drafts and surfaces a success
state. If the PR was closed without merging, polling stops; the drafts stay
where they are, since the user might want to revise.[^closed]

[^closed]:
    A reviewer who closes a PR without merging has usually requested
    changes. Keeping the drafts means the user doesn't have to retype the
    entries.

Polling is unfashionable. Webhooks would be nicer, but webhooks require a
server that can receive them. For a static site, a 5-second poll over the
GitHub API is the pragmatic option.[^rate] The PR review window is usually
a few minutes at most, which keeps the polling well within rate limits.

[^rate]:
    GitHub's authenticated rate limit is 5,000 requests per hour. At
    5-second intervals, a single PR uses 720 requests across an hour of
    polling. A user submitting one contribution per visit will not hit the
    limit.

The visible result is small but matters. The user submits a gig and watches
the PR status update from "opened" to "merged" without leaving the page.
The new gig appears on the site. Their contribution is real, in less time
than it took them to type.

Whether this pattern is right for your site is mostly a question about the
data and the audience. The good cases share a shape. A site has a single
canonical data file, or a small handful of them. The data has typed fields
that domain users care about getting right. Contributions are infrequent
enough that two simultaneous PRs basically never happen, and the optimistic
concurrency check covers the once-a-year case where they do. The audience
is technical, motivated, and small. Out of Office fits all of these. Plenty
of other sites would too: a registry of public-art installations, a
small-nonprofit advisors database, or a co-op food-producer list.

The pattern fails on the inverse. A site aimed at the general public cannot
demand a PAT; the friction is fatal. Hundreds of submissions per day will
hit GitHub's rate limits, and the merge queue will take longer to triage
than writing the data conventionally. Genuine collaborative editing (two
people working on the same record at the same time) needs a real merge
engine, not "if the file changed, abort."[^crdt]

[^crdt]:
    There is a body of work on collaborative editing of structured
    data via CRDTs and operational transforms, mostly in the context of Google
    Docs and Figma. None of it is appropriate for a Friday-afternoon side
    project.

The question to ask is whether your data is the right shape for the
pattern. The pattern itself is fine. The data shape decides.

GitHub-as-database isn't a novel idea. Decap, Sveltia, TinaCMS, staticman,
and Issue Forms with Actions all use it, each for a different niche. The
idea is well-trodden ground. Going bespoke is worth the effort under two
conditions: your data has structure that generic editors can't capture
cheaply, and your audience is technical. Three small Svelte stores and a
hundred lines of GitHub API code will do the work, and the deployment story
stays "GitHub Pages, full stop."

If you want to copy or fork it, the full source is at
[github.com/out-of-office-cv/out-of-office-cv-website](https://github.com/out-of-office-cv/out-of-office-cv-website).
The three-store split and the optimistic-concurrency check are the most
useful pieces, generalising to any single-collection JSON site. Polling and
the PR-merge UX are nice but specific.

I built this in an afternoon.[^afternoon] The result is a contribution flow
that fits the site and validates against the schema. It runs on free GitHub
Pages, and took less code than configuring Decap would have.

[^afternoon]:
    Roughly, anyway. The token-validation flow took longer than I
    expected, and the Svelte 5 runes ergonomics took a while to click.
