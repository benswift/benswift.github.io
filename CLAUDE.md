# benswift.me blog post writing style guide

This is a colocated jj repo---use `jj` for all version control operations, not
`git`.

This is a vitepress site. Always use ts (not js) and follow vitepress
conventions wherever possible. Stick to modern best practices, e.g. es6 modules.

This blog was previously a Jekyll site; the last Jekyll version is preserved at
the `jekyll` tag.

## Voice and tone

Write in a conversational, academic style that's accessible without being dumbed
down. Think "technical expert who doesn't take themselves too seriously". Use
first person ("I") freely.

## Structure

Start directly with the content---no lengthy preambles. Get to the point
quickly, then elaborate.

Use footnotes liberally for asides, clarifications, and witty observations. For
example:

- `[^lazy-pedagogy]: the best educators, like the [best programmers](https://threevirtues.com), are [lazy](https://blog.optimus-education.com/why-lazy-teachers-are-best)`

## Language patterns

### Custom containers

Use `info`, `tip`, `danger`, `warning` and `details` containers as necessary,
but ensure there are blank lines between them and the content, e.g.

```md
::: tip

Here's a tip.

:::
```

#### When to use tip vs info

- **`::: tip`** --- for actionable guidance: technical advice, recommendations,
  how-to instructions, cross-references where the reader should take action
- **`::: info`** --- for contextual information: background context, source
  attributions ("This article originally appeared in..."), status updates,
  corrections, disclaimers, author bios

### Things to do

- use em dashes for parenthetical thoughts---like this---to add rhythm
- employ self-deprecating humour (e.g. "I wasted a day yak-shaving just to get
  the software working 🙃")
- link extensively to other posts, tools, and references
- use technical terms without over-explaining (your audience is smart)
- mix short punchy sentences with longer technical expositions

### Things to avoid

- marketing speak or buzzwords
- unnecessary adjectives and flowery language
- explaining obvious things
- being overly formal

## Specific phrases and patterns

Start sections with conjunctions for flow: "But", "However", "So", "Well"

Use rhetorical questions to transition: "So is this a big deal?"

Signal self-awareness about your own writing: "But (you can probably tell that
there was going to be a 'but' somewhere)"

## Code and technical content

When discussing code or technical concepts:

- show actual code snippets
- explain the "why" not just the "what"
- acknowledge when something is a hack or workaround
- be honest about limitations and problems

## Australian spelling

Use Australian English: "colour", "centre", "realise" (not "realize")

## Creating new posts

Run `npm run post` to create a new blog post with the correct frontmatter and
file structure.
