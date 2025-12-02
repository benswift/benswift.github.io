---
title: "mbsync v1.3.2 breaking change: <code>SubFolders</code> config required"
tags:
  - dev
---

As part of my ongoing quest to Emacs-all-the-things, I'm a long-time satisfied
user of the [mu](https://www.djcbsoftware.nl/code/mu/) email client. I even
[wrote the latest CI infrastructure setup](https://github.com/djcb/mu/pull/1725)
for the project as a way to give back to Dirk-Jan and the rest of the awesome mu
team.

Anyway, mu doesn't care how you get your email onto your machine (i.e. into your
`~/Maildir`), and so for that task I use
[isync/mbsync](https://isync.sourceforge.net/mbsync.html) to download my mail
(via IMAP) from [fastmail](https://www.fastmail.com/). My fastmail [config is
online](https://github.com/benswift/.dotfiles/blob/master/mbsyncrc) if you want
to see how I set it all up.

Everything was working swimmingly, until a recent patch version update to mbsync
(1.3.1 -> 1.3.2) broke things. All of a sudden, I started getting errors saying
_Maildir error: found subfolder 'INBOX/Sent Items', but store 'fastmail-local'
does not specify SubFolders style_

There was no mention of a breaking change relating to `SubFolders` style in the
[v1.3.2 release
notes](https://sourceforge.net/projects/isync/files/isync/1.3.2/), but a look at
the manual with `man mbsync` revealed this info:

- **SubFolders** `Verbatim|Maildir++|Legacy`

  The on-disk folder naming style used for hierarchical mailboxes. This option
  has no effect when `Flatten` is used. Suppose mailboxes with the canonical
  paths `top/sub/subsub` and `INBOX/sub/subsub`, the styles will yield the
  following on-disk paths:

  - _Verbatim_ - `Path/top/sub/subsub` and `Inbox/sub/subsub` (this is the style
    you probably want to use)

  - _Maildir++_ - `Inbox/.top.sub.subsub` and `Inbox/..sub.subsub` (this style
    is compatible with Courier and Dovecot - but note that the mailbox metadata
    format is not compatible). Note that attempts to set Path are rejected in
    this mode.

  - _Legacy_ - `Path/top/.sub/.subsub` and `Inbox/.sub/.subsub` (this is
    mbsync's historical style)

  - _Default_: unset; will error out when sub-folders are encountered

By setting `SubFolders Verbatim` in my `.mbsyncrc` things started working again.
Hooray!

Of course, it might be the case that this was all documented somewhere, or that
I'm just [doing it wrong](https://knowyourmeme.com/memes/youre-doing-it-wrong).
But I hope that this is helpful for anyone who runs into the same issue, because
having your email break is _super_ frustrating; email is such a crucial part of
my (and everyone's) job, so it just needs to work.

### Bonus: pretty mu4e mbsync filter

If you are using the same mu & mbsync combo for email, then you might find the
following elisp snippet handy. It does some cool tricks with the
`mu4e~get-mail-process-filter` so that the "in-progress" output from mu, which
looks like this:

```text
C: 1/1  B: 0/0  M: +0/0 *0/0 #0/0  S: +0/0 *0/0 #0/0
```

gets pretty colours in your `*mu4e-update*` buffer. It's purely cosmetic, but I
care about that stuff, and you (maybe?) should too. Anyway, here's the relevant
elisp to put in your Emacs init file.

```scheme
(defun mu4e-pretty-mbsync-process-filter (proc msg)
  (ignore-errors
    (with-current-buffer (process-buffer proc)
      (let ((inhibit-read-only t))
        (delete-region (point-min) (point-max))
        (insert (car (reverse (split-string msg "\r"))))
        (when (re-search-backward "\\(C:\\).*\\(B:\\).*\\(M:\\).*\\(S:\\)")
          (add-face-text-property
           (match-beginning 1) (match-end 1) 'font-lock-keyword-face)
          (add-face-text-property
           (match-beginning 2) (match-end 2) 'font-lock-function-name-face)
          (add-face-text-property
           (match-beginning 3) (match-end 3) 'font-lock-builtin-face)
          (add-face-text-property
           (match-beginning 4) (match-end 4) 'font-lock-type-face))))))

(advice-add
 'mu4e~get-mail-process-filter
 :override #'mu4e-pretty-mbsync-process-filter)
```
