## a custom "formatter" for bibliographic date in Better CSL YAML
## e.g. as ouput from Zotero's "Better BibTeX" extension

## TODO this is hacked together---should come clean it up later...

require "yaml"

def format_authors(authors)
  author_spans = authors.map do |a|
    if a["family"] == "Swift"
      "<span><strong>Swift, Ben</strong></span>"
    else
      "<span>#{a['family']}, #{a['given']}</span>"
    end
  end

  author_spans.join(" ")
end

# convert the (more complex) Better CSL YAML hash into a nice, slim hash with just the data we want to display
def csl_to_simple_hash(csl_hash)
  {
    :type => csl_hash["type"],
    :title => csl_hash["title"],
    :venue => csl_hash["container-title"],
    :url => csl_hash["URL"],
    :doi => csl_hash["DOI"],
    :publisher => csl_hash["publisher"],
    :authors => format_authors(csl_hash["author"]),
    :year => Integer(csl_hash["issued"][0]["year"])
  }
end

def format_paper_bib(references)
  fragments = references.map { |r| csl_to_simple_hash r }
  puts fragments
end

Jekyll::Hooks.register :site, :post_render do |site|
  format_paper_bib site.data["ben-pubs"]["references"]
end
