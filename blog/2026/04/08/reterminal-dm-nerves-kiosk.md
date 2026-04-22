---
title: "Getting a reTerminal DM running as a Nerves kiosk in 2026"
description: "A guide to running Elixir/Nerves on Seeed's reTerminal DM with its custom DSI
  display, capacitive touchscreen, and a Cog/WPE browser kiosk---including the workarounds
  you'll need for touch input."
tags:
  - dev
image: /assets/images/posts/reterminal-dm-nerves-kiosk.svg
---

The [Neon Perceptron](https://github.com/ANUcybernetics/neon-perceptron) is a
physical neural network I'm building with my colleague Brendan Traw---a modern
take on [Rosenblatt's Perceptron](https://en.wikipedia.org/wiki/Perceptron)
where every wire is a flexible LED that lights up with its activation. I wrote
about the [interactive digital twin](/blog/2025/12/11/neon-perceptron-digital-twin/)
a few months back.

The brain of the thing is a [Seeed reTerminal
DM](https://www.seeedstudio.com/reTerminal-DM-p-5616.html)---essentially a
Raspberry Pi Compute Module 4 in an industrial enclosure with a 10.1" capacitive
touchscreen, GPIO, and CAN bus. It runs
[Nerves](https://github.com/nerves-project/nerves) (Elixir's embedded Linux
framework) with a Phoenix LiveView UI displayed in a fullscreen kiosk browser.

Getting all of this working with a current stack took more yak-shaving than
I'd hoped. Here's what I learned, so you don't have to.

## The display problem

The reTerminal DM's 800×1280 DSI display uses an ILI9881D panel controller with
a Goodix GT9271 capacitive touchscreen. Neither of these are in the mainline
Linux kernel's driver set---the panel's compatible string (`gjx,gjx101c7`)
doesn't match the upstream `panel-ilitek-ili9881c` driver, so if you boot a
stock Nerves system the DRM pipeline never initialises and the screen stays
black.

I initially tried
[kiosk_system_rpi4](https://hex.pm/packages/kiosk_system_rpi4)---a maintained
Nerves system with Cog/WPE built in---but hit this wall immediately. The
ElixirForum thread on
[browser kiosks in Nerves](https://elixirforum.com/t/browser-in-nerves-kiosk-mode/43250)
was invaluable here, as was the
[bringing up cool hardware with Nerves](https://elixirforum.com/t/bringing-up-cool-hardware-with-nerves/64566)
thread where others had got the reTerminal working. The solution was to fork
[formrausch/frio_rpi4](https://github.com/formrausch/frio_rpi4), a Nerves system
that includes the custom `panel-ili9881d.c` kernel module and device tree
overlays for the reTerminal DM hardware. Our fork is at
[ANUcybernetics/reterminal_dm](https://github.com/ANUcybernetics/reterminal_dm).

The frio_rpi4 system was on an older `nerves_system_br` (1.28.3) and OTP 27, so
I updated it to nerves_system_br 1.33.4 and OTP 28. This also meant rewriting
the firmware update config (`fwup.conf`) to use the RPi4's modern tryboot A/B
partition scheme[^fwup-ops], which gives you automatic rollback if a firmware
update fails to boot.

[^fwup-ops]:
    One thing that caught me out: `fwup-ops.conf` must stay in sync with
    `fwup.conf`. They define the same partition layout from different
    perspectives, and `fwup-ops.conf` gets compiled into `ops.fw` and baked into
    the system image. If they diverge, `Nerves.Runtime.validate_firmware()` can't
    detect the active slot. The failure mode is insidious: the upload succeeds,
    the device reboots, the new firmware runs---but validation silently targets
    the wrong slot, so the _next_ reboot rolls back to the old firmware. You end
    up staring at logs wondering why your changes keep disappearing. And since
    `ops.fw` is baked into the system image, you can't fix it via OTA---you need
    a full system rebuild and reflash.

## Booting and the kiosk stack

The DSI display requires a specific initialisation dance in
`Application.start/2`, before the compositor launches:

```elixir
defp prepare_hardware do
  # start udevd so the touchscreen gets enumerated
  System.cmd("udevd", ["--daemon"])
  System.cmd("udevadm", ["trigger"])
  System.cmd("udevadm", ["settle"])

  # reload the vc4 DRM driver---the DSI panel needs this
  System.cmd("modprobe", ["-r", "vc4"])
  Process.sleep(500)
  System.cmd("modprobe", ["vc4"])
  Process.sleep(1000)

  # suppress kernel messages on the display
  :os.cmd(~c"dmesg -n 1")

  # re-enumerate after vc4 reload
  System.cmd("udevadm", ["trigger"])
  System.cmd("udevadm", ["settle"])
end
```

Skip any of these steps and you'll get either a black screen, no touchscreen, or
kernel log spam over your UI. The vc4 reload is the key bit---without it the DRM
device doesn't fully initialise for the DSI panel. Credit to the
[frio_rpi4 README](https://github.com/formrausch/frio_rpi4) for documenting
this workaround.

After `prepare_hardware`, a supervision tree starts:

1. **seatd** (seat daemon)---manages access to input and DRM devices
2. **Weston** (Wayland compositor)---runs in kiosk-shell mode, no panel, no
   cursor. Make sure you _don't_ pass `--continue-without-input`---despite the
   name, it doesn't just mean "start even if no input devices are found." It
   skips input device enumeration entirely, so Weston never discovers the
   touchscreen.
3. **Cog** (minimal WPE WebKit browser)---connects to Weston via `--platform=wl`
   and loads `http://localhost:4000/ui`

All three are managed as
[MuonTrap](https://hex.pm/packages/muontrap) daemons under a
`rest_for_one` supervisor, so if Weston crashes, Cog gets restarted too.

I'd previously done [scripted RPi kiosk setups](/blog/2025/07/16/automated-rpi-web-kiosk-setup-in-2025/)
with Raspberry Pi OS and labwc, but Nerves gives you something qualitatively
different: the entire system---OS, compositor, browser, application---is a single
firmware image that you build with `mix firmware` and deploy over the air with
`mix upload nerves.local`. No SD cards, no apt-get, no configuration drift.

## The touch problem

This is the frustrating part. The Goodix touchscreen works fine at
the kernel level---`/dev/input/event0` delivers events, Weston picks them up via
libinput and associates them with the DSI-1 output. But
[Cog](https://github.com/Igalia/cog) 0.18.5 / WPE WebKit 2.48.3 simply does
not forward those touch events to the browser. No `pointerdown`, no
`touchstart`, no `click`---nothing reaches the DOM.

This is a [known category of issues](https://github.com/Igalia/cog/issues/213)
in Cog. The Wayland platform backend's touch handling has had multiple bugs
(multitouch broken, long-press not working, fd leaks), and while there have been
patches, the fundamental `wl_touch` forwarding doesn't work reliably on this
hardware.

I investigated several alternatives:

- **Cog's DRM platform** (`--platform=drm`) bypasses Weston and uses libinput
  directly, which should fix touch. But the current system doesn't compile Cog
  with DRM platform support---it SIGABRTs on launch. Adding
  `BR2_PACKAGE_COG_PLATFORM_DRM=y` to the Buildroot defconfig and rebuilding
  would likely work, but I haven't done that yet.

- **webengine_kiosk** (Qt WebEngine for Nerves) manages input directly from
  `/dev/input`, bypassing Wayland entirely. But it's been
  [archived since 2021](https://github.com/nerves-web-kiosk/webengine_kiosk) and
  targets Qt5; the current Buildroot ships Qt6.

- The **virtualinput fix** from
  [meta-wpe#224](https://github.com/WebPlatformForEmbedded/meta-wpe/issues/224)
  only applies to `wpebackend-rdk`, not the standard Cog Wayland platform.

## The workaround: server-side touch with synthetic events

Rather than rebuild the system image (again), I went server-side. The pipeline
is:

```
Goodix touchscreen
  → /dev/input/event0 (kernel evdev)
  → InputEvent library (Elixir, poll-based)
  → Touch GenServer (processes raw events, broadcasts via PubSub)
  → LiveView subscribes, calls push_event/3
  → JS hook dispatches synthetic PointerEvents on the correct DOM element
```

The `Touch` GenServer reads raw evdev events---`abs_mt_position_x`,
`abs_mt_position_y`, `btn_touch`, `syn_report`---and broadcasts
`{:touch, :down | :move | :up, {x, y}}` tuples via Phoenix PubSub. The LiveView
forwards these to the browser with `push_event`, and a colocated JS hook
dispatches real `PointerEvent` objects:

```javascript
dispatchSyntheticPointer(type, x, y) {
  const target = document.elementFromPoint(x, y) || document.body;
  target.dispatchEvent(new PointerEvent(pointerType, {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
    pointerId: 1,
    pointerType: "touch",
    isPrimary: true,
  }));
}
```

From the browser's perspective, these look like native touch events. Any JS
library or CSS `:active` state that listens for pointer events will work. The
round-trip latency through the server is negligible on localhost---the whole
thing runs on the same device.

## Other things that'll bite you

Watch out for NIF cross-compilation. If you're using NIFs on Nerves, make
sure they actually cross-compile for your target. I had
[NxEigen](https://hex.pm/packages/nx_eigen) in my deps, and `cc_precompiler`
silently skipped building the NIF for `aarch64-nerves-linux-gnu` because no
prebuilt binary existed. The firmware built fine, but the app crash-looped on
boot because `libnx_eigen.so` was missing. I ended up dropping it in favour of
`Nx.BinaryBackend` on the target[^exla].

[^exla]:
    On the host I use EXLA for GPU-accelerated training. On the target, inference
    on small models is fast enough with the default backend.

Partition scheme migration is another trap. If your device was originally
flashed with one partition layout (e.g. `kiosk_system_rpi4`'s tryboot scheme)
and you try to OTA a firmware image built for a different layout (e.g.
frio_rpi4's older MBR-swap scheme), the upload will appear to succeed but
write to the wrong partitions. The fix is a full reflash via rpiboot. This
only bites you once, during the initial migration, but it's confusing when it
happens.

And one hardware-specific gotcha: the reTerminal DM is eMMC-only. It has no
SD card slot---it boots exclusively from 32GB eMMC. For the initial flash, you need to toggle the boot switch next
to the USB-C port, connect to a Linux machine, run
[rpiboot](https://github.com/raspberrypi/usbboot) to expose the eMMC as a block
device, and then `mix firmware.burn`. After that, OTA updates via `mix upload`
work fine---the A/B partition scheme means you can't brick the device
remotely[^brick].

[^brick]:
    Well, you _could_ if you deliberately wrote broken firmware to both slots.
    But normal OTA updates only touch the inactive slot, so a bad firmware just
    reverts on next boot.

## Summing up

If you're trying to get a reTerminal DM running with a modern Nerves stack,
here's what you need:

1. A **custom Nerves system** with the ILI9881D panel driver and reTerminal DM
   device tree overlays---stock systems won't drive the display. Start from
   [frio_rpi4](https://github.com/formrausch/frio_rpi4) or use
   [our fork](https://github.com/ANUcybernetics/reterminal_dm) directly.

2. A **vc4 driver reload** in your application startup, before the compositor
   launches.

3. **Server-side touch input** via the `input_event` library, because Cog/WPE's
   Wayland touch forwarding is broken. Dispatch synthetic `PointerEvent`s from a
   LiveView hook and everything just works.

4. **rpiboot** for the initial eMMC flash, then OTA from there.

The source is at
[ANUcybernetics/neon-perceptron](https://github.com/ANUcybernetics/neon-perceptron).

Next up: the Neon Perceptron's output layer uses multiple Nerves devices driving
seven-segment displays, so I need to get BEAM clustering working across a few
CM4s on a local network. The nice thing about Nerves is that distributed Erlang
is just... there. `libcluster` with gossip discovery, a gigabit switch, and
suddenly `GenServer.call` works across devices. But that's a post for another
day.
