SRCFILE=src/algorithmic_billboard/core.cljs
OUTFILE=../../assets/js/algorithmic-billboard.js

all: $(OUTFILE)

$(OUTFILE): $(SRCFILE) deps.edn build.edn
	clojure --main cljs.main --compile-opts build.edn --compile

.PHONY: clean
clean:
	rm $(outfile)
