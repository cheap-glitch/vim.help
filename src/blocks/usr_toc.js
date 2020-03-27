
/**
 * blocks/usr_toc.js
 */

const { getLinkToTag } = require('../parser/inline.js');
const { wrapHTML     } = require('../helpers.js');
const { toKebabCase  } = require('../helpers.js');
const { isEmpty      } = require('./helpers.js');
const { isSeparator  } = require('./helpers.js');

const RE_SUB_HEADER    = /^\|usr_(\d{2}).txt\|/;
const RE_TOC_ITEM_NB   = /^\t{2}\|(\d{2}\.\d{1,2})\|\t/;

module.exports = {

	/**
	 * Document
	 */
	document: {
		start: () => true,
		end:   () => false,

		containedBlocks: [
			'toc',

			'sectionHeader',
			'subSectionHeader',

			'paragraph',
		],

		wrapper: lines => lines.join('')
	},

	/**
	 * Section header
	 */
	sectionHeader: {
		start: ct => isSeparator(ct.previousLine),
		end:   () => true,

		containedBlocks: [],
		disableInlineParsing: true,

		transformLines: line => line.replace(' ~', ''),

		wrapper: 'h2'
	},

	/**
	 * Sub-section header
	 */
	subSectionHeader: {
		start: ct => RE_SUB_HEADER.test(ct.line),
		end:   () => true,

		containedBlocks: [],
		disableInlineParsing: true,

		wrapper(lines)
		{
			const header = lines[0].split('  ')[1];
			const number = lines[0].match(RE_SUB_HEADER)[1];

			return wrapHTML(`${number}. ` + wrapHTML(header, 'a', { href: `/${number}-${toKebabCase(header)}` }), 'h3')
		}
	},

	/**
	 * Table of contents
	 */
	toc: {
		start: ct => ct.line.startsWith('\t\t'),
		end:   ct => isEmpty(ct.nextLine),

		containedBlocks: [
			'tocItem',
		],

		wrapper: ['ol', { class: 'table-of-contents' }]
	},

	/**
	 * Table of contents item
	 */
	tocItem: {
		start: () => true,
		end:   () => true,

		containedBlocks: [],
		disableInlineParsing: true,

		wrapper: lines => wrapHTML(wrapHTML(lines[0].replace(RE_TOC_ITEM_NB, ''), 'a', { href: getLinkToTag('usr_toc', lines[0].match(RE_TOC_ITEM_NB)[1]) }), 'li')
	},

	/**
	 * Paragraph
	 */
	paragraph: {
		start: ct => !isEmpty(ct.line) && !isSeparator(ct.line),
		end:   () => true,

		containedBlocks: [],
		disableInlineParsing: true,

		wrapper: 'p'
	},

};
