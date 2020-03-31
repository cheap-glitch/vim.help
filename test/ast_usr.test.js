
/**
 * test/ast_usr.test.js
 */

require('chai').should();

const buildAST        = require('../src/parser/ast.js');
const { wrapArray   } = require('../src/helpers.js');
const { generateStr } = require('../src/helpers.js');

const blocksUsr       = require('../src/blocks/usr.js');

/* eslint-disable smarter-tabs/smarter-tabs */
describe("AST for user manual pages", () => {

/**
 * Headers
 * {{{
 * =============================================================================
 */
describe("section headers", () => {

	// Simple headers {{{
	it("simple headers", () => getAST(`

		==============================================================================
		Header

		==============================================================================
		*22.3* Header

		==============================================================================
		*22.3* Header *tag-target*

		`).should.deep.equal(wrapNodes([
			{
				type: 'sectionHeader',
				children: ['Header'],
			},
			{
				type: 'sectionHeader',
				children: ['*22.3* Header'],
			},
			{
				type: 'sectionHeader',
				children: ['*22.3* Header *tag-target*'],
			}
		]))
	);
	// }}}

});

describe("sub-section headers", () => {

	// Simple headers {{{
	it("simple headers", () => getAST(`

		LOREM IPSUM

		DOLOR SIT AMET!?

		`).should.deep.equal(wrapNodes([
			{
				type: 'subSectionHeader',
				children: ['LOREM IPSUM'],
			},
			{
				type: 'subSectionHeader',
				children: ['DOLOR SIT AMET!?'],
			}
		]))
	);
	// }}}

	// Headers with tag targets {{{
	it("headers with tag targets", () => getAST(`

		LOREM IPSUM		*target*

		DOLOR SIT AMET!?	*target-1* *target-2*

		`).should.deep.equal(wrapNodes([
			{
				type: 'subSectionHeader',
				children: ['LOREM IPSUM\t\t*target*'],
			},
			{
				type: 'subSectionHeader',
				children: ['DOLOR SIT AMET!?\t*target-1* *target-2*'],
			}
		]))
	);
	// }}}

});
/**
 * }}}
 */

/**
 * Lists
 * {{{
 * =============================================================================
 */
describe("ordered lists", () => {

	// Simple cases {{{
	it("single item", () => getAST(`

		1) lorem ipsum

		`).should.deep.equal(wrapNodes({
			type: 'orderedList',
			children: [
				{ type: 'listItem', children: [{ type: 'paragraph', children: ['1) lorem ipsum'] }] },
			]
		}))
	);

	it("single item with multiple lines", () => getAST(`

		1) lorem ipsum
		   dolor sit amet

		`).should.deep.equal(wrapNodes({
			type: 'orderedList',
			children: [{
				type: 'listItem',
				children: [{
					type: 'paragraph',
					children: [
						'1) lorem ipsum',
						'   dolor sit amet',
					]
				}]
			}]
		}))
	);

	it("multiple items", () => getAST(`

		1) lorem ipsum

		2) dolor sit amet

		`).should.deep.equal(wrapNodes({
			type: 'orderedList',
			children: [
				{ type: 'listItem', children: [{ type: 'paragraph', children: ['1) lorem ipsum'   ] }] },
				{ type: 'listItem', children: [{ type: 'paragraph', children: ['2) dolor sit amet'] }] },
			]
		}))
	);

	it("multiple items with multiple lines", () => getAST(`

		1) lorem ipsum
		   dolor sit amet

		2) lorem ipsum
		   dolor sit amet

		`).should.deep.equal(wrapNodes({
			type: 'orderedList',
			children: [
				{
					type: 'listItem',
					children: [{
						type: 'paragraph',
						children: [
							'1) lorem ipsum',
							'   dolor sit amet',
						]
					}]
				},
				{
					type: 'listItem',
					children: [{
						type: 'paragraph',
						children: [
							'2) lorem ipsum',
							'   dolor sit amet',
						]
					}]
				},
			]
		}))
	);
	// }}}

	// With embedded code blocks {{{
	it("With embedded code blocks", () => getAST(`

		1) lorem ipsum >
			:command
		<   dolor sit amet

		`).should.deep.equal(wrapNodes({
			type: 'orderedList',
			children: [{
				type: 'listItem',
				children: [
					{
						type: 'paragraph',
						children: ['1) lorem ipsum >'],
					},
					{
						type: 'commandBlock',
						children: ['\t:command'],
					},
					{
						type: 'paragraph',
						children: ['<   dolor sit amet'],
					},
				]
			}]
		}))
	);
	// }}}

	// With embedded formatted text blocks (usr_03, 232) {{{
	it("embedded formatted text blocks", () => getAST(`

		1.  Use the CTRL-G command.  You get a message like this (assuming the 'ruler'
		    option is off):

			"usr_03.txt" line 233 of 650 --35%-- col 45-52 ~

		    This shows the name of the file you are editing, the line number where the
		    cursor is, the total number of lines, the percentage of the way through
		    the file and the column of the cursor.
		       Sometimes you will see a split column number.  For example, "col 2-9".
		    This indicates that the cursor is positioned on the second character, but
		    because character one is a tab, occupying eight spaces worth of columns,
		    the screen column is 9.

		2.  Set the 'number' option.  This will display a line number in front of

		`).should.deep.equal(wrapNodes({
			type: 'orderedList',
			children: [
				{
					type: 'listItem',
					children: [
						{
							type: 'paragraph',
							children: [
								"1.  Use the CTRL-G command.  You get a message like this (assuming the 'ruler'",
								"    option is off):",
							]
						},
						{
							type: 'formattedText',
							children: ['\t"usr_03.txt" line 233 of 650 --35%-- col 45-52 ~']
						},
						{
							type: 'paragraph',
							children: [
								"    This shows the name of the file you are editing, the line number where the",
								"    cursor is, the total number of lines, the percentage of the way through",
								"    the file and the column of the cursor.",
							]
						},
						{
							type: 'paragraph',
							children: [
								'       Sometimes you will see a split column number.  For example, "col 2-9".',
								'    This indicates that the cursor is positioned on the second character, but',
								'    because character one is a tab, occupying eight spaces worth of columns,',
								'    the screen column is 9.',
							]
						},
					]
				},
				{
					type: 'listItem',
					children: [{
						type: 'paragraph',
						children: ["2.  Set the 'number' option.  This will display a line number in front of"]
					}]
				},
			]
		}))
	);
	// }}}

	// Multiple single-line items with no space between them (usr_22, 50) {{{
	it("multiple single-line items with no space between them", () => getAST(`

		1.  The name of the browsing tool and its version number
		2.  The name of the browsing directory
		3.  The method of sorting (may be by name, time, or size)
		4.  How names are to be sorted (directories first, then *.h files,
		    *.c files, etc)
		5.  How to get help (use the <F1> key), and an abbreviated listing
		    of available commands
		6.  A listing of files, including "../", which allows one to list
		    the parent directory.

		If you have syntax highlighting enabled, the different parts are highlighted
		so as to make it easier to spot them.

		`).should.deep.equal(wrapNodes([
			{
				type: 'orderedList',
				children: [
					{ type: 'listItem',  children: [{ type: 'paragraph', children: ['1.  The name of the browsing tool and its version number']                                        }] },
					{ type: 'listItem',  children: [{ type: 'paragraph', children: ['2.  The name of the browsing directory']                                                          }] },
					{ type: 'listItem',  children: [{ type: 'paragraph', children: ['3.  The method of sorting (may be by name, time, or size)']                                       }] },
					{ type: 'listItem',  children: [{ type: 'paragraph', children: ['4.  How names are to be sorted (directories first, then *.h files,', '    *.c files, etc)']       }] },
					{ type: 'listItem',  children: [{ type: 'paragraph', children: ['5.  How to get help (use the <F1> key), and an abbreviated listing', '    of available commands'] }] },
					{ type: 'listItem',  children: [{ type: 'paragraph', children: ['6.  A listing of files, including "../", which allows one to list',  '    the parent directory.']  }] },
				]
			},
			{
				type: 'paragraph',
				children: ['If you have syntax highlighting enabled, the different parts are highlighted', 'so as to make it easier to spot them.']
			}
		]))
	);
	// }}}

	// Indented list with single-line items (usr_24, 159) {{{
	it("indented list with single-line items", () => getAST(`

			1. Current file
			2. Files in other windows
			3. Other loaded files (hidden buffers)
			4. Files which are not loaded (inactive buffers)
			5. Tag files
			6. All files #included by the current file

		`).should.deep.equal(wrapNodes({
			type: 'orderedList',
			children: [
				{ type: 'listItem', children: [{ type: 'paragraph', children: ['\t1. Current file']                                  }] },
				{ type: 'listItem', children: [{ type: 'paragraph', children: ['\t2. Files in other windows']                        }] },
				{ type: 'listItem', children: [{ type: 'paragraph', children: ['\t3. Other loaded files (hidden buffers)']           }] },
				{ type: 'listItem', children: [{ type: 'paragraph', children: ['\t4. Files which are not loaded (inactive buffers)'] }] },
				{ type: 'listItem', children: [{ type: 'paragraph', children: ['\t5. Tag files']                                     }] },
				{ type: 'listItem', children: [{ type: 'paragraph', children: ['\t6. All files #included by the current file']       }] },
			]
		}))
	);
	// }}}

	// Indented list with embedded command and formatted blocks (usr_05, 406) {{{
	it("indented list with embedded command and formatted blocks", () => getAST(`

			1. create the package directory: >
				mkdir -p ~/.vim/pack/fancy
		<	   "fancy" can be any name of your liking.  Use one that describes the
			   package.
			2. unpack the archive in that directory.  This assumes the top
			   directory in the archive is "start": >
				cd ~/.vim/pack/fancy
				unzip /tmp/fancy.zip
		<	   If the archive layout is different make sure that you end up with a
			   path like this:
				~/.vim/pack/fancy/start/fancytext/plugin/fancy.vim ~
			   Here "fancytext" is the name of the package, it can be anything
			   else.

		`).should.deep.equal(wrapNodes({
			type: 'orderedList',
			children: [
				{
					type: 'listItem',
					children: [
						{ type: 'paragraph',     children: ['\t1. create the package directory: >']                                                       },
						{ type: 'commandBlock',  children: ['\t\tmkdir -p ~/.vim/pack/fancy']                                                             },
						{ type: 'paragraph',     children: ['<\t   "fancy" can be any name of your liking.  Use one that describes the', '\t   package.'] },
					]
				},
				{
					type: 'listItem',
					children: [
						{ type: 'paragraph',     children: ['\t2. unpack the archive in that directory.  This assumes the top', '\t   directory in the archive is "start": >'] },
						{ type: 'commandBlock',  children: ['\t\tcd ~/.vim/pack/fancy', '\t\tunzip /tmp/fancy.zip']                                                            },
						{ type: 'paragraph',     children: ['<\t   If the archive layout is different make sure that you end up with a', '\t   path like this:']               },
						{ type: 'formattedText', children: ['\t\t~/.vim/pack/fancy/start/fancytext/plugin/fancy.vim ~']                                                        },
						{ type: 'paragraph',     children: ['\t   Here "fancytext" is the name of the package, it can be anything', '\t   else.']                              },
					]
				}
			]
		}))
	);
	// }}}

});

describe("unordered lists", () => {

	// Starting with a dash and two spaces (usr_09, 221) {{{
	it("starting with a dash and two spaces", () => getAST(`

		-  Select two words in Visual mode.
		-  Use the Edit/Paste menu item.  What will happen is that the single selected
		   word is replaced with the two words from the clipboard.
		-  Move the mouse pointer somewhere else and click the middle button.  You
		   will see that the word you just overwrote with the clipboard is inserted
		   here.

		`).should.deep.equal(wrapNodes({
			type: 'unorderedList',
			children: [
				{
					type: 'listItem',
					children: [{
						type: 'paragraph',
						children: ['-  Select two words in Visual mode.']
					}]
				},
				{
					type: 'listItem',
					children: [{
						type: 'paragraph',
						children: [
							'-  Use the Edit/Paste menu item.  What will happen is that the single selected',
							'   word is replaced with the two words from the clipboard.',
						],
					}]
				},
				{
					type: 'listItem',
					children: [{
						type: 'paragraph',
						children: [
							'-  Move the mouse pointer somewhere else and click the middle button.  You',
							'   will see that the word you just overwrote with the clipboard is inserted',
							'   here.',
						]
					}]
				}
			]
		}))
	);
	// }}}

	// List item with a title and embedded command blocks (usr_06, 55) {{{
	it("list item with a title and embedded command blocks", () => getAST(`

		- Your terminal does support colors, but Vim doesn't know this.
			Make sure your $TERM setting is correct.  For example, when using an
			xterm that supports colors: >

				setenv TERM xterm-color
		<
			or (depending on your shell): >

				TERM=xterm-color; export TERM

		<	The terminal name must match the terminal you are using.  If it
			still doesn't work, have a look at |xterm-color|, which shows a few
			ways to make Vim display colors (not only for an xterm).

		`).should.deep.equal(wrapNodes({
			type: 'unorderedList',
			children: [{
				type: 'listItem',
				children: [
					{
						type: 'paragraph',
						children: [
							"- Your terminal does support colors, but Vim doesn't know this.",
							"\tMake sure your $TERM setting is correct.  For example, when using an",
							"\txterm that supports colors: >",
						],
					},
					{
						type: 'commandBlock',
						children: ['\t\tsetenv TERM xterm-color']
					},
					{
						type: 'paragraph',
						children: ['<', '\tor (depending on your shell): >']
					},
					{
						type: 'commandBlock',
						children: ['\t\tTERM=xterm-color; export TERM']
					},
					{
						type: 'paragraph',
						children: [
							"<\tThe terminal name must match the terminal you are using.  If it",
							"\tstill doesn't work, have a look at |xterm-color|, which shows a few",
							"\tways to make Vim display colors (not only for an xterm).",
						],
					}
				]
			}]
		}))
	);
	// }}}

});

describe("tables of contents", () => {

	// Simple table of contents (usr_01, 11) {{{
	it("simple table of contents", () => getAST(`

		|01.1|	Two manuals
		|01.2|	Vim installed
		|01.3|	Using the Vim tutor
		|01.4|	Copyright

		`).should.deep.equal(wrapNodes({
			type: 'toc',
			children: [
				{
					type: 'tocItem',
					children: ['|01.1|\tTwo manuals']
				},
				{
					type: 'tocItem',
					children: ['|01.2|\tVim installed']
				},
				{
					type: 'tocItem',
					children: ['|01.3|\tUsing the Vim tutor']
				},
				{
					type: 'tocItem',
					children: ['|01.4|\tCopyright']
				}
			],
		}))
	);
	// }}}

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

	// Simple note block {{{
	it("simple note block", () => getAST(`

			Note:
			lorem ipsum
			dolor sit amet

		`).should.deep.equal(wrapNodes({
			type: 'note',
			children: [
				'\tNote:',
				{
					type: 'paragraph',
					children: ['\tlorem ipsum', '\tdolor sit amet']
				}
			]
		}))
	);
	// }}}

	// Note block with included command block {{{
	it("note block with included command block", () => getAST(`

			Note:
			lorem ipsum
			dolor sit amet >
				:command

		`).should.deep.equal(wrapNodes({
			type: 'note',
			children: [
				'\tNote:',
				{
					type: 'paragraph',
					children: ['\tlorem ipsum', '\tdolor sit amet >']
				},
				{
					type: 'commandBlock',
					children: ['\t\t:command']
				}
			]
		}))
	);
	// }}}

	// Note block with included formatted text block {{{
	it("note block with included formatted text block", () => getAST(`

			Note:
			lorem ipsum
			dolor sit amet
				text
			si vis pacem

		`).should.deep.equal(wrapNodes({
			type: 'note',
			children: [
				'\tNote:',
				{
					type: 'paragraph',
					children: ['\tlorem ipsum', '\tdolor sit amet']
				},
				{
					type: 'formattedText',
					children: ['\t\ttext']
				},
				{
					type: 'paragraph',
					children: ['\tsi vis pacem']
				}
			]
		}))
	);
	// }}}

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

	// Single paragraph {{{
	it("single paragraph with a single line", () => getAST(`

		lorem ipsum

		`).should.deep.equal(wrapNodes({
			type: 'paragraph',
			children: ['lorem ipsum'],
		}))
	);

	it("single paragraph with multiple lines", () => getAST(`

		lorem ipsum
		dolor sit amet

		`).should.deep.equal(wrapNodes({
			type: 'paragraph',
			children: ['lorem ipsum', 'dolor sit amet'],
		}))
	);
	// }}}

	// Multiple paragraphs {{{
	it("multiple paragraphs with single line", () => getAST(`

		lorem ipsum

		dolor sit amet

		ars longa, vita brevis

		`).should.deep.equal(wrapNodes([
			{ type: 'paragraph', children: ['lorem ipsum']            },
			{ type: 'paragraph', children: ['dolor sit amet']         },
			{ type: 'paragraph', children: ['ars longa, vita brevis'] },
		]))
	);

	it("multiple paragraphs with multiple lines", () => getAST(`

		lorem ipsum
		dolor sit amet

		ars longa, vita brevis
		veni, vidi, vici

		`).should.deep.equal(wrapNodes([
			{ type: 'paragraph', children: ['lorem ipsum', 'dolor sit amet']              },
			{ type: 'paragraph', children: ['ars longa, vita brevis', 'veni, vidi, vici'] },
		]))
	);

	it("multiple paragraphs separated by an indent", () => getAST(`

		lorem ipsum
		   dolor sit amet

		`).should.deep.equal(wrapNodes([
			{ type: 'paragraph', children: ['lorem ipsum']       },
			{ type: 'paragraph', children: ['   dolor sit amet'] },
		]))
	);
	// }}}

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

	describe("after a paragraph", () => {

		// Single line {{{
		it("single line", () => getAST(`

			lorem ipsum >
				command

			`, 3).should.deep.equal(wrapNodes([
				{
					type: 'paragraph',
					children: ['lorem ipsum >'],
				},
				{
					type: 'commandBlock',
					children: ['\tcommand'],
				},
			]))
		);
		// }}}

		// Multiple lines {{{
		it("multiple lines", () => getAST(`

			lorem ipsum >
				command
				command

			`, 3).should.deep.equal(wrapNodes([
				{
					type: 'paragraph',
					children: ['lorem ipsum >'],
				},
				{
					type: 'commandBlock',
					children: ['\tcommand', '\tcommand'],
				},
			]))
		);
		// }}}

	});

	describe("between two paragraphs", () => {

		// Single line {{{
		it("single line", () => getAST(`

			lorem ipsum >
				command
			< dolor sit amet

			`, 3).should.deep.equal(wrapNodes([
				{
					type: 'paragraph',
					children: ['lorem ipsum >'],
				},
				{
					type: 'commandBlock',
					children: ['\tcommand'],
				},
				{
					type: 'paragraph',
					children: ['< dolor sit amet'],
				}
			]))
		);
		// }}}

		// Multiple lines {{{
		it("multiple lines", () => getAST(`

			lorem ipsum >
				command
				command
			< dolor sit amet

			`, 3).should.deep.equal(wrapNodes([
				{
					type: 'paragraph',
					children: ['lorem ipsum >'],
				},
				{
					type: 'commandBlock',
					children: ['\tcommand', '\tcommand'],
				},
				{
					type: 'paragraph',
					children: ['< dolor sit amet'],
				}
			]))
		);
		// }}}

	});

	describe("inside a list item", () => {

		// Single line {{{
		it("single line", () => getAST(`

			1) lorem ipsum >
				command
			<   dolor sit amet

			`, 3).should.deep.equal(wrapNodes({
				type: 'orderedList',
				children: [{
					type: 'listItem',
					children: [
						{
							type: 'paragraph',
							children: ['1) lorem ipsum >'],
						},
						{
							type: 'commandBlock',
							children: ['\tcommand'],
						},
						{
							type: 'paragraph',
							children: ['<   dolor sit amet'],
						}
					]
				}]
			}))
		);
		// }}}

		// Multiple lines {{{
		it("multiple lines", () => getAST(`

			1) lorem ipsum >
				command
				command
			<   dolor sit amet

			`, 3).should.deep.equal(wrapNodes({
				type: 'orderedList',
				children: [{
					type: 'listItem',
					children: [
						{
							type: 'paragraph',
							children: ['1) lorem ipsum >'],
						},
						{
							type: 'commandBlock',
							children: ['\tcommand', '\tcommand'],
						},
						{
							type: 'paragraph',
							children: ['<   dolor sit amet'],
						}
					]
				}]
			}))
		);
		// }}}

	});

	describe("at the end of a list", () => {

		// Single line {{{
		it("single line", () => getAST(`

			9) lorem ipsum >
				command

			`, 3).should.deep.equal(wrapNodes({
				type: 'orderedList',
				children: [{
					type: 'listItem',
					children: [
						{
							type: 'paragraph',
							children: ['9) lorem ipsum >'],
						},
						{
							type: 'commandBlock',
							children: ['\tcommand'],
						},
					]
				}]
			}))
		);
		// }}}

		// Multiple lines {{{
		it("multiple lines", () => getAST(`

			9) lorem ipsum >
				command
				command

			`, 3).should.deep.equal(wrapNodes({
				type: 'orderedList',
				children: [{
					type: 'listItem',
					children: [
						{
							type: 'paragraph',
							children: ['9) lorem ipsum >'],
						},
						{
							type: 'commandBlock',
							children: ['\tcommand', '\tcommand'],
						},
					]
				}]
			}))
		);
		// }}}

	});

	// Adjoining a formatted text block (usr_10, 675) {{{
	it("adjoining a formatted text block", () => getAST(`

		The "gu" operator does exactly the opposite: >

					     guw
		<	SECTION header	    ---->      section header

		`).should.deep.equal(wrapNodes([
			{
				type: 'paragraph',
				children: ['The "gu" operator does exactly the opposite: >']
			},
			{
				type: 'commandBlock',
				children: [
					'\t\t\t     guw',
					'<\tSECTION header\t    ---->      section header',
				]
			}
		]))
	);
	// }}}

});
/**
 * }}}
 */

/**
 * Formatted text blocks
 * {{{
 * =============================================================================
 */
describe("formatted text blocks", () => {

	// Simple cases {{{
	it("single block with single line", () => getAST(`

			lorem ipsum

		`).should.deep.equal(wrapNodes({
			type: 'formattedText',
			children: ['\tlorem ipsum'],
		}))
	);

	it("single block with multiple lines", () => getAST(`

			lorem ipsum
			dolor sit amet

		`).should.deep.equal(wrapNodes({
			type: 'formattedText',
			children: ['\tlorem ipsum', '\tdolor sit amet'],
		}))
	);

	it("single block with line break", () => getAST(`

			lorem ipsum
			dolor sit amet

			sic transit
			gloria mundi

		`).should.deep.equal(wrapNodes({
			type: 'formattedText',
			children: ['\tlorem ipsum', '\tdolor sit amet', '\tsic transit', '\tgloria mundi'],
		}))
	);
	// }}}

	// Single block with line in the middle starting with spaces {{{
	it("single block with line in the middle starting with spaces", () => getAST(`

			lorem ipsum
			dolor sit amet
		    foobar
			sic transit
			gloria mundi

		`).should.deep.equal(wrapNodes({
			type: 'formattedText',
			children: ['\tlorem ipsum', '\tdolor sit amet', '    foobar', '\tsic transit', '\tgloria mundi'],
		}))
	);
	// }}}

	// Multiple blocks mixed with paragraphs {{{
	it("multiple blocks mixed with paragraphs", () => getAST(`

		lorem ipsum
			formatted
		dolor sit amet
			formatted

		`).should.deep.equal(wrapNodes([
			{
				type: 'paragraph',
				children: ['lorem ipsum'],
			},
			{
				type: 'formattedText',
				children: ['\tformatted'],
			},
			{
				type: 'paragraph',
				children: ['dolor sit amet'],
			},
			{
				type: 'formattedText',
				children: ['\tformatted'],
			},
		]))
	);
	// }}}

	// Single block with single line marked by a trailing '~' {{{
	it("single block with single line marked by a trailing '~'", () => getAST(`

		  lorem ipsum ~

		`).should.deep.equal(wrapNodes({
			type: 'formattedText',
			children: ['  lorem ipsum ~'],
		}))
	);
	// }}}

	// Text block with some tabulations inside the lines (usr_03, 310) {{{
	it("text block with some tabulations inside the lines", () => getAST(`

			+------------------+		 +------------------+
			| earlier text	   |		 | earlier text	    |
			| earlier text	   |		 | earlier text	    |
			| earlier text	   |		 | earlier text	    |
			| earlier text	   |   zz  -->	 | line with cursor |
			| earlier text	   |		 | later text	    |
			| earlier text	   |		 | later text	    |
			| line with cursor |		 | later text	    |
			+------------------+		 +------------------+

		`).should.deep.equal(wrapNodes({
			type: 'formattedText',
			children: [
				'\t+------------------+\t\t +------------------+',
				'\t| earlier text\t   |\t\t | earlier text\t    |',
				'\t| earlier text\t   |\t\t | earlier text\t    |',
				'\t| earlier text\t   |\t\t | earlier text\t    |',
				'\t| earlier text\t   |   zz  -->\t | line with cursor |',
				'\t| earlier text\t   |\t\t | later text\t    |',
				'\t| earlier text\t   |\t\t | later text\t    |',
				'\t| line with cursor |\t\t | later text\t    |',
				'\t+------------------+\t\t +------------------+',
			],
		}))
	);
	// }}}

	// Non-indented formatted block (usr_22, 33) {{{
	it("non-indented formatted block", () => getAST(`

		Through the magic of autocommands and Vim scripts, the window will be filled
		with the contents of the directory.  It looks like this:

		" ============================================================================ ~
		" Netrw Directory Listing                                        (netrw v109) ~
		"   Sorted by      name ~
		"   Sort sequence: [\\/]$,\\.h$,\\.c$,\\.cpp$,*,\\.info$,\\.swp$,\\.o$\\.obj$,\\.bak$ ~
		"   Quick Help: <F1>:help  -:go up dir  D:delete  R:rename  s:sort-by  x:exec ~
		" ============================================================================ ~
		../ ~
		./ ~
		check/ ~
		Makefile ~
		autocmd.txt ~
		change.txt ~
		eval.txt~ ~
		filetype.txt~ ~
		help.txt.info ~

		You can see these items:

		`).should.deep.equal(wrapNodes([
			{
				type: 'paragraph',
				children: [
					'Through the magic of autocommands and Vim scripts, the window will be filled',
					'with the contents of the directory.  It looks like this:',
				]
			},
			{
				type: 'formattedText',
				children: [
					'" ============================================================================ ~',
					'" Netrw Directory Listing                                        (netrw v109) ~',
					'"   Sorted by      name ~',
					'"   Sort sequence: [\\/]$,\\.h$,\\.c$,\\.cpp$,*,\\.info$,\\.swp$,\\.o$\\.obj$,\\.bak$ ~',
					'"   Quick Help: <F1>:help  -:go up dir  D:delete  R:rename  s:sort-by  x:exec ~',
					'" ============================================================================ ~',
					'../ ~',
					'./ ~',
					'check/ ~',
					'Makefile ~',
					'autocmd.txt ~',
					'change.txt ~',
					'eval.txt~ ~',
					'filetype.txt~ ~',
					'help.txt.info ~',
				],
			},
			{
				type: 'paragraph',
				children: ['You can see these items:']
			}
		]))
	);
	// }}}

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

	// Table with single-line rows (usr_08, 480) {{{
	it("table with single-line rows", () => getAST(`

		The 'laststatus' option can be used to specify when the last window has a
		statusline:

			0	never
			1	only when there are split windows (the default)
			2	always

		`).should.deep.equal(wrapNodes([
			{
				type: 'paragraph',
				children: ["The 'laststatus' option can be used to specify when the last window has a", "statusline:"]
			},
			{
				type: 'table',
				children: [
					{
						type: 'tableRow',
						children: ['\t0\tnever']
					},
					{
						type: 'tableRow',
						children: ['\t1\tonly when there are split windows (the default)']
					},
					{
						type: 'tableRow',
						children: ['\t2\talways']
					}
				]
			}
		]))
	);
	// }}}

	// Table with multi-line rows {{{
	it("table with multi-line rows", () => getAST(`

			a	lorem ipsum
				dolor sit amet
			b	memento mori

		`).should.deep.equal(wrapNodes({
			type: 'table',
			children: [
				{
					type: 'tableRow',
					children: ['\ta\tlorem ipsum', '\t\tdolor sit amet']
				},
				{
					type: 'tableRow',
					children: ['\tb\tmemento mori']
				}
			]
		}))
	);
	// }}}

	// Table with no indentation (usr_09, 150) {{{
	it("table with no indentation", () => getAST(`

		Left mouse click		position the cursor
		Left mouse drag			select text in Visual mode
		Middle mouse click		paste text from the clipboard
		Right mouse click		extend the selected text until the mouse
						pointer

		`).should.deep.equal(wrapNodes({
			type: 'table',
			children: [
				{
					type: 'tableRow',
					children: ['Left mouse click\t\tposition the cursor']
				},
				{
					type: 'tableRow',
					children: ['Left mouse drag\t\t\tselect text in Visual mode']
				},
				{
					type: 'tableRow',
					children: ['Middle mouse click\t\tpaste text from the clipboard']
				},
				{
					type: 'tableRow',
					children: ['Right mouse click\t\textend the selected text until the mouse', '\t\t\t\tpointer']
				}
			]
		}))
	);
	// }}}

	// Table directly following a command block (usr_24, 54) {{{
	it("table directly following a command block", () => getAST(`

		You need to change "follen" to "fallen".  With the cursor at the end, you
		would type this to correct it: >

							<Esc>4blraA

		<	get out of Insert mode		<Esc>
			four words back			     4b
			move on top of the "o"		       l
			replace with "a"			ra
			restart Insert mode			  A


		`).should.deep.equal(wrapNodes([
			{
				type: 'paragraph',
				children: [
					'You need to change "follen" to "fallen".  With the cursor at the end, you',
					'would type this to correct it: >',
				]
			},
			{
				type: 'commandBlock',
				children: ['\t\t\t\t\t<Esc>4blraA']
			},
			{
				type: 'table',
				children: [
					{ type: 'tableRow', children: ['<	get out of Insert mode		<Esc>'      ] },
					{ type: 'tableRow', children: ['	four words back			     4b'    ] },
					{ type: 'tableRow', children: ['	move on top of the "o"		       l'   ] },
					{ type: 'tableRow', children: ['	replace with "a"			ra' ] },
					{ type: 'tableRow', children: ['	restart Insert mode			  A'] },
				]
			},
		]))
	);
	// }}}

	// Table directly following a paragraph (usr_05, 563) {{{
	it("table directly following a paragraph", () => getAST(`

		Further reading:
		|filetype-plugins|	Documentation for the filetype plugins and information
					about how to avoid that mappings cause problems.

		`).should.deep.equal(wrapNodes([
			{
				type: 'paragraph',
				children: ['Further reading:']
			},
			{
				type: 'table',
				children: [{ type: 'tableRow', children: ['|filetype-plugins|	Documentation for the filetype plugins and information', '\t\t\tabout how to avoid that mappings cause problems.'] }]
			}
		]))
	);
	// }}}

	// Table directly following a paragraph (usr_06, 159) {{{
	it("table directly following a paragraph", () => getAST(`

		2. Edit the color scheme file.  These entries are useful:

			term		attributes in a B&W terminal
			cterm		attributes in a color terminal
			ctermfg		foreground color in a color terminal
			ctermbg		background color in a color terminal
			gui		attributes in the GUI
			guifg		foreground color in the GUI
			guibg		background color in the GUI

		`).should.deep.equal(wrapNodes({
			type: 'orderedList',
			children: [{
				type: 'listItem',
				children: [
					{
						type: 'paragraph',
						children: ['2. Edit the color scheme file.  These entries are useful:']
					},
					{
						type: 'table',
						children: [
							{ type: 'tableRow', children: ['\tterm\t\tattributes in a B&W terminal']            },
							{ type: 'tableRow', children: ['\tcterm\t\tattributes in a color terminal']         },
							{ type: 'tableRow', children: ['\tctermfg\t\tforeground color in a color terminal'] },
							{ type: 'tableRow', children: ['\tctermbg\t\tbackground color in a color terminal'] },
							{ type: 'tableRow', children: ['\tgui\t\tattributes in the GUI']                    },
							{ type: 'tableRow', children: ['\tguifg\t\tforeground color in the GUI']            },
							{ type: 'tableRow', children: ['\tguibg\t\tbackground color in the GUI']            },
						]
					}
				]
			}]
		}))
	);
	// }}}

});
/**
 * }}}
 */

});
/* eslint-enable smarter-tabs/smarter-tabs */

/**
 * Helpers
 * =============================================================================
 */

/**
 * Build and clean an AST from a snippet of text
 */
function getAST(text, indentLevel = 2)
{
	return cleanAST(buildAST(blocksUsr, text.split('\n').slice(1, -1).map(line => line.replace(generateStr(indentLevel, '\t'), ''))));
}

/**
 * Remove all the 'parent' properties from the nodes of an AST
 * Remove the 'children' property if it's an empty array
 * Turn text nodes into simple strings
 */
function cleanAST(node)
{
	node.children = node.children.map(child => cleanAST(child));

	delete node.parent;
	if (!node.children.length)
		delete node.children;

	return node.type == 'text' ? node.text : node;
}

/**
 * Wrap the expected nodes into a root node
 */
function wrapNodes(nodes)
{
	return {
		type:     'document',
		children: wrapArray(nodes),
	}
}
