#!/usr/bin/env bash

cd _highlight.js
node tools/build.js --target browser --no-compress armasm bash clojure cmake cpp cs css diff dockerfile glsl go haskell http java javascript json julia llvm makefile markdown objectivec pgsql processing python r ruby rust scala scheme scss shell sql tex typescript yaml xtlang

cd -
cp _highlight.js/build/highlight.pack.js assets/js
