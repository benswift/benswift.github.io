import "./chunk-V6TY7KAL.js";

// node_modules/reveal.js/plugin/math/math.esm.js
var t = () => {
  let t2, e2 = { messageStyle: "none", tex2jax: { inlineMath: [["$", "$"], ["\\(", "\\)"]], skipTags: ["script", "noscript", "style", "textarea", "pre", "code"] }, skipStartupTypeset: true };
  return { id: "mathjax2", init: function(a2) {
    t2 = a2;
    let n = t2.getConfig().mathjax2 || t2.getConfig().math || {}, i = { ...e2, ...n }, s = (i.mathjax || "https://cdn.jsdelivr.net/npm/mathjax@2/MathJax.js") + "?config=" + (i.config || "TeX-AMS_HTML-full");
    i.tex2jax = { ...e2.tex2jax, ...n.tex2jax }, i.mathjax = i.config = null, function(t3, e3) {
      let a3 = document.querySelector("head"), n2 = document.createElement("script");
      n2.type = "text/javascript", n2.src = t3;
      let i2 = () => {
        "function" == typeof e3 && (e3.call(), e3 = null);
      };
      n2.onload = i2, n2.onreadystatechange = () => {
        "loaded" === this.readyState && i2();
      }, a3.appendChild(n2);
    }(s, function() {
      MathJax.Hub.Config(i), MathJax.Hub.Queue(["Typeset", MathJax.Hub, t2.getRevealElement()]), MathJax.Hub.Queue(t2.layout), t2.on("slidechanged", function(t3) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, t3.currentSlide]);
      });
    });
  } };
};
var e = t;
var a = Plugin = Object.assign(e(), { KaTeX: () => {
  let t2, e2 = { version: "latest", delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }, { left: "\\(", right: "\\)", display: false }, { left: "\\[", right: "\\]", display: true }], ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"] };
  const a2 = (t3) => new Promise((e3, a3) => {
    const n = document.createElement("script");
    n.type = "text/javascript", n.onload = e3, n.onerror = a3, n.src = t3, document.head.append(n);
  });
  return { id: "katex", init: function(n) {
    t2 = n;
    let i = t2.getConfig().katex || {}, s = { ...e2, ...i };
    const { local: o, version: l, extensions: r, ...c } = s;
    let d = s.local || "https://cdn.jsdelivr.net/npm/katex", p = s.local ? "" : "@" + s.version, u = d + p + "/dist/katex.min.css", h = d + p + "/dist/contrib/mhchem.min.js", x = d + p + "/dist/contrib/auto-render.min.js", m = [d + p + "/dist/katex.min.js"];
    s.extensions && s.extensions.includes("mhchem") && m.push(h), m.push(x);
    const f = () => {
      renderMathInElement(n.getSlidesElement(), c), t2.layout();
    };
    ((t3) => {
      let e3 = document.createElement("link");
      e3.rel = "stylesheet", e3.href = t3, document.head.appendChild(e3);
    })(u), async function(t3) {
      for (const e3 of t3) await a2(e3);
    }(m).then(() => {
      t2.isReady() ? f() : t2.on("ready", f.bind(this));
    });
  } };
}, MathJax2: t, MathJax3: () => {
  let t2, e2 = { tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]] }, options: { skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"] }, startup: { ready: () => {
    MathJax.startup.defaultReady(), MathJax.startup.promise.then(() => {
      t2.layout();
    });
  } } };
  return { id: "mathjax3", init: function(a2) {
    t2 = a2;
    let n = t2.getConfig().mathjax3 || {}, i = { ...e2, ...n };
    i.tex = { ...e2.tex, ...n.tex }, i.options = { ...e2.options, ...n.options }, i.startup = { ...e2.startup, ...n.startup };
    let s = i.mathjax || "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    i.mathjax = null, window.MathJax = i, function(t3, e3) {
      let a3 = document.createElement("script");
      a3.type = "text/javascript", a3.id = "MathJax-script", a3.src = t3, a3.async = true, a3.onload = () => {
        "function" == typeof e3 && (e3.call(), e3 = null);
      }, document.head.appendChild(a3);
    }(s, function() {
      t2.addEventListener("slidechanged", function(t3) {
        MathJax.typeset();
      });
    });
  } };
} });
export {
  a as default
};
/*! Bundled license information:

reveal.js/plugin/math/math.esm.js:
  (*!
   * This plugin is a wrapper for the MathJax2,
   * MathJax3 and KaTeX typesetter plugins.
   *)
*/
//# sourceMappingURL=reveal__js_plugin_math_math__esm__js.js.map
