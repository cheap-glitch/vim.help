
/**
 * blocks/usr.js
 */

const { wrapHTML         } = require('../helpers.js');
const { generateStr      } = require('../helpers.js');
const { toKebabCase      } = require('../helpers.js');
const { solidifyHyphens  } = require('../helpers.js');
const { removeTagTargets } = require('../helpers.js');

const { isEmpty          } = require('./helpers.js');
const { isSeparator      } = require('./helpers.js');
const { splitFirstCell   } = require('./helpers.js');

const STR_NOTE_START              = '\tNote:';
const STR_FORMATTED_BLOCK_END     = ' ~';

const RE_HEADER_NB                = /^\*(\d{2}\.\d{1,2})\*\s/;
const RE_SPECIAL_MESSAGE          = /^[WE]\d{1,3}: /;
const RE_START_OL                 = /^\t?\d{1,2}[.)] /;
const RE_START_TABLE_INDENT_SPACE = /^ {4,}\S+\t{1,2}[^\t]+$/;
const RE_START_TABLE_INDENT_TAB   = /^<?\t\S[^\t]*\t+\S[^\t]+(?:\t~)?$/;
const RE_START_TABLE_NO_INDENT    = /^[^\t<]+\t{1,2}[^\t]+$/;
const RE_START_TOC                = /^\|(\d{2}\.\d{1,2})\|\t/;
const RE_START_UL                 = /^- {1,2}(?=\S)/;
const RE_SUB_HEADER               = /^[A-Z][A-Z ,'!?-]+(?:\s+\*.+?\*)*$/;

/**
 * Block definitions
 * =============================================================================
 */

module.exports = {

	/**
	 * Document
	 * {{{
	 * ---------------------------------------------------------------------
	 */

	document: {
		end: () => false,

		containedBlocks: [
			'toc',
			'orderedList',
			'unorderedList',

			'sectionHeader',
			'subSectionHeader',

			'table',

			'note',
			'tagTarget',
			'commandBlock',
			'formattedText',

			'paragraph',
		],

		wrapper: lines => lines.join('')
	},

	/**
	 * }}}
	 */

	/**
	 * Headers
	 * {{{
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Section header
	 */
	sectionHeader: {
		start: ct => isSeparator(ct.previousLine),
		end:   () => true,

		containedBlocks: [],
		disableInlineParsing: true,

		wrapper(lines) {
			const line = lines[0].replace(RE_HEADER_NB, '');

			// Add an anchor with the number of the header
			const number = lines[0].match(RE_HEADER_NB)[1].trim();
			const anchor = wrapHTML(number, 'a', { href: `#${number}`, class: 'header-anchor' });

			return wrapHTML(anchor + removeTagTargets(line), 'h2', { id: number }) + parseTagTargets(line);
		}
	},

	/**
	 * Sub-section header
	 */
	subSectionHeader: {
		start: ct => RE_SUB_HEADER.test(ct.line),
		end:   () => true,

		containedBlocks: [],
		disableInlineParsing: true,

		transformLines(line) {
			// Fix the capitalisation of the header text
			return (line[0] + line.slice(1).toLowerCase())
				// Make some words uppercase
				.replace(/(?:^|\b)(?:i|ms|mswin)(?:\b|^)/i, match => match.toUpperCase())
				.replace(/ms-windows/i, 'MS-Windows');
		},

		wrapper(lines) {
			const line = removeTagTargets(lines[0]);

			// Add an anchor before the header text
			const anchor = wrapHTML('#', 'a', {
				href:  `#${toKebabCase(line)}`,
				class: 'header-anchor',
			});

			return wrapHTML(anchor + line, 'h3', { id: toKebabCase(line) }) + parseTagTargets(lines[0]);
		}
	},

	/**
	 * }}}
	 */

	/**
	 * Lists
	 * {{{
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Ordered list
	 */
	orderedList: {
		start: ct => RE_START_OL.test(ct.line),
		end:   ct => isSeparator(ct.nextLine)
			  || ct.emptyLines >= 2
			  || (ct.emptyLines == 1 && !RE_START_OL.test(ct.nextLine)),

		containedBlocks: [
			'listItem',
		],

		wrapper: 'ol'
	},

	/**
	 * Unordered list
	 */
	unorderedList: {
		start: ct => RE_START_UL.test(ct.line),
		end:   ct => isSeparator(ct.nextLine)
			  || ct.emptyLines >= 2
			  || (ct.emptyLines == 1 && !RE_START_UL.test(ct.nextLine)),

		containedBlocks: [
			'listItem',
		],

		wrapper: 'ul'
	},

	/**
	 * List item
	 */
	listItem: {
		start: ct => RE_START_OL.test(ct.line) || RE_START_UL.test(ct.line),
		end:   ct => ct.emptyLines >= 2
			  || (isEmpty(ct.line)
			      && !/^<?(?:\t| {3})/.test(ct.nextLine)
			      && !RE_START_OL.test(ct.nextLine)
			      && !RE_START_UL.test(ct.nextLine))
			  || isSeparator(ct.nextLine)
			  || RE_START_OL.test(ct.nextLine)
			  || RE_START_UL.test(ct.nextLine),

		containedBlocks: [
			'listItemTitle',

			'table',

			'commandBlock',
			'formattedText',

			'paragraph',
		],

		wrapper: lines => wrapHTML(wrapHTML(lines.join(' '), 'div', { class: 'li-contents' }), 'li')
	},

	/**
	 * List item title
	 */
	listItemTitle: {
		start: ct => RE_START_UL.test(ct.line) && !ct.line.startsWith('\t') && ct.nextLine.startsWith('\t'),
		end:   () => true,

		containedBlocks: [],

		transformLines: line => line.replace(RE_START_OL, '').replace(RE_START_UL, ''),

		wrapper: lines => wrapHTML(wrapHTML(lines.join(' '), 'em'), 'p')
	},

	/**
	 * Table of contents
	 */
	toc: {
		start: ct => RE_START_TOC.test(ct.line),
		end:   ct => isEmpty(ct.line),

		containedBlocks: [
			'tocItem',
		],

		transformBlock: lines => [wrapHTML(wrapHTML('Table of contents', 'strong'), 'p'), ...lines],

		wrapper: ['ol', { class: 'table-of-contents' }]
	},

	/**
	 * Table of contents entry
	 */
	tocItem: {
		start: ct => RE_START_TOC.test(ct.line),
		end:   () => true,

		containedBlocks: [],

		transformLines: line => wrapHTML(line.replace(RE_START_TOC, ''), 'a', { href: `#${line.match(RE_START_TOC)[1]}` }),

		wrapper: 'li'
	},

	/**
	 * }}}
	 */

	/**
	 * Text blocks
	 * {{{
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Note
	 */
	note: {
		start: ct => ct.line == STR_NOTE_START,
		end:   ct => isEmpty(ct.line) && !ct.nextLine.startsWith('\t'),

		containedBlocks: [
			'commandBlock',
			'formattedText',
			'paragraph',
		],

		transformBlock: lines => lines.slice(1),

		wrapper: ['div', { class: 'note' }]
	},

	/**
	 * Paragraph
	 */
	paragraph: {
		start(ct) {
			if (isEmpty(ct.line) || isSeparator(ct.line)) return false;

			switch (ct.current.type) {
				case 'note':     return ct.line != STR_NOTE_START;
				case 'listItem': return true;
				default:         return !/^\t/.test(ct.line);
			}
		},
		end(ct) {
			if (isEmpty(ct.nextLine)
			 || isSeparator(ct.nextLine)
			 || ct.line.endsWith(' >') || ct.line == '>'
			) return true;

			switch(ct.parent.type) {
				case 'note':     return ct.nextLine.startsWith('\t\t');
				case 'listItem': return (ct.nextLine.startsWith('\t')
				                         && !RE_START_UL.test(ct.line)
				                         && !/^<?\t/.test(ct.line)
				                         && ct.line != '<')
				                     || ct.nextLine.startsWith(generateStr(6, ' '))
				                     || RE_START_OL.test(ct.nextLine)
				                     || RE_START_UL.test(ct.nextLine)
				                     || ct.nextLine.endsWith(STR_FORMATTED_BLOCK_END);
				default:         return ct.line == '<'
				                     || /^\s/.test(ct.nextLine)
				                     || RE_START_TABLE_NO_INDENT.test(ct.nextLine)
				                     || RE_START_OL.test(ct.nextLine)
				                     || RE_START_UL.test(ct.nextLine);
			}
		},

		containedBlocks: [],

		transformLines: line => removeCodeMarkers(line).replace(RE_START_OL, '').replace(RE_START_UL, ''),

		wrapper: lines => wrapHTML(lines.join(' '), 'p', { class: lines[0].startsWith('WARNING:') ? 'warning' : null })
	},

	/**
	 * Tag target
	 */
	tagTarget: {
		start: ct => /^\t{2,}(?:\*[^ ]+?\* *)+$/.test(ct.line),
		end:   () => true,

		containedBlocks: [],

		wrapper: lines => parseTagTargets(lines[0])
	},

	/**
	 * Command block
	 */
	commandBlock: {
		start: ct => (ct.previousLine.endsWith(' >') || ct.previousLine == '>')
		          && (ct.line.startsWith('\t') || ct.nextLine.startsWith('\t')),

		end:   ct => isEmpty(ct.nextLine)
			  || ct.nextLine == '<'
			  || !/^<?\t/.test(ct.nextLine)
			  || (ct.parent.type == 'listItem' && /^<\t/.test(ct.nextLine)),

		containedBlocks: [],
		disableInlineParsing: true,

		transformLines:  line => line.replace(/^&lt;(?=\t)/, ''),
		transformBlock: lines => removeBlockIndentation(lines),

		wrapper: lines => wrapHTML(wrapHTML(lines.join('\n'), 'code'), 'pre', { class: 'command-block' })
	},

	/**
	 * Formatted text
	 */
	formattedText: {
		start(ct) {
			if (ct.line.endsWith(STR_FORMATTED_BLOCK_END)) return true;

			switch (ct.current.type) {
				case 'listItem': return ct.line.startsWith('\t')
				                    && !ct.previousLine.startsWith('\t')
				                    && !RE_START_OL.test(ct.line)
				                    && !RE_START_UL.test(ct.previousLine);
				case 'note':     return ct.line.startsWith('\t\t');
				default:         return ct.line.startsWith('\t');
			}
		},

		end:   ct => ct.spaces >= 2
			  || (!isEmpty(ct.nextLine)
			      && !ct.nextLine.startsWith(ct.parent.type == 'note' ? '\t\t' : '\t')
			      && !ct.nextLine.startsWith(generateStr(4, ' '))
			      && !ct.nextLine.endsWith(STR_FORMATTED_BLOCK_END))
			  || (ct.parent.type == 'listItem' && !ct.nextLine.endsWith(STR_FORMATTED_BLOCK_END))
			  || ct.nextLine == STR_NOTE_START,

		containedBlocks: [],
		disableInlineParsing: true,

		transformLines:  line => line.replace(/ ~$/, ''),
		transformBlock: lines => removeBlockIndentation(lines),

		wrapper(lines) {
			const text = lines.join('\n');

			return wrapHTML(text, 'pre', RE_SPECIAL_MESSAGE.test(text)
				? { class: `message-${text.startsWith('E') ? 'error' : 'warning'}` }
				: {}
			);
		}
	},

	/**
	 * }}}
	 */

	/**
	 * Tables
	 * {{{
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Table
	 */
	table: {
		 start: ct => RE_START_TABLE_NO_INDENT.test(ct.line)
		           || RE_START_TABLE_INDENT_SPACE.test(ct.line)
		           || RE_START_TABLE_INDENT_TAB.test(ct.line) && (!isEmpty(ct.nextLine) || RE_START_TABLE_INDENT_TAB.test(ct.nextNextLine)),

		end:   ct => isEmpty(ct.nextLine)
		          && !RE_START_TABLE_INDENT_TAB.test(ct.nextNextLine)
		          && !RE_START_TABLE_INDENT_SPACE.test(ct.nextNextLine),

		containedBlocks: [
			'tableHeader',
			'tableRow',
		],

		wrapper: 'table'
	},

	/**
	 * Table header
	 */
	tableHeader: {
		start: ct => /\s~$/.test(ct.line),
		end:   () => true,

		containedBlocks: [],
		disableInlineParsing: true,

		transformLines:  line => line.replace(/~$/, '').trim(),
		transformBlock: lines => splitFirstCell(lines),

		wrapper: lines => wrapHTML(wrapHTML(lines[0], 'th') + wrapHTML(lines.slice(1).join(' '), 'th'), 'tr')
	},

	/**
	 * Table row
	 */
	tableRow: {
		start: () => true,
		end:   ct => !ct.nextLine.startsWith('\t\t'),

		containedBlocks: [],

		transformLines:  line => removeCodeMarkers(line),
		transformBlock: lines => splitFirstCell(lines),

		wrapper(lines) {
			/**
			 * Wrap the first line and the rest of the lines in two separated <td> tags
			 *
			 * Also format the contents of the first cell as inline code if:
			 *   - they are not already wrapped by another tag
			 *   - there is no space in its text or it starts with ':'
			 */
			return wrapHTML(
				  wrapHTML((!/<\/[a-z]+>$/.test(lines[0]) && (!lines[0].includes(' ') || lines[0].startsWith(':'))) ? wrapHTML(lines[0], 'code') : lines[0], 'td')
				+ wrapHTML(lines.slice(1).join(' '), 'td'),
			'tr');
		},
	},

	/**
	 * }}}
	 */

};

/**
 * Helpers
 * =============================================================================
 */

/**
 * Get all the tag targets in a line, wrap each one
 * in a separate tag and put the whole group inside a wrapper
 */
function parseTagTargets(line) {
	const targets = [];

	line.replace(/\*[^ ]+?\*/g, function(target) {
		targets.push(wrapHTML(solidifyHyphens(target.replace(/\*/g, '')), 'a', {
			id:    toKebabCase(target),
			href:  '#' + toKebabCase(target),
			class: 'target',
		}));
	});

	return targets.length ? wrapHTML(wrapHTML(targets.join(''), 'div', { class: 'targets-wrapper' }), 'div', { class: 'targets-fixing' }) : '';
}

/**
 * Remove unneeded block indentation
 */
function removeBlockIndentation(lines) {
	// If the block is made up of a single line, remove the leading whitespace
	if (lines.length == 1) return [lines[0].trim()];

	// Compute the amount of tabs before every line in the block
	let blockIndent = 0;
	while (lines.every(line => line.startsWith(generateStr(blockIndent + 1, '\t'))))
		blockIndent++;

	return lines.map(line => line.slice(blockIndent));
}

/**
 * Remove code markers ('>' and '<')
 */
function removeCodeMarkers(line) {
	return ['&lt;', '&gt;'].includes(line) ? '' : line.replace(/^&lt;(?: |\t)| &gt;$/g, '').trim();
}
