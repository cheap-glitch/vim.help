
/**
 * test/inline.test.js
 */

require('chai').should();

const { escapeHTML       } = require('../src/helpers.js');
const { formatInlineText } = require('../src/parser/inline.js');

// Helper
const format = (text, filename = 'usr_01') => formatInlineText(filename, escapeHTML(text));

describe("inline formatting", () => {

/**
 * Tags
 * {{{
 * =============================================================================
 */
describe("tags", () => {

	describe("Vim tags", () => {

		it("should convert vim tags to anchors", () => {
			format("|notation|", 'usr_01').should.equal('<a href="/intro#notation" class="tag link">notation</a>');
			format("|notation|", 'intro' ).should.equal('<a href="#notation" class="tag link">notation</a>');
		});

		it("should add a special class to options and commands", () => {
			format("|:saveas|", 'usr_01').should.equal('<a href="/editing#%3Asaveas" class="tag command">:saveas</a>');
			format("|'path'|",  'usr_01').should.equal(`<a href="/options#'path'" class="tag option">path</a>`);
		});

		it("should replace links to other files by their title", () => {
			format("|usr_02.txt|").should.equal('“<a href="/02-the-first-steps-in-vim">The first steps in Vim</a>”');
		});

		it("should replace links to sections of the user manual by their title", () => {
			format("|02.1|").should.equal('“<a href="/02-the-first-steps-in-vim#02.1">Running Vim for the First Time</a>”');
		});

		it("should NOT create a tag if the tag is not in the list", () => {
			format("|thisisnotatag|").should.equal('thisisnotatag');
		});

	});

	describe("supplementary tags", () => {

		it("should create tags from option names", () => {
			format("'wildmenu'").should.equal(`<a href="/options#'wildmenu'" class="tag option">wildmenu</a>`);
		});

		it("should NOT create a tag if the option is not in the tag list", () => {
			format("'thisisnotanoption'").should.equal("<code>'thisisnotanoption'</code>");
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
		format('<Enter>'        ).should.equal('<kbd>&lt;Enter&gt;</kbd>');
		format('the <Enter>'    ).should.equal('the <kbd>&lt;Enter&gt;</kbd>');
		format('the <Enter> key').should.equal('the <kbd>&lt;Enter&gt;</kbd> key');
	});

	it("should wrap key chords", () => {
		format('<S-Tab>'       ).should.equal('<kbd>&lt;S&#8209;Tab&gt;</kbd>');
		format('press <S-Tab>' ).should.equal('press <kbd>&lt;S&#8209;Tab&gt;</kbd>');
		format('press <S-Tab>.').should.equal('press <kbd>&lt;S&#8209;Tab&gt;</kbd>.');
	});

	it("should wrap consecutive key chords in separate tags", () => {
		format('<C-Left><C-Left>').should.equal('<kbd>&lt;C&#8209;Left&gt;</kbd><kbd>&lt;C&#8209;Left&gt;</kbd>');
	});

	it("should wrap CTRL-based key bindings", () => {
		format('CTRL-i'        ).should.equal('<kbd>CTRL&#8209;i</kbd>');
		format('CTRL-F'        ).should.equal('<kbd>CTRL&#8209;F</kbd>');
		format('CTRL-^'        ).should.equal('<kbd>CTRL&#8209;^</kbd>');
		format('foo CTRL-B'    ).should.equal('foo <kbd>CTRL&#8209;B</kbd>');
		format('foo CTRL-B bar').should.equal('foo <kbd>CTRL&#8209;B</kbd> bar');
	});

	it("shouldn NOT wrap other uses of 'CTRL'", () => {
		format('the word CTRL means Control').should.equal('the word CTRL means Control');

		// usr_02 (567)
		format(':h CTRL-<Letter>. E.g.'     ).should.equal(':h CTRL-&lt;Letter&gt;. E.g.');
	});

	it("should wrap compound CTRL-based key bindings in a single tag", () => {
		format('CTRL-X CTRL-F'            ).should.equal('<kbd>CTRL&#8209;X CTRL&#8209;F</kbd>');
		format('press CTRL-X CTRL-F'      ).should.equal('press <kbd>CTRL&#8209;X CTRL&#8209;F</kbd>');
		format('press CTRL-X CTRL-F, then').should.equal('press <kbd>CTRL&#8209;X CTRL&#8209;F</kbd>, then');
		format('CTRL-W k'                 ).should.equal('<code><kbd>CTRL&#8209;W</kbd> k</code>');
		format('press CTRL-W k to'        ).should.equal('press <code><kbd>CTRL&#8209;W</kbd> k</code> to');
		format('CTRL-K dP'                ).should.equal('<code><kbd>CTRL&#8209;K</kbd> dP</code>');
		format('foo CTRL-K dP bar'        ).should.equal('foo <code><kbd>CTRL&#8209;K</kbd> dP</code> bar');

		// usr_24 (574)
		format('that CTRL-K a" inserts'   ).should.equal('that <code><kbd>CTRL&#8209;K</kbd> a&quot;</code> inserts');

		// usr_24 (529)
		format('(CTRL-V xff)'             ).should.equal('(<code><kbd>CTRL&#8209;V</kbd> xff</code>)');
	});

	it("should NOT create compound key bindings with actual words", () => {

		// usr_24 (509)
		format('On MS-Windows CTRL-V is used to paste text.').should.equal('On MS-Windows <kbd>CTRL&#8209;V</kbd> is used to paste text.');

		// usr_24 (529)
		format('The CTRL-V command').should.equal('The <kbd>CTRL&#8209;V</kbd> command');
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
			format('"foo"'        ).should.equal('<code>foo</code>');
			format('"q{register}"').should.equal('<code>q{register}</code>');
		});

		it("should wrap double-quoted text with spaces in it but starting with a special character", () => {
			format('":command arg"').should.equal('<code>:command arg</code>');

			// usr_29 (489)
			format('after "#if NEVER".').should.equal('after <code>#if NEVER</code>.');
		});

		it("should NOT wrap other instances of double-quoted text with spaces in it", () => {
			format('"foo bar"').should.equal('&quot;foo bar&quot;');

			// usr_04 (405)
			format('Thus "daw" is "Delete A Word".').should.equal('Thus <code>daw</code> is &quot;Delete A Word&quot;.');
		});

		it("should take register commands into account", () => {

			// usr_24 (350)
			format('"v is the register specification, "yiw" is yank-inner-word')
			.should.equal('<code>&quot;v</code> is the register specification, <code>yiw</code> is yank-inner-word');
		});

	});

	describe("marks", () => {

		it("should wrap marks", () => {

			// usr_07 (223)
			format('in the file `" and `. will take').should.equal('in the file <code>`&quot;</code> and <code>`.</code> will take');
		});

	});

	describe("filenames", () => {

		it("should wrap filenames", () => {
			format('vimtutor.bat'     ).should.equal('<code>vimtutor.bat</code>');
			format('file.txt'         ).should.equal('<code>file.txt</code>');
			format('the file header.h').should.equal('the file <code>header.h</code>');
		});

		it("should NOT wrap abbreviations", () => {
			format('e.g.').should.equal('e.g.');
			format('i.e.').should.equal('i.e.');
		});

		it("should NOT wrap filenames in tags", () => {

			// usr_06 (263)
			format('See |2html.vim| for').should.equal('See <a href="/syntax#2html.vim" class="tag link">2html.vim</a> for');
		});

	});

	describe("variable names", () => {

		it("should wrap variable names", () => {
			format('$VIMTUTOR').should.equal('<code>$VIMTUTOR</code>');
			format('$foo'     ).should.equal('<code>$foo</code>');
		});

	});

	describe("register names", () => {

		it("should wrap register names", () => {
			format('the register v is').should.equal('the register <code>v</code> is');
		});

		it("should leave other single-letter words untouched", () => {
			format('take a breath').should.equal('take a breath');
		});

	});

	describe("single-character key bindings", () => {

		it("should wrap single-character key bindings", () => {
			format('press z to'         ).should.equal('press <code>z</code> to');
			format('unless you press G,').should.equal('unless you press <code>G</code>,');
		});

		it("should leave other single-letter words untouched", () => {
			format('take a breath').should.equal('take a breath');
		});

	});

	describe("other special characters", () => {

		it("should wrap some special characters when they are used alone", () => {
			format('when you type ('        ).should.equal('when you type <code>(</code>');
			format('a pair of (), [] or {}.').should.equal('a pair of <code>()</code>, <code>[]</code> or <code>{}</code>.');

			// usr_20 (25)
			format('a colon (:) command').should.equal('a colon (<code>:</code>) command');
		});

		it("should leave those character untouched when they are used as punctuation", () => {
			format('(foo)'                                ).should.equal('(foo)');
			format('lorem ipsum (foo bar), dolor sit amet').should.equal('lorem ipsum (foo bar), dolor sit amet');
		});

	});

});
/**
 * }}}
 */

/**
 * Others
 * {{{
 * =============================================================================
 */
describe("inline code & commands", () => {

	it("should parse words surrounded by underscores", () => {
		format('_foobar_').should.equal('<strong>foobar</strong>');

		// usr_06 (121)
		format('Make sure you put this _before_ the').should.equal('Make sure you put this <strong>before</strong> the');
	});

	it("should NOT parse non-words surrounded by underscores", () => {
		format('_foo bar_').should.equal('_foo bar_');
	});

	it("should NOT parse words surrounded by two underscores", () => {
		format('__FILE__').should.equal('__FILE__');
	});

});
/**
 * }}}
 */

});
