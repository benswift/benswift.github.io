# frozen_string_literal: true

require 'html-proofer'

Jekyll::Hooks.register :site, :post_write do |site|
  HTMLProofer.check_directory(site.config['destination'], {
                                ignore_urls: [%r{^http://localhost:4000/}],
                                enforce_https: true,
                                check_html: true,
                                validation: {
                                  report_eof_tags: true,
                                  report_invalid_tags: true,
                                  report_mismatched_tags: true,
                                  report_missing_doctype: true,
                                  report_missing_names: true
                                },
                                check_img_http: true,
                                disable_external: true # change to false for a thorough check, but takes ages
                              }).run
end
