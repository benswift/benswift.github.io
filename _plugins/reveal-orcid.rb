# The MIT License (MIT)

# Copyright (c) 2013 Martin Fenner

# Permission is hereby granted, free of charge, to any person obtaining a copy of
# this software and associated documentation files (the "Software"), to deal in
# the Software without restriction, including without limitation the rights to
# use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
# the Software, and to permit persons to whom the Software is furnished to do so,
# subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
# FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
# COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
# IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
# CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

require 'faraday'
require 'faraday_middleware'

module Jekyll

  FORMATS = ["bib","json","yml"]

  class BibliographyFile < StaticFile
    def initialize(site, base, dir, name)
      @site = site
      @base = base
      @dir = dir
      @name = name

      if site.config['scholar']['orcid']
        url = "http://feed.labs.orcid-eu.org/#{name}"
        response = Faraday.get url
        text = response.status == 200 ? response.body : ""

        if File.extname(name) == ".bib"
          content = <<-eos
---
url: #{url}
---
#{text}
          eos
        else
          content = text
        end

        File.open(self.destination(site.source), File::WRONLY|File::CREAT) { |file| file.write(content) }
      end

      super(site, base, dir, name)
    end
  end

  class BibliographyGenerator < Generator
    safe true
    priority :highest

    def generate(site)
      if site.config['scholar']['orcid']
        dir = site.config['scholar'] ? site.config['scholar']['source'] : "./bibliography"
        FORMATS.each do |format|
          file = BibliographyFile.new(site, site.source, dir, "#{site.config['scholar']['orcid']}.#{format}")
          site.static_files << file if dir.match /^(.*?\/)?[^_]\w*$/
        end
      end
    end
  end

end
