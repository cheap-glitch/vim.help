
/**
 * src/helpers.js
 */

const fs   = require('fs');
const path = require('path');

module.exports = {

	/**
	 * HTML
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Wrap a blob of text in an HTML tag
	 */
	wrapHTML(text, tag, attrs = {}) {
		return `<${tag}${Object.keys(attrs).filter(attr => !!attrs[attr]).map(attr => ` ${attr}="${attrs[attr]}"`).join('')}>${text}</${tag}>`;
	},

	/**
	 * Escape sensitive HTML characters
	 */
	escapeHTML(text) {
		return text
			.replace(/&/g,  '&amp;')
			.replace(/</g,   '&lt;')
			.replace(/>/g,   '&gt;')
			.replace(/"/g, '&quot;');
	},

	/**
	 * Strings
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Remove tag targets (*foo-bar*) from a blob of text
	 */
	removeTagTargets(text) {
		return text.replace(/\*[^ ]+?\*/g, '').trim();
	},

	/**
	 * Generate a string containing the same character repeated n times
	 */
	generateStr(n, character) {
		return Array(n).fill(character).join('');
	},

	/**
	 * Convert a string to kebab-case
	 */
	toKebabCase(str) {
		return str.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '');
	},

	/**
	 * Replace the hyphens in a string with non-breaking
	 * hyphens to prevent tags from being split between two lines
	 */
	solidifyHyphens(str) {
		return str.replace(/-/g, '&#8209;');
	},

	/**
	 * Files
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Return the array of lines from a raw text file and remove trailing whitespace
	 */
	getRawFileContents(filename) {
		return fs.readFileSync(path.resolve(__dirname, `../raw/${filename}`)).toString().replace(/[ \t]+$/gm, '').split('\n');
	},

	/**
	 * Return 'true' if the file is a page of the user manual
	 */
	isUserManual(filename) {
		return /^usr_\d{2}$/.test(filename);
	},

	/**
	 * Strip the path and extension from a filename
	 */
	basename(path) {
		return path.split('/').pop().split('.')[0];
	},

	/**
	 * Others
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Wrap a value in an array if it's not one already
	 */
	wrapArray(value) {
		return Array.isArray(value) ? value : [value];
	},

};
