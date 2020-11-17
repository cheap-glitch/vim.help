
/**
 * scripts/buttons.js
 */

"use strict";

(function() {
	/* global settings */

	// Create a click handler for each setting button
	for (const [setting, options] of Object.entries(settings)) {
		document.getElementById(`button-setting-${setting}`).addEventListener('click', function(event) {
			// Get the next option in the list (or the previous one if the <Shift> key was pressed during the click)
			const optIndex   = options.indexOf(window.localStorage.getItem(setting));
			const nextOption = options[(optIndex == -1) ? 1 : (event.shiftKey ? (optIndex - 1 < 0 ? options.length - 1 : optIndex - 1) : (optIndex + 1) % options.length)];

			// Set & save the option for this setting
			document.documentElement.setAttribute(`data-${setting}`, nextOption);
			window.localStorage.setItem(setting, nextOption);
		});
	}
})();
