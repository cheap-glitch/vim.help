
/**
 * src/files.js
 */

const walk                   = require('klaw-sync');

const { basename           } = require('./helpers.js');
const { isUserManual       } = require('./helpers.js');
const { getRawFileContents } = require('./helpers.js');

const files = {
	index:    'Vim Index',
	usr_toc:  'Table of contents',
}

// Get the title of each help file
walk('raw').filter(file => file.path.endsWith('.txt')).forEach(function(file)
{
	const filename = basename(file.path);

	if (!(filename in files))
	{
		files[filename] = isUserManual(filename)
			// For the pages of the user manual, the title is always on the fourth line
			? getRawFileContents(`${filename}.txt`)[4].trim()
			// Else, just take the name of the raw file
			: filename;
	}
});

module.exports = files;
