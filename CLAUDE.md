# benswift.me blog post writing style guide

This is a colocated jj repo---use `jj` for all version control operations, not
`git`. The main branch is `main`. Before pushing, always `jj git fetch` and
rebase onto `main@origin` to handle CI commits (e.g. atproto state updates)
that land between fetches.

This is a vitepress site. Always use ts (not js) and follow vitepress
conventions wherever possible. Stick to modern best practices, e.g. es6 modules.

## Voice and tone

Write in a conversational, academic style that's accessible without being dumbed
down. Use first person ("I") freely. Use the benswift-writer skill.

## Custom containers

Use `info`, `tip`, `danger`, `warning` and `details` containers as necessary,
but ensure there are blank lines between them and the content, e.g.

```md
::: tip

Here's a tip.

:::
```

### When to use tip vs info

- **`::: tip`** --- for actionable guidance: technical advice, recommendations,
  how-to instructions, cross-references where the reader should take action
- **`::: info`** --- for contextual information: background context, source
  attributions ("This article originally appeared in..."), status updates,
  corrections, disclaimers, author bios

## Code and technical content

When discussing code or technical concepts:

- show actual code snippets
- explain the "why" not just the "what"
- acknowledge when something is a hack or workaround
- be honest about limitations and problems

## Australian spelling

Use Australian English: "colour", "centre", "realise" (not "realize")

## Creating new posts

Run `npm run post "<title>"` to create a new blog post with the correct
frontmatter and file structure.
