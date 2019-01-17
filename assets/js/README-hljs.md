# About the highlight.js + xtlang setup

This is a bit fiddly to set up at present, because
[reasons](https://github.com/highlightjs/highlightjs-xtlang#usage).

The way it's currently done for <https://benswift.me> is that

1. a custom build of highlight.js is produced with

```plaintext
node tools/build.js --target browser --no-compress armasm bash clojure cmake cpp cs css diff dockerfile glsl go haskell http java javascript json julia llvm makefile markdown objectivec pgsql processing python r ruby rust scala scheme scss shell sql tex typescript yaml xtlang
```

2. copy the `highlightjs.pack.js` file into the `assets/js` folder

3. copy the `*.css` file corresponding to your theme of choice into `assets/css`

4. put it all together using the stuff in `_includes/hljs.html`

5. profit?
