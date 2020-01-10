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

    def render(context)
      output = @bib.each do |b|
        "<li>

<p class='title'><a href='#{b[:url]}'>#{b[:title]}</a></p>

<p>#{b[:author]}</p>

<p>
  <span class='date'>#{b[:year]}</span> @
  <span class='venue'>#{b['container-title']}</span>
</p>

</li>
"
      end
      "<ol class='bibliography'>#{output.join(' ')}</ol>"
    end

  end
end

Liquid::Template.register_tag('bib_list', Jekyll::BibListTag)
