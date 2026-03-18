// see https://benswift.me/blog/2020/02/14/command-control-giving-os-aware-keybinding-hints/

window.addEventListener('DOMContentLoaded', () => {

  // replace all these with the appropriate modifier for the platform
  const modKeys = new Set(["control", "command", "ctrl", "ctl", "cmd"]);

  const modifier = navigator.appVersion.includes("Mac") ? "⌘" : "CTRL";

  for (const kbdElement of document.querySelectorAll("kbd")) {
	if (modKeys.has(kbdElement.textContent.toLowerCase()) && !kbdElement.classList.contains("nopretty")){
	  kbdElement.textContent = modifier;
	}
  }
});
