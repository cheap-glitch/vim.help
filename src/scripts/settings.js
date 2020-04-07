
/**
 * scripts/settings.js
 */

"use strict";

const settings = {
	'colorscheme': ['classic', 'solarized-light', 'rust', 'ayu-dark', 'coal'],
	'font-family': ['sans-serif', 'serif'],
	'font-size':   ['normal', 'big', 'small'],
	'text-align':  ['justify', 'left'],
};

(function()
{
	// Load the user settings
	Object.keys(settings).forEach(function(setting)
	{
		const option = window.localStorage.getItem(setting);

		// If an option for this setting is saved, set the corresponding data attribute on the <html> tag
		if (option) document.documentElement.setAttribute(`data-${setting}`, option);
	});
})();
