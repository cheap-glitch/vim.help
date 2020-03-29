
/**
 * test/html_usr.test.js
 */

require('chai').should();

const buildHTML = require('../src/parser/html.js');
const blocksUsr = require('../src/blocks/usr.js');

// Helpers
const build = node => buildHTML('usr_01', blocksUsr, { containedBlocks: [], ...node });
const text  =  str => ({ type: 'text', text: str });

describe("html output", () => {

/**
 * Section headers
 * {{{
 * =============================================================================
 */
it("section headers", () => {

	build({
		type: 'sectionHeader',
		children: [text('*01.1* Lorem ipsum')],
	})
	.should.equal('<h2 id="01.1"><a href="#01.1" class="header-anchor">01.1</a>Lorem ipsum</h2>');

	build({
		type: 'sectionHeader',
		children: [text('*01.1* Lorem ipsum *tag-target*')],
	})
	.should.equal('<h2 id="01.1"><a href="#01.1" class="header-anchor">01.1</a>Lorem ipsum</h2>');

});
/**
 * }}}
 */

/**
 * Sub-section headers
 * {{{
 * =============================================================================
 */
describe("sub-section headers", () => {
});
/**
 * }}}
 */

/**
 * Ordered lists
 * {{{
 * =============================================================================
 */
describe("ordered lists", () => {
});
/**
 * }}}
 */

/**
 * Unordered lists
 * {{{
 * =============================================================================
 */
describe("unordered lists", () => {
});
/**
 * }}}
 */

/**
 * Tables of contents
 * {{{
 * =============================================================================
 */
describe("tables of contents", () => {
});
/**
 * }}}
 */

/**
 * Notes
 * {{{
 * =============================================================================
 */
describe("notes", () => {
});
/**
 * }}}
 */

/**
 * Paragraphs
 * {{{
 * =============================================================================
 */
describe("paragraphs", () => {
});
/**
 * }}}
 */

/**
 * Command blocks
 * {{{
 * =============================================================================
 */
describe("command blocks", () => {
});
/**
 * }}}
 */

/**
 * Formatted text
 * {{{
 * =============================================================================
 */
describe("formatted text", () => {
});
/**
 * }}}
 */

/**
 * Tables
 * {{{
 * =============================================================================
 */
describe("tables", () => {
});
/**
 * }}}
 */

});
