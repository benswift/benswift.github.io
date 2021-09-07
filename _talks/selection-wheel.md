---
title: Group selection wheel
date: "2021-09-07"
permalink: /selection-wheel/
hidden: true
---

<h2 data-background-color="#721780">Group selection wheel</h2>

<style>
body {
  color: white !important;
}
</style>

<script src="{% link assets/js/TweenMax.min.js %}" type="text/javascript"></script>
<script src="{% link assets/js/Winwheel.js %}" type="text/javascript"></script>
<script src="{% link assets/js/picker-wheels.js %}" type="text/javascript"></script>

<div id="picker-wheel-container" style="width:33.3333%; float:left;">
<div style="font-size:2em; line-height:0.8; text-align:center;">⧨</div>
<div id="picker-wheel"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function(){

  let groupList = document.getElementById("group-list");

  function displaySpinResult(wheel, indicatedSegment) {
    targetSpans = document.getElementsByClassName(`${wheel.canvasId}-result`);
    for (let e of targetSpans) {
      e.textContent = indicatedSegment.text;
    }
  }

  let pickerWheel = makeWheel(
    [
      "Kelly",
      "Mearsey",
      "Jess",
      "Josh",
      "Shirley",
      "Charlotte",
    ],
    "picker-wheel",
    Reveal.getConfig().width/6,
    (wheel, indicatedSegment) => {
      let nameItem = document.createElement('li');
      nameItem.innerHTML = indicatedSegment.text;
      groupList.appendChild(nameItem);
      wheel.deleteSegment(wheel.getIndicatedSegmentNumber());
    });
});

</script>

<ol id="group-list" style="font-size: 0.75rem; width:50%; float:right;"></ol>
