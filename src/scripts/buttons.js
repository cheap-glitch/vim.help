
/**
 * scripts/buttons.js
 */

/* eslint-env browser */
/* global settings    */

"use strict";

(function()
{
	// Create a click handler for each setting button
	for (const [setting, options] of Object.entries(settings))
	{
		document.getElementById(`button-setting-${setting}`).addEventListener('click', function(event)
		{
			// Get the next option in the list (or the previous one if the <Shift> key was pressed during the click)
			const optIndex   = options.indexOf(window.localStorage.getItem(setting));
			const nextOption = options[(optIndex == -1) ? 1 : (event.shiftKey ? (optIndex - 1 < 0 ? options.length - 1 : optIndex - 1) : (optIndex + 1) % options.length)];

			// Set & save the option for this setting
			document.documentElement.setAttribute(`data-${setting}`, nextOption);
			window.localStorage.setItem(setting, nextOption);
		});
	}

	// Get the link element corresponding to the current page (if it exists) and open its <details> block
	const pageLink = document.getElementById(document.location.pathname.slice(1));
	if (pageLink)
		pageLink.parentElement.parentElement.setAttribute('open', '');

	// Toggle the sidebar by clicking on the button
	let sidebarFirstOpened = true;
	document.getElementById('button-sidebar').addEventListener('click', function()
	{
		document.getElementById('page'   ).classList.toggle('page--sidebar-open');
		document.getElementById('sidebar').classList.toggle('sidebar--open');

		// The first time the sidebar is opened, scroll to the link of the current page
		if (sidebarFirstOpened && pageLink)
		{
			sidebarFirstOpened = false;
			pageLink.scrollIntoView();
		}
	});
})();
