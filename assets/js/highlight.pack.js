/*! highlight.js v9.13.1 | BSD3 License | git.io/hljslicense */
(function(factory) {
  // Find the global object for export to both the browser and web workers.
  var globalObject =
    (typeof window === "object" && window) ||
    (typeof self === "object" && self);

  // Setup highlight.js for different environments. First is Node.js or
  // CommonJS.
  if (typeof exports !== "undefined") {
    factory(exports);
  } else if (globalObject) {
    // Export hljs globally even when using AMD for cases when this script
    // is loaded with others that may still expect a global hljs.
    globalObject.hljs = factory({});

    // Finally register the global hljs with AMD.
    if (typeof define === "function" && define.amd) {
      define([], function() {
        return globalObject.hljs;
      });
    }
  }
})(function(hljs) {
  // Convenience variables for build-in objects
  var ArrayProto = [],
    objectKeys = Object.keys;

  // Global internal variables used within the highlight.js library.
  var languages = {},
    aliases = {};

  // Regular expressions used throughout the highlight.js library.
  var noHighlightRe = /^(no-?highlight|plain|text)$/i,
    languagePrefixRe = /\blang(?:uage)?-([\w-]+)\b/i,
    fixMarkupRe = /((^(<[^>]+>|\t|)+|(?:\n)))/gm;

  var spanEndTag = "</span>";

  // Global options used when within external APIs. This is modified when
  // calling the `hljs.configure` function.
  var options = {
    classPrefix: "hljs-",
    tabReplace: null,
    useBR: false,
    languages: undefined
  };

  /* Utility functions */

  function escape(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function tag(node) {
    return node.nodeName.toLowerCase();
  }

  function testRe(re, lexeme) {
    var match = re && re.exec(lexeme);
    return match && match.index === 0;
  }

  function isNotHighlighted(language) {
    return noHighlightRe.test(language);
  }

  function blockLanguage(block) {
    var i, match, length, _class;
    var classes = block.className + " ";

    classes += block.parentNode ? block.parentNode.className : "";

    // language-* takes precedence over non-prefixed class names.
    match = languagePrefixRe.exec(classes);
    if (match) {
      return getLanguage(match[1]) ? match[1] : "no-highlight";
    }

    classes = classes.split(/\s+/);

    for (i = 0, length = classes.length; i < length; i++) {
      _class = classes[i];

      if (isNotHighlighted(_class) || getLanguage(_class)) {
        return _class;
      }
    }
  }

  function inherit(parent) {
    // inherit(parent, override_obj, override_obj, ...)
    var key;
    var result = {};
    var objects = Array.prototype.slice.call(arguments, 1);

    for (key in parent) result[key] = parent[key];
    objects.forEach(function(obj) {
      for (key in obj) result[key] = obj[key];
    });
    return result;
  }

  /* Stream merging */

  function nodeStream(node) {
    var result = [];
    (function _nodeStream(node, offset) {
      for (var child = node.firstChild; child; child = child.nextSibling) {
        if (child.nodeType === 3) offset += child.nodeValue.length;
        else if (child.nodeType === 1) {
          result.push({
            event: "start",
            offset: offset,
            node: child
          });
          offset = _nodeStream(child, offset);
          // Prevent void elements from having an end tag that would actually
          // double them in the output. There are more void elements in HTML
          // but we list only those realistically expected in code display.
          if (!tag(child).match(/br|hr|img|input/)) {
            result.push({
              event: "stop",
              offset: offset,
              node: child
            });
          }
        }
      }
      return offset;
    })(node, 0);
    return result;
  }

  function mergeStreams(original, highlighted, value) {
    var processed = 0;
    var result = "";
    var nodeStack = [];

    function selectStream() {
      if (!original.length || !highlighted.length) {
        return original.length ? original : highlighted;
      }
      if (original[0].offset !== highlighted[0].offset) {
        return original[0].offset < highlighted[0].offset
          ? original
          : highlighted;
      }

      /*
      To avoid starting the stream just before it should stop the order is
      ensured that original always starts first and closes last:

      if (event1 == 'start' && event2 == 'start')
        return original;
      if (event1 == 'start' && event2 == 'stop')
        return highlighted;
      if (event1 == 'stop' && event2 == 'start')
        return original;
      if (event1 == 'stop' && event2 == 'stop')
        return highlighted;

      ... which is collapsed to:
      */
      return highlighted[0].event === "start" ? original : highlighted;
    }

    function open(node) {
      function attr_str(a) {
        return (
          " " + a.nodeName + '="' + escape(a.value).replace('"', "&quot;") + '"'
        );
      }
      result +=
        "<" +
        tag(node) +
        ArrayProto.map.call(node.attributes, attr_str).join("") +
        ">";
    }

    function close(node) {
      result += "</" + tag(node) + ">";
    }

    function render(event) {
      (event.event === "start" ? open : close)(event.node);
    }

    while (original.length || highlighted.length) {
      var stream = selectStream();
      result += escape(value.substring(processed, stream[0].offset));
      processed = stream[0].offset;
      if (stream === original) {
        /*
        On any opening or closing tag of the original markup we first close
        the entire highlighted node stack, then render the original tag along
        with all the following original tags at the same offset and then
        reopen all the tags on the highlighted stack.
        */
        nodeStack.reverse().forEach(close);
        do {
          render(stream.splice(0, 1)[0]);
          stream = selectStream();
        } while (
          stream === original &&
          stream.length &&
          stream[0].offset === processed
        );
        nodeStack.reverse().forEach(open);
      } else {
        if (stream[0].event === "start") {
          nodeStack.push(stream[0].node);
        } else {
          nodeStack.pop();
        }
        render(stream.splice(0, 1)[0]);
      }
    }
    return result + escape(value.substr(processed));
  }

  /* Initialization */

  function expand_mode(mode) {
    if (mode.variants && !mode.cached_variants) {
      mode.cached_variants = mode.variants.map(function(variant) {
        return inherit(mode, { variants: null }, variant);
      });
    }
    return (
      mode.cached_variants || (mode.endsWithParent && [inherit(mode)]) || [mode]
    );
  }

  function compileLanguage(language) {
    function reStr(re) {
      return (re && re.source) || re;
    }

    function langRe(value, global) {
      return new RegExp(
        reStr(value),
        "m" + (language.case_insensitive ? "i" : "") + (global ? "g" : "")
      );
    }

    function compileMode(mode, parent) {
      if (mode.compiled) return;
      mode.compiled = true;

      mode.keywords = mode.keywords || mode.beginKeywords;
      if (mode.keywords) {
        var compiled_keywords = {};

        var flatten = function(className, str) {
          if (language.case_insensitive) {
            str = str.toLowerCase();
          }
          str.split(" ").forEach(function(kw) {
            var pair = kw.split("|");
            compiled_keywords[pair[0]] = [
              className,
              pair[1] ? Number(pair[1]) : 1
            ];
          });
        };

        if (typeof mode.keywords === "string") {
          // string
          flatten("keyword", mode.keywords);
        } else {
          objectKeys(mode.keywords).forEach(function(className) {
            flatten(className, mode.keywords[className]);
          });
        }
        mode.keywords = compiled_keywords;
      }
      mode.lexemesRe = langRe(mode.lexemes || /\w+/, true);

      if (parent) {
        if (mode.beginKeywords) {
          mode.begin =
            "\\b(" + mode.beginKeywords.split(" ").join("|") + ")\\b";
        }
        if (!mode.begin) mode.begin = /\B|\b/;
        mode.beginRe = langRe(mode.begin);
        if (mode.endSameAsBegin) mode.end = mode.begin;
        if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
        if (mode.end) mode.endRe = langRe(mode.end);
        mode.terminator_end = reStr(mode.end) || "";
        if (mode.endsWithParent && parent.terminator_end)
          mode.terminator_end += (mode.end ? "|" : "") + parent.terminator_end;
      }
      if (mode.illegal) mode.illegalRe = langRe(mode.illegal);
      if (mode.relevance == null) mode.relevance = 1;
      if (!mode.contains) {
        mode.contains = [];
      }
      mode.contains = Array.prototype.concat.apply(
        [],
        mode.contains.map(function(c) {
          return expand_mode(c === "self" ? mode : c);
        })
      );
      mode.contains.forEach(function(c) {
        compileMode(c, mode);
      });

      if (mode.starts) {
        compileMode(mode.starts, parent);
      }

      var terminators = mode.contains
        .map(function(c) {
          return c.beginKeywords ? "\\.?(" + c.begin + ")\\.?" : c.begin;
        })
        .concat([mode.terminator_end, mode.illegal])
        .map(reStr)
        .filter(Boolean);
      mode.terminators = terminators.length
        ? langRe(terminators.join("|"), true)
        : {
            exec: function(/*s*/) {
              return null;
            }
          };
    }

    compileMode(language);
  }

  /*
  Core highlighting function. Accepts a language name, or an alias, and a
  string with the code to highlight. Returns an object with the following
  properties:

  - relevance (int)
  - value (an HTML string with highlighting markup)

  */
  function highlight(name, value, ignore_illegals, continuation) {
    function escapeRe(value) {
      return new RegExp(value.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "m");
    }

    function subMode(lexeme, mode) {
      var i, length;

      for (i = 0, length = mode.contains.length; i < length; i++) {
        if (testRe(mode.contains[i].beginRe, lexeme)) {
          if (mode.contains[i].endSameAsBegin) {
            mode.contains[i].endRe = escapeRe(
              mode.contains[i].beginRe.exec(lexeme)[0]
            );
          }
          return mode.contains[i];
        }
      }
    }

    function endOfMode(mode, lexeme) {
      if (testRe(mode.endRe, lexeme)) {
        while (mode.endsParent && mode.parent) {
          mode = mode.parent;
        }
        return mode;
      }
      if (mode.endsWithParent) {
        return endOfMode(mode.parent, lexeme);
      }
    }

    function isIllegal(lexeme, mode) {
      return !ignore_illegals && testRe(mode.illegalRe, lexeme);
    }

    function keywordMatch(mode, match) {
      var match_str = language.case_insensitive
        ? match[0].toLowerCase()
        : match[0];
      return (
        mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str]
      );
    }

    function buildSpan(classname, insideSpan, leaveOpen, noPrefix) {
      var classPrefix = noPrefix ? "" : options.classPrefix,
        openSpan = '<span class="' + classPrefix,
        closeSpan = leaveOpen ? "" : spanEndTag;

      openSpan += classname + '">';

      return openSpan + insideSpan + closeSpan;
    }

    function processKeywords() {
      var keyword_match, last_index, match, result;

      if (!top.keywords) return escape(mode_buffer);

      result = "";
      last_index = 0;
      top.lexemesRe.lastIndex = 0;
      match = top.lexemesRe.exec(mode_buffer);

      while (match) {
        result += escape(mode_buffer.substring(last_index, match.index));
        keyword_match = keywordMatch(top, match);
        if (keyword_match) {
          relevance += keyword_match[1];
          result += buildSpan(keyword_match[0], escape(match[0]));
        } else {
          result += escape(match[0]);
        }
        last_index = top.lexemesRe.lastIndex;
        match = top.lexemesRe.exec(mode_buffer);
      }
      return result + escape(mode_buffer.substr(last_index));
    }

    function processSubLanguage() {
      var explicit = typeof top.subLanguage === "string";
      if (explicit && !languages[top.subLanguage]) {
        return escape(mode_buffer);
      }

      var result = explicit
        ? highlight(
            top.subLanguage,
            mode_buffer,
            true,
            continuations[top.subLanguage]
          )
        : highlightAuto(
            mode_buffer,
            top.subLanguage.length ? top.subLanguage : undefined
          );

      // Counting embedded language score towards the host language may be disabled
      // with zeroing the containing mode relevance. Usecase in point is Markdown that
      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
      // score.
      if (top.relevance > 0) {
        relevance += result.relevance;
      }
      if (explicit) {
        continuations[top.subLanguage] = result.top;
      }
      return buildSpan(result.language, result.value, false, true);
    }

    function processBuffer() {
      result +=
        top.subLanguage != null ? processSubLanguage() : processKeywords();
      mode_buffer = "";
    }

    function startNewMode(mode) {
      result += mode.className ? buildSpan(mode.className, "", true) : "";
      top = Object.create(mode, { parent: { value: top } });
    }

    function processLexeme(buffer, lexeme) {
      mode_buffer += buffer;

      if (lexeme == null) {
        processBuffer();
        return 0;
      }

      var new_mode = subMode(lexeme, top);
      if (new_mode) {
        if (new_mode.skip) {
          mode_buffer += lexeme;
        } else {
          if (new_mode.excludeBegin) {
            mode_buffer += lexeme;
          }
          processBuffer();
          if (!new_mode.returnBegin && !new_mode.excludeBegin) {
            mode_buffer = lexeme;
          }
        }
        startNewMode(new_mode, lexeme);
        return new_mode.returnBegin ? 0 : lexeme.length;
      }

      var end_mode = endOfMode(top, lexeme);
      if (end_mode) {
        var origin = top;
        if (origin.skip) {
          mode_buffer += lexeme;
        } else {
          if (!(origin.returnEnd || origin.excludeEnd)) {
            mode_buffer += lexeme;
          }
          processBuffer();
          if (origin.excludeEnd) {
            mode_buffer = lexeme;
          }
        }
        do {
          if (top.className) {
            result += spanEndTag;
          }
          if (!top.skip && !top.subLanguage) {
            relevance += top.relevance;
          }
          top = top.parent;
        } while (top !== end_mode.parent);
        if (end_mode.starts) {
          if (end_mode.endSameAsBegin) {
            end_mode.starts.endRe = end_mode.endRe;
          }
          startNewMode(end_mode.starts, "");
        }
        return origin.returnEnd ? 0 : lexeme.length;
      }

      if (isIllegal(lexeme, top))
        throw new Error(
          'Illegal lexeme "' +
            lexeme +
            '" for mode "' +
            (top.className || "<unnamed>") +
            '"'
        );

      /*
      Parser should not reach this point as all types of lexemes should be caught
      earlier, but if it does due to some bug make sure it advances at least one
      character forward to prevent infinite looping.
      */
      mode_buffer += lexeme;
      return lexeme.length || 1;
    }

    var language = getLanguage(name);
    if (!language) {
      throw new Error('Unknown language: "' + name + '"');
    }

    compileLanguage(language);
    var top = continuation || language;
    var continuations = {}; // keep continuations for sub-languages
    var result = "",
      current;
    for (current = top; current !== language; current = current.parent) {
      if (current.className) {
        result = buildSpan(current.className, "", true) + result;
      }
    }
    var mode_buffer = "";
    var relevance = 0;
    try {
      var match,
        count,
        index = 0;
      while (true) {
        top.terminators.lastIndex = index;
        match = top.terminators.exec(value);
        if (!match) break;
        count = processLexeme(value.substring(index, match.index), match[0]);
        index = match.index + count;
      }
      processLexeme(value.substr(index));
      for (current = top; current.parent; current = current.parent) {
        // close dangling modes
        if (current.className) {
          result += spanEndTag;
        }
      }
      return {
        relevance: relevance,
        value: result,
        language: name,
        top: top
      };
    } catch (e) {
      if (e.message && e.message.indexOf("Illegal") !== -1) {
        return {
          relevance: 0,
          value: escape(value)
        };
      } else {
        throw e;
      }
    }
  }

  /*
  Highlighting with language detection. Accepts a string with the code to
  highlight. Returns an object with the following properties:

  - language (detected language)
  - relevance (int)
  - value (an HTML string with highlighting markup)
  - second_best (object with the same structure for second-best heuristically
    detected language, may be absent)

  */
  function highlightAuto(text, languageSubset) {
    languageSubset =
      languageSubset || options.languages || objectKeys(languages);
    var result = {
      relevance: 0,
      value: escape(text)
    };
    var second_best = result;
    languageSubset
      .filter(getLanguage)
      .filter(autoDetection)
      .forEach(function(name) {
        var current = highlight(name, text, false);
        current.language = name;
        if (current.relevance > second_best.relevance) {
          second_best = current;
        }
        if (current.relevance > result.relevance) {
          second_best = result;
          result = current;
        }
      });
    if (second_best.language) {
      result.second_best = second_best;
    }
    return result;
  }

  /*
  Post-processing of the highlighted markup:

  - replace TABs with something more useful
  - replace real line-breaks with '<br>' for non-pre containers

  */
  function fixMarkup(value) {
    return !(options.tabReplace || options.useBR)
      ? value
      : value.replace(fixMarkupRe, function(match, p1) {
          if (options.useBR && match === "\n") {
            return "<br>";
          } else if (options.tabReplace) {
            return p1.replace(/\t/g, options.tabReplace);
          }
          return "";
        });
  }

  function buildClassName(prevClassName, currentLang, resultLang) {
    var language = currentLang ? aliases[currentLang] : resultLang,
      result = [prevClassName.trim()];

    if (!prevClassName.match(/\bhljs\b/)) {
      result.push("hljs");
    }

    if (prevClassName.indexOf(language) === -1) {
      result.push(language);
    }

    return result.join(" ").trim();
  }

  /*
  Applies highlighting to a DOM node containing code. Accepts a DOM node and
  two optional parameters for fixMarkup.
  */
  function highlightBlock(block) {
    var node, originalStream, result, resultNode, text;
    var language = blockLanguage(block);

    if (isNotHighlighted(language)) return;

    if (options.useBR) {
      node = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
      node.innerHTML = block.innerHTML
        .replace(/\n/g, "")
        .replace(/<br[ \/]*>/g, "\n");
    } else {
      node = block;
    }
    text = node.textContent;
    result = language ? highlight(language, text, true) : highlightAuto(text);

    originalStream = nodeStream(node);
    if (originalStream.length) {
      resultNode = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "div"
      );
      resultNode.innerHTML = result.value;
      result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
    }
    result.value = fixMarkup(result.value);

    block.innerHTML = result.value;
    block.className = buildClassName(
      block.className,
      language,
      result.language
    );
    block.result = {
      language: result.language,
      re: result.relevance
    };
    if (result.second_best) {
      block.second_best = {
        language: result.second_best.language,
        re: result.second_best.relevance
      };
    }
  }

  /*
  Updates highlight.js global options with values passed in the form of an object.
  */
  function configure(user_options) {
    options = inherit(options, user_options);
  }

  /*
  Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
  */
  function initHighlighting() {
    if (initHighlighting.called) return;
    initHighlighting.called = true;

    var blocks = document.querySelectorAll("pre code");
    ArrayProto.forEach.call(blocks, highlightBlock);
  }

  /*
  Attaches highlighting to the page load event.
  */
  function initHighlightingOnLoad() {
    addEventListener("DOMContentLoaded", initHighlighting, false);
    addEventListener("load", initHighlighting, false);
  }

  function registerLanguage(name, language) {
    var lang = (languages[name] = language(hljs));
    if (lang.aliases) {
      lang.aliases.forEach(function(alias) {
        aliases[alias] = name;
      });
    }
  }

  function listLanguages() {
    return objectKeys(languages);
  }

  function getLanguage(name) {
    name = (name || "").toLowerCase();
    return languages[name] || languages[aliases[name]];
  }

  function autoDetection(name) {
    var lang = getLanguage(name);
    return lang && !lang.disableAutodetect;
  }

  /* Interface definition */

  hljs.highlight = highlight;
  hljs.highlightAuto = highlightAuto;
  hljs.fixMarkup = fixMarkup;
  hljs.highlightBlock = highlightBlock;
  hljs.configure = configure;
  hljs.initHighlighting = initHighlighting;
  hljs.initHighlightingOnLoad = initHighlightingOnLoad;
  hljs.registerLanguage = registerLanguage;
  hljs.listLanguages = listLanguages;
  hljs.getLanguage = getLanguage;
  hljs.autoDetection = autoDetection;
  hljs.inherit = inherit;

  // Common regexps
  hljs.IDENT_RE = "[a-zA-Z]\\w*";
  hljs.UNDERSCORE_IDENT_RE = "[a-zA-Z_]\\w*";
  hljs.NUMBER_RE = "\\b\\d+(\\.\\d+)?";
  hljs.C_NUMBER_RE =
    "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)"; // 0x..., 0..., decimal, float
  hljs.BINARY_NUMBER_RE = "\\b(0b[01]+)"; // 0b...
  hljs.RE_STARTERS_RE =
    "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";

  // Common modes
  hljs.BACKSLASH_ESCAPE = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  };
  hljs.APOS_STRING_MODE = {
    className: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  hljs.QUOTE_STRING_MODE = {
    className: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  hljs.PHRASAL_WORDS_MODE = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  };
  hljs.COMMENT = function(begin, end, inherits) {
    var mode = hljs.inherit(
      {
        className: "comment",
        begin: begin,
        end: end,
        contains: []
      },
      inherits || {}
    );
    mode.contains.push(hljs.PHRASAL_WORDS_MODE);
    mode.contains.push({
      className: "doctag",
      begin: "(?:TODO|FIXME|NOTE|BUG|XXX):",
      relevance: 0
    });
    return mode;
  };
  hljs.C_LINE_COMMENT_MODE = hljs.COMMENT("//", "$");
  hljs.C_BLOCK_COMMENT_MODE = hljs.COMMENT("/\\*", "\\*/");
  hljs.HASH_COMMENT_MODE = hljs.COMMENT("#", "$");
  hljs.NUMBER_MODE = {
    className: "number",
    begin: hljs.NUMBER_RE,
    relevance: 0
  };
  hljs.C_NUMBER_MODE = {
    className: "number",
    begin: hljs.C_NUMBER_RE,
    relevance: 0
  };
  hljs.BINARY_NUMBER_MODE = {
    className: "number",
    begin: hljs.BINARY_NUMBER_RE,
    relevance: 0
  };
  hljs.CSS_NUMBER_MODE = {
    className: "number",
    begin:
      hljs.NUMBER_RE +
      "(" +
      "%|em|ex|ch|rem" +
      "|vw|vh|vmin|vmax" +
      "|cm|mm|in|pt|pc|px" +
      "|deg|grad|rad|turn" +
      "|s|ms" +
      "|Hz|kHz" +
      "|dpi|dpcm|dppx" +
      ")?",
    relevance: 0
  };
  hljs.REGEXP_MODE = {
    className: "regexp",
    begin: /\//,
    end: /\/[gimuy]*/,
    illegal: /\n/,
    contains: [
      hljs.BACKSLASH_ESCAPE,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [hljs.BACKSLASH_ESCAPE]
      }
    ]
  };
  hljs.TITLE_MODE = {
    className: "title",
    begin: hljs.IDENT_RE,
    relevance: 0
  };
  hljs.UNDERSCORE_TITLE_MODE = {
    className: "title",
    begin: hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  };
  hljs.METHOD_GUARD = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  };

  hljs.registerLanguage("armasm", function(hljs) {
    //local labels: %?[FB]?[AT]?\d{1,2}\w+
    return {
      case_insensitive: true,
      aliases: ["arm"],
      lexemes: "\\.?" + hljs.IDENT_RE,
      keywords: {
        meta:
          //GNU preprocs
          ".2byte .4byte .align .ascii .asciz .balign .byte .code .data .else .end .endif .endm .endr .equ .err .exitm .extern .global .hword .if .ifdef .ifndef .include .irp .long .macro .rept .req .section .set .skip .space .text .word .arm .thumb .code16 .code32 .force_thumb .thumb_func .ltorg " +
          //ARM directives
          "ALIAS ALIGN ARM AREA ASSERT ATTR CN CODE CODE16 CODE32 COMMON CP DATA DCB DCD DCDU DCDO DCFD DCFDU DCI DCQ DCQU DCW DCWU DN ELIF ELSE END ENDFUNC ENDIF ENDP ENTRY EQU EXPORT EXPORTAS EXTERN FIELD FILL FUNCTION GBLA GBLL GBLS GET GLOBAL IF IMPORT INCBIN INCLUDE INFO KEEP LCLA LCLL LCLS LTORG MACRO MAP MEND MEXIT NOFP OPT PRESERVE8 PROC QN READONLY RELOC REQUIRE REQUIRE8 RLIST FN ROUT SETA SETL SETS SN SPACE SUBT THUMB THUMBX TTL WHILE WEND ",
        built_in:
          "r0 r1 r2 r3 r4 r5 r6 r7 r8 r9 r10 r11 r12 r13 r14 r15 " + //standard registers
          "pc lr sp ip sl sb fp " + //typical regs plus backward compatibility
          "a1 a2 a3 a4 v1 v2 v3 v4 v5 v6 v7 v8 f0 f1 f2 f3 f4 f5 f6 f7 " + //more regs and fp
          "p0 p1 p2 p3 p4 p5 p6 p7 p8 p9 p10 p11 p12 p13 p14 p15 " + //coprocessor regs
          "c0 c1 c2 c3 c4 c5 c6 c7 c8 c9 c10 c11 c12 c13 c14 c15 " + //more coproc
          "q0 q1 q2 q3 q4 q5 q6 q7 q8 q9 q10 q11 q12 q13 q14 q15 " + //advanced SIMD NEON regs
          //program status registers
          "cpsr_c cpsr_x cpsr_s cpsr_f cpsr_cx cpsr_cxs cpsr_xs cpsr_xsf cpsr_sf cpsr_cxsf " +
          "spsr_c spsr_x spsr_s spsr_f spsr_cx spsr_cxs spsr_xs spsr_xsf spsr_sf spsr_cxsf " +
          //NEON and VFP registers
          "s0 s1 s2 s3 s4 s5 s6 s7 s8 s9 s10 s11 s12 s13 s14 s15 " +
          "s16 s17 s18 s19 s20 s21 s22 s23 s24 s25 s26 s27 s28 s29 s30 s31 " +
          "d0 d1 d2 d3 d4 d5 d6 d7 d8 d9 d10 d11 d12 d13 d14 d15 " +
          "d16 d17 d18 d19 d20 d21 d22 d23 d24 d25 d26 d27 d28 d29 d30 d31 " +
          "{PC} {VAR} {TRUE} {FALSE} {OPT} {CONFIG} {ENDIAN} {CODESIZE} {CPU} {FPU} {ARCHITECTURE} {PCSTOREOFFSET} {ARMASM_VERSION} {INTER} {ROPI} {RWPI} {SWST} {NOSWST} . @"
      },
      contains: [
        {
          className: "keyword",
          begin:
            "\\b(" + //mnemonics
            "adc|" +
            "(qd?|sh?|u[qh]?)?add(8|16)?|usada?8|(q|sh?|u[qh]?)?(as|sa)x|" +
            "and|adrl?|sbc|rs[bc]|asr|b[lx]?|blx|bxj|cbn?z|tb[bh]|bic|" +
            "bfc|bfi|[su]bfx|bkpt|cdp2?|clz|clrex|cmp|cmn|cpsi[ed]|cps|" +
            "setend|dbg|dmb|dsb|eor|isb|it[te]{0,3}|lsl|lsr|ror|rrx|" +
            "ldm(([id][ab])|f[ds])?|ldr((s|ex)?[bhd])?|movt?|mvn|mra|mar|" +
            "mul|[us]mull|smul[bwt][bt]|smu[as]d|smmul|smmla|" +
            "mla|umlaal|smlal?([wbt][bt]|d)|mls|smlsl?[ds]|smc|svc|sev|" +
            "mia([bt]{2}|ph)?|mrr?c2?|mcrr2?|mrs|msr|orr|orn|pkh(tb|bt)|rbit|" +
            "rev(16|sh)?|sel|[su]sat(16)?|nop|pop|push|rfe([id][ab])?|" +
            "stm([id][ab])?|str(ex)?[bhd]?|(qd?)?sub|(sh?|q|u[qh]?)?sub(8|16)|" +
            "[su]xt(a?h|a?b(16)?)|srs([id][ab])?|swpb?|swi|smi|tst|teq|" +
            "wfe|wfi|yield" +
            ")" +
            "(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al|hs|lo)?" + //condition codes
            "[sptrx]?", //legal postfixes
          end: "\\s"
        },
        hljs.COMMENT("[;@]", "$", { relevance: 0 }),
        hljs.C_BLOCK_COMMENT_MODE,
        hljs.QUOTE_STRING_MODE,
        {
          className: "string",
          begin: "'",
          end: "[^\\\\]'",
          relevance: 0
        },
        {
          className: "title",
          begin: "\\|",
          end: "\\|",
          illegal: "\\n",
          relevance: 0
        },
        {
          className: "number",
          variants: [
            { begin: "[#$=]?0x[0-9a-f]+" }, //hex
            { begin: "[#$=]?0b[01]+" }, //bin
            { begin: "[#$=]\\d+" }, //literal
            { begin: "\\b\\d+" } //bare number
          ],
          relevance: 0
        },
        {
          className: "symbol",
          variants: [
            { begin: "^[a-z_\\.\\$][a-z0-9_\\.\\$]+" }, //ARM syntax
            { begin: "^\\s*[a-z_\\.\\$][a-z0-9_\\.\\$]+:" }, //GNU ARM syntax
            { begin: "[=#]\\w+" } //label reference
          ],
          relevance: 0
        }
      ]
    };
  });

  hljs.registerLanguage("bash", function(hljs) {
    var VAR = {
      className: "variable",
      variants: [{ begin: /\$[\w\d#@][\w\d_]*/ }, { begin: /\$\{(.*?)}/ }]
    };
    var QUOTE_STRING = {
      className: "string",
      begin: /"/,
      end: /"/,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        VAR,
        {
          className: "variable",
          begin: /\$\(/,
          end: /\)/,
          contains: [hljs.BACKSLASH_ESCAPE]
        }
      ]
    };
    var APOS_STRING = {
      className: "string",
      begin: /'/,
      end: /'/
    };

    return {
      aliases: ["sh", "zsh"],
      lexemes: /\b-?[a-z\._]+\b/,
      keywords: {
        keyword: "if then else elif fi for while in do done case esac function",
        literal: "true false",
        built_in:
          // Shell built-ins
          // http://www.gnu.org/software/bash/manual/html_node/Shell-Builtin-Commands.html
          "break cd continue eval exec exit export getopts hash pwd readonly return shift test times " +
          "trap umask unset " +
          // Bash built-ins
          "alias bind builtin caller command declare echo enable help let local logout mapfile printf " +
          "read readarray source type typeset ulimit unalias " +
          // Shell modifiers
          "set shopt " +
          // Zsh built-ins
          "autoload bg bindkey bye cap chdir clone comparguments compcall compctl compdescribe compfiles " +
          "compgroups compquote comptags comptry compvalues dirs disable disown echotc echoti emulate " +
          "fc fg float functions getcap getln history integer jobs kill limit log noglob popd print " +
          "pushd pushln rehash sched setcap setopt stat suspend ttyctl unfunction unhash unlimit " +
          "unsetopt vared wait whence where which zcompile zformat zftp zle zmodload zparseopts zprof " +
          "zpty zregexparse zsocket zstyle ztcp",
        _: "-ne -eq -lt -gt -f -d -e -s -l -a" // relevance booster
      },
      contains: [
        {
          className: "meta",
          begin: /^#![^\n]+sh\s*$/,
          relevance: 10
        },
        {
          className: "function",
          begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
          returnBegin: true,
          contains: [hljs.inherit(hljs.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
          relevance: 0
        },
        hljs.HASH_COMMENT_MODE,
        QUOTE_STRING,
        APOS_STRING,
        VAR
      ]
    };
  });

  hljs.registerLanguage("clojure", function(hljs) {
    var keywords = {
      "builtin-name":
        // Clojure keywords
        "def defonce cond apply if-not if-let if not not= = < > <= >= == + / * - rem " +
        "quot neg? pos? delay? symbol? keyword? true? false? integer? empty? coll? list? " +
        "set? ifn? fn? associative? sequential? sorted? counted? reversible? number? decimal? " +
        "class? distinct? isa? float? rational? reduced? ratio? odd? even? char? seq? vector? " +
        "string? map? nil? contains? zero? instance? not-every? not-any? libspec? -> ->> .. . " +
        "inc compare do dotimes mapcat take remove take-while drop letfn drop-last take-last " +
        "drop-while while intern condp case reduced cycle split-at split-with repeat replicate " +
        "iterate range merge zipmap declare line-seq sort comparator sort-by dorun doall nthnext " +
        "nthrest partition eval doseq await await-for let agent atom send send-off release-pending-sends " +
        "add-watch mapv filterv remove-watch agent-error restart-agent set-error-handler error-handler " +
        "set-error-mode! error-mode shutdown-agents quote var fn loop recur throw try monitor-enter " +
        "monitor-exit defmacro defn defn- macroexpand macroexpand-1 for dosync and or " +
        "when when-not when-let comp juxt partial sequence memoize constantly complement identity assert " +
        "peek pop doto proxy defstruct first rest cons defprotocol cast coll deftype defrecord last butlast " +
        "sigs reify second ffirst fnext nfirst nnext defmulti defmethod meta with-meta ns in-ns create-ns import " +
        "refer keys select-keys vals key val rseq name namespace promise into transient persistent! conj! " +
        "assoc! dissoc! pop! disj! use class type num float double short byte boolean bigint biginteger " +
        "bigdec print-method print-dup throw-if printf format load compile get-in update-in pr pr-on newline " +
        "flush read slurp read-line subvec with-open memfn time re-find re-groups rand-int rand mod locking " +
        "assert-valid-fdecl alias resolve ref deref refset swap! reset! set-validator! compare-and-set! alter-meta! " +
        "reset-meta! commute get-validator alter ref-set ref-history-count ref-min-history ref-max-history ensure sync io! " +
        "new next conj set! to-array future future-call into-array aset gen-class reduce map filter find empty " +
        "hash-map hash-set sorted-map sorted-map-by sorted-set sorted-set-by vec vector seq flatten reverse assoc dissoc list " +
        "disj get union difference intersection extend extend-type extend-protocol int nth delay count concat chunk chunk-buffer " +
        "chunk-append chunk-first chunk-rest max min dec unchecked-inc-int unchecked-inc unchecked-dec-inc unchecked-dec unchecked-negate " +
        "unchecked-add-int unchecked-add unchecked-subtract-int unchecked-subtract chunk-next chunk-cons chunked-seq? prn vary-meta " +
        "lazy-seq spread list* str find-keyword keyword symbol gensym force rationalize"
    };

    var SYMBOLSTART = "a-zA-Z_\\-!.?+*=<>&#'";
    var SYMBOL_RE = "[" + SYMBOLSTART + "][" + SYMBOLSTART + "0-9/;:]*";
    var SIMPLE_NUMBER_RE = "[-+]?\\d+(\\.\\d+)?";

    var SYMBOL = {
      begin: SYMBOL_RE,
      relevance: 0
    };
    var NUMBER = {
      className: "number",
      begin: SIMPLE_NUMBER_RE,
      relevance: 0
    };
    var STRING = hljs.inherit(hljs.QUOTE_STRING_MODE, { illegal: null });
    var COMMENT = hljs.COMMENT(";", "$", {
      relevance: 0
    });
    var LITERAL = {
      className: "literal",
      begin: /\b(true|false|nil)\b/
    };
    var COLLECTION = {
      begin: "[\\[\\{]",
      end: "[\\]\\}]"
    };
    var HINT = {
      className: "comment",
      begin: "\\^" + SYMBOL_RE
    };
    var HINT_COL = hljs.COMMENT("\\^\\{", "\\}");
    var KEY = {
      className: "symbol",
      begin: "[:]{1,2}" + SYMBOL_RE
    };
    var LIST = {
      begin: "\\(",
      end: "\\)"
    };
    var BODY = {
      endsWithParent: true,
      relevance: 0
    };
    var NAME = {
      keywords: keywords,
      lexemes: SYMBOL_RE,
      className: "name",
      begin: SYMBOL_RE,
      starts: BODY
    };
    var DEFAULT_CONTAINS = [
      LIST,
      STRING,
      HINT,
      HINT_COL,
      COMMENT,
      KEY,
      COLLECTION,
      NUMBER,
      LITERAL,
      SYMBOL
    ];

    LIST.contains = [hljs.COMMENT("comment", ""), NAME, BODY];
    BODY.contains = DEFAULT_CONTAINS;
    COLLECTION.contains = DEFAULT_CONTAINS;
    HINT_COL.contains = [COLLECTION];

    return {
      aliases: ["clj"],
      illegal: /\S/,
      contains: [
        LIST,
        STRING,
        HINT,
        HINT_COL,
        COMMENT,
        KEY,
        COLLECTION,
        NUMBER,
        LITERAL
      ]
    };
  });

  hljs.registerLanguage("cmake", function(hljs) {
    return {
      aliases: ["cmake.in"],
      case_insensitive: true,
      keywords: {
        keyword:
          // scripting commands
          "break cmake_host_system_information cmake_minimum_required cmake_parse_arguments " +
          "cmake_policy configure_file continue elseif else endforeach endfunction endif endmacro " +
          "endwhile execute_process file find_file find_library find_package find_path " +
          "find_program foreach function get_cmake_property get_directory_property " +
          "get_filename_component get_property if include include_guard list macro " +
          "mark_as_advanced math message option return separate_arguments " +
          "set_directory_properties set_property set site_name string unset variable_watch while " +
          // project commands
          "add_compile_definitions add_compile_options add_custom_command add_custom_target " +
          "add_definitions add_dependencies add_executable add_library add_link_options " +
          "add_subdirectory add_test aux_source_directory build_command create_test_sourcelist " +
          "define_property enable_language enable_testing export fltk_wrap_ui " +
          "get_source_file_property get_target_property get_test_property include_directories " +
          "include_external_msproject include_regular_expression install link_directories " +
          "link_libraries load_cache project qt_wrap_cpp qt_wrap_ui remove_definitions " +
          "set_source_files_properties set_target_properties set_tests_properties source_group " +
          "target_compile_definitions target_compile_features target_compile_options " +
          "target_include_directories target_link_directories target_link_libraries " +
          "target_link_options target_sources try_compile try_run " +
          // CTest commands
          "ctest_build ctest_configure ctest_coverage ctest_empty_binary_directory ctest_memcheck " +
          "ctest_read_custom_files ctest_run_script ctest_sleep ctest_start ctest_submit " +
          "ctest_test ctest_update ctest_upload " +
          // deprecated commands
          "build_name exec_program export_library_dependencies install_files install_programs " +
          "install_targets load_command make_directory output_required_files remove " +
          "subdir_depends subdirs use_mangled_mesa utility_source variable_requires write_file " +
          "qt5_use_modules qt5_use_package qt5_wrap_cpp " +
          // core keywords
          "on off true false and or not command policy target test exists is_newer_than " +
          "is_directory is_symlink is_absolute matches less greater equal less_equal " +
          "greater_equal strless strgreater strequal strless_equal strgreater_equal version_less " +
          "version_greater version_equal version_less_equal version_greater_equal in_list defined"
      },
      contains: [
        {
          className: "variable",
          begin: "\\${",
          end: "}"
        },
        hljs.HASH_COMMENT_MODE,
        hljs.QUOTE_STRING_MODE,
        hljs.NUMBER_MODE
      ]
    };
  });

  hljs.registerLanguage("cpp", function(hljs) {
    var CPP_PRIMITIVE_TYPES = {
      className: "keyword",
      begin: "\\b[a-z\\d_]*_t\\b"
    };

    var STRINGS = {
      className: "string",
      variants: [
        {
          begin: '(u8?|U|L)?"',
          end: '"',
          illegal: "\\n",
          contains: [hljs.BACKSLASH_ESCAPE]
        },
        {
          // TODO: This does not handle raw string literals with prefixes. Using
          // a single regex with backreferences would work (note to use *?
          // instead of * to make it non-greedy), but the mode.terminators
          // computation in highlight.js breaks the counting.
          begin: '(u8?|U|L)?R"\\(',
          end: '\\)"'
        },
        {
          begin: "'\\\\?.",
          end: "'",
          illegal: "."
        }
      ]
    };

    var NUMBERS = {
      className: "number",
      variants: [
        { begin: "\\b(0b[01']+)" },
        {
          begin:
            "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"
        },
        {
          begin:
            "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
        }
      ],
      relevance: 0
    };

    var PREPROCESSOR = {
      className: "meta",
      begin: /#\s*[a-z]+\b/,
      end: /$/,
      keywords: {
        "meta-keyword":
          "if else elif endif define undef warning error line " +
          "pragma ifdef ifndef include"
      },
      contains: [
        {
          begin: /\\\n/,
          relevance: 0
        },
        hljs.inherit(STRINGS, { className: "meta-string" }),
        {
          className: "meta-string",
          begin: /<[^\n>]*>/,
          end: /$/,
          illegal: "\\n"
        },
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE
      ]
    };

    var FUNCTION_TITLE = hljs.IDENT_RE + "\\s*\\(";

    var CPP_KEYWORDS = {
      keyword:
        "int float while private char catch import module export virtual operator sizeof " +
        "dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace " +
        "unsigned long volatile static protected bool template mutable if public friend " +
        "do goto auto void enum else break extern using asm case typeid " +
        "short reinterpret_cast|10 default double register explicit signed typename try this " +
        "switch continue inline delete alignof constexpr decltype " +
        "noexcept static_assert thread_local restrict _Bool complex _Complex _Imaginary " +
        "atomic_bool atomic_char atomic_schar " +
        "atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong " +
        "atomic_ullong new throw return " +
        "and or not",
      built_in:
        "std string cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream " +
        "auto_ptr deque list queue stack vector map set bitset multiset multimap unordered_set " +
        "unordered_map unordered_multiset unordered_multimap array shared_ptr abort abs acos " +
        "asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp " +
        "fscanf isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper " +
        "isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow " +
        "printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp " +
        "strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan " +
        "vfprintf vprintf vsprintf endl initializer_list unique_ptr",
      literal: "true false nullptr NULL"
    };

    var EXPRESSION_CONTAINS = [
      CPP_PRIMITIVE_TYPES,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      NUMBERS,
      STRINGS
    ];

    return {
      aliases: ["c", "cc", "h", "c++", "h++", "hpp"],
      keywords: CPP_KEYWORDS,
      illegal: "</",
      contains: EXPRESSION_CONTAINS.concat([
        PREPROCESSOR,
        {
          begin:
            "\\b(deque|list|queue|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
          end: ">",
          keywords: CPP_KEYWORDS,
          contains: ["self", CPP_PRIMITIVE_TYPES]
        },
        {
          begin: hljs.IDENT_RE + "::",
          keywords: CPP_KEYWORDS
        },
        {
          // This mode covers expression context where we can't expect a function
          // definition and shouldn't highlight anything that looks like one:
          // `return some()`, `else if()`, `(x*sum(1, 2))`
          variants: [
            { begin: /=/, end: /;/ },
            { begin: /\(/, end: /\)/ },
            { beginKeywords: "new throw return else", end: /;/ }
          ],
          keywords: CPP_KEYWORDS,
          contains: EXPRESSION_CONTAINS.concat([
            {
              begin: /\(/,
              end: /\)/,
              keywords: CPP_KEYWORDS,
              contains: EXPRESSION_CONTAINS.concat(["self"]),
              relevance: 0
            }
          ]),
          relevance: 0
        },
        {
          className: "function",
          begin: "(" + hljs.IDENT_RE + "[\\*&\\s]+)+" + FUNCTION_TITLE,
          returnBegin: true,
          end: /[{;=]/,
          excludeEnd: true,
          keywords: CPP_KEYWORDS,
          illegal: /[^\w\s\*&]/,
          contains: [
            {
              begin: FUNCTION_TITLE,
              returnBegin: true,
              contains: [hljs.TITLE_MODE],
              relevance: 0
            },
            {
              className: "params",
              begin: /\(/,
              end: /\)/,
              keywords: CPP_KEYWORDS,
              relevance: 0,
              contains: [
                hljs.C_LINE_COMMENT_MODE,
                hljs.C_BLOCK_COMMENT_MODE,
                STRINGS,
                NUMBERS,
                CPP_PRIMITIVE_TYPES,
                // Count matching parentheses.
                {
                  begin: /\(/,
                  end: /\)/,
                  keywords: CPP_KEYWORDS,
                  relevance: 0,
                  contains: [
                    "self",
                    hljs.C_LINE_COMMENT_MODE,
                    hljs.C_BLOCK_COMMENT_MODE,
                    STRINGS,
                    NUMBERS,
                    CPP_PRIMITIVE_TYPES
                  ]
                }
              ]
            },
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            PREPROCESSOR
          ]
        },
        {
          className: "class",
          beginKeywords: "class struct",
          end: /[{;:]/,
          contains: [
            { begin: /</, end: />/, contains: ["self"] }, // skip generic stuff
            hljs.TITLE_MODE
          ]
        }
      ]),
      exports: {
        preprocessor: PREPROCESSOR,
        strings: STRINGS,
        keywords: CPP_KEYWORDS
      }
    };
  });

  hljs.registerLanguage("cs", function(hljs) {
    var KEYWORDS = {
      keyword:
        // Normal keywords.
        "abstract as base bool break byte case catch char checked const continue decimal " +
        "default delegate do double enum event explicit extern finally fixed float " +
        "for foreach goto if implicit in int interface internal is lock long nameof " +
        "object operator out override params private protected public readonly ref sbyte " +
        "sealed short sizeof stackalloc static string struct switch this try typeof " +
        "uint ulong unchecked unsafe ushort using virtual void volatile while " +
        // Contextual keywords.
        "add alias ascending async await by descending dynamic equals from get global group into join " +
        "let on orderby partial remove select set value var where yield",
      literal: "null false true"
    };
    var NUMBERS = {
      className: "number",
      variants: [
        { begin: "\\b(0b[01']+)" },
        {
          begin:
            "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"
        },
        {
          begin:
            "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
        }
      ],
      relevance: 0
    };
    var VERBATIM_STRING = {
      className: "string",
      begin: '@"',
      end: '"',
      contains: [{ begin: '""' }]
    };
    var VERBATIM_STRING_NO_LF = hljs.inherit(VERBATIM_STRING, {
      illegal: /\n/
    });
    var SUBST = {
      className: "subst",
      begin: "{",
      end: "}",
      keywords: KEYWORDS
    };
    var SUBST_NO_LF = hljs.inherit(SUBST, { illegal: /\n/ });
    var INTERPOLATED_STRING = {
      className: "string",
      begin: /\$"/,
      end: '"',
      illegal: /\n/,
      contains: [
        { begin: "{{" },
        { begin: "}}" },
        hljs.BACKSLASH_ESCAPE,
        SUBST_NO_LF
      ]
    };
    var INTERPOLATED_VERBATIM_STRING = {
      className: "string",
      begin: /\$@"/,
      end: '"',
      contains: [{ begin: "{{" }, { begin: "}}" }, { begin: '""' }, SUBST]
    };
    var INTERPOLATED_VERBATIM_STRING_NO_LF = hljs.inherit(
      INTERPOLATED_VERBATIM_STRING,
      {
        illegal: /\n/,
        contains: [
          { begin: "{{" },
          { begin: "}}" },
          { begin: '""' },
          SUBST_NO_LF
        ]
      }
    );
    SUBST.contains = [
      INTERPOLATED_VERBATIM_STRING,
      INTERPOLATED_STRING,
      VERBATIM_STRING,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      NUMBERS,
      hljs.C_BLOCK_COMMENT_MODE
    ];
    SUBST_NO_LF.contains = [
      INTERPOLATED_VERBATIM_STRING_NO_LF,
      INTERPOLATED_STRING,
      VERBATIM_STRING_NO_LF,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      NUMBERS,
      hljs.inherit(hljs.C_BLOCK_COMMENT_MODE, { illegal: /\n/ })
    ];
    var STRING = {
      variants: [
        INTERPOLATED_VERBATIM_STRING,
        INTERPOLATED_STRING,
        VERBATIM_STRING,
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE
      ]
    };

    var TYPE_IDENT_RE =
      hljs.IDENT_RE +
      "(<" +
      hljs.IDENT_RE +
      "(\\s*,\\s*" +
      hljs.IDENT_RE +
      ")*>)?(\\[\\])?";

    return {
      aliases: ["csharp", "c#"],
      keywords: KEYWORDS,
      illegal: /::/,
      contains: [
        hljs.COMMENT("///", "$", {
          returnBegin: true,
          contains: [
            {
              className: "doctag",
              variants: [
                {
                  begin: "///",
                  relevance: 0
                },
                {
                  begin: "<!--|-->"
                },
                {
                  begin: "</?",
                  end: ">"
                }
              ]
            }
          ]
        }),
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        {
          className: "meta",
          begin: "#",
          end: "$",
          keywords: {
            "meta-keyword":
              "if else elif endif define undef warning error line region endregion pragma checksum"
          }
        },
        STRING,
        NUMBERS,
        {
          beginKeywords: "class interface",
          end: /[{;=]/,
          illegal: /[^\s:,]/,
          contains: [
            hljs.TITLE_MODE,
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE
          ]
        },
        {
          beginKeywords: "namespace",
          end: /[{;=]/,
          illegal: /[^\s:]/,
          contains: [
            hljs.inherit(hljs.TITLE_MODE, { begin: "[a-zA-Z](\\.?\\w)*" }),
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE
          ]
        },
        {
          // [Attributes("")]
          className: "meta",
          begin: "^\\s*\\[",
          excludeBegin: true,
          end: "\\]",
          excludeEnd: true,
          contains: [{ className: "meta-string", begin: /"/, end: /"/ }]
        },
        {
          // Expression keywords prevent 'keyword Name(...)' from being
          // recognized as a function definition
          beginKeywords: "new return throw await else",
          relevance: 0
        },
        {
          className: "function",
          begin: "(" + TYPE_IDENT_RE + "\\s+)+" + hljs.IDENT_RE + "\\s*\\(",
          returnBegin: true,
          end: /\s*[{;=]/,
          excludeEnd: true,
          keywords: KEYWORDS,
          contains: [
            {
              begin: hljs.IDENT_RE + "\\s*\\(",
              returnBegin: true,
              contains: [hljs.TITLE_MODE],
              relevance: 0
            },
            {
              className: "params",
              begin: /\(/,
              end: /\)/,
              excludeBegin: true,
              excludeEnd: true,
              keywords: KEYWORDS,
              relevance: 0,
              contains: [STRING, NUMBERS, hljs.C_BLOCK_COMMENT_MODE]
            },
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE
          ]
        }
      ]
    };
  });

  hljs.registerLanguage("css", function(hljs) {
    var IDENT_RE = "[a-zA-Z-][a-zA-Z0-9_-]*";
    var RULE = {
      begin: /[A-Z\_\.\-]+\s*:/,
      returnBegin: true,
      end: ";",
      endsWithParent: true,
      contains: [
        {
          className: "attribute",
          begin: /\S/,
          end: ":",
          excludeEnd: true,
          starts: {
            endsWithParent: true,
            excludeEnd: true,
            contains: [
              {
                begin: /[\w-]+\(/,
                returnBegin: true,
                contains: [
                  {
                    className: "built_in",
                    begin: /[\w-]+/
                  },
                  {
                    begin: /\(/,
                    end: /\)/,
                    contains: [hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE]
                  }
                ]
              },
              hljs.CSS_NUMBER_MODE,
              hljs.QUOTE_STRING_MODE,
              hljs.APOS_STRING_MODE,
              hljs.C_BLOCK_COMMENT_MODE,
              {
                className: "number",
                begin: "#[0-9A-Fa-f]+"
              },
              {
                className: "meta",
                begin: "!important"
              }
            ]
          }
        }
      ]
    };

    return {
      case_insensitive: true,
      illegal: /[=\/|'\$]/,
      contains: [
        hljs.C_BLOCK_COMMENT_MODE,
        {
          className: "selector-id",
          begin: /#[A-Za-z0-9_-]+/
        },
        {
          className: "selector-class",
          begin: /\.[A-Za-z0-9_-]+/
        },
        {
          className: "selector-attr",
          begin: /\[/,
          end: /\]/,
          illegal: "$"
        },
        {
          className: "selector-pseudo",
          begin: /:(:)?[a-zA-Z0-9\_\-\+\(\)"'.]+/
        },
        {
          begin: "@(font-face|page)",
          lexemes: "[a-z-]+",
          keywords: "font-face page"
        },
        {
          begin: "@",
          end: "[{;]", // at_rule eating first "{" is a good thing
          // because it doesn’t let it to be parsed as
          // a rule set but instead drops parser into
          // the default mode which is how it should be.
          illegal: /:/, // break on Less variables @var: ...
          contains: [
            {
              className: "keyword",
              begin: /\w+/
            },
            {
              begin: /\s/,
              endsWithParent: true,
              excludeEnd: true,
              relevance: 0,
              contains: [
                hljs.APOS_STRING_MODE,
                hljs.QUOTE_STRING_MODE,
                hljs.CSS_NUMBER_MODE
              ]
            }
          ]
        },
        {
          className: "selector-tag",
          begin: IDENT_RE,
          relevance: 0
        },
        {
          begin: "{",
          end: "}",
          illegal: /\S/,
          contains: [hljs.C_BLOCK_COMMENT_MODE, RULE]
        }
      ]
    };
  });

  hljs.registerLanguage("diff", function(hljs) {
    return {
      aliases: ["patch"],
      contains: [
        {
          className: "meta",
          relevance: 10,
          variants: [
            { begin: /^@@ +\-\d+,\d+ +\+\d+,\d+ +@@$/ },
            { begin: /^\*\*\* +\d+,\d+ +\*\*\*\*$/ },
            { begin: /^\-\-\- +\d+,\d+ +\-\-\-\-$/ }
          ]
        },
        {
          className: "comment",
          variants: [
            { begin: /Index: /, end: /$/ },
            { begin: /={3,}/, end: /$/ },
            { begin: /^\-{3}/, end: /$/ },
            { begin: /^\*{3} /, end: /$/ },
            { begin: /^\+{3}/, end: /$/ },
            { begin: /\*{5}/, end: /\*{5}$/ }
          ]
        },
        {
          className: "addition",
          begin: "^\\+",
          end: "$"
        },
        {
          className: "deletion",
          begin: "^\\-",
          end: "$"
        },
        {
          className: "addition",
          begin: "^\\!",
          end: "$"
        }
      ]
    };
  });

  hljs.registerLanguage("dockerfile", function(hljs) {
    return {
      aliases: ["docker"],
      case_insensitive: true,
      keywords: "from maintainer expose env arg user onbuild stopsignal",
      contains: [
        hljs.HASH_COMMENT_MODE,
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        hljs.NUMBER_MODE,
        {
          beginKeywords:
            "run cmd entrypoint volume add copy workdir label healthcheck shell",
          starts: {
            end: /[^\\]$/,
            subLanguage: "bash"
          }
        }
      ],
      illegal: "</"
    };
  });

  hljs.registerLanguage("glsl", function(hljs) {
    return {
      keywords: {
        keyword:
          // Statements
          "break continue discard do else for if return while switch case default " +
          // Qualifiers
          "attribute binding buffer ccw centroid centroid varying coherent column_major const cw " +
          "depth_any depth_greater depth_less depth_unchanged early_fragment_tests equal_spacing " +
          "flat fractional_even_spacing fractional_odd_spacing highp in index inout invariant " +
          "invocations isolines layout line_strip lines lines_adjacency local_size_x local_size_y " +
          "local_size_z location lowp max_vertices mediump noperspective offset origin_upper_left " +
          "out packed patch pixel_center_integer point_mode points precise precision quads r11f_g11f_b10f " +
          "r16 r16_snorm r16f r16i r16ui r32f r32i r32ui r8 r8_snorm r8i r8ui readonly restrict " +
          "rg16 rg16_snorm rg16f rg16i rg16ui rg32f rg32i rg32ui rg8 rg8_snorm rg8i rg8ui rgb10_a2 " +
          "rgb10_a2ui rgba16 rgba16_snorm rgba16f rgba16i rgba16ui rgba32f rgba32i rgba32ui rgba8 " +
          "rgba8_snorm rgba8i rgba8ui row_major sample shared smooth std140 std430 stream triangle_strip " +
          "triangles triangles_adjacency uniform varying vertices volatile writeonly",
        type:
          "atomic_uint bool bvec2 bvec3 bvec4 dmat2 dmat2x2 dmat2x3 dmat2x4 dmat3 dmat3x2 dmat3x3 " +
          "dmat3x4 dmat4 dmat4x2 dmat4x3 dmat4x4 double dvec2 dvec3 dvec4 float iimage1D iimage1DArray " +
          "iimage2D iimage2DArray iimage2DMS iimage2DMSArray iimage2DRect iimage3D iimageBuffer" +
          "iimageCube iimageCubeArray image1D image1DArray image2D image2DArray image2DMS image2DMSArray " +
          "image2DRect image3D imageBuffer imageCube imageCubeArray int isampler1D isampler1DArray " +
          "isampler2D isampler2DArray isampler2DMS isampler2DMSArray isampler2DRect isampler3D " +
          "isamplerBuffer isamplerCube isamplerCubeArray ivec2 ivec3 ivec4 mat2 mat2x2 mat2x3 " +
          "mat2x4 mat3 mat3x2 mat3x3 mat3x4 mat4 mat4x2 mat4x3 mat4x4 sampler1D sampler1DArray " +
          "sampler1DArrayShadow sampler1DShadow sampler2D sampler2DArray sampler2DArrayShadow " +
          "sampler2DMS sampler2DMSArray sampler2DRect sampler2DRectShadow sampler2DShadow sampler3D " +
          "samplerBuffer samplerCube samplerCubeArray samplerCubeArrayShadow samplerCubeShadow " +
          "image1D uimage1DArray uimage2D uimage2DArray uimage2DMS uimage2DMSArray uimage2DRect " +
          "uimage3D uimageBuffer uimageCube uimageCubeArray uint usampler1D usampler1DArray " +
          "usampler2D usampler2DArray usampler2DMS usampler2DMSArray usampler2DRect usampler3D " +
          "samplerBuffer usamplerCube usamplerCubeArray uvec2 uvec3 uvec4 vec2 vec3 vec4 void",
        built_in:
          // Constants
          "gl_MaxAtomicCounterBindings gl_MaxAtomicCounterBufferSize gl_MaxClipDistances gl_MaxClipPlanes " +
          "gl_MaxCombinedAtomicCounterBuffers gl_MaxCombinedAtomicCounters gl_MaxCombinedImageUniforms " +
          "gl_MaxCombinedImageUnitsAndFragmentOutputs gl_MaxCombinedTextureImageUnits gl_MaxComputeAtomicCounterBuffers " +
          "gl_MaxComputeAtomicCounters gl_MaxComputeImageUniforms gl_MaxComputeTextureImageUnits " +
          "gl_MaxComputeUniformComponents gl_MaxComputeWorkGroupCount gl_MaxComputeWorkGroupSize " +
          "gl_MaxDrawBuffers gl_MaxFragmentAtomicCounterBuffers gl_MaxFragmentAtomicCounters " +
          "gl_MaxFragmentImageUniforms gl_MaxFragmentInputComponents gl_MaxFragmentInputVectors " +
          "gl_MaxFragmentUniformComponents gl_MaxFragmentUniformVectors gl_MaxGeometryAtomicCounterBuffers " +
          "gl_MaxGeometryAtomicCounters gl_MaxGeometryImageUniforms gl_MaxGeometryInputComponents " +
          "gl_MaxGeometryOutputComponents gl_MaxGeometryOutputVertices gl_MaxGeometryTextureImageUnits " +
          "gl_MaxGeometryTotalOutputComponents gl_MaxGeometryUniformComponents gl_MaxGeometryVaryingComponents " +
          "gl_MaxImageSamples gl_MaxImageUnits gl_MaxLights gl_MaxPatchVertices gl_MaxProgramTexelOffset " +
          "gl_MaxTessControlAtomicCounterBuffers gl_MaxTessControlAtomicCounters gl_MaxTessControlImageUniforms " +
          "gl_MaxTessControlInputComponents gl_MaxTessControlOutputComponents gl_MaxTessControlTextureImageUnits " +
          "gl_MaxTessControlTotalOutputComponents gl_MaxTessControlUniformComponents " +
          "gl_MaxTessEvaluationAtomicCounterBuffers gl_MaxTessEvaluationAtomicCounters " +
          "gl_MaxTessEvaluationImageUniforms gl_MaxTessEvaluationInputComponents gl_MaxTessEvaluationOutputComponents " +
          "gl_MaxTessEvaluationTextureImageUnits gl_MaxTessEvaluationUniformComponents " +
          "gl_MaxTessGenLevel gl_MaxTessPatchComponents gl_MaxTextureCoords gl_MaxTextureImageUnits " +
          "gl_MaxTextureUnits gl_MaxVaryingComponents gl_MaxVaryingFloats gl_MaxVaryingVectors " +
          "gl_MaxVertexAtomicCounterBuffers gl_MaxVertexAtomicCounters gl_MaxVertexAttribs gl_MaxVertexImageUniforms " +
          "gl_MaxVertexOutputComponents gl_MaxVertexOutputVectors gl_MaxVertexTextureImageUnits " +
          "gl_MaxVertexUniformComponents gl_MaxVertexUniformVectors gl_MaxViewports gl_MinProgramTexelOffset " +
          // Variables
          "gl_BackColor gl_BackLightModelProduct gl_BackLightProduct gl_BackMaterial " +
          "gl_BackSecondaryColor gl_ClipDistance gl_ClipPlane gl_ClipVertex gl_Color " +
          "gl_DepthRange gl_EyePlaneQ gl_EyePlaneR gl_EyePlaneS gl_EyePlaneT gl_Fog gl_FogCoord " +
          "gl_FogFragCoord gl_FragColor gl_FragCoord gl_FragData gl_FragDepth gl_FrontColor " +
          "gl_FrontFacing gl_FrontLightModelProduct gl_FrontLightProduct gl_FrontMaterial " +
          "gl_FrontSecondaryColor gl_GlobalInvocationID gl_InstanceID gl_InvocationID gl_Layer gl_LightModel " +
          "gl_LightSource gl_LocalInvocationID gl_LocalInvocationIndex gl_ModelViewMatrix " +
          "gl_ModelViewMatrixInverse gl_ModelViewMatrixInverseTranspose gl_ModelViewMatrixTranspose " +
          "gl_ModelViewProjectionMatrix gl_ModelViewProjectionMatrixInverse gl_ModelViewProjectionMatrixInverseTranspose " +
          "gl_ModelViewProjectionMatrixTranspose gl_MultiTexCoord0 gl_MultiTexCoord1 gl_MultiTexCoord2 " +
          "gl_MultiTexCoord3 gl_MultiTexCoord4 gl_MultiTexCoord5 gl_MultiTexCoord6 gl_MultiTexCoord7 " +
          "gl_Normal gl_NormalMatrix gl_NormalScale gl_NumSamples gl_NumWorkGroups gl_ObjectPlaneQ " +
          "gl_ObjectPlaneR gl_ObjectPlaneS gl_ObjectPlaneT gl_PatchVerticesIn gl_Point gl_PointCoord " +
          "gl_PointSize gl_Position gl_PrimitiveID gl_PrimitiveIDIn gl_ProjectionMatrix gl_ProjectionMatrixInverse " +
          "gl_ProjectionMatrixInverseTranspose gl_ProjectionMatrixTranspose gl_SampleID gl_SampleMask " +
          "gl_SampleMaskIn gl_SamplePosition gl_SecondaryColor gl_TessCoord gl_TessLevelInner gl_TessLevelOuter " +
          "gl_TexCoord gl_TextureEnvColor gl_TextureMatrix gl_TextureMatrixInverse gl_TextureMatrixInverseTranspose " +
          "gl_TextureMatrixTranspose gl_Vertex gl_VertexID gl_ViewportIndex gl_WorkGroupID gl_WorkGroupSize gl_in gl_out " +
          // Functions
          "EmitStreamVertex EmitVertex EndPrimitive EndStreamPrimitive abs acos acosh all any asin " +
          "asinh atan atanh atomicAdd atomicAnd atomicCompSwap atomicCounter atomicCounterDecrement " +
          "atomicCounterIncrement atomicExchange atomicMax atomicMin atomicOr atomicXor barrier " +
          "bitCount bitfieldExtract bitfieldInsert bitfieldReverse ceil clamp cos cosh cross " +
          "dFdx dFdy degrees determinant distance dot equal exp exp2 faceforward findLSB findMSB " +
          "floatBitsToInt floatBitsToUint floor fma fract frexp ftransform fwidth greaterThan " +
          "greaterThanEqual groupMemoryBarrier imageAtomicAdd imageAtomicAnd imageAtomicCompSwap " +
          "imageAtomicExchange imageAtomicMax imageAtomicMin imageAtomicOr imageAtomicXor imageLoad " +
          "imageSize imageStore imulExtended intBitsToFloat interpolateAtCentroid interpolateAtOffset " +
          "interpolateAtSample inverse inversesqrt isinf isnan ldexp length lessThan lessThanEqual log " +
          "log2 matrixCompMult max memoryBarrier memoryBarrierAtomicCounter memoryBarrierBuffer " +
          "memoryBarrierImage memoryBarrierShared min mix mod modf noise1 noise2 noise3 noise4 " +
          "normalize not notEqual outerProduct packDouble2x32 packHalf2x16 packSnorm2x16 packSnorm4x8 " +
          "packUnorm2x16 packUnorm4x8 pow radians reflect refract round roundEven shadow1D shadow1DLod " +
          "shadow1DProj shadow1DProjLod shadow2D shadow2DLod shadow2DProj shadow2DProjLod sign sin sinh " +
          "smoothstep sqrt step tan tanh texelFetch texelFetchOffset texture texture1D texture1DLod " +
          "texture1DProj texture1DProjLod texture2D texture2DLod texture2DProj texture2DProjLod " +
          "texture3D texture3DLod texture3DProj texture3DProjLod textureCube textureCubeLod " +
          "textureGather textureGatherOffset textureGatherOffsets textureGrad textureGradOffset " +
          "textureLod textureLodOffset textureOffset textureProj textureProjGrad textureProjGradOffset " +
          "textureProjLod textureProjLodOffset textureProjOffset textureQueryLevels textureQueryLod " +
          "textureSize transpose trunc uaddCarry uintBitsToFloat umulExtended unpackDouble2x32 " +
          "unpackHalf2x16 unpackSnorm2x16 unpackSnorm4x8 unpackUnorm2x16 unpackUnorm4x8 usubBorrow",
        literal: "true false"
      },
      illegal: '"',
      contains: [
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        hljs.C_NUMBER_MODE,
        {
          className: "meta",
          begin: "#",
          end: "$"
        }
      ]
    };
  });

  hljs.registerLanguage("go", function(hljs) {
    var GO_KEYWORDS = {
      keyword:
        "break default func interface select case map struct chan else goto package switch " +
        "const fallthrough if range type continue for import return var go defer " +
        "bool byte complex64 complex128 float32 float64 int8 int16 int32 int64 string uint8 " +
        "uint16 uint32 uint64 int uint uintptr rune",
      literal: "true false iota nil",
      built_in:
        "append cap close complex copy imag len make new panic print println real recover delete"
    };
    return {
      aliases: ["golang"],
      keywords: GO_KEYWORDS,
      illegal: "</",
      contains: [
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        {
          className: "string",
          variants: [
            hljs.QUOTE_STRING_MODE,
            { begin: "'", end: "[^\\\\]'" },
            { begin: "`", end: "`" }
          ]
        },
        {
          className: "number",
          variants: [
            { begin: hljs.C_NUMBER_RE + "[dflsi]", relevance: 1 },
            hljs.C_NUMBER_MODE
          ]
        },
        {
          begin: /:=/ // relevance booster
        },
        {
          className: "function",
          beginKeywords: "func",
          end: /\s*\{/,
          excludeEnd: true,
          contains: [
            hljs.TITLE_MODE,
            {
              className: "params",
              begin: /\(/,
              end: /\)/,
              keywords: GO_KEYWORDS,
              illegal: /["']/
            }
          ]
        }
      ]
    };
  });

  hljs.registerLanguage("haskell", function(hljs) {
    var COMMENT = {
      variants: [
        hljs.COMMENT("--", "$"),
        hljs.COMMENT("{-", "-}", {
          contains: ["self"]
        })
      ]
    };

    var PRAGMA = {
      className: "meta",
      begin: "{-#",
      end: "#-}"
    };

    var PREPROCESSOR = {
      className: "meta",
      begin: "^#",
      end: "$"
    };

    var CONSTRUCTOR = {
      className: "type",
      begin: "\\b[A-Z][\\w']*", // TODO: other constructors (build-in, infix).
      relevance: 0
    };

    var LIST = {
      begin: "\\(",
      end: "\\)",
      illegal: '"',
      contains: [
        PRAGMA,
        PREPROCESSOR,
        { className: "type", begin: "\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?" },
        hljs.inherit(hljs.TITLE_MODE, { begin: "[_a-z][\\w']*" }),
        COMMENT
      ]
    };

    var RECORD = {
      begin: "{",
      end: "}",
      contains: LIST.contains
    };

    return {
      aliases: ["hs"],
      keywords:
        "let in if then else case of where do module import hiding " +
        "qualified type data newtype deriving class instance as default " +
        "infix infixl infixr foreign export ccall stdcall cplusplus " +
        "jvm dotnet safe unsafe family forall mdo proc rec",
      contains: [
        // Top-level constructions.

        {
          beginKeywords: "module",
          end: "where",
          keywords: "module where",
          contains: [LIST, COMMENT],
          illegal: "\\W\\.|;"
        },
        {
          begin: "\\bimport\\b",
          end: "$",
          keywords: "import qualified as hiding",
          contains: [LIST, COMMENT],
          illegal: "\\W\\.|;"
        },

        {
          className: "class",
          begin: "^(\\s*)?(class|instance)\\b",
          end: "where",
          keywords: "class family instance where",
          contains: [CONSTRUCTOR, LIST, COMMENT]
        },
        {
          className: "class",
          begin: "\\b(data|(new)?type)\\b",
          end: "$",
          keywords: "data family type newtype deriving",
          contains: [PRAGMA, CONSTRUCTOR, LIST, RECORD, COMMENT]
        },
        {
          beginKeywords: "default",
          end: "$",
          contains: [CONSTRUCTOR, LIST, COMMENT]
        },
        {
          beginKeywords: "infix infixl infixr",
          end: "$",
          contains: [hljs.C_NUMBER_MODE, COMMENT]
        },
        {
          begin: "\\bforeign\\b",
          end: "$",
          keywords:
            "foreign import export ccall stdcall cplusplus jvm " +
            "dotnet safe unsafe",
          contains: [CONSTRUCTOR, hljs.QUOTE_STRING_MODE, COMMENT]
        },
        {
          className: "meta",
          begin: "#!\\/usr\\/bin\\/env runhaskell",
          end: "$"
        },

        // "Whitespaces".

        PRAGMA,
        PREPROCESSOR,

        // Literals and names.

        // TODO: characters.
        hljs.QUOTE_STRING_MODE,
        hljs.C_NUMBER_MODE,
        CONSTRUCTOR,
        hljs.inherit(hljs.TITLE_MODE, { begin: "^[_a-z][\\w']*" }),

        COMMENT,

        { begin: "->|<-" } // No markup, relevance booster
      ]
    };
  });

  hljs.registerLanguage("http", function(hljs) {
    var VERSION = "HTTP/[0-9\\.]+";
    return {
      aliases: ["https"],
      illegal: "\\S",
      contains: [
        {
          begin: "^" + VERSION,
          end: "$",
          contains: [{ className: "number", begin: "\\b\\d{3}\\b" }]
        },
        {
          begin: "^[A-Z]+ (.*?) " + VERSION + "$",
          returnBegin: true,
          end: "$",
          contains: [
            {
              className: "string",
              begin: " ",
              end: " ",
              excludeBegin: true,
              excludeEnd: true
            },
            {
              begin: VERSION
            },
            {
              className: "keyword",
              begin: "[A-Z]+"
            }
          ]
        },
        {
          className: "attribute",
          begin: "^\\w",
          end: ": ",
          excludeEnd: true,
          illegal: "\\n|\\s|=",
          starts: { end: "$", relevance: 0 }
        },
        {
          begin: "\\n\\n",
          starts: { subLanguage: [], endsWithParent: true }
        }
      ]
    };
  });

  hljs.registerLanguage("java", function(hljs) {
    var JAVA_IDENT_RE = "[\u00C0-\u02B8a-zA-Z_$][\u00C0-\u02B8a-zA-Z_$0-9]*";
    var GENERIC_IDENT_RE =
      JAVA_IDENT_RE +
      "(<" +
      JAVA_IDENT_RE +
      "(\\s*,\\s*" +
      JAVA_IDENT_RE +
      ")*>)?";
    var KEYWORDS =
      "false synchronized int abstract float private char boolean var static null if const " +
      "for true while long strictfp finally protected import native final void " +
      "enum else break transient catch instanceof byte super volatile case assert short " +
      "package default double public try this switch continue throws protected public private " +
      "module requires exports do";

    // https://docs.oracle.com/javase/7/docs/technotes/guides/language/underscores-literals.html
    var JAVA_NUMBER_RE =
      "\\b" +
      "(" +
      "0[bB]([01]+[01_]+[01]+|[01]+)" + // 0b...
      "|" +
      "0[xX]([a-fA-F0-9]+[a-fA-F0-9_]+[a-fA-F0-9]+|[a-fA-F0-9]+)" + // 0x...
      "|" +
      "(" +
      "([\\d]+[\\d_]+[\\d]+|[\\d]+)(\\.([\\d]+[\\d_]+[\\d]+|[\\d]+))?" +
      "|" +
      "\\.([\\d]+[\\d_]+[\\d]+|[\\d]+)" +
      ")" +
      "([eE][-+]?\\d+)?" + // octal, decimal, float
      ")" +
      "[lLfF]?";
    var JAVA_NUMBER_MODE = {
      className: "number",
      begin: JAVA_NUMBER_RE,
      relevance: 0
    };

    return {
      aliases: ["jsp"],
      keywords: KEYWORDS,
      illegal: /<\/|#/,
      contains: [
        hljs.COMMENT("/\\*\\*", "\\*/", {
          relevance: 0,
          contains: [
            {
              // eat up @'s in emails to prevent them to be recognized as doctags
              begin: /\w+@/,
              relevance: 0
            },
            {
              className: "doctag",
              begin: "@[A-Za-z]+"
            }
          ]
        }),
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        {
          className: "class",
          beginKeywords: "class interface",
          end: /[{;=]/,
          excludeEnd: true,
          keywords: "class interface",
          illegal: /[:"\[\]]/,
          contains: [
            { beginKeywords: "extends implements" },
            hljs.UNDERSCORE_TITLE_MODE
          ]
        },
        {
          // Expression keywords prevent 'keyword Name(...)' from being
          // recognized as a function definition
          beginKeywords: "new throw return else",
          relevance: 0
        },
        {
          className: "function",
          begin:
            "(" +
            GENERIC_IDENT_RE +
            "\\s+)+" +
            hljs.UNDERSCORE_IDENT_RE +
            "\\s*\\(",
          returnBegin: true,
          end: /[{;=]/,
          excludeEnd: true,
          keywords: KEYWORDS,
          contains: [
            {
              begin: hljs.UNDERSCORE_IDENT_RE + "\\s*\\(",
              returnBegin: true,
              relevance: 0,
              contains: [hljs.UNDERSCORE_TITLE_MODE]
            },
            {
              className: "params",
              begin: /\(/,
              end: /\)/,
              keywords: KEYWORDS,
              relevance: 0,
              contains: [
                hljs.APOS_STRING_MODE,
                hljs.QUOTE_STRING_MODE,
                hljs.C_NUMBER_MODE,
                hljs.C_BLOCK_COMMENT_MODE
              ]
            },
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE
          ]
        },
        JAVA_NUMBER_MODE,
        {
          className: "meta",
          begin: "@[A-Za-z]+"
        }
      ]
    };
  });

  hljs.registerLanguage("javascript", function(hljs) {
    var IDENT_RE = "[A-Za-z$_][0-9A-Za-z$_]*";
    var KEYWORDS = {
      keyword:
        "in of if for while finally var new function do return void else break catch " +
        "instanceof with throw case default try this switch continue typeof delete " +
        "let yield const export super debugger as async await static " +
        // ECMAScript 6 modules import
        "import from as",
      literal: "true false null undefined NaN Infinity",
      built_in:
        "eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent " +
        "encodeURI encodeURIComponent escape unescape Object Function Boolean Error " +
        "EvalError InternalError RangeError ReferenceError StopIteration SyntaxError " +
        "TypeError URIError Number Math Date String RegExp Array Float32Array " +
        "Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array " +
        "Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require " +
        "module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect " +
        "Promise"
    };
    var NUMBER = {
      className: "number",
      variants: [
        { begin: "\\b(0[bB][01]+)" },
        { begin: "\\b(0[oO][0-7]+)" },
        { begin: hljs.C_NUMBER_RE }
      ],
      relevance: 0
    };
    var SUBST = {
      className: "subst",
      begin: "\\$\\{",
      end: "\\}",
      keywords: KEYWORDS,
      contains: [] // defined later
    };
    var TEMPLATE_STRING = {
      className: "string",
      begin: "`",
      end: "`",
      contains: [hljs.BACKSLASH_ESCAPE, SUBST]
    };
    SUBST.contains = [
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      TEMPLATE_STRING,
      NUMBER,
      hljs.REGEXP_MODE
    ];
    var PARAMS_CONTAINS = SUBST.contains.concat([
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_LINE_COMMENT_MODE
    ]);

    return {
      aliases: ["js", "jsx"],
      keywords: KEYWORDS,
      contains: [
        {
          className: "meta",
          relevance: 10,
          begin: /^\s*['"]use (strict|asm)['"]/
        },
        {
          className: "meta",
          begin: /^#!/,
          end: /$/
        },
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        TEMPLATE_STRING,
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        NUMBER,
        {
          // object attr container
          begin: /[{,]\s*/,
          relevance: 0,
          contains: [
            {
              begin: IDENT_RE + "\\s*:",
              returnBegin: true,
              relevance: 0,
              contains: [{ className: "attr", begin: IDENT_RE, relevance: 0 }]
            }
          ]
        },
        {
          // "value" container
          begin: "(" + hljs.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
          keywords: "return throw case",
          contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            hljs.REGEXP_MODE,
            {
              className: "function",
              begin: "(\\(.*?\\)|" + IDENT_RE + ")\\s*=>",
              returnBegin: true,
              end: "\\s*=>",
              contains: [
                {
                  className: "params",
                  variants: [
                    {
                      begin: IDENT_RE
                    },
                    {
                      begin: /\(\s*\)/
                    },
                    {
                      begin: /\(/,
                      end: /\)/,
                      excludeBegin: true,
                      excludeEnd: true,
                      keywords: KEYWORDS,
                      contains: PARAMS_CONTAINS
                    }
                  ]
                }
              ]
            },
            {
              // E4X / JSX
              begin: /</,
              end: /(\/\w+|\w+\/)>/,
              subLanguage: "xml",
              contains: [
                { begin: /<\w+\s*\/>/, skip: true },
                {
                  begin: /<\w+/,
                  end: /(\/\w+|\w+\/)>/,
                  skip: true,
                  contains: [{ begin: /<\w+\s*\/>/, skip: true }, "self"]
                }
              ]
            }
          ],
          relevance: 0
        },
        {
          className: "function",
          beginKeywords: "function",
          end: /\{/,
          excludeEnd: true,
          contains: [
            hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE }),
            {
              className: "params",
              begin: /\(/,
              end: /\)/,
              excludeBegin: true,
              excludeEnd: true,
              contains: PARAMS_CONTAINS
            }
          ],
          illegal: /\[|%/
        },
        {
          begin: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
        },
        hljs.METHOD_GUARD,
        {
          // ES6 class
          className: "class",
          beginKeywords: "class",
          end: /[{;=]/,
          excludeEnd: true,
          illegal: /[:"\[\]]/,
          contains: [{ beginKeywords: "extends" }, hljs.UNDERSCORE_TITLE_MODE]
        },
        {
          beginKeywords: "constructor",
          end: /\{/,
          excludeEnd: true
        }
      ],
      illegal: /#(?!!)/
    };
  });

  hljs.registerLanguage("json", function(hljs) {
    var LITERALS = { literal: "true false null" };
    var TYPES = [hljs.QUOTE_STRING_MODE, hljs.C_NUMBER_MODE];
    var VALUE_CONTAINER = {
      end: ",",
      endsWithParent: true,
      excludeEnd: true,
      contains: TYPES,
      keywords: LITERALS
    };
    var OBJECT = {
      begin: "{",
      end: "}",
      contains: [
        {
          className: "attr",
          begin: /"/,
          end: /"/,
          contains: [hljs.BACKSLASH_ESCAPE],
          illegal: "\\n"
        },
        hljs.inherit(VALUE_CONTAINER, { begin: /:/ })
      ],
      illegal: "\\S"
    };
    var ARRAY = {
      begin: "\\[",
      end: "\\]",
      contains: [hljs.inherit(VALUE_CONTAINER)], // inherit is a workaround for a bug that makes shared modes with endsWithParent compile only the ending of one of the parents
      illegal: "\\S"
    };
    TYPES.splice(TYPES.length, 0, OBJECT, ARRAY);
    return {
      contains: TYPES,
      keywords: LITERALS,
      illegal: "\\S"
    };
  });

  hljs.registerLanguage("julia", function(hljs) {
    // Since there are numerous special names in Julia, it is too much trouble
    // to maintain them by hand. Hence these names (i.e. keywords, literals and
    // built-ins) are automatically generated from Julia v0.6 itself through
    // the following scripts for each.

    var KEYWORDS = {
      // # keyword generator, multi-word keywords handled manually below
      // foreach(println, ["in", "isa", "where"])
      // for kw in Base.REPLCompletions.complete_keyword("")
      //     if !(contains(kw, " ") || kw == "struct")
      //         println(kw)
      //     end
      // end
      keyword:
        "in isa where " +
        "baremodule begin break catch ccall const continue do else elseif end export false finally for function " +
        "global if import importall let local macro module quote return true try using while " +
        // legacy, to be deprecated in the next release
        "type immutable abstract bitstype typealias ",

      // # literal generator
      // println("true")
      // println("false")
      // for name in Base.REPLCompletions.completions("", 0)[1]
      //     try
      //         v = eval(Symbol(name))
      //         if !(v isa Function || v isa Type || v isa TypeVar || v isa Module || v isa Colon)
      //             println(name)
      //         end
      //     end
      // end
      literal:
        "true false " +
        "ARGS C_NULL DevNull ENDIAN_BOM ENV I Inf Inf16 Inf32 Inf64 InsertionSort JULIA_HOME LOAD_PATH MergeSort " +
        "NaN NaN16 NaN32 NaN64 PROGRAM_FILE QuickSort RoundDown RoundFromZero RoundNearest RoundNearestTiesAway " +
        "RoundNearestTiesUp RoundToZero RoundUp STDERR STDIN STDOUT VERSION catalan e|0 eu|0 eulergamma golden im " +
        "nothing pi γ π φ ",

      // # built_in generator:
      // for name in Base.REPLCompletions.completions("", 0)[1]
      //     try
      //         v = eval(Symbol(name))
      //         if v isa Type || v isa TypeVar
      //             println(name)
      //         end
      //     end
      // end
      built_in:
        "ANY AbstractArray AbstractChannel AbstractFloat AbstractMatrix AbstractRNG AbstractSerializer AbstractSet " +
        "AbstractSparseArray AbstractSparseMatrix AbstractSparseVector AbstractString AbstractUnitRange AbstractVecOrMat " +
        "AbstractVector Any ArgumentError Array AssertionError Associative Base64DecodePipe Base64EncodePipe Bidiagonal " +
        "BigFloat BigInt BitArray BitMatrix BitVector Bool BoundsError BufferStream CachingPool CapturedException " +
        "CartesianIndex CartesianRange Cchar Cdouble Cfloat Channel Char Cint Cintmax_t Clong Clonglong ClusterManager " +
        "Cmd CodeInfo Colon Complex Complex128 Complex32 Complex64 CompositeException Condition ConjArray ConjMatrix " +
        "ConjVector Cptrdiff_t Cshort Csize_t Cssize_t Cstring Cuchar Cuint Cuintmax_t Culong Culonglong Cushort Cwchar_t " +
        "Cwstring DataType Date DateFormat DateTime DenseArray DenseMatrix DenseVecOrMat DenseVector Diagonal Dict " +
        "DimensionMismatch Dims DirectIndexString Display DivideError DomainError EOFError EachLine Enum Enumerate " +
        "ErrorException Exception ExponentialBackOff Expr Factorization FileMonitor Float16 Float32 Float64 Function " +
        "Future GlobalRef GotoNode HTML Hermitian IO IOBuffer IOContext IOStream IPAddr IPv4 IPv6 IndexCartesian IndexLinear " +
        "IndexStyle InexactError InitError Int Int128 Int16 Int32 Int64 Int8 IntSet Integer InterruptException " +
        "InvalidStateException Irrational KeyError LabelNode LinSpace LineNumberNode LoadError LowerTriangular MIME Matrix " +
        "MersenneTwister Method MethodError MethodTable Module NTuple NewvarNode NullException Nullable Number ObjectIdDict " +
        "OrdinalRange OutOfMemoryError OverflowError Pair ParseError PartialQuickSort PermutedDimsArray Pipe " +
        "PollingFileWatcher ProcessExitedException Ptr QuoteNode RandomDevice Range RangeIndex Rational RawFD " +
        "ReadOnlyMemoryError Real ReentrantLock Ref Regex RegexMatch RemoteChannel RemoteException RevString RoundingMode " +
        "RowVector SSAValue SegmentationFault SerializationState Set SharedArray SharedMatrix SharedVector Signed " +
        "SimpleVector Slot SlotNumber SparseMatrixCSC SparseVector StackFrame StackOverflowError StackTrace StepRange " +
        "StepRangeLen StridedArray StridedMatrix StridedVecOrMat StridedVector String SubArray SubString SymTridiagonal " +
        "Symbol Symmetric SystemError TCPSocket Task Text TextDisplay Timer Tridiagonal Tuple Type TypeError TypeMapEntry " +
        "TypeMapLevel TypeName TypeVar TypedSlot UDPSocket UInt UInt128 UInt16 UInt32 UInt64 UInt8 UndefRefError UndefVarError " +
        "UnicodeError UniformScaling Union UnionAll UnitRange Unsigned UpperTriangular Val Vararg VecElement VecOrMat Vector " +
        "VersionNumber Void WeakKeyDict WeakRef WorkerConfig WorkerPool "
    };

    // ref: http://julia.readthedocs.org/en/latest/manual/variables/#allowed-variable-names
    var VARIABLE_NAME_RE =
      "[A-Za-z_\\u00A1-\\uFFFF][A-Za-z_0-9\\u00A1-\\uFFFF]*";

    // placeholder for recursive self-reference
    var DEFAULT = {
      lexemes: VARIABLE_NAME_RE,
      keywords: KEYWORDS,
      illegal: /<\//
    };

    // ref: http://julia.readthedocs.org/en/latest/manual/integers-and-floating-point-numbers/
    var NUMBER = {
      className: "number",
      // supported numeric literals:
      //  * binary literal (e.g. 0x10)
      //  * octal literal (e.g. 0o76543210)
      //  * hexadecimal literal (e.g. 0xfedcba876543210)
      //  * hexadecimal floating point literal (e.g. 0x1p0, 0x1.2p2)
      //  * decimal literal (e.g. 9876543210, 100_000_000)
      //  * floating pointe literal (e.g. 1.2, 1.2f, .2, 1., 1.2e10, 1.2e-10)
      begin: /(\b0x[\d_]*(\.[\d_]*)?|0x\.\d[\d_]*)p[-+]?\d+|\b0[box][a-fA-F0-9][a-fA-F0-9_]*|(\b\d[\d_]*(\.[\d_]*)?|\.\d[\d_]*)([eEfF][-+]?\d+)?/,
      relevance: 0
    };

    var CHAR = {
      className: "string",
      begin: /'(.|\\[xXuU][a-zA-Z0-9]+)'/
    };

    var INTERPOLATION = {
      className: "subst",
      begin: /\$\(/,
      end: /\)/,
      keywords: KEYWORDS
    };

    var INTERPOLATED_VARIABLE = {
      className: "variable",
      begin: "\\$" + VARIABLE_NAME_RE
    };

    // TODO: neatly escape normal code in string literal
    var STRING = {
      className: "string",
      contains: [hljs.BACKSLASH_ESCAPE, INTERPOLATION, INTERPOLATED_VARIABLE],
      variants: [
        { begin: /\w*"""/, end: /"""\w*/, relevance: 10 },
        { begin: /\w*"/, end: /"\w*/ }
      ]
    };

    var COMMAND = {
      className: "string",
      contains: [hljs.BACKSLASH_ESCAPE, INTERPOLATION, INTERPOLATED_VARIABLE],
      begin: "`",
      end: "`"
    };

    var MACROCALL = {
      className: "meta",
      begin: "@" + VARIABLE_NAME_RE
    };

    var COMMENT = {
      className: "comment",
      variants: [
        { begin: "#=", end: "=#", relevance: 10 },
        { begin: "#", end: "$" }
      ]
    };

    DEFAULT.contains = [
      NUMBER,
      CHAR,
      STRING,
      COMMAND,
      MACROCALL,
      COMMENT,
      hljs.HASH_COMMENT_MODE,
      {
        className: "keyword",
        begin: "\\b(((abstract|primitive)\\s+)type|(mutable\\s+)?struct)\\b"
      },
      { begin: /<:/ } // relevance booster
    ];
    INTERPOLATION.contains = DEFAULT.contains;

    return DEFAULT;
  });

  hljs.registerLanguage("llvm", function(hljs) {
    var identifier = "([-a-zA-Z$._][\\w\\-$.]*)";
    return {
      //lexemes: '[.%]?' + hljs.IDENT_RE,
      keywords:
        "begin end true false declare define global " +
        "constant private linker_private internal " +
        "available_externally linkonce linkonce_odr weak " +
        "weak_odr appending dllimport dllexport common " +
        "default hidden protected extern_weak external " +
        "thread_local zeroinitializer undef null to tail " +
        "target triple datalayout volatile nuw nsw nnan " +
        "ninf nsz arcp fast exact inbounds align " +
        "addrspace section alias module asm sideeffect " +
        "gc dbg linker_private_weak attributes blockaddress " +
        "initialexec localdynamic localexec prefix unnamed_addr " +
        "ccc fastcc coldcc x86_stdcallcc x86_fastcallcc " +
        "arm_apcscc arm_aapcscc arm_aapcs_vfpcc ptx_device " +
        "ptx_kernel intel_ocl_bicc msp430_intrcc spir_func " +
        "spir_kernel x86_64_sysvcc x86_64_win64cc x86_thiscallcc " +
        "cc c signext zeroext inreg sret nounwind " +
        "noreturn noalias nocapture byval nest readnone " +
        "readonly inlinehint noinline alwaysinline optsize ssp " +
        "sspreq noredzone noimplicitfloat naked builtin cold " +
        "nobuiltin noduplicate nonlazybind optnone returns_twice " +
        "sanitize_address sanitize_memory sanitize_thread sspstrong " +
        "uwtable returned type opaque eq ne slt sgt " +
        "sle sge ult ugt ule uge oeq one olt ogt " +
        "ole oge ord uno ueq une x acq_rel acquire " +
        "alignstack atomic catch cleanup filter inteldialect " +
        "max min monotonic nand personality release seq_cst " +
        "singlethread umax umin unordered xchg add fadd " +
        "sub fsub mul fmul udiv sdiv fdiv urem srem " +
        "frem shl lshr ashr and or xor icmp fcmp " +
        "phi call trunc zext sext fptrunc fpext uitofp " +
        "sitofp fptoui fptosi inttoptr ptrtoint bitcast " +
        "addrspacecast select va_arg ret br switch invoke " +
        "unwind unreachable indirectbr landingpad resume " +
        "malloc alloca free load store getelementptr " +
        "extractelement insertelement shufflevector getresult " +
        "extractvalue insertvalue atomicrmw cmpxchg fence " +
        "argmemonly double",
      contains: [
        {
          className: "keyword",
          begin: "i\\d+"
        },
        hljs.COMMENT(";", "\\n", { relevance: 0 }),
        // Double quote string
        hljs.QUOTE_STRING_MODE,
        {
          className: "string",
          variants: [
            // Double-quoted string
            { begin: '"', end: '[^\\\\]"' }
          ],
          relevance: 0
        },
        {
          className: "title",
          variants: [
            { begin: "@" + identifier },
            { begin: "@\\d+" },
            { begin: "!" + identifier },
            { begin: "!\\d+" + identifier }
          ]
        },
        {
          className: "symbol",
          variants: [
            { begin: "%" + identifier },
            { begin: "%\\d+" },
            { begin: "#\\d+" }
          ]
        },
        {
          className: "number",
          variants: [
            { begin: "0[xX][a-fA-F0-9]+" },
            { begin: "-?\\d+(?:[.]\\d+)?(?:[eE][-+]?\\d+(?:[.]\\d+)?)?" }
          ],
          relevance: 0
        }
      ]
    };
  });

  hljs.registerLanguage("makefile", function(hljs) {
    /* Variables: simple (eg $(var)) and special (eg $@) */
    var VARIABLE = {
      className: "variable",
      variants: [
        {
          begin: "\\$\\(" + hljs.UNDERSCORE_IDENT_RE + "\\)",
          contains: [hljs.BACKSLASH_ESCAPE]
        },
        {
          begin: /\$[@%<?\^\+\*]/
        }
      ]
    };
    /* Quoted string with variables inside */
    var QUOTE_STRING = {
      className: "string",
      begin: /"/,
      end: /"/,
      contains: [hljs.BACKSLASH_ESCAPE, VARIABLE]
    };
    /* Function: $(func arg,...) */
    var FUNC = {
      className: "variable",
      begin: /\$\([\w-]+\s/,
      end: /\)/,
      keywords: {
        built_in:
          "subst patsubst strip findstring filter filter-out sort " +
          "word wordlist firstword lastword dir notdir suffix basename " +
          "addsuffix addprefix join wildcard realpath abspath error warning " +
          "shell origin flavor foreach if or and call eval file value"
      },
      contains: [VARIABLE]
    };
    /* Variable assignment */
    var VAR_ASSIG = {
      begin: "^" + hljs.UNDERSCORE_IDENT_RE + "\\s*[:+?]?=",
      illegal: "\\n",
      returnBegin: true,
      contains: [
        {
          begin: "^" + hljs.UNDERSCORE_IDENT_RE,
          end: "[:+?]?=",
          excludeEnd: true
        }
      ]
    };
    /* Meta targets (.PHONY) */
    var META = {
      className: "meta",
      begin: /^\.PHONY:/,
      end: /$/,
      keywords: { "meta-keyword": ".PHONY" },
      lexemes: /[\.\w]+/
    };
    /* Targets */
    var TARGET = {
      className: "section",
      begin: /^[^\s]+:/,
      end: /$/,
      contains: [VARIABLE]
    };
    return {
      aliases: ["mk", "mak"],
      keywords:
        "define endef undefine ifdef ifndef ifeq ifneq else endif " +
        "include -include sinclude override export unexport private vpath",
      lexemes: /[\w-]+/,
      contains: [
        hljs.HASH_COMMENT_MODE,
        VARIABLE,
        QUOTE_STRING,
        FUNC,
        VAR_ASSIG,
        META,
        TARGET
      ]
    };
  });

  hljs.registerLanguage("xml", function(hljs) {
    var XML_IDENT_RE = "[A-Za-z0-9\\._:-]+";
    var TAG_INTERNALS = {
      endsWithParent: true,
      illegal: /</,
      relevance: 0,
      contains: [
        {
          className: "attr",
          begin: XML_IDENT_RE,
          relevance: 0
        },
        {
          begin: /=\s*/,
          relevance: 0,
          contains: [
            {
              className: "string",
              endsParent: true,
              variants: [
                { begin: /"/, end: /"/ },
                { begin: /'/, end: /'/ },
                { begin: /[^\s"'=<>`]+/ }
              ]
            }
          ]
        }
      ]
    };
    return {
      aliases: ["html", "xhtml", "rss", "atom", "xjb", "xsd", "xsl", "plist"],
      case_insensitive: true,
      contains: [
        {
          className: "meta",
          begin: "<!DOCTYPE",
          end: ">",
          relevance: 10,
          contains: [{ begin: "\\[", end: "\\]" }]
        },
        hljs.COMMENT("<!--", "-->", {
          relevance: 10
        }),
        {
          begin: "<\\!\\[CDATA\\[",
          end: "\\]\\]>",
          relevance: 10
        },
        {
          className: "meta",
          begin: /<\?xml/,
          end: /\?>/,
          relevance: 10
        },
        {
          begin: /<\?(php)?/,
          end: /\?>/,
          subLanguage: "php",
          contains: [
            // We don't want the php closing tag ?> to close the PHP block when
            // inside any of the following blocks:
            { begin: "/\\*", end: "\\*/", skip: true },
            { begin: 'b"', end: '"', skip: true },
            { begin: "b'", end: "'", skip: true },
            hljs.inherit(hljs.APOS_STRING_MODE, {
              illegal: null,
              className: null,
              contains: null,
              skip: true
            }),
            hljs.inherit(hljs.QUOTE_STRING_MODE, {
              illegal: null,
              className: null,
              contains: null,
              skip: true
            })
          ]
        },
        {
          className: "tag",
          /*
        The lookahead pattern (?=...) ensures that 'begin' only matches
        '<style' as a single word, followed by a whitespace or an
        ending braket. The '$' is needed for the lexeme to be recognized
        by hljs.subMode() that tests lexemes outside the stream.
        */
          begin: "<style(?=\\s|>|$)",
          end: ">",
          keywords: { name: "style" },
          contains: [TAG_INTERNALS],
          starts: {
            end: "</style>",
            returnEnd: true,
            subLanguage: ["css", "xml"]
          }
        },
        {
          className: "tag",
          // See the comment in the <style tag about the lookahead pattern
          begin: "<script(?=\\s|>|$)",
          end: ">",
          keywords: { name: "script" },
          contains: [TAG_INTERNALS],
          starts: {
            end: "</script>",
            returnEnd: true,
            subLanguage: ["actionscript", "javascript", "handlebars", "xml"]
          }
        },
        {
          className: "tag",
          begin: "</?",
          end: "/?>",
          contains: [
            {
              className: "name",
              begin: /[^\/><\s]+/,
              relevance: 0
            },
            TAG_INTERNALS
          ]
        }
      ]
    };
  });

  hljs.registerLanguage("markdown", function(hljs) {
    return {
      aliases: ["md", "mkdown", "mkd"],
      contains: [
        // highlight headers
        {
          className: "section",
          variants: [
            { begin: "^#{1,6}", end: "$" },
            { begin: "^.+?\\n[=-]{2,}$" }
          ]
        },
        // inline html
        {
          begin: "<",
          end: ">",
          subLanguage: "xml",
          relevance: 0
        },
        // lists (indicators only)
        {
          className: "bullet",
          begin: "^([*+-]|(\\d+\\.))\\s+"
        },
        // strong segments
        {
          className: "strong",
          begin: "[*_]{2}.+?[*_]{2}"
        },
        // emphasis segments
        {
          className: "emphasis",
          variants: [{ begin: "\\*.+?\\*" }, { begin: "_.+?_", relevance: 0 }]
        },
        // blockquotes
        {
          className: "quote",
          begin: "^>\\s+",
          end: "$"
        },
        // code snippets
        {
          className: "code",
          variants: [
            {
              begin: "^```w*s*$",
              end: "^```s*$"
            },
            {
              begin: "`.+?`"
            },
            {
              begin: "^( {4}|\t)",
              end: "$",
              relevance: 0
            }
          ]
        },
        // horizontal rules
        {
          begin: "^[-\\*]{3,}",
          end: "$"
        },
        // using links - title and link
        {
          begin: "\\[.+?\\][\\(\\[].*?[\\)\\]]",
          returnBegin: true,
          contains: [
            {
              className: "string",
              begin: "\\[",
              end: "\\]",
              excludeBegin: true,
              returnEnd: true,
              relevance: 0
            },
            {
              className: "link",
              begin: "\\]\\(",
              end: "\\)",
              excludeBegin: true,
              excludeEnd: true
            },
            {
              className: "symbol",
              begin: "\\]\\[",
              end: "\\]",
              excludeBegin: true,
              excludeEnd: true
            }
          ],
          relevance: 10
        },
        {
          begin: /^\[[^\n]+\]:/,
          returnBegin: true,
          contains: [
            {
              className: "symbol",
              begin: /\[/,
              end: /\]/,
              excludeBegin: true,
              excludeEnd: true
            },
            {
              className: "link",
              begin: /:\s*/,
              end: /$/,
              excludeBegin: true
            }
          ]
        }
      ]
    };
  });

  hljs.registerLanguage("objectivec", function(hljs) {
    var API_CLASS = {
      className: "built_in",
      begin:
        "\\b(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)\\w+"
    };
    var OBJC_KEYWORDS = {
      keyword:
        "int float while char export sizeof typedef const struct for union " +
        "unsigned long volatile static bool mutable if do return goto void " +
        "enum else break extern asm case short default double register explicit " +
        "signed typename this switch continue wchar_t inline readonly assign " +
        "readwrite self @synchronized id typeof " +
        "nonatomic super unichar IBOutlet IBAction strong weak copy " +
        "in out inout bycopy byref oneway __strong __weak __block __autoreleasing " +
        "@private @protected @public @try @property @end @throw @catch @finally " +
        "@autoreleasepool @synthesize @dynamic @selector @optional @required " +
        "@encode @package @import @defs @compatibility_alias " +
        "__bridge __bridge_transfer __bridge_retained __bridge_retain " +
        "__covariant __contravariant __kindof " +
        "_Nonnull _Nullable _Null_unspecified " +
        "__FUNCTION__ __PRETTY_FUNCTION__ __attribute__ " +
        "getter setter retain unsafe_unretained " +
        "nonnull nullable null_unspecified null_resettable class instancetype " +
        "NS_DESIGNATED_INITIALIZER NS_UNAVAILABLE NS_REQUIRES_SUPER " +
        "NS_RETURNS_INNER_POINTER NS_INLINE NS_AVAILABLE NS_DEPRECATED " +
        "NS_ENUM NS_OPTIONS NS_SWIFT_UNAVAILABLE " +
        "NS_ASSUME_NONNULL_BEGIN NS_ASSUME_NONNULL_END " +
        "NS_REFINED_FOR_SWIFT NS_SWIFT_NAME NS_SWIFT_NOTHROW " +
        "NS_DURING NS_HANDLER NS_ENDHANDLER NS_VALUERETURN NS_VOIDRETURN",
      literal: "false true FALSE TRUE nil YES NO NULL",
      built_in:
        "BOOL dispatch_once_t dispatch_queue_t dispatch_sync dispatch_async dispatch_once"
    };
    var LEXEMES = /[a-zA-Z@][a-zA-Z0-9_]*/;
    var CLASS_KEYWORDS = "@interface @class @protocol @implementation";
    return {
      aliases: ["mm", "objc", "obj-c"],
      keywords: OBJC_KEYWORDS,
      lexemes: LEXEMES,
      illegal: "</",
      contains: [
        API_CLASS,
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        hljs.C_NUMBER_MODE,
        hljs.QUOTE_STRING_MODE,
        {
          className: "string",
          variants: [
            {
              begin: '@"',
              end: '"',
              illegal: "\\n",
              contains: [hljs.BACKSLASH_ESCAPE]
            },
            {
              begin: "'",
              end: "[^\\\\]'",
              illegal: "[^\\\\][^']"
            }
          ]
        },
        {
          className: "meta",
          begin: "#",
          end: "$",
          contains: [
            {
              className: "meta-string",
              variants: [
                { begin: '"', end: '"' },
                { begin: "<", end: ">" }
              ]
            }
          ]
        },
        {
          className: "class",
          begin: "(" + CLASS_KEYWORDS.split(" ").join("|") + ")\\b",
          end: "({|$)",
          excludeEnd: true,
          keywords: CLASS_KEYWORDS,
          lexemes: LEXEMES,
          contains: [hljs.UNDERSCORE_TITLE_MODE]
        },
        {
          begin: "\\." + hljs.UNDERSCORE_IDENT_RE,
          relevance: 0
        }
      ]
    };
  });

  hljs.registerLanguage("pgsql", function(hljs) {
    var COMMENT_MODE = hljs.COMMENT("--", "$");
    var UNQUOTED_IDENT = "[a-zA-Z_][a-zA-Z_0-9$]*";
    var DOLLAR_STRING = "\\$([a-zA-Z_]?|[a-zA-Z_][a-zA-Z_0-9]*)\\$";
    var LABEL = "<<\\s*" + UNQUOTED_IDENT + "\\s*>>";

    var SQL_KW =
      // https://www.postgresql.org/docs/11/static/sql-keywords-appendix.html
      // https://www.postgresql.org/docs/11/static/sql-commands.html
      // SQL commands (starting words)
      "ABORT ALTER ANALYZE BEGIN CALL CHECKPOINT|10 CLOSE CLUSTER COMMENT COMMIT COPY CREATE DEALLOCATE DECLARE " +
      "DELETE DISCARD DO DROP END EXECUTE EXPLAIN FETCH GRANT IMPORT INSERT LISTEN LOAD LOCK MOVE NOTIFY " +
      "PREPARE REASSIGN|10 REFRESH REINDEX RELEASE RESET REVOKE ROLLBACK SAVEPOINT SECURITY SELECT SET SHOW " +
      "START TRUNCATE UNLISTEN|10 UPDATE VACUUM|10 VALUES " +
      // SQL commands (others)
      "AGGREGATE COLLATION CONVERSION|10 DATABASE DEFAULT PRIVILEGES DOMAIN TRIGGER EXTENSION FOREIGN " +
      "WRAPPER|10 TABLE FUNCTION GROUP LANGUAGE LARGE OBJECT MATERIALIZED VIEW OPERATOR CLASS " +
      "FAMILY POLICY PUBLICATION|10 ROLE RULE SCHEMA SEQUENCE SERVER STATISTICS SUBSCRIPTION SYSTEM " +
      "TABLESPACE CONFIGURATION DICTIONARY PARSER TEMPLATE TYPE USER MAPPING PREPARED ACCESS " +
      "METHOD CAST AS TRANSFORM TRANSACTION OWNED TO INTO SESSION AUTHORIZATION " +
      "INDEX PROCEDURE ASSERTION " +
      // additional reserved key words
      "ALL ANALYSE AND ANY ARRAY ASC ASYMMETRIC|10 BOTH CASE CHECK " +
      "COLLATE COLUMN CONCURRENTLY|10 CONSTRAINT CROSS " +
      "DEFERRABLE RANGE " +
      "DESC DISTINCT ELSE EXCEPT FOR FREEZE|10 FROM FULL HAVING " +
      "ILIKE IN INITIALLY INNER INTERSECT IS ISNULL JOIN LATERAL LEADING LIKE LIMIT " +
      "NATURAL NOT NOTNULL NULL OFFSET ON ONLY OR ORDER OUTER OVERLAPS PLACING PRIMARY " +
      "REFERENCES RETURNING SIMILAR SOME SYMMETRIC TABLESAMPLE THEN " +
      "TRAILING UNION UNIQUE USING VARIADIC|10 VERBOSE WHEN WHERE WINDOW WITH " +
      // some of non-reserved (which are used in clauses or as PL/pgSQL keyword)
      "BY RETURNS INOUT OUT SETOF|10 IF STRICT CURRENT CONTINUE OWNER LOCATION OVER PARTITION WITHIN " +
      "BETWEEN ESCAPE EXTERNAL INVOKER DEFINER WORK RENAME VERSION CONNECTION CONNECT " +
      "TABLES TEMP TEMPORARY FUNCTIONS SEQUENCES TYPES SCHEMAS OPTION CASCADE RESTRICT ADD ADMIN " +
      "EXISTS VALID VALIDATE ENABLE DISABLE REPLICA|10 ALWAYS PASSING COLUMNS PATH " +
      "REF VALUE OVERRIDING IMMUTABLE STABLE VOLATILE BEFORE AFTER EACH ROW PROCEDURAL " +
      "ROUTINE NO HANDLER VALIDATOR OPTIONS STORAGE OIDS|10 WITHOUT INHERIT DEPENDS CALLED " +
      "INPUT LEAKPROOF|10 COST ROWS NOWAIT SEARCH UNTIL ENCRYPTED|10 PASSWORD CONFLICT|10 " +
      "INSTEAD INHERITS CHARACTERISTICS WRITE CURSOR ALSO STATEMENT SHARE EXCLUSIVE INLINE " +
      "ISOLATION REPEATABLE READ COMMITTED SERIALIZABLE UNCOMMITTED LOCAL GLOBAL SQL PROCEDURES " +
      "RECURSIVE SNAPSHOT ROLLUP CUBE TRUSTED|10 INCLUDE FOLLOWING PRECEDING UNBOUNDED RANGE GROUPS " +
      "UNENCRYPTED|10 SYSID FORMAT DELIMITER HEADER QUOTE ENCODING FILTER OFF " +
      // some parameters of VACUUM/ANALYZE/EXPLAIN
      "FORCE_QUOTE FORCE_NOT_NULL FORCE_NULL COSTS BUFFERS TIMING SUMMARY DISABLE_PAGE_SKIPPING " +
      //
      "RESTART CYCLE GENERATED IDENTITY DEFERRED IMMEDIATE LEVEL LOGGED UNLOGGED " +
      "OF NOTHING NONE EXCLUDE ATTRIBUTE " +
      // from GRANT (not keywords actually)
      "USAGE ROUTINES " +
      // actually literals, but look better this way (due to IS TRUE, IS FALSE, ISNULL etc)
      "TRUE FALSE NAN INFINITY ";

    var ROLE_ATTRS = // only those not in keywrods already
      "SUPERUSER NOSUPERUSER CREATEDB NOCREATEDB CREATEROLE NOCREATEROLE INHERIT NOINHERIT " +
      "LOGIN NOLOGIN REPLICATION NOREPLICATION BYPASSRLS NOBYPASSRLS ";

    var PLPGSQL_KW =
      "ALIAS BEGIN CONSTANT DECLARE END EXCEPTION RETURN PERFORM|10 RAISE GET DIAGNOSTICS " +
      "STACKED|10 FOREACH LOOP ELSIF EXIT WHILE REVERSE SLICE DEBUG LOG INFO NOTICE WARNING ASSERT " +
      "OPEN ";

    var TYPES =
      // https://www.postgresql.org/docs/11/static/datatype.html
      "BIGINT INT8 BIGSERIAL SERIAL8 BIT VARYING VARBIT BOOLEAN BOOL BOX BYTEA CHARACTER CHAR VARCHAR " +
      "CIDR CIRCLE DATE DOUBLE PRECISION FLOAT8 FLOAT INET INTEGER INT INT4 INTERVAL JSON JSONB LINE LSEG|10 " +
      "MACADDR MACADDR8 MONEY NUMERIC DEC DECIMAL PATH POINT POLYGON REAL FLOAT4 SMALLINT INT2 " +
      "SMALLSERIAL|10 SERIAL2|10 SERIAL|10 SERIAL4|10 TEXT TIME ZONE TIMETZ|10 TIMESTAMP TIMESTAMPTZ|10 TSQUERY|10 TSVECTOR|10 " +
      "TXID_SNAPSHOT|10 UUID XML NATIONAL NCHAR " +
      "INT4RANGE|10 INT8RANGE|10 NUMRANGE|10 TSRANGE|10 TSTZRANGE|10 DATERANGE|10 " +
      // pseudotypes
      "ANYELEMENT ANYARRAY ANYNONARRAY ANYENUM ANYRANGE CSTRING INTERNAL " +
      "RECORD PG_DDL_COMMAND VOID UNKNOWN OPAQUE REFCURSOR " +
      // spec. type
      "NAME " +
      // OID-types
      "OID REGPROC|10 REGPROCEDURE|10 REGOPER|10 REGOPERATOR|10 REGCLASS|10 REGTYPE|10 REGROLE|10 " +
      "REGNAMESPACE|10 REGCONFIG|10 REGDICTIONARY|10 "; // +
    // some types from standard extensions
    ("HSTORE|10 LO LTREE|10 ");

    var TYPES_RE = TYPES.trim()
      .split(" ")
      .map(function(val) {
        return val.split("|")[0];
      })
      .join("|");

    var SQL_BI =
      "CURRENT_TIME CURRENT_TIMESTAMP CURRENT_USER CURRENT_CATALOG|10 CURRENT_DATE LOCALTIME LOCALTIMESTAMP " +
      "CURRENT_ROLE|10 CURRENT_SCHEMA|10 SESSION_USER PUBLIC ";

    var PLPGSQL_BI =
      "FOUND NEW OLD TG_NAME|10 TG_WHEN|10 TG_LEVEL|10 TG_OP|10 TG_RELID|10 TG_RELNAME|10 " +
      "TG_TABLE_NAME|10 TG_TABLE_SCHEMA|10 TG_NARGS|10 TG_ARGV|10 TG_EVENT|10 TG_TAG|10 " +
      // get diagnostics
      "ROW_COUNT RESULT_OID|10 PG_CONTEXT|10 RETURNED_SQLSTATE COLUMN_NAME CONSTRAINT_NAME " +
      "PG_DATATYPE_NAME|10 MESSAGE_TEXT TABLE_NAME SCHEMA_NAME PG_EXCEPTION_DETAIL|10 " +
      "PG_EXCEPTION_HINT|10 PG_EXCEPTION_CONTEXT|10 ";

    var PLPGSQL_EXCEPTIONS =
      // exceptions https://www.postgresql.org/docs/current/static/errcodes-appendix.html
      "SQLSTATE SQLERRM|10 " +
      "SUCCESSFUL_COMPLETION WARNING DYNAMIC_RESULT_SETS_RETURNED IMPLICIT_ZERO_BIT_PADDING " +
      "NULL_VALUE_ELIMINATED_IN_SET_FUNCTION PRIVILEGE_NOT_GRANTED PRIVILEGE_NOT_REVOKED " +
      "STRING_DATA_RIGHT_TRUNCATION DEPRECATED_FEATURE NO_DATA NO_ADDITIONAL_DYNAMIC_RESULT_SETS_RETURNED " +
      "SQL_STATEMENT_NOT_YET_COMPLETE CONNECTION_EXCEPTION CONNECTION_DOES_NOT_EXIST CONNECTION_FAILURE " +
      "SQLCLIENT_UNABLE_TO_ESTABLISH_SQLCONNECTION SQLSERVER_REJECTED_ESTABLISHMENT_OF_SQLCONNECTION " +
      "TRANSACTION_RESOLUTION_UNKNOWN PROTOCOL_VIOLATION TRIGGERED_ACTION_EXCEPTION FEATURE_NOT_SUPPORTED " +
      "INVALID_TRANSACTION_INITIATION LOCATOR_EXCEPTION INVALID_LOCATOR_SPECIFICATION INVALID_GRANTOR " +
      "INVALID_GRANT_OPERATION INVALID_ROLE_SPECIFICATION DIAGNOSTICS_EXCEPTION " +
      "STACKED_DIAGNOSTICS_ACCESSED_WITHOUT_ACTIVE_HANDLER CASE_NOT_FOUND CARDINALITY_VIOLATION " +
      "DATA_EXCEPTION ARRAY_SUBSCRIPT_ERROR CHARACTER_NOT_IN_REPERTOIRE DATETIME_FIELD_OVERFLOW " +
      "DIVISION_BY_ZERO ERROR_IN_ASSIGNMENT ESCAPE_CHARACTER_CONFLICT INDICATOR_OVERFLOW " +
      "INTERVAL_FIELD_OVERFLOW INVALID_ARGUMENT_FOR_LOGARITHM INVALID_ARGUMENT_FOR_NTILE_FUNCTION " +
      "INVALID_ARGUMENT_FOR_NTH_VALUE_FUNCTION INVALID_ARGUMENT_FOR_POWER_FUNCTION " +
      "INVALID_ARGUMENT_FOR_WIDTH_BUCKET_FUNCTION INVALID_CHARACTER_VALUE_FOR_CAST " +
      "INVALID_DATETIME_FORMAT INVALID_ESCAPE_CHARACTER INVALID_ESCAPE_OCTET INVALID_ESCAPE_SEQUENCE " +
      "NONSTANDARD_USE_OF_ESCAPE_CHARACTER INVALID_INDICATOR_PARAMETER_VALUE INVALID_PARAMETER_VALUE " +
      "INVALID_REGULAR_EXPRESSION INVALID_ROW_COUNT_IN_LIMIT_CLAUSE " +
      "INVALID_ROW_COUNT_IN_RESULT_OFFSET_CLAUSE INVALID_TABLESAMPLE_ARGUMENT INVALID_TABLESAMPLE_REPEAT " +
      "INVALID_TIME_ZONE_DISPLACEMENT_VALUE INVALID_USE_OF_ESCAPE_CHARACTER MOST_SPECIFIC_TYPE_MISMATCH " +
      "NULL_VALUE_NOT_ALLOWED NULL_VALUE_NO_INDICATOR_PARAMETER NUMERIC_VALUE_OUT_OF_RANGE " +
      "SEQUENCE_GENERATOR_LIMIT_EXCEEDED STRING_DATA_LENGTH_MISMATCH STRING_DATA_RIGHT_TRUNCATION " +
      "SUBSTRING_ERROR TRIM_ERROR UNTERMINATED_C_STRING ZERO_LENGTH_CHARACTER_STRING " +
      "FLOATING_POINT_EXCEPTION INVALID_TEXT_REPRESENTATION INVALID_BINARY_REPRESENTATION " +
      "BAD_COPY_FILE_FORMAT UNTRANSLATABLE_CHARACTER NOT_AN_XML_DOCUMENT INVALID_XML_DOCUMENT " +
      "INVALID_XML_CONTENT INVALID_XML_COMMENT INVALID_XML_PROCESSING_INSTRUCTION " +
      "INTEGRITY_CONSTRAINT_VIOLATION RESTRICT_VIOLATION NOT_NULL_VIOLATION FOREIGN_KEY_VIOLATION " +
      "UNIQUE_VIOLATION CHECK_VIOLATION EXCLUSION_VIOLATION INVALID_CURSOR_STATE " +
      "INVALID_TRANSACTION_STATE ACTIVE_SQL_TRANSACTION BRANCH_TRANSACTION_ALREADY_ACTIVE " +
      "HELD_CURSOR_REQUIRES_SAME_ISOLATION_LEVEL INAPPROPRIATE_ACCESS_MODE_FOR_BRANCH_TRANSACTION " +
      "INAPPROPRIATE_ISOLATION_LEVEL_FOR_BRANCH_TRANSACTION " +
      "NO_ACTIVE_SQL_TRANSACTION_FOR_BRANCH_TRANSACTION READ_ONLY_SQL_TRANSACTION " +
      "SCHEMA_AND_DATA_STATEMENT_MIXING_NOT_SUPPORTED NO_ACTIVE_SQL_TRANSACTION " +
      "IN_FAILED_SQL_TRANSACTION IDLE_IN_TRANSACTION_SESSION_TIMEOUT INVALID_SQL_STATEMENT_NAME " +
      "TRIGGERED_DATA_CHANGE_VIOLATION INVALID_AUTHORIZATION_SPECIFICATION INVALID_PASSWORD " +
      "DEPENDENT_PRIVILEGE_DESCRIPTORS_STILL_EXIST DEPENDENT_OBJECTS_STILL_EXIST " +
      "INVALID_TRANSACTION_TERMINATION SQL_ROUTINE_EXCEPTION FUNCTION_EXECUTED_NO_RETURN_STATEMENT " +
      "MODIFYING_SQL_DATA_NOT_PERMITTED PROHIBITED_SQL_STATEMENT_ATTEMPTED " +
      "READING_SQL_DATA_NOT_PERMITTED INVALID_CURSOR_NAME EXTERNAL_ROUTINE_EXCEPTION " +
      "CONTAINING_SQL_NOT_PERMITTED MODIFYING_SQL_DATA_NOT_PERMITTED " +
      "PROHIBITED_SQL_STATEMENT_ATTEMPTED READING_SQL_DATA_NOT_PERMITTED " +
      "EXTERNAL_ROUTINE_INVOCATION_EXCEPTION INVALID_SQLSTATE_RETURNED NULL_VALUE_NOT_ALLOWED " +
      "TRIGGER_PROTOCOL_VIOLATED SRF_PROTOCOL_VIOLATED EVENT_TRIGGER_PROTOCOL_VIOLATED " +
      "SAVEPOINT_EXCEPTION INVALID_SAVEPOINT_SPECIFICATION INVALID_CATALOG_NAME " +
      "INVALID_SCHEMA_NAME TRANSACTION_ROLLBACK TRANSACTION_INTEGRITY_CONSTRAINT_VIOLATION " +
      "SERIALIZATION_FAILURE STATEMENT_COMPLETION_UNKNOWN DEADLOCK_DETECTED " +
      "SYNTAX_ERROR_OR_ACCESS_RULE_VIOLATION SYNTAX_ERROR INSUFFICIENT_PRIVILEGE CANNOT_COERCE " +
      "GROUPING_ERROR WINDOWING_ERROR INVALID_RECURSION INVALID_FOREIGN_KEY INVALID_NAME " +
      "NAME_TOO_LONG RESERVED_NAME DATATYPE_MISMATCH INDETERMINATE_DATATYPE COLLATION_MISMATCH " +
      "INDETERMINATE_COLLATION WRONG_OBJECT_TYPE GENERATED_ALWAYS UNDEFINED_COLUMN " +
      "UNDEFINED_FUNCTION UNDEFINED_TABLE UNDEFINED_PARAMETER UNDEFINED_OBJECT " +
      "DUPLICATE_COLUMN DUPLICATE_CURSOR DUPLICATE_DATABASE DUPLICATE_FUNCTION " +
      "DUPLICATE_PREPARED_STATEMENT DUPLICATE_SCHEMA DUPLICATE_TABLE DUPLICATE_ALIAS " +
      "DUPLICATE_OBJECT AMBIGUOUS_COLUMN AMBIGUOUS_FUNCTION AMBIGUOUS_PARAMETER AMBIGUOUS_ALIAS " +
      "INVALID_COLUMN_REFERENCE INVALID_COLUMN_DEFINITION INVALID_CURSOR_DEFINITION " +
      "INVALID_DATABASE_DEFINITION INVALID_FUNCTION_DEFINITION " +
      "INVALID_PREPARED_STATEMENT_DEFINITION INVALID_SCHEMA_DEFINITION INVALID_TABLE_DEFINITION " +
      "INVALID_OBJECT_DEFINITION WITH_CHECK_OPTION_VIOLATION INSUFFICIENT_RESOURCES DISK_FULL " +
      "OUT_OF_MEMORY TOO_MANY_CONNECTIONS CONFIGURATION_LIMIT_EXCEEDED PROGRAM_LIMIT_EXCEEDED " +
      "STATEMENT_TOO_COMPLEX TOO_MANY_COLUMNS TOO_MANY_ARGUMENTS OBJECT_NOT_IN_PREREQUISITE_STATE " +
      "OBJECT_IN_USE CANT_CHANGE_RUNTIME_PARAM LOCK_NOT_AVAILABLE OPERATOR_INTERVENTION " +
      "QUERY_CANCELED ADMIN_SHUTDOWN CRASH_SHUTDOWN CANNOT_CONNECT_NOW DATABASE_DROPPED " +
      "SYSTEM_ERROR IO_ERROR UNDEFINED_FILE DUPLICATE_FILE SNAPSHOT_TOO_OLD CONFIG_FILE_ERROR " +
      "LOCK_FILE_EXISTS FDW_ERROR FDW_COLUMN_NAME_NOT_FOUND FDW_DYNAMIC_PARAMETER_VALUE_NEEDED " +
      "FDW_FUNCTION_SEQUENCE_ERROR FDW_INCONSISTENT_DESCRIPTOR_INFORMATION " +
      "FDW_INVALID_ATTRIBUTE_VALUE FDW_INVALID_COLUMN_NAME FDW_INVALID_COLUMN_NUMBER " +
      "FDW_INVALID_DATA_TYPE FDW_INVALID_DATA_TYPE_DESCRIPTORS " +
      "FDW_INVALID_DESCRIPTOR_FIELD_IDENTIFIER FDW_INVALID_HANDLE FDW_INVALID_OPTION_INDEX " +
      "FDW_INVALID_OPTION_NAME FDW_INVALID_STRING_LENGTH_OR_BUFFER_LENGTH " +
      "FDW_INVALID_STRING_FORMAT FDW_INVALID_USE_OF_NULL_POINTER FDW_TOO_MANY_HANDLES " +
      "FDW_OUT_OF_MEMORY FDW_NO_SCHEMAS FDW_OPTION_NAME_NOT_FOUND FDW_REPLY_HANDLE " +
      "FDW_SCHEMA_NOT_FOUND FDW_TABLE_NOT_FOUND FDW_UNABLE_TO_CREATE_EXECUTION " +
      "FDW_UNABLE_TO_CREATE_REPLY FDW_UNABLE_TO_ESTABLISH_CONNECTION PLPGSQL_ERROR " +
      "RAISE_EXCEPTION NO_DATA_FOUND TOO_MANY_ROWS ASSERT_FAILURE INTERNAL_ERROR DATA_CORRUPTED " +
      "INDEX_CORRUPTED ";

    var FUNCTIONS =
      // https://www.postgresql.org/docs/11/static/functions-aggregate.html
      "ARRAY_AGG AVG BIT_AND BIT_OR BOOL_AND BOOL_OR COUNT EVERY JSON_AGG JSONB_AGG JSON_OBJECT_AGG " +
      "JSONB_OBJECT_AGG MAX MIN MODE STRING_AGG SUM XMLAGG " +
      "CORR COVAR_POP COVAR_SAMP REGR_AVGX REGR_AVGY REGR_COUNT REGR_INTERCEPT REGR_R2 REGR_SLOPE " +
      "REGR_SXX REGR_SXY REGR_SYY STDDEV STDDEV_POP STDDEV_SAMP VARIANCE VAR_POP VAR_SAMP " +
      "PERCENTILE_CONT PERCENTILE_DISC " +
      // https://www.postgresql.org/docs/11/static/functions-window.html
      "ROW_NUMBER RANK DENSE_RANK PERCENT_RANK CUME_DIST NTILE LAG LEAD FIRST_VALUE LAST_VALUE NTH_VALUE " +
      // https://www.postgresql.org/docs/11/static/functions-comparison.html
      "NUM_NONNULLS NUM_NULLS " +
      // https://www.postgresql.org/docs/11/static/functions-math.html
      "ABS CBRT CEIL CEILING DEGREES DIV EXP FLOOR LN LOG MOD PI POWER RADIANS ROUND SCALE SIGN SQRT " +
      "TRUNC WIDTH_BUCKET " +
      "RANDOM SETSEED " +
      "ACOS ACOSD ASIN ASIND ATAN ATAND ATAN2 ATAN2D COS COSD COT COTD SIN SIND TAN TAND " +
      // https://www.postgresql.org/docs/11/static/functions-string.html
      "BIT_LENGTH CHAR_LENGTH CHARACTER_LENGTH LOWER OCTET_LENGTH OVERLAY POSITION SUBSTRING TREAT TRIM UPPER " +
      "ASCII BTRIM CHR CONCAT CONCAT_WS CONVERT CONVERT_FROM CONVERT_TO DECODE ENCODE INITCAP" +
      "LEFT LENGTH LPAD LTRIM MD5 PARSE_IDENT PG_CLIENT_ENCODING QUOTE_IDENT|10 QUOTE_LITERAL|10 " +
      "QUOTE_NULLABLE|10 REGEXP_MATCH REGEXP_MATCHES REGEXP_REPLACE REGEXP_SPLIT_TO_ARRAY " +
      "REGEXP_SPLIT_TO_TABLE REPEAT REPLACE REVERSE RIGHT RPAD RTRIM SPLIT_PART STRPOS SUBSTR " +
      "TO_ASCII TO_HEX TRANSLATE " +
      // https://www.postgresql.org/docs/11/static/functions-binarystring.html
      "OCTET_LENGTH GET_BIT GET_BYTE SET_BIT SET_BYTE " +
      // https://www.postgresql.org/docs/11/static/functions-formatting.html
      "TO_CHAR TO_DATE TO_NUMBER TO_TIMESTAMP " +
      // https://www.postgresql.org/docs/11/static/functions-datetime.html
      "AGE CLOCK_TIMESTAMP|10 DATE_PART DATE_TRUNC ISFINITE JUSTIFY_DAYS JUSTIFY_HOURS JUSTIFY_INTERVAL " +
      "MAKE_DATE MAKE_INTERVAL|10 MAKE_TIME MAKE_TIMESTAMP|10 MAKE_TIMESTAMPTZ|10 NOW STATEMENT_TIMESTAMP|10 " +
      "TIMEOFDAY TRANSACTION_TIMESTAMP|10 " +
      // https://www.postgresql.org/docs/11/static/functions-enum.html
      "ENUM_FIRST ENUM_LAST ENUM_RANGE " +
      // https://www.postgresql.org/docs/11/static/functions-geometry.html
      "AREA CENTER DIAMETER HEIGHT ISCLOSED ISOPEN NPOINTS PCLOSE POPEN RADIUS WIDTH " +
      "BOX BOUND_BOX CIRCLE LINE LSEG PATH POLYGON " +
      // https://www.postgresql.org/docs/11/static/functions-net.html
      "ABBREV BROADCAST HOST HOSTMASK MASKLEN NETMASK NETWORK SET_MASKLEN TEXT INET_SAME_FAMILY" +
      "INET_MERGE MACADDR8_SET7BIT " +
      // https://www.postgresql.org/docs/11/static/functions-textsearch.html
      "ARRAY_TO_TSVECTOR GET_CURRENT_TS_CONFIG NUMNODE PLAINTO_TSQUERY PHRASETO_TSQUERY WEBSEARCH_TO_TSQUERY " +
      "QUERYTREE SETWEIGHT STRIP TO_TSQUERY TO_TSVECTOR JSON_TO_TSVECTOR JSONB_TO_TSVECTOR TS_DELETE " +
      "TS_FILTER TS_HEADLINE TS_RANK TS_RANK_CD TS_REWRITE TSQUERY_PHRASE TSVECTOR_TO_ARRAY " +
      "TSVECTOR_UPDATE_TRIGGER TSVECTOR_UPDATE_TRIGGER_COLUMN " +
      // https://www.postgresql.org/docs/11/static/functions-xml.html
      "XMLCOMMENT XMLCONCAT XMLELEMENT XMLFOREST XMLPI XMLROOT " +
      "XMLEXISTS XML_IS_WELL_FORMED XML_IS_WELL_FORMED_DOCUMENT XML_IS_WELL_FORMED_CONTENT " +
      "XPATH XPATH_EXISTS XMLTABLE XMLNAMESPACES " +
      "TABLE_TO_XML TABLE_TO_XMLSCHEMA TABLE_TO_XML_AND_XMLSCHEMA " +
      "QUERY_TO_XML QUERY_TO_XMLSCHEMA QUERY_TO_XML_AND_XMLSCHEMA " +
      "CURSOR_TO_XML CURSOR_TO_XMLSCHEMA " +
      "SCHEMA_TO_XML SCHEMA_TO_XMLSCHEMA SCHEMA_TO_XML_AND_XMLSCHEMA " +
      "DATABASE_TO_XML DATABASE_TO_XMLSCHEMA DATABASE_TO_XML_AND_XMLSCHEMA " +
      "XMLATTRIBUTES " +
      // https://www.postgresql.org/docs/11/static/functions-json.html
      "TO_JSON TO_JSONB ARRAY_TO_JSON ROW_TO_JSON JSON_BUILD_ARRAY JSONB_BUILD_ARRAY JSON_BUILD_OBJECT " +
      "JSONB_BUILD_OBJECT JSON_OBJECT JSONB_OBJECT JSON_ARRAY_LENGTH JSONB_ARRAY_LENGTH JSON_EACH " +
      "JSONB_EACH JSON_EACH_TEXT JSONB_EACH_TEXT JSON_EXTRACT_PATH JSONB_EXTRACT_PATH " +
      "JSON_OBJECT_KEYS JSONB_OBJECT_KEYS JSON_POPULATE_RECORD JSONB_POPULATE_RECORD JSON_POPULATE_RECORDSET " +
      "JSONB_POPULATE_RECORDSET JSON_ARRAY_ELEMENTS JSONB_ARRAY_ELEMENTS JSON_ARRAY_ELEMENTS_TEXT " +
      "JSONB_ARRAY_ELEMENTS_TEXT JSON_TYPEOF JSONB_TYPEOF JSON_TO_RECORD JSONB_TO_RECORD JSON_TO_RECORDSET " +
      "JSONB_TO_RECORDSET JSON_STRIP_NULLS JSONB_STRIP_NULLS JSONB_SET JSONB_INSERT JSONB_PRETTY " +
      // https://www.postgresql.org/docs/11/static/functions-sequence.html
      "CURRVAL LASTVAL NEXTVAL SETVAL " +
      // https://www.postgresql.org/docs/11/static/functions-conditional.html
      "COALESCE NULLIF GREATEST LEAST " +
      // https://www.postgresql.org/docs/11/static/functions-array.html
      "ARRAY_APPEND ARRAY_CAT ARRAY_NDIMS ARRAY_DIMS ARRAY_FILL ARRAY_LENGTH ARRAY_LOWER ARRAY_POSITION " +
      "ARRAY_POSITIONS ARRAY_PREPEND ARRAY_REMOVE ARRAY_REPLACE ARRAY_TO_STRING ARRAY_UPPER CARDINALITY " +
      "STRING_TO_ARRAY UNNEST " +
      // https://www.postgresql.org/docs/11/static/functions-range.html
      "ISEMPTY LOWER_INC UPPER_INC LOWER_INF UPPER_INF RANGE_MERGE " +
      // https://www.postgresql.org/docs/11/static/functions-srf.html
      "GENERATE_SERIES GENERATE_SUBSCRIPTS " +
      // https://www.postgresql.org/docs/11/static/functions-info.html
      "CURRENT_DATABASE CURRENT_QUERY CURRENT_SCHEMA|10 CURRENT_SCHEMAS|10 INET_CLIENT_ADDR INET_CLIENT_PORT " +
      "INET_SERVER_ADDR INET_SERVER_PORT ROW_SECURITY_ACTIVE FORMAT_TYPE " +
      "TO_REGCLASS TO_REGPROC TO_REGPROCEDURE TO_REGOPER TO_REGOPERATOR TO_REGTYPE TO_REGNAMESPACE TO_REGROLE " +
      "COL_DESCRIPTION OBJ_DESCRIPTION SHOBJ_DESCRIPTION " +
      "TXID_CURRENT TXID_CURRENT_IF_ASSIGNED TXID_CURRENT_SNAPSHOT TXID_SNAPSHOT_XIP TXID_SNAPSHOT_XMAX " +
      "TXID_SNAPSHOT_XMIN TXID_VISIBLE_IN_SNAPSHOT TXID_STATUS " +
      // https://www.postgresql.org/docs/11/static/functions-admin.html
      "CURRENT_SETTING SET_CONFIG BRIN_SUMMARIZE_NEW_VALUES BRIN_SUMMARIZE_RANGE BRIN_DESUMMARIZE_RANGE " +
      "GIN_CLEAN_PENDING_LIST " +
      // https://www.postgresql.org/docs/11/static/functions-trigger.html
      "SUPPRESS_REDUNDANT_UPDATES_TRIGGER " +
      // ihttps://www.postgresql.org/docs/devel/static/lo-funcs.html
      "LO_FROM_BYTEA LO_PUT LO_GET LO_CREAT LO_CREATE LO_UNLINK LO_IMPORT LO_EXPORT LOREAD LOWRITE " +
      //
      "GROUPING CAST ";

    var FUNCTIONS_RE = FUNCTIONS.trim()
      .split(" ")
      .map(function(val) {
        return val.split("|")[0];
      })
      .join("|");

    return {
      aliases: ["postgres", "postgresql"],
      case_insensitive: true,
      keywords: {
        keyword: SQL_KW + PLPGSQL_KW + ROLE_ATTRS,
        built_in: SQL_BI + PLPGSQL_BI + PLPGSQL_EXCEPTIONS
      },
      // Forbid some cunstructs from other languages to improve autodetect. In fact
      // "[a-z]:" is legal (as part of array slice), but improbabal.
      illegal: /:==|\W\s*\(\*|(^|\s)\$[a-z]|{{|[a-z]:\s*$|\.\.\.|TO:|DO:/,
      contains: [
        // special handling of some words, which are reserved only in some contexts
        {
          className: "keyword",
          variants: [
            { begin: /\bTEXT\s*SEARCH\b/ },
            { begin: /\b(PRIMARY|FOREIGN|FOR(\s+NO)?)\s+KEY\b/ },
            { begin: /\bPARALLEL\s+(UNSAFE|RESTRICTED|SAFE)\b/ },
            { begin: /\bSTORAGE\s+(PLAIN|EXTERNAL|EXTENDED|MAIN)\b/ },
            { begin: /\bMATCH\s+(FULL|PARTIAL|SIMPLE)\b/ },
            { begin: /\bNULLS\s+(FIRST|LAST)\b/ },
            { begin: /\bEVENT\s+TRIGGER\b/ },
            { begin: /\b(MAPPING|OR)\s+REPLACE\b/ },
            { begin: /\b(FROM|TO)\s+(PROGRAM|STDIN|STDOUT)\b/ },
            { begin: /\b(SHARE|EXCLUSIVE)\s+MODE\b/ },
            { begin: /\b(LEFT|RIGHT)\s+(OUTER\s+)?JOIN\b/ },
            {
              begin: /\b(FETCH|MOVE)\s+(NEXT|PRIOR|FIRST|LAST|ABSOLUTE|RELATIVE|FORWARD|BACKWARD)\b/
            },
            { begin: /\bPRESERVE\s+ROWS\b/ },
            { begin: /\bDISCARD\s+PLANS\b/ },
            { begin: /\bREFERENCING\s+(OLD|NEW)\b/ },
            { begin: /\bSKIP\s+LOCKED\b/ },
            { begin: /\bGROUPING\s+SETS\b/ },
            {
              begin: /\b(BINARY|INSENSITIVE|SCROLL|NO\s+SCROLL)\s+(CURSOR|FOR)\b/
            },
            { begin: /\b(WITH|WITHOUT)\s+HOLD\b/ },
            { begin: /\bWITH\s+(CASCADED|LOCAL)\s+CHECK\s+OPTION\b/ },
            { begin: /\bEXCLUDE\s+(TIES|NO\s+OTHERS)\b/ },
            { begin: /\bFORMAT\s+(TEXT|XML|JSON|YAML)\b/ },
            { begin: /\bSET\s+((SESSION|LOCAL)\s+)?NAMES\b/ },
            { begin: /\bIS\s+(NOT\s+)?UNKNOWN\b/ },
            { begin: /\bSECURITY\s+LABEL\b/ },
            { begin: /\bSTANDALONE\s+(YES|NO|NO\s+VALUE)\b/ },
            { begin: /\bWITH\s+(NO\s+)?DATA\b/ },
            { begin: /\b(FOREIGN|SET)\s+DATA\b/ },
            { begin: /\bSET\s+(CATALOG|CONSTRAINTS)\b/ },
            { begin: /\b(WITH|FOR)\s+ORDINALITY\b/ },
            { begin: /\bIS\s+(NOT\s+)?DOCUMENT\b/ },
            { begin: /\bXML\s+OPTION\s+(DOCUMENT|CONTENT)\b/ },
            { begin: /\b(STRIP|PRESERVE)\s+WHITESPACE\b/ },
            { begin: /\bNO\s+(ACTION|MAXVALUE|MINVALUE)\b/ },
            { begin: /\bPARTITION\s+BY\s+(RANGE|LIST|HASH)\b/ },
            { begin: /\bAT\s+TIME\s+ZONE\b/ },
            { begin: /\bGRANTED\s+BY\b/ },
            { begin: /\bRETURN\s+(QUERY|NEXT)\b/ },
            { begin: /\b(ATTACH|DETACH)\s+PARTITION\b/ },
            { begin: /\bFORCE\s+ROW\s+LEVEL\s+SECURITY\b/ },
            {
              begin: /\b(INCLUDING|EXCLUDING)\s+(COMMENTS|CONSTRAINTS|DEFAULTS|IDENTITY|INDEXES|STATISTICS|STORAGE|ALL)\b/
            },
            {
              begin: /\bAS\s+(ASSIGNMENT|IMPLICIT|PERMISSIVE|RESTRICTIVE|ENUM|RANGE)\b/
            }
          ]
        },
        // functions named as keywords, followed by '('
        {
          begin: /\b(FORMAT|FAMILY|VERSION)\s*\(/
          //keywords: { built_in: 'FORMAT FAMILY VERSION' }
        },
        // INCLUDE ( ... ) in index_parameters in CREATE TABLE
        {
          begin: /\bINCLUDE\s*\(/,
          keywords: "INCLUDE"
        },
        // not highlight RANGE if not in frame_clause (not 100% correct, but seems satisfactory)
        {
          begin: /\bRANGE(?!\s*(BETWEEN|UNBOUNDED|CURRENT|[-0-9]+))/
        },
        // disable highlighting in commands CREATE AGGREGATE/COLLATION/DATABASE/OPERTOR/TEXT SEARCH .../TYPE
        // and in PL/pgSQL RAISE ... USING
        {
          begin: /\b(VERSION|OWNER|TEMPLATE|TABLESPACE|CONNECTION\s+LIMIT|PROCEDURE|RESTRICT|JOIN|PARSER|COPY|START|END|COLLATION|INPUT|ANALYZE|STORAGE|LIKE|DEFAULT|DELIMITER|ENCODING|COLUMN|CONSTRAINT|TABLE|SCHEMA)\s*=/
        },
        // PG_smth; HAS_some_PRIVILEGE
        {
          //className: 'built_in',
          begin: /\b(PG_\w+?|HAS_[A-Z_]+_PRIVILEGE)\b/,
          relevance: 10
        },
        // extract
        {
          begin: /\bEXTRACT\s*\(/,
          end: /\bFROM\b/,
          returnEnd: true,
          keywords: {
            //built_in: 'EXTRACT',
            type:
              "CENTURY DAY DECADE DOW DOY EPOCH HOUR ISODOW ISOYEAR MICROSECONDS " +
              "MILLENNIUM MILLISECONDS MINUTE MONTH QUARTER SECOND TIMEZONE TIMEZONE_HOUR " +
              "TIMEZONE_MINUTE WEEK YEAR"
          }
        },
        // xmlelement, xmlpi - special NAME
        {
          begin: /\b(XMLELEMENT|XMLPI)\s*\(\s*NAME/,
          keywords: {
            //built_in: 'XMLELEMENT XMLPI',
            keyword: "NAME"
          }
        },
        // xmlparse, xmlserialize
        {
          begin: /\b(XMLPARSE|XMLSERIALIZE)\s*\(\s*(DOCUMENT|CONTENT)/,
          keywords: {
            //built_in: 'XMLPARSE XMLSERIALIZE',
            keyword: "DOCUMENT CONTENT"
          }
        },
        // Sequences. We actually skip everything between CACHE|INCREMENT|MAXVALUE|MINVALUE and
        // nearest following numeric constant. Without with trick we find a lot of "keywords"
        // in 'avrasm' autodetection test...
        {
          beginKeywords: "CACHE INCREMENT MAXVALUE MINVALUE",
          end: hljs.C_NUMBER_RE,
          returnEnd: true,
          keywords: "BY CACHE INCREMENT MAXVALUE MINVALUE"
        },
        // WITH|WITHOUT TIME ZONE as part of datatype
        {
          className: "type",
          begin: /\b(WITH|WITHOUT)\s+TIME\s+ZONE\b/
        },
        // INTERVAL optional fields
        {
          className: "type",
          begin: /\bINTERVAL\s+(YEAR|MONTH|DAY|HOUR|MINUTE|SECOND)(\s+TO\s+(MONTH|HOUR|MINUTE|SECOND))?\b/
        },
        // Pseudo-types which allowed only as return type
        {
          begin: /\bRETURNS\s+(LANGUAGE_HANDLER|TRIGGER|EVENT_TRIGGER|FDW_HANDLER|INDEX_AM_HANDLER|TSM_HANDLER)\b/,
          keywords: {
            keyword: "RETURNS",
            type:
              "LANGUAGE_HANDLER TRIGGER EVENT_TRIGGER FDW_HANDLER INDEX_AM_HANDLER TSM_HANDLER"
          }
        },
        // Known functions - only when followed by '('
        {
          begin: "\\b(" + FUNCTIONS_RE + ")\\s*\\("
          //keywords: { built_in: FUNCTIONS }
        },
        // Types
        {
          begin: "\\.(" + TYPES_RE + ")\\b" // prevent highlight as type, say, 'oid' in 'pgclass.oid'
        },
        {
          begin: "\\b(" + TYPES_RE + ")\\s+PATH\\b", // in XMLTABLE
          keywords: {
            keyword: "PATH", // hopefully no one would use PATH type in XMLTABLE...
            type: TYPES.replace("PATH ", "")
          }
        },
        {
          className: "type",
          begin: "\\b(" + TYPES_RE + ")\\b"
        },
        // Strings, see https://www.postgresql.org/docs/11/static/sql-syntax-lexical.html#SQL-SYNTAX-CONSTANTS
        {
          className: "string",
          begin: "'",
          end: "'",
          contains: [{ begin: "''" }]
        },
        {
          className: "string",
          begin: "(e|E|u&|U&)'",
          end: "'",
          contains: [{ begin: "\\\\." }],
          relevance: 10
        },
        {
          begin: DOLLAR_STRING,
          endSameAsBegin: true,
          contains: [
            {
              // actually we want them all except SQL; listed are those with known implementations
              // and XML + JSON just in case
              subLanguage: [
                "pgsql",
                "perl",
                "python",
                "tcl",
                "r",
                "lua",
                "java",
                "php",
                "ruby",
                "bash",
                "scheme",
                "xml",
                "json"
              ],
              endsWithParent: true
            }
          ]
        },
        // identifiers in quotes
        {
          begin: '"',
          end: '"',
          contains: [{ begin: '""' }]
        },
        // numbers
        hljs.C_NUMBER_MODE,
        // comments
        hljs.C_BLOCK_COMMENT_MODE,
        COMMENT_MODE,
        // PL/pgSQL staff
        // %ROWTYPE, %TYPE, $n
        {
          className: "meta",
          variants: [
            { begin: "%(ROW)?TYPE", relevance: 10 }, // %TYPE, %ROWTYPE
            { begin: "\\$\\d+" }, // $n
            { begin: "^#\\w", end: "$" } // #compiler option
          ]
        },
        // <<labeles>>
        {
          className: "symbol",
          begin: LABEL,
          relevance: 10
        }
      ]
    };
  });

  hljs.registerLanguage("processing", function(hljs) {
    return {
      keywords: {
        keyword:
          "BufferedReader PVector PFont PImage PGraphics HashMap boolean byte char color " +
          "double float int long String Array FloatDict FloatList IntDict IntList JSONArray JSONObject " +
          "Object StringDict StringList Table TableRow XML " +
          // Java keywords
          "false synchronized int abstract float private char boolean static null if const " +
          "for true while long throw strictfp finally protected import native final return void " +
          "enum else break transient new catch instanceof byte super volatile case assert short " +
          "package default double public try this switch continue throws protected public private",
        literal: "P2D P3D HALF_PI PI QUARTER_PI TAU TWO_PI",
        title: "setup draw",
        built_in:
          "displayHeight displayWidth mouseY mouseX mousePressed pmouseX pmouseY key " +
          "keyCode pixels focused frameCount frameRate height width " +
          "size createGraphics beginDraw createShape loadShape PShape arc ellipse line point " +
          "quad rect triangle bezier bezierDetail bezierPoint bezierTangent curve curveDetail curvePoint " +
          "curveTangent curveTightness shape shapeMode beginContour beginShape bezierVertex curveVertex " +
          "endContour endShape quadraticVertex vertex ellipseMode noSmooth rectMode smooth strokeCap " +
          "strokeJoin strokeWeight mouseClicked mouseDragged mouseMoved mousePressed mouseReleased " +
          "mouseWheel keyPressed keyPressedkeyReleased keyTyped print println save saveFrame day hour " +
          "millis minute month second year background clear colorMode fill noFill noStroke stroke alpha " +
          "blue brightness color green hue lerpColor red saturation modelX modelY modelZ screenX screenY " +
          "screenZ ambient emissive shininess specular add createImage beginCamera camera endCamera frustum " +
          "ortho perspective printCamera printProjection cursor frameRate noCursor exit loop noLoop popStyle " +
          "pushStyle redraw binary boolean byte char float hex int str unbinary unhex join match matchAll nf " +
          "nfc nfp nfs split splitTokens trim append arrayCopy concat expand reverse shorten sort splice subset " +
          "box sphere sphereDetail createInput createReader loadBytes loadJSONArray loadJSONObject loadStrings " +
          "loadTable loadXML open parseXML saveTable selectFolder selectInput beginRaw beginRecord createOutput " +
          "createWriter endRaw endRecord PrintWritersaveBytes saveJSONArray saveJSONObject saveStream saveStrings " +
          "saveXML selectOutput popMatrix printMatrix pushMatrix resetMatrix rotate rotateX rotateY rotateZ scale " +
          "shearX shearY translate ambientLight directionalLight lightFalloff lights lightSpecular noLights normal " +
          "pointLight spotLight image imageMode loadImage noTint requestImage tint texture textureMode textureWrap " +
          "blend copy filter get loadPixels set updatePixels blendMode loadShader PShaderresetShader shader createFont " +
          "loadFont text textFont textAlign textLeading textMode textSize textWidth textAscent textDescent abs ceil " +
          "constrain dist exp floor lerp log mag map max min norm pow round sq sqrt acos asin atan atan2 cos degrees " +
          "radians sin tan noise noiseDetail noiseSeed random randomGaussian randomSeed"
      },
      contains: [
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        hljs.C_NUMBER_MODE
      ]
    };
  });

  hljs.registerLanguage("python", function(hljs) {
    var KEYWORDS = {
      keyword:
        "and elif is global as in if from raise for except finally print import pass return " +
        "exec else break not with class assert yield try while continue del or def lambda " +
        "async await nonlocal|10 None True False",
      built_in: "Ellipsis NotImplemented"
    };
    var PROMPT = {
      className: "meta",
      begin: /^(>>>|\.\.\.) /
    };
    var SUBST = {
      className: "subst",
      begin: /\{/,
      end: /\}/,
      keywords: KEYWORDS,
      illegal: /#/
    };
    var STRING = {
      className: "string",
      contains: [hljs.BACKSLASH_ESCAPE],
      variants: [
        {
          begin: /(u|b)?r?'''/,
          end: /'''/,
          contains: [hljs.BACKSLASH_ESCAPE, PROMPT],
          relevance: 10
        },
        {
          begin: /(u|b)?r?"""/,
          end: /"""/,
          contains: [hljs.BACKSLASH_ESCAPE, PROMPT],
          relevance: 10
        },
        {
          begin: /(fr|rf|f)'''/,
          end: /'''/,
          contains: [hljs.BACKSLASH_ESCAPE, PROMPT, SUBST]
        },
        {
          begin: /(fr|rf|f)"""/,
          end: /"""/,
          contains: [hljs.BACKSLASH_ESCAPE, PROMPT, SUBST]
        },
        {
          begin: /(u|r|ur)'/,
          end: /'/,
          relevance: 10
        },
        {
          begin: /(u|r|ur)"/,
          end: /"/,
          relevance: 10
        },
        {
          begin: /(b|br)'/,
          end: /'/
        },
        {
          begin: /(b|br)"/,
          end: /"/
        },
        {
          begin: /(fr|rf|f)'/,
          end: /'/,
          contains: [hljs.BACKSLASH_ESCAPE, SUBST]
        },
        {
          begin: /(fr|rf|f)"/,
          end: /"/,
          contains: [hljs.BACKSLASH_ESCAPE, SUBST]
        },
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE
      ]
    };
    var NUMBER = {
      className: "number",
      relevance: 0,
      variants: [
        { begin: hljs.BINARY_NUMBER_RE + "[lLjJ]?" },
        { begin: "\\b(0o[0-7]+)[lLjJ]?" },
        { begin: hljs.C_NUMBER_RE + "[lLjJ]?" }
      ]
    };
    var PARAMS = {
      className: "params",
      begin: /\(/,
      end: /\)/,
      contains: ["self", PROMPT, NUMBER, STRING]
    };
    SUBST.contains = [STRING, NUMBER, PROMPT];
    return {
      aliases: ["py", "gyp", "ipython"],
      keywords: KEYWORDS,
      illegal: /(<\/|->|\?)|=>/,
      contains: [
        PROMPT,
        NUMBER,
        STRING,
        hljs.HASH_COMMENT_MODE,
        {
          variants: [
            { className: "function", beginKeywords: "def" },
            { className: "class", beginKeywords: "class" }
          ],
          end: /:/,
          illegal: /[${=;\n,]/,
          contains: [
            hljs.UNDERSCORE_TITLE_MODE,
            PARAMS,
            {
              begin: /->/,
              endsWithParent: true,
              keywords: "None"
            }
          ]
        },
        {
          className: "meta",
          begin: /^[\t ]*@/,
          end: /$/
        },
        {
          begin: /\b(print|exec)\(/ // don’t highlight keywords-turned-functions in Python 3
        }
      ]
    };
  });

  hljs.registerLanguage("r", function(hljs) {
    var IDENT_RE = "([a-zA-Z]|\\.[a-zA-Z.])[a-zA-Z0-9._]*";

    return {
      contains: [
        hljs.HASH_COMMENT_MODE,
        {
          begin: IDENT_RE,
          lexemes: IDENT_RE,
          keywords: {
            keyword:
              "function if in break next repeat else for return switch while try tryCatch " +
              "stop warning require library attach detach source setMethod setGeneric " +
              "setGroupGeneric setClass ...",
            literal:
              "NULL NA TRUE FALSE T F Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 " +
              "NA_complex_|10"
          },
          relevance: 0
        },
        {
          // hex value
          className: "number",
          begin: "0[xX][0-9a-fA-F]+[Li]?\\b",
          relevance: 0
        },
        {
          // explicit integer
          className: "number",
          begin: "\\d+(?:[eE][+\\-]?\\d*)?L\\b",
          relevance: 0
        },
        {
          // number with trailing decimal
          className: "number",
          begin: "\\d+\\.(?!\\d)(?:i\\b)?",
          relevance: 0
        },
        {
          // number
          className: "number",
          begin: "\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d*)?i?\\b",
          relevance: 0
        },
        {
          // number with leading decimal
          className: "number",
          begin: "\\.\\d+(?:[eE][+\\-]?\\d*)?i?\\b",
          relevance: 0
        },

        {
          // escaped identifier
          begin: "`",
          end: "`",
          relevance: 0
        },

        {
          className: "string",
          contains: [hljs.BACKSLASH_ESCAPE],
          variants: [
            { begin: '"', end: '"' },
            { begin: "'", end: "'" }
          ]
        }
      ]
    };
  });

  hljs.registerLanguage("ruby", function(hljs) {
    var RUBY_METHOD_RE =
      "[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?";
    var RUBY_KEYWORDS = {
      keyword:
        "and then defined module in return redo if BEGIN retry end for self when " +
        "next until do begin unless END rescue else break undef not super class case " +
        "require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor",
      literal: "true false nil"
    };
    var YARDOCTAG = {
      className: "doctag",
      begin: "@[A-Za-z]+"
    };
    var IRB_OBJECT = {
      begin: "#<",
      end: ">"
    };
    var COMMENT_MODES = [
      hljs.COMMENT("#", "$", {
        contains: [YARDOCTAG]
      }),
      hljs.COMMENT("^\\=begin", "^\\=end", {
        contains: [YARDOCTAG],
        relevance: 10
      }),
      hljs.COMMENT("^__END__", "\\n$")
    ];
    var SUBST = {
      className: "subst",
      begin: "#\\{",
      end: "}",
      keywords: RUBY_KEYWORDS
    };
    var STRING = {
      className: "string",
      contains: [hljs.BACKSLASH_ESCAPE, SUBST],
      variants: [
        { begin: /'/, end: /'/ },
        { begin: /"/, end: /"/ },
        { begin: /`/, end: /`/ },
        { begin: "%[qQwWx]?\\(", end: "\\)" },
        { begin: "%[qQwWx]?\\[", end: "\\]" },
        { begin: "%[qQwWx]?{", end: "}" },
        { begin: "%[qQwWx]?<", end: ">" },
        { begin: "%[qQwWx]?/", end: "/" },
        { begin: "%[qQwWx]?%", end: "%" },
        { begin: "%[qQwWx]?-", end: "-" },
        { begin: "%[qQwWx]?\\|", end: "\\|" },
        {
          // \B in the beginning suppresses recognition of ?-sequences where ?
          // is the last character of a preceding identifier, as in: `func?4`
          begin: /\B\?(\\\d{1,3}|\\x[A-Fa-f0-9]{1,2}|\\u[A-Fa-f0-9]{4}|\\?\S)\b/
        },
        {
          begin: /<<(-?)\w+$/,
          end: /^\s*\w+$/
        }
      ]
    };
    var PARAMS = {
      className: "params",
      begin: "\\(",
      end: "\\)",
      endsParent: true,
      keywords: RUBY_KEYWORDS
    };

    var RUBY_DEFAULT_CONTAINS = [
      STRING,
      IRB_OBJECT,
      {
        className: "class",
        beginKeywords: "class module",
        end: "$|;",
        illegal: /=/,
        contains: [
          hljs.inherit(hljs.TITLE_MODE, {
            begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?"
          }),
          {
            begin: "<\\s*",
            contains: [
              {
                begin: "(" + hljs.IDENT_RE + "::)?" + hljs.IDENT_RE
              }
            ]
          }
        ].concat(COMMENT_MODES)
      },
      {
        className: "function",
        beginKeywords: "def",
        end: "$|;",
        contains: [
          hljs.inherit(hljs.TITLE_MODE, { begin: RUBY_METHOD_RE }),
          PARAMS
        ].concat(COMMENT_MODES)
      },
      {
        // swallow namespace qualifiers before symbols
        begin: hljs.IDENT_RE + "::"
      },
      {
        className: "symbol",
        begin: hljs.UNDERSCORE_IDENT_RE + "(\\!|\\?)?:",
        relevance: 0
      },
      {
        className: "symbol",
        begin: ":(?!\\s)",
        contains: [STRING, { begin: RUBY_METHOD_RE }],
        relevance: 0
      },
      {
        className: "number",
        begin:
          "(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",
        relevance: 0
      },
      {
        begin: "(\\$\\W)|((\\$|\\@\\@?)(\\w+))" // variables
      },
      {
        className: "params",
        begin: /\|/,
        end: /\|/,
        keywords: RUBY_KEYWORDS
      },
      {
        // regexp container
        begin: "(" + hljs.RE_STARTERS_RE + "|unless)\\s*",
        keywords: "unless",
        contains: [
          IRB_OBJECT,
          {
            className: "regexp",
            contains: [hljs.BACKSLASH_ESCAPE, SUBST],
            illegal: /\n/,
            variants: [
              { begin: "/", end: "/[a-z]*" },
              { begin: "%r{", end: "}[a-z]*" },
              { begin: "%r\\(", end: "\\)[a-z]*" },
              { begin: "%r!", end: "![a-z]*" },
              { begin: "%r\\[", end: "\\][a-z]*" }
            ]
          }
        ].concat(COMMENT_MODES),
        relevance: 0
      }
    ].concat(COMMENT_MODES);

    SUBST.contains = RUBY_DEFAULT_CONTAINS;
    PARAMS.contains = RUBY_DEFAULT_CONTAINS;

    var SIMPLE_PROMPT = "[>?]>";
    var DEFAULT_PROMPT = "[\\w#]+\\(\\w+\\):\\d+:\\d+>";
    var RVM_PROMPT = "(\\w+-)?\\d+\\.\\d+\\.\\d(p\\d+)?[^>]+>";

    var IRB_DEFAULT = [
      {
        begin: /^\s*=>/,
        starts: {
          end: "$",
          contains: RUBY_DEFAULT_CONTAINS
        }
      },
      {
        className: "meta",
        begin:
          "^(" + SIMPLE_PROMPT + "|" + DEFAULT_PROMPT + "|" + RVM_PROMPT + ")",
        starts: {
          end: "$",
          contains: RUBY_DEFAULT_CONTAINS
        }
      }
    ];

    return {
      aliases: ["rb", "gemspec", "podspec", "thor", "irb"],
      keywords: RUBY_KEYWORDS,
      illegal: /\/\*/,
      contains: COMMENT_MODES.concat(IRB_DEFAULT).concat(RUBY_DEFAULT_CONTAINS)
    };
  });

  hljs.registerLanguage("rust", function(hljs) {
    var NUM_SUFFIX = "([ui](8|16|32|64|128|size)|f(32|64))?";
    var KEYWORDS =
      "alignof as be box break const continue crate do else enum extern " +
      "false fn for if impl in let loop match mod mut offsetof once priv " +
      "proc pub pure ref return self Self sizeof static struct super trait true " +
      "type typeof unsafe unsized use virtual while where yield move default";
    var BUILTINS =
      // functions
      "drop " +
      // types
      "i8 i16 i32 i64 i128 isize " +
      "u8 u16 u32 u64 u128 usize " +
      "f32 f64 " +
      "str char bool " +
      "Box Option Result String Vec " +
      // traits
      "Copy Send Sized Sync Drop Fn FnMut FnOnce ToOwned Clone Debug " +
      "PartialEq PartialOrd Eq Ord AsRef AsMut Into From Default Iterator " +
      "Extend IntoIterator DoubleEndedIterator ExactSizeIterator " +
      "SliceConcatExt ToString " +
      // macros
      "assert! assert_eq! bitflags! bytes! cfg! col! concat! concat_idents! " +
      "debug_assert! debug_assert_eq! env! panic! file! format! format_args! " +
      "include_bin! include_str! line! local_data_key! module_path! " +
      "option_env! print! println! select! stringify! try! unimplemented! " +
      "unreachable! vec! write! writeln! macro_rules! assert_ne! debug_assert_ne!";
    return {
      aliases: ["rs"],
      keywords: {
        keyword: KEYWORDS,
        literal: "true false Some None Ok Err",
        built_in: BUILTINS
      },
      lexemes: hljs.IDENT_RE + "!?",
      illegal: "</",
      contains: [
        hljs.C_LINE_COMMENT_MODE,
        hljs.COMMENT("/\\*", "\\*/", { contains: ["self"] }),
        hljs.inherit(hljs.QUOTE_STRING_MODE, { begin: /b?"/, illegal: null }),
        {
          className: "string",
          variants: [
            { begin: /r(#*)"(.|\n)*?"\1(?!#)/ },
            { begin: /b?'\\?(x\w{2}|u\w{4}|U\w{8}|.)'/ }
          ]
        },
        {
          className: "symbol",
          begin: /'[a-zA-Z_][a-zA-Z0-9_]*/
        },
        {
          className: "number",
          variants: [
            { begin: "\\b0b([01_]+)" + NUM_SUFFIX },
            { begin: "\\b0o([0-7_]+)" + NUM_SUFFIX },
            { begin: "\\b0x([A-Fa-f0-9_]+)" + NUM_SUFFIX },
            {
              begin:
                "\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)" + NUM_SUFFIX
            }
          ],
          relevance: 0
        },
        {
          className: "function",
          beginKeywords: "fn",
          end: "(\\(|<)",
          excludeEnd: true,
          contains: [hljs.UNDERSCORE_TITLE_MODE]
        },
        {
          className: "meta",
          begin: "#\\!?\\[",
          end: "\\]",
          contains: [
            {
              className: "meta-string",
              begin: /"/,
              end: /"/
            }
          ]
        },
        {
          className: "class",
          beginKeywords: "type",
          end: ";",
          contains: [
            hljs.inherit(hljs.UNDERSCORE_TITLE_MODE, { endsParent: true })
          ],
          illegal: "\\S"
        },
        {
          className: "class",
          beginKeywords: "trait enum struct union",
          end: "{",
          contains: [
            hljs.inherit(hljs.UNDERSCORE_TITLE_MODE, { endsParent: true })
          ],
          illegal: "[\\w\\d]"
        },
        {
          begin: hljs.IDENT_RE + "::",
          keywords: { built_in: BUILTINS }
        },
        {
          begin: "->"
        }
      ]
    };
  });

  hljs.registerLanguage("scala", function(hljs) {
    var ANNOTATION = { className: "meta", begin: "@[A-Za-z]+" };

    // used in strings for escaping/interpolation/substitution
    var SUBST = {
      className: "subst",
      variants: [{ begin: "\\$[A-Za-z0-9_]+" }, { begin: "\\${", end: "}" }]
    };

    var STRING = {
      className: "string",
      variants: [
        {
          begin: '"',
          end: '"',
          illegal: "\\n",
          contains: [hljs.BACKSLASH_ESCAPE]
        },
        {
          begin: '"""',
          end: '"""',
          relevance: 10
        },
        {
          begin: '[a-z]+"',
          end: '"',
          illegal: "\\n",
          contains: [hljs.BACKSLASH_ESCAPE, SUBST]
        },
        {
          className: "string",
          begin: '[a-z]+"""',
          end: '"""',
          contains: [SUBST],
          relevance: 10
        }
      ]
    };

    var SYMBOL = {
      className: "symbol",
      begin: "'\\w[\\w\\d_]*(?!')"
    };

    var TYPE = {
      className: "type",
      begin: "\\b[A-Z][A-Za-z0-9_]*",
      relevance: 0
    };

    var NAME = {
      className: "title",
      begin: /[^0-9\n\t "'(),.`{}\[\]:;][^\n\t "'(),.`{}\[\]:;]+|[^0-9\n\t "'(),.`{}\[\]:;=]/,
      relevance: 0
    };

    var CLASS = {
      className: "class",
      beginKeywords: "class object trait type",
      end: /[:={\[\n;]/,
      excludeEnd: true,
      contains: [
        {
          beginKeywords: "extends with",
          relevance: 10
        },
        {
          begin: /\[/,
          end: /\]/,
          excludeBegin: true,
          excludeEnd: true,
          relevance: 0,
          contains: [TYPE]
        },
        {
          className: "params",
          begin: /\(/,
          end: /\)/,
          excludeBegin: true,
          excludeEnd: true,
          relevance: 0,
          contains: [TYPE]
        },
        NAME
      ]
    };

    var METHOD = {
      className: "function",
      beginKeywords: "def",
      end: /[:={\[(\n;]/,
      excludeEnd: true,
      contains: [NAME]
    };

    return {
      keywords: {
        literal: "true false null",
        keyword:
          "type yield lazy override def with val var sealed abstract private trait object if forSome for while throw finally protected extends import final return else break new catch super class case package default try this match continue throws implicit"
      },
      contains: [
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        STRING,
        SYMBOL,
        TYPE,
        METHOD,
        CLASS,
        hljs.C_NUMBER_MODE,
        ANNOTATION
      ]
    };
  });

  hljs.registerLanguage("scheme", function(hljs) {
    var SCHEME_IDENT_RE = "[^\\(\\)\\[\\]\\{\\}\",'`;#|\\\\\\s]+";
    var SCHEME_SIMPLE_NUMBER_RE = "(\\-|\\+)?\\d+([./]\\d+)?";
    var SCHEME_COMPLEX_NUMBER_RE =
      SCHEME_SIMPLE_NUMBER_RE + "[+\\-]" + SCHEME_SIMPLE_NUMBER_RE + "i";
    var BUILTINS = {
      "builtin-name":
        "case-lambda call/cc class define-class exit-handler field import " +
        "inherit init-field interface let*-values let-values let/ec mixin " +
        "opt-lambda override protect provide public rename require " +
        "require-for-syntax syntax syntax-case syntax-error unit/sig unless " +
        "when with-syntax and begin call-with-current-continuation " +
        "call-with-input-file call-with-output-file case cond define " +
        "define-syntax delay do dynamic-wind else for-each if lambda let let* " +
        "let-syntax letrec letrec-syntax map or syntax-rules ' * + , ,@ - ... / " +
        "; < <= = => > >= ` abs acos angle append apply asin assoc assq assv atan " +
        "boolean? caar cadr call-with-input-file call-with-output-file " +
        "call-with-values car cdddar cddddr cdr ceiling char->integer " +
        "char-alphabetic? char-ci<=? char-ci<? char-ci=? char-ci>=? char-ci>? " +
        "char-downcase char-lower-case? char-numeric? char-ready? char-upcase " +
        "char-upper-case? char-whitespace? char<=? char<? char=? char>=? char>? " +
        "char? close-input-port close-output-port complex? cons cos " +
        "current-input-port current-output-port denominator display eof-object? " +
        "eq? equal? eqv? eval even? exact->inexact exact? exp expt floor " +
        "force gcd imag-part inexact->exact inexact? input-port? integer->char " +
        "integer? interaction-environment lcm length list list->string " +
        "list->vector list-ref list-tail list? load log magnitude make-polar " +
        "make-rectangular make-string make-vector max member memq memv min " +
        "modulo negative? newline not null-environment null? number->string " +
        "number? numerator odd? open-input-file open-output-file output-port? " +
        "pair? peek-char port? positive? procedure? quasiquote quote quotient " +
        "rational? rationalize read read-char real-part real? remainder reverse " +
        "round scheme-report-environment set! set-car! set-cdr! sin sqrt string " +
        "string->list string->number string->symbol string-append string-ci<=? " +
        "string-ci<? string-ci=? string-ci>=? string-ci>? string-copy " +
        "string-fill! string-length string-ref string-set! string<=? string<? " +
        "string=? string>=? string>? string? substring symbol->string symbol? " +
        "tan transcript-off transcript-on truncate values vector " +
        "vector->list vector-fill! vector-length vector-ref vector-set! " +
        "with-input-from-file with-output-to-file write write-char zero?"
    };

    var SHEBANG = {
      className: "meta",
      begin: "^#!",
      end: "$"
    };

    var LITERAL = {
      className: "literal",
      begin: "(#t|#f|#\\\\" + SCHEME_IDENT_RE + "|#\\\\.)"
    };

    var NUMBER = {
      className: "number",
      variants: [
        { begin: SCHEME_SIMPLE_NUMBER_RE, relevance: 0 },
        { begin: SCHEME_COMPLEX_NUMBER_RE, relevance: 0 },
        { begin: "#b[0-1]+(/[0-1]+)?" },
        { begin: "#o[0-7]+(/[0-7]+)?" },
        { begin: "#x[0-9a-f]+(/[0-9a-f]+)?" }
      ]
    };

    var STRING = hljs.QUOTE_STRING_MODE;

    var REGULAR_EXPRESSION = {
      className: "regexp",
      begin: '#[pr]x"',
      end: '[^\\\\]"'
    };

    var COMMENT_MODES = [
      hljs.COMMENT(";", "$", {
        relevance: 0
      }),
      hljs.COMMENT("#\\|", "\\|#")
    ];

    var IDENT = {
      begin: SCHEME_IDENT_RE,
      relevance: 0
    };

    var QUOTED_IDENT = {
      className: "symbol",
      begin: "'" + SCHEME_IDENT_RE
    };

    var BODY = {
      endsWithParent: true,
      relevance: 0
    };

    var QUOTED_LIST = {
      variants: [{ begin: /'/ }, { begin: "`" }],
      contains: [
        {
          begin: "\\(",
          end: "\\)",
          contains: ["self", LITERAL, STRING, NUMBER, IDENT, QUOTED_IDENT]
        }
      ]
    };

    var NAME = {
      className: "name",
      begin: SCHEME_IDENT_RE,
      lexemes: SCHEME_IDENT_RE,
      keywords: BUILTINS
    };

    var LAMBDA = {
      begin: /lambda/,
      endsWithParent: true,
      returnBegin: true,
      contains: [
        NAME,
        {
          begin: /\(/,
          end: /\)/,
          endsParent: true,
          contains: [IDENT]
        }
      ]
    };

    var LIST = {
      variants: [
        { begin: "\\(", end: "\\)" },
        { begin: "\\[", end: "\\]" }
      ],
      contains: [LAMBDA, NAME, BODY]
    };

    BODY.contains = [
      LITERAL,
      NUMBER,
      STRING,
      IDENT,
      QUOTED_IDENT,
      QUOTED_LIST,
      LIST
    ].concat(COMMENT_MODES);

    return {
      illegal: /\S/,
      contains: [
        SHEBANG,
        NUMBER,
        STRING,
        QUOTED_IDENT,
        QUOTED_LIST,
        LIST
      ].concat(COMMENT_MODES)
    };
  });

  hljs.registerLanguage("scss", function(hljs) {
    var IDENT_RE = "[a-zA-Z-][a-zA-Z0-9_-]*";
    var VARIABLE = {
      className: "variable",
      begin: "(\\$" + IDENT_RE + ")\\b"
    };
    var HEXCOLOR = {
      className: "number",
      begin: "#[0-9A-Fa-f]+"
    };
    var DEF_INTERNALS = {
      className: "attribute",
      begin: "[A-Z\\_\\.\\-]+",
      end: ":",
      excludeEnd: true,
      illegal: "[^\\s]",
      starts: {
        endsWithParent: true,
        excludeEnd: true,
        contains: [
          HEXCOLOR,
          hljs.CSS_NUMBER_MODE,
          hljs.QUOTE_STRING_MODE,
          hljs.APOS_STRING_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          {
            className: "meta",
            begin: "!important"
          }
        ]
      }
    };
    return {
      case_insensitive: true,
      illegal: "[=/|']",
      contains: [
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        {
          className: "selector-id",
          begin: "\\#[A-Za-z0-9_-]+",
          relevance: 0
        },
        {
          className: "selector-class",
          begin: "\\.[A-Za-z0-9_-]+",
          relevance: 0
        },
        {
          className: "selector-attr",
          begin: "\\[",
          end: "\\]",
          illegal: "$"
        },
        {
          className: "selector-tag", // begin: IDENT_RE, end: '[,|\\s]'
          begin:
            "\\b(a|abbr|acronym|address|area|article|aside|audio|b|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|frame|frameset|(h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|keygen|label|legend|li|link|map|mark|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|samp|script|section|select|small|span|strike|strong|style|sub|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video)\\b",
          relevance: 0
        },
        {
          begin:
            ":(visited|valid|root|right|required|read-write|read-only|out-range|optional|only-of-type|only-child|nth-of-type|nth-last-of-type|nth-last-child|nth-child|not|link|left|last-of-type|last-child|lang|invalid|indeterminate|in-range|hover|focus|first-of-type|first-line|first-letter|first-child|first|enabled|empty|disabled|default|checked|before|after|active)"
        },
        {
          begin:
            "::(after|before|choices|first-letter|first-line|repeat-index|repeat-item|selection|value)"
        },
        VARIABLE,
        {
          className: "attribute",
          begin:
            "\\b(z-index|word-wrap|word-spacing|word-break|width|widows|white-space|visibility|vertical-align|unicode-bidi|transition-timing-function|transition-property|transition-duration|transition-delay|transition|transform-style|transform-origin|transform|top|text-underline-position|text-transform|text-shadow|text-rendering|text-overflow|text-indent|text-decoration-style|text-decoration-line|text-decoration-color|text-decoration|text-align-last|text-align|tab-size|table-layout|right|resize|quotes|position|pointer-events|perspective-origin|perspective|page-break-inside|page-break-before|page-break-after|padding-top|padding-right|padding-left|padding-bottom|padding|overflow-y|overflow-x|overflow-wrap|overflow|outline-width|outline-style|outline-offset|outline-color|outline|orphans|order|opacity|object-position|object-fit|normal|none|nav-up|nav-right|nav-left|nav-index|nav-down|min-width|min-height|max-width|max-height|mask|marks|margin-top|margin-right|margin-left|margin-bottom|margin|list-style-type|list-style-position|list-style-image|list-style|line-height|letter-spacing|left|justify-content|initial|inherit|ime-mode|image-orientation|image-resolution|image-rendering|icon|hyphens|height|font-weight|font-variant-ligatures|font-variant|font-style|font-stretch|font-size-adjust|font-size|font-language-override|font-kerning|font-feature-settings|font-family|font|float|flex-wrap|flex-shrink|flex-grow|flex-flow|flex-direction|flex-basis|flex|filter|empty-cells|display|direction|cursor|counter-reset|counter-increment|content|column-width|column-span|column-rule-width|column-rule-style|column-rule-color|column-rule|column-gap|column-fill|column-count|columns|color|clip-path|clip|clear|caption-side|break-inside|break-before|break-after|box-sizing|box-shadow|box-decoration-break|bottom|border-width|border-top-width|border-top-style|border-top-right-radius|border-top-left-radius|border-top-color|border-top|border-style|border-spacing|border-right-width|border-right-style|border-right-color|border-right|border-radius|border-left-width|border-left-style|border-left-color|border-left|border-image-width|border-image-source|border-image-slice|border-image-repeat|border-image-outset|border-image|border-color|border-collapse|border-bottom-width|border-bottom-style|border-bottom-right-radius|border-bottom-left-radius|border-bottom-color|border-bottom|border|background-size|background-repeat|background-position|background-origin|background-image|background-color|background-clip|background-attachment|background-blend-mode|background|backface-visibility|auto|animation-timing-function|animation-play-state|animation-name|animation-iteration-count|animation-fill-mode|animation-duration|animation-direction|animation-delay|animation|align-self|align-items|align-content)\\b",
          illegal: "[^\\s]"
        },
        {
          begin:
            "\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b"
        },
        {
          begin: ":",
          end: ";",
          contains: [
            VARIABLE,
            HEXCOLOR,
            hljs.CSS_NUMBER_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.APOS_STRING_MODE,
            {
              className: "meta",
              begin: "!important"
            }
          ]
        },
        {
          begin: "@",
          end: "[{;]",
          keywords:
            "mixin include extend for if else each while charset import debug media page content font-face namespace warn",
          contains: [
            VARIABLE,
            hljs.QUOTE_STRING_MODE,
            hljs.APOS_STRING_MODE,
            HEXCOLOR,
            hljs.CSS_NUMBER_MODE,
            {
              begin: "\\s[A-Za-z0-9_.-]+",
              relevance: 0
            }
          ]
        }
      ]
    };
  });

  hljs.registerLanguage("shell", function(hljs) {
    return {
      aliases: ["console"],
      contains: [
        {
          className: "meta",
          begin: "^\\s{0,3}[\\w\\d\\[\\]()@-]*[>%$#]",
          starts: {
            end: "$",
            subLanguage: "bash"
          }
        }
      ]
    };
  });

  hljs.registerLanguage("sql", function(hljs) {
    var COMMENT_MODE = hljs.COMMENT("--", "$");
    return {
      case_insensitive: true,
      illegal: /[<>{}*]/,
      contains: [
        {
          beginKeywords:
            "begin end start commit rollback savepoint lock alter create drop rename call " +
            "delete do handler insert load replace select truncate update set show pragma grant " +
            "merge describe use explain help declare prepare execute deallocate release " +
            "unlock purge reset change stop analyze cache flush optimize repair kill " +
            "install uninstall checksum restore check backup revoke comment values with",
          end: /;/,
          endsWithParent: true,
          lexemes: /[\w\.]+/,
          keywords: {
            keyword:
              "as abort abs absolute acc acce accep accept access accessed accessible account acos action activate add " +
              "addtime admin administer advanced advise aes_decrypt aes_encrypt after agent aggregate ali alia alias " +
              "all allocate allow alter always analyze ancillary and anti any anydata anydataset anyschema anytype apply " +
              "archive archived archivelog are as asc ascii asin assembly assertion associate asynchronous at atan " +
              "atn2 attr attri attrib attribu attribut attribute attributes audit authenticated authentication authid " +
              "authors auto autoallocate autodblink autoextend automatic availability avg backup badfile basicfile " +
              "before begin beginning benchmark between bfile bfile_base big bigfile bin binary_double binary_float " +
              "binlog bit_and bit_count bit_length bit_or bit_xor bitmap blob_base block blocksize body both bound " +
              "bucket buffer_cache buffer_pool build bulk by byte byteordermark bytes cache caching call calling cancel " +
              "capacity cascade cascaded case cast catalog category ceil ceiling chain change changed char_base " +
              "char_length character_length characters characterset charindex charset charsetform charsetid check " +
              "checksum checksum_agg child choose chr chunk class cleanup clear client clob clob_base clone close " +
              "cluster_id cluster_probability cluster_set clustering coalesce coercibility col collate collation " +
              "collect colu colum column column_value columns columns_updated comment commit compact compatibility " +
              "compiled complete composite_limit compound compress compute concat concat_ws concurrent confirm conn " +
              "connec connect connect_by_iscycle connect_by_isleaf connect_by_root connect_time connection " +
              "consider consistent constant constraint constraints constructor container content contents context " +
              "contributors controlfile conv convert convert_tz corr corr_k corr_s corresponding corruption cos cost " +
              "count count_big counted covar_pop covar_samp cpu_per_call cpu_per_session crc32 create creation " +
              "critical cross cube cume_dist curdate current current_date current_time current_timestamp current_user " +
              "cursor curtime customdatum cycle data database databases datafile datafiles datalength date_add " +
              "date_cache date_format date_sub dateadd datediff datefromparts datename datepart datetime2fromparts " +
              "day day_to_second dayname dayofmonth dayofweek dayofyear days db_role_change dbtimezone ddl deallocate " +
              "declare decode decompose decrement decrypt deduplicate def defa defau defaul default defaults " +
              "deferred defi defin define degrees delayed delegate delete delete_all delimited demand dense_rank " +
              "depth dequeue des_decrypt des_encrypt des_key_file desc descr descri describ describe descriptor " +
              "deterministic diagnostics difference dimension direct_load directory disable disable_all " +
              "disallow disassociate discardfile disconnect diskgroup distinct distinctrow distribute distributed div " +
              "do document domain dotnet double downgrade drop dumpfile duplicate duration each edition editionable " +
              "editions element ellipsis else elsif elt empty enable enable_all enclosed encode encoding encrypt " +
              "end end-exec endian enforced engine engines enqueue enterprise entityescaping eomonth error errors " +
              "escaped evalname evaluate event eventdata events except exception exceptions exchange exclude excluding " +
              "execu execut execute exempt exists exit exp expire explain explode export export_set extended extent external " +
              "external_1 external_2 externally extract failed failed_login_attempts failover failure far fast " +
              "feature_set feature_value fetch field fields file file_name_convert filesystem_like_logging final " +
              "finish first first_value fixed flash_cache flashback floor flush following follows for forall force foreign " +
              "form forma format found found_rows freelist freelists freepools fresh from from_base64 from_days " +
              "ftp full function general generated get get_format get_lock getdate getutcdate global global_name " +
              "globally go goto grant grants greatest group group_concat group_id grouping grouping_id groups " +
              "gtid_subtract guarantee guard handler hash hashkeys having hea head headi headin heading heap help hex " +
              "hierarchy high high_priority hosts hour hours http id ident_current ident_incr ident_seed identified " +
              "identity idle_time if ifnull ignore iif ilike ilm immediate import in include including increment " +
              "index indexes indexing indextype indicator indices inet6_aton inet6_ntoa inet_aton inet_ntoa infile " +
              "initial initialized initially initrans inmemory inner innodb input insert install instance instantiable " +
              "instr interface interleaved intersect into invalidate invisible is is_free_lock is_ipv4 is_ipv4_compat " +
              "is_not is_not_null is_used_lock isdate isnull isolation iterate java join json json_exists " +
              "keep keep_duplicates key keys kill language large last last_day last_insert_id last_value lateral lax lcase " +
              "lead leading least leaves left len lenght length less level levels library like like2 like4 likec limit " +
              "lines link list listagg little ln load load_file lob lobs local localtime localtimestamp locate " +
              "locator lock locked log log10 log2 logfile logfiles logging logical logical_reads_per_call " +
              "logoff logon logs long loop low low_priority lower lpad lrtrim ltrim main make_set makedate maketime " +
              "managed management manual map mapping mask master master_pos_wait match matched materialized max " +
              "maxextents maximize maxinstances maxlen maxlogfiles maxloghistory maxlogmembers maxsize maxtrans " +
              "md5 measures median medium member memcompress memory merge microsecond mid migration min minextents " +
              "minimum mining minus minute minutes minvalue missing mod mode model modification modify module monitoring month " +
              "months mount move movement multiset mutex name name_const names nan national native natural nav nchar " +
              "nclob nested never new newline next nextval no no_write_to_binlog noarchivelog noaudit nobadfile " +
              "nocheck nocompress nocopy nocycle nodelay nodiscardfile noentityescaping noguarantee nokeep nologfile " +
              "nomapping nomaxvalue nominimize nominvalue nomonitoring none noneditionable nonschema noorder " +
              "nopr nopro noprom nopromp noprompt norely noresetlogs noreverse normal norowdependencies noschemacheck " +
              "noswitch not nothing notice notnull notrim novalidate now nowait nth_value nullif nulls num numb numbe " +
              "nvarchar nvarchar2 object ocicoll ocidate ocidatetime ociduration ociinterval ociloblocator ocinumber " +
              "ociref ocirefcursor ocirowid ocistring ocitype oct octet_length of off offline offset oid oidindex old " +
              "on online only opaque open operations operator optimal optimize option optionally or oracle oracle_date " +
              "oradata ord ordaudio orddicom orddoc order ordimage ordinality ordvideo organization orlany orlvary " +
              "out outer outfile outline output over overflow overriding package pad parallel parallel_enable " +
              "parameters parent parse partial partition partitions pascal passing password password_grace_time " +
              "password_lock_time password_reuse_max password_reuse_time password_verify_function patch path patindex " +
              "pctincrease pctthreshold pctused pctversion percent percent_rank percentile_cont percentile_disc " +
              "performance period period_add period_diff permanent physical pi pipe pipelined pivot pluggable plugin " +
              "policy position post_transaction pow power pragma prebuilt precedes preceding precision prediction " +
              "prediction_cost prediction_details prediction_probability prediction_set prepare present preserve " +
              "prior priority private private_sga privileges procedural procedure procedure_analyze processlist " +
              "profiles project prompt protection public publishingservername purge quarter query quick quiesce quota " +
              "quotename radians raise rand range rank raw read reads readsize rebuild record records " +
              "recover recovery recursive recycle redo reduced ref reference referenced references referencing refresh " +
              "regexp_like register regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy " +
              "reject rekey relational relative relaylog release release_lock relies_on relocate rely rem remainder rename " +
              "repair repeat replace replicate replication required reset resetlogs resize resource respect restore " +
              "restricted result result_cache resumable resume retention return returning returns reuse reverse revoke " +
              "right rlike role roles rollback rolling rollup round row row_count rowdependencies rowid rownum rows " +
              "rtrim rules safe salt sample save savepoint sb1 sb2 sb4 scan schema schemacheck scn scope scroll " +
              "sdo_georaster sdo_topo_geometry search sec_to_time second seconds section securefile security seed segment select " +
              "self semi sequence sequential serializable server servererror session session_user sessions_per_user set " +
              "sets settings sha sha1 sha2 share shared shared_pool short show shrink shutdown si_averagecolor " +
              "si_colorhistogram si_featurelist si_positionalcolor si_stillimage si_texture siblings sid sign sin " +
              "size size_t sizes skip slave sleep smalldatetimefromparts smallfile snapshot some soname sort soundex " +
              "source space sparse spfile split sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows " +
              "sql_small_result sql_variant_property sqlcode sqldata sqlerror sqlname sqlstate sqrt square standalone " +
              "standby start starting startup statement static statistics stats_binomial_test stats_crosstab " +
              "stats_ks_test stats_mode stats_mw_test stats_one_way_anova stats_t_test_ stats_t_test_indep " +
              "stats_t_test_one stats_t_test_paired stats_wsr_test status std stddev stddev_pop stddev_samp stdev " +
              "stop storage store stored str str_to_date straight_join strcmp strict string struct stuff style subdate " +
              "subpartition subpartitions substitutable substr substring subtime subtring_index subtype success sum " +
              "suspend switch switchoffset switchover sync synchronous synonym sys sys_xmlagg sysasm sysaux sysdate " +
              "sysdatetimeoffset sysdba sysoper system system_user sysutcdatetime table tables tablespace tablesample tan tdo " +
              "template temporary terminated tertiary_weights test than then thread through tier ties time time_format " +
              "time_zone timediff timefromparts timeout timestamp timestampadd timestampdiff timezone_abbr " +
              "timezone_minute timezone_region to to_base64 to_date to_days to_seconds todatetimeoffset trace tracking " +
              "transaction transactional translate translation treat trigger trigger_nestlevel triggers trim truncate " +
              "try_cast try_convert try_parse type ub1 ub2 ub4 ucase unarchived unbounded uncompress " +
              "under undo unhex unicode uniform uninstall union unique unix_timestamp unknown unlimited unlock unnest unpivot " +
              "unrecoverable unsafe unsigned until untrusted unusable unused update updated upgrade upped upper upsert " +
              "url urowid usable usage use use_stored_outlines user user_data user_resources users using utc_date " +
              "utc_timestamp uuid uuid_short validate validate_password_strength validation valist value values var " +
              "var_samp varcharc vari varia variab variabl variable variables variance varp varraw varrawc varray " +
              "verify version versions view virtual visible void wait wallet warning warnings week weekday weekofyear " +
              "wellformed when whene whenev wheneve whenever where while whitespace window with within without work wrapped " +
              "xdb xml xmlagg xmlattributes xmlcast xmlcolattval xmlelement xmlexists xmlforest xmlindex xmlnamespaces " +
              "xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltype xor year year_to_month years yearweek",
            literal: "true false null unknown",
            built_in:
              "array bigint binary bit blob bool boolean char character date dec decimal float int int8 integer interval number " +
              "numeric real record serial serial8 smallint text time timestamp tinyint varchar varying void"
          },
          contains: [
            {
              className: "string",
              begin: "'",
              end: "'",
              contains: [hljs.BACKSLASH_ESCAPE, { begin: "''" }]
            },
            {
              className: "string",
              begin: '"',
              end: '"',
              contains: [hljs.BACKSLASH_ESCAPE, { begin: '""' }]
            },
            {
              className: "string",
              begin: "`",
              end: "`",
              contains: [hljs.BACKSLASH_ESCAPE]
            },
            hljs.C_NUMBER_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            COMMENT_MODE,
            hljs.HASH_COMMENT_MODE
          ]
        },
        hljs.C_BLOCK_COMMENT_MODE,
        COMMENT_MODE,
        hljs.HASH_COMMENT_MODE
      ]
    };
  });

  hljs.registerLanguage("tex", function(hljs) {
    var COMMAND = {
      className: "tag",
      begin: /\\/,
      relevance: 0,
      contains: [
        {
          className: "name",
          variants: [
            { begin: /[a-zA-Zа-яА-я]+[*]?/ },
            { begin: /[^a-zA-Zа-яА-я0-9]/ }
          ],
          starts: {
            endsWithParent: true,
            relevance: 0,
            contains: [
              {
                className: "string", // because it looks like attributes in HTML tags
                variants: [
                  { begin: /\[/, end: /\]/ },
                  { begin: /\{/, end: /\}/ }
                ]
              },
              {
                begin: /\s*=\s*/,
                endsWithParent: true,
                relevance: 0,
                contains: [
                  {
                    className: "number",
                    begin: /-?\d*\.?\d+(pt|pc|mm|cm|in|dd|cc|ex|em)?/
                  }
                ]
              }
            ]
          }
        }
      ]
    };

    return {
      contains: [
        COMMAND,
        {
          className: "formula",
          contains: [COMMAND],
          relevance: 0,
          variants: [
            { begin: /\$\$/, end: /\$\$/ },
            { begin: /\$/, end: /\$/ }
          ]
        },
        hljs.COMMENT("%", "$", {
          relevance: 0
        })
      ]
    };
  });

  hljs.registerLanguage("typescript", function(hljs) {
    var JS_IDENT_RE = "[A-Za-z$_][0-9A-Za-z$_]*";
    var KEYWORDS = {
      keyword:
        "in if for while finally var new function do return void else break catch " +
        "instanceof with throw case default try this switch continue typeof delete " +
        "let yield const class public private protected get set super " +
        "static implements enum export import declare type namespace abstract " +
        "as from extends async await",
      literal: "true false null undefined NaN Infinity",
      built_in:
        "eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent " +
        "encodeURI encodeURIComponent escape unescape Object Function Boolean Error " +
        "EvalError InternalError RangeError ReferenceError StopIteration SyntaxError " +
        "TypeError URIError Number Math Date String RegExp Array Float32Array " +
        "Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array " +
        "Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require " +
        "module console window document any number boolean string void Promise"
    };

    var DECORATOR = {
      className: "meta",
      begin: "@" + JS_IDENT_RE
    };

    var ARGS = {
      begin: "\\(",
      end: /\)/,
      keywords: KEYWORDS,
      contains: [
        "self",
        hljs.QUOTE_STRING_MODE,
        hljs.APOS_STRING_MODE,
        hljs.NUMBER_MODE
      ]
    };

    var PARAMS = {
      className: "params",
      begin: /\(/,
      end: /\)/,
      excludeBegin: true,
      excludeEnd: true,
      keywords: KEYWORDS,
      contains: [
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        DECORATOR,
        ARGS
      ]
    };

    return {
      aliases: ["ts"],
      keywords: KEYWORDS,
      contains: [
        {
          className: "meta",
          begin: /^\s*['"]use strict['"]/
        },
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        {
          // template string
          className: "string",
          begin: "`",
          end: "`",
          contains: [
            hljs.BACKSLASH_ESCAPE,
            {
              className: "subst",
              begin: "\\$\\{",
              end: "\\}"
            }
          ]
        },
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        {
          className: "number",
          variants: [
            { begin: "\\b(0[bB][01]+)" },
            { begin: "\\b(0[oO][0-7]+)" },
            { begin: hljs.C_NUMBER_RE }
          ],
          relevance: 0
        },
        {
          // "value" container
          begin: "(" + hljs.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
          keywords: "return throw case",
          contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            hljs.REGEXP_MODE,
            {
              className: "function",
              begin: "(\\(.*?\\)|" + hljs.IDENT_RE + ")\\s*=>",
              returnBegin: true,
              end: "\\s*=>",
              contains: [
                {
                  className: "params",
                  variants: [
                    {
                      begin: hljs.IDENT_RE
                    },
                    {
                      begin: /\(\s*\)/
                    },
                    {
                      begin: /\(/,
                      end: /\)/,
                      excludeBegin: true,
                      excludeEnd: true,
                      keywords: KEYWORDS,
                      contains: [
                        "self",
                        hljs.C_LINE_COMMENT_MODE,
                        hljs.C_BLOCK_COMMENT_MODE
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          relevance: 0
        },
        {
          className: "function",
          begin: "function",
          end: /[\{;]/,
          excludeEnd: true,
          keywords: KEYWORDS,
          contains: [
            "self",
            hljs.inherit(hljs.TITLE_MODE, { begin: JS_IDENT_RE }),
            PARAMS
          ],
          illegal: /%/,
          relevance: 0 // () => {} is more typical in TypeScript
        },
        {
          beginKeywords: "constructor",
          end: /\{/,
          excludeEnd: true,
          contains: ["self", PARAMS]
        },
        {
          // prevent references like module.id from being higlighted as module definitions
          begin: /module\./,
          keywords: { built_in: "module" },
          relevance: 0
        },
        {
          beginKeywords: "module",
          end: /\{/,
          excludeEnd: true
        },
        {
          beginKeywords: "interface",
          end: /\{/,
          excludeEnd: true,
          keywords: "interface extends"
        },
        {
          begin: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
        },
        {
          begin: "\\." + hljs.IDENT_RE,
          relevance: 0 // hack: prevents detection of keywords after dots
        },
        DECORATOR,
        ARGS
      ]
    };
  });

  hljs.registerLanguage("xtlang", function(hljs) {
    var SCHEME_SIMPLE_NUMBER_RE = "(\\-|\\+|\\.)?\\d+([./]\\d*)?";
    var SCHEME_COMPLEX_NUMBER_RE =
      SCHEME_SIMPLE_NUMBER_RE + "[\\+\\-]" + SCHEME_SIMPLE_NUMBER_RE + "i";

    // valid names for Scheme identifiers(names cannot consist fully
    // of numbers, but this should be good enough for now)
    var VALID_SCHEME_NAME_RE = "[\\w\\!\\$%&\\*\\+,\\/:<=>\\?@\\^~\\|\\-]+";

    // valid characters in xtlang names & types
    var VALID_XTLANG_NAME_RE = "[\\w\\.\\!\\-]+";
    var VALID_XTLANG_TYPE_RE = "[\\w\\[\\]\\{\\}<>,\\*/\\|\\!\\-]+";
    var VALID_XTLANG_TYPE_RE_ =
      ":(i1|i8|i32|i64|double|float|SAMPLE|NoteData|DSP|" +
      "type_of_argument1|type_of_argument2)" +
      "[\\w\\[\\]\\{\\}<>,\\*/\\|\\!\\-]*";

    // Keywords based on
    // https://bitbucket.org/birkenfeld/pygments-main/src/7941677dc77d4f2bf0bbd6140ade85a9454b8b80/
    // pygments/lexers/lisp.py?at=default&fileviewer=file-view-default#lisp.py-2420
    var COMMON_KEYWORDS_RE =
      "(lambda|define|if|else|cond|and|or|" +
      "let|begin|set\\!|map|for\\-each)";
    var SCHEME_KEYWORDS_RE =
      "(do|delay|quasiquote|unquote\\-splicing|" +
      "eval|case|let\\*|letrec|quote)";
    var SCHEME_KEYWORDS_OVERLAP_RE = "unquote";
    var XTLANG_BIND_KEYWORDS_RE =
      "(bind\\-func|bind\\-val|bind\\-type|bind\\-alias|" +
      "bind\\-poly|bind\\-dylib|bind\\-lib\\-func|bind\\-lib\\-val)";
    var XTLANG_BIND_KEYWORDS_OVARLAP_RE = "bind\\-lib";
    var XTLANG_KEYWORDS_RE = "(letz|memzone|cast|convert|dotimes|doloop)";
    var COMMON_FUNCTIONS_RE =
      "(\\*|\\+|-|/|<|<=|=|>|>=|%|abs|acos|" +
      "angle|append|apply|asin|assoc|assq|assv|" +
      "atan|boolean\\?|caaaar|caaadr|caaar|caadar|" +
      "caaddr|caadr|caar|cadaar|cadadr|cadar|" +
      "caddar|cadddr|caddr|cadr|car|cdaaar|" +
      "cdaadr|cdaar|cdadar|cdaddr|cdadr|cdar|" +
      "cddaar|cddadr|cddar|cdddar|cddddr|cdddr|" +
      "cddr|cdr|ceiling|cons|cos|floor|length|" +
      "list|log|max|member|min|modulo|not|" +
      "reverse|round|sin|sqrt|substring|tan|" +
      "println|random|null\\?|callback|now)";
    var COMMON_FUNCTIONS_OVERLAP_RE = "print";
    var SCHEME_FUNCTIONS_RE =
      "(call\\-with\\-current\\-continuation|" +
      "call\\-with\\-input\\-file|call\\-with\\-output\\-file|" +
      "call\\-with\\-values|call/cc|char\\->integer|" +
      "char\\-alphabetic\\?|char\\-ci<=\\?|char\\-ci<\\?|" +
      "char\\-ci=\\?|char\\-ci>=\\?|char\\-ci>\\?|char\\-downcase|" +
      "char\\-lower\\-case\\?|char\\-numeric\\?|char\\-ready\\?|" +
      "char\\-upcase|char\\-upper\\-case\\?|char\\-whitespace\\?|" +
      "char<=\\?|char<\\?|char=\\?|char>=\\?|char>\\?|char\\?|" +
      "close\\-input\\-port|close\\-output\\-port|complex\\?|" +
      "current\\-input\\-port|current\\-output\\-port|denominator|" +
      "display|dynamic\\-wind|eof\\-object\\?|eq\\?|equal\\?|" +
      "eqv\\?|even\\?|exact\\->inexact|exact\\?|expt|" +
      "force|gcd|imag\\-part|inexact\\->exact|inexact\\?|" +
      "input\\-port\\?|integer\\->char|integer\\?|" +
      "interaction\\-environment|lcm|list\\->string|" +
      "list\\->vector|list\\-ref|list\\-tail|list\\?|load|" +
      "magnitude|make\\-polar|make\\-rectangular|make\\-string|" +
      "make\\-vector|memq|memv|negative\\?|newline|" +
      "null\\-environment|number\\->string|number\\?|" +
      "numerator|odd\\?|open\\-input\\-file|open\\-output\\-file|" +
      "output\\-port\\?|pair\\?|peek\\-char|port\\?|positive\\?|" +
      "procedure\\?|quotient|rational\\?|rationalize|" +
      "read\\-char|real\\-part|real\\?|" +
      "remainder|scheme\\-report\\-environment|set\\-car\\!|" +
      "set\\-cdr\\!|string\\->list|string\\->number|" +
      "string\\->symbol|string\\-append|string\\-ci<=\\?|" +
      "string\\-ci<\\?|string\\-ci=\\?|string\\-ci>=\\?|" +
      "string\\-ci>\\?|string\\-copy|string\\-fill\\!|" +
      "string\\-length|string\\-ref|string\\-set\\!|string<=\\?|" +
      "string<\\?|string=\\?|string>=\\?|string>\\?|string\\?|" +
      "symbol\\->string|symbol\\?|transcript\\-off|transcript\\-on|" +
      "truncate|values|vector\\->list|vector\\-fill\\!|" +
      "vector\\-length|vector\\?|" +
      "with\\-input\\-from\\-file|with\\-output\\-to\\-file|write|" +
      "write\\-char|zero\\?)";
    var SCHEME_FUNCTIONS_OVERLAP_RE = "(exp|read|string|vector)";
    var XTLANG_FUNCTIONS_RE =
      "(toString|afill\\!|pfill\\!|tfill\\!|tbind|vfill\\!|" +
      "array\\-fill\\!|pointer\\-fill\\!|tuple\\-fill\\!|" +
      "vector\\-fill\\!|free|~|cset\\!|cref|&|bor|" +
      "ang\\-names|<<|>>|nil|printf|sprintf|null|now|" +
      "pset\\!|pref\\-ptr|vset\\!|vref|aset\\!|aref\\-ptr|" +
      "tset\\!|tref\\-ptr|salloc|halloc|zalloc|alloc|" +
      "schedule|exp|log|sin|cos|tan|asin|acos|atan|" +
      "sqrt|expt|floor|ceiling|truncate|round|" +
      "llvm_printf|push_zone|pop_zone|memzone|callback|" +
      "llvm_sprintf|make\\-array|array\\-set\\!|" +
      "array\\-ref\\-ptr|pointer\\-set\\!|" +
      "pointer\\-ref\\-ptr|stack\\-alloc|heap\\-alloc|zone\\-alloc|" +
      "make\\-tuple|tuple\\-set\\!|tuple\\-ref\\-ptr|" +
      "closure\\-set\\!|closure\\-ref|pdref|impc_null|" +
      "bitcast|void|ifret|ret\\->|clrun\\->|make\\-env\\-zone|" +
      "<>|dtof|ftod|i1tof|i1tod|i1toi8|i1toi32|i1toi64|" +
      "i8tof|i8tod|i8toi1|i8toi32|i8toi64|i32tof|i32tod|i32toi1|" +
      "i32toi8|i32toi64|i64tof|i64tod|i64toi1|" +
      "i64toi8|i64toi32)";
    var XTLANG_FUNCTIONS_OVERLAP_RE =
      "(tuple\\-ref|array\\-ref|aref|tref|pref|pointer\\-ref|" + "make\\-env)";
    var XTLANG_FUNCTIONS_OVERLAP_RE2 = "(tuple|array)";

    var SHEBANG = {
      className: "meta",
      begin: "^#!",
      end: "$"
    };

    var LITERAL = {
      className: "literal",
      begin: "(#t|#f)"
    };

    var XTLANG_TYPE = {
      className: "type",
      lexemes: VALID_XTLANG_TYPE_RE,
      relevance: 10,
      variants: [
        { begin: VALID_XTLANG_TYPE_RE_ },
        {
          // Global variable
          className: "variable",
          begin: "\\*\\w",
          end: "\\*",
          lexemes: VALID_SCHEME_NAME_RE
        },
        {
          begin:
            "(<" +
            VALID_XTLANG_TYPE_RE +
            ">|\\|" +
            VALID_XTLANG_TYPE_RE +
            "\\||/" +
            VALID_XTLANG_TYPE_RE +
            "/|" +
            VALID_XTLANG_TYPE_RE +
            "\\*)\\**"
        }
      ]
    };

    var NUMBER = {
      className: "number",
      variants: [
        { begin: SCHEME_SIMPLE_NUMBER_RE, relevance: 0 },
        { begin: SCHEME_COMPLEX_NUMBER_RE, relevance: 0 },
        { begin: "#b[0-1]+(/[0-1]+)?" },
        { begin: "#o[0-7]+(/[0-7]+)?" },
        { begin: "#x[0-9a-f]+(/[0-9a-f]+)?" }
      ]
    };

    var STRING = {
      className: "string",
      variants: [
        { begin: '"', end: '"' },
        { begin: "(#\\\\" + VALID_SCHEME_NAME_RE + "|#\\\\.)" }
      ],
      contains: [
        {
          className: "doctag",
          begin: "@\\w+",
          lexemes: VALID_XTLANG_NAME_RE
        }
      ]
    };

    var COMMENT = [
      hljs.COMMENT(";", "$", {
        relevance: 0
      }),
      hljs.COMMENT("#\\|", "\\|#")
    ];

    var IDENT = {
      className: "variable",
      begin: VALID_XTLANG_NAME_RE,
      relevance: 0
    };

    var QUOTED_IDENT = {
      className: "symbol",
      begin: "'" + VALID_SCHEME_NAME_RE
    };

    var SPECIAL_OPERATORS = {
      className: "symbol",
      begin: "('|#|`|,@|,|\\.)"
    };

    var QUOTED_LIST = {
      variants: [{ begin: /'/ }, { begin: "`" }],
      contains: [
        {
          begin: "\\(",
          end: "\\)",
          contains: [
            "self",
            LITERAL,
            STRING,
            NUMBER,
            IDENT,
            QUOTED_IDENT,
            SPECIAL_OPERATORS
          ]
        }
      ]
    };

    var COMMON_KEYWORDS = [
      {
        // Example:
        //   "lambdahoge"
        className: "variable",
        begin: COMMON_KEYWORDS_RE + VALID_SCHEME_NAME_RE,
        lexemes: VALID_SCHEME_NAME_RE
      },
      {
        // Example:
        //   "lambda"
        className: "keyword",
        begin: COMMON_KEYWORDS_RE,
        lexemes: VALID_SCHEME_NAME_RE
      }
    ];

    var SCHEME_KEYWORDS = [
      {
        // Example:
        //   "unquote-splicinghoge"
        className: "variable",
        begin: SCHEME_KEYWORDS_RE + VALID_SCHEME_NAME_RE,
        lexemes: VALID_SCHEME_NAME_RE
      },
      {
        // Example:
        //   "unquote-splicing"
        className: "keyword",
        begin: SCHEME_KEYWORDS_RE,
        lexemes: VALID_SCHEME_NAME_RE
      },
      {
        // Example:
        //   "unquotehoge"
        className: "variable",
        begin: SCHEME_KEYWORDS_OVERLAP_RE + VALID_SCHEME_NAME_RE,
        lexemes: VALID_SCHEME_NAME_RE
      },
      {
        // Example:
        //   "unquote"
        className: "keyword",
        begin: SCHEME_KEYWORDS_OVERLAP_RE,
        lexemes: VALID_SCHEME_NAME_RE
      }
    ];

    var XTLANG_KEYWORDS = [
      {
        // Example:
        //   "letzhoge"
        className: "variable",
        begin: XTLANG_KEYWORDS_RE + VALID_XTLANG_NAME_RE,
        lexemes: VALID_XTLANG_NAME_RE
      },
      {
        // Example:
        //   "letz"
        className: "keyword",
        begin: XTLANG_KEYWORDS_RE,
        lexemes: VALID_XTLANG_NAME_RE
      }
    ];

    var COMMON_FUNCTIONS = [
      {
        // Example:
        //   "printlnhoge"
        className: "variable",
        begin: COMMON_FUNCTIONS_RE + VALID_SCHEME_NAME_RE,
        lexemes: VALID_SCHEME_NAME_RE
      },
      {
        // Example:
        //   "prinln"
        className: "funciton",
        begin: COMMON_FUNCTIONS_RE,
        lexemes: VALID_SCHEME_NAME_RE
      },
      {
        // Example:
        //   "printhoge"
        className: "variable",
        begin: COMMON_FUNCTIONS_OVERLAP_RE + VALID_SCHEME_NAME_RE,
        lexemes: VALID_SCHEME_NAME_RE
      },
      {
        // Example:
        //   "print"
        className: "funciton",
        begin: COMMON_FUNCTIONS_OVERLAP_RE,
        lexemes: VALID_SCHEME_NAME_RE
      }
    ];

    var SCHEME_FUNCTIONS = [
      {
        // Example:
        //   "read-charhoge"
        className: "variable",
        begin: SCHEME_FUNCTIONS_RE + VALID_SCHEME_NAME_RE,
        lexemes: VALID_SCHEME_NAME_RE
      },
      {
        // Example:
        //   "read-char"
        className: "funciton",
        begin: SCHEME_FUNCTIONS_RE,
        lexemes: VALID_SCHEME_NAME_RE
      },
      {
        // Example:
        //   "readhoge"
        className: "variable",
        begin: SCHEME_FUNCTIONS_OVERLAP_RE + VALID_SCHEME_NAME_RE,
        lexemes: VALID_SCHEME_NAME_RE
      },
      {
        // Example:
        //   "read"
        className: "funciton",
        begin: SCHEME_FUNCTIONS_OVERLAP_RE,
        lexemes: VALID_SCHEME_NAME_RE
      }
    ];

    var XTLANG_FUNCTIONS = [
      {
        // Example:
        //   "tuple-ref-ptrhoge"
        className: "variable",
        begin: XTLANG_FUNCTIONS_RE + VALID_XTLANG_NAME_RE,
        lexemes: VALID_XTLANG_NAME_RE
      },
      {
        // Example:
        //   "tuple-ref-ptr"
        className: "funciton",
        begin: XTLANG_FUNCTIONS_RE,
        lexemes: VALID_XTLANG_NAME_RE
      },
      {
        // Example:
        //  "tuple-refhoge"
        className: "variable",
        begin: XTLANG_FUNCTIONS_OVERLAP_RE + VALID_XTLANG_NAME_RE,
        lexemes: VALID_XTLANG_NAME_RE
      },
      {
        // Example:
        //   "tuple-ref"
        className: "funciton",
        begin: XTLANG_FUNCTIONS_OVERLAP_RE,
        lexemes: VALID_XTLANG_NAME_RE
      },
      {
        // Example:
        //   "tuplehoge"
        className: "variable",
        begin: XTLANG_FUNCTIONS_OVERLAP_RE2 + VALID_XTLANG_NAME_RE,
        lexemes: VALID_XTLANG_NAME_RE
      },
      {
        // Example:
        //   "tuple"
        className: "funciton",
        begin: XTLANG_FUNCTIONS_OVERLAP_RE2,
        lexemes: VALID_XTLANG_NAME_RE
      }
    ];

    var DEFINE = {
      className: "keyword",
      lexemes: VALID_SCHEME_NAME_RE,
      end: "$",
      variants: [
        {
          // Example:
          //   "bind-lib-funchoge"
          className: "variable",
          begin: XTLANG_BIND_KEYWORDS_RE + VALID_XTLANG_NAME_RE
        },
        {
          // Example:
          //   "bind-lib-func"
          begin: XTLANG_BIND_KEYWORDS_RE,
          relevance: 10
        },
        {
          // Example:
          //   "bind-libhoge"
          className: "variable",
          begin: XTLANG_BIND_KEYWORDS_OVARLAP_RE + VALID_XTLANG_NAME_RE
        },
        {
          // Example:
          //   "bind-lib"
          begin: XTLANG_BIND_KEYWORDS_OVARLAP_RE,
          relevance: 10
        },
        {
          // Example:
          //   "definehoge"
          className: "variable",
          begin: "define" + VALID_XTLANG_NAME_RE
        },
        {
          // Example:
          //   "define"
          begin: "define"
        }
      ],
      contains: [
        {
          // for file path(string)
          // Example:
          //   (bind-dylib "kiss_fft.dylib")
          className: "string",
          begin: '"',
          end: '"',
          endsParent: true
        },
        hljs.inherit(hljs.TITLE_MODE, {
          begin: VALID_SCHEME_NAME_RE,
          endsParent: true
        })
      ]
    };

    var XTLANG = {
      lexemes: VALID_SCHEME_NAME_RE,
      endsParent: true,
      variants: [].concat(XTLANG_KEYWORDS, XTLANG_FUNCTIONS)
    };

    var SCHEME = {
      lexemes: VALID_SCHEME_NAME_RE,
      endsParent: true,
      variants: [].concat(SCHEME_KEYWORDS, SCHEME_FUNCTIONS)
    };

    var COMMON = {
      endsParent: true
    };

    var LIST = {
      variants: [
        { begin: "\\(", end: "\\)" },
        { begin: "\\[", end: "\\]" }
      ],
      contains: [DEFINE, XTLANG, SCHEME, COMMON]
    };

    COMMON.contains = [
      LITERAL,
      NUMBER,
      XTLANG_TYPE,
      STRING,
      QUOTED_IDENT,
      SPECIAL_OPERATORS,
      QUOTED_LIST
    ].concat(COMMON_KEYWORDS, COMMON_FUNCTIONS);
    COMMON.contains.push(IDENT, LIST);
    COMMON.contains.concat(COMMENT);

    return {
      aliases: ["xtm"],
      illegal: /\S/,
      contains: [
        SHEBANG,
        NUMBER,
        XTLANG_TYPE,
        STRING,
        QUOTED_IDENT,
        SPECIAL_OPERATORS,
        QUOTED_LIST,
        IDENT,
        LIST
      ].concat(COMMENT)
    };
  });

  hljs.registerLanguage("yaml", function(hljs) {
    var LITERALS = "true false yes no null";

    var keyPrefix = "^[ \\-]*";
    var keyName = "[a-zA-Z_][\\w\\-]*";
    var KEY = {
      className: "attr",
      variants: [
        { begin: keyPrefix + keyName + ":" },
        { begin: keyPrefix + '"' + keyName + '"' + ":" },
        { begin: keyPrefix + "'" + keyName + "'" + ":" }
      ]
    };

    var TEMPLATE_VARIABLES = {
      className: "template-variable",
      variants: [
        { begin: "{{", end: "}}" }, // jinja templates Ansible
        { begin: "%{", end: "}" } // Ruby i18n
      ]
    };
    var STRING = {
      className: "string",
      relevance: 0,
      variants: [
        { begin: /'/, end: /'/ },
        { begin: /"/, end: /"/ },
        { begin: /\S+/ }
      ],
      contains: [hljs.BACKSLASH_ESCAPE, TEMPLATE_VARIABLES]
    };

    return {
      case_insensitive: true,
      aliases: ["yml", "YAML", "yaml"],
      contains: [
        KEY,
        {
          className: "meta",
          begin: "^---s*$",
          relevance: 10
        },
        {
          // multi line string
          className: "string",
          begin: "[\\|>] *$",
          returnEnd: true,
          contains: STRING.contains,
          // very simple termination: next hash key
          end: KEY.variants[0].begin
        },
        {
          // Ruby/Rails erb
          begin: "<%[%=-]?",
          end: "[%-]?%>",
          subLanguage: "ruby",
          excludeBegin: true,
          excludeEnd: true,
          relevance: 0
        },
        {
          // local tags
          className: "type",
          begin: "!" + hljs.UNDERSCORE_IDENT_RE
        },
        {
          // data type
          className: "type",
          begin: "!!" + hljs.UNDERSCORE_IDENT_RE
        },
        {
          // fragment id &ref
          className: "meta",
          begin: "&" + hljs.UNDERSCORE_IDENT_RE + "$"
        },
        {
          // fragment reference *ref
          className: "meta",
          begin: "\\*" + hljs.UNDERSCORE_IDENT_RE + "$"
        },
        {
          // array listing
          className: "bullet",
          begin: "^ *-",
          relevance: 0
        },
        hljs.HASH_COMMENT_MODE,
        {
          beginKeywords: LITERALS,
          keywords: { literal: LITERALS }
        },
        hljs.C_NUMBER_MODE,
        STRING
      ]
    };
  });

  return hljs;
});
