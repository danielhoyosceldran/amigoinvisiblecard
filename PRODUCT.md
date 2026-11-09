# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + vanilla HTML/CSS/JS (same stack as the sibling Pedalier project, chosen by the user). Single-page app, builds to static files for any static host. Content language: Spanish (es-ES).

## Users

The user's own family, of every age and skill level: from people fluent with apps to people with little or no experience using them. They open it on a phone, usually from a link shared in the family group chat, in the weeks before the family Secret Santa ("amigo invisible").

## Product Purpose

Each person fills in a 3x3 board of their gift preferences so whoever draws their name knows what to give. The nine cells, in this fixed reading order (left to right, top to bottom):

1. Hobby
2. Estilo de ropa / accesorios
3. Género (libros, pelis, series…)
4. Género de música
5. Pequeño lujo diario
6. Tipo de aventura / entorno
7. Tipo de cocina o comida
8. Lo que NO regalarme
9. Color o tono favorito

Each cell holds up to three images found through an in-app Google image search. The colour cell is the exception: it uses a colour picker instead of images. When all nine cells are filled, a button appears at the top to generate one image of the whole board, which carries the person's name and can be shared directly (WhatsApp, etc.) or saved to the phone.

Success: someone who has never used an app like this fills the board without help and posts the image in the family chat.

## Operating Context

- Phone first, often with large system font sizes; some users are older relatives.
- The finished image travels through the family chat; that image is the real deliverable.
- Google image search needs a Programmable Search Engine ID (cx). The user will create it later; until then the app must still work with a free image bank and photos from the device.

## Capabilities and Constraints

- No backend, no accounts. Progress is saved on the device.
- Images picked from the web are copied and downscaled on the device so the board survives reloads and the final image can be drawn.
- Google search is configured by pasting the cx into one config file.
- Undecided: hosting, and the Google cx value.

## Evidence on Hand

None. No real family names or photos. Example content must not pretend to be a real person's board.

## Product Principles

1. Anyone in the family can finish it alone: one obvious action per step, plain words, big targets.
2. The nine cells always appear in the fixed order above.
3. Nothing is lost: every choice is saved as it is made.
4. The shared image is the product; it must read clearly in a chat thumbnail.

## Accessibility & Inclusion

Users with low digital literacy and older eyes: large text and touch targets, no gesture-only actions, no jargon, visible labels on every control.
