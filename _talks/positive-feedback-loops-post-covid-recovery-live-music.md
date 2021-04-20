---
event: SoCy music festival
title: Positive feedback loops
subtitle: Supporting a post-covid recovery for live music...<br /><em>tech is not the (whole) answer</em>
author: <a href="https://3ainstitute.org">ANU School of Cybernetics</a>
date: "2021-03-28"
permalink: /talks/positive-feedback-loops-panel/
summary: >-
  slides for the "tech is not the (whole) answer" panel session
hidden: true
---

{% include slides/title.html %}

<script src="{% link assets/js/TweenMax.min.js %}"></script>
<script src="{% link assets/js/Winwheel.js %}"></script>
<script src="{% link assets/js/ccc-workshop-wheels.js %}"></script>

{% include slides/ack-country.html %}

{% include qrcode.html showlink=true %}

{% include slides/background-image.html image="images/talks/positive-feedback-loops/jimi-hendrix.jpg" heading="feedback loops" %}

back to the gigs: how does the live music industry get back on its feet?

feedback in complex systems: not inherently +ve or -ve, but can they be tamed?

{% include slides/background-image.html image="images/talks/positive-feedback-loops/girl-from-perth.jpg" heading="School of Cybernetics" %}

finding (and mastering) the feedback loops in cyberphysical systems

---

<style>
.wheelIndicator {
  font-size:2em;
  line-height: 0.7;
  text-align:center;
  display: block;
}

.wheelResult {
  font-size:1.3em;
  background-color: #f5ddfa;
  border-left: 10px solid #be2edd;
  padding: 1em 1em;
  margin: 0;
}
</style>

<p class="wheelResult">

can we <strong><span
class="approachWheel-canvas-result">________</span></strong> the <strong><span
class="areaWheel-canvas-result">________</span></strong> in live music?

</p>

<div style="width:100%; display:flex; justify-content:space-evenly;">
<div><div class="wheelIndicator">⧨</div><div id="approachWheel-canvas"></div></div>
<div><div class="wheelIndicator">⧨</div><div id="areaWheel-canvas"></div></div>
</div>

<script>

document.addEventListener("DOMContentLoaded", function(){

const wheelWidth = Reveal.getConfig().width/6;

let approachWheel = makeWheel(
  [
    "block",
    "unblock",
    "intensify",
    "abate",
    "incentivise",
    "disincentivise",
    "up-tech",
    "down-tech"
  ],
  "approachWheel-canvas",
  wheelWidth,
  (wheel, indicatedSegment) => {
    targetSpans = document.getElementsByClassName(`${wheel.canvasId}-result`);
    for (let e of targetSpans) {
      e.textContent = indicatedSegment.text;
    }
  }
);

let areaWheel = makeWheel(
  [
    "regulation",
    "music",
    "artists",
    "venues",
    "audiences",
    "promotion",
    "logistics"
  ],
  "areaWheel-canvas",
  wheelWidth,
  (wheel, indicatedSegment) => {
    targetSpans = document.getElementsByClassName(`${wheel.canvasId}-result`);
    for (let e of targetSpans) {
      e.textContent = indicatedSegment.text;
    }
  }
);
});
</script>
