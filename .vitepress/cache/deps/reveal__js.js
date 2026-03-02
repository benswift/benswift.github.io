import {
  __publicField
} from "./chunk-V6TY7KAL.js";

// node_modules/reveal.js/dist/reveal.esm.js
var e = (e2, t2) => {
  for (let i2 in t2) e2[i2] = t2[i2];
  return e2;
};
var t = (e2, t2) => Array.from(e2.querySelectorAll(t2));
var i = (e2, t2, i2) => {
  i2 ? e2.classList.add(t2) : e2.classList.remove(t2);
};
var s = (e2) => {
  if ("string" == typeof e2) {
    if ("null" === e2) return null;
    if ("true" === e2) return true;
    if ("false" === e2) return false;
    if (e2.match(/^-?[\d\.]+$/)) return parseFloat(e2);
  }
  return e2;
};
var a = (e2, t2) => {
  e2.style.transform = t2;
};
var n = (e2, t2) => {
  let i2 = e2.matches || e2.matchesSelector || e2.msMatchesSelector;
  return !(!i2 || !i2.call(e2, t2));
};
var r = (e2, t2) => {
  if ("function" == typeof e2.closest) return e2.closest(t2);
  for (; e2; ) {
    if (n(e2, t2)) return e2;
    e2 = e2.parentNode;
  }
  return null;
};
var o = (e2) => {
  let t2 = (e2 = e2 || document.documentElement).requestFullscreen || e2.webkitRequestFullscreen || e2.webkitRequestFullScreen || e2.mozRequestFullScreen || e2.msRequestFullscreen;
  t2 && t2.apply(e2);
};
var l = (e2) => {
  let t2 = document.createElement("style");
  return t2.type = "text/css", e2 && e2.length > 0 && (t2.styleSheet ? t2.styleSheet.cssText = e2 : t2.appendChild(document.createTextNode(e2))), document.head.appendChild(t2), t2;
};
var d = () => {
  let e2 = {};
  location.search.replace(/[A-Z0-9]+?=([\w\.%-]*)/gi, (t2) => {
    e2[t2.split("=").shift()] = t2.split("=").pop();
  });
  for (let t2 in e2) {
    let i2 = e2[t2];
    e2[t2] = s(unescape(i2));
  }
  return void 0 !== e2.dependencies && delete e2.dependencies, e2;
};
var c = { mp4: "video/mp4", m4a: "video/mp4", ogv: "video/ogg", mpeg: "video/mpeg", webm: "video/webm" };
var h = navigator.userAgent;
var u = /(iphone|ipod|ipad|android)/gi.test(h) || "MacIntel" === navigator.platform && navigator.maxTouchPoints > 1;
var g = /android/gi.test(h);
var v = function(e2) {
  if (e2) {
    var t2 = function(e3) {
      return [].slice.call(e3);
    }, i2 = 3, s2 = [], a2 = null, n2 = "requestAnimationFrame" in e2 ? function() {
      e2.cancelAnimationFrame(a2), a2 = e2.requestAnimationFrame(function() {
        return o2(s2.filter(function(e3) {
          return e3.dirty && e3.active;
        }));
      });
    } : function() {
    }, r2 = function(e3) {
      return function() {
        s2.forEach(function(t3) {
          return t3.dirty = e3;
        }), n2();
      };
    }, o2 = function(e3) {
      e3.filter(function(e4) {
        return !e4.styleComputed;
      }).forEach(function(e4) {
        e4.styleComputed = h2(e4);
      }), e3.filter(u2).forEach(g2);
      var t3 = e3.filter(c2);
      t3.forEach(d2), t3.forEach(function(e4) {
        g2(e4), l2(e4);
      }), t3.forEach(v2);
    }, l2 = function(e3) {
      return e3.dirty = 0;
    }, d2 = function(e3) {
      e3.availableWidth = e3.element.parentNode.clientWidth, e3.currentWidth = e3.element.scrollWidth, e3.previousFontSize = e3.currentFontSize, e3.currentFontSize = Math.min(Math.max(e3.minSize, e3.availableWidth / e3.currentWidth * e3.previousFontSize), e3.maxSize), e3.whiteSpace = e3.multiLine && e3.currentFontSize === e3.minSize ? "normal" : "nowrap";
    }, c2 = function(e3) {
      return 2 !== e3.dirty || 2 === e3.dirty && e3.element.parentNode.clientWidth !== e3.availableWidth;
    }, h2 = function(t3) {
      var i3 = e2.getComputedStyle(t3.element, null);
      return t3.currentFontSize = parseFloat(i3.getPropertyValue("font-size")), t3.display = i3.getPropertyValue("display"), t3.whiteSpace = i3.getPropertyValue("white-space"), true;
    }, u2 = function(e3) {
      var t3 = false;
      return !e3.preStyleTestCompleted && (/inline-/.test(e3.display) || (t3 = true, e3.display = "inline-block"), "nowrap" !== e3.whiteSpace && (t3 = true, e3.whiteSpace = "nowrap"), e3.preStyleTestCompleted = true, t3);
    }, g2 = function(e3) {
      e3.element.style.whiteSpace = e3.whiteSpace, e3.element.style.display = e3.display, e3.element.style.fontSize = e3.currentFontSize + "px";
    }, v2 = function(e3) {
      e3.element.dispatchEvent(new CustomEvent("fit", { detail: { oldValue: e3.previousFontSize, newValue: e3.currentFontSize, scaleFactor: e3.currentFontSize / e3.previousFontSize } }));
    }, p2 = function(e3, t3) {
      return function() {
        e3.dirty = t3, e3.active && n2();
      };
    }, m2 = function(e3) {
      return function() {
        s2 = s2.filter(function(t3) {
          return t3.element !== e3.element;
        }), e3.observeMutations && e3.observer.disconnect(), e3.element.style.whiteSpace = e3.originalStyle.whiteSpace, e3.element.style.display = e3.originalStyle.display, e3.element.style.fontSize = e3.originalStyle.fontSize;
      };
    }, f2 = function(e3) {
      return function() {
        e3.active || (e3.active = true, n2());
      };
    }, y2 = function(e3) {
      return function() {
        return e3.active = false;
      };
    }, b2 = function(e3) {
      e3.observeMutations && (e3.observer = new MutationObserver(p2(e3, 1)), e3.observer.observe(e3.element, e3.observeMutations));
    }, w2 = { minSize: 16, maxSize: 512, multiLine: true, observeMutations: "MutationObserver" in e2 && { subtree: true, childList: true, characterData: true } }, E2 = null, S2 = function() {
      e2.clearTimeout(E2), E2 = e2.setTimeout(r2(2), k2.observeWindowDelay);
    }, R2 = ["resize", "orientationchange"];
    return Object.defineProperty(k2, "observeWindow", { set: function(t3) {
      var i3 = "".concat(t3 ? "add" : "remove", "EventListener");
      R2.forEach(function(t4) {
        e2[i3](t4, S2);
      });
    } }), k2.observeWindow = true, k2.observeWindowDelay = 100, k2.fitAll = r2(i2), k2;
  }
  function A2(e3, t3) {
    var a3 = Object.assign({}, w2, t3), r3 = e3.map(function(e4) {
      var t4 = Object.assign({}, a3, { element: e4, active: true });
      return function(e5) {
        e5.originalStyle = { whiteSpace: e5.element.style.whiteSpace, display: e5.element.style.display, fontSize: e5.element.style.fontSize }, b2(e5), e5.newbie = true, e5.dirty = true, s2.push(e5);
      }(t4), { element: e4, fit: p2(t4, i2), unfreeze: f2(t4), freeze: y2(t4), unsubscribe: m2(t4) };
    });
    return n2(), r3;
  }
  function k2(e3) {
    var i3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    return "string" == typeof e3 ? A2(t2(document.querySelectorAll(e3)), i3) : A2([e3], i3)[0];
  }
}("undefined" == typeof window ? null : window);
var p = class {
  constructor(e2) {
    this.Reveal = e2, this.startEmbeddedIframe = this.startEmbeddedIframe.bind(this);
  }
  shouldPreload(e2) {
    if (this.Reveal.isScrollView()) return true;
    let t2 = this.Reveal.getConfig().preloadIframes;
    return "boolean" != typeof t2 && (t2 = e2.hasAttribute("data-preload")), t2;
  }
  load(e2, i2 = {}) {
    e2.style.display = this.Reveal.getConfig().display, t(e2, "img[data-src], video[data-src], audio[data-src], iframe[data-src]").forEach((e3) => {
      ("IFRAME" !== e3.tagName || this.shouldPreload(e3)) && (e3.setAttribute("src", e3.getAttribute("data-src")), e3.setAttribute("data-lazy-loaded", ""), e3.removeAttribute("data-src"));
    }), t(e2, "video, audio").forEach((e3) => {
      let i3 = 0;
      t(e3, "source[data-src]").forEach((e4) => {
        e4.setAttribute("src", e4.getAttribute("data-src")), e4.removeAttribute("data-src"), e4.setAttribute("data-lazy-loaded", ""), i3 += 1;
      }), u && "VIDEO" === e3.tagName && e3.setAttribute("playsinline", ""), i3 > 0 && e3.load();
    });
    let s2 = e2.slideBackgroundElement;
    if (s2) {
      s2.style.display = "block";
      let t2 = e2.slideBackgroundContentElement, a2 = e2.getAttribute("data-background-iframe");
      if (false === s2.hasAttribute("data-loaded")) {
        s2.setAttribute("data-loaded", "true");
        let n3 = e2.getAttribute("data-background-image"), r2 = e2.getAttribute("data-background-video"), o2 = e2.hasAttribute("data-background-video-loop"), l2 = e2.hasAttribute("data-background-video-muted");
        if (n3) /^data:/.test(n3.trim()) ? t2.style.backgroundImage = `url(${n3.trim()})` : t2.style.backgroundImage = n3.split(",").map((e3) => `url(${((e4 = "") => encodeURI(e4).replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[!'()*]/g, (e5) => `%${e5.charCodeAt(0).toString(16).toUpperCase()}`))(decodeURI(e3.trim()))})`).join(",");
        else if (r2) {
          let e3 = document.createElement("video");
          o2 && e3.setAttribute("loop", ""), (l2 || this.Reveal.isSpeakerNotes()) && (e3.muted = true), u && (e3.muted = true, e3.setAttribute("playsinline", "")), r2.split(",").forEach((t3) => {
            const i3 = document.createElement("source");
            i3.setAttribute("src", t3);
            let s3 = ((e4 = "") => c[e4.split(".").pop()])(t3);
            s3 && i3.setAttribute("type", s3), e3.appendChild(i3);
          }), t2.appendChild(e3);
        } else if (a2 && true !== i2.excludeIframes) {
          let e3 = document.createElement("iframe");
          e3.setAttribute("allowfullscreen", ""), e3.setAttribute("mozallowfullscreen", ""), e3.setAttribute("webkitallowfullscreen", ""), e3.setAttribute("allow", "autoplay"), e3.setAttribute("data-src", a2), e3.style.width = "100%", e3.style.height = "100%", e3.style.maxHeight = "100%", e3.style.maxWidth = "100%", t2.appendChild(e3);
        }
      }
      let n2 = t2.querySelector("iframe[data-src]");
      n2 && this.shouldPreload(s2) && !/autoplay=(1|true|yes)/gi.test(a2) && n2.getAttribute("src") !== a2 && n2.setAttribute("src", a2);
    }
    this.layout(e2);
  }
  layout(e2) {
    Array.from(e2.querySelectorAll(".r-fit-text")).forEach((e3) => {
      v(e3, { minSize: 24, maxSize: 0.8 * this.Reveal.getConfig().height, observeMutations: false, observeWindow: false });
    });
  }
  unload(e2) {
    e2.style.display = "none";
    let i2 = this.Reveal.getSlideBackground(e2);
    i2 && (i2.style.display = "none", t(i2, "iframe[src]").forEach((e3) => {
      e3.removeAttribute("src");
    })), t(e2, "video[data-lazy-loaded][src], audio[data-lazy-loaded][src], iframe[data-lazy-loaded][src]").forEach((e3) => {
      e3.setAttribute("data-src", e3.getAttribute("src")), e3.removeAttribute("src");
    }), t(e2, "video[data-lazy-loaded] source[src], audio source[src]").forEach((e3) => {
      e3.setAttribute("data-src", e3.getAttribute("src")), e3.removeAttribute("src");
    });
  }
  formatEmbeddedContent() {
    let e2 = (e3, i2, s2) => {
      t(this.Reveal.getSlidesElement(), "iframe[" + e3 + '*="' + i2 + '"]').forEach((t2) => {
        let i3 = t2.getAttribute(e3);
        i3 && -1 === i3.indexOf(s2) && t2.setAttribute(e3, i3 + (/\?/.test(i3) ? "&" : "?") + s2);
      });
    };
    e2("src", "youtube.com/embed/", "enablejsapi=1"), e2("data-src", "youtube.com/embed/", "enablejsapi=1"), e2("src", "player.vimeo.com/", "api=1"), e2("data-src", "player.vimeo.com/", "api=1");
  }
  startEmbeddedContent(e2) {
    if (e2) {
      const i2 = this.Reveal.isSpeakerNotes();
      t(e2, 'img[src$=".gif"]').forEach((e3) => {
        e3.setAttribute("src", e3.getAttribute("src"));
      }), t(e2, "video, audio").forEach((e3) => {
        if (r(e3, ".fragment") && !r(e3, ".fragment.visible")) return;
        let t2 = this.Reveal.getConfig().autoPlayMedia;
        if ("boolean" != typeof t2 && (t2 = e3.hasAttribute("data-autoplay") || !!r(e3, ".slide-background")), t2 && "function" == typeof e3.play) {
          if (i2 && !e3.muted) return;
          if (e3.readyState > 1) this.startEmbeddedMedia({ target: e3 });
          else if (u) {
            let t3 = e3.play();
            t3 && "function" == typeof t3.catch && false === e3.controls && t3.catch(() => {
              e3.controls = true, e3.addEventListener("play", () => {
                e3.controls = false;
              });
            });
          } else e3.removeEventListener("loadeddata", this.startEmbeddedMedia), e3.addEventListener("loadeddata", this.startEmbeddedMedia);
        }
      }), i2 || (t(e2, "iframe[src]").forEach((e3) => {
        r(e3, ".fragment") && !r(e3, ".fragment.visible") || this.startEmbeddedIframe({ target: e3 });
      }), t(e2, "iframe[data-src]").forEach((e3) => {
        r(e3, ".fragment") && !r(e3, ".fragment.visible") || e3.getAttribute("src") !== e3.getAttribute("data-src") && (e3.removeEventListener("load", this.startEmbeddedIframe), e3.addEventListener("load", this.startEmbeddedIframe), e3.setAttribute("src", e3.getAttribute("data-src")));
      }));
    }
  }
  startEmbeddedMedia(e2) {
    let t2 = !!r(e2.target, "html"), i2 = !!r(e2.target, ".present");
    t2 && i2 && (e2.target.paused || e2.target.ended) && (e2.target.currentTime = 0, e2.target.play()), e2.target.removeEventListener("loadeddata", this.startEmbeddedMedia);
  }
  startEmbeddedIframe(e2) {
    let t2 = e2.target;
    if (t2 && t2.contentWindow) {
      let i2 = !!r(e2.target, "html"), s2 = !!r(e2.target, ".present");
      if (i2 && s2) {
        let e3 = this.Reveal.getConfig().autoPlayMedia;
        "boolean" != typeof e3 && (e3 = t2.hasAttribute("data-autoplay") || !!r(t2, ".slide-background")), /youtube\.com\/embed\//.test(t2.getAttribute("src")) && e3 ? t2.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*") : /player\.vimeo\.com\//.test(t2.getAttribute("src")) && e3 ? t2.contentWindow.postMessage('{"method":"play"}', "*") : t2.contentWindow.postMessage("slide:start", "*");
      }
    }
  }
  stopEmbeddedContent(i2, s2 = {}) {
    s2 = e({ unloadIframes: true }, s2), i2 && i2.parentNode && (t(i2, "video, audio").forEach((e2) => {
      e2.hasAttribute("data-ignore") || "function" != typeof e2.pause || (e2.setAttribute("data-paused-by-reveal", ""), e2.pause());
    }), t(i2, "iframe").forEach((e2) => {
      e2.contentWindow && e2.contentWindow.postMessage("slide:stop", "*"), e2.removeEventListener("load", this.startEmbeddedIframe);
    }), t(i2, 'iframe[src*="youtube.com/embed/"]').forEach((e2) => {
      !e2.hasAttribute("data-ignore") && e2.contentWindow && "function" == typeof e2.contentWindow.postMessage && e2.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*");
    }), t(i2, 'iframe[src*="player.vimeo.com/"]').forEach((e2) => {
      !e2.hasAttribute("data-ignore") && e2.contentWindow && "function" == typeof e2.contentWindow.postMessage && e2.contentWindow.postMessage('{"method":"pause"}', "*");
    }), true === s2.unloadIframes && t(i2, "iframe[data-src]").forEach((e2) => {
      e2.setAttribute("src", "about:blank"), e2.removeAttribute("src");
    }));
  }
};
var m = ".slides section";
var f = ".slides>section";
var y = ".slides>section.present>section";
var b = /registerPlugin|registerKeyboardShortcut|addKeyBinding|addEventListener|showPreview/;
var w = class {
  constructor(e2) {
    this.Reveal = e2;
  }
  render() {
    this.element = document.createElement("div"), this.element.className = "slide-number", this.Reveal.getRevealElement().appendChild(this.element);
  }
  configure(e2, t2) {
    let i2 = "none";
    e2.slideNumber && !this.Reveal.isPrintView() && ("all" === e2.showSlideNumber || "speaker" === e2.showSlideNumber && this.Reveal.isSpeakerNotes()) && (i2 = "block"), this.element.style.display = i2;
  }
  update() {
    this.Reveal.getConfig().slideNumber && this.element && (this.element.innerHTML = this.getSlideNumber());
  }
  getSlideNumber(e2 = this.Reveal.getCurrentSlide()) {
    let t2, i2 = this.Reveal.getConfig(), s2 = "h.v";
    if ("function" == typeof i2.slideNumber) t2 = i2.slideNumber(e2);
    else {
      "string" == typeof i2.slideNumber && (s2 = i2.slideNumber), /c/.test(s2) || 1 !== this.Reveal.getHorizontalSlides().length || (s2 = "c");
      let a3 = e2 && "uncounted" === e2.dataset.visibility ? 0 : 1;
      switch (t2 = [], s2) {
        case "c":
          t2.push(this.Reveal.getSlidePastCount(e2) + a3);
          break;
        case "c/t":
          t2.push(this.Reveal.getSlidePastCount(e2) + a3, "/", this.Reveal.getTotalSlides());
          break;
        default:
          let i3 = this.Reveal.getIndices(e2);
          t2.push(i3.h + a3);
          let n2 = "h/v" === s2 ? "/" : ".";
          this.Reveal.isVerticalSlide(e2) && t2.push(n2, i3.v + 1);
      }
    }
    let a2 = "#" + this.Reveal.location.getHash(e2);
    return this.formatNumber(t2[0], t2[1], t2[2], a2);
  }
  formatNumber(e2, t2, i2, s2 = "#" + this.Reveal.location.getHash()) {
    return "number" != typeof i2 || isNaN(i2) ? `<a href="${s2}">
					<span class="slide-number-a">${e2}</span>
					</a>` : `<a href="${s2}">
					<span class="slide-number-a">${e2}</span>
					<span class="slide-number-delimiter">${t2}</span>
					<span class="slide-number-b">${i2}</span>
					</a>`;
  }
  destroy() {
    this.element.remove();
  }
};
var E = class {
  constructor(e2) {
    this.Reveal = e2, this.onInput = this.onInput.bind(this), this.onBlur = this.onBlur.bind(this), this.onKeyDown = this.onKeyDown.bind(this);
  }
  render() {
    this.element = document.createElement("div"), this.element.className = "jump-to-slide", this.jumpInput = document.createElement("input"), this.jumpInput.type = "text", this.jumpInput.className = "jump-to-slide-input", this.jumpInput.placeholder = "Jump to slide", this.jumpInput.addEventListener("input", this.onInput), this.jumpInput.addEventListener("keydown", this.onKeyDown), this.jumpInput.addEventListener("blur", this.onBlur), this.element.appendChild(this.jumpInput);
  }
  show() {
    this.indicesOnShow = this.Reveal.getIndices(), this.Reveal.getRevealElement().appendChild(this.element), this.jumpInput.focus();
  }
  hide() {
    this.isVisible() && (this.element.remove(), this.jumpInput.value = "", clearTimeout(this.jumpTimeout), delete this.jumpTimeout);
  }
  isVisible() {
    return !!this.element.parentNode;
  }
  jump() {
    clearTimeout(this.jumpTimeout), delete this.jumpTimeout;
    let e2, t2 = this.jumpInput.value.trim("");
    if (/^\d+$/.test(t2)) {
      const i2 = this.Reveal.getConfig().slideNumber;
      if ("c" === i2 || "c/t" === i2) {
        const i3 = this.Reveal.getSlides()[parseInt(t2, 10) - 1];
        i3 && (e2 = this.Reveal.getIndices(i3));
      }
    }
    return e2 || (/^\d+\.\d+$/.test(t2) && (t2 = t2.replace(".", "/")), e2 = this.Reveal.location.getIndicesFromHash(t2, { oneBasedIndex: true })), !e2 && /\S+/i.test(t2) && t2.length > 1 && (e2 = this.search(t2)), e2 && "" !== t2 ? (this.Reveal.slide(e2.h, e2.v, e2.f), true) : (this.Reveal.slide(this.indicesOnShow.h, this.indicesOnShow.v, this.indicesOnShow.f), false);
  }
  jumpAfter(e2) {
    clearTimeout(this.jumpTimeout), this.jumpTimeout = setTimeout(() => this.jump(), e2);
  }
  search(e2) {
    const t2 = new RegExp("\\b" + e2.trim() + "\\b", "i"), i2 = this.Reveal.getSlides().find((e3) => t2.test(e3.innerText));
    return i2 ? this.Reveal.getIndices(i2) : null;
  }
  cancel() {
    this.Reveal.slide(this.indicesOnShow.h, this.indicesOnShow.v, this.indicesOnShow.f), this.hide();
  }
  confirm() {
    this.jump(), this.hide();
  }
  destroy() {
    this.jumpInput.removeEventListener("input", this.onInput), this.jumpInput.removeEventListener("keydown", this.onKeyDown), this.jumpInput.removeEventListener("blur", this.onBlur), this.element.remove();
  }
  onKeyDown(e2) {
    13 === e2.keyCode ? this.confirm() : 27 === e2.keyCode && (this.cancel(), e2.stopImmediatePropagation());
  }
  onInput(e2) {
    this.jumpAfter(200);
  }
  onBlur() {
    setTimeout(() => this.hide(), 1);
  }
};
var S = (e2) => {
  let t2 = e2.match(/^#([0-9a-f]{3})$/i);
  if (t2 && t2[1]) return t2 = t2[1], { r: 17 * parseInt(t2.charAt(0), 16), g: 17 * parseInt(t2.charAt(1), 16), b: 17 * parseInt(t2.charAt(2), 16) };
  let i2 = e2.match(/^#([0-9a-f]{6})$/i);
  if (i2 && i2[1]) return i2 = i2[1], { r: parseInt(i2.slice(0, 2), 16), g: parseInt(i2.slice(2, 4), 16), b: parseInt(i2.slice(4, 6), 16) };
  let s2 = e2.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (s2) return { r: parseInt(s2[1], 10), g: parseInt(s2[2], 10), b: parseInt(s2[3], 10) };
  let a2 = e2.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d]+|[\d]*.[\d]+)\s*\)$/i);
  return a2 ? { r: parseInt(a2[1], 10), g: parseInt(a2[2], 10), b: parseInt(a2[3], 10), a: parseFloat(a2[4]) } : null;
};
var R = class {
  constructor(e2) {
    this.Reveal = e2;
  }
  render() {
    this.element = document.createElement("div"), this.element.className = "backgrounds", this.Reveal.getRevealElement().appendChild(this.element);
  }
  create() {
    this.element.innerHTML = "", this.element.classList.add("no-transition"), this.Reveal.getHorizontalSlides().forEach((e2) => {
      let i2 = this.createBackground(e2, this.element);
      t(e2, "section").forEach((e3) => {
        this.createBackground(e3, i2), i2.classList.add("stack");
      });
    }), this.Reveal.getConfig().parallaxBackgroundImage ? (this.element.style.backgroundImage = 'url("' + this.Reveal.getConfig().parallaxBackgroundImage + '")', this.element.style.backgroundSize = this.Reveal.getConfig().parallaxBackgroundSize, this.element.style.backgroundRepeat = this.Reveal.getConfig().parallaxBackgroundRepeat, this.element.style.backgroundPosition = this.Reveal.getConfig().parallaxBackgroundPosition, setTimeout(() => {
      this.Reveal.getRevealElement().classList.add("has-parallax-background");
    }, 1)) : (this.element.style.backgroundImage = "", this.Reveal.getRevealElement().classList.remove("has-parallax-background"));
  }
  createBackground(e2, t2) {
    let i2 = document.createElement("div");
    i2.className = "slide-background " + e2.className.replace(/present|past|future/, "");
    let s2 = document.createElement("div");
    return s2.className = "slide-background-content", i2.appendChild(s2), t2.appendChild(i2), e2.slideBackgroundElement = i2, e2.slideBackgroundContentElement = s2, this.sync(e2), i2;
  }
  sync(e2) {
    const t2 = e2.slideBackgroundElement, i2 = e2.slideBackgroundContentElement, s2 = { background: e2.getAttribute("data-background"), backgroundSize: e2.getAttribute("data-background-size"), backgroundImage: e2.getAttribute("data-background-image"), backgroundVideo: e2.getAttribute("data-background-video"), backgroundIframe: e2.getAttribute("data-background-iframe"), backgroundColor: e2.getAttribute("data-background-color"), backgroundGradient: e2.getAttribute("data-background-gradient"), backgroundRepeat: e2.getAttribute("data-background-repeat"), backgroundPosition: e2.getAttribute("data-background-position"), backgroundTransition: e2.getAttribute("data-background-transition"), backgroundOpacity: e2.getAttribute("data-background-opacity") }, a2 = e2.hasAttribute("data-preload");
    e2.classList.remove("has-dark-background"), e2.classList.remove("has-light-background"), t2.removeAttribute("data-loaded"), t2.removeAttribute("data-background-hash"), t2.removeAttribute("data-background-size"), t2.removeAttribute("data-background-transition"), t2.style.backgroundColor = "", i2.style.backgroundSize = "", i2.style.backgroundRepeat = "", i2.style.backgroundPosition = "", i2.style.backgroundImage = "", i2.style.opacity = "", i2.innerHTML = "", s2.background && (/^(http|file|\/\/)/gi.test(s2.background) || /\.(svg|png|jpg|jpeg|gif|bmp|webp)([?#\s]|$)/gi.test(s2.background) ? e2.setAttribute("data-background-image", s2.background) : t2.style.background = s2.background), (s2.background || s2.backgroundColor || s2.backgroundGradient || s2.backgroundImage || s2.backgroundVideo || s2.backgroundIframe) && t2.setAttribute("data-background-hash", s2.background + s2.backgroundSize + s2.backgroundImage + s2.backgroundVideo + s2.backgroundIframe + s2.backgroundColor + s2.backgroundGradient + s2.backgroundRepeat + s2.backgroundPosition + s2.backgroundTransition + s2.backgroundOpacity), s2.backgroundSize && t2.setAttribute("data-background-size", s2.backgroundSize), s2.backgroundColor && (t2.style.backgroundColor = s2.backgroundColor), s2.backgroundGradient && (t2.style.backgroundImage = s2.backgroundGradient), s2.backgroundTransition && t2.setAttribute("data-background-transition", s2.backgroundTransition), a2 && t2.setAttribute("data-preload", ""), s2.backgroundSize && (i2.style.backgroundSize = s2.backgroundSize), s2.backgroundRepeat && (i2.style.backgroundRepeat = s2.backgroundRepeat), s2.backgroundPosition && (i2.style.backgroundPosition = s2.backgroundPosition), s2.backgroundOpacity && (i2.style.opacity = s2.backgroundOpacity);
    const n2 = this.getContrastClass(e2);
    "string" == typeof n2 && e2.classList.add(n2);
  }
  getContrastClass(e2) {
    const t2 = e2.slideBackgroundElement;
    let i2 = e2.getAttribute("data-background-color");
    if (!i2 || !S(i2)) {
      let e3 = window.getComputedStyle(t2);
      e3 && e3.backgroundColor && (i2 = e3.backgroundColor);
    }
    if (i2) {
      const e3 = S(i2);
      if (e3 && 0 !== e3.a) return "string" == typeof (s2 = i2) && (s2 = S(s2)), (s2 ? (299 * s2.r + 587 * s2.g + 114 * s2.b) / 1e3 : null) < 128 ? "has-dark-background" : "has-light-background";
    }
    var s2;
    return null;
  }
  bubbleSlideContrastClassToElement(e2, t2) {
    ["has-light-background", "has-dark-background"].forEach((i2) => {
      e2.classList.contains(i2) ? t2.classList.add(i2) : t2.classList.remove(i2);
    }, this);
  }
  update(e2 = false) {
    let i2 = this.Reveal.getConfig(), s2 = this.Reveal.getCurrentSlide(), a2 = this.Reveal.getIndices(), n2 = null, r2 = i2.rtl ? "future" : "past", o2 = i2.rtl ? "past" : "future";
    if (Array.from(this.element.childNodes).forEach((i3, s3) => {
      i3.classList.remove("past", "present", "future"), s3 < a2.h ? i3.classList.add(r2) : s3 > a2.h ? i3.classList.add(o2) : (i3.classList.add("present"), n2 = i3), (e2 || s3 === a2.h) && t(i3, ".slide-background").forEach((e3, t2) => {
        e3.classList.remove("past", "present", "future");
        const i4 = "number" == typeof a2.v ? a2.v : 0;
        t2 < i4 ? e3.classList.add("past") : t2 > i4 ? e3.classList.add("future") : (e3.classList.add("present"), s3 === a2.h && (n2 = e3));
      });
    }), this.previousBackground && !this.previousBackground.closest("body") && (this.previousBackground = null), n2 && this.previousBackground) {
      let e3 = this.previousBackground.getAttribute("data-background-hash"), t2 = n2.getAttribute("data-background-hash");
      if (t2 && t2 === e3 && n2 !== this.previousBackground) {
        this.element.classList.add("no-transition");
        const e4 = n2.querySelector("video"), t3 = this.previousBackground.querySelector("video");
        if (e4 && t3) {
          const i3 = e4.parentNode;
          t3.parentNode.appendChild(e4), i3.appendChild(t3);
        }
      }
    }
    const l2 = n2 !== this.previousBackground;
    if (l2 && this.previousBackground && this.Reveal.slideContent.stopEmbeddedContent(this.previousBackground, { unloadIframes: !this.Reveal.slideContent.shouldPreload(this.previousBackground) }), l2 && n2) {
      this.Reveal.slideContent.startEmbeddedContent(n2);
      let e3 = n2.querySelector(".slide-background-content");
      if (e3) {
        let t2 = e3.style.backgroundImage || "";
        /\.gif/i.test(t2) && (e3.style.backgroundImage = "", window.getComputedStyle(e3).opacity, e3.style.backgroundImage = t2);
      }
      this.previousBackground = n2;
    }
    s2 && this.bubbleSlideContrastClassToElement(s2, this.Reveal.getRevealElement()), setTimeout(() => {
      this.element.classList.remove("no-transition");
    }, 10);
  }
  updateParallax() {
    let e2 = this.Reveal.getIndices();
    if (this.Reveal.getConfig().parallaxBackgroundImage) {
      let t2, i2, s2 = this.Reveal.getHorizontalSlides(), a2 = this.Reveal.getVerticalSlides(), n2 = this.element.style.backgroundSize.split(" ");
      1 === n2.length ? t2 = i2 = parseInt(n2[0], 10) : (t2 = parseInt(n2[0], 10), i2 = parseInt(n2[1], 10));
      let r2, o2, l2 = this.element.offsetWidth, d2 = s2.length;
      r2 = "number" == typeof this.Reveal.getConfig().parallaxBackgroundHorizontal ? this.Reveal.getConfig().parallaxBackgroundHorizontal : d2 > 1 ? (t2 - l2) / (d2 - 1) : 0, o2 = r2 * e2.h * -1;
      let c2, h2, u2 = this.element.offsetHeight, g2 = a2.length;
      c2 = "number" == typeof this.Reveal.getConfig().parallaxBackgroundVertical ? this.Reveal.getConfig().parallaxBackgroundVertical : (i2 - u2) / (g2 - 1), h2 = g2 > 0 ? c2 * e2.v : 0, this.element.style.backgroundPosition = o2 + "px " + -h2 + "px";
    }
  }
  destroy() {
    this.element.remove();
  }
};
var A = 0;
var k = class {
  constructor(e2) {
    this.Reveal = e2;
  }
  run(e2, t2) {
    this.reset();
    let i2 = this.Reveal.getSlides(), s2 = i2.indexOf(t2), a2 = i2.indexOf(e2);
    if (e2 && t2 && e2.hasAttribute("data-auto-animate") && t2.hasAttribute("data-auto-animate") && e2.getAttribute("data-auto-animate-id") === t2.getAttribute("data-auto-animate-id") && !(s2 > a2 ? t2 : e2).hasAttribute("data-auto-animate-restart")) {
      this.autoAnimateStyleSheet = this.autoAnimateStyleSheet || l();
      let i3 = this.getAutoAnimateOptions(t2);
      e2.dataset.autoAnimate = "pending", t2.dataset.autoAnimate = "pending", i3.slideDirection = s2 > a2 ? "forward" : "backward";
      let n2 = "none" === e2.style.display;
      n2 && (e2.style.display = this.Reveal.getConfig().display);
      let r2 = this.getAutoAnimatableElements(e2, t2).map((e3) => this.autoAnimateElements(e3.from, e3.to, e3.options || {}, i3, A++));
      if (n2 && (e2.style.display = "none"), "false" !== t2.dataset.autoAnimateUnmatched && true === this.Reveal.getConfig().autoAnimateUnmatched) {
        let e3 = 0.8 * i3.duration, s3 = 0.2 * i3.duration;
        this.getUnmatchedAutoAnimateElements(t2).forEach((e4) => {
          let t3 = this.getAutoAnimateOptions(e4, i3), s4 = "unmatched";
          t3.duration === i3.duration && t3.delay === i3.delay || (s4 = "unmatched-" + A++, r2.push(`[data-auto-animate="running"] [data-auto-animate-target="${s4}"] { transition: opacity ${t3.duration}s ease ${t3.delay}s; }`)), e4.dataset.autoAnimateTarget = s4;
        }, this), r2.push(`[data-auto-animate="running"] [data-auto-animate-target="unmatched"] { transition: opacity ${e3}s ease ${s3}s; }`);
      }
      this.autoAnimateStyleSheet.innerHTML = r2.join(""), requestAnimationFrame(() => {
        this.autoAnimateStyleSheet && (getComputedStyle(this.autoAnimateStyleSheet).fontWeight, t2.dataset.autoAnimate = "running");
      }), this.Reveal.dispatchEvent({ type: "autoanimate", data: { fromSlide: e2, toSlide: t2, sheet: this.autoAnimateStyleSheet } });
    }
  }
  reset() {
    t(this.Reveal.getRevealElement(), '[data-auto-animate]:not([data-auto-animate=""])').forEach((e2) => {
      e2.dataset.autoAnimate = "";
    }), t(this.Reveal.getRevealElement(), "[data-auto-animate-target]").forEach((e2) => {
      delete e2.dataset.autoAnimateTarget;
    }), this.autoAnimateStyleSheet && this.autoAnimateStyleSheet.parentNode && (this.autoAnimateStyleSheet.parentNode.removeChild(this.autoAnimateStyleSheet), this.autoAnimateStyleSheet = null);
  }
  autoAnimateElements(e2, t2, i2, s2, a2) {
    e2.dataset.autoAnimateTarget = "", t2.dataset.autoAnimateTarget = a2;
    let n2 = this.getAutoAnimateOptions(t2, s2);
    void 0 !== i2.delay && (n2.delay = i2.delay), void 0 !== i2.duration && (n2.duration = i2.duration), void 0 !== i2.easing && (n2.easing = i2.easing);
    let r2 = this.getAutoAnimatableProperties("from", e2, i2), o2 = this.getAutoAnimatableProperties("to", t2, i2);
    if (t2.classList.contains("fragment") && delete o2.styles.opacity, false !== i2.translate || false !== i2.scale) {
      let e3 = this.Reveal.getScale(), t3 = { x: (r2.x - o2.x) / e3, y: (r2.y - o2.y) / e3, scaleX: r2.width / o2.width, scaleY: r2.height / o2.height };
      t3.x = Math.round(1e3 * t3.x) / 1e3, t3.y = Math.round(1e3 * t3.y) / 1e3, t3.scaleX = Math.round(1e3 * t3.scaleX) / 1e3, t3.scaleX = Math.round(1e3 * t3.scaleX) / 1e3;
      let s3 = false !== i2.translate && (0 !== t3.x || 0 !== t3.y), a3 = false !== i2.scale && (0 !== t3.scaleX || 0 !== t3.scaleY);
      if (s3 || a3) {
        let e4 = [];
        s3 && e4.push(`translate(${t3.x}px, ${t3.y}px)`), a3 && e4.push(`scale(${t3.scaleX}, ${t3.scaleY})`), r2.styles.transform = e4.join(" "), r2.styles["transform-origin"] = "top left", o2.styles.transform = "none";
      }
    }
    for (let e3 in o2.styles) {
      const t3 = o2.styles[e3], i3 = r2.styles[e3];
      t3 === i3 ? delete o2.styles[e3] : (true === t3.explicitValue && (o2.styles[e3] = t3.value), true === i3.explicitValue && (r2.styles[e3] = i3.value));
    }
    let l2 = "", d2 = Object.keys(o2.styles);
    if (d2.length > 0) {
      r2.styles.transition = "none", o2.styles.transition = `all ${n2.duration}s ${n2.easing} ${n2.delay}s`, o2.styles["transition-property"] = d2.join(", "), o2.styles["will-change"] = d2.join(", "), l2 = '[data-auto-animate-target="' + a2 + '"] {' + Object.keys(r2.styles).map((e3) => e3 + ": " + r2.styles[e3] + " !important;").join("") + '}[data-auto-animate="running"] [data-auto-animate-target="' + a2 + '"] {' + Object.keys(o2.styles).map((e3) => e3 + ": " + o2.styles[e3] + " !important;").join("") + "}";
    }
    return l2;
  }
  getAutoAnimateOptions(t2, i2) {
    let s2 = { easing: this.Reveal.getConfig().autoAnimateEasing, duration: this.Reveal.getConfig().autoAnimateDuration, delay: 0 };
    if (s2 = e(s2, i2), t2.parentNode) {
      let e2 = r(t2.parentNode, "[data-auto-animate-target]");
      e2 && (s2 = this.getAutoAnimateOptions(e2, s2));
    }
    return t2.dataset.autoAnimateEasing && (s2.easing = t2.dataset.autoAnimateEasing), t2.dataset.autoAnimateDuration && (s2.duration = parseFloat(t2.dataset.autoAnimateDuration)), t2.dataset.autoAnimateDelay && (s2.delay = parseFloat(t2.dataset.autoAnimateDelay)), s2;
  }
  getAutoAnimatableProperties(e2, t2, i2) {
    let s2 = this.Reveal.getConfig(), a2 = { styles: [] };
    if (false !== i2.translate || false !== i2.scale) {
      let e3;
      if ("function" == typeof i2.measure) e3 = i2.measure(t2);
      else if (s2.center) e3 = t2.getBoundingClientRect();
      else {
        let i3 = this.Reveal.getScale();
        e3 = { x: t2.offsetLeft * i3, y: t2.offsetTop * i3, width: t2.offsetWidth * i3, height: t2.offsetHeight * i3 };
      }
      a2.x = e3.x, a2.y = e3.y, a2.width = e3.width, a2.height = e3.height;
    }
    const n2 = getComputedStyle(t2);
    return (i2.styles || s2.autoAnimateStyles).forEach((t3) => {
      let i3;
      "string" == typeof t3 && (t3 = { property: t3 }), void 0 !== t3.from && "from" === e2 ? i3 = { value: t3.from, explicitValue: true } : void 0 !== t3.to && "to" === e2 ? i3 = { value: t3.to, explicitValue: true } : ("line-height" === t3.property && (i3 = parseFloat(n2["line-height"]) / parseFloat(n2["font-size"])), isNaN(i3) && (i3 = n2[t3.property])), "" !== i3 && (a2.styles[t3.property] = i3);
    }), a2;
  }
  getAutoAnimatableElements(e2, t2) {
    let i2 = ("function" == typeof this.Reveal.getConfig().autoAnimateMatcher ? this.Reveal.getConfig().autoAnimateMatcher : this.getAutoAnimatePairs).call(this, e2, t2), s2 = [];
    return i2.filter((e3, t3) => {
      if (-1 === s2.indexOf(e3.to)) return s2.push(e3.to), true;
    });
  }
  getAutoAnimatePairs(e2, t2) {
    let i2 = [];
    const s2 = "h1, h2, h3, h4, h5, h6, p, li";
    return this.findAutoAnimateMatches(i2, e2, t2, "[data-id]", (e3) => e3.nodeName + ":::" + e3.getAttribute("data-id")), this.findAutoAnimateMatches(i2, e2, t2, s2, (e3) => e3.nodeName + ":::" + e3.textContent.trim()), this.findAutoAnimateMatches(i2, e2, t2, "img, video, iframe", (e3) => e3.nodeName + ":::" + (e3.getAttribute("src") || e3.getAttribute("data-src"))), this.findAutoAnimateMatches(i2, e2, t2, "pre", (e3) => e3.nodeName + ":::" + e3.textContent.trim()), i2.forEach((e3) => {
      n(e3.from, s2) ? e3.options = { scale: false } : n(e3.from, "pre") && (e3.options = { scale: false, styles: ["width", "height"] }, this.findAutoAnimateMatches(i2, e3.from, e3.to, ".hljs .hljs-ln-code", (e4) => e4.textContent, { scale: false, styles: [], measure: this.getLocalBoundingBox.bind(this) }), this.findAutoAnimateMatches(i2, e3.from, e3.to, ".hljs .hljs-ln-numbers[data-line-number]", (e4) => e4.getAttribute("data-line-number"), { scale: false, styles: ["width"], measure: this.getLocalBoundingBox.bind(this) }));
    }, this), i2;
  }
  getLocalBoundingBox(e2) {
    const t2 = this.Reveal.getScale();
    return { x: Math.round(e2.offsetLeft * t2 * 100) / 100, y: Math.round(e2.offsetTop * t2 * 100) / 100, width: Math.round(e2.offsetWidth * t2 * 100) / 100, height: Math.round(e2.offsetHeight * t2 * 100) / 100 };
  }
  findAutoAnimateMatches(e2, t2, i2, s2, a2, n2) {
    let r2 = {}, o2 = {};
    [].slice.call(t2.querySelectorAll(s2)).forEach((e3, t3) => {
      const i3 = a2(e3);
      "string" == typeof i3 && i3.length && (r2[i3] = r2[i3] || [], r2[i3].push(e3));
    }), [].slice.call(i2.querySelectorAll(s2)).forEach((t3, i3) => {
      const s3 = a2(t3);
      let l2;
      if (o2[s3] = o2[s3] || [], o2[s3].push(t3), r2[s3]) {
        const e3 = o2[s3].length - 1, t4 = r2[s3].length - 1;
        r2[s3][e3] ? (l2 = r2[s3][e3], r2[s3][e3] = null) : r2[s3][t4] && (l2 = r2[s3][t4], r2[s3][t4] = null);
      }
      l2 && e2.push({ from: l2, to: t3, options: n2 });
    });
  }
  getUnmatchedAutoAnimateElements(e2) {
    return [].slice.call(e2.children).reduce((e3, t2) => {
      const i2 = t2.querySelector("[data-auto-animate-target]");
      return t2.hasAttribute("data-auto-animate-target") || i2 || e3.push(t2), t2.querySelector("[data-auto-animate-target]") && (e3 = e3.concat(this.getUnmatchedAutoAnimateElements(t2))), e3;
    }, []);
  }
};
var L = class {
  constructor(e2) {
    this.Reveal = e2, this.active = false, this.activatedCallbacks = [], this.onScroll = this.onScroll.bind(this);
  }
  activate() {
    if (this.active) return;
    const e2 = this.Reveal.getState();
    this.active = true, this.slideHTMLBeforeActivation = this.Reveal.getSlidesElement().innerHTML;
    const i2 = t(this.Reveal.getRevealElement(), f), s2 = t(this.Reveal.getRevealElement(), ".backgrounds>.slide-background");
    let a2;
    this.viewportElement.classList.add("loading-scroll-mode", "reveal-scroll");
    const n2 = window.getComputedStyle(this.viewportElement);
    n2 && n2.background && (a2 = n2.background);
    const r2 = [], o2 = i2[0].parentNode;
    let l2;
    const d2 = (e3, t2, i3, n3) => {
      let o3;
      if (l2 && this.Reveal.shouldAutoAnimateBetween(l2, e3)) o3 = document.createElement("div"), o3.className = "scroll-page-content scroll-auto-animate-page", o3.style.display = "none", l2.closest(".scroll-page-content").parentNode.appendChild(o3);
      else {
        const e4 = document.createElement("div");
        if (e4.className = "scroll-page", r2.push(e4), n3 && s2.length > t2) {
          const i5 = s2[t2], n4 = window.getComputedStyle(i5);
          n4 && n4.background ? e4.style.background = n4.background : a2 && (e4.style.background = a2);
        } else a2 && (e4.style.background = a2);
        const i4 = document.createElement("div");
        i4.className = "scroll-page-sticky", e4.appendChild(i4), o3 = document.createElement("div"), o3.className = "scroll-page-content", i4.appendChild(o3);
      }
      o3.appendChild(e3), e3.classList.remove("past", "future"), e3.setAttribute("data-index-h", t2), e3.setAttribute("data-index-v", i3), e3.slideBackgroundElement && (e3.slideBackgroundElement.remove("past", "future"), o3.insertBefore(e3.slideBackgroundElement, e3)), l2 = e3;
    };
    i2.forEach((e3, t2) => {
      this.Reveal.isVerticalStack(e3) ? e3.querySelectorAll("section").forEach((e4, i3) => {
        d2(e4, t2, i3, true);
      }) : d2(e3, t2, 0);
    }, this), this.createProgressBar(), t(this.Reveal.getRevealElement(), ".stack").forEach((e3) => e3.remove()), r2.forEach((e3) => o2.appendChild(e3)), this.Reveal.slideContent.layout(this.Reveal.getSlidesElement()), this.Reveal.layout(), this.Reveal.setState(e2), this.activatedCallbacks.forEach((e3) => e3()), this.activatedCallbacks = [], this.restoreScrollPosition(), this.viewportElement.classList.remove("loading-scroll-mode"), this.viewportElement.addEventListener("scroll", this.onScroll, { passive: true });
  }
  deactivate() {
    if (!this.active) return;
    const e2 = this.Reveal.getState();
    this.active = false, this.viewportElement.removeEventListener("scroll", this.onScroll), this.viewportElement.classList.remove("reveal-scroll"), this.removeProgressBar(), this.Reveal.getSlidesElement().innerHTML = this.slideHTMLBeforeActivation, this.Reveal.sync(), this.Reveal.setState(e2), this.slideHTMLBeforeActivation = null;
  }
  toggle(e2) {
    "boolean" == typeof e2 ? e2 ? this.activate() : this.deactivate() : this.isActive() ? this.deactivate() : this.activate();
  }
  isActive() {
    return this.active;
  }
  createProgressBar() {
    this.progressBar = document.createElement("div"), this.progressBar.className = "scrollbar", this.progressBarInner = document.createElement("div"), this.progressBarInner.className = "scrollbar-inner", this.progressBar.appendChild(this.progressBarInner), this.progressBarPlayhead = document.createElement("div"), this.progressBarPlayhead.className = "scrollbar-playhead", this.progressBarInner.appendChild(this.progressBarPlayhead), this.viewportElement.insertBefore(this.progressBar, this.viewportElement.firstChild);
    const e2 = (e3) => {
      let t3 = (e3.clientY - this.progressBarInner.getBoundingClientRect().top) / this.progressBarHeight;
      t3 = Math.max(Math.min(t3, 1), 0), this.viewportElement.scrollTop = t3 * (this.viewportElement.scrollHeight - this.viewportElement.offsetHeight);
    }, t2 = (i2) => {
      this.draggingProgressBar = false, this.showProgressBar(), document.removeEventListener("mousemove", e2), document.removeEventListener("mouseup", t2);
    };
    this.progressBarInner.addEventListener("mousedown", (i2) => {
      i2.preventDefault(), this.draggingProgressBar = true, document.addEventListener("mousemove", e2), document.addEventListener("mouseup", t2), e2(i2);
    });
  }
  removeProgressBar() {
    this.progressBar && (this.progressBar.remove(), this.progressBar = null);
  }
  layout() {
    this.isActive() && (this.syncPages(), this.syncScrollPosition());
  }
  syncPages() {
    const e2 = this.Reveal.getConfig(), t2 = this.Reveal.getComputedSlideSize(window.innerWidth, window.innerHeight), i2 = this.Reveal.getScale(), s2 = "compact" === e2.scrollLayout, a2 = this.viewportElement.offsetHeight, n2 = t2.height * i2, r2 = s2 ? n2 : a2;
    this.scrollTriggerHeight = s2 ? n2 : a2, this.viewportElement.style.setProperty("--page-height", r2 + "px"), this.viewportElement.style.scrollSnapType = "string" == typeof e2.scrollSnap ? `y ${e2.scrollSnap}` : "", this.slideTriggers = [];
    const o2 = Array.from(this.Reveal.getRevealElement().querySelectorAll(".scroll-page"));
    this.pages = o2.map((i3) => {
      const n3 = this.createPage({ pageElement: i3, slideElement: i3.querySelector("section"), stickyElement: i3.querySelector(".scroll-page-sticky"), contentElement: i3.querySelector(".scroll-page-content"), backgroundElement: i3.querySelector(".slide-background"), autoAnimateElements: i3.querySelectorAll(".scroll-auto-animate-page"), autoAnimatePages: [] });
      n3.pageElement.style.setProperty("--slide-height", true === e2.center ? "auto" : t2.height + "px"), this.slideTriggers.push({ page: n3, activate: () => this.activatePage(n3), deactivate: () => this.deactivatePage(n3) }), this.createFragmentTriggersForPage(n3), n3.autoAnimateElements.length > 0 && this.createAutoAnimateTriggersForPage(n3);
      let o3 = Math.max(n3.scrollTriggers.length - 1, 0);
      o3 += n3.autoAnimatePages.reduce((e3, t3) => e3 + Math.max(t3.scrollTriggers.length - 1, 0), n3.autoAnimatePages.length), n3.pageElement.querySelectorAll(".scroll-snap-point").forEach((e3) => e3.remove());
      for (let e3 = 0; e3 < o3 + 1; e3++) {
        const t3 = document.createElement("div");
        t3.className = "scroll-snap-point", t3.style.height = this.scrollTriggerHeight + "px", t3.style.scrollSnapAlign = s2 ? "center" : "start", n3.pageElement.appendChild(t3), 0 === e3 && (t3.style.marginTop = -this.scrollTriggerHeight + "px");
      }
      return s2 && n3.scrollTriggers.length > 0 ? (n3.pageHeight = a2, n3.pageElement.style.setProperty("--page-height", a2 + "px")) : (n3.pageHeight = r2, n3.pageElement.style.removeProperty("--page-height")), n3.scrollPadding = this.scrollTriggerHeight * o3, n3.totalHeight = n3.pageHeight + n3.scrollPadding, n3.pageElement.style.setProperty("--page-scroll-padding", n3.scrollPadding + "px"), o3 > 0 ? (n3.stickyElement.style.position = "sticky", n3.stickyElement.style.top = Math.max((a2 - n3.pageHeight) / 2, 0) + "px") : (n3.stickyElement.style.position = "relative", n3.pageElement.style.scrollSnapAlign = n3.pageHeight < a2 ? "center" : "start"), n3;
    }), this.setTriggerRanges(), this.viewportElement.setAttribute("data-scrollbar", e2.scrollProgress), e2.scrollProgress && this.totalScrollTriggerCount > 1 ? (this.progressBar || this.createProgressBar(), this.syncProgressBar()) : this.removeProgressBar();
  }
  setTriggerRanges() {
    this.totalScrollTriggerCount = this.slideTriggers.reduce((e3, t2) => e3 + Math.max(t2.page.scrollTriggers.length, 1), 0);
    let e2 = 0;
    this.slideTriggers.forEach((t2, i2) => {
      t2.range = [e2, e2 + Math.max(t2.page.scrollTriggers.length, 1) / this.totalScrollTriggerCount];
      const s2 = (t2.range[1] - t2.range[0]) / t2.page.scrollTriggers.length;
      t2.page.scrollTriggers.forEach((t3, i3) => {
        t3.range = [e2 + i3 * s2, e2 + (i3 + 1) * s2];
      }), e2 = t2.range[1];
    }), this.slideTriggers[this.slideTriggers.length - 1].range[1] = 1;
  }
  createFragmentTriggersForPage(e2, t2) {
    t2 = t2 || e2.slideElement;
    const i2 = this.Reveal.fragments.sort(t2.querySelectorAll(".fragment"), true);
    return i2.length && (e2.fragments = this.Reveal.fragments.sort(t2.querySelectorAll(".fragment:not(.disabled)")), e2.scrollTriggers.push({ activate: () => {
      this.Reveal.fragments.update(-1, e2.fragments, t2);
    } }), i2.forEach((i3, s2) => {
      e2.scrollTriggers.push({ activate: () => {
        this.Reveal.fragments.update(s2, e2.fragments, t2);
      } });
    })), e2.scrollTriggers.length;
  }
  createAutoAnimateTriggersForPage(e2) {
    e2.autoAnimateElements.length > 0 && this.slideTriggers.push(...Array.from(e2.autoAnimateElements).map((t2, i2) => {
      let s2 = this.createPage({ slideElement: t2.querySelector("section"), contentElement: t2, backgroundElement: t2.querySelector(".slide-background") });
      return this.createFragmentTriggersForPage(s2, s2.slideElement), e2.autoAnimatePages.push(s2), { page: s2, activate: () => this.activatePage(s2), deactivate: () => this.deactivatePage(s2) };
    }));
  }
  createPage(e2) {
    return e2.scrollTriggers = [], e2.indexh = parseInt(e2.slideElement.getAttribute("data-index-h"), 10), e2.indexv = parseInt(e2.slideElement.getAttribute("data-index-v"), 10), e2;
  }
  syncProgressBar() {
    this.progressBarInner.querySelectorAll(".scrollbar-slide").forEach((e3) => e3.remove());
    const e2 = this.viewportElement.scrollHeight, t2 = this.viewportElement.offsetHeight, i2 = t2 / e2;
    this.progressBarHeight = this.progressBarInner.offsetHeight, this.playheadHeight = Math.max(i2 * this.progressBarHeight, 8), this.progressBarScrollableHeight = this.progressBarHeight - this.playheadHeight;
    const s2 = t2 / e2 * this.progressBarHeight, a2 = Math.min(s2 / 8, 4);
    this.progressBarPlayhead.style.height = this.playheadHeight - a2 + "px", s2 > 6 ? this.slideTriggers.forEach((e3) => {
      const { page: t3 } = e3;
      t3.progressBarSlide = document.createElement("div"), t3.progressBarSlide.className = "scrollbar-slide", t3.progressBarSlide.style.top = e3.range[0] * this.progressBarHeight + "px", t3.progressBarSlide.style.height = (e3.range[1] - e3.range[0]) * this.progressBarHeight - a2 + "px", t3.progressBarSlide.classList.toggle("has-triggers", t3.scrollTriggers.length > 0), this.progressBarInner.appendChild(t3.progressBarSlide), t3.scrollTriggerElements = t3.scrollTriggers.map((i3, s3) => {
        const n2 = document.createElement("div");
        return n2.className = "scrollbar-trigger", n2.style.top = (i3.range[0] - e3.range[0]) * this.progressBarHeight + "px", n2.style.height = (i3.range[1] - i3.range[0]) * this.progressBarHeight - a2 + "px", t3.progressBarSlide.appendChild(n2), 0 === s3 && (n2.style.display = "none"), n2;
      });
    }) : this.pages.forEach((e3) => e3.progressBarSlide = null);
  }
  syncScrollPosition() {
    const e2 = this.viewportElement.offsetHeight, t2 = e2 / this.viewportElement.scrollHeight, i2 = this.viewportElement.scrollTop, s2 = this.viewportElement.scrollHeight - e2, a2 = Math.max(Math.min(i2 / s2, 1), 0), n2 = Math.max(Math.min((i2 + e2 / 2) / this.viewportElement.scrollHeight, 1), 0);
    let r2;
    this.slideTriggers.forEach((e3) => {
      const { page: i3 } = e3;
      a2 >= e3.range[0] - 2 * t2 && a2 <= e3.range[1] + 2 * t2 && !i3.loaded ? (i3.loaded = true, this.Reveal.slideContent.load(i3.slideElement)) : i3.loaded && (i3.loaded = false, this.Reveal.slideContent.unload(i3.slideElement)), a2 >= e3.range[0] && a2 <= e3.range[1] ? (this.activateTrigger(e3), r2 = e3.page) : e3.active && this.deactivateTrigger(e3);
    }), r2 && r2.scrollTriggers.forEach((e3) => {
      n2 >= e3.range[0] && n2 <= e3.range[1] ? this.activateTrigger(e3) : e3.active && this.deactivateTrigger(e3);
    }), this.setProgressBarValue(i2 / (this.viewportElement.scrollHeight - e2));
  }
  setProgressBarValue(e2) {
    this.progressBar && (this.progressBarPlayhead.style.transform = `translateY(${e2 * this.progressBarScrollableHeight}px)`, this.getAllPages().filter((e3) => e3.progressBarSlide).forEach((e3) => {
      e3.progressBarSlide.classList.toggle("active", true === e3.active), e3.scrollTriggers.forEach((t2, i2) => {
        e3.scrollTriggerElements[i2].classList.toggle("active", true === e3.active && true === t2.active);
      });
    }), this.showProgressBar());
  }
  showProgressBar() {
    this.progressBar.classList.add("visible"), clearTimeout(this.hideProgressBarTimeout), "auto" !== this.Reveal.getConfig().scrollProgress || this.draggingProgressBar || (this.hideProgressBarTimeout = setTimeout(() => {
      this.progressBar && this.progressBar.classList.remove("visible");
    }, 500));
  }
  prev() {
    this.viewportElement.scrollTop -= this.scrollTriggerHeight;
  }
  next() {
    this.viewportElement.scrollTop += this.scrollTriggerHeight;
  }
  scrollToSlide(e2) {
    if (this.active) {
      const t2 = this.getScrollTriggerBySlide(e2);
      t2 && (this.viewportElement.scrollTop = t2.range[0] * (this.viewportElement.scrollHeight - this.viewportElement.offsetHeight));
    } else this.activatedCallbacks.push(() => this.scrollToSlide(e2));
  }
  storeScrollPosition() {
    clearTimeout(this.storeScrollPositionTimeout), this.storeScrollPositionTimeout = setTimeout(() => {
      sessionStorage.setItem("reveal-scroll-top", this.viewportElement.scrollTop), sessionStorage.setItem("reveal-scroll-origin", location.origin + location.pathname), this.storeScrollPositionTimeout = null;
    }, 50);
  }
  restoreScrollPosition() {
    const e2 = sessionStorage.getItem("reveal-scroll-top"), t2 = sessionStorage.getItem("reveal-scroll-origin");
    e2 && t2 === location.origin + location.pathname && (this.viewportElement.scrollTop = parseInt(e2, 10));
  }
  activatePage(e2) {
    if (!e2.active) {
      e2.active = true;
      const { slideElement: t2, backgroundElement: i2, contentElement: s2, indexh: a2, indexv: n2 } = e2;
      s2.style.display = "block", t2.classList.add("present"), i2 && i2.classList.add("present"), this.Reveal.setCurrentScrollPage(t2, a2, n2), this.Reveal.backgrounds.bubbleSlideContrastClassToElement(t2, this.viewportElement), Array.from(s2.parentNode.querySelectorAll(".scroll-page-content")).forEach((e3) => {
        e3 !== s2 && (e3.style.display = "none");
      });
    }
  }
  deactivatePage(e2) {
    e2.active && (e2.active = false, e2.slideElement && e2.slideElement.classList.remove("present"), e2.backgroundElement && e2.backgroundElement.classList.remove("present"));
  }
  activateTrigger(e2) {
    e2.active || (e2.active = true, e2.activate());
  }
  deactivateTrigger(e2) {
    e2.active && (e2.active = false, e2.deactivate && e2.deactivate());
  }
  getSlideByIndices(e2, t2) {
    const i2 = this.getAllPages().find((i3) => i3.indexh === e2 && i3.indexv === t2);
    return i2 ? i2.slideElement : null;
  }
  getScrollTriggerBySlide(e2) {
    return this.slideTriggers.find((t2) => t2.page.slideElement === e2);
  }
  getAllPages() {
    return this.pages.flatMap((e2) => [e2, ...e2.autoAnimatePages || []]);
  }
  onScroll() {
    this.syncScrollPosition(), this.storeScrollPosition();
  }
  get viewportElement() {
    return this.Reveal.getViewportElement();
  }
};
var C = class {
  constructor(e2) {
    this.Reveal = e2;
  }
  async activate() {
    const e2 = this.Reveal.getConfig(), i2 = t(this.Reveal.getRevealElement(), m), s2 = e2.slideNumber && /all|print/i.test(e2.showSlideNumber), a2 = this.Reveal.getComputedSlideSize(window.innerWidth, window.innerHeight), n2 = Math.floor(a2.width * (1 + e2.margin)), r2 = Math.floor(a2.height * (1 + e2.margin)), o2 = a2.width, d2 = a2.height;
    await new Promise(requestAnimationFrame), l("@page{size:" + n2 + "px " + r2 + "px; margin: 0px;}"), l(".reveal section>img, .reveal section>video, .reveal section>iframe{max-width: " + o2 + "px; max-height:" + d2 + "px}"), document.documentElement.classList.add("reveal-print", "print-pdf"), document.body.style.width = n2 + "px", document.body.style.height = r2 + "px";
    const c2 = this.Reveal.getViewportElement();
    let h2;
    if (c2) {
      const e3 = window.getComputedStyle(c2);
      e3 && e3.background && (h2 = e3.background);
    }
    await new Promise(requestAnimationFrame), this.Reveal.layoutSlideContents(o2, d2), await new Promise(requestAnimationFrame);
    const u2 = i2.map((e3) => e3.scrollHeight), g2 = [], v2 = i2[0].parentNode;
    let p2 = 1;
    i2.forEach(function(i3, a3) {
      if (false === i3.classList.contains("stack")) {
        let l2 = (n2 - o2) / 2, c3 = (r2 - d2) / 2;
        const v3 = u2[a3];
        let m2 = Math.max(Math.ceil(v3 / r2), 1);
        m2 = Math.min(m2, e2.pdfMaxPagesPerSlide), (1 === m2 && e2.center || i3.classList.contains("center")) && (c3 = Math.max((r2 - v3) / 2, 0));
        const f2 = document.createElement("div");
        if (g2.push(f2), f2.className = "pdf-page", f2.style.height = (r2 + e2.pdfPageHeightOffset) * m2 + "px", h2 && (f2.style.background = h2), f2.appendChild(i3), i3.style.left = l2 + "px", i3.style.top = c3 + "px", i3.style.width = o2 + "px", this.Reveal.slideContent.layout(i3), i3.slideBackgroundElement && f2.insertBefore(i3.slideBackgroundElement, i3), e2.showNotes) {
          const t2 = this.Reveal.getSlideNotes(i3);
          if (t2) {
            const i4 = 8, s3 = "string" == typeof e2.showNotes ? e2.showNotes : "inline", a4 = document.createElement("div");
            a4.classList.add("speaker-notes"), a4.classList.add("speaker-notes-pdf"), a4.setAttribute("data-layout", s3), a4.innerHTML = t2, "separate-page" === s3 ? g2.push(a4) : (a4.style.left = i4 + "px", a4.style.bottom = i4 + "px", a4.style.width = n2 - 2 * i4 + "px", f2.appendChild(a4));
          }
        }
        if (s2) {
          const e3 = document.createElement("div");
          e3.classList.add("slide-number"), e3.classList.add("slide-number-pdf"), e3.innerHTML = p2++, f2.appendChild(e3);
        }
        if (e2.pdfSeparateFragments) {
          const e3 = this.Reveal.fragments.sort(f2.querySelectorAll(".fragment"), true);
          let t2;
          e3.forEach(function(e4, i4) {
            t2 && t2.forEach(function(e5) {
              e5.classList.remove("current-fragment");
            }), e4.forEach(function(e5) {
              e5.classList.add("visible", "current-fragment");
            }, this);
            const a4 = f2.cloneNode(true);
            if (s2) {
              const e5 = i4 + 1;
              a4.querySelector(".slide-number-pdf").innerHTML += "." + e5;
            }
            g2.push(a4), t2 = e4;
          }, this), e3.forEach(function(e4) {
            e4.forEach(function(e5) {
              e5.classList.remove("visible", "current-fragment");
            });
          });
        } else t(f2, ".fragment:not(.fade-out)").forEach(function(e3) {
          e3.classList.add("visible");
        });
      }
    }, this), await new Promise(requestAnimationFrame), g2.forEach((e3) => v2.appendChild(e3)), this.Reveal.slideContent.layout(this.Reveal.getSlidesElement()), this.Reveal.dispatchEvent({ type: "pdf-ready" }), c2.classList.remove("loading-scroll-mode");
  }
  isActive() {
    return "print" === this.Reveal.getConfig().view;
  }
};
var x = class {
  constructor(e2) {
    this.Reveal = e2;
  }
  configure(e2, t2) {
    false === e2.fragments ? this.disable() : false === t2.fragments && this.enable();
  }
  disable() {
    t(this.Reveal.getSlidesElement(), ".fragment").forEach((e2) => {
      e2.classList.add("visible"), e2.classList.remove("current-fragment");
    });
  }
  enable() {
    t(this.Reveal.getSlidesElement(), ".fragment").forEach((e2) => {
      e2.classList.remove("visible"), e2.classList.remove("current-fragment");
    });
  }
  availableRoutes() {
    let e2 = this.Reveal.getCurrentSlide();
    if (e2 && this.Reveal.getConfig().fragments) {
      let t2 = e2.querySelectorAll(".fragment:not(.disabled)"), i2 = e2.querySelectorAll(".fragment:not(.disabled):not(.visible)");
      return { prev: t2.length - i2.length > 0, next: !!i2.length };
    }
    return { prev: false, next: false };
  }
  sort(e2, t2 = false) {
    e2 = Array.from(e2);
    let i2 = [], s2 = [], a2 = [];
    e2.forEach((e3) => {
      if (e3.hasAttribute("data-fragment-index")) {
        let t3 = parseInt(e3.getAttribute("data-fragment-index"), 10);
        i2[t3] || (i2[t3] = []), i2[t3].push(e3);
      } else s2.push([e3]);
    }), i2 = i2.concat(s2);
    let n2 = 0;
    return i2.forEach((e3) => {
      e3.forEach((e4) => {
        a2.push(e4), e4.setAttribute("data-fragment-index", n2);
      }), n2++;
    }), true === t2 ? i2 : a2;
  }
  sortAll() {
    this.Reveal.getHorizontalSlides().forEach((e2) => {
      let i2 = t(e2, "section");
      i2.forEach((e3, t2) => {
        this.sort(e3.querySelectorAll(".fragment"));
      }, this), 0 === i2.length && this.sort(e2.querySelectorAll(".fragment"));
    });
  }
  update(e2, t2, i2 = this.Reveal.getCurrentSlide()) {
    let s2 = { shown: [], hidden: [] };
    if (i2 && this.Reveal.getConfig().fragments && (t2 = t2 || this.sort(i2.querySelectorAll(".fragment"))).length) {
      let a2 = 0;
      if ("number" != typeof e2) {
        let t3 = this.sort(i2.querySelectorAll(".fragment.visible")).pop();
        t3 && (e2 = parseInt(t3.getAttribute("data-fragment-index") || 0, 10));
      }
      Array.from(t2).forEach((t3, i3) => {
        if (t3.hasAttribute("data-fragment-index") && (i3 = parseInt(t3.getAttribute("data-fragment-index"), 10)), a2 = Math.max(a2, i3), i3 <= e2) {
          let a3 = t3.classList.contains("visible");
          t3.classList.add("visible"), t3.classList.remove("current-fragment"), i3 === e2 && (this.Reveal.announceStatus(this.Reveal.getStatusText(t3)), t3.classList.add("current-fragment"), this.Reveal.slideContent.startEmbeddedContent(t3)), a3 || (s2.shown.push(t3), this.Reveal.dispatchEvent({ target: t3, type: "visible", bubbles: false }));
        } else {
          let e3 = t3.classList.contains("visible");
          t3.classList.remove("visible"), t3.classList.remove("current-fragment"), e3 && (this.Reveal.slideContent.stopEmbeddedContent(t3), s2.hidden.push(t3), this.Reveal.dispatchEvent({ target: t3, type: "hidden", bubbles: false }));
        }
      }), e2 = "number" == typeof e2 ? e2 : -1, e2 = Math.max(Math.min(e2, a2), -1), i2.setAttribute("data-fragment", e2);
    }
    return s2.hidden.length && this.Reveal.dispatchEvent({ type: "fragmenthidden", data: { fragment: s2.hidden[0], fragments: s2.hidden } }), s2.shown.length && this.Reveal.dispatchEvent({ type: "fragmentshown", data: { fragment: s2.shown[0], fragments: s2.shown } }), s2;
  }
  sync(e2 = this.Reveal.getCurrentSlide()) {
    return this.sort(e2.querySelectorAll(".fragment"));
  }
  goto(e2, t2 = 0) {
    let i2 = this.Reveal.getCurrentSlide();
    if (i2 && this.Reveal.getConfig().fragments) {
      let s2 = this.sort(i2.querySelectorAll(".fragment:not(.disabled)"));
      if (s2.length) {
        if ("number" != typeof e2) {
          let t3 = this.sort(i2.querySelectorAll(".fragment:not(.disabled).visible")).pop();
          e2 = t3 ? parseInt(t3.getAttribute("data-fragment-index") || 0, 10) : -1;
        }
        e2 += t2;
        let a2 = this.update(e2, s2);
        return this.Reveal.controls.update(), this.Reveal.progress.update(), this.Reveal.getConfig().fragmentInURL && this.Reveal.location.writeURL(), !(!a2.shown.length && !a2.hidden.length);
      }
    }
    return false;
  }
  next() {
    return this.goto(null, 1);
  }
  prev() {
    return this.goto(null, -1);
  }
};
var P = class {
  constructor(e2) {
    this.Reveal = e2, this.active = false, this.onSlideClicked = this.onSlideClicked.bind(this);
  }
  activate() {
    if (this.Reveal.getConfig().overview && !this.Reveal.isScrollView() && !this.isActive()) {
      this.active = true, this.Reveal.getRevealElement().classList.add("overview"), this.Reveal.cancelAutoSlide(), this.Reveal.getSlidesElement().appendChild(this.Reveal.getBackgroundsElement()), t(this.Reveal.getRevealElement(), m).forEach((e3) => {
        e3.classList.contains("stack") || e3.addEventListener("click", this.onSlideClicked, true);
      });
      const e2 = 70, i2 = this.Reveal.getComputedSlideSize();
      this.overviewSlideWidth = i2.width + e2, this.overviewSlideHeight = i2.height + e2, this.Reveal.getConfig().rtl && (this.overviewSlideWidth = -this.overviewSlideWidth), this.Reveal.updateSlidesVisibility(), this.layout(), this.update(), this.Reveal.layout();
      const s2 = this.Reveal.getIndices();
      this.Reveal.dispatchEvent({ type: "overviewshown", data: { indexh: s2.h, indexv: s2.v, currentSlide: this.Reveal.getCurrentSlide() } });
    }
  }
  layout() {
    this.Reveal.getHorizontalSlides().forEach((e2, i2) => {
      e2.setAttribute("data-index-h", i2), a(e2, "translate3d(" + i2 * this.overviewSlideWidth + "px, 0, 0)"), e2.classList.contains("stack") && t(e2, "section").forEach((e3, t2) => {
        e3.setAttribute("data-index-h", i2), e3.setAttribute("data-index-v", t2), a(e3, "translate3d(0, " + t2 * this.overviewSlideHeight + "px, 0)");
      });
    }), Array.from(this.Reveal.getBackgroundsElement().childNodes).forEach((e2, i2) => {
      a(e2, "translate3d(" + i2 * this.overviewSlideWidth + "px, 0, 0)"), t(e2, ".slide-background").forEach((e3, t2) => {
        a(e3, "translate3d(0, " + t2 * this.overviewSlideHeight + "px, 0)");
      });
    });
  }
  update() {
    const e2 = Math.min(window.innerWidth, window.innerHeight), t2 = Math.max(e2 / 5, 150) / e2, i2 = this.Reveal.getIndices();
    this.Reveal.transformSlides({ overview: ["scale(" + t2 + ")", "translateX(" + -i2.h * this.overviewSlideWidth + "px)", "translateY(" + -i2.v * this.overviewSlideHeight + "px)"].join(" ") });
  }
  deactivate() {
    if (this.Reveal.getConfig().overview) {
      this.active = false, this.Reveal.getRevealElement().classList.remove("overview"), this.Reveal.getRevealElement().classList.add("overview-deactivating"), setTimeout(() => {
        this.Reveal.getRevealElement().classList.remove("overview-deactivating");
      }, 1), this.Reveal.getRevealElement().appendChild(this.Reveal.getBackgroundsElement()), t(this.Reveal.getRevealElement(), m).forEach((e3) => {
        a(e3, ""), e3.removeEventListener("click", this.onSlideClicked, true);
      }), t(this.Reveal.getBackgroundsElement(), ".slide-background").forEach((e3) => {
        a(e3, "");
      }), this.Reveal.transformSlides({ overview: "" });
      const e2 = this.Reveal.getIndices();
      this.Reveal.slide(e2.h, e2.v), this.Reveal.layout(), this.Reveal.cueAutoSlide(), this.Reveal.dispatchEvent({ type: "overviewhidden", data: { indexh: e2.h, indexv: e2.v, currentSlide: this.Reveal.getCurrentSlide() } });
    }
  }
  toggle(e2) {
    "boolean" == typeof e2 ? e2 ? this.activate() : this.deactivate() : this.isActive() ? this.deactivate() : this.activate();
  }
  isActive() {
    return this.active;
  }
  onSlideClicked(e2) {
    if (this.isActive()) {
      e2.preventDefault();
      let t2 = e2.target;
      for (; t2 && !t2.nodeName.match(/section/gi); ) t2 = t2.parentNode;
      if (t2 && !t2.classList.contains("disabled") && (this.deactivate(), t2.nodeName.match(/section/gi))) {
        let e3 = parseInt(t2.getAttribute("data-index-h"), 10), i2 = parseInt(t2.getAttribute("data-index-v"), 10);
        this.Reveal.slide(e3, i2);
      }
    }
  }
};
var T = class {
  constructor(e2) {
    this.Reveal = e2, this.shortcuts = {}, this.bindings = {}, this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
  }
  configure(e2, t2) {
    "linear" === e2.navigationMode ? (this.shortcuts["&#8594;  ,  &#8595;  ,  SPACE  ,  N  ,  L  ,  J"] = "Next slide", this.shortcuts["&#8592;  ,  &#8593;  ,  P  ,  H  ,  K"] = "Previous slide") : (this.shortcuts["N  ,  SPACE"] = "Next slide", this.shortcuts["P  ,  Shift SPACE"] = "Previous slide", this.shortcuts["&#8592;  ,  H"] = "Navigate left", this.shortcuts["&#8594;  ,  L"] = "Navigate right", this.shortcuts["&#8593;  ,  K"] = "Navigate up", this.shortcuts["&#8595;  ,  J"] = "Navigate down"), this.shortcuts["Alt + &#8592;/&#8593/&#8594;/&#8595;"] = "Navigate without fragments", this.shortcuts["Shift + &#8592;/&#8593/&#8594;/&#8595;"] = "Jump to first/last slide", this.shortcuts["B  ,  ."] = "Pause", this.shortcuts.F = "Fullscreen", this.shortcuts.G = "Jump to slide", this.shortcuts["ESC, O"] = "Slide overview";
  }
  bind() {
    document.addEventListener("keydown", this.onDocumentKeyDown, false);
  }
  unbind() {
    document.removeEventListener("keydown", this.onDocumentKeyDown, false);
  }
  addKeyBinding(e2, t2) {
    "object" == typeof e2 && e2.keyCode ? this.bindings[e2.keyCode] = { callback: t2, key: e2.key, description: e2.description } : this.bindings[e2] = { callback: t2, key: null, description: null };
  }
  removeKeyBinding(e2) {
    delete this.bindings[e2];
  }
  triggerKey(e2) {
    this.onDocumentKeyDown({ keyCode: e2 });
  }
  registerKeyboardShortcut(e2, t2) {
    this.shortcuts[e2] = t2;
  }
  getShortcuts() {
    return this.shortcuts;
  }
  getBindings() {
    return this.bindings;
  }
  onDocumentKeyDown(e2) {
    let t2 = this.Reveal.getConfig();
    if ("function" == typeof t2.keyboardCondition && false === t2.keyboardCondition(e2)) return true;
    if ("focused" === t2.keyboardCondition && !this.Reveal.isFocused()) return true;
    let i2 = e2.keyCode, s2 = !this.Reveal.isAutoSliding();
    this.Reveal.onUserInput(e2);
    let a2 = document.activeElement && true === document.activeElement.isContentEditable, n2 = document.activeElement && document.activeElement.tagName && /input|textarea/i.test(document.activeElement.tagName), r2 = document.activeElement && document.activeElement.className && /speaker-notes/i.test(document.activeElement.className), l2 = !(-1 !== [32, 37, 38, 39, 40, 63, 78, 80, 191].indexOf(e2.keyCode) && e2.shiftKey || e2.altKey) && (e2.shiftKey || e2.altKey || e2.ctrlKey || e2.metaKey);
    if (a2 || n2 || r2 || l2) return;
    let d2, c2 = [66, 86, 190, 191, 112];
    if ("object" == typeof t2.keyboard) for (d2 in t2.keyboard) "togglePause" === t2.keyboard[d2] && c2.push(parseInt(d2, 10));
    if (this.Reveal.isOverlayOpen() && !["Escape", "f", "c", "b", "."].includes(e2.key)) return false;
    if (this.Reveal.isPaused() && -1 === c2.indexOf(i2)) return false;
    let h2 = "linear" === t2.navigationMode || !this.Reveal.hasHorizontalSlides() || !this.Reveal.hasVerticalSlides(), u2 = false;
    if ("object" == typeof t2.keyboard) {
      for (d2 in t2.keyboard) if (parseInt(d2, 10) === i2) {
        let i3 = t2.keyboard[d2];
        "function" == typeof i3 ? i3.apply(null, [e2]) : "string" == typeof i3 && "function" == typeof this.Reveal[i3] && this.Reveal[i3].call(), u2 = true;
      }
    }
    if (false === u2) {
      for (d2 in this.bindings) if (parseInt(d2, 10) === i2) {
        let t3 = this.bindings[d2].callback;
        "function" == typeof t3 ? t3.apply(null, [e2]) : "string" == typeof t3 && "function" == typeof this.Reveal[t3] && this.Reveal[t3].call(), u2 = true;
      }
    }
    false === u2 && (u2 = true, 80 === i2 || 33 === i2 ? this.Reveal.prev({ skipFragments: e2.altKey }) : 78 === i2 || 34 === i2 ? this.Reveal.next({ skipFragments: e2.altKey }) : 72 === i2 || 37 === i2 ? e2.shiftKey ? this.Reveal.slide(0) : !this.Reveal.overview.isActive() && h2 ? t2.rtl ? this.Reveal.next({ skipFragments: e2.altKey }) : this.Reveal.prev({ skipFragments: e2.altKey }) : this.Reveal.left({ skipFragments: e2.altKey }) : 76 === i2 || 39 === i2 ? e2.shiftKey ? this.Reveal.slide(this.Reveal.getHorizontalSlides().length - 1) : !this.Reveal.overview.isActive() && h2 ? t2.rtl ? this.Reveal.prev({ skipFragments: e2.altKey }) : this.Reveal.next({ skipFragments: e2.altKey }) : this.Reveal.right({ skipFragments: e2.altKey }) : 75 === i2 || 38 === i2 ? e2.shiftKey ? this.Reveal.slide(void 0, 0) : !this.Reveal.overview.isActive() && h2 ? this.Reveal.prev({ skipFragments: e2.altKey }) : this.Reveal.up({ skipFragments: e2.altKey }) : 74 === i2 || 40 === i2 ? e2.shiftKey ? this.Reveal.slide(void 0, Number.MAX_VALUE) : !this.Reveal.overview.isActive() && h2 ? this.Reveal.next({ skipFragments: e2.altKey }) : this.Reveal.down({ skipFragments: e2.altKey }) : 36 === i2 ? this.Reveal.slide(0) : 35 === i2 ? this.Reveal.slide(this.Reveal.getHorizontalSlides().length - 1) : 32 === i2 ? (this.Reveal.overview.isActive() && this.Reveal.overview.deactivate(), e2.shiftKey ? this.Reveal.prev({ skipFragments: e2.altKey }) : this.Reveal.next({ skipFragments: e2.altKey })) : [58, 59, 66, 86, 190].includes(i2) || 191 === i2 && !e2.shiftKey ? this.Reveal.togglePause() : 70 === i2 ? o(t2.embedded ? this.Reveal.getViewportElement() : document.documentElement) : 65 === i2 ? t2.autoSlideStoppable && this.Reveal.toggleAutoSlide(s2) : 71 === i2 ? t2.jumpToSlide && this.Reveal.toggleJumpToSlide() : 67 === i2 && this.Reveal.isOverlayOpen() ? this.Reveal.closeOverlay() : 63 !== i2 && 191 !== i2 || !e2.shiftKey ? 112 === i2 ? this.Reveal.toggleHelp() : u2 = false : this.Reveal.toggleHelp()), u2 ? e2.preventDefault && e2.preventDefault() : 27 !== i2 && 79 !== i2 || (false === this.Reveal.closeOverlay() && this.Reveal.overview.toggle(), e2.preventDefault && e2.preventDefault()), this.Reveal.cueAutoSlide();
  }
};
var N = class {
  constructor(e2) {
    __publicField(this, "MAX_REPLACE_STATE_FREQUENCY", 1e3);
    this.Reveal = e2, this.writeURLTimeout = 0, this.replaceStateTimestamp = 0, this.onWindowHashChange = this.onWindowHashChange.bind(this);
  }
  bind() {
    window.addEventListener("hashchange", this.onWindowHashChange, false);
  }
  unbind() {
    window.removeEventListener("hashchange", this.onWindowHashChange, false);
  }
  getIndicesFromHash(e2 = window.location.hash, t2 = {}) {
    let i2 = e2.replace(/^#\/?/, ""), s2 = i2.split("/");
    if (/^[0-9]*$/.test(s2[0]) || !i2.length) {
      const e3 = this.Reveal.getConfig();
      let i3, a2 = e3.hashOneBasedIndex || t2.oneBasedIndex ? 1 : 0, n2 = parseInt(s2[0], 10) - a2 || 0, r2 = parseInt(s2[1], 10) - a2 || 0;
      return e3.fragmentInURL && (i3 = parseInt(s2[2], 10), isNaN(i3) && (i3 = void 0)), { h: n2, v: r2, f: i3 };
    }
    {
      let e3, t3;
      /\/[-\d]+$/g.test(i2) && (t3 = parseInt(i2.split("/").pop(), 10), t3 = isNaN(t3) ? void 0 : t3, i2 = i2.split("/").shift());
      try {
        e3 = document.getElementById(decodeURIComponent(i2)).closest(".slides section");
      } catch (e4) {
      }
      if (e3) return { ...this.Reveal.getIndices(e3), f: t3 };
    }
    return null;
  }
  readURL() {
    const e2 = this.Reveal.getIndices(), t2 = this.getIndicesFromHash();
    t2 ? t2.h === e2.h && t2.v === e2.v && void 0 === t2.f || this.Reveal.slide(t2.h, t2.v, t2.f) : this.Reveal.slide(e2.h || 0, e2.v || 0);
  }
  writeURL(e2) {
    let t2 = this.Reveal.getConfig(), i2 = this.Reveal.getCurrentSlide();
    if (clearTimeout(this.writeURLTimeout), "number" == typeof e2) this.writeURLTimeout = setTimeout(this.writeURL, e2);
    else if (i2) {
      let e3 = this.getHash();
      t2.history ? window.location.hash = e3 : t2.hash && ("/" === e3 ? this.debouncedReplaceState(window.location.pathname + window.location.search) : this.debouncedReplaceState("#" + e3));
    }
  }
  replaceState(e2) {
    window.history.replaceState(null, null, e2), this.replaceStateTimestamp = Date.now();
  }
  debouncedReplaceState(e2) {
    clearTimeout(this.replaceStateTimeout), Date.now() - this.replaceStateTimestamp > this.MAX_REPLACE_STATE_FREQUENCY ? this.replaceState(e2) : this.replaceStateTimeout = setTimeout(() => this.replaceState(e2), this.MAX_REPLACE_STATE_FREQUENCY);
  }
  getHash(e2) {
    let t2 = "/", i2 = e2 || this.Reveal.getCurrentSlide(), s2 = i2 ? i2.getAttribute("id") : null;
    s2 && (s2 = encodeURIComponent(s2));
    let a2 = this.Reveal.getIndices(e2);
    if (this.Reveal.getConfig().fragmentInURL || (a2.f = void 0), "string" == typeof s2 && s2.length) t2 = "/" + s2, a2.f >= 0 && (t2 += "/" + a2.f);
    else {
      let e3 = this.Reveal.getConfig().hashOneBasedIndex ? 1 : 0;
      (a2.h > 0 || a2.v > 0 || a2.f >= 0) && (t2 += a2.h + e3), (a2.v > 0 || a2.f >= 0) && (t2 += "/" + (a2.v + e3)), a2.f >= 0 && (t2 += "/" + a2.f);
    }
    return t2;
  }
  onWindowHashChange(e2) {
    this.readURL();
  }
};
var I = class {
  constructor(e2) {
    this.Reveal = e2, this.onNavigateLeftClicked = this.onNavigateLeftClicked.bind(this), this.onNavigateRightClicked = this.onNavigateRightClicked.bind(this), this.onNavigateUpClicked = this.onNavigateUpClicked.bind(this), this.onNavigateDownClicked = this.onNavigateDownClicked.bind(this), this.onNavigatePrevClicked = this.onNavigatePrevClicked.bind(this), this.onNavigateNextClicked = this.onNavigateNextClicked.bind(this), this.onEnterFullscreen = this.onEnterFullscreen.bind(this);
  }
  render() {
    const e2 = this.Reveal.getConfig().rtl, i2 = this.Reveal.getRevealElement();
    this.element = document.createElement("aside"), this.element.className = "controls", this.element.innerHTML = `<button class="navigate-left" aria-label="${e2 ? "next slide" : "previous slide"}"><div class="controls-arrow"></div></button>
			<button class="navigate-right" aria-label="${e2 ? "previous slide" : "next slide"}"><div class="controls-arrow"></div></button>
			<button class="navigate-up" aria-label="above slide"><div class="controls-arrow"></div></button>
			<button class="navigate-down" aria-label="below slide"><div class="controls-arrow"></div></button>`, this.Reveal.getRevealElement().appendChild(this.element), this.controlsLeft = t(i2, ".navigate-left"), this.controlsRight = t(i2, ".navigate-right"), this.controlsUp = t(i2, ".navigate-up"), this.controlsDown = t(i2, ".navigate-down"), this.controlsPrev = t(i2, ".navigate-prev"), this.controlsNext = t(i2, ".navigate-next"), this.controlsFullscreen = t(i2, ".enter-fullscreen"), this.controlsRightArrow = this.element.querySelector(".navigate-right"), this.controlsLeftArrow = this.element.querySelector(".navigate-left"), this.controlsDownArrow = this.element.querySelector(".navigate-down");
  }
  configure(e2, t2) {
    this.element.style.display = e2.controls && ("speaker-only" !== e2.controls || this.Reveal.isSpeakerNotes()) ? "block" : "none", this.element.setAttribute("data-controls-layout", e2.controlsLayout), this.element.setAttribute("data-controls-back-arrows", e2.controlsBackArrows);
  }
  bind() {
    let e2 = ["touchstart", "click"];
    g && (e2 = ["touchstart"]), e2.forEach((e3) => {
      this.controlsLeft.forEach((t2) => t2.addEventListener(e3, this.onNavigateLeftClicked, false)), this.controlsRight.forEach((t2) => t2.addEventListener(e3, this.onNavigateRightClicked, false)), this.controlsUp.forEach((t2) => t2.addEventListener(e3, this.onNavigateUpClicked, false)), this.controlsDown.forEach((t2) => t2.addEventListener(e3, this.onNavigateDownClicked, false)), this.controlsPrev.forEach((t2) => t2.addEventListener(e3, this.onNavigatePrevClicked, false)), this.controlsNext.forEach((t2) => t2.addEventListener(e3, this.onNavigateNextClicked, false)), this.controlsFullscreen.forEach((t2) => t2.addEventListener(e3, this.onEnterFullscreen, false));
    });
  }
  unbind() {
    ["touchstart", "click"].forEach((e2) => {
      this.controlsLeft.forEach((t2) => t2.removeEventListener(e2, this.onNavigateLeftClicked, false)), this.controlsRight.forEach((t2) => t2.removeEventListener(e2, this.onNavigateRightClicked, false)), this.controlsUp.forEach((t2) => t2.removeEventListener(e2, this.onNavigateUpClicked, false)), this.controlsDown.forEach((t2) => t2.removeEventListener(e2, this.onNavigateDownClicked, false)), this.controlsPrev.forEach((t2) => t2.removeEventListener(e2, this.onNavigatePrevClicked, false)), this.controlsNext.forEach((t2) => t2.removeEventListener(e2, this.onNavigateNextClicked, false)), this.controlsFullscreen.forEach((t2) => t2.removeEventListener(e2, this.onEnterFullscreen, false));
    });
  }
  update() {
    let e2 = this.Reveal.availableRoutes();
    [...this.controlsLeft, ...this.controlsRight, ...this.controlsUp, ...this.controlsDown, ...this.controlsPrev, ...this.controlsNext].forEach((e3) => {
      e3.classList.remove("enabled", "fragmented"), e3.setAttribute("disabled", "disabled");
    }), e2.left && this.controlsLeft.forEach((e3) => {
      e3.classList.add("enabled"), e3.removeAttribute("disabled");
    }), e2.right && this.controlsRight.forEach((e3) => {
      e3.classList.add("enabled"), e3.removeAttribute("disabled");
    }), e2.up && this.controlsUp.forEach((e3) => {
      e3.classList.add("enabled"), e3.removeAttribute("disabled");
    }), e2.down && this.controlsDown.forEach((e3) => {
      e3.classList.add("enabled"), e3.removeAttribute("disabled");
    }), (e2.left || e2.up) && this.controlsPrev.forEach((e3) => {
      e3.classList.add("enabled"), e3.removeAttribute("disabled");
    }), (e2.right || e2.down) && this.controlsNext.forEach((e3) => {
      e3.classList.add("enabled"), e3.removeAttribute("disabled");
    });
    let t2 = this.Reveal.getCurrentSlide();
    if (t2) {
      let e3 = this.Reveal.fragments.availableRoutes();
      e3.prev && this.controlsPrev.forEach((e4) => {
        e4.classList.add("fragmented", "enabled"), e4.removeAttribute("disabled");
      }), e3.next && this.controlsNext.forEach((e4) => {
        e4.classList.add("fragmented", "enabled"), e4.removeAttribute("disabled");
      });
      const i2 = this.Reveal.isVerticalSlide(t2), s2 = i2 && t2.parentElement && t2.parentElement.querySelectorAll(":scope > section").length > 1;
      i2 && s2 ? (e3.prev && this.controlsUp.forEach((e4) => {
        e4.classList.add("fragmented", "enabled"), e4.removeAttribute("disabled");
      }), e3.next && this.controlsDown.forEach((e4) => {
        e4.classList.add("fragmented", "enabled"), e4.removeAttribute("disabled");
      })) : (e3.prev && this.controlsLeft.forEach((e4) => {
        e4.classList.add("fragmented", "enabled"), e4.removeAttribute("disabled");
      }), e3.next && this.controlsRight.forEach((e4) => {
        e4.classList.add("fragmented", "enabled"), e4.removeAttribute("disabled");
      }));
    }
    if (this.Reveal.getConfig().controlsTutorial) {
      let t3 = this.Reveal.getIndices();
      !this.Reveal.hasNavigatedVertically() && e2.down ? this.controlsDownArrow.classList.add("highlight") : (this.controlsDownArrow.classList.remove("highlight"), this.Reveal.getConfig().rtl ? !this.Reveal.hasNavigatedHorizontally() && e2.left && 0 === t3.v ? this.controlsLeftArrow.classList.add("highlight") : this.controlsLeftArrow.classList.remove("highlight") : !this.Reveal.hasNavigatedHorizontally() && e2.right && 0 === t3.v ? this.controlsRightArrow.classList.add("highlight") : this.controlsRightArrow.classList.remove("highlight"));
    }
  }
  destroy() {
    this.unbind(), this.element.remove();
  }
  onNavigateLeftClicked(e2) {
    e2.preventDefault(), this.Reveal.onUserInput(), "linear" === this.Reveal.getConfig().navigationMode ? this.Reveal.prev() : this.Reveal.left();
  }
  onNavigateRightClicked(e2) {
    e2.preventDefault(), this.Reveal.onUserInput(), "linear" === this.Reveal.getConfig().navigationMode ? this.Reveal.next() : this.Reveal.right();
  }
  onNavigateUpClicked(e2) {
    e2.preventDefault(), this.Reveal.onUserInput(), this.Reveal.up();
  }
  onNavigateDownClicked(e2) {
    e2.preventDefault(), this.Reveal.onUserInput(), this.Reveal.down();
  }
  onNavigatePrevClicked(e2) {
    e2.preventDefault(), this.Reveal.onUserInput(), this.Reveal.prev();
  }
  onNavigateNextClicked(e2) {
    e2.preventDefault(), this.Reveal.onUserInput(), this.Reveal.next();
  }
  onEnterFullscreen(e2) {
    const t2 = this.Reveal.getConfig(), i2 = this.Reveal.getViewportElement();
    o(t2.embedded ? i2 : i2.parentElement);
  }
};
var M = class {
  constructor(e2) {
    this.Reveal = e2, this.onProgressClicked = this.onProgressClicked.bind(this);
  }
  render() {
    this.element = document.createElement("div"), this.element.className = "progress", this.Reveal.getRevealElement().appendChild(this.element), this.bar = document.createElement("span"), this.element.appendChild(this.bar);
  }
  configure(e2, t2) {
    this.element.style.display = e2.progress ? "block" : "none";
  }
  bind() {
    this.Reveal.getConfig().progress && this.element && this.element.addEventListener("click", this.onProgressClicked, false);
  }
  unbind() {
    this.Reveal.getConfig().progress && this.element && this.element.removeEventListener("click", this.onProgressClicked, false);
  }
  update() {
    if (this.Reveal.getConfig().progress && this.bar) {
      let e2 = this.Reveal.getProgress();
      this.Reveal.getTotalSlides() < 2 && (e2 = 0), this.bar.style.transform = "scaleX(" + e2 + ")";
    }
  }
  getMaxWidth() {
    return this.Reveal.getRevealElement().offsetWidth;
  }
  onProgressClicked(e2) {
    this.Reveal.onUserInput(e2), e2.preventDefault();
    let t2 = this.Reveal.getSlides(), i2 = t2.length, s2 = Math.floor(e2.clientX / this.getMaxWidth() * i2);
    this.Reveal.getConfig().rtl && (s2 = i2 - s2);
    let a2 = this.Reveal.getIndices(t2[s2]);
    this.Reveal.slide(a2.h, a2.v);
  }
  destroy() {
    this.element.remove();
  }
};
var B = class {
  constructor(e2) {
    this.Reveal = e2, this.lastMouseWheelStep = 0, this.cursorHidden = false, this.cursorInactiveTimeout = 0, this.onDocumentCursorActive = this.onDocumentCursorActive.bind(this), this.onDocumentMouseScroll = this.onDocumentMouseScroll.bind(this);
  }
  configure(e2, t2) {
    e2.mouseWheel ? document.addEventListener("wheel", this.onDocumentMouseScroll, false) : document.removeEventListener("wheel", this.onDocumentMouseScroll, false), e2.hideInactiveCursor ? (document.addEventListener("mousemove", this.onDocumentCursorActive, false), document.addEventListener("mousedown", this.onDocumentCursorActive, false)) : (this.showCursor(), document.removeEventListener("mousemove", this.onDocumentCursorActive, false), document.removeEventListener("mousedown", this.onDocumentCursorActive, false));
  }
  showCursor() {
    this.cursorHidden && (this.cursorHidden = false, this.Reveal.getRevealElement().style.cursor = "");
  }
  hideCursor() {
    false === this.cursorHidden && (this.cursorHidden = true, this.Reveal.getRevealElement().style.cursor = "none");
  }
  destroy() {
    this.showCursor(), document.removeEventListener("wheel", this.onDocumentMouseScroll, false), document.removeEventListener("mousemove", this.onDocumentCursorActive, false), document.removeEventListener("mousedown", this.onDocumentCursorActive, false);
  }
  onDocumentCursorActive(e2) {
    this.showCursor(), clearTimeout(this.cursorInactiveTimeout), this.cursorInactiveTimeout = setTimeout(this.hideCursor.bind(this), this.Reveal.getConfig().hideCursorTime);
  }
  onDocumentMouseScroll(e2) {
    if (Date.now() - this.lastMouseWheelStep > 1e3) {
      this.lastMouseWheelStep = Date.now();
      let t2 = e2.detail || -e2.wheelDelta;
      t2 > 0 ? this.Reveal.next() : t2 < 0 && this.Reveal.prev();
    }
  }
};
var H = (e2, t2) => {
  const i2 = document.createElement("script");
  i2.type = "text/javascript", i2.async = false, i2.defer = false, i2.src = e2, "function" == typeof t2 && (i2.onload = i2.onreadystatechange = (e3) => {
    ("load" === e3.type || /loaded|complete/.test(i2.readyState)) && (i2.onload = i2.onreadystatechange = i2.onerror = null, t2());
  }, i2.onerror = (e3) => {
    i2.onload = i2.onreadystatechange = i2.onerror = null, t2(new Error("Failed loading script: " + i2.src + "\n" + e3));
  });
  const s2 = document.querySelector("head");
  s2.insertBefore(i2, s2.lastChild);
};
var D = class {
  constructor(e2) {
    this.Reveal = e2, this.state = "idle", this.registeredPlugins = {}, this.asyncDependencies = [];
  }
  load(e2, t2) {
    return this.state = "loading", e2.forEach(this.registerPlugin.bind(this)), new Promise((e3) => {
      let i2 = [], s2 = 0;
      if (t2.forEach((e4) => {
        e4.condition && !e4.condition() || (e4.async ? this.asyncDependencies.push(e4) : i2.push(e4));
      }), i2.length) {
        s2 = i2.length;
        const t3 = (t4) => {
          t4 && "function" == typeof t4.callback && t4.callback(), 0 == --s2 && this.initPlugins().then(e3);
        };
        i2.forEach((e4) => {
          "string" == typeof e4.id ? (this.registerPlugin(e4), t3(e4)) : "string" == typeof e4.src ? H(e4.src, () => t3(e4)) : (console.warn("Unrecognized plugin format", e4), t3());
        });
      } else this.initPlugins().then(e3);
    });
  }
  initPlugins() {
    return new Promise((e2) => {
      let t2 = Object.values(this.registeredPlugins), i2 = t2.length;
      if (0 === i2) this.loadAsync().then(e2);
      else {
        let s2, a2 = () => {
          0 == --i2 ? this.loadAsync().then(e2) : s2();
        }, n2 = 0;
        s2 = () => {
          let e3 = t2[n2++];
          if ("function" == typeof e3.init) {
            let t3 = e3.init(this.Reveal);
            t3 && "function" == typeof t3.then ? t3.then(a2) : a2();
          } else a2();
        }, s2();
      }
    });
  }
  loadAsync() {
    return this.state = "loaded", this.asyncDependencies.length && this.asyncDependencies.forEach((e2) => {
      H(e2.src, e2.callback);
    }), Promise.resolve();
  }
  registerPlugin(e2) {
    2 === arguments.length && "string" == typeof arguments[0] ? (e2 = arguments[1]).id = arguments[0] : "function" == typeof e2 && (e2 = e2());
    let t2 = e2.id;
    "string" != typeof t2 ? console.warn("Unrecognized plugin format; can't find plugin.id", e2) : void 0 === this.registeredPlugins[t2] ? (this.registeredPlugins[t2] = e2, "loaded" === this.state && "function" == typeof e2.init && e2.init(this.Reveal)) : console.warn('reveal.js: "' + t2 + '" plugin has already been registered');
  }
  hasPlugin(e2) {
    return !!this.registeredPlugins[e2];
  }
  getPlugin(e2) {
    return this.registeredPlugins[e2];
  }
  getRegisteredPlugins() {
    return this.registeredPlugins;
  }
  destroy() {
    Object.values(this.registeredPlugins).forEach((e2) => {
      "function" == typeof e2.destroy && e2.destroy();
    }), this.registeredPlugins = {}, this.asyncDependencies = [];
  }
};
var F = class {
  constructor(e2) {
    this.Reveal = e2, this.onSlidesClicked = this.onSlidesClicked.bind(this), this.iframeTriggerSelector = null, this.mediaTriggerSelector = "[data-preview-image], [data-preview-video]", this.stateProps = ["previewIframe", "previewImage", "previewVideo", "previewFit"], this.state = {};
  }
  update() {
    this.Reveal.getConfig().previewLinks ? this.iframeTriggerSelector = "a[href]:not([data-preview-link=false]), [data-preview-link]:not(a):not([data-preview-link=false])" : this.iframeTriggerSelector = "[data-preview-link]:not([data-preview-link=false])";
    const e2 = this.Reveal.getSlidesElement().querySelectorAll(this.iframeTriggerSelector).length > 0, t2 = this.Reveal.getSlidesElement().querySelectorAll(this.mediaTriggerSelector).length > 0;
    e2 || t2 ? this.Reveal.getSlidesElement().addEventListener("click", this.onSlidesClicked, false) : this.Reveal.getSlidesElement().removeEventListener("click", this.onSlidesClicked, false);
  }
  createOverlay(e2) {
    this.dom = document.createElement("div"), this.dom.classList.add("r-overlay"), this.dom.classList.add(e2), this.viewport = document.createElement("div"), this.viewport.classList.add("r-overlay-viewport"), this.dom.appendChild(this.viewport), this.Reveal.getRevealElement().appendChild(this.dom);
  }
  previewIframe(e2) {
    this.close(), this.state = { previewIframe: e2 }, this.createOverlay("r-overlay-preview"), this.dom.dataset.state = "loading", this.viewport.innerHTML = `<header class="r-overlay-header">
				<a class="r-overlay-button r-overlay-external" href="${e2}" target="_blank"><span class="icon"></span></a>
				<button class="r-overlay-button r-overlay-close"><span class="icon"></span></button>
			</header>
			<div class="r-overlay-spinner"></div>
			<div class="r-overlay-content">
				<iframe src="${e2}"></iframe>
				<small class="r-overlay-content-inner">
					<span class="r-overlay-error x-frame-error">Unable to load iframe. This is likely due to the site's policy (x-frame-options).</span>
				</small>
			</div>`, this.dom.querySelector("iframe").addEventListener("load", (e3) => {
      this.dom.dataset.state = "loaded";
    }, false), this.dom.querySelector(".r-overlay-close").addEventListener("click", (e3) => {
      this.close(), e3.preventDefault();
    }, false), this.dom.querySelector(".r-overlay-external").addEventListener("click", (e3) => {
      this.close();
    }, false), this.Reveal.dispatchEvent({ type: "previewiframe", data: { url: e2 } });
  }
  previewMedia(e2, t2, i2) {
    if ("image" !== t2 && "video" !== t2) return void console.warn("Please specify a valid media type to preview (image|video)");
    this.close(), i2 = i2 || "scale-down", this.createOverlay("r-overlay-preview"), this.dom.dataset.state = "loading", this.dom.dataset.previewFit = i2, this.viewport.innerHTML = '<header class="r-overlay-header">\n				<button class="r-overlay-button r-overlay-close">Esc <span class="icon"></span></button>\n			</header>\n			<div class="r-overlay-spinner"></div>\n			<div class="r-overlay-content"></div>';
    const s2 = this.dom.querySelector(".r-overlay-content");
    if ("image" === t2) {
      this.state = { previewImage: e2, previewFit: i2 };
      const t3 = document.createElement("img", {});
      t3.src = e2, s2.appendChild(t3), t3.addEventListener("load", () => {
        this.dom.dataset.state = "loaded";
      }, false), t3.addEventListener("error", () => {
        this.dom.dataset.state = "error", s2.innerHTML = '<span class="r-overlay-error">Unable to load image.</span>';
      }, false), this.dom.style.cursor = "zoom-out", this.dom.addEventListener("click", (e3) => {
        this.close();
      }, false), this.Reveal.dispatchEvent({ type: "previewimage", data: { url: e2 } });
    } else {
      if ("video" !== t2) throw new Error("Please specify a valid media type to preview");
      {
        this.state = { previewVideo: e2, previewFit: i2 };
        const t3 = document.createElement("video");
        t3.autoplay = "false" !== this.dom.dataset.previewAutoplay, t3.controls = "false" !== this.dom.dataset.previewControls, t3.loop = "true" === this.dom.dataset.previewLoop, t3.muted = "true" === this.dom.dataset.previewMuted, t3.playsInline = true, t3.src = e2, s2.appendChild(t3), t3.addEventListener("loadeddata", () => {
          this.dom.dataset.state = "loaded";
        }, false), t3.addEventListener("error", () => {
          this.dom.dataset.state = "error", s2.innerHTML = '<span class="r-overlay-error">Unable to load video.</span>';
        }, false), this.Reveal.dispatchEvent({ type: "previewvideo", data: { url: e2 } });
      }
    }
    this.dom.querySelector(".r-overlay-close").addEventListener("click", (e3) => {
      this.close(), e3.preventDefault();
    }, false);
  }
  previewImage(e2, t2) {
    this.previewMedia(e2, "image", t2);
  }
  previewVideo(e2, t2) {
    this.previewMedia(e2, "video", t2);
  }
  toggleHelp(e2) {
    "boolean" == typeof e2 ? e2 ? this.showHelp() : this.close() : this.dom ? this.close() : this.showHelp();
  }
  showHelp() {
    if (this.Reveal.getConfig().help) {
      this.close(), this.createOverlay("r-overlay-help");
      let e2 = '<p class="title">Keyboard Shortcuts</p>', t2 = this.Reveal.keyboard.getShortcuts(), i2 = this.Reveal.keyboard.getBindings();
      e2 += "<table><th>KEY</th><th>ACTION</th>";
      for (let i3 in t2) e2 += `<tr><td>${i3}</td><td>${t2[i3]}</td></tr>`;
      for (let t3 in i2) i2[t3].key && i2[t3].description && (e2 += `<tr><td>${i2[t3].key}</td><td>${i2[t3].description}</td></tr>`);
      e2 += "</table>", this.viewport.innerHTML = `
				<header class="r-overlay-header">
					<button class="r-overlay-button r-overlay-close">Esc <span class="icon"></span></button>
				</header>
				<div class="r-overlay-content">
					<div class="r-overlay-help-content">${e2}</div>
				</div>
			`, this.dom.querySelector(".r-overlay-close").addEventListener("click", (e3) => {
        this.close(), e3.preventDefault();
      }, false), this.Reveal.dispatchEvent({ type: "showhelp" });
    }
  }
  isOpen() {
    return !!this.dom;
  }
  close() {
    return !!this.dom && (this.dom.remove(), this.dom = null, this.state = {}, this.Reveal.dispatchEvent({ type: "closeoverlay" }), true);
  }
  getState() {
    return this.state;
  }
  setState(e2) {
    this.stateProps.every((t2) => this.state[t2] === e2[t2]) || (e2.previewIframe ? this.previewIframe(e2.previewIframe) : e2.previewImage ? this.previewImage(e2.previewImage, e2.previewFit) : e2.previewVideo ? this.previewVideo(e2.previewVideo, e2.previewFit) : this.close());
  }
  onSlidesClicked(e2) {
    const t2 = e2.target, i2 = t2.closest(this.iframeTriggerSelector), s2 = t2.closest(this.mediaTriggerSelector);
    if (i2) {
      if (e2.metaKey || e2.shiftKey || e2.altKey) return;
      let t3 = i2.getAttribute("href") || i2.getAttribute("data-preview-link");
      t3 && (this.previewIframe(t3), e2.preventDefault());
    } else if (s2) {
      if (s2.hasAttribute("data-preview-image")) {
        let t3 = s2.dataset.previewImage || s2.getAttribute("src");
        t3 && (this.previewImage(t3, s2.dataset.previewFit), e2.preventDefault());
      } else if (s2.hasAttribute("data-preview-video")) {
        let t3 = s2.dataset.previewVideo || s2.getAttribute("src");
        if (!t3) {
          let e3 = s2.querySelector("source");
          e3 && (t3 = e3.getAttribute("src"));
        }
        t3 && (this.previewVideo(t3, s2.dataset.previewFit), e2.preventDefault());
      }
    }
  }
  destroy() {
    this.close();
  }
};
var z = class {
  constructor(e2) {
    this.Reveal = e2, this.touchStartX = 0, this.touchStartY = 0, this.touchStartCount = 0, this.touchCaptured = false, this.onPointerDown = this.onPointerDown.bind(this), this.onPointerMove = this.onPointerMove.bind(this), this.onPointerUp = this.onPointerUp.bind(this), this.onTouchStart = this.onTouchStart.bind(this), this.onTouchMove = this.onTouchMove.bind(this), this.onTouchEnd = this.onTouchEnd.bind(this);
  }
  bind() {
    let e2 = this.Reveal.getRevealElement();
    "onpointerdown" in window ? (e2.addEventListener("pointerdown", this.onPointerDown, false), e2.addEventListener("pointermove", this.onPointerMove, false), e2.addEventListener("pointerup", this.onPointerUp, false)) : window.navigator.msPointerEnabled ? (e2.addEventListener("MSPointerDown", this.onPointerDown, false), e2.addEventListener("MSPointerMove", this.onPointerMove, false), e2.addEventListener("MSPointerUp", this.onPointerUp, false)) : (e2.addEventListener("touchstart", this.onTouchStart, false), e2.addEventListener("touchmove", this.onTouchMove, false), e2.addEventListener("touchend", this.onTouchEnd, false));
  }
  unbind() {
    let e2 = this.Reveal.getRevealElement();
    e2.removeEventListener("pointerdown", this.onPointerDown, false), e2.removeEventListener("pointermove", this.onPointerMove, false), e2.removeEventListener("pointerup", this.onPointerUp, false), e2.removeEventListener("MSPointerDown", this.onPointerDown, false), e2.removeEventListener("MSPointerMove", this.onPointerMove, false), e2.removeEventListener("MSPointerUp", this.onPointerUp, false), e2.removeEventListener("touchstart", this.onTouchStart, false), e2.removeEventListener("touchmove", this.onTouchMove, false), e2.removeEventListener("touchend", this.onTouchEnd, false);
  }
  isSwipePrevented(e2) {
    if (n(e2, "video[controls], audio[controls]")) return true;
    for (; e2 && "function" == typeof e2.hasAttribute; ) {
      if (e2.hasAttribute("data-prevent-swipe")) return true;
      e2 = e2.parentNode;
    }
    return false;
  }
  onTouchStart(e2) {
    if (this.touchCaptured = false, this.isSwipePrevented(e2.target)) return true;
    this.touchStartX = e2.touches[0].clientX, this.touchStartY = e2.touches[0].clientY, this.touchStartCount = e2.touches.length;
  }
  onTouchMove(e2) {
    if (this.isSwipePrevented(e2.target)) return true;
    let t2 = this.Reveal.getConfig();
    if (this.touchCaptured) g && e2.preventDefault();
    else {
      this.Reveal.onUserInput(e2);
      let i2 = e2.touches[0].clientX, s2 = e2.touches[0].clientY;
      if (1 === e2.touches.length && 2 !== this.touchStartCount) {
        let a2 = this.Reveal.availableRoutes({ includeFragments: true }), n2 = i2 - this.touchStartX, r2 = s2 - this.touchStartY;
        n2 > 40 && Math.abs(n2) > Math.abs(r2) ? (this.touchCaptured = true, "linear" === t2.navigationMode ? t2.rtl ? this.Reveal.next() : this.Reveal.prev() : this.Reveal.left()) : n2 < -40 && Math.abs(n2) > Math.abs(r2) ? (this.touchCaptured = true, "linear" === t2.navigationMode ? t2.rtl ? this.Reveal.prev() : this.Reveal.next() : this.Reveal.right()) : r2 > 40 && a2.up ? (this.touchCaptured = true, "linear" === t2.navigationMode ? this.Reveal.prev() : this.Reveal.up()) : r2 < -40 && a2.down && (this.touchCaptured = true, "linear" === t2.navigationMode ? this.Reveal.next() : this.Reveal.down()), t2.embedded ? (this.touchCaptured || this.Reveal.isVerticalSlide()) && e2.preventDefault() : e2.preventDefault();
      }
    }
  }
  onTouchEnd(e2) {
    this.touchCaptured = false;
  }
  onPointerDown(e2) {
    e2.pointerType !== e2.MSPOINTER_TYPE_TOUCH && "touch" !== e2.pointerType || (e2.touches = [{ clientX: e2.clientX, clientY: e2.clientY }], this.onTouchStart(e2));
  }
  onPointerMove(e2) {
    e2.pointerType !== e2.MSPOINTER_TYPE_TOUCH && "touch" !== e2.pointerType || (e2.touches = [{ clientX: e2.clientX, clientY: e2.clientY }], this.onTouchMove(e2));
  }
  onPointerUp(e2) {
    e2.pointerType !== e2.MSPOINTER_TYPE_TOUCH && "touch" !== e2.pointerType || (e2.touches = [{ clientX: e2.clientX, clientY: e2.clientY }], this.onTouchEnd(e2));
  }
};
var q = "focus";
var O = "blur";
var V = class {
  constructor(e2) {
    this.Reveal = e2, this.onRevealPointerDown = this.onRevealPointerDown.bind(this), this.onDocumentPointerDown = this.onDocumentPointerDown.bind(this);
  }
  configure(e2, t2) {
    e2.embedded ? this.blur() : (this.focus(), this.unbind());
  }
  bind() {
    this.Reveal.getConfig().embedded && this.Reveal.getRevealElement().addEventListener("pointerdown", this.onRevealPointerDown, false);
  }
  unbind() {
    this.Reveal.getRevealElement().removeEventListener("pointerdown", this.onRevealPointerDown, false), document.removeEventListener("pointerdown", this.onDocumentPointerDown, false);
  }
  focus() {
    this.state !== q && (this.Reveal.getRevealElement().classList.add("focused"), document.addEventListener("pointerdown", this.onDocumentPointerDown, false)), this.state = q;
  }
  blur() {
    this.state !== O && (this.Reveal.getRevealElement().classList.remove("focused"), document.removeEventListener("pointerdown", this.onDocumentPointerDown, false)), this.state = O;
  }
  isFocused() {
    return this.state === q;
  }
  destroy() {
    this.Reveal.getRevealElement().classList.remove("focused");
  }
  onRevealPointerDown(e2) {
    this.focus();
  }
  onDocumentPointerDown(e2) {
    let t2 = r(e2.target, ".reveal");
    t2 && t2 === this.Reveal.getRevealElement() || this.blur();
  }
};
var U = class {
  constructor(e2) {
    this.Reveal = e2;
  }
  render() {
    this.element = document.createElement("div"), this.element.className = "speaker-notes", this.element.setAttribute("data-prevent-swipe", ""), this.element.setAttribute("tabindex", "0"), this.Reveal.getRevealElement().appendChild(this.element);
  }
  configure(e2, t2) {
    e2.showNotes && this.element.setAttribute("data-layout", "string" == typeof e2.showNotes ? e2.showNotes : "inline");
  }
  update() {
    this.Reveal.getConfig().showNotes && this.element && this.Reveal.getCurrentSlide() && !this.Reveal.isScrollView() && !this.Reveal.isPrintView() && (this.element.innerHTML = this.getSlideNotes() || '<span class="notes-placeholder">No notes on this slide.</span>');
  }
  updateVisibility() {
    this.Reveal.getConfig().showNotes && this.hasNotes() && !this.Reveal.isScrollView() && !this.Reveal.isPrintView() ? this.Reveal.getRevealElement().classList.add("show-notes") : this.Reveal.getRevealElement().classList.remove("show-notes");
  }
  hasNotes() {
    return this.Reveal.getSlidesElement().querySelectorAll("[data-notes], aside.notes").length > 0;
  }
  isSpeakerNotesWindow() {
    return !!window.location.search.match(/receiver/gi);
  }
  getSlideNotes(e2 = this.Reveal.getCurrentSlide()) {
    if (e2.hasAttribute("data-notes")) return e2.getAttribute("data-notes");
    let t2 = e2.querySelectorAll("aside.notes");
    return t2 ? Array.from(t2).map((e3) => e3.innerHTML).join("\n") : null;
  }
  destroy() {
    this.element.remove();
  }
};
var W = class {
  constructor(e2, t2) {
    this.diameter = 100, this.diameter2 = this.diameter / 2, this.thickness = 6, this.playing = false, this.progress = 0, this.progressOffset = 1, this.container = e2, this.progressCheck = t2, this.canvas = document.createElement("canvas"), this.canvas.className = "playback", this.canvas.width = this.diameter, this.canvas.height = this.diameter, this.canvas.style.width = this.diameter2 + "px", this.canvas.style.height = this.diameter2 + "px", this.context = this.canvas.getContext("2d"), this.container.appendChild(this.canvas), this.render();
  }
  setPlaying(e2) {
    const t2 = this.playing;
    this.playing = e2, !t2 && this.playing ? this.animate() : this.render();
  }
  animate() {
    const e2 = this.progress;
    this.progress = this.progressCheck(), e2 > 0.8 && this.progress < 0.2 && (this.progressOffset = this.progress), this.render(), this.playing && requestAnimationFrame(this.animate.bind(this));
  }
  render() {
    let e2 = this.playing ? this.progress : 0, t2 = this.diameter2 - this.thickness, i2 = this.diameter2, s2 = this.diameter2, a2 = 28;
    this.progressOffset += 0.1 * (1 - this.progressOffset);
    const n2 = -Math.PI / 2 + e2 * (2 * Math.PI), r2 = -Math.PI / 2 + this.progressOffset * (2 * Math.PI);
    this.context.save(), this.context.clearRect(0, 0, this.diameter, this.diameter), this.context.beginPath(), this.context.arc(i2, s2, t2 + 4, 0, 2 * Math.PI, false), this.context.fillStyle = "rgba( 0, 0, 0, 0.4 )", this.context.fill(), this.context.beginPath(), this.context.arc(i2, s2, t2, 0, 2 * Math.PI, false), this.context.lineWidth = this.thickness, this.context.strokeStyle = "rgba( 255, 255, 255, 0.2 )", this.context.stroke(), this.playing && (this.context.beginPath(), this.context.arc(i2, s2, t2, r2, n2, false), this.context.lineWidth = this.thickness, this.context.strokeStyle = "#fff", this.context.stroke()), this.context.translate(i2 - 14, s2 - 14), this.playing ? (this.context.fillStyle = "#fff", this.context.fillRect(0, 0, 10, a2), this.context.fillRect(18, 0, 10, a2)) : (this.context.beginPath(), this.context.translate(4, 0), this.context.moveTo(0, 0), this.context.lineTo(24, 14), this.context.lineTo(0, a2), this.context.fillStyle = "#fff", this.context.fill()), this.context.restore();
  }
  on(e2, t2) {
    this.canvas.addEventListener(e2, t2, false);
  }
  off(e2, t2) {
    this.canvas.removeEventListener(e2, t2, false);
  }
  destroy() {
    this.playing = false, this.canvas.parentNode && this.container.removeChild(this.canvas);
  }
};
var j = { width: 960, height: 700, margin: 0.04, minScale: 0.2, maxScale: 2, controls: true, controlsTutorial: true, controlsLayout: "bottom-right", controlsBackArrows: "faded", progress: true, slideNumber: false, showSlideNumber: "all", hashOneBasedIndex: false, hash: false, respondToHashChanges: true, jumpToSlide: true, history: false, keyboard: true, keyboardCondition: null, disableLayout: false, overview: true, center: true, touch: true, loop: false, rtl: false, navigationMode: "default", shuffle: false, fragments: true, fragmentInURL: true, embedded: false, help: true, pause: true, showNotes: false, showHiddenSlides: false, autoPlayMedia: null, preloadIframes: null, autoAnimate: true, autoAnimateMatcher: null, autoAnimateEasing: "ease", autoAnimateDuration: 1, autoAnimateUnmatched: true, autoAnimateStyles: ["opacity", "color", "background-color", "padding", "font-size", "line-height", "letter-spacing", "border-width", "border-color", "border-radius", "outline", "outline-offset"], autoSlide: 0, autoSlideStoppable: true, autoSlideMethod: null, defaultTiming: null, mouseWheel: false, previewLinks: false, postMessage: true, postMessageEvents: false, focusBodyOnPageVisibilityChange: true, transition: "slide", transitionSpeed: "default", backgroundTransition: "fade", parallaxBackgroundImage: "", parallaxBackgroundSize: "", parallaxBackgroundRepeat: "", parallaxBackgroundPosition: "", parallaxBackgroundHorizontal: null, parallaxBackgroundVertical: null, view: null, scrollLayout: "full", scrollSnap: "mandatory", scrollProgress: "auto", scrollActivationWidth: 435, pdfMaxPagesPerSlide: Number.POSITIVE_INFINITY, pdfSeparateFragments: true, pdfPageHeightOffset: -1, viewDistance: 3, mobileViewDistance: 2, display: "block", hideInactiveCursor: true, hideCursorTime: 5e3, sortFragmentsOnSync: true, dependencies: [], plugins: [] };
var K = "5.2.1";
function $(n2, o2) {
  arguments.length < 2 && (o2 = arguments[0], n2 = document.querySelector(".reveal"));
  const l2 = {};
  let c2, h2, g2, v2, S2, A2 = {}, H2 = false, q2 = false, O2 = { hasNavigatedHorizontally: false, hasNavigatedVertically: false }, $2 = [], X2 = 1, Y2 = { layout: "", overview: "" }, _ = {}, J = "idle", G = 0, Q = 0, Z = -1, ee = false, te = new p(l2), ie = new w(l2), se = new E(l2), ae = new k(l2), ne = new R(l2), re = new L(l2), oe = new C(l2), le = new x(l2), de = new P(l2), ce = new T(l2), he = new N(l2), ue = new I(l2), ge = new M(l2), ve = new B(l2), pe = new D(l2), me = new F(l2), fe = new V(l2), ye = new z(l2), be = new U(l2);
  function we() {
    false !== H2 && (q2 = true, A2.showHiddenSlides || t(_.wrapper, 'section[data-visibility="hidden"]').forEach((e2) => {
      const t2 = e2.parentNode;
      1 === t2.childElementCount && /section/i.test(t2.nodeName) ? t2.remove() : e2.remove();
    }), function() {
      _.slides.classList.add("no-transition"), u ? _.wrapper.classList.add("no-hover") : _.wrapper.classList.remove("no-hover");
      ne.render(), ie.render(), se.render(), ue.render(), ge.render(), be.render(), _.pauseOverlay = ((e2, t2, i2, s2 = "") => {
        let a2 = e2.querySelectorAll("." + i2);
        for (let t3 = 0; t3 < a2.length; t3++) {
          let i3 = a2[t3];
          if (i3.parentNode === e2) return i3;
        }
        let n3 = document.createElement(t2);
        return n3.className = i2, n3.innerHTML = s2, e2.appendChild(n3), n3;
      })(_.wrapper, "div", "pause-overlay", A2.controls ? '<button class="resume-button">Resume presentation</button>' : null), _.statusElement = function() {
        let e2 = _.wrapper.querySelector(".aria-status");
        e2 || (e2 = document.createElement("div"), e2.style.position = "absolute", e2.style.height = "1px", e2.style.width = "1px", e2.style.overflow = "hidden", e2.style.clip = "rect( 1px, 1px, 1px, 1px )", e2.classList.add("aria-status"), e2.setAttribute("aria-live", "polite"), e2.setAttribute("aria-atomic", "true"), _.wrapper.appendChild(e2));
        return e2;
      }(), _.wrapper.setAttribute("role", "application");
    }(), A2.postMessage && window.addEventListener("message", wt, false), setInterval(() => {
      (!re.isActive() && 0 !== _.wrapper.scrollTop || 0 !== _.wrapper.scrollLeft) && (_.wrapper.scrollTop = 0, _.wrapper.scrollLeft = 0);
    }, 1e3), document.addEventListener("fullscreenchange", kt), document.addEventListener("webkitfullscreenchange", kt), st().forEach((e2) => {
      t(e2, "section").forEach((e3, t2) => {
        t2 > 0 && (e3.classList.remove("present"), e3.classList.remove("past"), e3.classList.add("future"), e3.setAttribute("aria-hidden", "true"));
      });
    }), Re(), ne.update(true), function() {
      const e2 = "print" === A2.view, t2 = "scroll" === A2.view || "reader" === A2.view;
      (e2 || t2) && (e2 ? ke() : ye.unbind(), _.viewport.classList.add("loading-scroll-mode"), e2 ? "complete" === document.readyState ? oe.activate() : window.addEventListener("load", () => oe.activate()) : re.activate());
    }(), he.readURL(), setTimeout(() => {
      _.slides.classList.remove("no-transition"), _.wrapper.classList.add("ready"), Pe({ type: "ready", data: { indexh: c2, indexv: h2, currentSlide: v2 } });
    }, 1));
  }
  function Ee(e2) {
    _.statusElement.textContent = e2;
  }
  function Se(e2) {
    let t2 = "";
    if (3 === e2.nodeType) t2 += e2.textContent;
    else if (1 === e2.nodeType) {
      let i2 = e2.getAttribute("aria-hidden"), s2 = "none" === window.getComputedStyle(e2).display;
      "true" === i2 || s2 || Array.from(e2.childNodes).forEach((e3) => {
        t2 += Se(e3);
      });
    }
    return t2 = t2.trim(), "" === t2 ? "" : t2 + " ";
  }
  function Re(t2) {
    const s2 = { ...A2 };
    if ("object" == typeof t2 && e(A2, t2), false === l2.isReady()) return;
    const a2 = _.wrapper.querySelectorAll(m).length;
    _.wrapper.classList.remove(s2.transition), _.wrapper.classList.add(A2.transition), _.wrapper.setAttribute("data-transition-speed", A2.transitionSpeed), _.wrapper.setAttribute("data-background-transition", A2.backgroundTransition), _.viewport.style.setProperty("--slide-width", "string" == typeof A2.width ? A2.width : A2.width + "px"), _.viewport.style.setProperty("--slide-height", "string" == typeof A2.height ? A2.height : A2.height + "px"), A2.shuffle && Ye(), i(_.wrapper, "embedded", A2.embedded), i(_.wrapper, "rtl", A2.rtl), i(_.wrapper, "center", A2.center), false === A2.pause && Ue(), ae.reset(), S2 && (S2.destroy(), S2 = null), a2 > 1 && A2.autoSlide && A2.autoSlideStoppable && (S2 = new W(_.wrapper, () => Math.min(Math.max((Date.now() - Z) / G, 0), 1)), S2.on("click", Lt), ee = false), "default" !== A2.navigationMode ? _.wrapper.setAttribute("data-navigation-mode", A2.navigationMode) : _.wrapper.removeAttribute("data-navigation-mode"), be.configure(A2, s2), fe.configure(A2, s2), ve.configure(A2, s2), ue.configure(A2, s2), ge.configure(A2, s2), ce.configure(A2, s2), le.configure(A2, s2), ie.configure(A2, s2), Xe();
  }
  function Ae() {
    window.addEventListener("resize", Rt, false), A2.touch && ye.bind(), A2.keyboard && ce.bind(), A2.progress && ge.bind(), A2.respondToHashChanges && he.bind(), ue.bind(), fe.bind(), _.slides.addEventListener("click", St, false), _.slides.addEventListener("transitionend", Et, false), _.pauseOverlay.addEventListener("click", Ue, false), A2.focusBodyOnPageVisibilityChange && document.addEventListener("visibilitychange", At, false);
  }
  function ke() {
    ye.unbind(), fe.unbind(), ce.unbind(), ue.unbind(), ge.unbind(), he.unbind(), window.removeEventListener("resize", Rt, false), _.slides.removeEventListener("click", St, false), _.slides.removeEventListener("transitionend", Et, false), _.pauseOverlay.removeEventListener("click", Ue, false);
  }
  function Le(e2, t2, i2) {
    n2.addEventListener(e2, t2, i2);
  }
  function Ce(e2, t2, i2) {
    n2.removeEventListener(e2, t2, i2);
  }
  function xe(e2) {
    "string" == typeof e2.layout && (Y2.layout = e2.layout), "string" == typeof e2.overview && (Y2.overview = e2.overview), Y2.layout ? a(_.slides, Y2.layout + " " + Y2.overview) : a(_.slides, Y2.overview);
  }
  function Pe({ target: t2 = _.wrapper, type: i2, data: s2, bubbles: a2 = true }) {
    let n3 = document.createEvent("HTMLEvents", 1, 2);
    return n3.initEvent(i2, a2, true), e(n3, s2), t2.dispatchEvent(n3), t2 === _.wrapper && Ne(i2), n3;
  }
  function Te(e2) {
    Pe({ type: "slidechanged", data: { indexh: c2, indexv: h2, previousSlide: g2, currentSlide: v2, origin: e2 } });
  }
  function Ne(t2, i2) {
    if (A2.postMessageEvents && window.parent !== window.self) {
      let s2 = { namespace: "reveal", eventName: t2, state: dt() };
      e(s2, i2), window.parent.postMessage(JSON.stringify(s2), "*");
    }
  }
  function Ie() {
    if (_.wrapper && !oe.isActive()) {
      const e2 = _.viewport.offsetWidth, t2 = _.viewport.offsetHeight;
      if (!A2.disableLayout) {
        u && !A2.embedded && document.documentElement.style.setProperty("--vh", 0.01 * window.innerHeight + "px");
        const i2 = re.isActive() ? Be(e2, t2) : Be(), s2 = X2;
        Me(A2.width, A2.height), _.slides.style.width = i2.width + "px", _.slides.style.height = i2.height + "px", X2 = Math.min(i2.presentationWidth / i2.width, i2.presentationHeight / i2.height), X2 = Math.max(X2, A2.minScale), X2 = Math.min(X2, A2.maxScale), 1 === X2 || re.isActive() ? (_.slides.style.zoom = "", _.slides.style.left = "", _.slides.style.top = "", _.slides.style.bottom = "", _.slides.style.right = "", xe({ layout: "" })) : (_.slides.style.zoom = "", _.slides.style.left = "50%", _.slides.style.top = "50%", _.slides.style.bottom = "auto", _.slides.style.right = "auto", xe({ layout: "translate(-50%, -50%) scale(" + X2 + ")" }));
        const a2 = Array.from(_.wrapper.querySelectorAll(m));
        for (let e3 = 0, t3 = a2.length; e3 < t3; e3++) {
          const t4 = a2[e3];
          "none" !== t4.style.display && (A2.center || t4.classList.contains("center") ? t4.classList.contains("stack") ? t4.style.top = 0 : t4.style.top = Math.max((i2.height - t4.scrollHeight) / 2, 0) + "px" : t4.style.top = "");
        }
        s2 !== X2 && Pe({ type: "resize", data: { oldScale: s2, scale: X2, size: i2 } });
      }
      !function() {
        if (_.wrapper && !A2.disableLayout && !oe.isActive() && "number" == typeof A2.scrollActivationWidth && "scroll" !== A2.view) {
          const e3 = Be();
          e3.presentationWidth > 0 && e3.presentationWidth <= A2.scrollActivationWidth ? re.isActive() || (ne.create(), re.activate()) : re.isActive() && re.deactivate();
        }
      }(), _.viewport.style.setProperty("--slide-scale", X2), _.viewport.style.setProperty("--viewport-width", e2 + "px"), _.viewport.style.setProperty("--viewport-height", t2 + "px"), re.layout(), ge.update(), ne.updateParallax(), de.isActive() && de.update();
    }
  }
  function Me(e2, i2) {
    t(_.slides, "section > .stretch, section > .r-stretch").forEach((t2) => {
      let s2 = ((e3, t3 = 0) => {
        if (e3) {
          let i3, s3 = e3.style.height;
          return e3.style.height = "0px", e3.parentNode.style.height = "auto", i3 = t3 - e3.parentNode.offsetHeight, e3.style.height = s3 + "px", e3.parentNode.style.removeProperty("height"), i3;
        }
        return t3;
      })(t2, i2);
      if (/(img|video)/gi.test(t2.nodeName)) {
        const i3 = t2.naturalWidth || t2.videoWidth, a2 = t2.naturalHeight || t2.videoHeight, n3 = Math.min(e2 / i3, s2 / a2);
        t2.style.width = i3 * n3 + "px", t2.style.height = a2 * n3 + "px";
      } else t2.style.width = e2 + "px", t2.style.height = s2 + "px";
    });
  }
  function Be(e2, t2) {
    let i2 = A2.width, s2 = A2.height;
    A2.disableLayout && (i2 = _.slides.offsetWidth, s2 = _.slides.offsetHeight);
    const a2 = { width: i2, height: s2, presentationWidth: e2 || _.wrapper.offsetWidth, presentationHeight: t2 || _.wrapper.offsetHeight };
    return a2.presentationWidth -= a2.presentationWidth * A2.margin, a2.presentationHeight -= a2.presentationHeight * A2.margin, "string" == typeof a2.width && /%$/.test(a2.width) && (a2.width = parseInt(a2.width, 10) / 100 * a2.presentationWidth), "string" == typeof a2.height && /%$/.test(a2.height) && (a2.height = parseInt(a2.height, 10) / 100 * a2.presentationHeight), a2;
  }
  function He(e2, t2) {
    "object" == typeof e2 && "function" == typeof e2.setAttribute && e2.setAttribute("data-previous-indexv", t2 || 0);
  }
  function De(e2) {
    if ("object" == typeof e2 && "function" == typeof e2.setAttribute && e2.classList.contains("stack")) {
      const t2 = e2.hasAttribute("data-start-indexv") ? "data-start-indexv" : "data-previous-indexv";
      return parseInt(e2.getAttribute(t2) || 0, 10);
    }
    return 0;
  }
  function Fe(e2 = v2) {
    return e2 && e2.parentNode && !!e2.parentNode.nodeName.match(/section/i);
  }
  function ze() {
    return !(!v2 || !Fe(v2)) && !v2.nextElementSibling;
  }
  function qe() {
    return 0 === c2 && 0 === h2;
  }
  function Oe() {
    return !!v2 && (!v2.nextElementSibling && (!Fe(v2) || !v2.parentNode.nextElementSibling));
  }
  function Ve() {
    if (A2.pause) {
      const e2 = _.wrapper.classList.contains("paused");
      ht(), _.wrapper.classList.add("paused"), false === e2 && Pe({ type: "paused" });
    }
  }
  function Ue() {
    const e2 = _.wrapper.classList.contains("paused");
    _.wrapper.classList.remove("paused"), ct(), e2 && Pe({ type: "resumed" });
  }
  function We(e2) {
    "boolean" == typeof e2 ? e2 ? Ve() : Ue() : je() ? Ue() : Ve();
  }
  function je() {
    return _.wrapper.classList.contains("paused");
  }
  function Ke(e2, i2, s2, a2) {
    if (Pe({ type: "beforeslidechange", data: { indexh: void 0 === e2 ? c2 : e2, indexv: void 0 === i2 ? h2 : i2, origin: a2 } }).defaultPrevented) return;
    g2 = v2;
    const r2 = _.wrapper.querySelectorAll(f);
    if (re.isActive()) {
      const t2 = re.getSlideByIndices(e2, i2);
      return void (t2 && re.scrollToSlide(t2));
    }
    if (0 === r2.length) return;
    void 0 !== i2 || de.isActive() || (i2 = De(r2[e2])), g2 && g2.parentNode && g2.parentNode.classList.contains("stack") && He(g2.parentNode, h2);
    const o3 = $2.concat();
    $2.length = 0;
    let l3 = c2 || 0, d2 = h2 || 0;
    c2 = _e(f, void 0 === e2 ? c2 : e2), h2 = _e(y, void 0 === i2 ? h2 : i2);
    let u2 = c2 !== l3 || h2 !== d2;
    u2 || (g2 = null);
    let p2 = r2[c2], m2 = p2.querySelectorAll("section");
    n2.classList.toggle("is-vertical-slide", m2.length > 1), v2 = m2[h2] || p2;
    let b2 = false;
    u2 && g2 && v2 && !de.isActive() && (J = "running", b2 = $e(g2, v2, l3, d2), b2 && _.slides.classList.add("disable-slide-transitions")), Qe(), Ie(), de.isActive() && de.update(), void 0 !== s2 && le.goto(s2), g2 && g2 !== v2 && (g2.classList.remove("present"), g2.setAttribute("aria-hidden", "true"), qe() && setTimeout(() => {
      t(_.wrapper, f + ".stack").forEach((e3) => {
        He(e3, 0);
      });
    }, 0));
    e: for (let e3 = 0, t2 = $2.length; e3 < t2; e3++) {
      for (let t3 = 0; t3 < o3.length; t3++) if (o3[t3] === $2[e3]) {
        o3.splice(t3, 1);
        continue e;
      }
      _.viewport.classList.add($2[e3]), Pe({ type: $2[e3] });
    }
    for (; o3.length; ) _.viewport.classList.remove(o3.pop());
    u2 && Te(a2), !u2 && g2 || (te.stopEmbeddedContent(g2), te.startEmbeddedContent(v2)), requestAnimationFrame(() => {
      Ee(Se(v2));
    }), ge.update(), ue.update(), be.update(), ne.update(), ne.updateParallax(), ie.update(), le.update(), he.writeURL(), ct(), b2 && (setTimeout(() => {
      _.slides.classList.remove("disable-slide-transitions");
    }, 0), A2.autoAnimate && ae.run(g2, v2));
  }
  function $e(e2, t2, i2, s2) {
    return e2.hasAttribute("data-auto-animate") && t2.hasAttribute("data-auto-animate") && e2.getAttribute("data-auto-animate-id") === t2.getAttribute("data-auto-animate-id") && !(c2 > i2 || h2 > s2 ? t2 : e2).hasAttribute("data-auto-animate-restart");
  }
  function Xe() {
    ke(), Ae(), Ie(), G = A2.autoSlide, ct(), ne.create(), he.writeURL(), true === A2.sortFragmentsOnSync && le.sortAll(), ue.update(), ge.update(), Qe(), be.update(), be.updateVisibility(), me.update(), ne.update(true), ie.update(), te.formatEmbeddedContent(), false === A2.autoPlayMedia ? te.stopEmbeddedContent(v2, { unloadIframes: false }) : te.startEmbeddedContent(v2), de.isActive() && de.layout();
  }
  function Ye(e2 = st()) {
    e2.forEach((t2, i2) => {
      let s2 = e2[Math.floor(Math.random() * e2.length)];
      s2.parentNode === t2.parentNode && t2.parentNode.insertBefore(t2, s2);
      let a2 = t2.querySelectorAll("section");
      a2.length && Ye(a2);
    });
  }
  function _e(e2, i2) {
    let s2 = t(_.wrapper, e2), a2 = s2.length, n3 = re.isActive() || oe.isActive(), r2 = false, o3 = false;
    if (a2) {
      A2.loop && (i2 >= a2 && (r2 = true), (i2 %= a2) < 0 && (i2 = a2 + i2, o3 = true)), i2 = Math.max(Math.min(i2, a2 - 1), 0);
      for (let e4 = 0; e4 < a2; e4++) {
        let t3 = s2[e4], a3 = A2.rtl && !Fe(t3);
        t3.classList.remove("past"), t3.classList.remove("present"), t3.classList.remove("future"), t3.setAttribute("hidden", ""), t3.setAttribute("aria-hidden", "true"), t3.querySelector("section") && t3.classList.add("stack"), n3 ? t3.classList.add("present") : e4 < i2 ? (t3.classList.add(a3 ? "future" : "past"), A2.fragments && Je(t3)) : e4 > i2 ? (t3.classList.add(a3 ? "past" : "future"), A2.fragments && Ge(t3)) : e4 === i2 && A2.fragments && (r2 ? Ge(t3) : o3 && Je(t3));
      }
      let e3 = s2[i2], t2 = e3.classList.contains("present");
      e3.classList.add("present"), e3.removeAttribute("hidden"), e3.removeAttribute("aria-hidden"), t2 || Pe({ target: e3, type: "visible", bubbles: false });
      let l3 = e3.getAttribute("data-state");
      l3 && ($2 = $2.concat(l3.split(" ")));
    } else i2 = 0;
    return i2;
  }
  function Je(e2) {
    t(e2, ".fragment").forEach((e3) => {
      e3.classList.add("visible"), e3.classList.remove("current-fragment");
    });
  }
  function Ge(e2) {
    t(e2, ".fragment.visible").forEach((e3) => {
      e3.classList.remove("visible", "current-fragment");
    });
  }
  function Qe() {
    let e2, i2, s2 = st(), a2 = s2.length;
    if (a2 && void 0 !== c2) {
      let n3 = de.isActive() ? 10 : A2.viewDistance;
      u && (n3 = de.isActive() ? 6 : A2.mobileViewDistance), oe.isActive() && (n3 = Number.MAX_VALUE);
      for (let r2 = 0; r2 < a2; r2++) {
        let o3 = s2[r2], l3 = t(o3, "section"), d2 = l3.length;
        if (e2 = Math.abs((c2 || 0) - r2) || 0, A2.loop && (e2 = Math.abs(((c2 || 0) - r2) % (a2 - n3)) || 0), e2 < n3 ? te.load(o3) : te.unload(o3), d2) {
          let t2 = De(o3);
          for (let s3 = 0; s3 < d2; s3++) {
            let a3 = l3[s3];
            i2 = r2 === (c2 || 0) ? Math.abs((h2 || 0) - s3) : Math.abs(s3 - t2), e2 + i2 < n3 ? te.load(a3) : te.unload(a3);
          }
        }
      }
      rt() ? _.wrapper.classList.add("has-vertical-slides") : _.wrapper.classList.remove("has-vertical-slides"), nt() ? _.wrapper.classList.add("has-horizontal-slides") : _.wrapper.classList.remove("has-horizontal-slides");
    }
  }
  function Ze({ includeFragments: e2 = false } = {}) {
    let t2 = _.wrapper.querySelectorAll(f), i2 = _.wrapper.querySelectorAll(y), s2 = { left: c2 > 0, right: c2 < t2.length - 1, up: h2 > 0, down: h2 < i2.length - 1 };
    if (A2.loop && (t2.length > 1 && (s2.left = true, s2.right = true), i2.length > 1 && (s2.up = true, s2.down = true)), t2.length > 1 && "linear" === A2.navigationMode && (s2.right = s2.right || s2.down, s2.left = s2.left || s2.up), true === e2) {
      let e3 = le.availableRoutes();
      s2.left = s2.left || e3.prev, s2.up = s2.up || e3.prev, s2.down = s2.down || e3.next, s2.right = s2.right || e3.next;
    }
    if (A2.rtl) {
      let e3 = s2.left;
      s2.left = s2.right, s2.right = e3;
    }
    return s2;
  }
  function et(e2 = v2) {
    let t2 = st(), i2 = 0;
    e: for (let s2 = 0; s2 < t2.length; s2++) {
      let a2 = t2[s2], n3 = a2.querySelectorAll("section");
      for (let t3 = 0; t3 < n3.length; t3++) {
        if (n3[t3] === e2) break e;
        "uncounted" !== n3[t3].dataset.visibility && i2++;
      }
      if (a2 === e2) break;
      false === a2.classList.contains("stack") && "uncounted" !== a2.dataset.visibility && i2++;
    }
    return i2;
  }
  function tt(e2) {
    let i2, s2 = c2, a2 = h2;
    if (e2) if (re.isActive()) s2 = parseInt(e2.getAttribute("data-index-h"), 10), e2.getAttribute("data-index-v") && (a2 = parseInt(e2.getAttribute("data-index-v"), 10));
    else {
      let i3 = Fe(e2), n3 = i3 ? e2.parentNode : e2, r2 = st();
      s2 = Math.max(r2.indexOf(n3), 0), a2 = void 0, i3 && (a2 = Math.max(t(e2.parentNode, "section").indexOf(e2), 0));
    }
    if (!e2 && v2) {
      if (v2.querySelectorAll(".fragment").length > 0) {
        let e3 = v2.querySelector(".current-fragment");
        i2 = e3 && e3.hasAttribute("data-fragment-index") ? parseInt(e3.getAttribute("data-fragment-index"), 10) : v2.querySelectorAll(".fragment.visible").length - 1;
      }
    }
    return { h: s2, v: a2, f: i2 };
  }
  function it() {
    return t(_.wrapper, m + ':not(.stack):not([data-visibility="uncounted"])');
  }
  function st() {
    return t(_.wrapper, f);
  }
  function at() {
    return t(_.wrapper, ".slides>section>section");
  }
  function nt() {
    return st().length > 1;
  }
  function rt() {
    return at().length > 1;
  }
  function ot() {
    return it().length;
  }
  function lt(e2, t2) {
    let i2 = st()[e2], s2 = i2 && i2.querySelectorAll("section");
    return s2 && s2.length && "number" == typeof t2 ? s2 ? s2[t2] : void 0 : i2;
  }
  function dt() {
    let e2 = tt();
    return { indexh: e2.h, indexv: e2.v, indexf: e2.f, paused: je(), overview: de.isActive(), ...me.getState() };
  }
  function ct() {
    if (ht(), v2 && false !== A2.autoSlide) {
      let e2 = v2.querySelector(".current-fragment[data-autoslide]"), i2 = e2 ? e2.getAttribute("data-autoslide") : null, s2 = v2.parentNode ? v2.parentNode.getAttribute("data-autoslide") : null, a2 = v2.getAttribute("data-autoslide");
      i2 ? G = parseInt(i2, 10) : a2 ? G = parseInt(a2, 10) : s2 ? G = parseInt(s2, 10) : (G = A2.autoSlide, 0 === v2.querySelectorAll(".fragment").length && t(v2, "video, audio").forEach((e3) => {
        e3.hasAttribute("data-autoplay") && G && 1e3 * e3.duration / e3.playbackRate > G && (G = 1e3 * e3.duration / e3.playbackRate + 1e3);
      })), !G || ee || je() || de.isActive() || Oe() && !le.availableRoutes().next && true !== A2.loop || (Q = setTimeout(() => {
        "function" == typeof A2.autoSlideMethod ? A2.autoSlideMethod() : bt(), ct();
      }, G), Z = Date.now()), S2 && S2.setPlaying(-1 !== Q);
    }
  }
  function ht() {
    clearTimeout(Q), Q = -1;
  }
  function ut() {
    G && !ee && (ee = true, Pe({ type: "autoslidepaused" }), clearTimeout(Q), S2 && S2.setPlaying(false));
  }
  function gt() {
    G && ee && (ee = false, Pe({ type: "autoslideresumed" }), ct());
  }
  function vt({ skipFragments: e2 = false } = {}) {
    if (O2.hasNavigatedHorizontally = true, re.isActive()) return re.prev();
    A2.rtl ? (de.isActive() || e2 || false === le.next()) && Ze().left && Ke(c2 + 1, "grid" === A2.navigationMode ? h2 : void 0) : (de.isActive() || e2 || false === le.prev()) && Ze().left && Ke(c2 - 1, "grid" === A2.navigationMode ? h2 : void 0);
  }
  function pt({ skipFragments: e2 = false } = {}) {
    if (O2.hasNavigatedHorizontally = true, re.isActive()) return re.next();
    A2.rtl ? (de.isActive() || e2 || false === le.prev()) && Ze().right && Ke(c2 - 1, "grid" === A2.navigationMode ? h2 : void 0) : (de.isActive() || e2 || false === le.next()) && Ze().right && Ke(c2 + 1, "grid" === A2.navigationMode ? h2 : void 0);
  }
  function mt({ skipFragments: e2 = false } = {}) {
    if (re.isActive()) return re.prev();
    (de.isActive() || e2 || false === le.prev()) && Ze().up && Ke(c2, h2 - 1);
  }
  function ft({ skipFragments: e2 = false } = {}) {
    if (O2.hasNavigatedVertically = true, re.isActive()) return re.next();
    (de.isActive() || e2 || false === le.next()) && Ze().down && Ke(c2, h2 + 1);
  }
  function yt({ skipFragments: e2 = false } = {}) {
    if (re.isActive()) return re.prev();
    if (e2 || false === le.prev()) if (Ze().up) mt({ skipFragments: e2 });
    else {
      let i2;
      if (i2 = A2.rtl ? t(_.wrapper, f + ".future").pop() : t(_.wrapper, f + ".past").pop(), i2 && i2.classList.contains("stack")) {
        let e3 = i2.querySelectorAll("section").length - 1 || void 0;
        Ke(c2 - 1, e3);
      } else A2.rtl ? pt({ skipFragments: e2 }) : vt({ skipFragments: e2 });
    }
  }
  function bt({ skipFragments: e2 = false } = {}) {
    if (O2.hasNavigatedHorizontally = true, O2.hasNavigatedVertically = true, re.isActive()) return re.next();
    if (e2 || false === le.next()) {
      let t2 = Ze();
      t2.down && t2.right && A2.loop && ze() && (t2.down = false), t2.down ? ft({ skipFragments: e2 }) : A2.rtl ? vt({ skipFragments: e2 }) : pt({ skipFragments: e2 });
    }
  }
  function wt(e2) {
    let t2 = e2.data;
    if ("string" == typeof t2 && "{" === t2.charAt(0) && "}" === t2.charAt(t2.length - 1) && (t2 = JSON.parse(t2), t2.method && "function" == typeof l2[t2.method])) if (false === b.test(t2.method)) {
      const e3 = l2[t2.method].apply(l2, t2.args);
      Ne("callback", { method: t2.method, result: e3 });
    } else console.warn('reveal.js: "' + t2.method + '" is is blacklisted from the postMessage API');
  }
  function Et(e2) {
    "running" === J && /section/gi.test(e2.target.nodeName) && (J = "idle", Pe({ type: "slidetransitionend", data: { indexh: c2, indexv: h2, previousSlide: g2, currentSlide: v2 } }));
  }
  function St(e2) {
    const t2 = r(e2.target, 'a[href^="#"]');
    if (t2) {
      const i2 = t2.getAttribute("href"), s2 = he.getIndicesFromHash(i2);
      s2 && (l2.slide(s2.h, s2.v, s2.f), e2.preventDefault());
    }
  }
  function Rt(e2) {
    Ie();
  }
  function At(e2) {
    false === document.hidden && document.activeElement !== document.body && ("function" == typeof document.activeElement.blur && document.activeElement.blur(), document.body.focus());
  }
  function kt(e2) {
    (document.fullscreenElement || document.webkitFullscreenElement) === _.wrapper && (e2.stopImmediatePropagation(), setTimeout(() => {
      l2.layout(), l2.focus.focus();
    }, 1));
  }
  function Lt(e2) {
    Oe() && false === A2.loop ? (Ke(0, 0), gt()) : ee ? gt() : ut();
  }
  const Ct = { VERSION: K, initialize: function(e2) {
    if (!n2) throw 'Unable to find presentation root (<div class="reveal">).';
    if (H2) throw "Reveal.js has already been initialized.";
    if (H2 = true, _.wrapper = n2, _.slides = n2.querySelector(".slides"), !_.slides) throw 'Unable to find slides container (<div class="slides">).';
    return A2 = { ...j, ...A2, ...o2, ...e2, ...d() }, /print-pdf/gi.test(window.location.search) && (A2.view = "print"), function() {
      true === A2.embedded ? _.viewport = r(n2, ".reveal-viewport") || n2 : (_.viewport = document.body, document.documentElement.classList.add("reveal-full-page"));
      _.viewport.classList.add("reveal-viewport");
    }(), window.addEventListener("load", Ie, false), pe.load(A2.plugins, A2.dependencies).then(we), new Promise((e3) => l2.on("ready", e3));
  }, configure: Re, destroy: function() {
    H2 = false, false !== q2 && (ke(), ht(), be.destroy(), fe.destroy(), me.destroy(), pe.destroy(), ve.destroy(), ue.destroy(), ge.destroy(), ne.destroy(), ie.destroy(), se.destroy(), document.removeEventListener("fullscreenchange", kt), document.removeEventListener("webkitfullscreenchange", kt), document.removeEventListener("visibilitychange", At, false), window.removeEventListener("message", wt, false), window.removeEventListener("load", Ie, false), _.pauseOverlay && _.pauseOverlay.remove(), _.statusElement && _.statusElement.remove(), document.documentElement.classList.remove("reveal-full-page"), _.wrapper.classList.remove("ready", "center", "has-horizontal-slides", "has-vertical-slides"), _.wrapper.removeAttribute("data-transition-speed"), _.wrapper.removeAttribute("data-background-transition"), _.viewport.classList.remove("reveal-viewport"), _.viewport.style.removeProperty("--slide-width"), _.viewport.style.removeProperty("--slide-height"), _.slides.style.removeProperty("width"), _.slides.style.removeProperty("height"), _.slides.style.removeProperty("zoom"), _.slides.style.removeProperty("left"), _.slides.style.removeProperty("top"), _.slides.style.removeProperty("bottom"), _.slides.style.removeProperty("right"), _.slides.style.removeProperty("transform"), Array.from(_.wrapper.querySelectorAll(m)).forEach((e2) => {
      e2.style.removeProperty("display"), e2.style.removeProperty("top"), e2.removeAttribute("hidden"), e2.removeAttribute("aria-hidden");
    }));
  }, sync: Xe, syncSlide: function(e2 = v2) {
    ne.sync(e2), le.sync(e2), te.load(e2), ne.update(), be.update();
  }, syncFragments: le.sync.bind(le), slide: Ke, left: vt, right: pt, up: mt, down: ft, prev: yt, next: bt, navigateLeft: vt, navigateRight: pt, navigateUp: mt, navigateDown: ft, navigatePrev: yt, navigateNext: bt, navigateFragment: le.goto.bind(le), prevFragment: le.prev.bind(le), nextFragment: le.next.bind(le), on: Le, off: Ce, addEventListener: Le, removeEventListener: Ce, layout: Ie, shuffle: Ye, availableRoutes: Ze, availableFragments: le.availableRoutes.bind(le), toggleHelp: me.toggleHelp.bind(me), toggleOverview: de.toggle.bind(de), toggleScrollView: re.toggle.bind(re), togglePause: We, toggleAutoSlide: function(e2) {
    "boolean" == typeof e2 ? e2 ? gt() : ut() : ee ? gt() : ut();
  }, toggleJumpToSlide: function(e2) {
    "boolean" == typeof e2 ? e2 ? se.show() : se.hide() : se.isVisible() ? se.hide() : se.show();
  }, isFirstSlide: qe, isLastSlide: Oe, isLastVerticalSlide: ze, isVerticalSlide: Fe, isVerticalStack: function(e2 = v2) {
    return e2.classList.contains(".stack") || null !== e2.querySelector("section");
  }, isPaused: je, isAutoSliding: function() {
    return !(!G || ee);
  }, isSpeakerNotes: be.isSpeakerNotesWindow.bind(be), isOverview: de.isActive.bind(de), isFocused: fe.isFocused.bind(fe), isOverlayOpen: me.isOpen.bind(me), isScrollView: re.isActive.bind(re), isPrintView: oe.isActive.bind(oe), isReady: () => q2, loadSlide: te.load.bind(te), unloadSlide: te.unload.bind(te), startEmbeddedContent: () => te.startEmbeddedContent(v2), stopEmbeddedContent: () => te.stopEmbeddedContent(v2, { unloadIframes: false }), previewIframe: me.previewIframe.bind(me), previewImage: me.previewImage.bind(me), previewVideo: me.previewVideo.bind(me), showPreview: me.previewIframe.bind(me), hidePreview: me.close.bind(me), addEventListeners: Ae, removeEventListeners: ke, dispatchEvent: Pe, getState: dt, setState: function(e2) {
    if ("object" == typeof e2) {
      Ke(s(e2.indexh), s(e2.indexv), s(e2.indexf));
      let t2 = s(e2.paused), i2 = s(e2.overview);
      "boolean" == typeof t2 && t2 !== je() && We(t2), "boolean" == typeof i2 && i2 !== de.isActive() && de.toggle(i2), me.setState(e2);
    }
  }, getProgress: function() {
    let e2 = ot(), t2 = et();
    if (v2) {
      let e3 = v2.querySelectorAll(".fragment");
      if (e3.length > 0) {
        let i2 = 0.9;
        t2 += v2.querySelectorAll(".fragment.visible").length / e3.length * i2;
      }
    }
    return Math.min(t2 / (e2 - 1), 1);
  }, getIndices: tt, getSlidesAttributes: function() {
    return it().map((e2) => {
      let t2 = {};
      for (let i2 = 0; i2 < e2.attributes.length; i2++) {
        let s2 = e2.attributes[i2];
        t2[s2.name] = s2.value;
      }
      return t2;
    });
  }, getSlidePastCount: et, getTotalSlides: ot, getSlide: lt, getPreviousSlide: () => g2, getCurrentSlide: () => v2, getSlideBackground: function(e2, t2) {
    let i2 = "number" == typeof e2 ? lt(e2, t2) : e2;
    if (i2) return i2.slideBackgroundElement;
  }, getSlideNotes: be.getSlideNotes.bind(be), getSlides: it, getHorizontalSlides: st, getVerticalSlides: at, hasHorizontalSlides: nt, hasVerticalSlides: rt, hasNavigatedHorizontally: () => O2.hasNavigatedHorizontally, hasNavigatedVertically: () => O2.hasNavigatedVertically, shouldAutoAnimateBetween: $e, addKeyBinding: ce.addKeyBinding.bind(ce), removeKeyBinding: ce.removeKeyBinding.bind(ce), triggerKey: ce.triggerKey.bind(ce), registerKeyboardShortcut: ce.registerKeyboardShortcut.bind(ce), getComputedSlideSize: Be, setCurrentScrollPage: function(e2, t2, i2) {
    let s2 = c2 || 0;
    c2 = t2, h2 = i2;
    const a2 = v2 !== e2;
    g2 = v2, v2 = e2, v2 && g2 && A2.autoAnimate && $e(g2, v2, s2, h2) && ae.run(g2, v2), a2 && (g2 && (te.stopEmbeddedContent(g2), te.stopEmbeddedContent(g2.slideBackgroundElement)), te.startEmbeddedContent(v2), te.startEmbeddedContent(v2.slideBackgroundElement)), requestAnimationFrame(() => {
      Ee(Se(v2));
    }), Te();
  }, getScale: () => X2, getConfig: () => A2, getQueryHash: d, getSlidePath: he.getHash.bind(he), getRevealElement: () => n2, getSlidesElement: () => _.slides, getViewportElement: () => _.viewport, getBackgroundsElement: () => ne.element, registerPlugin: pe.registerPlugin.bind(pe), hasPlugin: pe.hasPlugin.bind(pe), getPlugin: pe.getPlugin.bind(pe), getPlugins: pe.getRegisteredPlugins.bind(pe) };
  return e(l2, { ...Ct, announceStatus: Ee, getStatusText: Se, focus: fe, scroll: re, progress: ge, controls: ue, location: he, overview: de, keyboard: ce, fragments: le, backgrounds: ne, slideContent: te, slideNumber: ie, onUserInput: function(e2) {
    A2.autoSlideStoppable && ut();
  }, closeOverlay: me.close.bind(me), updateSlidesVisibility: Qe, layoutSlideContents: Me, transformSlides: xe, cueAutoSlide: ct, cancelAutoSlide: ht }), Ct;
}
var X = $;
var Y = [];
X.initialize = (e2) => (Object.assign(X, new $(document.querySelector(".reveal"), e2)), Y.map((e3) => e3(X)), X.initialize()), ["configure", "on", "off", "addEventListener", "removeEventListener", "registerPlugin"].forEach((e2) => {
  X[e2] = (...t2) => {
    Y.push((i2) => i2[e2].call(null, ...t2));
  };
}), X.isReady = () => false, X.VERSION = K;
export {
  X as default
};
/*! Bundled license information:

reveal.js/dist/reveal.esm.js:
  (*!
   * reveal.js 5.2.0
   * https://revealjs.com
   * MIT licensed
   *
   * Copyright (C) 2011-2024 Hakim El Hattab, https://hakim.se
   *)
*/
//# sourceMappingURL=reveal__js.js.map
