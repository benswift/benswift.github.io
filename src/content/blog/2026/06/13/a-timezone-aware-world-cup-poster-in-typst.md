---
title: "A timezone-aware World Cup poster in Typst"
description:
  "A single-page A3 Typst poster of all 104 FIFA World Cup 2026 fixtures that
  converts every kick-off to your own timezone when it compiles."
tags:
  - typst
  - football
---

The [2026 World Cup](https://en.wikipedia.org/wiki/2026_FIFA_World_Cup) kicked
off a couple of days ago, and I wanted a single-page wall planner with all 104
fixtures on it to put on the fridge, with times in AEST. I built one in
[Typst](https://typst.app/), and I'm sharing it here in case it out other fellow
Aussies who want to get up and watch the matches/replays with their kids before
school.

If you just want the poster, here's the
[rendered A3 PDF](/assets/documents/world-cup-2026.pdf) in AEST; grab it and
you're done. The rest is for anyone who wants to retune it to their own
timezone.

The kick-off times live in the file as UTC, and a single line at the top decides
which timezone they render in:

```typst
#let tz = (label: "AEST", offset: 600)   // minutes east of UTC
```

Change the label and the offset, then recompile. Every time on the poster
updates, along with the day each match is filed under and the way the three
columns balance.[^dst] This is painless because Typst has had proper `datetime`
and `duration` types for a while, and
[they do real arithmetic](https://typst.app/docs/reference/foundations/datetime/):

```typst
#let local-of(m) = datetime(
  year: m.y, month: m.mo, day: m.d, hour: m.h, minute: m.mi,
) + duration(minutes: tz.offset)
```

Adding a duration to a datetime hands back a datetime that has already rolled
past midnight. A 9pm kick-off in Vancouver lands on the right day in Sydney,
with no arithmetic from me.

The fixtures come from the public-domain
[openfootball](https://github.com/openfootball/worldcup.json) dataset. The
knockout rounds show bracket slots rather than teams: `2A v 2B`, `W74 v W77`.
The group stage is only two days old as I write this, so nobody yet knows who'll
fill them.

The whole typst file is below. It's about 250 lines, most of it the fixture
list, so I've folded it away.

:::details[The complete world-cup-2026.typ]

```typst
// ============================================================================
//  FIFA World Cup 2026 — full fixture poster (A3)
//  Kick-off times are stored in UTC and converted at COMPILE TIME.
//  To re-generate for another timezone, change `tz` below and recompile:
//      typst compile world-cup-2026.typ world-cup-2026.pdf
//  `offset` is minutes east of UTC (west = negative). DST is your call —
//  pick the offset in force during the tournament (11 Jun – 19 Jul 2026).
// ----------------------------------------------------------------------------
#let tz = (label: "AEST", offset: 600)   // Sydney / Brisbane / Melbourne (no DST in winter)
// #let tz = (label: "AWST",  offset: 480)   // Perth
// #let tz = (label: "ACST",  offset: 570)   // Adelaide / Darwin  (+9:30)
// #let tz = (label: "NZST",  offset: 720)   // New Zealand
// #let tz = (label: "UTC",   offset: 0)
// #let tz = (label: "BST",   offset: 60)    // UK (summer time)
// #let tz = (label: "CEST",  offset: 120)   // Central Europe (summer)
// #let tz = (label: "ET",    offset: -240)  // US Eastern (EDT, host time)
// #let tz = (label: "PT",    offset: -420)  // US Pacific (PDT)
// #let tz = (label: "IST",   offset: 330)   // India (+5:30)
// ============================================================================

#let matches = (
  (y: 2026, mo: 6, d: 11, h: 19, mi: 0, a: "Mexico", b: "South Africa", tag: "A", ko: false),
  (y: 2026, mo: 6, d: 12, h: 2, mi: 0, a: "South Korea", b: "Czech Republic", tag: "A", ko: false),
  (y: 2026, mo: 6, d: 12, h: 19, mi: 0, a: "Canada", b: "Bosnia & Herzegovina", tag: "B", ko: false),
  (y: 2026, mo: 6, d: 13, h: 1, mi: 0, a: "USA", b: "Paraguay", tag: "D", ko: false),
  (y: 2026, mo: 6, d: 13, h: 19, mi: 0, a: "Qatar", b: "Switzerland", tag: "B", ko: false),
  (y: 2026, mo: 6, d: 13, h: 22, mi: 0, a: "Brazil", b: "Morocco", tag: "C", ko: false),
  (y: 2026, mo: 6, d: 14, h: 1, mi: 0, a: "Haiti", b: "Scotland", tag: "C", ko: false),
  (y: 2026, mo: 6, d: 14, h: 4, mi: 0, a: "Australia", b: "Turkey", tag: "D", ko: false),
  (y: 2026, mo: 6, d: 14, h: 17, mi: 0, a: "Germany", b: "Curaçao", tag: "E", ko: false),
  (y: 2026, mo: 6, d: 14, h: 20, mi: 0, a: "Netherlands", b: "Japan", tag: "F", ko: false),
  (y: 2026, mo: 6, d: 14, h: 23, mi: 0, a: "Ivory Coast", b: "Ecuador", tag: "E", ko: false),
  (y: 2026, mo: 6, d: 15, h: 2, mi: 0, a: "Sweden", b: "Tunisia", tag: "F", ko: false),
  (y: 2026, mo: 6, d: 15, h: 16, mi: 0, a: "Spain", b: "Cape Verde", tag: "H", ko: false),
  (y: 2026, mo: 6, d: 15, h: 19, mi: 0, a: "Belgium", b: "Egypt", tag: "G", ko: false),
  (y: 2026, mo: 6, d: 15, h: 22, mi: 0, a: "Saudi Arabia", b: "Uruguay", tag: "H", ko: false),
  (y: 2026, mo: 6, d: 16, h: 1, mi: 0, a: "Iran", b: "New Zealand", tag: "G", ko: false),
  (y: 2026, mo: 6, d: 16, h: 19, mi: 0, a: "France", b: "Senegal", tag: "I", ko: false),
  (y: 2026, mo: 6, d: 16, h: 22, mi: 0, a: "Iraq", b: "Norway", tag: "I", ko: false),
  (y: 2026, mo: 6, d: 17, h: 1, mi: 0, a: "Argentina", b: "Algeria", tag: "J", ko: false),
  (y: 2026, mo: 6, d: 17, h: 4, mi: 0, a: "Austria", b: "Jordan", tag: "J", ko: false),
  (y: 2026, mo: 6, d: 17, h: 17, mi: 0, a: "Portugal", b: "DR Congo", tag: "K", ko: false),
  (y: 2026, mo: 6, d: 17, h: 20, mi: 0, a: "England", b: "Croatia", tag: "L", ko: false),
  (y: 2026, mo: 6, d: 17, h: 23, mi: 0, a: "Ghana", b: "Panama", tag: "L", ko: false),
  (y: 2026, mo: 6, d: 18, h: 2, mi: 0, a: "Uzbekistan", b: "Colombia", tag: "K", ko: false),
  (y: 2026, mo: 6, d: 18, h: 16, mi: 0, a: "Czech Republic", b: "South Africa", tag: "A", ko: false),
  (y: 2026, mo: 6, d: 18, h: 19, mi: 0, a: "Switzerland", b: "Bosnia & Herzegovina", tag: "B", ko: false),
  (y: 2026, mo: 6, d: 18, h: 22, mi: 0, a: "Canada", b: "Qatar", tag: "B", ko: false),
  (y: 2026, mo: 6, d: 19, h: 1, mi: 0, a: "Mexico", b: "South Korea", tag: "A", ko: false),
  (y: 2026, mo: 6, d: 19, h: 19, mi: 0, a: "USA", b: "Australia", tag: "D", ko: false),
  (y: 2026, mo: 6, d: 19, h: 22, mi: 0, a: "Scotland", b: "Morocco", tag: "C", ko: false),
  (y: 2026, mo: 6, d: 20, h: 0, mi: 30, a: "Brazil", b: "Haiti", tag: "C", ko: false),
  (y: 2026, mo: 6, d: 20, h: 3, mi: 0, a: "Turkey", b: "Paraguay", tag: "D", ko: false),
  (y: 2026, mo: 6, d: 20, h: 17, mi: 0, a: "Netherlands", b: "Sweden", tag: "F", ko: false),
  (y: 2026, mo: 6, d: 20, h: 20, mi: 0, a: "Germany", b: "Ivory Coast", tag: "E", ko: false),
  (y: 2026, mo: 6, d: 21, h: 0, mi: 0, a: "Ecuador", b: "Curaçao", tag: "E", ko: false),
  (y: 2026, mo: 6, d: 21, h: 4, mi: 0, a: "Tunisia", b: "Japan", tag: "F", ko: false),
  (y: 2026, mo: 6, d: 21, h: 16, mi: 0, a: "Spain", b: "Saudi Arabia", tag: "H", ko: false),
  (y: 2026, mo: 6, d: 21, h: 19, mi: 0, a: "Belgium", b: "Iran", tag: "G", ko: false),
  (y: 2026, mo: 6, d: 21, h: 22, mi: 0, a: "Uruguay", b: "Cape Verde", tag: "H", ko: false),
  (y: 2026, mo: 6, d: 22, h: 1, mi: 0, a: "New Zealand", b: "Egypt", tag: "G", ko: false),
  (y: 2026, mo: 6, d: 22, h: 17, mi: 0, a: "Argentina", b: "Austria", tag: "J", ko: false),
  (y: 2026, mo: 6, d: 22, h: 21, mi: 0, a: "France", b: "Iraq", tag: "I", ko: false),
  (y: 2026, mo: 6, d: 23, h: 0, mi: 0, a: "Norway", b: "Senegal", tag: "I", ko: false),
  (y: 2026, mo: 6, d: 23, h: 3, mi: 0, a: "Jordan", b: "Algeria", tag: "J", ko: false),
  (y: 2026, mo: 6, d: 23, h: 17, mi: 0, a: "Portugal", b: "Uzbekistan", tag: "K", ko: false),
  (y: 2026, mo: 6, d: 23, h: 20, mi: 0, a: "England", b: "Ghana", tag: "L", ko: false),
  (y: 2026, mo: 6, d: 23, h: 23, mi: 0, a: "Panama", b: "Croatia", tag: "L", ko: false),
  (y: 2026, mo: 6, d: 24, h: 2, mi: 0, a: "Colombia", b: "DR Congo", tag: "K", ko: false),
  (y: 2026, mo: 6, d: 24, h: 19, mi: 0, a: "Switzerland", b: "Canada", tag: "B", ko: false),
  (y: 2026, mo: 6, d: 24, h: 19, mi: 0, a: "Bosnia & Herzegovina", b: "Qatar", tag: "B", ko: false),
  (y: 2026, mo: 6, d: 24, h: 22, mi: 0, a: "Scotland", b: "Brazil", tag: "C", ko: false),
  (y: 2026, mo: 6, d: 24, h: 22, mi: 0, a: "Morocco", b: "Haiti", tag: "C", ko: false),
  (y: 2026, mo: 6, d: 25, h: 1, mi: 0, a: "Czech Republic", b: "Mexico", tag: "A", ko: false),
  (y: 2026, mo: 6, d: 25, h: 1, mi: 0, a: "South Africa", b: "South Korea", tag: "A", ko: false),
  (y: 2026, mo: 6, d: 25, h: 20, mi: 0, a: "Curaçao", b: "Ivory Coast", tag: "E", ko: false),
  (y: 2026, mo: 6, d: 25, h: 20, mi: 0, a: "Ecuador", b: "Germany", tag: "E", ko: false),
  (y: 2026, mo: 6, d: 25, h: 23, mi: 0, a: "Japan", b: "Sweden", tag: "F", ko: false),
  (y: 2026, mo: 6, d: 25, h: 23, mi: 0, a: "Tunisia", b: "Netherlands", tag: "F", ko: false),
  (y: 2026, mo: 6, d: 26, h: 2, mi: 0, a: "Turkey", b: "USA", tag: "D", ko: false),
  (y: 2026, mo: 6, d: 26, h: 2, mi: 0, a: "Paraguay", b: "Australia", tag: "D", ko: false),
  (y: 2026, mo: 6, d: 26, h: 19, mi: 0, a: "Norway", b: "France", tag: "I", ko: false),
  (y: 2026, mo: 6, d: 26, h: 19, mi: 0, a: "Senegal", b: "Iraq", tag: "I", ko: false),
  (y: 2026, mo: 6, d: 27, h: 0, mi: 0, a: "Cape Verde", b: "Saudi Arabia", tag: "H", ko: false),
  (y: 2026, mo: 6, d: 27, h: 0, mi: 0, a: "Uruguay", b: "Spain", tag: "H", ko: false),
  (y: 2026, mo: 6, d: 27, h: 3, mi: 0, a: "Egypt", b: "Iran", tag: "G", ko: false),
  (y: 2026, mo: 6, d: 27, h: 3, mi: 0, a: "New Zealand", b: "Belgium", tag: "G", ko: false),
  (y: 2026, mo: 6, d: 27, h: 21, mi: 0, a: "Panama", b: "England", tag: "L", ko: false),
  (y: 2026, mo: 6, d: 27, h: 21, mi: 0, a: "Croatia", b: "Ghana", tag: "L", ko: false),
  (y: 2026, mo: 6, d: 27, h: 23, mi: 30, a: "Colombia", b: "Portugal", tag: "K", ko: false),
  (y: 2026, mo: 6, d: 27, h: 23, mi: 30, a: "DR Congo", b: "Uzbekistan", tag: "K", ko: false),
  (y: 2026, mo: 6, d: 28, h: 2, mi: 0, a: "Algeria", b: "Austria", tag: "J", ko: false),
  (y: 2026, mo: 6, d: 28, h: 2, mi: 0, a: "Jordan", b: "Argentina", tag: "J", ko: false),
  (y: 2026, mo: 6, d: 28, h: 19, mi: 0, a: "2A", b: "2B", tag: "R32", ko: true),
  (y: 2026, mo: 6, d: 29, h: 17, mi: 0, a: "1C", b: "2F", tag: "R32", ko: true),
  (y: 2026, mo: 6, d: 29, h: 20, mi: 30, a: "1E", b: "3A/B/C/D/F", tag: "R32", ko: true),
  (y: 2026, mo: 6, d: 30, h: 1, mi: 0, a: "1F", b: "2C", tag: "R32", ko: true),
  (y: 2026, mo: 6, d: 30, h: 17, mi: 0, a: "2E", b: "2I", tag: "R32", ko: true),
  (y: 2026, mo: 6, d: 30, h: 21, mi: 0, a: "1I", b: "3C/D/F/G/H", tag: "R32", ko: true),
  (y: 2026, mo: 7, d: 1, h: 1, mi: 0, a: "1A", b: "3C/E/F/H/I", tag: "R32", ko: true),
  (y: 2026, mo: 7, d: 1, h: 16, mi: 0, a: "1L", b: "3E/H/I/J/K", tag: "R32", ko: true),
  (y: 2026, mo: 7, d: 1, h: 20, mi: 0, a: "1G", b: "3A/E/H/I/J", tag: "R32", ko: true),
  (y: 2026, mo: 7, d: 2, h: 0, mi: 0, a: "1D", b: "3B/E/F/I/J", tag: "R32", ko: true),
  (y: 2026, mo: 7, d: 2, h: 19, mi: 0, a: "1H", b: "2J", tag: "R32", ko: true),
  (y: 2026, mo: 7, d: 2, h: 23, mi: 0, a: "2K", b: "2L", tag: "R32", ko: true),
  (y: 2026, mo: 7, d: 3, h: 3, mi: 0, a: "1B", b: "3E/F/G/I/J", tag: "R32", ko: true),
  (y: 2026, mo: 7, d: 3, h: 18, mi: 0, a: "2D", b: "2G", tag: "R32", ko: true),
  (y: 2026, mo: 7, d: 3, h: 22, mi: 0, a: "1J", b: "2H", tag: "R32", ko: true),
  (y: 2026, mo: 7, d: 4, h: 1, mi: 30, a: "1K", b: "3D/E/I/J/L", tag: "R32", ko: true),
  (y: 2026, mo: 7, d: 4, h: 17, mi: 0, a: "W73", b: "W75", tag: "R16", ko: true),
  (y: 2026, mo: 7, d: 4, h: 21, mi: 0, a: "W74", b: "W77", tag: "R16", ko: true),
  (y: 2026, mo: 7, d: 5, h: 20, mi: 0, a: "W76", b: "W78", tag: "R16", ko: true),
  (y: 2026, mo: 7, d: 6, h: 0, mi: 0, a: "W79", b: "W80", tag: "R16", ko: true),
  (y: 2026, mo: 7, d: 6, h: 19, mi: 0, a: "W83", b: "W84", tag: "R16", ko: true),
  (y: 2026, mo: 7, d: 7, h: 0, mi: 0, a: "W81", b: "W82", tag: "R16", ko: true),
  (y: 2026, mo: 7, d: 7, h: 16, mi: 0, a: "W86", b: "W88", tag: "R16", ko: true),
  (y: 2026, mo: 7, d: 7, h: 20, mi: 0, a: "W85", b: "W87", tag: "R16", ko: true),
  (y: 2026, mo: 7, d: 9, h: 20, mi: 0, a: "W89", b: "W90", tag: "QF", ko: true),
  (y: 2026, mo: 7, d: 10, h: 19, mi: 0, a: "W93", b: "W94", tag: "QF", ko: true),
  (y: 2026, mo: 7, d: 11, h: 21, mi: 0, a: "W91", b: "W92", tag: "QF", ko: true),
  (y: 2026, mo: 7, d: 12, h: 1, mi: 0, a: "W95", b: "W96", tag: "QF", ko: true),
  (y: 2026, mo: 7, d: 14, h: 19, mi: 0, a: "W97", b: "W98", tag: "SF", ko: true),
  (y: 2026, mo: 7, d: 15, h: 19, mi: 0, a: "W99", b: "W100", tag: "SF", ko: true),
  (y: 2026, mo: 7, d: 18, h: 21, mi: 0, a: "L101", b: "L102", tag: "3RD", ko: true),
  (y: 2026, mo: 7, d: 19, h: 19, mi: 0, a: "W101", b: "W102", tag: "FINAL", ko: true),
)

#let local-of(m) = datetime(
  year: m.y, month: m.mo, day: m.d, hour: m.h, minute: m.mi, second: 0,
) + duration(minutes: tz.offset)

#let offstr(t) = {
  let s = if t < 0 { "\u{2212}" } else { "+" }
  let a = calc.abs(t); let h = calc.quo(a, 60); let m = calc.rem(a, 60)
  "UTC" + s + str(h) + if m != 0 { ":" + (if m < 10 { "0" } else { "" }) + str(m) } else { "" }
}

// group consecutive matches by their date in the target timezone
#let groups = ()
#let cur = none
#for m in matches {
  let lt = local-of(m)
  let key = lt.display("[year][month][day]")
  if cur == none or cur.key != key {
    if cur != none { groups.push(cur) }
    cur = (
      key: key,
      date: lt.display("[weekday repr:short] [day padding:none] [month repr:short]"),
      items: (),
    )
  }
  cur.items.push((time: lt.display("[hour]:[minute]"), a: m.a, b: m.b, tag: m.tag, ko: m.ko))
}
#if cur != none { groups.push(cur) }

// split the day-groups into three columns of as-equal-height as possible.
// optimal contiguous 3-way partition (minimise the tallest column), so the
// page balances no matter which timezone `tz` reshuffles the dates into.
#let dayweight(g) = 2.2 + g.items.len()
#let weights = groups.map(dayweight)
#let n = weights.len()
#let prefix = (0.0,)
#for w in weights { prefix.push(prefix.last() + w) }
#let best = none
#let besti = 1
#let bestj = 2
#for i in range(1, n - 1) {
  for j in range(i + 1, n) {
    let mx = calc.max(prefix.at(i), prefix.at(j) - prefix.at(i), prefix.at(n) - prefix.at(j))
    if best == none or mx < best { best = mx; besti = i; bestj = j }
  }
}
#let cols = (groups.slice(0, besti), groups.slice(besti, bestj), groups.slice(bestj))

// --------------------------------------------------------------------- palette
#let ink = rgb("#1a1a1a")     // body + heading text
#let brand = rgb("#be2edd")   // brand purple: title rule + knockout tags
#let deep = rgb("#7a1f96")    // deep purple: date headers + group tags
#let mute = rgb("#888888")    // muted grey: subtitle + the "v" separator
#let faint = rgb("#777777")   // footer text
#let hair = rgb("#cccccc")    // footer hairline
#let headbg = rgb("#f3edf6")  // date-header background
#let tagbg = rgb("#ebe7ee")   // group-tag background

// ---------------------------------------------------------------- page + style
#set page(
  paper: "a3",
  margin: (x: 9mm, top: 8mm, bottom: 13mm),
  fill: white,
  footer: align(center, text(size: 7.4pt, fill: faint)[
    #line(length: 100%, stroke: 0.4pt + hair)
    #v(2pt)
    *Key* — #text(fill: deep)[A–L]: group · *1A* winner Grp A · *2A* runner-up Grp A · *3A/B/…* 3rd-place qualifier · *W\#\#* / *L\#\#* winner / loser of match \#\#.
    Times shown in #tz.label (#offstr(tz.offset)). Fixtures: openfootball (public domain).
  ]),
)
#set text(font: "Liberation Sans", size: 10.5pt, fill: ink)
#set par(leading: 0.45em)

#let tagbox(m) = if m.ko {
  box(fill: brand, inset: (x: 3pt, y: 0.6pt), radius: 2pt, outset: (y: 1.3pt))[
    #text(size: 8pt, weight: "bold", fill: white)[#m.tag]
  ]
} else {
  box(fill: tagbg, inset: (x: 3.2pt, y: 0.6pt), radius: 2pt, outset: (y: 1.3pt))[
    #text(size: 8pt, weight: "bold", fill: deep)[#m.tag]
  ]
}

// ----------------------------------------------------------------------- title
#let titleblock = [
  #align(center)[
    #text(size: 31pt, weight: "bold", fill: ink)[FIFA World Cup 2026]
    #v(-7pt)
    #text(size: 13pt, fill: mute)[Canada · Mexico · USA  —  all 104 matches, kick-off times in #text(fill: deep, weight: "bold")[#tz.label]]
  ]
  #v(3pt)
  #line(length: 100%, stroke: 1pt + brand)
]

// --------------------------------------------------------------------- one day
#let render-day(d) = block(breakable: false, width: 100%, below: 0pt, {
  block(width: 100%, fill: headbg, inset: (x: 4pt, y: 2.4pt), radius: 2.5pt)[
    #text(weight: "bold", size: 12pt, fill: deep)[#d.date]
  ]
  v(2.6pt)
  pad(left: 1.5pt, grid(
    columns: (11mm, 1fr, auto),
    row-gutter: 4.6pt,
    column-gutter: 5pt,
    align: (left, left, right + horizon),
    ..d.items.map(m => (
      text(weight: "bold")[#m.time],
      [#m.a #text(fill: mute)[v] #m.b],
      tagbox(m),
    )).flatten()
  ))
})

// ----- body: three balanced columns, each justified to fill the page height --
#block(width: 100%, height: 100%, grid(
  rows: (auto, 1fr),
  row-gutter: 7pt,
  titleblock,
  grid(
    columns: (1fr, 1fr, 1fr),
    column-gutter: 6mm,
    rows: (1fr,),
    ..cols.map(col => col.map(render-day).join(v(1fr))),
  ),
))
```

:::

[^dst]:
    Daylight saving is the one thing you have to get right yourself. Pick the
    offset actually in force during the tournament window, 11 June to 19
    July 2026. For the eastern Australian states that's plain AEST, UTC+10,
    because it's winter down here with no daylight saving to muddle it. For once
    the southern hemisphere draws the easy hand.
