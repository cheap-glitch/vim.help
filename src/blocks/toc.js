
/**
 * blocks/toc.js
 */

const cloneDeep       = require('lodash/cloneDeep.js');
const { wrapHTML    } = require('../helpers.js');
const { toKebabCase } = require('../helpers.js');

const usrTocBlocks    = require('./usr_toc.js');

// Copy the blocks used to parse 'usr_toc.txt'
const blocks = cloneDeep(usrTocBlocks);

// Turn the section headers into simple paragraphs
blocks.sectionHeader.wrapper = 'p';

// Wrap the link to each page in a <summary> tag and open a <details> block
blocks.subSectionHeader.wrapper = function(lines)
{
	const header = lines[0].split('  ')[1];
	const number = lines[0].match(/^\|usr_(\d{2}).txt\|/)[1];
	const link   = wrapHTML(header, 'a', {
		id:    `${number}-${toKebabCase(header)}`,
		href: `/${number}-${toKebabCase(header)}`,
	});

	return '<details>' + wrapHTML(`${number}. ${link}`, 'summary');
}

// Wrap the ToC of each page in a list and close the <details> block
blocks.toc.wrapper = lines => wrapHTML(lines.join(' '), 'ol', { class: 'table-of-contents' }) + '</details>';

// Erase the other text
blocks.paragraph.wrapper = () => '';

module.exports = blocks;
