let modKeys = ["control", "command", "ctrl", "cmd"];

let modifier = navigator.appVersion.indexOf("Mac")!=-1 ? "⌘" : "CTRL";

for (const kbdElement of document.querySelectorAll("kbd")) {
  if (modKeys.includes(kbdElement.textContent.toLowerCase()) && !kbdElement.classList.contains("nopretty")){
	kbdElement.textContent = modifier;
  }
}
