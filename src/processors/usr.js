
/**
 * processors/usr.js
 */

const blocks    = require('../blocks/usr.js');
const buildAST  = require('../parser/ast.js');
const buildHTML = require('../parser/html.js');

module.exports = function(filename, lines)
{
	// Remove the header and footer
	lines = lines.slice(7, -5);

	// Remove the chapter links
	lines = lines.filter(line =>
		   !line.startsWith('     Next chapter:')
		&& !line.startsWith(' Previous chapter:')
		&& !line.startsWith('Table of contents:')
	);

	return buildHTML(filename, blocks, buildAST(blocks, lines));
}
