require "yaml"

def write_lc_set_md_files()
  site.data["livecoding-sets"]["references"].each do |lcset|
    a = lcset["issued"][0]
    date = "#{a['year']}-#{format('%02d', a['month'])}-#{format('%02d', a['day'])}"
    filename = "_livecoding-sets/#{date}-#{Jekyll::Utils.slugify(lcset["event"])}.md"

    frontmatter = Hash.new
    frontmatter["date"] = date
    frontmatter["event"] = lcset.fetch("event")
    frontmatter["venue"] = lcset.fetch("event-place")
    frontmatter["curator"] = ""
    frontmatter["artists"] = ["Ben Swift"]
    frontmatter["gig_url"] = lcset.fetch("URL", "")
    frontmatter["venue_url"] = ""

    File.write(filename, "#{frontmatter.to_yaml}---\n")
  end
end

Jekyll::Hooks.register :site, :post_render do |site|
  # write_lc_set_md_files
  # site.collections["livecoding"].docs.each { |page|
  #   puts page.data.keys
  # }
end
