
/**
 * src/postprocess.js
 */

const fs           = require('fs');
const path         = require('path');
const walk         = require('klaw-sync');

const { basename } = require('./helpers.js');

const BUILD_DIR    = path.resolve(__dirname, '../public');
const BASE_URL     = 'https://vim.help';

/**
 * Minify and process the source files
 */
walk(BUILD_DIR).forEach(async function(file) {
	const minify       = require('html-minifier').minify;
	const terser       = require('terser');
	const postcss      = require('postcss');
	const autoprefixer = require('autoprefixer');
	const cssnano      = require('cssnano');

	const source = fs.readFileSync(file.path).toString();

	switch(file.path.split('.').pop()) {
		// Minify the HTML
		case 'html':
			try {
				fs.writeFileSync(file.path, minify(source, {
					minifyJS:           true,
					removeComments:     true,
					collapseWhitespace: true,
				}));
			} catch (error) {
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

/**
 * Generate a sitemap
 */
fs.writeFileSync(`${BUILD_DIR}/sitemap.xml`,
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${walk(BUILD_DIR)
	.filter(file => file.path.endsWith('.html'))
	.map(file => `\t<url><loc>${BASE_URL}/${basename(file.path) != 'index' ? basename(file.path) : '/' }</loc></url>`)
	.join('\n')}
</urlset>`
);
