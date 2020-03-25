
/**
 * vim-help/build.js
 *
 * Usage: build.js [TARGET]
 */

const { basename } = require('./src/helpers.js');

const fs           = require('fs');
const rm           = require('rimraf');
const walk         = require('klaw-sync');
const minify       = require('html-minifier').minify;

const BUILD_DIR    = `${__dirname}/public`;
const TIMESTAMP    = Date.now();
const TARGET       = process.argv[2]
const PRODUCTION   = process.NODE_ENV === 'production';

// Do nothing if no argument is given
if (process.argv.length <= 2) process.exit(0);

/**
 * Build
 */
switch (TARGET)
{
	case 'html':
		rm.sync(`${BUILD_DIR}/*.html`);
		require('./src/main.js');
		break;

	case 'css':
		rm.sync(`${BUILD_DIR}/*.css`);
		walk('src/styles').forEach(file => fs.copyFileSync(file.path, `${BUILD_DIR}/${basename(file.path)}-${TIMESTAMP}.css`));
		break;

	case 'js':
		rm.sync(`${BUILD_DIR}/*.js`);
		walk('src/scripts').forEach(file => fs.copyFileSync(file.path, `${BUILD_DIR}/${basename(file.path)}-${TIMESTAMP}.js`));
		break;
}

/**
 * Update the timestamps
 */
walk(BUILD_DIR).forEach(function(file)
{
	// Update the timestamps in the source code
	fs.writeFileSync(file.path, fs.readFileSync(file.path).toString().replace(/-\d{13}/g, `-${TIMESTAMP}`));

	// Update the timestamp in the filename
	if (/\.(?:css|js)$/.test(file.path))
		fs.renameSync(file.path, file.path.replace(/-\d{13}/, `-${TIMESTAMP}`));
});

/**
 * Post-processing
 */
if (PRODUCTION) walk(BUILD_DIR).filter(file => file.path.split('.').pop() == TARGET).forEach(function(file)
{
	switch(TARGET)
	{
		// Minify the HTML
		case 'html':
			fs.writeFileSync(file.path, minify(fs.readFileSync(file.path).toString(), {
				minifyJS:           true,
				removeComments:     true,
				collapseWhitespace: true,
			}));
			break;

		// Minify and auto-prefix the CSS
		case 'css':
			// @TODO
			break;

		// Minify the JS
		case 'js':
			// @TODO
			break;
	}
});
