let segmentColours = [
  "#f6e58d",
  "#ffbe76",
  "#ff7979",
  "#badc58",
  "#dff9fb",
  "#f9ca24",
  "#f0932b",
  "#eb4d4b",
  "#6ab04c",
  "#c7ecee",
  "#7ed6df",
  "#e056fd",
  "#686de0",
];

// from https://stackoverflow.com/a/12646864
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function maxStrLen(strArray) {
  return strArray.reduce(
    (max, nextStr) => Math.max(max, nextStr.length),
    0);
};

function makeWheel(labels, canvasId, radius, callbackFinished) {
  let canvasDiv = document.getElementById(canvasId);

  if (canvasDiv == null) {
    console.log(`makeWheelCanvas error: couldn't find div with ID ${canvasId}`);
    return false;
  }

  if (radius == null) {
    // if no radius value passed to function, set to half the parent width
    radius = canvasDiv.parentElement.offsetWidth / 2;
  }
  // create the canvas in js so I can set the correct aspect ratio
  var canvas = document.createElement("canvas");
  canvas.id = canvasId;
  canvas.width = radius * 2;
  canvas.height = radius * 2;

  // replace placeholder div with the actual canvas
  canvasDiv.replaceWith(canvas);

  // shuffle the colours, just for fun
  shuffleArray(segmentColours);

  // create the new winwheel - see Winwheel.js
  let wheel = new Winwheel({
    canvasId: canvasId,
    numSegments: labels.length,
    outerRadius: radius * 0.99,
    textFontSize: radius * Math.min(0.15, 1.2/maxStrLen(labels)),
    textMargin: 0,
    segments: labels.map((t, i) => ({
      text: t,
      fillStyle: segmentColours[i % segmentColours.length]
    })),
    animation: {
      type: "spinToStop",
      duration: 3,
      spins: 5,
      callbackFinished: callbackFinished,
    },
  });

  // finally, set the click handler
  canvas.onclick = () => startSpin(wheel);

  // if we get here, everything's all g
  return true;
}

function startSpin(wheel) {
  wheel.stopAnimation(false); // Stop the animation, false as param so does not call callback function.
  wheel.rotationAngle = wheel.rotationAngle % 360;
  wheel.startAnimation();
}
