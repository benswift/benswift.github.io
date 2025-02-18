# run browserify to package all the things

def browserify_all(_site)
  Dir.glob('_browserify/*.js') do |filename|
    system('npx', 'browserify', filename, '--outfile',
           "assets/js/#{File.basename(filename)}") or raise "browserify build error in #{filename}"
  end
end

Jekyll::Hooks.register :site, :pre_render do |site|
  browserify_all site
end
