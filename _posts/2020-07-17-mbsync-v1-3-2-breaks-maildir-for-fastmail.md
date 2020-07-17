---
title: mbsync v1.3.2 breaks Maildir for fastmail
tags: tools emacs
---

As part of my ongoing quest to Emacs-all-the-things, I'm a long-time satisfied
user of the [mu](https://www.djcbsoftware.nl/code/mu/) email client. I even
[wrote the latest CI infrastructure setup](https://github.com/djcb/mu/pull/1725)
for the project as a way to give back to Dirk-Jan and the rest of the awesome mu
team.

Anyway, mu doesn't care how you get your email onto your machine (i.e. into your
`~/Maildir`), and so for that task I use
[isync/mbsync](http://isync.sourceforge.net/mbsync.html) to download my mail
(via IMAP) from [fastmail](https://www.fastmail.com/). My fastmail [config
is](https://github.com/benswift/.dotfiles/blob/master/mbsyncrc) if you want to
see how I set it all up.

Everything was working swimmingly, until a recent patch version update to mbsync
(1.3.1 -> 1.3.2) broke things. All of a sudden, I started getting errors like:

    Maildir error: found subfolder 'INBOX/Sent Items', but store 'fastmail-local' does not specify SubFolders style

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
