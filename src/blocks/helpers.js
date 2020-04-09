
/**
 * blocks/helpers.js
 */

module.exports = {

	/**
	 * Put the first cell of a table row in its own separate line
	 */
	splitFirstCell(lines)
	{
		return [lines[0].split('\t')[0], ...lines[0].replace(/\t{2,}/g, '\t').split('\t').slice(1), ...lines.slice(1)];
	},

	/**
	 * Check if a line is an horizontal separator
	 */
	isSeparator(line)
	{
		return line.startsWith('=====');
	},

	/**
	 * Check if a line is empty
	 */
	isEmpty(line)
	{
		return !line.length;
	},

};
