
/**
 * test/html_usr.test.js
 */

require('chai').should();

const buildHTML = require('../src/parser/html.js');
const blocksUsr = require('../src/blocks/usr.js');

// Helpers
const text   = str  => ({ type: 'text', text: str });
const build  = node => buildHTML('usr_01', blocksUsr, { containedBlocks: [], ...node });
const inline = html => html.replace(/\t|\n/g, '').replace(/\[SPACE\]/g, ' ');

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

	// List item with a title (usr_09, 221) {{{
	it("list item with a title", () =>
		build({
			type: 'unorderedList',
			children: [{
				type: 'listItem',
				children: [
					{
						type: 'listItemTitle',
						children: [text("- Your terminal does support colors, but Vim doesn't know this.")]
					},
					{
						type: 'paragraph',
						children: [
							text("\tMake sure your $TERM setting is correct.  For example, when using an"),
							text("\txterm that supports colors: >"),
						],
					},
				]
			}]
		})
		.should.equal(inline(`
			<ul><li><div class="li-contents">
				<p><em>Your terminal does support colors, but Vim doesn't know this.</em></p>[SPACE]
				<p>Make sure your <code>$TERM</code> setting is correct.  For example, when using an xterm that supports colors:</p>
			</div></li></ul>
		`))
	);
	// }}}

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
