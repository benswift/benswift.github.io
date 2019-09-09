require "html-proofer"

Jekyll::Hooks.register :site, :post_write do |site|
  HTMLProofer.check_directory(site.config["destination"], opts = {
                                :check_html => true,
                                :check_img_http => true,
                                :disable_external => true,
                                :report_invalid_tags => true,
                                :file_ignore => [/assets\/reveal.js-3.8.0\//]
                              }).run
end
