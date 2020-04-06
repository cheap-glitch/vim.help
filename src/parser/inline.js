
/**
 * parser/inline.js
 */

const { basename           } = require('../helpers.js');
const { isUserManual       } = require('../helpers.js');
const { toKebabCase        } = require('../helpers.js');
const { wrapHTML           } = require('../helpers.js');
const { removeTagTargets   } = require('../helpers.js');
const { getRawFileContents } = require('../helpers.js');

const files = require('../files.js');

// Read the tags file to get the list of tags
const tags = getRawFileContents('tags').filter(line => line.length).reduce(function(result, line)
{
	const [tag, file] = line.split('\t');
	result[tag] = basename(file);

	return result;
}, {});

function formatInlineText(filename, line)
{
	return line

	/**
	 * Vim tags (|tag|)
	 * =====================================================================
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
			return '“' + wrapHTML(files[tag.slice(0, -4)], 'a', { href: getLinkToTag(filename, tag) }) + '”';
		}

		// User manual section
		if (/^\d{2}\.\d{1,2}$/.test(tag))
		{
			// Get the title of the section from the file contents
			const file  = tags[tag];
			const title = removeTagTargets(getRawFileContents(`${file}.txt`).find(line => line.startsWith(`*${tag}*`)));

			return '“' + wrapHTML(title, 'a', { href: getLinkToTag(filename, tag) }) + '”';
		}

		/**
		 * Else, turn the text in a visual tag and
		 * an anchor pointing to the corresponding target
		 */
		const link = getLinkToTag(filename, tag);

		// Don't create a tag if the target doesn't exist
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
	 * Supplementary tags
	 * =====================================================================
	 */

	/**
	 * Option names ('option')
	 */
	.replace(/(?:^|(?<= ))'([a-z]+)'/g, function(option, name)
	{
		const link = getLinkToTag(filename, option);

		// Don't create a tag if the key binding is not in the list or the target doesn't exists
		if (!tags[option] || !link) return wrapHTML(option, 'code');

		return wrapHTML(name, 'a', {
			href:  link,
			class: 'tag option',
		});
	})

	/**
	 * Key bindings
	 * =====================================================================
	 *
	 * Wrap key bindings in <kbd> tags
	 *
	 * Also replace the hyphens with non-breaking hyphens
	 * to prevent the key bindings from being split between two lines
	 */

	/**
	 * Key bindings (<Key>, <S-Key>, etc.)
	 */
	.replace(/(?:^|(?<=(?: |&gt;)))&lt;[A-Z][A-Za-z-]+&gt;/g, keybinding => wrapHTML(keybinding.replace(/-/g, '&#8209;'), 'kbd'))

	/**
	 * Control-based key bindings followed by extra key presses (CTRL-* **)
	 */
	.replace(/(?:^|\b)(CTRL-(?:&quot;|[^& ])) ((?:&quot;|[^ ]){1,3}(?:(?=[ ),.])|$))/g, function(_, keybinding, extra)
	{
		const parsedKeybinding = wrapHTML(keybinding.replace(/-/g, '&#8209;'), 'kbd');
		const parsedExtra      = !extra
			// Check that the extra key presses are not a word
			|| (extra.length == 2 && ['an', 'is', 'on'].includes(extra))
			// Only the CTRL-V key binding can be combined with three extra key presses
			|| (extra.length == 3 && keybinding != 'CTRL-V')
		? null : extra;

		return parsedExtra ? wrapHTML(`${parsedKeybinding} ${parsedExtra}`, 'code') : `${parsedKeybinding} ${extra || ''}`;
	})

	/**
	 * Control-based key bindings
	 *
	 * If two CTRL key bindings follow each other,
	 * they are part of a single compound key binding
	 */
	.replace(/(?:^|\b)CTRL-(?:&quot;|Break|[^& ])(?: CTRL-[A-Z])?/g, keybinding => wrapHTML(keybinding.replace(/-/g, '&#8209;'), 'kbd'))

	/**
	 * Inline code & commands
	 * =====================================================================
	 *
	 * Wrap some elements in <code> tags
	 */

	/**
	 * Double-quoted & back-quoted text with no space in it ("foobar", `foobar`)
	 *
	 * Also turn a potential trailing space into a non-breaking space
	 * to prevent it from collapsing with a space in the text after the <code> tag
	 */
	.replace(/(?:&quot;|`)([^ ]+?)(?:&quot;|`)/g, (_, text) => wrapHTML(text.replace(/ $/, '&nbsp;'), 'code'))

	/**
	 * Double-quoted text starting with ':' or '#' and spaces in it (":command arg", "#ifdef FOO")
	 */
	.replace(/&quot;([:#][^<>]+?)&quot;/g, (_, text) => wrapHTML(text, 'code'))

	/**
	 * Register names ("a, "b, "=, etc.)
	 */
	.replace(/&quot;[a-z=](?= )/g, register => wrapHTML(register, 'code'))

	/**
	 * Marks
	 */
	.replace(/(?:^|(?<= ))['`](?:&quot;|.)(?:(?= )|$)/g, mark => wrapHTML(mark, 'code'))

	/**
	 * Filenames (file.c, script.vim, etc.)
	 */
	.replace(/(?:^|(?<= ))\w+\.(?:bat|c|h|txt|vim)/g, name => wrapHTML(name, 'code'))

	/**
	 * Variable names ($var, $VAR)
	 */
	.replace(/(?:^|(?<= ))\$\w+/g, name => wrapHTML(name, 'code'))

	/**
	 * Single-character key bindings & register names
	 */
	.replace(/(?<=(press |register ))[a-zA-Z]\b/g, key => wrapHTML(key, 'code'))

	/**
	 * Special characters used alone or in matching pairs
	 */
	.replace(/(?:^|(?<= ))(?:\(\)|\[\]|\{\}|&lt;|&gt;|[$^.,!?'"`%/\\()[\]])(?:(?=[ ,.])|$)/g, character => wrapHTML(character, 'code'))
	.replace(/(?<=\()[:/](?=\))/g, character => wrapHTML(character, 'code'))

	/**
	 * Other special snippets
	 */

	// usr_01 (12)
	.replace('&quot;vimtutor -g&quot;', wrapHTML('vimtutor -g', 'code'))

	// usr_29 (428)
	.replace('&quot;/* - */&quot;', wrapHTML('/* - */', 'code'))

	/**
	 * Others
	 * =====================================================================
	 */

	/**
	 * Turn URLs into anchors
	 *
	 * Don't capture dots at the end of sentences or lines,
	 * as they are punctuation and not part of the URL
	 */
	.replace(/https?:\/\/(?:\.(?=[^ ])|[^ (),.])+/g, link => wrapHTML(link, 'a', { href: link }))

	/**
	 * Make text surrounded by underscores bold (_word_)
	 */
	.replace(/(?:^|(?<= ))_([^_ ]+)_(?:(?= )|$)/g, (_, word) => wrapHTML(word, 'strong'))
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
			? '/'
				// Chapter number (only for the user manual pages)
				+ (isUserManual(tags[tag]) ? `${tags[tag].slice(4)}-` : '')
				// Page title
				+ toKebabCase(files[tags[tag]])
				// Tag anchor
				+ (tag !== `${tags[tag]}.txt` ? `#${encodeURIComponent(tag)}` : '')
			: null;
}

module.exports = {
	formatInlineText,
	getLinkToTag,
};
