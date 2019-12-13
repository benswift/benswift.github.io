# Jekyll-clojurescript integration

Every subfolder in `_cljs` is a clojurescript "app". Each one contains a
makefile with an `all` target which does the right thing (builds an output js
file, ready to be included in the website through a `<script>` tag).

To glue everything together and make these cljs build steps happen automatically
as part of `jekyll build`, there's a [cljs-build
plugin](../_plugins/cljs-build.rb) which calls `make` in all the subfolders.
