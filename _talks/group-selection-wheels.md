---
event: COMP2710 LENS
title: LENS group selection wheels
date: "2020-03-17"
permalink: /talks/lens-groups/
hidden: true
---

# LENS group picker

<script src='{{ "/assets/js/TweenMax.min.js" | relative_url }}' type="text/javascript"></script>
<script src='{{ "/assets/js/Winwheel.js" | relative_url }}' type="text/javascript"></script>
<script src='{{ "/assets/js/ccc-workshop-wheels.js" | relative_url }}' type="text/javascript"></script>

---

<style>
.wheelIndicator {
  font-size:2em;
  text-align:center;
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

<em>group</em>:
<strong><span class="person1-canvas-result">**\_\_\_\_**</span></strong>,
<strong><span class="person2-canvas-result">**\_\_\_\_**</span></strong> and
<strong><span class="person3-canvas-result">**\_\_\_\_**</span></strong>

</p>

<div style="width:100%; display:flex; justify-content:space-between;">
<div class="wheelIndicator">⧨<div id="person1-canvas"></div></div>
<div class="wheelIndicator">⧨<div id="person2-canvas"></div></div>
<div class="wheelIndicator">⧨<div id="person3-canvas"></div></div>
</div>

<script>
let container = document.getElementsByClassName("slides")[0];
let wheelWidth = parseFloat(window.getComputedStyle(container).width)/7;

let person1 = makeWheel(
  [
    "Will",
    "Guffin",
    "Peter",
    "Cassy",
    "Clare",
    "Chris J",
    "Albert",
    "Chris F",
    "Brent"
  ],
  "person1-canvas",
  wheelWidth);

let person3 = makeWheel(
  [
    "Will",
    "Guffin",
    "Peter",
    "Cassy",
    "Clare",
    "Chris J",
    "Albert",
    "Chris F",
    "Brent"
  ],
  "person3-canvas",
  wheelWidth);

let person2 = makeWheel(
  [
    "Will",
    "Guffin",
    "Peter",
    "Cassy",
    "Clare",
    "Chris J",
    "Albert",
    "Chris F",
    "Brent"
  ],
  "person2-canvas",
  wheelWidth);
</script>
