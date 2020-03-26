
/**
 * test/inline.test.js
 */

require('chai').should();

const { escapeHTML      } = require('../src/helpers.js');
const { wrapKeyBindings } = require('../src/parser/inline.js');
// const { createTags      } = require('../src/parser/inline.js');
// const { wrapInlineCode  } = require('../src/parser/inline.js');

// Helpers
const wrapKB = text => wrapKeyBindings(escapeHTML(text));

describe("inline formatting", () => {

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

		// usr_02.txt (567)
		wrapKB(':h CTRL-<Letter>. E.g.'         ).should.equal(':h CTRL-&lt;Letter&gt;. E.g.');
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
/*
describe("inline code tags", () => {

	describe("double-quoted text", () => {

		it("should wrap double-quoted text", () => {
			parse('"foo"'        ).should.equal('<code>foo</code>');
			parse('"q{register}"').should.equal('<code>q{register}</code>');
		});

		it("should take register commands into account", () => {

			// usr_24.txt ("Inserting quickly") #24.6
			parse('"v is the register specification, "yiw" is yank-inner-word').should.equal('<code>&quot;v</code> is the register specification, <code>yiw</code> is yank-inner-word');

		});

	});

	describe("filenames", () => {

		it("should wrap filenames", () => {
			parse('vimtutor.bat'     ).should.equal('<code>vimtutor.bat</code>');
			parse('file.txt'         ).should.equal('<code>file.txt</code>');
			parse('the file header.h').should.equal('the file <code>header.h</code>');
		});

		it("should leave abbreviations untouched", () => {
			parse('e.g.').should.equal('e.g.');
			parse('i.e.').should.equal('i.e.');
		});

	});

	describe("variable names", () => {

		it("should wrap variable names", () => {
			parse('$VIMTUTOR').should.equal('<code>$VIMTUTOR</code>');
			parse('$foo'     ).should.equal('<code>$foo</code>');
		});

	});

	describe("register names", () => {

		it("should wrap register names", () => {
			parse('the register v is').should.equal('the register <code>v</code> is');
		});

		it("should leave other single-letter words untouched", () => {
			parse('take a breath').should.equal('take a breath');
		});

	});

	describe("single-character key bindings", () => {

		it("should wrap single-character key bindings", () => {
			parse('press z to'         ).should.equal('press <code>z</code> to');
			parse('unless you press G,').should.equal('unless you press <code>G</code>,');
		});

		it("should leave other single-letter words untouched", () => {
			parse('take a breath').should.equal('take a breath');
		});

	});

	describe("other special characters", () => {

		it("should wrap some special characters when they are used alone", () => {
			parse('when you type ('        ).should.equal('when you type <code>(</code>');
			parse('a pair of (), [] or {}.').should.equal('a pair of <code>()</code>, <code>[]</code> or <code>{}</code>.');
		});

		it("should leave those character untouched when they are used as punctuation", () => {
			parse('(foo)'                                ).should.equal('(foo)');
			parse('lorem ipsum (foo bar), dolor sit amet').should.equal('lorem ipsum (foo bar), dolor sit amet');
		});

	});

});
*/
/**
 * }}}
 */

});
