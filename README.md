<p align="center">
	<a href="https://vim.help" target="_blank" rel="external nofollow noopener noreferrer">
		<img src="https://raw.githubusercontent.com/cheap-glitch/vim.help/main/docs/banner.png" alt="banner">
	</a>
</p>

**[vim.help](https://vim.help)** is a  mirror of Vim built-in  help, adapted and
improved for the web.

> The goal  is to ultimately  format all  the help files,  but for now  only the
> user  manual  is considered,  as  many  pages  of  the reference  manual  need
> special  processing  to be  made  legible.  If you  want  to  help, check  out
> [Contributing](#-contributing).

<!-- fragment:why-this-project -->
## 🔍 Why this project?
While there's plenty of excellent articles, tutorials and books on Vim out there
(and even  more sub-par ones),  the built-in documentation  is still one  of the
best sources to learn about Vim.  Sadly, it's often overlooked by both beginners
and regular users alike.

There already exists  [a mirror of the doc  online](https://vimhelp.org), but it
doesn't do much to  improve the reading experience. The goal  of this project is
to make Vim's docs easier to reach  from any device, more pleasant to peruse and
more attractive for newcomers and inexperienced users.
<!-- /fragment -->

<!-- fragment:about-vim-help -->
## 📖 About Vim's help
Vim's help is split into two sections: a user manual and a reference manual.

The  **[user manual](https://vim.help/table-of-contents)**  is a  thorough guide
meant to accompany your journey from novice  to Vim master. The first part is an
introduction to the basic  features and should be read in  order. The second and
third parts are respectively about  editing text efficiently and fine-tuning Vim
— their chapters  can be read in  any order. Finally, there's also  a chapter on
installing Vim and getting it to run properly.

The  **reference  manual**  contains  detailed  descriptions  of  all  available
options, commands,  mappings, etc.,  and isn't  meant to be  read from  start to
finish.
<!-- /fragment -->

<!-- fragment:contributing -->
## 💻 Contributing
[![codecov](https://codecov.io/gh/cheap-glitch/vim.help/branch/main/graph/badge.svg)](https://codecov.io/gh/cheap-glitch/vim.help)

Contributions are welcomed! While the parser  for the user manual is functional,
there are still  plenty of edge cases  to catch. Furthermore, many  pages of the
reference manual have a unique format and  need a special processor to turn them
into legible web pages.

Other features that would be nice to have:
  * full-site search ([DocSearch](https://docsearch.algolia.com/docs/what-is-docsearch) seems pretty nice)
  * better mobile and small-screen support
  * better a11y (maybe a specific colorscheme?)

If   you're   interested    in   helping   out,   please   take    a   look   at
[CONTRIBUTING.md](https://github.com/cheap-glitch/vim.help/blob/main/CONTRIBUTING.md).
<!-- /fragment -->

<!-- fragment:support -->
## 🎁 Support the project!
I  want   to  keep  this   resource  free  and   ad-free  for  the   benefit  of
all  the  Vim  lovers  out  there,  and  continuously  improve  it  —  but  that
takes  a  lot  of  time  and  resources. To  help  in  that  endeavor,  you  can
support   me  on   my   [Patreon](https://www.patreon.com/cheap_glitch)  or   on
[PayPal](https://www.paypal.me/CheapGlitch).

Support  doesn't  have  to  be   monetary  though!  Reporting  bugs,  suggesting
improvements, contributing some  code or even just spreading the  word about the
project helps a lot.
<!-- /fragment -->

<!-- fragment:credits -->
## 👏 Credits & Acknowledgements
The Vim user manual and reference manual is by Bram Moolenaar. Parts of the user
manual come from the book "Vi IMproved – Vim" by Steve Oualline.

The icons for the visual settings come from [Font Awesome](https://fontawesome.com).

Colorschemes:
  * [Solarized Light](https://ethanschoonover.com/solarized) by [Ethan Schoonover](https://github.com/altercation)
  * [Ayu Dark](https://github.com/dempfi/ayu) by [Ike Ku](https://github.com/dempfi)
  * "Rust" & "Coal" taken from the [mdBook](https://github.com/rust-lang/mdBook) project
<!-- /fragment -->

<!-- fragment:licenses -->
## 📜 Licenses
The Vim  user manual and  reference manual are  Copyright © 1988-2003  by Bram
Moolenaar.  This material  may  be distributed  only subject  to  the terms  and
conditions set forth in the Open  Publication License, v1.0 or later. The latest
version is presently available at: http://www.opencontent.org/openpub/.

Parts  of the  user manual  come from  the  book "Vi  IMproved –  Vim" by  Steve
Oualline  (published  by New  Riders  Publishing,  ISBN: 0735710015).  The  Open
Publication License applies  to this book. Only selected parts  are included and
these have been modified (e.g., by  removing the pictures, updating the text for
Vim 6.0 and later, fixing mistakes). The omission of the "frombook" tag does not
mean that the text does not come from the book.
<!-- /fragment -->

This software is distributed under the ISC license.
