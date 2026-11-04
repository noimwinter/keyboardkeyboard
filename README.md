# Keyboard Keyboard

A browser piano with sampled grand piano audio and five Liszt pieces. Every fresh keyboard press plays the next note or simultaneous chord. Holding a key does not advance repeatedly. Different start times, including trills, require separate presses.

## Run locally

Open index.html in a modern browser, click Play, and press any key. All audio and music are bundled for offline use.

## Publish with GitHub Pages

1. Create a public repository, such as any-key-piano.
2. Extract this ZIP and upload its contents to the root of the repository. index.html must be at the top level.
3. Commit and push to the main branch.
4. Open the repository Settings > Pages.
5. Under Build and deployment, choose Deploy from a branch, then main and / (root), and Save.
6. Wait for GitHub to finish publishing. The Pages settings will show the website link.

For a repository named any-key-piano owned by noimwinter, the usual URL is https://noimwinter.github.io/any-key-piano/ once Pages deployment succeeds.

No build command or dependency installation is needed. Keep all six app files together, including samples.js and songs.js. CREDITS.md documents the music sources, sampled-piano attribution, and CC BY 3.0 sample license.

## Pieces

- Paganini Étude No. 6
- Paganini Étude No. 4
- Paganini Étude No. 3 — La Campanella
- Hungarian Rhapsody No. 2
- Liebesträume No. 3
- Morning Steps, original demo

Simultaneous notes are grouped by exact MIDI onset tick. Expressively staggered notes in a source remain separate presses. The editable sequence supports chords such as C3+C4+E4 G4, which takes two presses.
