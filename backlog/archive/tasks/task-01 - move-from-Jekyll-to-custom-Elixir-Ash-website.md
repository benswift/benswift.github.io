---
id: task-01
title: move from Jekyll to custom Elixir/Ash website
status: To Do
assignee: []
created_date: "2025-07-16"
labels: []
dependencies: []
---

## Description

We need to move this website from a static Jekyll site to a custom Elixir/Ash
(non-static) website. A sketch of the plan would be:

- keep the blog posts and other "web content" md files as-is, ingest them at
  runtime via an Ash resource backed by `Ash.DataLayer.Ets`, and use MDEx during
  ingestion to render HTML that we cache for later reads
- use phoenix liveview and presences to add cool dynamic features that aren't
  currently possible with a static website
- ditch pretty much all the sass/css from the current website; re-write a new
  site using tailwind 4 and the new daisyUI components shipped with the new
  Phoenix 1.18

Post authoring would still be done by writing new md files in the git repo (this
does mean that creating/updating a post would require a full update and restart
of the app, but I'm fine with that in the short term). Aside from that, the new
Elixir app might not even need a data layer (e.g. sqlite, postgres). But that's
a TBC that I will clarify through the design & build process---it may be
necessary to add a proper data layer to add additional features in the future
(e.g. user accounts? not sure I want them, though).

Part of the migration approach would be to use the jekyll-sitemap plugin to
generate a sitemap.xml containing full paths to all pages on the current
(static) site, and then part of the testing for the new website would be to
iterate through every page and make sure that the new one responded with the
same content (modulo styling changes... in the short term, checking that it
least didn't 404).

Additionally, I still want automated safety rails: a crawler-driven link check
that walks the legacy sitemap and confirms there are no 404s after the move.
Pagespeed and a11y audits can stay as separate CI tasks or manual jobs instead
of blocking the main test suite.

The current jekyll site has one particular custom plugin which reads a BibTeX
(`*.bib`) file and uses that information to populate a list of citations on e.g.
the main "Research" page. I would need to duplicate this in Ash/Elixir as well.

### Libraries

- latest Ash/Phoenix (must be 1.8 - rc is ok)/Phoenix LiveView (1.18)
- daisyUI for frontend components (as per Phoenix 1.8 defaults)
- use igniter wherever possible to install libraries
- MDEx for markdown parsing (with table and strikethrough extensions)
- bibtex_parser (https://hex.pm/packages/bibtex_parser) for BibTeX file parsing
- yaml_elixir for frontmatter parsing

### Jekyll tag and filter migration

Part of the migration should be removing the Jekyll (i.e. Ruby) tags and filters
in the md files and replacing them with (in order of preference):

- custom HTML elements, as per
  https://deanebarker.net/tech/blog/custom-elements-markdown/
- replace with normal HTML (if it's not too messy)
- investigate if MDEx allows for Elixir-style compile-time filters

### Jekyll-specific parts migration strategy

#### \_includes files

The `_includes` folder contains reusable HTML snippets used throughout the site.
Migration approach:

- **Layout partials** (`head.html`, `header.html`, `footer.html`): convert to
  Phoenix components in `lib/blog_web/components/`
- **Analytics/tracking** (`analytics.html`, `anchorjs.html`, `hljs.html`):
  convert to Phoenix hooks or components
- **Content helpers** (`cc-link.html`, `picture.html`, `qrcode.html`,
  `youtube.html`, `toc.html`, `taglist.html`): convert to Phoenix function
  components
- **Slide components** (`slides/*.html`): defer migration (see reveal.js section
  below)
- **Markdown includes** (`blurbs/I-am-paragraphs.md`): convert to Elixir
  functions that return compiled HTML

#### \_talks and reveal.js presentations

The `_talks` folder contains reveal.js-powered markdown presentations that
heavily use Jekyll includes. Migration approach:

- **Short-term**: do not attempt to port the reveal.js system initially
- **Options**:
  - export all presentations as static HTML files and serve them statically
  - keep the reveal.js infrastructure separate from the main Phoenix app
  - potentially integrate reveal.js later as a separate LiveView component if
    needed
- **Note**: these presentations use `{% include slides/*.html %}` tags
  extensively which would need custom handling

#### \_plugins

Custom Jekyll plugins that need Elixir equivalents:

- `biblist.rb` & `livecoding-bib.rb`: already covered with `bibtex_parser` in
  the plan
- `browserify.rb` & `cljs-build.rb`: skip (ClojureScript build system, handle
  manually if needed)
- `revealify.rb`: skip (part of reveal.js system)
- `jekyll-git-hash.rb`: implement as compile-time function using `:os.cmd/1`
- `htmlproofer.rb`: use external CI/CD tool or Elixir testing

#### \_layouts

Jekyll layouts to convert to Phoenix layouts/templates:

- `default.html`: main Phoenix root layout
- `page.html`, `post.html`: Phoenix templates or function components
- `paginated.html`: Phoenix component with pagination logic
- `reveal-with-fa.html`: defer (part of reveal.js system)

#### \_data files

The `_data` folder contains:

- YAML files (`amphibology.yml`): parse at runtime via the content loader using
  `yaml_elixir`
- BibTeX files (`ben-pubs.bib`): already covered in plan
- CSV files (FoR codes): parse at runtime with a lightweight CSV library
- Ruby/Emacs processing scripts: skip or reimplement if needed

#### Other Jekyll conventions

- **Collections** (`_posts`, `_livecoding`): process as markdown files at
  runtime via the Ash loader
- **Front matter**: already covered with `yaml_elixir`
- **Liquid tags/filters**: replace as per Jekyll tag migration section above
- **Pagination**: implement with Ash read actions
- **Site variables** (`site.baseurl`, `site.title`): runtime config stored in
  `Application` env
- **Data files access**: runtime parsing into `Ash.DataLayer.Ets`

#### Items to ignore

- `_browserify/` and `_cljs/`: ClojureScript projects, handle manually later
- `_site/`: Jekyll build output, not needed
- Ruby-specific config (`Gemfile`, `Gemfile.lock`): remove after migration

## Detailed Implementation Plan

### Architecture Overview

The new Elixir/Ash website will rely on runtime ingestion backed by
`Ash.DataLayer.Ets`, avoiding a traditional database while still letting Ash
manage querying and actions. Markdown is parsed with MDEx when the app boots (or
when the loader reloads), and the rendered HTML is cached in ETS for fast
access.

### 1. Runtime Content Loader

#### Live Markdown Ingestion

Content is loaded at application boot (and reloadable on demand) instead of
being baked into the BEAM. The loader scans the markdown directories, parses
frontmatter with `YamlElixir`, renders HTML via MDEx, and bulk-upserts rows into
an Ash resource backed by `Ash.DataLayer.Ets`.

```elixir
# lib/blog/content/loader.ex
defmodule Blog.Content.Loader do
  alias Blog.Post

  @posts_dir "priv/content/posts"
  @pages_dir "priv/content/pages"
  @content_dirs [@posts_dir, @pages_dir]

  def load_all(opts \\ []) do
    include_drafts? = Keyword.get(opts, :include_drafts?, include_drafts?())

    @content_dirs
    |> collect_markdown_files()
    |> Task.async_stream(&build_entry/1, ordered: false, max_concurrency: System.schedulers_online())
    |> Stream.filter(&match?({:ok, _}, &1))
    |> Stream.map(fn {:ok, entry} -> entry end)
    |> reject_drafts(include_drafts?)
    |> upsert_posts()
  end

  def reload, do: load_all(force?: true)

  defp build_entry(path) do
    with {:ok, file} <- File.read(path),
         {:ok, frontmatter, markdown} <- parse_frontmatter(file) do
      {:ok,
       %{
         slug: extract_slug_from_path(path),
         source_path: path,
         title: frontmatter["title"],
         date: parse_date(frontmatter["date"]),
         tags: frontmatter["tags"] || [],
         draft?: frontmatter["draft"] || false,
         frontmatter: frontmatter,
         raw_markdown: markdown,
         compiled_html: MDEx.to_html!(markdown, extension: [table: true, strikethrough: true]),
         excerpt: generate_excerpt(markdown),
         word_count: count_words(markdown),
         reading_time: calculate_reading_time(markdown)
       }}
    end
  end
```

`collect_markdown_files/1`, `parse_frontmatter/1`, and the helper functions for
slug, excerpt, etc. live in dedicated modules so they can be reused in tests.
`load_all/1` is called from the application supervisor (see the architecture
section) so deploys and restarts always refresh the ETS-backed resource.

#### Ash Backed Storage

`Blog.Post` uses `Ash.DataLayer.Ets`, so the values emitted by the loader are
inserted via normal Ash changesets. Ash manages the ETS lifecycle and keeps
queries fast without us reaching into ETS directly.

```elixir
defp upsert_posts(entries) do
  entries
  |> Enum.map(fn entry ->
    Post
    |> Ash.Changeset.for_create(:from_loader, entry)
  end)
  |> Ash.bulk_create(timeout: :infinity, return_records?: false)
end
```

Define a custom `:from_loader` create action that sets `upsert?: true` so
reloads replace existing rows based on `slug`. Because we store both
`raw_markdown` and `compiled_html`, future LiveView widgets can choose whichever
representation they need without reparsing.

#### Draft and Environment Handling

Since everything happens at runtime, any environment-specific logic stays
dynamic. `include_drafts?/0` checks
`Application.get_env(:blog, :show_drafts, false)`, and the Ash read actions
apply additional filters when necessary (e.g. hide drafts for anonymous
visitors). No recompilation is required to toggle the flag.

#### Hot Reloads & Watcher

Dev mode wires the [`file_system`](https://hex.pm/packages/file_system) watcher
to call `Blog.Content.Loader.reload/0` whenever a markdown file changes. The
reloader clears the Ash table with `Ash.bulk_destroy` (or a truncate helper) and
re-runs `load_all/1`, keeping the feedback loop tight without restarts.

### 2. Ash Resources with Manual Actions

#### Blog Post Resource

```elixir
# lib/blog/resources/post.ex
defmodule Blog.Post do
  use Ash.Resource,
    domain: Blog,
    data_layer: Ash.DataLayer.Ets

  ets do
    private? true
    write_concurrency? true
  end

  attributes do
    uuid_primary_key :id, writable?: false
    attribute :slug, :string, allow_nil?: false
    attribute :title, :string, allow_nil?: false
    attribute :date, :date, allow_nil?: false
    attribute :tags, {:array, :string}, default: []
    attribute :draft?, :boolean, default: false
    attribute :frontmatter, :map
    attribute :raw_markdown, :string
    attribute :compiled_html, :string
    attribute :excerpt, :string
    attribute :word_count, :integer
    attribute :reading_time, :integer
    attribute :source_path, :string
  end

  identities do
    identity :by_slug, [:slug]
  end

  actions do
    defaults [:read]

    create :from_loader do
      accept [:slug, :title, :date, :tags, :draft?, :frontmatter, :raw_markdown,
              :compiled_html, :excerpt, :word_count, :reading_time, :source_path]
      upsert? true
      upsert_identity :by_slug
    end

    read :by_slug do
      argument :slug, :string, allow_nil?: false
      get? true
      prepare build(fn query, %{arguments: %{slug: slug}} ->
        Ash.Query.filter(query, slug == ^slug)
      end)
    end

    read :by_tag do
      argument :tag, :string, allow_nil?: false
      prepare build(fn query, %{arguments: %{tag: tag}} ->
        Ash.Query.filter(query, ^tag in tags and draft? == false)
      end)
    end

    read :recent do
      argument :limit, :integer, default: 10
      prepare fn query, %{arguments: %{limit: limit}} ->
        query
        |> Ash.Query.filter(draft? == false)
        |> Ash.Query.sort(date: :desc)
        |> Ash.Query.limit(limit)
      end
    end

    read :drafts do
      prepare fn query, _ ->
        Ash.Query.filter(query, draft? == true)
      end
    end
  end

  code_interface do
    define :get_by_slug, args: [:slug], action: :by_slug
    define :list_by_tag, args: [:tag], action: :by_tag
    define :recent, args: [:limit]
  end
end
```

#### Manual Search Action

```elixir
# lib/blog/actions/posts/search.ex
defmodule Blog.Actions.Posts.Search do
  use Ash.Resource.ManualRead

  alias Ash.Query

  def read(%{arguments: %{query: query}} = ash_query, _opts, _context) do
    results =
      Blog.Post
      |> Query.filter(draft? == false)
      |> Blog.Repo.read!()
      |> Enum.filter(&matches_query?(&1, query))
      |> Enum.map(&maybe_highlight_excerpt(&1, query))
      |> paginate(ash_query)

    {:ok, results}
  end

  defp matches_query?(post, query) do
    downcased = String.downcase(query)

    String.contains?(String.downcase(post.title), downcased) or
      String.contains?(String.downcase(post.raw_markdown), downcased) or
      Enum.any?(post.tags, &String.contains?(String.downcase(&1), downcased))
  end

  defp maybe_highlight_excerpt(post, query) do
    case build_highlight(post.raw_markdown, query) do
      nil -> post
      html_excerpt -> %{post | excerpt: html_excerpt}
    end
  end

  defp build_highlight(markdown, query) do
    regex = ~r/.{0,120}#{Regex.escape(query)}.{0,120}/i

    case Regex.run(regex, markdown) do
      nil ->
        nil

      [match | _] ->
        match
        |> String.replace(query, "<mark>#{query}</mark>", global: false)
        |> MDEx.to_html!()
    end
  end

  defp paginate(results, ash_query) do
    page = Map.get(ash_query, :page, 1)
    limit = Map.get(ash_query, :limit, 10)

    results
    |> Enum.chunk_every(limit)
    |> Enum.at(page - 1, [])
  end
end
```

### 3. Phoenix Integration

This iteration leans fully into LiveView for rendering---there's no static
fallback, and I'm fine with the pages serving blank content if a reader disables
JS. We'll document that behaviour in the release notes.

#### LiveView Controllers

```elixir
# lib/blog_web/live/post_live/show.ex
defmodule BlogWeb.PostLive.Show do
  use BlogWeb, :live_view

  @impl true
  def mount(%{"slug" => slug}, _session, socket) do
    case Blog.Post.get_by_slug(slug) do
      {:ok, post} ->
        {:ok,
         socket
         |> assign(:post, post)
         |> assign(:page_title, post.title)
         |> assign(:meta_tags, build_meta_tags(post))}

      {:error, _} ->
        {:ok,
         socket
         |> put_flash(:error, "Post not found")
         |> redirect(to: ~p"/posts")}
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <article class="prose prose-lg mx-auto">
      <header>
        <h1><%= @post.title %></h1>
        <div class="text-base-content/60">
          <time datetime={@post.date}><%= format_date(@post.date) %></time>
          · <%= @post.reading_time %> min read
        </div>
      </header>

      <div class="mt-8">
        <%= raw(@post.compiled_html) %>
      </div>

      <footer class="mt-8">
        <div class="flex gap-2">
          <.link :for={tag <- @post.tags}
                 navigate={~p"/posts/tag/#{tag}"}
                 class="badge badge-primary">
            <%= tag %>
          </.link>
        </div>
      </footer>
    </article>
    """
  end
end
```

### 4. BibTeX Integration

BibTeX files follow the same runtime ingestion pattern:

```elixir
# lib/blog/bibliography/loader.ex
defmodule Blog.Bibliography.Loader do
  @bib_file "priv/content/bibliography.bib"

  def load_all do
    @bib_file
    |> File.read!()
    |> BibtexParser.parse()
    |> case do
      {:ok, entries} ->
        entries
        |> Enum.map(&transform_entry/1)
        |> Enum.map(&Ash.Changeset.for_create(Blog.Citation, :from_loader, &1))
        |> Ash.bulk_create(timeout: :infinity, return_records?: false)

      {:error, reason} ->
        {:error, {:invalid_bib, reason}}
    end
  end

  defp transform_entry(entry) do
    %{
      key: entry.key,
      type: entry.type,
      title: clean_latex(entry.fields["title"]),
      authors: format_authors(entry.fields["author"]),
      year: entry.fields["year"],
      url: entry.fields["url"],
      doi: entry.fields["doi"],
      journal: entry.fields["journal"],
      booktitle: entry.fields["booktitle"],
      raw: entry
    }
  end

  defp clean_latex(text) when is_binary(text) do
    text
    |> String.replace(~r/[{}]/, "")
    |> String.replace(~r/\\"/, "")
  end
  defp clean_latex(_), do: nil

  defp format_authors(authors) when is_binary(authors) do
    authors
    |> String.split(" and ")
    |> Enum.map(&String.trim/1)
  end
  defp format_authors(_), do: []
end
```

`Blog.Citation` mirrors the post resource with `Ash.DataLayer.Ets`, a
`from_loader` create action, and read actions for filtering by year or type.
Because the loader lives in the supervision tree, BibTeX edits can be reloaded
without redeploying; the dev watcher listens for changes to the `.bib` file as
well.

### 5. Development & Deployment Considerations

#### Environment Configuration

```elixir
# config/dev.exs
config :blog,
  show_drafts: true,
  content_dirs: ["priv/content", "test/fixtures/content"]

# config/runtime.exs
config :blog,
  show_drafts: System.get_env("SHOW_DRAFTS", "false") == "true"
```

#### Deployment Process

1. **Boot-Time Sync**: `Blog.Content.Loader.load_all/1` runs from the
   application supervisor so every deploy refreshes ETS from disk.
2. **Releases**: Ship markdown and BibTeX assets alongside the release in
   `priv/content`; no recompilation step is required when the files change.
3. **Content Refresh**: Provide `mix blog.reload` (delegating to
   `Blog.Content.Loader.reload/0`) for prod consoles and CI smoke tests so you
   can pull new posts without a full release if needed.
4. **Dev Experience**: `file_system` watcher triggers reloads automatically; the
   Vite/Tailwind watchers continue to run separately.

#### Testing Strategy

```elixir
# test/blog/migration_test.exs
defmodule Blog.MigrationTest do
  use ExUnit.Case

  @jekyll_sitemap "test/fixtures/jekyll-sitemap.xml"

  test "all Jekyll URLs return 200 or proper redirects" do
    sitemap_urls = parse_sitemap(@jekyll_sitemap)

    for url <- sitemap_urls do
      conn = get(build_conn(), url)
      assert conn.status in [200, 301]
    end
  end

  test "site crawler finds no broken internal links" do
    crawl_results = Blog.LinkChecker.crawl(~p"/")

    assert Enum.empty?(crawl_results.broken_links)
    assert crawl_results.checked_count > 0
  end
end
```

### 6. Future Enhancements

While not part of the initial implementation, the architecture supports:

1. **Analytics**: Add view counting using ETS counters or Oban jobs
2. **Comments**: Could add LiveView-powered comments without a database
3. **Admin Interface**: LiveView admin for content preview (dev only)
4. **RSS/Atom**: Generate feeds on demand from the ETS store
5. **Search Enhancement**: Add full-text search with pre-built indices

### Notes

- Runtime ingestion keeps deploys lean while still letting us reuse MDEx and Ash
- Content changes can be reloaded without rebuilding the release
- Memory usage scales linearly with content amount (still fine given expected
  post size)
- Phoenix LiveView remains the primary rendering path (JS required for readers)

### 7. Implementation Checklist

#### Initial Phoenix Setup

```bash
# Create new Phoenix app with no database
mix phx.new blog --no-ecto --live
cd blog

# Add dependencies to mix.exs
{:ash, "~> 3.0"},
{:mdex, "~> 0.1"},
{:yaml_elixir, "~> 2.9"},
{:bibtex_parser, "~> 0.1.0"}

# Install with igniter where possible
mix igniter.install ash
```

#### Directory Structure

```
priv/
  content/
    posts/
      2024/
        01-15-my-first-post.md
        02-20-another-post.md
    pages/
      about.md
      research.md
    bibliography.bib
  static/
    images/
    downloads/
    robots.txt
```

#### Markdown Frontmatter Format

```yaml
---
title: "My Blog Post Title"
date: 2024-01-15
tags: [elixir, phoenix, web]
draft: false # Optional, defaults to false
excerpt: "Optional custom excerpt"
---
Post content here...
```

#### Helper Functions to Implement

```elixir
# lib/blog/content/frontmatter.ex
defmodule Blog.Content.Frontmatter do
  def parse(file_content) do
    case String.split(file_content, ~r/^---$/m, parts: 3) do
      ["", frontmatter, content] ->
        {:ok, YamlElixir.read_from_string!(frontmatter), String.trim(content)}
      _ ->
        {:ok, %{}, file_content}
    end
  end
end

# lib/blog/content/helpers.ex
defmodule Blog.Content.Helpers do
  def extract_slug_from_path(path) do
    path
    |> Path.basename(".md")
    |> String.replace(~r/^\d{4}-\d{2}-\d{2}-/, "")
  end

  def generate_excerpt(markdown, length \\ 160) do
    markdown
    |> String.replace(~r/^#.*$/m, "")
    |> String.replace(~r/\[([^\]]+)\]\([^\)]+\)/, "\\1")
    |> String.replace(~r/[*_`]/, "")
    |> String.trim()
    |> String.slice(0, length)
    |> Kernel.<>("...")
  end

  def count_words(text) do
    text
    |> String.split(~r/\s+/)
    |> length()
  end

  def calculate_reading_time(text, wpm \\ 200) do
    ceil(count_words(text) / wpm)
  end
end
```

#### Route Configuration

```elixir
# lib/blog_web/router.ex
scope "/", BlogWeb do
  pipe_through :browser

  live "/", HomeLive.Index, :index
  live "/posts", PostLive.Index, :index
  live "/posts/:slug", PostLive.Show, :show
  live "/posts/tag/:tag", PostLive.Index, :tag
  live "/search", SearchLive.Index, :index
  live "/:page", PageLive.Show, :show  # For static pages like /about
end
```

#### Phoenix 1.8 Specific Setup

```elixir
# assets/tailwind.config.js
module.exports = {
  content: [
    "./js/**/*.js",
    "../lib/*_web.ex",
    "../lib/*_web/**/*.*ex"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),  // For prose styling
    require("daisyui")
  ],
  daisyui: {
    themes: ["light", "dark"],  // Enable theme switching
  },
}
```

#### SEO Meta Tags

```elixir
# lib/blog_web/components/layouts/root.html.heex
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="csrf-token" content={get_csrf_token()} />

  <%= if assigns[:meta_tags] do %>
    <meta name="description" content={@meta_tags.description} />
    <meta property="og:title" content={@meta_tags.title} />
    <meta property="og:description" content={@meta_tags.description} />
    <meta property="og:type" content={@meta_tags.type || "website"} />
    <meta name="twitter:card" content="summary" />
  <% end %>

  <.live_title suffix=" · Ben Swift">
    <%= assigns[:page_title] || "Ben Swift" %>
  </.live_title>

  <link phx-track-static rel="stylesheet" href={~p"/assets/app.css"} />
  <script defer phx-track-static type="text/javascript" src={~p"/assets/app.js"}>
  </script>
</head>
```

#### Implementation Tasks

- [ ] Generate Phoenix project and clean out unused assets
- [ ] Set up Ash with `Blog` domain and `Blog.Post` resource
- [ ] Implement `Blog.Content.Loader` with runtime ingestion and MDEx rendering
- [ ] Wire loader under supervision and expose `Blog.Content.Loader.reload/0`
- [ ] Add `file_system` watcher for dev-time reloads
- [ ] Build `Blog.LinkChecker` helper and CLI hook for sitemap/link tests
- [ ] Implement LiveView components and layouts (Tailwind + daisyUI)
- [ ] Port BibTeX ingestion via `Blog.Bibliography.Loader` and `Blog.Citation`
- [ ] Migrate `_includes` to Phoenix components
- [ ] Migrate `_layouts` to Phoenix layouts/templates
- [ ] Implement search LiveView backed by manual Ash action
- [ ] Document the JS-required behaviour in release notes
