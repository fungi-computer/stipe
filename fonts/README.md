# Retained Dashboard fonts

Stipe retains Dashboard's Nunito sans and Maple Mono monospace stacks from
Botanical revision `b6eabe5dfd3cac9514025d26abbe9a92b083f10b`,
`packages/fungi-computer/dashboard/src/index.css` (font theme and font face) and
`packages/fungi-computer/dashboard/index.html` (Nunito Google Fonts link). Caps'
normal stylesheet imports Stipe's typography tokens. Hosts opt into the shared
`@fungi.computer/caps/fonts.css` loading sheet through their asset bundler.
Stipe's Nunito URLs are relative to the package CSS; each host's asset builder
emits the generated WOFF2 files onto that host's own origin.

`MapleMono-VF.woff2` is an unchanged copy of that revision's
`packages/fungi-computer/dashboard/public/fonts/MapleMono-VF.woff2`. Its
retained face declares normal weights 200–800. The upstream
[Maple Mono license](https://github.com/subframe7536/maple-font/blob/main/OFL.txt)
is included as `MapleMono-OFL.txt`.

`Nunito-VF.ttf` is the unchanged normal variable font from
[Google Fonts](https://github.com/google/fonts/blob/main/ofl/nunito/Nunito%5Bwght%5D.ttf),
retrieved September 9, 2026. Its Git blob is
`2ec1f4b0676c83ef33049db87b311171699e9192`; Google Fonts metadata identifies
upstream Nunito commit `8c6a9bb9732545b9ed53f29ec5e1ab0ff53c4e6f`. The full
asset covers Latin, extended Latin, Cyrillic, extended Cyrillic and Vietnamese,
with a 200–1000 weight axis. Stipe exposes normal weights 200–900, covering both
the Dashboard and retained Hub marketing page. The original Dashboard fetched
400, 500, 600, 700 and 800 from Google Fonts; self-hosting the same family
replaces that network dependency. The upstream
[license](https://github.com/google/fonts/blob/main/ofl/nunito/OFL.txt) is
included as `Nunito-OFL.txt`. Neither retained loading path supplied an italic
face; these assets preserve that scope.

The Nunito source stays in this repository for reproducible generation and is
excluded from the Stipe package tarball. The committed WOFF2 subsets preserve
the 200–1000 variable weight axis and partition Google Fonts' Latin,
Latin-extended, Cyrillic, Cyrillic-extended, and Vietnamese ranges. Stipe's CSS
uses Unicode ranges so the browser fetches only files needed by visible text.
Hub emits its copies under `/_stipe/fonts/nunito/8c6a9bb/` with immutable
headers. App builders emit the same subsets into each App Release. The path
version records the upstream Nunito source commit prefix.

The repository toolchain has no subsetter. Regenerate the WOFF2 assets with
maintained FontTools and Brotli, without adding either to runtime dependencies:

```sh
python3 -m venv .botanical/fonttools-subset-venv
.botanical/fonttools-subset-venv/bin/python -m pip install \
  "fonttools==4.63.0" "brotli==1.1.0"
PATH="$PWD/.botanical/fonttools-subset-venv/bin:$PATH" \
  packages/stipe/fonts/subset-nunito.sh
```

Both source and generated files remain SIL OFL 1.1, separate from Stipe's MIT
code license. The upstream
[license](https://github.com/google/fonts/blob/main/ofl/nunito/OFL.txt) is
included as `Nunito-OFL.txt`.

`NothingYouCouldDo-Regular.woff2` is the Latin subset Google Fonts serves for
[Nothing You Could Do](https://fonts.google.com/specimen/Nothing+You+Could+Do)
(`fonts.gstatic.com/s/nothingyoucoulddo/v21/...`), retrieved September 26, 2026.
It backs the `--font-handwritten` field-guide captions. It replaces an `@import`
of the Google Fonts stylesheet, which bundlers drop once this sheet is inlined
after other rules, so the face never loaded. The upstream
[license](https://github.com/google/fonts/blob/main/ofl/nothingyoucoulddo/OFL.txt)
is included as `NothingYouCouldDo-OFL.txt`.

`Fraunces-VF-latin.woff2` and `Fraunces-Italic-VF-latin.woff2` are the unchanged
Latin subsets of [Fraunces](https://github.com/undercasetype/Fraunces) with all
four variable axes (`opsz`, `wght`, `SOFT`, `WONK`), copied from
`@fontsource-variable/fraunces@5.3.0` (`files/fraunces-latin-full-normal.woff2`
and `files/fraunces-latin-full-italic.woff2`), retrieved September 26, 2026.
They back `--font-display`, the field-guide display serif used for Technonomicon
card titles and flavor text. The upstream license is included as
`Fraunces-OFL.txt`.

The consulting themes' faces (Bricolage Grotesque headings, Instrument Sans
text) are unchanged Latin subsets copied from Fontsource variable packages at
5.3.0, retrieved September 26, 2026, each with its upstream license:

- `BricolageGrotesque-VF-latin.woff2` from
  `@fontsource-variable/bricolage-grotesque`
  (`files/bricolage-grotesque-latin-opsz-normal.woff2`, `opsz` and `wght`
  200–800); [Bricolage Grotesque](https://github.com/ateliertriay/bricolage),
  license `BricolageGrotesque-OFL.txt`.
- `InstrumentSans-VF-latin.woff2` and `InstrumentSans-Italic-VF-latin.woff2`
  from `@fontsource-variable/instrument-sans`
  (`files/instrument-sans-latin-wght-normal.woff2` and `-italic.woff2`, `wght`
  400–700); [Instrument Sans](https://github.com/Instrument/instrument-sans),
  license `InstrumentSans-OFL.txt`.

`DepartureMono-Regular.woff2` is [Departure Mono](https://departuremono.com/) by
Helena Zhang, moved unchanged from jamstack.consulting's public assets (first
added in Botanical-next commit `a8c51bbe`). It is the `consulting` themes' pixel
accent face for labels, tags, numerals and prices. Its license is included as
`DepartureMono-OFL.txt`.

All eight fonts remain SIL OFL 1.1, separate from Stipe's MIT code license. No
font bytes were modified, subsetted or converted by us (Fontsource cut the
Fraunces and consulting reading-face Latin subsets). The Nunito and Fraunces
files were renamed only for simple asset URLs.

`GrenzeGotisch-VF-latin.woff2` is the unchanged Latin subset of
[Grenze Gotisch](https://github.com/Omnibus-Type/Grenze-Gotisch) with its weight
axis (100–900), copied from `@fontsource-variable/grenze-gotisch@5.3.0`
(`files/grenze-gotisch-latin-wght-normal.woff2`), retrieved September 26, 2026.
It backs `--font-nameplate`, the blackletter used for a publication's nameplate,
such as The Spore Print's masthead on shiit.app. The upstream
[license](https://github.com/google/fonts/blob/main/ofl/grenzegotisch/OFL.txt)
is included as `GrenzeGotisch-OFL.txt`.

All five fonts remain SIL OFL 1.1, separate from Stipe's MIT code license. No
font bytes were modified, subsetted or converted by us (Fontsource cut the
Fraunces and Grenze Gotisch Latin subsets). The Nunito and Fraunces files were
renamed only for simple asset URLs.

SHA-256:

```text
MapleMono-VF.woff2  e7080ef37fa8b3a38f71446e53e546634c27ce2cfe97673478cafc029d6344ee
Nunito-VF.ttf      bb55a5ca5c2042335b3991af27c4d0705d0ef41cac6164ac737fd8f2a1e85207
Nunito-VF-8c6a9bb-latin.woff2        96c17c0007428531495e31efc568dd015a07f40ee2cbac1517e4c0b6f77341a7
Nunito-VF-8c6a9bb-latin-ext.woff2    34eff7fba5786f00b8b241ed2fd620047eca507676f009c61800e15aa5aa3014
Nunito-VF-8c6a9bb-cyrillic.woff2    0cb8126d3e8fd1fd2f32092a0cb9bb7df6a10b8b27c43c52c59cf6743389afd6
Nunito-VF-8c6a9bb-cyrillic-ext.woff2 0f6fcf8cdde983d8bfa9a037ac1a3c7390e1ccca9f77514e1c757e74d2ffdab3
Nunito-VF-8c6a9bb-vietnamese.woff2  1171e1c0f0502064b51d6ef1dfdee4dfdb0cc439de6f3330c68ef223fc126166
MapleMono-OFL.txt  cdb01cb2c0ac2d618ad3fc082275cf3cbe6145a58d558709ec083ce69c702cf0
Nunito-OFL.txt     580df76c95a1ec5ab878ceb25bb3d85c6a076804e9c970c8c6972aea775fdf65
NothingYouCouldDo-Regular.woff2  84e79a16406aaa9d2bc81583fa7e9f692ed0ad1612967a7deb5ef47f8c1fc6c5
NothingYouCouldDo-OFL.txt        0e441ae9f18ad0c294cc5b6ae3974c2db1614cab220598578b1b58c4cc334485
Fraunces-VF-latin.woff2          7e744849028e2219e2aa1bc467dc4032980dc4487c9c3da3010081cd72d3b103
Fraunces-Italic-VF-latin.woff2   04a14ea380db53a35a3ec651934b21061234685bb604d30aac82663b5d9e539b
Fraunces-OFL.txt                 cd3384cafac6f2bddc3955273958a2e029f97027c8037ac539ef5744a77b579e
BricolageGrotesque-VF-latin.woff2      a79fdb52d4a5c76552452f69202add96e287401fff03d3e8c0e38b4dcb5a99cd
BricolageGrotesque-OFL.txt             923f4ddf0fd39f9b7794ab0df7332f3d95dc43e8ad7ec2289d6d9e8491177f51
InstrumentSans-VF-latin.woff2          2ee17598a98d8a59e4df8152d015bec9ab8e4d5672cc0ab42bef806b568e3971
InstrumentSans-Italic-VF-latin.woff2   77210cdde0281b5ecb0d592e063a98656f1bc36993a3b98f506eb91ff4a433a5
InstrumentSans-OFL.txt                 c27a3c53c3beed7f5c26853afa15991478ff7145d3754a36b0382f84e10c0d03
DepartureMono-Regular.woff2       5b4fed1daa90708aa9c6ee1190abca9dc22164a1c1def0020386e46b61038cfb
DepartureMono-OFL.txt             b65e42750f3cb65437a97f4dfd781c58f199259949db2341012be60e32500e83
GrenzeGotisch-VF-latin.woff2     6820b1812cd41eab5eef70f7433f95127d99c72afe76d097f00486f840a9930a
GrenzeGotisch-OFL.txt            bca29af2c3c9e142d11f523f414902ab8fb9ab8ffa3c34c63b6b72aa4e7d6acc
```

`Anton-5.3.0-latin.woff2` is the unchanged Latin subset from
[`@fontsource/anton`](https://fontsource.org/fonts/anton) 5.3.0, retrieved
September 26, 2026. Anton is a heavy condensed display face, exposed as
`--font-poster` for poster-scale marketing headlines only; interface and body
text stay Nunito. The fallback stack is Arial Narrow, Helvetica Neue Condensed,
Roboto Condensed, then Impact. The
[license](https://github.com/googlefonts/AntonFont/blob/main/OFL.txt) is
included as `Anton-OFL.txt`.
