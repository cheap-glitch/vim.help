## How to contribute

Here are a few suggestions to contribute to the project:
  * check the pages for any broken formatting and [report them](https://github.com/cheap-glitch/vim.help/issues/new?labels=bug%2C+parser&template=1_parsing_error.md)
    (and you'll learn about Vim as a bonus!)
  * write a parser for unprocessed help files (cf. [About the parsers](#about-the-parser))
  * improve the HTML/CSS wrapper

## Contributing guidelines

Thank you for  contributing to **vim.help**! Please follow  the guidelines below
to ensure that your work is beneficial to the project:

1. Consider opening an issue before submitting any sizable PR, especially
   if it touches on the internal logic of the parser.

2. Try your best to respect the code style:
    * [smart  tabs](https://www.emacswiki.org/emacs/SmartTabs):  tablatures  for
      indentation, spaces for presentation
    * block-opening curly quotes on their  own lines (expect for objects and CSS
      blocks)
    * comments  and commit messages in  the imperative style, with  an uppercase
      letter at the beginning and no full stop at the end

3. If you modify or add to the behaviour of the parser, write or adapt the tests
   needed to cover  the newly supported cases. Tests are  extremely important to
   ensure the long-term improvement of the code.

## About the parsers

<!-- @TODO -->
