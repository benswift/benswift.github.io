let modKeys = ["control", "command"]; // TODO figure out if I should change "ctrl" as well

let modifier = navigator.appVersion.indexOf("Mac")!=-1 ? "command" : "control";

for (const kbdElement of document.querySelectorAll("kbd")) {
  if (modKeys.includes(kbdElement.textContent)){
	kbdElement.textContent = modifier;
  }
}
