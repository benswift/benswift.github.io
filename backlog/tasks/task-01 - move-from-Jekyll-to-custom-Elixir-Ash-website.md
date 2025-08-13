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

- keep the blog posts and other "web content" md files as-is, and wrap them in a
  custom Ash resource/action which used MDEx to convert them on the fly in
  response to requests
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

Additionally, google pagespeed insights and a11y would need to be part of the
tests as well---that stuff has been a priority for the jeykll site, and should
continue to be so going forward.

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

Part of the migration should be removing the Jekyll (i.e. Ruby) tags and filters in the md files and replacing them with (in order of preference):

- custom HTML elements, as per https://deanebarker.net/tech/blog/custom-elements-markdown/
- replace with normal HTML (if it's not too messy)
- investigate if MDEx allows for Elixir-style compile-time filters

### Jekyll-specific parts migration strategy

#### _includes files

The `_includes` folder contains reusable HTML snippets used throughout the site. Migration approach:

- **Layout partials** (`head.html`, `header.html`, `footer.html`): convert to Phoenix components in `lib/blog_web/components/`
- **Analytics/tracking** (`analytics.html`, `anchorjs.html`, `hljs.html`): convert to Phoenix hooks or components
- **Content helpers** (`cc-link.html`, `picture.html`, `qrcode.html`, `youtube.html`, `toc.html`, `taglist.html`): convert to Phoenix function components
- **Slide components** (`slides/*.html`): defer migration (see reveal.js section below)
- **Markdown includes** (`blurbs/I-am-paragraphs.md`): convert to Elixir functions that return compiled HTML

#### _talks and reveal.js presentations

The `_talks` folder contains reveal.js-powered markdown presentations that heavily use Jekyll includes. Migration approach:

- **Short-term**: do not attempt to port the reveal.js system initially
- **Options**:
  - export all presentations as static HTML files and serve them statically
  - keep the reveal.js infrastructure separate from the main Phoenix app
  - potentially integrate reveal.js later as a separate LiveView component if needed
- **Note**: these presentations use `{% include slides/*.html %}` tags extensively which would need custom handling

#### _plugins

Custom Jekyll plugins that need Elixir equivalents:

- `biblist.rb` & `livecoding-bib.rb`: already covered with `bibtex_parser` in the plan
- `browserify.rb` & `cljs-build.rb`: skip (ClojureScript build system, handle manually if needed)
- `revealify.rb`: skip (part of reveal.js system)
- `jekyll-git-hash.rb`: implement as compile-time function using `:os.cmd/1`
- `htmlproofer.rb`: use external CI/CD tool or Elixir testing

#### _layouts

Jekyll layouts to convert to Phoenix layouts/templates:

- `default.html`: main Phoenix root layout
- `page.html`, `post.html`: Phoenix templates or function components
- `paginated.html`: Phoenix component with pagination logic
- `reveal-with-fa.html`: defer (part of reveal.js system)

#### _data files

The `_data` folder contains:

- YAML files (`amphibology.yml`): parse at compile time with `yaml_elixir`
- BibTeX files (`ben-pubs.bib`): already covered in plan
- CSV files (FoR codes): parse at compile time with CSV library
- Ruby/Emacs processing scripts: skip or reimplement if needed

#### Other Jekyll conventions

- **Collections** (`_posts`, `_livecoding`): process as markdown files at compile time
- **Front matter**: already covered with `yaml_elixir`
- **Liquid tags/filters**: replace as per Jekyll tag migration section above
- **Pagination**: implement with Ash read actions
- **Site variables** (`site.baseurl`, `site.title`): compile-time config or module attributes
- **Data files access**: compile-time parsing and storage in module attributes

#### Items to ignore

- `_browserify/` and `_cljs/`: ClojureScript projects, handle manually later
- `_site/`: Jekyll build output, not needed
- Ruby-specific config (`Gemfile`, `Gemfile.lock`): remove after migration

## Detailed Implementation Plan

### Architecture Overview

The new Elixir/Ash website will use a compile-time markdown processing approach
with Ash ManualRead actions to serve content without a traditional database. All
markdown files will be compiled to HTML at build time using MDEx, with the
compiled content stored in memory for fast access.

### 1. Content Processing Pipeline

#### Compile-time Markdown Processing

All markdown files will be processed at compile time using Elixir's
`@external_resource` mechanism:

```elixir
# lib/blog/content/compiler.ex
defmodule Blog.Content.Compiler do
  @posts_dir "priv/content/posts"
  @pages_dir "priv/content/pages"

  # Track all markdown files for recompilation
  for dir <- [@posts_dir, @pages_dir] do
    @external_resource dir
  end

  # Process all content at compile time
  def compile_all do
    posts = compile_posts()
    pages = compile_pages()
    %{posts: posts, pages: pages}
  end

  defp compile_posts do
    Path.wildcard("#{@posts_dir}/**/*.md")
    |> Enum.map(&process_markdown_file/1)
    |> Enum.filter(&filter_by_environment/1)
    |> Enum.sort_by(& &1.date, {:desc, Date})
  end

  defp process_markdown_file(path) do
    content = File.read!(path)
    {frontmatter, markdown} = parse_frontmatter(content)

    %{
      slug: extract_slug_from_path(path),
      title: frontmatter["title"],
      date: parse_date(frontmatter["date"]),
      tags: frontmatter["tags"] || [],
      draft: frontmatter["draft"] || false,
      frontmatter: frontmatter,
      raw_markdown: markdown,
      compiled_html: MDEx.to_html!(markdown, extension: [table: true, strikethrough: true]),
      excerpt: generate_excerpt(markdown),
      word_count: count_words(markdown),
      reading_time: calculate_reading_time(markdown),
      file_path: path
    }
  end

  defp filter_by_environment(%{draft: true}) do
    Application.get_env(:blog, :show_drafts, false)
  end
  defp filter_by_environment(_), do: true
end
```

#### In-Memory Storage

Content will be stored in module attributes for zero-latency access:

```elixir
# lib/blog/content/store.ex
defmodule Blog.Content.Store do
  @moduledoc """
  In-memory store for all compiled content.
  Content is compiled at build time and stored as module attributes.
  """

  @content Blog.Content.Compiler.compile_all()
  @posts_by_slug @content.posts |> Enum.map(&{&1.slug, &1}) |> Map.new()
  @posts_by_tag @content.posts |> build_tag_index()

  def all_posts, do: @content.posts
  def all_pages, do: @content.pages

  def get_post(slug), do: Map.get(@posts_by_slug, slug)
  def posts_by_tag(tag), do: Map.get(@posts_by_tag, tag, [])

  def search_posts(query) do
    # Simple in-memory search - could be enhanced with better algorithms
    query_lower = String.downcase(query)

    Enum.filter(@content.posts, fn post ->
      String.contains?(String.downcase(post.title), query_lower) or
      String.contains?(String.downcase(post.raw_markdown), query_lower) or
      Enum.any?(post.tags, &String.contains?(String.downcase(&1), query_lower))
    end)
  end

  defp build_tag_index(posts) do
    Enum.reduce(posts, %{}, fn post, acc ->
      Enum.reduce(post.tags, acc, fn tag, tag_acc ->
        Map.update(tag_acc, tag, [post], &[post | &1])
      end)
    end)
  end
end
```

### 2. Ash Resources with Manual Actions

#### Blog Post Resource

```elixir
# lib/blog/resources/post.ex
defmodule Blog.Post do
  use Ash.Resource,
    domain: Blog,
    data_layer: Ash.DataLayer.Manual

  attributes do
    attribute :slug, :string, primary_key?: true, allow_nil?: false
    attribute :title, :string, allow_nil?: false
    attribute :date, :date, allow_nil?: false
    attribute :tags, {:array, :string}, default: []
    attribute :draft, :boolean, default: false
    attribute :frontmatter, :map
    attribute :raw_markdown, :string
    attribute :compiled_html, :string
    attribute :excerpt, :string
    attribute :word_count, :integer
    attribute :reading_time, :integer
    attribute :file_path, :string
  end

  actions do
    defaults [:read]

    read :by_slug do
      argument :slug, :string, allow_nil?: false
      manual Blog.Actions.Posts.BySlug
      get? true
    end

    read :by_tag do
      argument :tag, :string, allow_nil?: false
      manual Blog.Actions.Posts.ByTag
    end

    read :search do
      argument :query, :string, allow_nil?: false
      manual Blog.Actions.Posts.Search
    end

    read :recent do
      argument :limit, :integer, default: 10
      manual Blog.Actions.Posts.Recent
    end
  end

  code_interface do
    define :get_by_slug, args: [:slug], action: :by_slug
    define :list_by_tag, args: [:tag], action: :by_tag
    define :search, args: [:query]
    define :recent, args: [:limit]
  end
end
```

#### Manual Action Implementations

```elixir
# lib/blog/actions/posts/by_slug.ex
defmodule Blog.Actions.Posts.BySlug do
  use Ash.Resource.ManualRead

  def read(%{arguments: %{slug: slug}}, _opts, _context) do
    case Blog.Content.Store.get_post(slug) do
      nil -> {:error, Ash.Error.Query.NotFound.exception(resource: Blog.Post)}
      post -> {:ok, [struct(Blog.Post, post)]}
    end
  end
end

# lib/blog/actions/posts/search.ex
defmodule Blog.Actions.Posts.Search do
  use Ash.Resource.ManualRead

  def read(%{arguments: %{query: query}} = ash_query, _opts, _context) do
    results =
      Blog.Content.Store.search_posts(query)
      |> Enum.map(&maybe_highlight_excerpt(&1, query))
      |> Enum.map(&struct(Blog.Post, &1))
      |> paginate(ash_query)

    {:ok, results}
  end

  defp maybe_highlight_excerpt(post, query) do
    # For search results, dynamically generate highlighted excerpts
    if should_highlight?(post, query) do
      highlighted_excerpt =
        post.raw_markdown
        |> extract_context_around_match(query)
        |> highlight_matches(query)
        |> MDEx.to_html!()

      %{post | excerpt: highlighted_excerpt}
    else
      post
    end
  end
end
```

### 3. Phoenix Integration

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

Using the `bibtex_parser` package for robust BibTeX parsing:

```elixir
# mix.exs dependencies
{:bibtex_parser, "~> 0.1.0"}

# lib/blog/bibliography/store.ex
defmodule Blog.Bibliography.Store do
  @bib_file "priv/content/bibliography.bib"
  @external_resource @bib_file

  # Parse BibTeX at compile time using bibtex_parser
  @entries @bib_file
           |> File.read!()
           |> BibtexParser.parse()
           |> process_entries()

  def all_entries, do: @entries
  def get_entry(key), do: Enum.find(@entries, &(&1.key == key))

  def entries_by_year do
    @entries
    |> Enum.group_by(& &1.year)
    |> Enum.sort_by(&elem(&1, 0), :desc)
  end

  def entries_by_type(type) do
    Enum.filter(@entries, &(&1.type == type))
  end

  defp process_entries({:ok, entries}) do
    Enum.map(entries, &transform_entry/1)
  end
  defp process_entries({:error, _reason}), do: []

  defp transform_entry(entry) do
    %{
      key: entry.key,
      type: entry.type,
      title: clean_latex(entry.fields["title"]),
      author: format_authors(entry.fields["author"]),
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
    |> String.replace(~r/\{|\}/, "")
    |> String.replace(~r/\\"/, "")
  end
  defp clean_latex(nil), do: nil

  defp format_authors(authors) when is_binary(authors) do
    authors
    |> String.split(" and ")
    |> Enum.map(&String.trim/1)
  end
  defp format_authors(nil), do: []
end

# lib/blog_web/components/citation_helpers.ex
defmodule BlogWeb.CitationHelpers do
  use Phoenix.Component

  def citation_list(assigns) do
    ~H"""
    <div class="space-y-4">
      <article :for={entry <- @entries} class="citation">
        <div class="font-medium">
          <%= entry.title %>
        </div>
        <div class="text-sm text-base-content/70">
          <%= Enum.join(entry.author, ", ") %> · <%= entry.year %>
        </div>
        <div :if={entry.journal} class="text-sm italic">
          <%= entry.journal %>
        </div>
        <div :if={entry.url} class="text-sm">
          <.link href={entry.url} target="_blank" class="link link-primary">
            <%= if entry.doi, do: "DOI: #{entry.doi}", else: "Link" %>
          </.link>
        </div>
      </article>
    </div>
    """
  end
end
```

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

1. **Build Step**: All markdown files are compiled during `mix compile`
2. **Release**: Content is embedded in the release binary
3. **Updates**: New content requires redeployment (automated via CI/CD)
4. **No Hot Reload**: Content changes require restart in production

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

  test "pagespeed scores meet threshold" do
    # Run Lighthouse CI tests
    assert pagespeed_score(:performance) >= 95
    assert pagespeed_score(:accessibility) >= 100
    assert pagespeed_score(:seo) >= 100
  end
end
```

### 6. Future Enhancements

While not part of the initial implementation, the architecture supports:

1. **Analytics**: Add view counting using ETS counters
2. **Comments**: Could add LiveView-powered comments without a database
3. **Admin Interface**: LiveView admin for content preview (dev only)
4. **RSS/Atom**: Generate feeds at compile time
5. **Search Enhancement**: Add full-text search with pre-built indices

### Notes

- This approach trades deployment flexibility for performance and simplicity
- All content is immutable once deployed, ensuring consistency
- Memory usage scales linearly with content amount (not a concern per
  requirements)
- SEO and performance should match or exceed Jekyll due to pre-compilation

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
draft: false  # Optional, defaults to false
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
