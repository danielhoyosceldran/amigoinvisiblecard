---
name: Cartón del amigo invisible
description: A Nochebuena bingo card of gift preferences, printed in cobalt ink on white paper and marked with a fluorescent dauber.
colors:
  ink: "#2234a8"
  ink-deep: "#17247a"
  ink-tint: "#e8ebfa"
  ink-soft-on-paper: "#4a57b8"
  paper: "#ffffff"
  black: "#141414"
  on-ink: "#ffffff"
  on-ink-soft: "#c9d0f5"
  dauber: "#ff2e88"
  call: "#ffd21f"
  call-bright: "#ffe04d"
typography:
  display:
    fontFamily: "'Archivo Variable', 'Arial Narrow', sans-serif"
    fontSize: "2.75rem"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "0.005em"
    fontVariation: "'wdth' 62"
  numeral:
    fontFamily: "'Archivo Variable', 'Arial Narrow', sans-serif"
    fontSize: "clamp(3.5rem, 18vw, 6.5rem)"
    fontWeight: 900
    lineHeight: 1
    fontVariation: "'wdth' 62"
  headline:
    fontFamily: "'Archivo Variable', 'Arial Narrow', sans-serif"
    fontSize: "2rem"
    fontWeight: 900
    lineHeight: 0.95
    fontVariation: "'wdth' 62"
  title:
    fontFamily: "'Atkinson Hyperlegible Next', system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "'Atkinson Hyperlegible Next', system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "'tnum'"
  label:
    fontFamily: "'Atkinson Hyperlegible Next', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.15
rounded:
  quad: "2px"
  face: "3px"
  sm: "6px"
  slot: "8px"
  md: "10px"
  lg: "16px"
  sheet: "18px"
  pill: "999px"
spacing:
  hair: "2px"
  xs: "6px"
  sm: "8px"
  md: "10px"
  gap: "14px"
  gutter: "16px"
  lg: "18px"
  xl: "28px"
components:
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "52px"
  button-ink-hover:
    backgroundColor: "{colors.ink-deep}"
  button-call:
    backgroundColor: "{colors.call}"
    textColor: "{colors.black}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "60px"
  button-call-hover:
    backgroundColor: "{colors.call-bright}"
  button-line:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "52px"
  button-line-hover:
    backgroundColor: "{colors.ink-tint}"
  button-danger:
    backgroundColor: "{colors.black}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "52px"
  next-sign:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 16px 10px 14px"
    height: "72px"
  bingo-call:
    backgroundColor: "{colors.call}"
    textColor: "{colors.black}"
    rounded: "{rounded.md}"
    padding: "12px 18px"
    height: "76px"
  carton:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "18px 10px 10px"
  cell:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.face}"
    padding: "6px 6px 4px"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.black}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "56px"
  input-blank:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "4px 2px 6px"
  idea-chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  idea-chip-hover:
    backgroundColor: "{colors.ink-tint}"
  idea-chip-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
  toast:
    backgroundColor: "{colors.black}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "14px 18px"
---

# Design System: Cartón del amigo invisible

## Overview

**Creative North Star: "The Nochebuena Bingo Card"**

The whole product is one printed bingo card on a cobalt table. The shell is solid cobalt ink; the card is white paper printed in that same ink plus black, with a perforated top edge as if torn from the pad. Nine ruled squares carry huge extra-condensed numerals; finishing a square lands a fluorescent magenta dauber dot over its number, and when the card is full a marigold «¡BINGO!» call takes the top of the screen. Everything a person reads in sentences is set in Atkinson Hyperlegible Next, large and bold, because the people filling the card include older relatives on phones with big system text.

Density is low and the hierarchy is blunt: one cobalt band (title, year, «4 de 9» count), one next-step sign («Ahora: 5 · Pequeño lujo diario»), one card. Editing a square takes the full screen and does one job. The same world is redrawn on canvas for the shared image (1080 × 1560): cobalt ground, «EL CARTÓN DE» plus the name in condensed capitals, the white perforated card with a double outer rule, and a footer line «Amigo invisible · Navidad 2026». That image is the product's deliverable and belongs to this system.

The world deliberately refuses the seasonal default of white rounded cards, Christmas red, and snowflakes. Christmas lives in the ritual (Nochebuena bingo), not in ornament.

**Key Characteristics:**
- Two inks on paper: cobalt and black on pure white; no neutral greys.
- Extra-condensed 900-weight Archivo numerals and headings at width 62; Atkinson Hyperlegible Next for every sentence.
- Fluorescent magenta dauber multiplies over the printed number to mark a done square.
- Marigold is the call to action and nothing else.
- Every photo is cropped square at one scale; «Lo que NO regalarme» photos are cancelled by a black rubber «NO» stamp, never hidden.

## Colors

A two-ink print palette (cobalt + black on white) with exactly two fluorescent interventions: magenta for marking, marigold for calling.

### Primary
- **Cobalt Bingo Ink** (`ink`): the shell background, every printed rule and numeral on the card, the primary button fill, input strokes, dashed empty slots. Also the `theme-color`.
- **Deep Cobalt** (`ink-deep`): hover state of ink buttons and the scrollbar track on the shell. Never a surface.

### Secondary
- **Dauber Magenta** (`dauber`): the completion mark only. The dot over a finished square's number (radial fill at 78 to 98% opacity, `mix-blend-mode: multiply`), the dashed ring that slowly turns around the next square and the next-step number, the selected-image ring and check badge in search results, the text caret.

### Tertiary
- **Marigold Call** (`call`): the call to action. The «¡BINGO! Crear mi imagen» button, the primary button in the share sheet, text selection. **Bright Marigold** (`call-bright`) is its hover.

### Neutral
- **Card Paper** (`paper`): the card, the editor and sheet surfaces, slot and chip fills. Pure white.
- **Stamp Black** (`black`): the second ink. Focus outlines on paper, the «NO» stamp (at 85% opacity, multiply), the danger button, the toast, text on marigold.
- **Ink Tint** (`ink-tint`): a pale wash of cobalt for the «picked» tray, hover on line buttons and chips, image placeholders. It is ink thinned, not grey.
- **Soft Ink on Paper** (`ink-soft-on-paper`): secondary text and placeholders on paper (the «Ahora:» line, the blank's placeholder, search credits).
- **On-Ink White** (`on-ink`) and **On-Ink Soft** (`on-ink-soft`): primary and secondary text on the cobalt shell (year, «de 9», footer, the «EL CARTÓN DE» line in the shared image).

### Named Rules
**The Two Inks Rule.** Paper carries cobalt and black only. Lighter values are cobalt thinned (`ink-tint`, `ink-soft-on-paper`, cobalt at 18 to 45% alpha for hairlines), never a grey.

**The One Dauber Rule.** Magenta means "marked" or "next to mark". It never fills a button, a heading, or a background.

**The Marigold Is a Call Rule.** Marigold appears only on the action that moves the person to sharing. One marigold element per screen.

## Typography

**Display Font:** Archivo Variable, width axis at 62 (with Arial Narrow)
**Body Font:** Atkinson Hyperlegible Next 400/700 (with system-ui)

**Character:** A bingo-hall numeral press paired with a legibility face built for low vision. Archivo is always 900, uppercase, `font-stretch: 62%`; Atkinson does all reading.

### Hierarchy
- **Display** (Archivo 900, 2.75rem mobile, 3.5rem from 48rem, 5rem from 64rem, line-height 0.86, uppercase): the «AMIGO INVISIBLE» band title. The same face sizes the count numeral (3rem) and «¡BINGO!» (2.75rem).
- **Numeral** (Archivo 900, clamp(3.5rem, 18vw, 6.5rem), line-height 1): the printed square numbers on empty squares. In a filled square the number scales with its quadrant (40cqi). The editor's boxed number is 3.5rem.
- **Headline** (Archivo 900, 2rem editor / 2.25rem sheet, line-height 0.95, uppercase): editor square titles and sheet titles such as «¡BINGO, MARI CARMEN!». «CARTÓN DE» in the card head is 1.375rem with 0.02em tracking.
- **Title** (Atkinson 700, 1.25rem, 1.2): the next-step square name, big buttons, the «¡BINGO!» subline.
- **Body** (Atkinson 400, 1.125rem, 1.45, tabular numerals): all running text; paragraphs cap at 52 to 60ch.
- **Label** (Atkinson 700, 1rem, 1.15, balanced wrap): square labels under the numbers, chips, smaller headings. Nothing in the UI goes below 0.875rem (search credit only).

### Named Rules
**The Numbers Are Printed Rule.** Archivo appears only as printed card matter: numbers, the title, headings, «CARTÓN DE», «¡BINGO!», the «NO» stamp. A sentence is never set in Archivo.

**The Big Text Rule.** Body is 1.125rem and controls are bold. Never shrink sentences to fit; let labels wrap (`text-wrap: balance`, hyphenation on).

## Layout

Single column, phone first. Content width is `min(100% - 2 × gutter, 600px)` with a 16px gutter (24px from 48rem). Vertical rhythm runs on 18px between band, sign and card, 28px before the footer.

The card is a 3 × 3 grid ruled in cobalt (3px outer border, 2px inner rules made by the grid gap over an ink ground). An empty square shows its numeral in a square face and its label below. A filled square becomes a 2 × 2 of equal squares (2px gap): the printed number under the dauber in the first, then up to three photos or colours. Empty quadrants are dashed cobalt outlines.

The editor is a full-screen dialog on phones (sticky top bar with «Volver», scroll body, fixed foot); from 48rem it becomes a 720px-wide, 16px-rounded panel. The share and confirm sheets are bottom sheets (18px top corners, up to 94dvh) that become centred 540px panels from 48rem. Search results run 3 columns (4 from 48rem); colour swatches 4 columns (5 from 48rem).

From 64rem the band moves to a sticky 340px left column and the card takes a 560px right column, 72px apart, so the whole card fits the viewport.

Shared image: 1080 × 1560 canvas, 32px card inset, 26px card padding, square faces inset 12px per cell with a 6px quadrant gap, double outer rule (5px and 2px, 9px apart).

## Elevation & Depth

Depth is physical and singular: a paper card lying on a cobalt table. Only objects that sit on the cobalt shell cast shadows, and their shadows are tinted with deep cobalt (`rgb(6 12 48)`), soft and downward. Inside the paper, everything is flat print; separation comes from ink rules, dashed outlines and inset hairlines.

### Shadow Vocabulary
- **Card on table** (`filter: drop-shadow(0 14px 16px rgb(6 12 48 / 0.45)) drop-shadow(0 2px 3px rgb(6 12 48 / 0.3))`): the card itself (a filter, so it follows the perforated mask).
- **Sign on table** (`box-shadow: 0 16px 30px -12px rgb(6 12 48 / 0.6), 0 3px 6px rgb(6 12 48 / 0.28)`): the next-step sign and the «¡BINGO!» call.
- **Preview** (`box-shadow: 0 12px 24px -10px rgb(6 12 48 / 0.5)`): the shared-image preview in the share sheet.
- **Toast** (`box-shadow: 0 10px 24px -8px rgb(0 0 0 / 0.5)`): the black notice at the bottom.
- **Print hairline** (`box-shadow: inset 0 0 0 1px rgb(34 52 168 / 0.18)`): photo quadrants; 0.3 alpha around colour chips.

### Named Rules
**The Table and Paper Rule.** Shadows exist only between the cobalt table and something lying on it. Nothing on the paper is lifted.

## Shapes

Gently softened rectangles (10px) for everything you press; the card has 4px top corners and 10px bottom corners, with its top edge die-cut by a row of 4px-radius semicircles every 14px (CSS mask; drawn as ink circles in the shared image). Square faces are 3px, quadrants 2px, picked slots 8px, result tiles 6px. Circles are reserved for marks: the dauber (a slightly irregular blob, `border-radius: 52% 48% 50% 50% / 48% 52% 49% 51%`), the dashed next ring, swatch chips, the selected-image badge. Chips are full pills. The «NO» stamp is a rounded rectangle rotated -14°.

Every image is cropped square (`aspect-ratio: 1; object-fit: cover`) at the same scale within a context.

Icons are 2px-stroke line icons on a 24px grid with round caps, inline SVG, sized 1.35em.

## Components

### Buttons
Big, bold, unmistakable; one obvious action per step.
- **Shape:** softened rectangle (`rounded.md`), 2px border slot, min-height 52px (60px full-width big variant at 1.25rem).
- **Ink:** cobalt fill, white text; hover deep cobalt.
- **Call:** marigold fill, black text; hover bright marigold. Reserved for the sharing path.
- **Line:** paper fill, cobalt text and 2px cobalt border; hover ink tint.
- **Danger:** black fill, white text (destructive confirm).
- **Press:** `translateY(1px) scale(0.985)` over 140ms `cubic-bezier(0.16, 1, 0.3, 1)`. Hover effects only under `(hover: hover) and (pointer: fine)`.
- **Text link:** bold, 2px underline offset 0.22em, min-height 44px.

### Chips
- **Style:** idea suggestions are paper pills with a 2px cobalt border, cobalt bold text, 44px tall.
- **State:** hover ink tint; pressed fills cobalt with white text.

### Cards / Containers
- **The card:** paper, perforated top, `Card on table` shadow, 18px 10px 10px padding.
- **Picked tray:** ink-tint wash, `rounded.md`, 16px padding, holding three square slots (8px corners; free slots dashed cobalt with a condensed numeral).
- **Sheets:** paper, bottom sheet on phones, centred panel on desktop; content rises 28px in over 320ms.

### Inputs / Fields
- **The blank («CARTÓN DE ____»):** no box, a 2px cobalt underline like the printed line on a paper cartón, bold 1.3125rem text, magenta caret. Focus thickens the line to 3px black.
- **Search field:** 56px tall, 2px cobalt border, `rounded.md`, black text, magenta caret; focus is a 3px black outline offset 1px.
- **Focus everywhere:** 3px black outline, offset 2px; marigold on the cobalt band and footer.

### Navigation
There is no navigation bar. The cobalt band carries the title and the progress count («9 de 9»: condensed numeral plus soft-ink text). Moving through the task is done by the next-step sign: a paper sign with the next square number inside a dashed magenta ring, «Ahora:» in soft ink, the square name in bold cobalt, and an arrow. In the editor a «Volver» text button sits in a sticky paper bar ruled underneath in cobalt.

### Bingo Square (signature)
Empty: numeral centred in a square face, label below; the next square wears a dashed magenta ring at 13% inset turning once every 18s. Filled: the 2 × 2 of equal squares with the dauber over the number. Completing a square plays the dauber landing (scale 1.9 to 0.88 to 1 over 520ms) while the face presses to 0.95.

### Dauber and Stamp (signature)
The dauber is magenta multiplied over ink so the number stays readable through it. The «NO» stamp is black condensed «NO» in a 0.06em rounded frame at 85% opacity, multiply, rotated -14°, centred over the photo quadrants without covering the number: it cancels the photos, it does not hide them.

### ¡BINGO! Call (signature)
When 9/9, a marigold block replaces the next-step sign: «¡BINGO!» in condensed 900 caps beside «Crear mi imagen». It arrives with a 700ms drop-and-settle.

### Shared Image
The canvas redraw of the card: cobalt ground, «EL CARTÓN DE» in soft ink and the name in white condensed caps (132px, shrinking to fit), the perforated white card with a cobalt grid and double outer rule, daubers and stamp drawn with multiply, colour names in condensed caps chosen black or white by luminance, a soft-ink footer.

## Do's and Don'ts

### Do:
- **Do** print every card element in cobalt (`ink`) or black on white paper; lighten only by thinning cobalt.
- **Do** set numbers, headings and the «NO» stamp in Archivo 900 at `font-stretch: 62%`, uppercase; set every sentence in Atkinson Hyperlegible Next at 1.125rem or larger.
- **Do** mark completion with the magenta dauber in `multiply` over the printed number.
- **Do** crop every photo square at one scale, and cancel «Lo que NO regalarme» photos with the black rotated stamp.
- **Do** keep touch targets at least 44px (buttons 52px, fields 56px) and focus rings 3px black (marigold on cobalt).
- **Do** redraw any new shared output in the same world as the card: cobalt ground, perforated paper, condensed caps.

### Don't:
- **Don't** introduce neutral greys, Christmas red, snowflakes or other seasonal ornament.
- **Don't** use marigold for anything but the call to share, or magenta for anything but marking.
- **Don't** lift anything that lies on the paper with a shadow; shadows belong to objects on the cobalt table.
- **Don't** set sentences in the condensed face or below 1rem (credits at 0.875rem are the floor).
- **Don't** hide a «NO» photo or blur it; the stamp cancels it in view.
