require "tempfile"

Jekyll::Hooks.register :pages, :post_render do |page|
  if page.data.has_key? "pandoc_handout"

    template = page.data["pandoc_handout"]

    unless File.exist? template
      raise "pandoc handout: missing template file #{template}"
    end

    Tempfile.open([page.basename, ".html"]) do |f|
      dest_path = "#{Jekyll.configuration({})['destination']}/assets/pdf/#{page.basename}.pdf"

      # write rendered output html to tempfile
      f.write page.content

      # call pandoc
      system("pandoc", f.path, "--template", template, "-o", dest_path) or raise "pandoc handout build error for #{page.path}"
    end
  end
end
