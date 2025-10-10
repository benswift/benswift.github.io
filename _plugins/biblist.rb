# frozen_string_literal: true

require 'fileutils'
require 'bibtex'

def conjoin_names(names)
  if names.length <= 2
    names.join(' and ')
  else
    "#{names.first(names.length - 2).join(', ')}, #{names.last(2).join(' and ')}"
  end
end

module Jekyll
  class BibListPubsTag < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      # Seriously, don't ever ask me how long it took me to figure out that the
      # text argument was ending up with whitespace attached to it and that
      # the .strip method was required... If you do I'll start to cry.

      # first component of text is the bibfile
      @bib = BibTeX.open("_data/#{text.split.first.strip}")

      # all the other elements (if present) are options
      @options = text.split[1..].map(&:intern)

      @baseurl = Jekyll.configuration({})['baseurl']
    end

    def demunge_better_bibtex(str)
      str.gsub! '{{', ''
      str.gsub! '}}', ''
      str
    end

    def title_span(b)
      link = b[:url]

      if link
        "<span class='title'><a href='#{b[:url]}'>#{demunge_better_bibtex(b[:title])}</a></span>"
      else
        "<span class='title'>#{demunge_better_bibtex(b[:title])}</span> <span class='date'>(to appear)</span>"
      end
    end

    def author_p(b)
      author_spans = b[:author]
                     .map { |author| "#{author.first} #{author.last}" }
                     .map { |name| name == 'Ben Swift' ? '<strong>Ben Swift</strong>' : name }
                     .map { |name| "<span class='author'>#{name}</span>" }
      "<p>by #{conjoin_names(author_spans)}</p>"
    end

    def bib_year(b)
      # a bit gross, but it'll do until I figure out how to get better BibLaTeX
      # to output dates consistently
      Date.strptime(b[:date], '%Y').year
    end

    def venue_span(b)
      venue_title = case b.type
                    when :article
                      "#{b[:journaltitle]} #{b[:volume]}(#{b[:number]})"
                    when :inproceedings
                      b[:booktitle]
                    when :incollection
                      "#{b[:booktitle]} (#{b[:publisher]})"
                    else
                      raise "Unknown type #{b.type}"
                    end
      "<span class='venue'>#{demunge_better_bibtex(venue_title)}</span>"
    end

    def doi_p(b)
      doi = b[:doi]

      if doi
        "<p>doi: <a href='https://doi.org/#{doi}'>#{doi}</a></p>"
      else
        # puts "no DoI for #{b.key}"
        ''
      end
    end

    def preprint_a(b)
      pdf_filename = b[:file]

      if pdf_filename
        "(<a href='#{@baseurl}/assets/documents/preprints/#{File.basename(pdf_filename)}'>pdf</a>)"
      else
        ''
      end
    end

    def render_bibitem(b)
      "<div>

<p class='pubitem' id='#{b.key}'>#{title_span(b)} <span class='date'>(#{bib_year(b)})</span></p>

#{author_p(b)}

<p>in #{venue_span(b)} #{preprint_a(b)}</p>

#{doi_p(b)}

</div>
"
    end

    def render_bib_year(year)
      output = @bib.query("@entry[year=#{year}]").map { |b| render_bibitem b }
      "<div class='bibliography'>#{output.join(' ')}</div>"
    end

    def render(_context)
      years = @bib.map { |b| bib_year b }.uniq.sort.reverse!

      if @options.include? :year_links
        year_links = years.map do |year|
          "<a href='##{year}-pubs'>#{year}</a>"
        end.join(' | ')
        "<p>#{year_links}</p>" + years.map do |year|
          "<h3 id='#{year}-pubs'>#{year}</h3>" + render_bib_year(year)
        end.join("\n")
      else
        years.map do |year|
          render_bib_year(year)
        end.join("\n")
      end
    end
  end

  class BibListGigsTag < Liquid::Tag
    def initialize(tag_name, bib_file, tokens)
      super
      @gigs = Jekyll.sites.first.collections['livecoding'].docs.map(&:data).select do |gig|
        gig['type'] == 'curated' and !gig['hidden']
      end
      @baseurl = Jekyll.configuration({})['baseurl']
    end

    def title_span(g)
      event_url = g['event_url']
      if event_url
        "<span class='title'><a href='#{event_url}'>#{g['title']}</a></span>"
      else
        "<span class='title'>#{g['title']}</span>"
      end
    end

    def artist_p(g)
      artist_spans = g['artists']
                     .map { |name| name == 'Ben Swift' ? '<strong>Ben Swift</strong>' : name }
                     .map { |name| "<span class='author'>#{name}</span>" }
      curator_spans = g['curators'].map { |name| "<span class='author'>#{name}</span>" }

      "<p>featuring #{conjoin_names(artist_spans)}, curated by #{conjoin_names(curator_spans)}</p>"
    end

    def venue_span(g)
      pretty_date = g['date'].strftime("%d %b '%y")
      "<span class='venue'>#{pretty_date} @ <a href=\"#{g['venue_url'] || '#'}\">#{g['venue']}</a></span>"
    end

    def video_a(g)
      video = g['video_url']

      if video
        "(<a href='#{video}'>video</a>)"
      else
        ''
      end
    end

    def render_gigitem(g)
      "<div>

<p class='title pubitem' id='#{Jekyll::Utils.slugify(g['title'])}'>#{title_span(g)} <span class='date'>(#{g['date'].year})</span></p>

#{artist_p(g)}

<p>#{venue_span(g)} #{video_a(g)}</p>

</div>
"
    end

    def render_gig_year(year)
      output = @gigs.select { |g| g['date'].year == year }.map { |g| render_gigitem g }
      "<h3 id='#{year}-gigs'>#{year}</h3><div class='bibliography'>#{output.join(' ')}</div>"
    end

    def render(_context)
      years = @gigs.map { |g| g['date'].year }.uniq.sort.reverse!
      year_links = years.map do |year|
        "<a href='##{year}-gigs'>#{year}</a>"
      end.join(' | ')
      "<p>#{year_links}</p>" + years.map { |year| render_gig_year year }.join("\n")
    end
  end
end

Liquid::Template.register_tag('bib_list_pubs', Jekyll::BibListPubsTag)
Liquid::Template.register_tag('bib_list_gigs', Jekyll::BibListGigsTag)

def copy_preprint_pdfs(_site)
  # this is a bit gross - relies on hardcoded path to bib file (whereas the tag
  # above allows specifying a bib file name in tag)

  bib = BibTeX.open('_data/ben-pubs.bib')

  bib.each do |b|
    pdf_filename = b[:file]
    if pdf_filename&.end_with?('.pdf')
      dest = "assets/documents/preprints/#{File.basename(pdf_filename)}"
      FileUtils.cp(pdf_filename, dest) unless File.exist?(dest)
    end
  end
end

Jekyll::Hooks.register :site, :pre_render do |site|
  copy_preprint_pdfs site
end
