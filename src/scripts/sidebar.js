
/**
 * scripts/sidebar.js
 */

"use strict";

(function() {
	// Get the <details> block corresponding to the current page (if it exists) and open it
	const pageBlock = document.getElementById(document.location.pathname.slice(1) || 'none');
	if (pageBlock)
		pageBlock.setAttribute('open', '');

	// Toggle the sidebar by clicking on the button
	let sidebarFirstOpened = true;
	document.getElementById('button-sidebar').addEventListener('click', function(event) {
		event.stopPropagation();

		document.getElementById('page'   ).classList.toggle('page--sidebar-open');
		document.getElementById('sidebar').classList.toggle('sidebar--open');

		// The first time the sidebar is opened, scroll to the link of the current page
		if (sidebarFirstOpened && pageBlock) {
			sidebarFirstOpened = false;
			pageBlock.scrollIntoView();
		}
	});

	// Close the sidebar by clicking on the page body
	document.getElementById('page').addEventListener('click', function() {
		document.getElementById('page'   ).classList.remove('page--sidebar-open');
		document.getElementById('sidebar').classList.remove('sidebar--open');
	});
})();
