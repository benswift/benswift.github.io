---
title: "The great 2025 email yak-shave: O365 + mbsync + mu + neomutt + msmtp"
tags:
  - dev
---

For years I was a happy user of
[mu4e](https://www.djcbsoftware.nl/code/mu/mu4e.html) in Emacs. But then a few
years ago my employer turned off password-based IMAP auth and broke my (Office
365-based) work email, so I had to make alternative email arrangements.

I've recently rebuilt my entire email setup around neomutt (in Zed's built-in
terminal). I always knew that there was _some_ way to do the Office365 OAuth2
dance and hook things back up, so I took the plug and shaved the email yak
again. And here, dear reader, are the results---may you not waste as many hours
messing around as I did.

## The moving parts

The new setup consists of:

- **mbsync** (built from source with SASL support) for IMAP sync with OAuth2
- **cyrus-sasl-xoauth2** mbsync plugin to handle the OAuth dance
- **mu** for fast email search and indexing
- **neomutt** as the email client
- **msmtp** for SMTP sending
- **macOS Keychain** for secure token storage

Each tool does one thing well, which is the Unix way---even if it means more
configuration files to maintain.

## OAuth2: the tricky bit

Getting OAuth2 working with Office365 was the gnarliest part. You need to use
the `mutt_oauth2.py` script with Thunderbird's client ID
(`9e5f94bc-e8a4-4e73-b8be-63364c29d753`) and the devicecode flow, since
localhostauthcode doesn't work with the way my O365 exchange server is set up.

Here's a snippet from my mbsyncrc showing how the OAuth token gets passed:

```
IMAPAccount anu
Host outlook.office365.com
Port 993
AuthMech XOAUTH2
User ben.swift@anu.edu.au
PassCmd "/Users/ben/.dotfiles/mail/mutt_oauth2.py \
  --decryption-pipe 'security find-generic-password -a ben.swift@anu.edu.au -s mutt_oauth2_anu -w' \
  --encryption-pipe '/Users/ben/.dotfiles/mail/keychain-store.sh ben.swift@anu.edu.au mutt_oauth2_anu' \
  /Users/ben/.dotfiles/mail/anu_oauth2_keychain_stub"
```

The `keychain-store.sh` wrapper script ensures tokens are stored securely in
macOS Keychain rather than sitting around in plaintext files. If you're on Linux
you can switch my macOS-specific approach with suitable `pass` or `gpg`
invocations.

::: tip I needed to build mbsync and the cyrus-sasl-xoauth2 plugin from source
with XOAUTH2 support (something I plan to upstream to the homebrew formula when
I get a chance). :::

## Running in Zed

Since I'm a Zed user, I run neomutt in a fullscreen terminal task (same approach
as my [Claude Code setup](/blog/2025/07/23/running-claude-code-within-zed)). Add
this to your tasks.json:

```json
{
  "label": "mutt",
  "command": "neomutt",
  "reveal": "always",
  "use_new_terminal": true,
  "allow_concurrent_runs": false
}
```

I bind this task to a keyboard shortcut, then I'm one key command away from a
fullscreen email client with all the Zed terminal niceties.

## The payoff

Yes, it was a yak-shave. But now I have:

- full control over my email workflow
- lightning-fast search with mu (I tried notmuch, but the mu setup allows me to
  use normal IMAP folders---and that's important because I have to check my
  email from multiple devices)
- OAuth2 working seamlessly with Office365
- everything running in my preferred editor
- the tantalising prospect of replacing _all_ the email parts of my job with a
  series of shell scripts (and claude code invocations)

For the full config files and detailed setup instructions, check out
[my full email config on GitHub](https://github.com/benswift/.dotfiles/tree/main/mail/).
Fair warning: you'll probably need to tweak things for your specific setup, but
that's half the fun.
