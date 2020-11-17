
/**
 * processors/usr_toc.js
 */

const blocks    = require('../blocks/usr_toc.js');
const buildAST  = require('../parser/ast.js');
const buildHTML = require('../parser/html.js');

module.exports = function(lines) {
	// Remove the header and footer
	lines = lines.slice(56, -4);

	return buildHTML('usr_toc', blocks, buildAST(blocks, lines));
}
