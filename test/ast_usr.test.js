
/**
 * test/ast_usr.test.js
 */

const expect          = require('chai').expect;

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

	it("simple headers", () => expect(getAST(`

		==============================================================================
		Header

		==============================================================================
		*22.3* Header

		==============================================================================
		*22.3* Header *tag-target*

		`)).to.deep.equal(wrapNodes([
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

	it("simple headers", () => expect(getAST(`

		LOREM IPSUM

		DOLOR SIT AMET!?

		`)).to.deep.equal(wrapNodes([
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

	it("headers with tag targets", () => expect(getAST(`

		LOREM IPSUM		*target*

		DOLOR SIT AMET!?	*target-1* *target-2*

		`)).to.deep.equal(wrapNodes([
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

	it("single item", () => expect(getAST(`

		1) lorem ipsum

		`)).to.deep.equal(wrapNodes({
			type: 'orderedList',
			children: [
				{ type: 'listItem', children: [{ type: 'paragraph', children: ['1) lorem ipsum'] }] },
			]
		}))
	);

	it("single item with multiple lines", () => expect(getAST(`

		1) lorem ipsum
		   dolor sit amet

		`)).to.deep.equal(wrapNodes({
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

	it("multiple items", () => expect(getAST(`

		1) lorem ipsum

		2) dolor sit amet

		`)).to.deep.equal(wrapNodes({
			type: 'orderedList',
			children: [
				{ type: 'listItem', children: [{ type: 'paragraph', children: ['1) lorem ipsum'   ] }] },
				{ type: 'listItem', children: [{ type: 'paragraph', children: ['2) dolor sit amet'] }] },
			]
		}))
	);

	it("multiple items with multiple lines", () => expect(getAST(`

		1) lorem ipsum
		   dolor sit amet

		2) lorem ipsum
		   dolor sit amet

		`)).to.deep.equal(wrapNodes({
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

	it("embedded code blocks", () => expect(getAST(`

		1) lorem ipsum >
			:command
		<   dolor sit amet

		`)).to.deep.equal(wrapNodes({
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

	// usr_03 (232)
	it("embedded formatted text blocks", () => expect(getAST(`

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

		`)).to.deep.equal(wrapNodes({
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

	// usr_22 (50)
	it("multiple single-line items with no space between them", () => expect(getAST(`

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

		`)).to.deep.equal(wrapNodes([
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

	// usr_09 (221)
	it("starting with a dash and two spaces", () => expect(getAST(`

		-  Select two words in Visual mode.
		-  Use the Edit/Paste menu item.  What will happen is that the single selected
		   word is replaced with the two words from the clipboard.
		-  Move the mouse pointer somewhere else and click the middle button.  You
		   will see that the word you just overwrote with the clipboard is inserted
		   here.

		`)).to.deep.equal(wrapNodes({
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

	// usr_01 (11)
	it("simple table of contents", () => expect(getAST(`

		|01.1|	Two manuals
		|01.2|	Vim installed
		|01.3|	Using the Vim tutor
		|01.4|	Copyright

		`)).to.deep.equal(wrapNodes({
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

	it("simple note block", () => expect(getAST(`

			Note:
			lorem ipsum
			dolor sit amet

		`)).to.deep.equal(wrapNodes({
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

	it("note block with included command block", () => expect(getAST(`

			Note:
			lorem ipsum
			dolor sit amet >
				:command

		`)).to.deep.equal(wrapNodes({
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

	it("note block with included formatted text block", () => expect(getAST(`

			Note:
			lorem ipsum
			dolor sit amet
				text
			si vis pacem

		`)).to.deep.equal(wrapNodes({
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

	it("single paragraph with a single line", () => expect(getAST(`

		lorem ipsum

		`)).to.deep.equal(wrapNodes({
			type: 'paragraph',
			children: ['lorem ipsum'],
		}))
	);

	it("single paragraph with multiple lines", () => expect(getAST(`

		lorem ipsum
		dolor sit amet

		`)).to.deep.equal(wrapNodes({
			type: 'paragraph',
			children: ['lorem ipsum', 'dolor sit amet'],
		}))
	);

	it("multiple paragraphs with single line", () => expect(getAST(`

		lorem ipsum

		dolor sit amet

		ars longa, vita brevis

		`)).to.deep.equal(wrapNodes([
			{ type: 'paragraph', children: ['lorem ipsum']            },
			{ type: 'paragraph', children: ['dolor sit amet']         },
			{ type: 'paragraph', children: ['ars longa, vita brevis'] },
		]))
	);

	it("multiple paragraphs with multiple lines", () => expect(getAST(`

		lorem ipsum
		dolor sit amet

		ars longa, vita brevis
		veni, vidi, vici

		`)).to.deep.equal(wrapNodes([
			{ type: 'paragraph', children: ['lorem ipsum', 'dolor sit amet']              },
			{ type: 'paragraph', children: ['ars longa, vita brevis', 'veni, vidi, vici'] },
		]))
	);

	it("multiple paragraphs separated by an indent", () => expect(getAST(`

		lorem ipsum
		   dolor sit amet

		`)).to.deep.equal(wrapNodes([
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

		it("single line", () => expect(getAST(`

			lorem ipsum >
				command

			`, 3)).to.deep.equal(wrapNodes([
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

		it("multiple lines", () => expect(getAST(`

			lorem ipsum >
				command
				command

			`, 3)).to.deep.equal(wrapNodes([
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

		it("single line", () => expect(getAST(`

			lorem ipsum >
				command
			< dolor sit amet

			`, 3)).to.deep.equal(wrapNodes([
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

		it("multiple lines", () => expect(getAST(`

			lorem ipsum >
				command
				command
			< dolor sit amet

			`, 3)).to.deep.equal(wrapNodes([
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

		it("single line", () => expect(getAST(`

			1) lorem ipsum >
				command
			<   dolor sit amet

			`, 3)).to.deep.equal(wrapNodes({
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

		it("multiple lines", () => expect(getAST(`

			1) lorem ipsum >
				command
				command
			<   dolor sit amet

			`, 3)).to.deep.equal(wrapNodes({
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

		it("single line", () => expect(getAST(`

			9) lorem ipsum >
				command

			`, 3)).to.deep.equal(wrapNodes({
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

		it("multiple lines", () => expect(getAST(`

			9) lorem ipsum >
				command
				command

			`, 3)).to.deep.equal(wrapNodes({
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

		// usr_10 (675)
		it("before", () => expect(getAST(`

			The "gu" operator does exactly the opposite: >

						     guw
			<	SECTION header	    ---->      section header

			`, 3)).to.deep.equal(wrapNodes([
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

	it("single block with single line", () => expect(getAST(`

			lorem ipsum

		`)).to.deep.equal(wrapNodes({
			type: 'formattedText',
			children: ['\tlorem ipsum'],
		}))
	);

	it("single block with multiple lines", () => expect(getAST(`

			lorem ipsum
			dolor sit amet

		`)).to.deep.equal(wrapNodes({
			type: 'formattedText',
			children: ['\tlorem ipsum', '\tdolor sit amet'],
		}))
	);

	it("single block with line break", () => expect(getAST(`

			lorem ipsum
			dolor sit amet

			sic transit
			gloria mundi

		`)).to.deep.equal(wrapNodes({
			type: 'formattedText',
			children: ['\tlorem ipsum', '\tdolor sit amet', '\tsic transit', '\tgloria mundi'],
		}))
	);

	it("single block with line in the middle starting with spaces", () => expect(getAST(`

			lorem ipsum
			dolor sit amet
		    foobar
			sic transit
			gloria mundi

		`)).to.deep.equal(wrapNodes({
			type: 'formattedText',
			children: ['\tlorem ipsum', '\tdolor sit amet', '    foobar', '\tsic transit', '\tgloria mundi'],
		}))
	);

	it("multiple blocks mixed with paragraphs", () => expect(getAST(`

		lorem ipsum
			formatted
		dolor sit amet
			formatted

		`)).to.deep.equal(wrapNodes([
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

	it("single block with single line marked by a trailing '~'", () => expect(getAST(`

		  lorem ipsum ~

		`)).to.deep.equal(wrapNodes({
			type: 'formattedText',
			children: ['  lorem ipsum ~'],
		}))
	);

	// usr_03 (310)
	it("text block with some tabulations inside the lines", () => expect(getAST(`

			+------------------+		 +------------------+
			| earlier text	   |		 | earlier text	    |
			| earlier text	   |		 | earlier text	    |
			| earlier text	   |		 | earlier text	    |
			| earlier text	   |   zz  -->	 | line with cursor |
			| earlier text	   |		 | later text	    |
			| earlier text	   |		 | later text	    |
			| line with cursor |		 | later text	    |
			+------------------+		 +------------------+

		`)).to.deep.equal(wrapNodes({
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

	it("non-indented formatted block", () => expect(getAST(`

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

		`)).to.deep.equal(wrapNodes([
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

	// usr_08 (480)
	it("table with single-line rows", () => expect(getAST(`

		The 'laststatus' option can be used to specify when the last window has a
		statusline:

			0	never
			1	only when there are split windows (the default)
			2	always

		`)).to.deep.equal(wrapNodes([
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

	it("table with multiline rows", () => expect(getAST(`

			a	lorem ipsum
				dolor sit amet
			b	memento mori

		`)).to.deep.equal(wrapNodes({
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

	// usr_09 (150)
	it("table with no indentation", () => expect(getAST(`

		Left mouse click		position the cursor
		Left mouse drag			select text in Visual mode
		Middle mouse click		paste text from the clipboard
		Right mouse click		extend the selected text until the mouse
						pointer

		`)).to.deep.equal(wrapNodes({
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
