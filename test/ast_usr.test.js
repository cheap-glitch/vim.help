
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
 * Section headers
 * {{{
 * =============================================================================
 */
describe("section headers", () => {

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

	it("embedded code blocks", () => getAST(`

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

	/**
	 * usr_03 (232)
	 */
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

	/**
	 * usr_22 (50)
	 */
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
					{ type: 'listItem',  children: [{ type: 'paragraph', children: ['6.  A listing of files, including "../", which allows one to list', '    the parent directory.']  }] },
				]
			},
			{
				type: 'paragraph',
				children: ['If you have syntax highlighting enabled, the different parts are highlighted', 'so as to make it easier to spot them.']
			}
		]))
	);

	/**
	 * usr_24 (159)
	 */
	it("indented list", () => getAST(`

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

	/**
	 * usr_09 (221)
	 */
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

	/**
	 * usr_06 (55)
	 */
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

	/**
	 * usr_01 (11)
	 */
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

	/**
	 * With paragraphs
	 * {{{
	 * ---------------------------------------------------------------------
	 */
	describe("after a paragraph", () => {

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

	});

	describe("between two paragraphs", () => {

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

	});
	/**
	 * }}}
	 */

	/**
	 * With list items
	 * {{{
	 * ---------------------------------------------------------------------
	 */
	describe("inside a list item", () => {

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

	});

	describe("at the end of a list", () => {

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

	});
	/**
	 * }}}
	 */

	/**
	 * With formatted text blocks
	 * {{{
	 * ---------------------------------------------------------------------
	 */
	describe("adjoining a formatted text block", () => {

		/**
		 * usr_10 (675)
		 */
		it("before", () => getAST(`

			The "gu" operator does exactly the opposite: >

						     guw
			<	SECTION header	    ---->      section header

			`, 3).should.deep.equal(wrapNodes([
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

	});
	/**
	 * }}}
	 */

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

	it("single block with single line marked by a trailing '~'", () => getAST(`

		  lorem ipsum ~

		`).should.deep.equal(wrapNodes({
			type: 'formattedText',
			children: ['  lorem ipsum ~'],
		}))
	);

	/**
	 * usr_03 (310)
	 */
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

	/**
	 * usr_08 (480)
	 */
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

	it("table with multiline rows", () => getAST(`

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

	/**
	 * usr_09 (150)
	 */
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
