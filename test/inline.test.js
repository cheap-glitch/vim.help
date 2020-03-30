
/**
 * test/inline.test.js
 */

require('chai').should();

const { escapeHTML      } = require('../src/helpers.js');
const { wrapKeyBindings } = require('../src/parser/inline.js');
const { wrapInlineCode  } = require('../src/parser/inline.js');
const { createTags      } = require('../src/parser/inline.js');

// Helpers
const wrapKB = text => wrapKeyBindings(escapeHTML(text));
const wrapIC = text =>  wrapInlineCode(escapeHTML(text));

describe("inline formatting", () => {

/**
 * Tags
 * {{{
 * -----------------------------------------------------------------------------
 */
describe("tags", () => {

	describe("Vim tags", () => {

		it("should convert vim tags to anchors", () => {
			createTags('usr_01', "|notation|").should.equal('<a href="/intro#notation" class="tag link">notation</a>');
			createTags('intro',  "|notation|").should.equal('<a href="#notation" class="tag link">notation</a>');
		});

		it("should add a special class to options and commands", () => {
			createTags('usr_01', "|:saveas|").should.equal('<a href="/editing#%3Asaveas" class="tag command">:saveas</a>');
			createTags('usr_01', "|'path'|" ).should.equal(`<a href="/options#'path'" class="tag option">path</a>`);
		});

		it("should replace links to other files by their title", () => {
			createTags('usr_01', "|usr_02.txt|").should.equal('“<a href="/02-the-first-steps-in-vim">The first steps in Vim</a>”');
		});

		it("should replace links to sections of the user manual by their title", () => {
			createTags('usr_01', "|02.1|").should.equal('“<a href="/02-the-first-steps-in-vim#02.1">Running Vim for the First Time</a>”');
		});

		it("should NOT create a tag if the tag is not in the list", () => {
			createTags('usr_01', "|thisisnotatag|").should.equal('thisisnotatag');
		});

	});

	describe("supplementary tags", () => {

		it("should create tags from option names", () => {
			createTags('usr_01', "'wildmenu'").should.equal(`<a href="/options#'wildmenu'" class="tag option">wildmenu</a>`);
		});

		it("should NOT create a tag if the option is not in the tag list", () => {
			createTags('usr_01', "'thisisnotanoption'").should.equal("<code>'thisisnotanoption'</code>");
		});

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

	it("should wrap consecutive key chords in separate tags", () => {
		wrapKB('<C-Left><C-Left>').should.equal('<kbd>&lt;C-Left&gt;</kbd><kbd>&lt;C-Left&gt;</kbd>');
	});

	it("should wrap CTRL-based key bindings", () => {
		wrapKB('CTRL-i'        ).should.equal('<kbd>CTRL&#8209;i</kbd>');
		wrapKB('CTRL-F'        ).should.equal('<kbd>CTRL&#8209;F</kbd>');
		wrapKB('CTRL-^'        ).should.equal('<kbd>CTRL&#8209;^</kbd>');
		wrapKB('foo CTRL-B'    ).should.equal('foo <kbd>CTRL&#8209;B</kbd>');
		wrapKB('foo CTRL-B bar').should.equal('foo <kbd>CTRL&#8209;B</kbd> bar');
	});

	it("should wrap compound CTRL-based key bindings in a single tag", () => {
		wrapKB('CTRL-X CTRL-F'            ).should.equal('<kbd>CTRL&#8209;X CTRL&#8209;F</kbd>');
		wrapKB('press CTRL-X CTRL-F'      ).should.equal('press <kbd>CTRL&#8209;X CTRL&#8209;F</kbd>');
		wrapKB('press CTRL-X CTRL-F, then').should.equal('press <kbd>CTRL&#8209;X CTRL&#8209;F</kbd>, then');
		wrapKB('CTRL-W k'                 ).should.equal('<kbd>CTRL&#8209;W k</kbd>');
		wrapKB('press CTRL-W k to'        ).should.equal('press <kbd>CTRL&#8209;W k</kbd> to');
		wrapKB('CTRL-K dP'                ).should.equal('<kbd>CTRL&#8209;K dP</kbd>');
		wrapKB('foo CTRL-K dP bar'        ).should.equal('foo <kbd>CTRL&#8209;K dP</kbd> bar');
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

		it("should wrap double-quoted text with no spaces in it", () => {
			wrapIC('"foo"'        ).should.equal('<code>foo</code>');
			wrapIC('"q{register}"').should.equal('<code>q{register}</code>');
		});

		it("should wrap double-quoted text with spaces in it but starting with a special character", () => {
			wrapIC('":command arg"').should.equal('<code>:command arg</code>');

			// usr_29 (489)
			wrapIC('after "#if NEVER".').should.equal('after <code>#if NEVER</code>.');
		});

		it("should NOT wrap other instances of double-quoted text with spaces in it", () => {
			wrapIC('"foo bar"').should.equal('&quot;foo bar&quot;');

			// usr_04 (405)
			wrapIC('Thus "daw" is "Delete A Word".').should.equal('Thus <code>daw</code> is &quot;Delete A Word&quot;.');
		});

		it("should take register commands into account", () => {

			// usr_24 (350)
			wrapIC('"v is the register specification, "yiw" is yank-inner-word')
			.should.equal('<code>&quot;v</code> is the register specification, <code>yiw</code> is yank-inner-word');
		});

	});

	describe("marks", () => {

		it("should wrap marks", () => {

			// usr_07 (223)
			wrapIC('in the file `" and `. will take').should.equal('in the file <code>`&quot;</code> and <code>`.</code> will take');
		});

	});

	describe("filenames", () => {

		it("should wrap filenames", () => {
			wrapIC('vimtutor.bat'     ).should.equal('<code>vimtutor.bat</code>');
			wrapIC('file.txt'         ).should.equal('<code>file.txt</code>');
			wrapIC('the file header.h').should.equal('the file <code>header.h</code>');
		});

		it("should NOT wrap abbreviations", () => {
			wrapIC('e.g.').should.equal('e.g.');
			wrapIC('i.e.').should.equal('i.e.');
		});

		it("should NOT wrap filenames in tags", () => {

			// usr_06 (263)
			wrapIC('See |2html.vim| for').should.equal('See |2html.vim| for');
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

			// usr_20 (25)
			wrapIC('a colon (:) command').should.equal('a colon (<code>:</code>) command');
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
