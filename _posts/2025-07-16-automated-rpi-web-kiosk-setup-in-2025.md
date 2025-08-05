---
title: Automated RPi Web Kiosk Setup in 2025
tags: tools
---

As part of a [recent art installation](https://github.com/anucybernetics/panic)
I've needed to set up lots (well, dozens) of Raspberry 5s to run as fullscreen
Chromium "kiosks" with a pre-set URL (network connected, but with no
keyboard/mouse).

They've all needed slightly different kiosk URLs, and I _hate_ doing this sort
of busy-work by hand. So I've spent longer than I'd like to admit[^time] putting
together a fully scripted burn-and-boot process. My non-negotiables were:

[^time]: I thought it'd take a day, it's taken about a week, on and off :(

- script needs to be fully automated (though it turns out it only works on Linux
  now due to the tools required)
- once the SD card is put into an rpi and plugged in, everything should be
  automatic (join network, install and configure software and OS)
- I need a way to remotely access the rpis once "in the field" (in particular,
  sometimes I need to change their kiosk URL)

I _thought_ that this would be a pretty common thing that others would have
done---rpis are cheap and seem like a good fit for this type of "web browser as
installation display" thing. But I kept running into dead ends.

I finally got it fully working with
[Raspberry Pi OS](https://www.raspberrypi.com/software/) (Bookworm) as the OS
and [labwc](https://github.com/labwc/labwc) as the compositor (which is the
default on RPi OS). To save you the trouble, dear reader, I've packaged it all
up into a script (which works as of the date of this post---July 2025) and put
it [here](https://github.com/ANUcybernetics/panic/tree/main/rpi). From that
folder's `README.md`:

> This directory contains scripts for setting up Raspberry Pi 5 devices as
> browser kiosks that boot directly into fullscreen Chromium displaying a
> specified URL.
>
> The setup process uses:
>
> - **install-sdm.sh** - Installs SDM (SD Card Image Management tool) - one-time
>   setup
> - **pi-setup.sh** - Creates customized Raspberry Pi OS SD cards with kiosk
>   mode
>
> The resulting installation:
>
> - boots directly into GPU-accelerated kiosk mode using labwc Wayland
>   compositor (RPi OS default)
> - automatically joins your Tailscale network
> - supports native display resolutions including 4K at 60Hz
> - configures WiFi (WPA2 and enterprise 802.1X)
> - includes HDMI audio support
> - optimized specifically for Raspberry Pi 5
> - provides a `kiosk-set-url` utility for easy URL changes
> - uses official Raspberry Pi OS Bookworm (64-bit)

I hope this saves you some time. Use it to hug your loved ones.
