---
title: "11ty and Vite for modern static websites"
tags: web
---

I've been using [11ty](https://www.11ty.dev/) for static site generation for a
while now, and it's great---simple, flexible, stays out of your way. But for a
recent project I needed proper asset bundling, hot module replacement, and
access to the npm ecosystem without building my own pipeline. Enter
[Vite](https://vite.dev/).

The combination turns out to work really well, withouth adding _too_ much
complexity over bare 11ty. Here's what I learned setting up 11ty with Vite and
Tailwind v4 for the [LLMs Unplugged](https://www.llmsunplugged.org/) teaching
resources site.

## Why not just use 11ty alone?

Vanilla 11ty is deliberately minimal. You write markdown, it spits out HTML.
Want to bundle JavaScript? Process CSS? Handle npm dependencies? You're on your
own. For content-focused sites this is perfect---less magic means less to break.

But when your site needs interactive components, proper module resolution, and
modern CSS tooling, you end up reinventing the wheel. I tried the "just manually
copy files and use browser ESM" approach for a while, and it works until it
doesn't[^browser-esm].

[^browser-esm]:
    Mostly it stops working when you want to use npm packages that expect a
    bundler, or when you need any kind of build-time transformation.

## The integration pattern

The magic happens through
[`@11ty/eleventy-plugin-vite`](https://www.npmjs.com/package/@11ty/eleventy-plugin-vite),
which lets 11ty and Vite play nicely together. Here's the core setup in
`eleventy.config.js`:

```javascript
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";
import tailwindcss from "@tailwindcss/vite";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    viteOptions: {
      plugins: [
        tailwindcss(),
        // ... other plugins
      ],
      build: {
        rollupOptions: {
          input: {
            main: "src/assets/main.js",
            slides: "src/assets/slides.js",
          },
        },
      },
    },
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
}
```

The Vite config lives directly inside the 11ty config via `viteOptions`. When
you run `eleventy --serve`, it starts both the 11ty build and Vite's dev server.
You get HMR for your CSS and JavaScript while 11ty rebuilds HTML on file
changes. And I set up a small test suite using [Vitest](https://vitest.dev/) as
well... because honestly it's still nice to have some regression testing at
least.

During build, 11ty generates HTML first, then Vite bundles your assets with
proper hashing and minification. The plugin handles rewriting asset paths in
your HTML to point to the hashed files.

## The key gotcha: passthrough files

Here's where I wasted a bunch of time 🙃. 11ty has this concept of
[passthrough file copy](https://www.11ty.dev/docs/copy/)---files that just get
copied directly to the output directory without processing. Useful for things
like `CNAME` files, `robots.txt`, PDFs, etc.

The problem: Vite's build process empties the output directory before it runs.
So 11ty copies your passthrough files, then Vite helpfully deletes them all.

The solution is a custom Vite plugin that runs _after_ Vite's build completes
and copies those files back:

```javascript
function preservePassthroughOutputs() {
  let rootDir;
  let outDir;

  return {
    name: "preserve-eleventy-passthrough",
    apply: "build",
    configResolved(config) {
      rootDir = config.root;
      outDir = config.build.outDir;
    },
    async closeBundle() {
      // Copy passthrough files after Vite is done
      const passthroughFiles = ["CNAME", "feed.xml", "favicon.svg"];

      for (const file of passthroughFiles) {
        const sourcePath = path.join(rootDir, file);
        if (await fileExists(sourcePath)) {
          const destinationPath = path.join(outDir, file);
          await fs.copyFile(sourcePath, destinationPath);
        }
      }
    },
  };
}
```

You could also use
[`vite-plugin-static-copy`](https://github.com/sapphi-red/vite-plugin-static-copy)
if you don't want to write your own plugin, though I found the custom one gave
me more control over exactly what gets copied and when.

## Tailwind v4's new approach

Tailwind v4 changes things significantly---in a good way. Instead of a
`tailwind.config.js` file, you configure everything through CSS using the
`@theme` directive. Here's what `main.css` looks like:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-anu-gold: #be830e;
  --color-anu-teal: #0085ad;
  --font-body: "Public Sans", "Inter", system-ui, sans-serif;
  --leading-body: 1.65;
  --tracking-tight: -0.02em;
}

@layer base {
  body {
    font-family: var(--font-body);
    line-height: var(--leading-body);
  }
}
```

No config file. No JavaScript. Just CSS with custom properties. The
`@tailwindcss/vite` plugin handles everything[^tw-v4].

[^tw-v4]:
    Tailwind v4 is still in beta as of writing this, but it's been stable enough
    for production use in my experience. Your mileage may vary.

This approach feels much more natural---design tokens as CSS custom properties
means you can use them directly in your CSS without jumping through hoops. Want
to reference your colour in some custom CSS? Just use `var(--color-anu-gold)`.

## Dependencies and setup

The key packages you need:

```json
{
  "dependencies": {
    "@11ty/eleventy": "^3.1.2",
    "@11ty/eleventy-plugin-vite": "^7.0.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.16",
    "vite": "^7.1.12"
  }
}
```

Your npm scripts are nice and simple:

```json
{
  "scripts": {
    "dev": "eleventy --serve",
    "build": "eleventy"
  }
}
```

The Vite integration is completely invisible---the eleventy plugin handles
starting and stopping Vite as needed.

## When this setup makes sense

If your site is purely content with minimal JavaScript, stick with vanilla 11ty.
It's faster to set up, easier to understand, and has fewer moving parts.

This makes sense when you:

- need proper JavaScript bundling and tree-shaking
- want hot module replacement during development
- have multiple entry points (main site JS, slide deck JS, admin panel, etc.)
- use npm packages that expect a bundler
- want to use Vitest for testing (it shares Vite's config understanding)
- need modern CSS tooling like Tailwind with proper build-time processing

For the LLMs Unplugged site, we have interactive components, slide decks using
reveal.js, and a bunch of build-time transformations. The extra complexity of
Vite pays for itself in developer experience.

## The verdict

Setting this up took me a bit of futzing about, but now that it's working the
development experience is excellent. HMR makes CSS tweaking instant, the build
output is properly optimised, and I still get 11ty's flexibility for content.

Would I do it again? Absolutely. But only for projects that actually need it.
Sometimes vanilla 11ty is exactly the right amount of tooling[^right-tool].

[^right-tool]:
    The best tool is the one that solves your problem without creating new ones.
    Boring technology and all that.

You can see the full implementation in the
[LLMs Unplugged repository](https://github.com/ANUcybernetics/llms-unplugged/tree/main/website)
if you want to dig into the details. The `eleventy.config.js` and
`src/assets/main.css` files have all the configuration.
