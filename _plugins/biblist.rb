require 'pathname'
require 'bibtex'

module Jekyll
  class BibListTag < Liquid::Tag

    def initialize(tag_name, bib_file, tokens)
      super
      # Seriously, don't ever ask me how long it took me to figure out that the
      # bib_file argument was ending up with whitespace attached to it and that
      # the .strip method was required... If you do I'll start to cry.
      @bib = BibTeX.open("_data/#{bib_file.strip}")
    end

    def author_p(b)
      "<p>#{b[:author]}</p>".gsub "Swift, Ben", "<strong>Swift, Ben</strong>"
    end

    def year_span(b)
      # a bit gross, but it'll do until I figure out how to get better BibLaTeX to output dates consistently
      year_s = Date.strptime(b[:date], "%Y").year.to_s
      "<span class='date'>#{year_s}</span>"
    end

    def venue_span(b)
      case b.type
      when :article
        "<span class='venue'>#{b[:journaltitle]}</span>"
      when :inproceedings, :incollection
        "<span class='venue'>#{b[:booktitle]}</span>"
      else
        raise "Unknown type #{b.type}"
      end
    end

    def render(context)
      output = @bib.each do |b|
        "<li>

<p class='title'><a href='#{b[:url]}'>#{b[:title]}</a></p>

#{author_p(b)}

<p>#{year_span(b)} @ #{venue_span(b)}</p>

</li>
"
      end
      "<ol class='bibliography'>#{output.join(' ')}</ol>"
    end

  end
end

Liquid::Template.register_tag('bib_list', Jekyll::BibListTag)
