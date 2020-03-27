
/**
 * test/inline.test.js
 */

require('chai').should();

const { escapeHTML      } = require('../src/helpers.js');
const { wrapKeyBindings } = require('../src/parser/inline.js');
const { createTags      } = require('../src/parser/inline.js');
const { wrapInlineCode  } = require('../src/parser/inline.js');

// Helpers
const wrapKB = text => wrapKeyBindings(escapeHTML(text));
const wrapIC = text =>  wrapInlineCode(escapeHTML(text));

describe("inline formatting", () => {

/**
 * Vim tags
 * {{{
 * =============================================================================
 */
describe("key bindings", () => {

	it("@TODO", () => {
	});

});
/**
 * }}}
 */

/**
 * Key bindings
 * {{{
 * =============================================================================
 */
describe("key bindings", () => {

	it("should wrap key names", () => {

		wrapKB('<Enter>'        ).should.equal('<kbd>&lt;Enter&gt;</kbd>');
		wrapKB('the <Enter>'    ).should.equal('the <kbd>&lt;Enter&gt;</kbd>');
		wrapKB('the <Enter> key').should.equal('the <kbd>&lt;Enter&gt;</kbd> key');

	});

	it("should wrap key chords", () => {

		wrapKB('<S-Tab>'       ).should.equal('<kbd>&lt;S-Tab&gt;</kbd>');
		wrapKB('press <S-Tab>' ).should.equal('press <kbd>&lt;S-Tab&gt;</kbd>');
		wrapKB('press <S-Tab>.').should.equal('press <kbd>&lt;S-Tab&gt;</kbd>.');

	});

	it("should wrap CTRL-based key bindings", () => {

		wrapKB('CTRL-i'        ).should.equal('<kbd>CTRL&#8209;i</kbd>');
		wrapKB('CTRL-F'        ).should.equal('<kbd>CTRL&#8209;F</kbd>');
		wrapKB('CTRL-^'        ).should.equal('<kbd>CTRL&#8209;^</kbd>');
		wrapKB('foo CTRL-B'    ).should.equal('foo <kbd>CTRL&#8209;B</kbd>');
		wrapKB('foo CTRL-B bar').should.equal('foo <kbd>CTRL&#8209;B</kbd> bar');

	});

	it("should wrap compound CTRL-based key bindings in a single tag", () => {

		wrapKB('CTRL-W CTRL-W'            ).should.equal('<kbd>CTRL&#8209;W CTRL&#8209;W</kbd>');
		wrapKB('press CTRL-W CTRL-W'      ).should.equal('press <kbd>CTRL&#8209;W CTRL&#8209;W</kbd>');
		wrapKB('press CTRL-W CTRL-W, then').should.equal('press <kbd>CTRL&#8209;W CTRL&#8209;W</kbd>, then');
	});

	it("shouldn't wrap other uses of 'CTRL'", () => {
		wrapKB('the word CTRL means Control').should.equal('the word CTRL means Control');

		// usr_02 (567)
		wrapKB(':h CTRL-<Letter>. E.g.'     ).should.equal(':h CTRL-&lt;Letter&gt;. E.g.');
	});

});
/**
 * }}}
 */

/**
 * Inline code & commands
 * {{{
 * =============================================================================
 */
describe("inline code & commands", () => {

	describe("double-quoted text", () => {

		it("should wrap double-quoted text", () => {
			wrapIC('"foo"'        ).should.equal('<code>foo</code>');
			wrapIC('"q{register}"').should.equal('<code>q{register}</code>');
		});

		it("should take register commands into account", () => {

			// usr_24 (350)
			wrapIC('"v is the register specification, "yiw" is yank-inner-word').should.equal('<code>&quot;v</code> is the register specification, <code>yiw</code> is yank-inner-word');
		});

	});

	describe("filenames", () => {

		it("should wrap filenames", () => {
			wrapIC('vimtutor.bat'     ).should.equal('<code>vimtutor.bat</code>');
			wrapIC('file.txt'         ).should.equal('<code>file.txt</code>');
			wrapIC('the file header.h').should.equal('the file <code>header.h</code>');
		});

		it("should leave abbreviations untouched", () => {
			wrapIC('e.g.').should.equal('e.g.');
			wrapIC('i.e.').should.equal('i.e.');
		});

	});

	describe("variable names", () => {

		it("should wrap variable names", () => {
			wrapIC('$VIMTUTOR').should.equal('<code>$VIMTUTOR</code>');
			wrapIC('$foo'     ).should.equal('<code>$foo</code>');
		});

	});

	describe("register names", () => {

		it("should wrap register names", () => {
			wrapIC('the register v is').should.equal('the register <code>v</code> is');
		});

		it("should leave other single-letter words untouched", () => {
			wrapIC('take a breath').should.equal('take a breath');
		});

	});

	describe("single-character key bindings", () => {

		it("should wrap single-character key bindings", () => {
			wrapIC('press z to'         ).should.equal('press <code>z</code> to');
			wrapIC('unless you press G,').should.equal('unless you press <code>G</code>,');
		});

		it("should leave other single-letter words untouched", () => {
			wrapIC('take a breath').should.equal('take a breath');
		});

	});

	describe("other special characters", () => {

		it("should wrap some special characters when they are used alone", () => {
			wrapIC('when you type ('        ).should.equal('when you type <code>(</code>');
			wrapIC('a pair of (), [] or {}.').should.equal('a pair of <code>()</code>, <code>[]</code> or <code>{}</code>.');
		});

		it("should leave those character untouched when they are used as punctuation", () => {
			wrapIC('(foo)'                                ).should.equal('(foo)');
			wrapIC('lorem ipsum (foo bar), dolor sit amet').should.equal('lorem ipsum (foo bar), dolor sit amet');
		});

	});

});
/**
 * }}}
 */

});
