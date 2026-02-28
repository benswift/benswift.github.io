// see https://benswift.me/blog/2020/02/14/command-control-giving-os-aware-keybinding-hints/

window.addEventListener('DOMContentLoaded', () => {

  // replace all these with the appropriate modifier for the platform
  const modKeys = ["control", "command", "ctrl", "ctl", "cmd"];

  const modifier = navigator.appVersion.indexOf("Mac")!=-1 ? "⌘" : "CTRL";

  for (const kbdElement of document.querySelectorAll("kbd")) {
	if (modKeys.includes(kbdElement.textContent.toLowerCase()) && !kbdElement.classList.contains("nopretty")){
	  kbdElement.textContent = modifier;
	}
  }
});
