// Create new wheel object specifying the parameters at creation time.
let segmentColours = [
  "#1abc9c",
  "#3498db",
  "#d35400",
  "#9b59b6",
  "#c0392b",
  "#34495e",
  "#16a085"
];

function makeWheel(labels, canvasID) {
  return new Winwheel({
	'numSegments'   : labels.length,   // Specify number of segments.
	'outerRadius'   : 200,  // Set radius to so wheel fits the background.
	'textFontSize'  : 24,   // Set font size accordingly.
	'textMargin'    : 0,    // Take out default margin.
	'segments'      : labels.map((t, i) => ({'text': t,
											 'fillStyle': segmentColours[i%segmentColours.length]})),
	'animation' :           // Define spin to stop animation.
	{
	  'type'     : 'spinToStop',
	  'duration' : 5,
	  'spins'    : 8,
	  'callbackFinished' : alertPrize
	}
  });
}

function startSpin(wheel)
{
  wheel.startAnimation();
}
// -------------------------------------------------------
// Function for reset button.
// -------------------------------------------------------
function resetWheel(wheel)
{
  wheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
  // wheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
  wheel.draw();                // Call draw to render changes to the wheel.
}

function alertPrize(indicatedSegment)
{
  // Do basic alert of the segment text. You would probably want to do something more interesting with this information.
  alert("result: " + indicatedSegment.text);
}

let codeWheel = makeWheel(["algorithms", "robotics", "SoftEng"], "codeWheel");
codeWheel.draw();
