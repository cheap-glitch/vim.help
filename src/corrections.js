
/**
 * src/corrections.js
 */

module.exports = {

	/**
	 * 01. About the manuals
	 */
	usr_01: {
		// Remove indent and add missing full stop at the end of the line
		168: line => line.trim() + '.',
	},

	/**
	 * 02. The first steps in Vim
	 */
	usr_02: {
		// Add missing full stop at the end of the line
		695: line => line + '.',
	},

	/**
	 * 04. Making small changes
	 */
	usr_04: {
		// Add missing 's'
		467: line => line.replace('correction', 'corrections'),
	},

	/**
	 * 05. Set your settings
	 */
	usr_05: {
		// Surround @@@ with double quotes
		236: line => line.replace('@@@', '"@@@"'),

		// Replace the mixed indentation by two tabs
		412: line => line.replace('\t   \t', '\t\t'),
	},

	/**
	 * 10. Making big changes
	 */
	usr_10: {
		// Add missing ending double-quote
		447: line => line.replace('"$A XXX<Esc>', '"$A XXX<Esc>"'),
	},

	/**
	 * 21. Go away and come back
	 */
	usr_21: {
		// Turn formatted block into unordered list
		'96-100': line => line.replace('\t', '- '),
	},

	/**
	 * 24. Inserting quickly
	 */
	usr_24: {
		// Remove indentation before digraph table
		'552-554': line => line.replace(/^\s+/, ''),

		// Fix column alignment
		554: line => line.replace('--', '-- '),
	},

	/**
	 * 29. Moving through programs
	 */
	usr_29: {
		// Add double quotes around comment delimiters
		428: line => line.replace('/* - */', '"/* - */"'),
	},

};
