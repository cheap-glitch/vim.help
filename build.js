
/**
 * vim-help/build.js
 *
 * Usage: build.js [TARGET]
 */

const { basename } = require('./src/helpers.js');

const fs           = require('fs');
const path         = require('path');
const rm           = require('rimraf');
const walk         = require('klaw-sync');

const minify       = require('html-minifier').minify;
const terser       = require('terser');
const postcss      = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano      = require('cssnano');

const BUILD_DIR    = path.resolve(__dirname, './public');
const TIMESTAMP    = Date.now();
const TARGET       = process.argv[2]
const PRODUCTION   = process.env.NODE_ENV === 'production';

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
if (PRODUCTION) walk(BUILD_DIR).filter(file => file.path.split('.').pop() == TARGET).forEach(async function(file)
{
	const source = fs.readFileSync(file.path).toString();

	switch(TARGET)
	{
		// Minify the HTML
		case 'html':
			try {
				fs.writeFileSync(file.path, minify(source, {
					minifyJS:           true,
					removeComments:     true,
					collapseWhitespace: true,
				}));
			}
			catch (error) {
				console.info(`${file.path}`);
				console.error(error);
			}
			break;

		// Minify and auto-prefix the CSS
		case 'css':
			fs.writeFileSync(file.path, await postcss([autoprefixer, cssnano]).process(source));
			break;

		// Minify the JS
		case 'js':
			fs.writeFileSync(file.path, terser.minify(source).code);
			break;
	}
});
