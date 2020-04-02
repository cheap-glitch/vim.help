
/**
 * src/fixes.js
 */

module.exports = {

	/**
	 * "The first steps in Vim"
	 */
	usr_02: {
		// Add missing full stop at the end of the line
		695: line => line + '.',
	},

	/**
	 * "Making small changes"
	 */
	usr_04: {
		// Add missing 's'
		467: line => line.replace('correction', 'corrections'),
	},

	/**
	 * "Set your settings"
	 */
	usr_05: {
		// Replace the mixed indentation by two tabs
		412: line => line.replace('\t   \t', '\t\t'),
	},

	/**
	 * "Making big changes"
	 */
	usr_10: {
		// Add missing ending double-quote
		447: line => line.replace('"$A XXX<Esc>', '"$A XXX<Esc>"'),
	},

	/**
	 * "Inserting quickly"
	 */
	usr_24: {
		// Remove indentation before digraph table
		552: line => line.replace(/^\s+/, ''),
		553: line => line.replace(/^\s+/, ''),
		554: line => line.replace(/^\s+/, '')
			// Fix column alignment
			.replace('--', '-- '),
	},

	/**
	 * "Moving through programs"
	 */
	usr_29: {
		// Add double quotes around comment delimiters
		428: line => line.replace('/* - */', '"/* - */"'),
	},

};
