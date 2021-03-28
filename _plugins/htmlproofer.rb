require "html-proofer"

Jekyll::Hooks.register :site, :post_write do |site|
  HTMLProofer.check_directory(site.config["destination"], opts = {
                                :check_html => true,
                                :validation => {
                                  :report_eof_tags => true,
                                  :report_invalid_tags => true,
                                  :report_mismatched_tags => true,
                                  :report_missing_doctype => true,
                                  :report_missing_names => true
                                },
                                :check_img_http => true,
                                :disable_external => true # change to false for a thorough check, but takes ages
                              }).run
end
