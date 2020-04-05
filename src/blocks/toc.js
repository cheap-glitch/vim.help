
/**
 * blocks/toc.js
 */

const cloneDeep       = require('lodash/cloneDeep.js');

const { wrapHTML    } = require('../helpers.js');
const { toKebabCase } = require('../helpers.js');

const files           = require('./../files.js');
const usrTocBlocks    = require('./usr_toc.js');

const RE_SUB_HEADER   = /^\|usr_(\d{2}).txt\|/;

// Copy the blocks used to parse 'usr_toc.txt'
const blocks = cloneDeep(usrTocBlocks);

// Turn the section headers into simple paragraphs
blocks.sectionHeader.wrapper = 'p';

// Wrap the link to each page in a <summary> tag and open a <details> block
blocks.subSectionHeader.wrapper = function(lines, _, filename)
{
	const header = lines[0].split('  ')[1];
	const number = lines[0].match(RE_SUB_HEADER)[1];

	// Don't create a link for the current page
	const link = !filename || toKebabCase(files[filename]) != toKebabCase(header)
		? wrapHTML(header, 'a', { href: `/${number}-${toKebabCase(header)}` })
		: header;

	return `<details id="${number}-${toKebabCase(header)}">` + wrapHTML(wrapHTML(wrapHTML(link, 'li'), 'ol', { start: parseInt(number, 10) }), 'summary');
}

// Wrap the ToC of each page in a list and close the <details> block
blocks.toc.wrapper = lines => wrapHTML(lines.join(' '), 'ol', { class: 'table-of-contents' }) + '</details>';

// Erase the other text
blocks.paragraph.wrapper = () => '';

module.exports = blocks;
