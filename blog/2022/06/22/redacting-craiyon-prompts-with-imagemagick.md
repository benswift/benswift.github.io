---
title: "Redacting craiyon prompts with imagemagick"
tags:
  - dev
  - ai
---

# Redacting craiyon prompts with imagemagick




I've been messing around with [craiyon](https://www.craiyon.com) (formerly
[DALL-E mini](https://huggingface.co/spaces/dalle-mini/dalle-mini)), because who
_hasn't_ been doing that recently.

As part of a workshop I'm running soon at the [School of
Cybernetics](https://cybernetics.anu.edu.au) I need to provide "redacted"
versions of the classic 3x3 craiyon output image---and I need to do it for quite
a few outputs.

Because it's tedious to do that by hand, here's what I came up with:

1. input a prompt and generate the craiyon output as normal

2. use the _📷 Screenshot_ button to get a nice, clean screenshot

3. run this [imagemagick](https://imagemagick.org) command (in my case the
   downloaded screenshot name was `craiyon_2022-6-22_17-21-5.png`, yours will be
   similar but with a different timestamp at the end)

   ```sh
   convert craiyon_2022-6-22_17-21-5.png -fill red -draw 'rectangle 30, 240, 1320, 320' -fill white -pointsize 50 -gravity north -annotate +0+250 'REDACTED' craiyon_2022-6-22_17-21-5-redacted.png
   ```
  
4. (bonus round) if you want to loop over a bunch of files and do it in batch, I
   did that in Emacs with:
   ```lisp
   (--each
       (f-entries "." (lambda (s) (s-ends-with? "png" s)))
     (shell-command (format "convert %s -fill red -draw 'rectangle 30, 240, 1320, 320' -fill white -pointsize 50 -gravity north -annotate +0+250 'REDACTED' redacted-%s.jpg"
                            it
                            (f-base it))))
   ```

## An example

Here's an example screenshot:

![Grid of AI image outputs generated in response to the prompt "redacting the prompt from a DALL-E image output with imagemagick"](/assets/images/posts/craiyon/craiyon_2022-6-22_17-21-5.png)

and the same output, after the redaction command has been run:

![Grid of AI image outputs generated in response to the prompt, which has been redacted](/assets/images/posts/craiyon/redacted-craiyon_2022-6-22_17-21-5.jpg)

If you need to do the same, then hopefully I've saved you a bit of time ☺
