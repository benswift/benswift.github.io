require "yaml"

def write_lc_set_md_files()
  site.data["livecoding-sets"]["references"].each do |lcset|
    a = lcset["issued"][0]
    date = "#{a['year']}-#{format('%02d', a['month'])}-#{format('%02d', a['day'])}"
    filename = "_livecoding-sets/#{date}-#{Jekyll::Utils.slugify(lcset["event"])}.md"

    frontmatter = Hash.new
    frontmatter["date"] = date
    frontmatter["type"] = "gig"
    frontmatter["event"] = lcset.fetch("event")
    frontmatter["venue"] = lcset.fetch("event-place")
    frontmatter["curator"] = ""
    frontmatter["artists"] = ["Ben Swift"]
    frontmatter["event_url"] = lcset.fetch("URL", "")
    frontmatter["venue_url"] = ""

    File.write(filename, "#{frontmatter.to_yaml}---\n")
  end
end

# custom bib output
require "bibtex"

def gig_to_bib(gig)

  gig_meta = gig.data
  authors = gig_meta["artists"].join(" and ")
  date = gig_meta['date']

  # return the bib entry data structure
  BibTeX::Entry.new(
    {
      :bibtex_type => :misc,
      :title => gig_meta['event'],
      :author => authors,
      :editor => gig_meta['curator'],
      :howpublished => gig_meta['venue'],
      :keywords => "livecoding, new media art",
      :publisher => 'The Pragmatic Bookshelf',
      :day => date.strftime('%d'),
      :month => date.strftime('%b'),
      :year => date.strftime('%Y')
    })
end

def write_livecoding_bibliography(gigs)
  bib = BibTeX::Bibliography.new
  bib = gigs.map { |gig| gig_to_bib gig }
  puts bib
end

Jekyll::Hooks.register :site, :post_render do |site|
  # write_livecoding_bibliography site.collections["livecoding"].docs
end
