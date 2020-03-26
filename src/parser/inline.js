
/**
 * parser/inline.js
 */

const { basename           } = require('../helpers.js');
const { toKebabCase        } = require('../helpers.js');
const { wrapHTML           } = require('../helpers.js');
const { getRawFileContents } = require('../helpers.js');

const files = require('../files.js');

// Read the tags file to get the list of tags
const tags = getRawFileContents('tags').filter(line => line.length).reduce(function(result, line)
{
	const [tag, file] = line.split('\t');
	result[tag] = basename(file);

	return result;
}, {});

/**
 * Parse and create the tags in a blob of raw text
 */
function createTags(filename, text)
{
	return text

	/**
	 * Parse the Vim tags (|tag|)
	 * ---------------------------------------------------------------------
	 */

	.replace(/\|([^ \t|]+)\|/g, function(_, tag)
	{
		// Don't do anything if the tag is not in the list
		if (!tags[tag]) return tag;

		/**
		 * If the tag points to another page, or to a section of the user manual,
		 * turn the tag into a simple anchor with the title of the page or section
		 */

		// Page
		if (tag.endsWith('.txt') && (tag.slice(0, -4) in files))
		{
			return wrapHTML(`${tag.slice(4, -4)}. "${files[tag.slice(0, -4)]}"`, 'a', { href: `/${toKebabCase(files[tag.slice(0,-4)])}` });
		}

		// User manual section
		if (/^\d{2}\.\d{1,2}$/.test(tag))
		{
			// Get the title of the section from the file contents
			const file  = tags[tag];
			const title = getRawFileContents(`${file}.txt`).find(line => line.startsWith(`*${tag}*`))
				// Remove potential targets from the section title
				.replace(/\*.+?\*/g, '').trim();

			return wrapHTML(`${tag}: "${title}"`, 'a', { href: `/${toKebabCase(files[file])}` });
		}

		/**
		 * Else, turn the text in a visual tag and
		 * an anchor pointing to the corresponding target
		 */
		const link = getLinkToTag(filename, tag);

		// Don't create a tag if the target doesn't exists
		if (!link) return tag;

		// Compute the type of tag
		let type = 'link';
		if (tag.startsWith(':'))
			type = 'command';
		else if (tag.startsWith("'") && tag.endsWith("'"))
			type = 'option';

		return wrapHTML(tag.replace(/^'|'$/g, ''), 'a', { href: link, class: `tag ${type}` });
	})

	/**
	 * Create supplementary tags
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Option names ('option')
	 */
	.replace(/'([a-z]+)'/g, function(option, name)
	{
		const link = getLinkToTag(filename, option);

		// Don't create a tag if the key binding is not in the list or the target doesn't exists
		if (!tags[option] || !link) return wrapHTML(option, 'code');

		return wrapHTML(name, 'a', {
			href:  link,
			class: 'tag option',
		});
	})
}

/**
 * Wrap key bindings in <kbd> tags
 */
function wrapKeyBindings(text)
{
	return text

	/**
	 * Key bindings (<Key>, <S-Key>, etc.)
	 */
	.replace(/(^|\b)&lt;[A-Z][A-Za-z-]+&gt;/g, keybinding => wrapHTML(keybinding, 'kbd'))

	/**
	 * Control-based key bindings (CTRL-*)
	 *
	 * Several key bindings can follow each other,
	 * in that case they are part of a single key binding
	 *
	 * Also replace the hyphen with a non-breaking hyphen
	 * to prevent the key binding from being split between two lines
	 */
	.replace(/(?:(?:^|\b)CTRL-(?:[^&]|Break)(?: (?=C))?)+/g, keybinding => wrapHTML(keybinding.replace('-', '&#8209;'), 'kbd'))
}

/**
 * Wrap some elements of a raw text blob in <code> tags
 */
function wrapInlineCode(text)
{
	return text

	/**
	 * Double-quoted & back-quoted text with no space in it ("foobar", `foobar`)
	 *
	 * Also turn a potential trailing space into a non-breaking space
	 * to prevent it from collapsing with a space in the text after the <code> tag
	 */
	.replace(/(?:&quot;|`)([^ <>]+?)(?:&quot;|`)/g, (_, text) => wrapHTML(text.replace(/ $/, '&nbsp;'), 'code'))

	/**
	 * Double-quoted text starting with ':' and spaces in it (":command arg")
	 */
	.replace(/&quot;(:[^<>]+?)&quot;/g, (_, text) => wrapHTML(text, 'code'))

	/**
	 * Register names ("a, "b, "=, etc.)
	 */
	.replace(/&quot;[a-z=](?= )/g, register => wrapHTML(register, 'code'))

	/**
	 * Filenames (file.c, script.vim, etc.)
	 */
	.replace(/\w+\.(?:bat|c|h|txt|vim)/g, name => wrapHTML(name, 'code'))

	/**
	 * Variable names ($var, $VAR)
	 */
	.replace(/(^|\b)\$\w+/g, name => wrapHTML(name, 'code'))

	/**
	 * Single-character key bindings
	 */
	.replace(/(?<=press )[a-zA-Z]\b/g, key => wrapHTML(key, 'code'))

	/**
	 * Other special characters
	 */
	.replace(/(?:^|(?<= ))(?:\(\)|\[\]|\{\}|&lt;|&gt;|[$^.,?`%/()[\]])(?:(?=[ ,.])|$)/g, character => wrapHTML(character, 'code'))

}

/**
 * Helpers
 * =============================================================================
 */

/**
 * Return a link pointing to a target whose ID is the tag
 * If the tag is not in the list, return 'null'
 */
function getLinkToTag(filename, tag)
{
	return tags[tag] == filename

		// The target is in the same file
		? `#${encodeURIComponent(tag)}`

		// The target is in a different file
		: files[tags[tag]]
			? `/${toKebabCase(files[tags[tag]])}${tag !== `${tags[tag]}.txt` ? `#${encodeURIComponent(tag)}` : ''}`
			: null;
}

module.exports = {
	createTags,
	wrapKeyBindings,
	wrapInlineCode,
	getLinkToTag,
};
