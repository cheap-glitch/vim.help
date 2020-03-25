
/**
 * test/tags.test.js
 */

require('chai').should();

// const { escapeHTML } = require('../src/helpers.js');
// const { parseTags  } = require('../src/parser/tags.js');

describe("tags", () => {

	/**
	 * Inline code & commands
	 * ---------------------------------------------------------------------
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

});
