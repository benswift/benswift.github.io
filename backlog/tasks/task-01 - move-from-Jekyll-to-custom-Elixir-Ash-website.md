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

```elixir
# lib/blog/bibliography/parser.ex
defmodule Blog.Bibliography.Parser do
  @bib_file "priv/content/bibliography.bib"
  @external_resource @bib_file

  # Parse BibTeX at compile time
  @entries parse_bibtex_file(@bib_file)

  def all_entries, do: @entries

  def get_entry(key), do: Enum.find(@entries, &(&1.key == key))

  def entries_by_year do
    @entries
    |> Enum.group_by(& &1.year)
    |> Enum.sort_by(&elem(&1, 0), :desc)
  end

  defp parse_bibtex_file(path) do
    path
    |> File.read!()
    |> String.split(~r/@\w+\{/, trim: true)
    |> Enum.map(&parse_entry/1)
    |> Enum.reject(&is_nil/1)
  end

  defp parse_entry(entry_text) do
    # Basic BibTeX parsing - could be enhanced with a proper parser
    with [key | fields] <- String.split(entry_text, ~r/,\s*\n/),
         key <- String.trim(key, ","),
         fields <- Enum.map(fields, &parse_field/1),
         fields <- Enum.reject(fields, &is_nil/1),
         fields_map <- Map.new(fields) do
      %{
        key: key,
        type: extract_type(entry_text),
        title: fields_map["title"],
        author: fields_map["author"],
        year: fields_map["year"],
        url: fields_map["url"],
        raw: entry_text
      }
    else
      _ -> nil
    end
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
