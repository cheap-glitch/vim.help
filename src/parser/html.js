
/**
 * parser/html.js
 */

const { wrapArray       } = require('../helpers.js');
const { wrapHTML        } = require('../helpers.js');
const { escapeHTML      } = require('../helpers.js');

const { createTags      } = require('./inline.js');
const { wrapKeyBindings } = require('./inline.js');
const { wrapInlineCode  } = require('./inline.js');

/**
 * Build an HTML document from an AST
 */
module.exports = function(filename, blocks, ast)
{
	// Recursively build an HTML blob from an AST node
	const buildNodeHTML = function (node, parentBlock = {})
	{
		/**
		 * Plain text node
		 */
		if (node.type == 'text')
		{
			const text = escapeHTML(node.text);

			return ('transformLines' in parentBlock) ? parentBlock.transformLines(text) : text;
		}

		/**
		 * Block node
		 */
		const block         = blocks[node.type];
		const childNodeHTML = node.children.map(child => buildNodeHTML(child, block));

		const nodeHTML =
			// Optionally modify the block of lines
			(('transformBlock' in block) ? block.transformBlock(childNodeHTML) : childNodeHTML)
			// Only parse the tags in the low-level blocks (blocks that can't contain others)
			.map((block.containedBlocks.length || 'disableInlineParsing' in block) ? l => l : line => wrapInlineCode(wrapKeyBindings(createTags(filename, line))))

		// If the contents of a node are only whitespace, don't wrap it in an HTML tag
		if (nodeHTML.every(line => /^\s*$/.test(line))) return '';

		return typeof block.wrapper == 'function'
			? block.wrapper(nodeHTML)
			: wrapHTML.apply({}, [nodeHTML.join(' '), ...wrapArray(block.wrapper)]);
	}

	return buildNodeHTML(ast);
}
