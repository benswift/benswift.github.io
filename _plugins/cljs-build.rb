# build all the clojurescript projects in _cljs/
#
# since they might use different build processes, it actually just calls make in
# each subdirectory (so yeah, there's actually nothing cljs-specific about it)

def build_cljs_projects(site)
  Dir.foreach("_cljs") do |project_dir|
    next if project_dir == '.' or project_dir == '..'
    Dir.chdir("_cljs/#{project_dir}"){
      system("make", "--silent", "all") or raise "cljs build error in #{project_dir}"
    }
  end
end

Jekyll::Hooks.register :site, :pre_render do |site|
  build_cljs_projects site
end
