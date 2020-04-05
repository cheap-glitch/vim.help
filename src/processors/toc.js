
/**
 * processors/toc.js
 */

const blocks    = require('../blocks/toc.js');
const buildAST  = require('../parser/ast.js');
const buildHTML = require('../parser/html.js');

module.exports = function(lines, filename)
{
	return buildHTML(filename, blocks, buildAST(blocks, lines.slice(56, -4)));
}
