## How to contribute

Here are a few suggestions to contribute to the project:
  * check the pages for any broken formatting and [report it](https://github.com/cheap-glitch/vim.help/issues/new?labels=bug%2C+parser&template=01_broken_formatting.md)
    (and you'll learn about Vim as a bonus!)
  * write a parser for some unprocessed help files (cf. [About the parser](#about-the-parser))
  * improve the HTML/CSS wrapper

## Contributing guidelines

1. Consider **opening an issue before submitting any sizable PR**, especially if
   it touches on the internal logic of the parser.

2. Try your best to respect the code style:
    * [smart  tabs](https://www.emacswiki.org/emacs/SmartTabs):  tablatures  for
      indentation, spaces for presentation
    * block-opening curly quotes on their  own lines (expect for objects and CSS
      blocks)
    * comments  and commit messages in  the imperative style, with  an uppercase
      letter at the beginning and no full stop at the end

3. If you modify or add to the  behaviour of the parser, **please write or adapt
   the tests** needed to  cover the newly supported cases.  Tests are absolutely
   essential to the long-term maintenance of the code!
   Current code coverage: [![codecov](https://codecov.io/gh/cheap-glitch/vim.help/branch/master/graph/badge.svg)](https://codecov.io/gh/cheap-glitch/vim.help)

## About the parser

### General operation

Each raw help  file is parsed and turned  into an HTML blob. The  process is the
same for every file:

1. The parser reads  the file line by line and creates a  tree of nodes from it.
   Each  node represents  an HTML  element,  and therefore  has a  type and  can
   optionally contain several children
   (cf. [`parser/ast.js`](https://github.com/cheap-glitch/vim.help/blob/master/src/parser/ast.js))

2. The parser then recursively reduces the  tree to an HTML string, wrapping the
   contents of each  node in its corresponding HTML tag.  During this step, text
   nodes are  also parsed for inline  tags and other special  text elements (key
   bindings, placeholders, etc.)
   (cf. [`parser/html.js`](https://github.com/cheap-glitch/vim.help/blob/master/src/parser/html.js))

What will change, depending on the help file being processed, is the definitions
of the  "blocks" used by  the parser. This tells  the parser when  to open/close
nodes, which nodes can  contain which, and how to process and  wrap the nodes to
produce an HTML string.
  * For the user manual pages, cf. [`blocks/usr.js`](https://github.com/cheap-glitch/vim.help/blob/master/src/blocks/usr.js)
  * For the user manual ToC, cf. [`blocks/usr_toc.js`](https://github.com/cheap-glitch/vim.help/blob/master/src/blocks/usr_toc.js)

### Defining blocks

Each block is an object with at least four mandatory properties:

 * `start`: a  function which will be  executed by the  parser to know if  a new
   block of  this type should  start at  the current line.  It will be  passed a
   single argument:  a `context`  object which holds  the previous,  current and
   next line  ; the  current and parent  nodes ; and  the number  of consecutive
   empty lines.

 * `end`: same as above, but if it returns `true` then the current block will be
   closed on  the current  line (meaning  that a  block can  be both  opened and
   closed on the same line, and will thus only contain this single line).

 * `containedBlocks`: the list of block types this block can contain. The parser
    will only check among those when trying to open a new child node.

 * `wrapper`: a function that is given  lines of text and should return a string
   of HTML.

Other optional properties are:

 * `disableInlineParsing`:  if set to `true`,  the child text nodes  will not be
   parsed for inline tags and such.

 * `transformLines`  and `transformBlock`:  both are functions  that  modify the
   text content of a  node before it's sent to `wrapper`. The  first one will be
   mapped on every line, while the second will be given the whole array.
