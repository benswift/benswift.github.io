---
title: openconnect setup for institutional VPN access
tags: tools
---

My [institution's](https://www.anu.edu.au) IT policies have recently changed and
port 22 is now blocked from off-campus. That's a real pain if you use ssh to
push/pull from our on-prem GitLab servers (which I need to do _all the time_).

The recommended solution is to come in via a VPN---which is not a terrible idea
in principle. However, the institution's recommended setup requires some janky
GlobalProtect client, which (for me at least) was pretty crashy. As an
alternative, [openconnect](https://www.infradead.org/openconnect/) is just a
`brew install openconnect` away (on macOS, at least), and after a bit of setting
up, it works seamlessly.

If you're in a similar situation, here's a terminal command you can use to
access the campus network via the VPN:

```
sudo openconnect \
  --user=uXXXXXXX \ ## replace with your uid
  --protocol=gp \   ## because it's a GlobalProtect VPN
  https://staff-access.anu.edu.au
```

The above command will prompt for your usual password, which you enter in the
terminal. Since I already have that info in an encrypted file, I have a slightly
modified setup (this is in a script called `vpn.sh`):

```
#!/usr/bin/env zsh

# pull ANU password out of encrypted authinfo file, pipe it to stdin
gpg -q --for-your-eyes-only --no-tty -d ~/.authinfo.gpg | \
    awk '/machine smtp.office365.com login uXXXXXXX@anu.edu.au/ {print $NF}' | \
    # start the VPN
    sudo openconnect --user=uXXXXXXX --protocol=gp --passwd-on-stdin https://staff-access.anu.edu.au
```

Happy VPN-ing.

<div class="hl-para" markdown="1">

**Update September 2022**: I recently had a nasty issue with this where
openconnect didn't shut down cleanly and had left my DNS server IPs pointing to
the wrong place. This meant that DNS resolution didn't work across my whole
computer: websites weren't showing up, git was borked, even ping. What a bummer.

There may be a better fix, but I just deleted the DNS settings (in _System
Preferences > Network > Advanced > DNS_ on macOS) and it all started working
again.

</div>
