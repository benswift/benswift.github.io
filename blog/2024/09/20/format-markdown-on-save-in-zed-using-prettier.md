---
title: "Format Markdown on save in Zed using Prettier"
tags:
  - dev
---

# Format Markdown on save in Zed using Prettier




One thing I've particularly enjoyed since switching to Zed is format-on-save,
which is turned on by default in most programming modes. However, it's not
turned on by default for Markdown files.

Since I like my Markdown files formatted with [Prettier](https://prettier.io),
including the "wrap to 80 cols" `--prose-wrap always` option, I set that command
as an "external" formatter for Markdown files and turned on `format_on_save`.
Here's the config if you want to do the same:

```json
"languages": {
    "Markdown": {
      "format_on_save": "on",
      "formatter": {
        "external": {
          "command": "prettier",
          "arguments": [
            "--prose-wrap",
            "always",
            "--stdin-filepath",
            "{buffer_path}"
          ]
        }
      }
    }
  }
```
