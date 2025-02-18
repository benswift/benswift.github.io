# frozen_string_literal: true

# build all the clojurescript projects in _cljs/
#
# since they might use different build processes, it actually just calls make in
# each subdirectory (so yeah, there's actually nothing cljs-specific about it)

def build_cljs_projects(_site)
  Dir.foreach('_cljs') do |project_dir|
    next if (project_dir == '.') || (project_dir == '..') || !File.directory?(project_dir)

    Dir.chdir("_cljs/#{project_dir}") do
      system('make', '--silent', 'all') or Jekyll.logger.warn "couldn't run make in", project_dir
    end
  end
end

Jekyll::Hooks.register :site, :pre_render do |site|
  build_cljs_projects site
end
