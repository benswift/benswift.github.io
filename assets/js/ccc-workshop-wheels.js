// Create new wheel object specifying the parameters at creation time.
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
  return new Winwheel({
	canvasId     : canvasId,
	numSegments  : labels.length,   // Specify number of segments.
	outerRadius  : 300,  // Set radius to so wheel fits the background.
	textFontSize : 24,   // Set font size accordingly.
	textMargin   : 0,    // Take out default margin.
	segments     : labels.map((t, i) => ({text: t,
										  fillStyle: segmentColours[i%segmentColours.length]})),
	animation    :
	{
	  type     : 'spinToStop',
	  duration : 5,
	  spins    : 8,
	  callbackFinished : displaySpinResult
	}
  });
}

function startSpin(wheel)
{
  wheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
  wheel.rotationAngle = wheel.rotationAngle % 360;
  wheel.startAnimation();
}

function displaySpinResult(wheel, indicatedSegment)
{

  document.getElementById(`${wheel.canvasId}-spin-result`).textContent = indicatedSegment.text;
}
