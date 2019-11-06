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

function makeWheel(labels, canvasID) {
  return new Winwheel({
	numSegments  : labels.length,   // Specify number of segments.
	outerRadius  : 400,  // Set radius to so wheel fits the background.
	textFontSize : 24,   // Set font size accordingly.
	textMargin   : 0,    // Take out default margin.
	segments     : labels.map((t, i) => ({text: t,
										  fillStyle: segmentColours[i%segmentColours.length]})),
	animation    :           // Define spin to stop animation.
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
// -------------------------------------------------------
// Function for reset button.
// -------------------------------------------------------
function resetWheel(wheel)
{
  wheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
  wheel.draw();                // Call draw to render changes to the wheel.
}

function displaySpinResult(indicatedSegment)
{

  document.getElementById("spin-result").textContent = indicatedSegment.text;
}

let acmBoK2016 = [
  "Circuits & Electronics",
  "Computing Algorithms",
  "Computer Architecture",
  "Digital Design",
  "Embedded Systems",
  "Computer Networks",
  "Information Security",
  "Signal Processing",
  "Systems & Project Eng.",
  "Software Design"
];

let benCodeConcepts = [
  "algorithms",
  "robotics",
  "Software Eng",
  "databases",
  "networks",
  "UI/UX design",
  "data analytics",
  "compilers",
  "operating systems"
]

let codeWheel = makeWheel(
  acmBoK2016,
  "codeWheel");

codeWheel.draw();
