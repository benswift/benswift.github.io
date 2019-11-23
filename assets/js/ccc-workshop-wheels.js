let segmentColours = [
  "#1abc9c",
  "#3498db",
  "#f1c40f",
  "#d35400",
  "#9b59b6",
  "#c0392b",
  "#e67e22"
];

function makeWheel(labels, canvasId) {
  let canvasDiv = document.getElementById(canvasId);

  if (canvasDiv == null){
	console.log(`makeWheelCanvas error: couldn't find div with ID ${canvasId}`);
	return false;
  }

  // create the canvas in js so I can set the correct aspect ratio
  let width = canvasDiv.parentElement.offsetWidth;
  var canvas = document.createElement('canvas');
  canvas.id = canvasId;
  canvas.width = width;
  canvas.height = width*0.75; // 4:3 aspect ratio should be ok

  // replace placeholder div with the actual canvas
  canvasDiv.replaceWith(canvas);

  // create the new winwheel - see Winwheel.js
  let wheel = new Winwheel({
	canvasId     : canvasId,
	numSegments  : labels.length,   // Specify number of segments.
	outerRadius  : width*0.75*0.5,  // Set radius to so wheel fits the background.
	textFontSize : 24,   // Set font size accordingly.
	textMargin   : 0,    // Take out default margin.
	segments     : labels.map((t, i) => ({text: t,
										  fillStyle: segmentColours[i%segmentColours.length]})),
	animation    :
	{
	  type     : 'spinToStop',
	  duration : 3,
	  spins    : 5,
	  callbackFinished : displaySpinResult
	}
  });

  // finally, set the click handler
  canvas.onclick = () => startSpin(wheel);

  // if we get here, everything's all g
  return true;
}

function startSpin(wheel)
{
  wheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
  wheel.rotationAngle = wheel.rotationAngle % 360;
  wheel.startAnimation();
}

function displaySpinResult(wheel, indicatedSegment)
{
  targetSpans = document.getElementsByClassName(`${wheel.canvasId}-result`);
  for(let e of targetSpans){
	e.textContent = indicatedSegment.text;
  }
}
