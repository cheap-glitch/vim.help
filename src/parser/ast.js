
/**
 * parser/ast.js
 */

function Node(parent, type, text = null)
{
	this.type     = type;
	this.parent   = parent;
	this.children = [];

	if (text !== null) this.text = text;
}

/**
 * Build an AST from an array of lines according to a set of block definitions
 */
module.exports = function(blocks, lines)
{
	// Initialize the AST with the root node
	const ast = new Node(null, 'document');

	let currentNode      = ast;
	let nbConsEmptyLines = 0;

	lines.forEach(function(line, index)
	{
		// Update the count of consecutive empty lines
		nbConsEmptyLines = line.length ? 0 : nbConsEmptyLines + 1;

		// Generate the context object
		const context = {
			line, index,

			previousLine: index > 0                ? lines[index - 1] : '',
			nextLine:     index < lines.length - 1 ? lines[index + 1] : '',
			emptyLines:   nbConsEmptyLines,

			current:      currentNode,
			parent:       currentNode.parent || {},
		};

		// Check recursively for the possible start of a new child node
		let childNodeType;
		while ((childNodeType = blocks[currentNode.type].containedBlocks.find(type => blocks[type].start(context))) !== undefined)
		{
			// Create a new child node and add it to the current node
			const childNode = new Node(currentNode, childNodeType);
			currentNode.children.push(childNode);

			// Move to the new child node
			currentNode     = childNode;
			context.current = currentNode;
			context.parent  = currentNode.parent;
		}

		// Insert the line into the current node if it's not empty
		if (line.length) currentNode.children.push(new Node(currentNode, 'text', line));

		// Check recursively for the end of the current node
		while (blocks[currentNode.type].end(context))
		{
			currentNode     = currentNode.parent;
			context.current = currentNode;
			context.parent  = currentNode.parent || {};
		}
	});

	return removeUnwrappedTextNodes(removeEmptyNodes(ast));
}

/**
 * Cleaners
 * =============================================================================
 */

/**
 * Remove textual nodes that are direct descendants of the document
 */
function removeUnwrappedTextNodes(ast)
{
	ast.children = ast.children.filter(childNode => childNode.type != 'text');

	return ast;
}

/**
 * Remove non-textual nodes with no children
 */
function removeEmptyNodes(node)
{
	node.children.forEach(childNode => removeEmptyNodes(childNode));
	node.children = node.children.filter(childNode => childNode.type == 'text' || childNode.children.length)

	return node;
}
