
/**
 * test/html_usr.test.js
 */

require('chai').should();

const buildHTML = require('../src/parser/html.js');
const blocksUsr = require('../src/blocks/usr.js');

// Helpers
const text   = str  => ({ type: 'text', text: str });
const build  = node => buildHTML('usr_01', blocksUsr, { type: 'document', children: [{ containedBlocks: [], ...node }] });
const inline = html => html.replace(/\t|\n/g, '').replace(/\[SPACE\]/g, ' ');

describe("html output", () => {

/**
 * Headers
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
	.should.equal('<h2 id="01.1"><a href="#01.1" class="header-anchor">01.1</a>Lorem ipsum<div class="targets-wrapper"><a id="tag-target" href="#tag-target" class="target">tag&#8209;target</a></div></h2>');

});

it("sub-section headers", () => {

	build({
		type: 'subSectionHeader',
		children: [text('LOREM IPSUM')],
	})
	.should.equal('<h3 id="lorem-ipsum"><a href="#lorem-ipsum" class="header-anchor">#</a>Lorem ipsum</h3>');

	build({
		type: 'subSectionHeader',
		children: [text('LOREM IPSUM *tag-target*')],
	})
	.should.equal('<h3 id="lorem-ipsum"><a href="#lorem-ipsum" class="header-anchor">#</a>Lorem ipsum<div class="targets-wrapper"><a id="tag-target" href="#tag-target" class="target">tag&#8209;target</a></div></h3>');

	build({
		type: 'subSectionHeader',
		children: [text('I HATE MS-WINDOWS')],
	})
	.should.equal('<h3 id="i-hate-ms-windows"><a href="#i-hate-ms-windows" class="header-anchor">#</a>I hate MS-Windows</h3>');

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

	it("simple ordered list", () =>
		build({
			type: 'orderedList',
			children: [
				{
					type: 'listItem',
					children: [{ type: 'paragraph', children: [text('first item')] }]
				},
				{
					type: 'listItem',
					children: [{ type: 'paragraph', children: [text('second'), text('item')] }]
				},
				{
					type: 'listItem',
					children: [{ type: 'paragraph', children: [text('third')] }, { type: 'paragraph', children: [text('item')] }]
				}
			]
		})
		.should.equal(inline(`
		<ol>
			<li><div class="li-contents"><p>first item</p></div></li>[SPACE]
			<li><div class="li-contents"><p>second item</p></div></li>[SPACE]
			<li><div class="li-contents"><p>third</p>[SPACE]<p>item</p></div></li>
		</ol>
		`))
	);

});

describe("unordered lists", () => {

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

});

describe("tables of contents", () => {

	it("simple ToC", () =>
		build({
			type: 'toc',
			children: [
				{
					type: 'tocItem',
					children: [text('|01.1|\tTwo manuals')]
				},
				{
					type: 'tocItem',
					children: [text('|01.2|\tVim installed')]
				},
				{
					type: 'tocItem',
					children: [text('|01.3|\tUsing the Vim tutor')]
				},
				{
					type: 'tocItem',
					children: [text('|01.4|\tCopyright')]
				}
			]
		})
		.should.equal(inline(`
		<ol class="table-of-contents">
			<p><strong>Table of contents</strong></p>[SPACE]
			<li><a href="#01.1">Two manuals</a></li>[SPACE]
			<li><a href="#01.2">Vim installed</a></li>[SPACE]
			<li><a href="#01.3">Using the Vim tutor</a></li>[SPACE]
			<li><a href="#01.4">Copyright</a></li>
		</ol>
		`))
	);

});
/**
 * }}}
 */

/**
 * Text blocks
 * {{{
 * =============================================================================
 */
describe("notes", () => {

	it("simple note block", () =>
		build({
			type: 'note',
			children: [
				text('\tNote:'),
				{
					type: 'paragraph',
					children: [
						text('\tLorem ipsum'),
						text('\tdolor sit amet'),
					]
				}
			]
		})
		.should.equal(`<div class="note"><p>Lorem ipsum dolor sit amet</p></div>`)
	);

});

describe("paragraphs", () => {

	it("paragraph with code markers", () =>
		build({
			type: 'paragraph',
			children: [
				text('<'),
				text('lorem ipsum >'),
			]
		})
		.should.equal(`<p> lorem ipsum</p>`)
	);

	it("warning", () =>
		build({
			type: 'paragraph',
			children: [text('WARNING: do NOT do this without doing that')]
		})
		.should.equal(`<p class="warning">WARNING: do NOT do this without doing that</p>`)
	);

	it("empty paragraph", () =>
		build({
			type: 'paragraph',
			children: [text('<')]
		})
		.should.equal(``)
	);

});

describe("command blocks", () => {

	it("single-line command block", () =>
		build({
			type: 'commandBlock',
			children: [text('\t:command param1 param2')]
		})
		.should.equal(`<pre class="command-block"><code>:command param1 param2</code></pre>`)
	);

	it("multi-line command block", () =>
		build({
			type: 'commandBlock',
			children: [
				text('\t:command param1 param2'),
				text('\t:otherCommand'),
			]
		})
		.should.equal(`<pre class="command-block"><code>:command param1 param2\n:otherCommand</code></pre>`)
	);

});

describe("formatted text", () => {

	it("single-line formatted text block", () =>
		build({
			type: 'formattedText',
			children: [text('\tlorem ipsum ~')]
		})
		.should.equal(`<pre>lorem ipsum</pre>`)
	);

	it("multi-line formatted text block", () =>
		build({
			type: 'formattedText',
			children: [
				text('\t+-----------+'),
				text('\t|           |'),
				text('\t|    VIM    |'),
				text('\t|           |'),
				text('\t+-----------+'),
			]
		})
		.should.equal(`<pre>+-----------+\n|           |\n|    VIM    |\n|           |\n+-----------+</pre>`)
	);

	it("warning message", () =>
		build({
			type: 'formattedText',
			children: [text('\tW123: this is a warning ~')]
		})
		.should.equal(`<pre class="message-warning">W123: this is a warning</pre>`)
	);

	it("warning message", () =>
		build({
			type: 'formattedText',
			children: [text('\tE123: this is an error ~')]
		})
		.should.equal(`<pre class="message-error">E123: this is an error</pre>`)
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

	it("table with single-line rows", () =>
		build({
			type: 'table',
			children: [
				{
					type: 'tableRow',
					children: [text('\t0\tnever')]
				},
				{
					type: 'tableRow',
					children: [text('\t1\tonly when there are split windows (the default)')]
				},
				{
					type: 'tableRow',
					children: [text('\t2\talways')]
				}
			]
		}).should.equal(inline(`
		<table>
			<tr><td><code>0</code></td><td>never</td></tr>[SPACE]
			<tr><td><code>1</code></td><td>only when there are split windows (the default)</td></tr>[SPACE]
			<tr><td><code>2</code></td><td>always</td></tr>
		</table>
		`))
	);

	it("table with multi-line rows", () =>
		build({
			type: 'table',
			children: [
				{
					type: 'tableRow',
					children: [text('\ta\tlorem ipsum'), text('\t\tdolor sit amet')]
				},
				{
					type: 'tableRow',
					children: [text('\tb\tmemento mori')]
				}
			]
		}).should.equal(inline(`
		<table>
			<tr><td><code>a</code></td><td>lorem ipsum dolor sit amet</td></tr>[SPACE]
			<tr><td><code>b</code></td><td>memento mori</td></tr>
		</table>
		`))
	);

	it("table with headers", () =>
		build({
			type: 'table',
			children: [
				{
					type: 'tableHeader',
					children: [text('\tsystem\t\tplugin directory ~')]
				},
				{
					type: 'tableRow',
					children: [text('\tUnix or Linux\t\t~/.vim/plugin/')]
				}
			]
		}).should.equal(inline(`
		<table>
			<tr><th>system</th><th>plugin directory</th></tr>[SPACE]
			<tr><td>Unix or Linux</td><td><code>~/.vim/plugin/</code></td></tr>
		</table>
		`))
	);

});
/**
 * }}}
 */

});
