
/**
 * src/postprocess.js
 */

const fs        = require('fs');
const path      = require('path');
const walk      = require('klaw-sync');

const BUILD_DIR = path.resolve(__dirname, '../public');

walk(BUILD_DIR).forEach(async function(file)
{
	const minify       = require('html-minifier').minify;
	const terser       = require('terser');
	const postcss      = require('postcss');
	const autoprefixer = require('autoprefixer');
	const cssnano      = require('cssnano');

	const source = fs.readFileSync(file.path).toString();

	switch(file.path.split('.').pop())
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
