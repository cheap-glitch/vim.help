
/**
 *              o8o                        oooo                  oooo
 *              `"'                        `888                  `888
 * oooo    ooo oooo  ooo. .oo.  .oo.        888 .oo.    .ooooo.   888  oo.ooooo.
 *  `88.  .8'  `888  `888P"Y88bP"Y88b       888P"Y88b  d88' `88b  888   888' `88b
 *   `88..8'    888   888   888   888       888   888  888ooo888  888   888   888
 *    `888'     888   888   888   888  .o.  888   888  888    .o  888   888   888
 *     `8'     o888o o888o o888o o888o Y8P o888o o888o `Y8bod8P' o888o  888bod8P'
 *                                                                      888
 *                                                                     o888o
 *
 * Vim built-in documentation, made nicer to read.
 *
 *
 * Copyright (c) 1988-2003, Bram Moolenaar
 *
 * The Vim user manual and reference  manual are Copyright (c) 1988-2003 by Bram
 * Moolenaar. This  material may be  distributed only  subject to the  terms and
 * conditions set  forth in  the Open  Publication License,  v1.0 or  later. The
 * latest version is presently available at: http://www.opencontent.org/openpub/
 *
 * Parts of  the user manual  come from  the book "Vi  IMproved - Vim"  by Steve
 * Oualline (published  by New  Riders Publishing,  ISBN: 0735710015).  The Open
 * Publication License  applies to this  book. Only selected parts  are included
 * and these  have been modified (e.g.,  by removing the pictures,  updating the
 * text for Vim 6.0 and later,  fixing mistakes). The omission of the "frombook"
 * tag does not mean that the text does not come from the book.
 *
 *
 * Copyright (c) 2020-present, cheap glitch
 *
 * Permission  to use,  copy, modify,  and/or distribute  this software  for any
 * purpose  with or  without  fee is  hereby granted,  provided  that the  above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS  SOFTWARE INCLUDING ALL IMPLIED  WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE  AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL  DAMAGES OR ANY DAMAGES  WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER  TORTIOUS ACTION,  ARISING OUT  OF  OR IN  CONNECTION WITH  THE USE  OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

const fs                     = require('fs');

const files                  = require('./files.js');
const fixes                  = require('./fixes.js');

const { wrapHTML           } = require('./helpers.js');
const { toKebabCase        } = require('./helpers.js');
const { isUserManual       } = require('./helpers.js');
const { getRawFileContents } = require('./helpers.js');

const BUILD_DIR              = 'public';
const HTML_LAYOUT            = fs.readFileSync('src/layouts/page.html').toString();

for (const [filename, title] of Object.entries(files))
{
	const contents = getRawFileContents(`raw/${filename}.txt`);

	// Optionally apply some fixes to the raw text
	if (filename in fixes)
		for (const [lineNb, fix] of Object.entries(fixes[filename]))
			contents[lineNb - 1] = fix(contents[lineNb - 1]);

	const output = {
		title:    title,
		contents: callProcessor(filename, contents),

		// Add an anchor with the number of the chapter in front of the main header of the user manual's pages
		header: (isUserManual(filename) ? wrapHTML(filename.slice(4), 'a', { class: 'header-anchor', href: '#' }) : '') + title,

		// Build the navigation links at the top of the page
		navlinkToc:  (filename != 'usr_toc')                          ? wrapHTML('↑', 'a', { class: 'navlink', title: 'Table of contents',                                                   href: '/table-of-contents' })                             : '',
		navlinkPrev: (isUserManual(filename) && filename != 'usr_01') ? wrapHTML('←', 'a', { class: 'navlink', title: 'Previous chapter: &quot;' + getChapterTitle(filename, -1) + '&quot;', href: '/' + toKebabCase(getChapterTitle(filename, -1)) }) : '',
		navlinkNext: (isUserManual(filename) && filename != 'usr_90') ? wrapHTML('→', 'a', { class: 'navlink', title: 'Next chapter: &quot;'     + getChapterTitle(filename,  1) + '&quot;', href: '/' + toKebabCase(getChapterTitle(filename,  1)) }) : '',
	};

	// Inject each value in the HTML layout
	const html = Object.keys(output).reduce((result, placeholder) => result.replace(RegExp(`{{ ${placeholder} }}`, 'g'), output[placeholder]), HTML_LAYOUT)

	// Write the final HTML to the disk
	fs.writeFileSync(`${BUILD_DIR}/${toKebabCase(output.title)}.html`, html);
}

/**
 * Helpers
 * =============================================================================
 */

/**
 * Call the correct processor to convert the raw text to HTML
 */
function callProcessor(filename, lines)
{
	// User manual
	if (isUserManual(filename)) return require('./processors/usr.js')(filename, lines);

	// Specially formatted file
	if (fs.existsSync(`src/processors/${filename}.js`)) return require(`./processors/${filename}.js`)(lines);

	// Common help file
	return require('./processors/help.js')(filename, lines);
}

/**
 * Get the title of the next/previous chapter in the user manual
 */
function getChapterTitle(filename, offset)
{
	return files[Object.keys(files)[Object.keys(files).indexOf(filename) + offset]];
}
