
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
 * A mirror of Vim’s built-in documentation, adapted and improved for the web.
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
const path                   = require('path');
const rm                     = require('rimraf');
const walk                   = require('klaw-sync');

const { basename           } = require('./helpers.js');
const { getRawFileContents } = require('./helpers.js');
const { isUserManual       } = require('./helpers.js');
const { toKebabCase        } = require('./helpers.js');
const { wrapHTML           } = require('./helpers.js');

const files                  = require('./files.js');
const corrections            = require('./corrections.js');

const TIMESTAMP              = Date.now();
const BUILD_DIR              = path.resolve(__dirname, '../public');
const HTML_LAYOUT            = fs.readFileSync(path.resolve(__dirname, './layouts/page.html')).toString();

// Do nothing if no argument is given
if (process.argv.length <= 3) process.exit(0);

// Create the build directory if it doesn't exist
if (!fs.existsSync(BUILD_DIR)) fs.mkdirSync(BUILD_DIR);

switch ([...process.argv].pop())
{
	/**
	 * Build HTML pages from the raw help files
	 */
	case 'html':
		for (const [filename, title] of Object.entries(files))
		{
			const contents = getRawFileContents(`${filename}.txt`);

			// Optionally apply some corrections to the raw text
			if (filename in corrections)
				for (const [lineNb, fix] of Object.entries(corrections[filename]))
					contents[lineNb - 1] = fix(contents[lineNb - 1]);

			writeHTMLPage((isUserManual(filename) ? `${filename.slice(4)}-` : '') + toKebabCase(title), {
				title:    title,
				contents: callProcessor(filename, contents),

				// Add an anchor with the number of the chapter in front of the main header of the user manual's pages
				header: wrapHTML((isUserManual(filename) ? wrapHTML(filename.slice(4), 'a', { class: 'header-anchor', href: '#' }) : '') + title, 'h1'),

				navLinkParent: getNavLinkParent(filename),
				navLinkPrev:   getNavLinkPrevChapter(filename),
				navLinkNext:   getNavLinkNextChapter(filename),

				// Hide the sidebar button on ToC page
				buttonSidebar: filename == 'usr_toc' ? 'button-sidebar--hidden' : '',

				// Get the ToC of the user manual from 'usr_toc.txt'
				sidebarLinks:  require('./processors/toc.js')(getRawFileContents('usr_toc.txt'), filename),
			});
		}
		break;

	/**
	 * Build HTML pages from the Markdown files
	 */
	case 'static':
		const gm = require('gray-matter');
		const mi = require('markdown-it')({
			html:        true,
			linkify:     true,
			typographer: true,
		})
		.use(require('markdown-it-mark'))
		.use(require('markdown-it-bracketed-spans'))
		.use(require('markdown-it-attrs'))
		.use(require('markdown-it-front-matter'), () => {});

		walk(path.resolve(__dirname, './static')).forEach(function(file)
		{
			const contents    = fs.readFileSync(file.path).toString();
			const frontmatter = gm(contents).data;

			// Process the inclusion directives
			const md = contents.replace(/<!-- include (.+?):(.+?) -->/g, function(_, source, fragment)
			{
				return fs.readFileSync(path.resolve(file.path, `../${source}`))
					.toString()
					.match(RegExp(`<!-- fragment:${fragment} -->((?:.|\n)+?)<!-- /fragment -->`))[1];
			});

			writeHTMLPage(basename(file.path), {
				title:          frontmatter.title,
				contents:       mi.render(md),
				buttonSidebar: 'button-sidebar--hidden',
			});
		});
		break;

	/**
	 * Update the stylesheets
	 */
	case 'css':
		rm.sync(`${BUILD_DIR}/*.css`);
		walk(path.resolve(__dirname,  './styles')).forEach(file => fs.copyFileSync(file.path, `${BUILD_DIR}/${basename(file.path)}-${TIMESTAMP}.css`));
		break;

	/**
	 * Update the scripts
	 */
	case 'js':
		rm.sync(`${BUILD_DIR}/*.js`);
		walk(path.resolve(__dirname, './scripts')).forEach(file => fs.copyFileSync(file.path, `${BUILD_DIR}/${basename(file.path)}-${TIMESTAMP}.js`));
		break;
}

// Update the timestamps
walk(BUILD_DIR).forEach(function(file)
{
	// In the source code
	fs.writeFileSync(file.path, fs.readFileSync(file.path).toString().replace(/-\d{13}/g, `-${TIMESTAMP}`));

	// In the filenames
	if (/\.(?:css|js)$/.test(file.path))
		fs.renameSync(file.path, file.path.replace(/-\d{13}/, `-${TIMESTAMP}`));
});

/**
 * Helpers
 * =============================================================================
 */

/**
 * Inject some content in the HTML and write it to the disk
 */
function writeHTMLPage(filename, values)
{
	const html = Object.keys(values)
		// Inject each value in the HTML layout
		.reduce((result, placeholder) => result.replace(`{{ ${placeholder} }}`, values[placeholder]), HTML_LAYOUT)
		// Remove unused placeholders
		.replace(/{{ \w+ }}/g, '');

	fs.writeFileSync(`${BUILD_DIR}/${filename}.html`, html);
}

/**
 * Call the correct processor to convert the raw text to HTML
 */
function callProcessor(filename, lines)
{
	// User manual
	if (isUserManual(filename))
		return require('./processors/usr.js')(filename, lines);

	// Specially formatted file
	if (fs.existsSync(path.resolve(__dirname, `./processors/${filename}.js`)))
		return require(`./processors/${filename}.js`)(lines);

	// Common help file
	return require('./processors/help.js')(filename, lines);
}

/**
 * Get the navigation link to the parent page
 */
function getNavLinkParent(filename)
{
	// User manual page
	if (isUserManual(filename))
		return wrapHTML('↑', 'a', { class: 'navlink', title: 'Table of contents', href: '/table-of-contents' });

	// Other help page
	return wrapHTML('↑', 'a', { class: 'navlink', title: 'Homepage', href: '/' });
}

/**
 * Get the navigation link to the next/previous chapter (user manual only)
 */
function getNavLinkPrevChapter(filename)
{
	return (isUserManual(filename) && filename != 'usr_01')
		? wrapHTML('←', 'a', {
			class: 'navlink',
			title: `Previous chapter: &quot;${getChapterTitle(filename, -1)}&quot;`,
			href:  `/${getChapterNumber(filename, -1)}-${toKebabCase(getChapterTitle(filename, -1))}`
		}) : '';
}

function getNavLinkNextChapter(filename)
{
	return (isUserManual(filename) && filename != 'usr_90')
		? wrapHTML('→', 'a', {
			class: 'navlink',
			title: `Next chapter: &quot;${getChapterTitle(filename, 1)}&quot;`,
			href:  `/${getChapterNumber(filename, 1)}-${toKebabCase(getChapterTitle(filename, 1))}`
		}) : '';
}

/**
 * Get the number of the next/previous chapter in the user manual
 */
function getChapterNumber(filename, offset)
{
	return Object.keys(files)[Object.keys(files).indexOf(filename) + offset].slice(4);
}
/**
 * Get the title of the next/previous chapter in the user manual
 */
function getChapterTitle(filename, offset)
{
	return files[Object.keys(files)[Object.keys(files).indexOf(filename) + offset]];
}
