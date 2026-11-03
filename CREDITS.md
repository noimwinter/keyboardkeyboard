# Music and sound credits

## Grand piano

Salamander Grand Piano v3, recorded by Alexander Holm: a Yamaha C5 grand piano.

- Original sample project: https://github.com/sfzinstruments/SalamanderGrandPiano
- License: Creative Commons Attribution 3.0 Unported, https://creativecommons.org/licenses/by/3.0/
- MP3 distribution: https://github.com/Tonejs/audio/tree/master/salamander

This app bundles 30 MP3 recordings from the Tone.js distribution as base64 in samples.js. The MP3 files are unchanged; playback repitches nearby samples by at most one semitone, applies gain and fades, and limits overlapping voices. This is a single-velocity sampled instrument, not the complete 16-velocity-layer Salamander library. Attribution does not imply endorsement.

## Liszt

Franz Liszt: Grandes études de Paganini, S.141, No. 4 in E major (Arpeggio / Vivo, 1851). The composition is public domain.

The bundled pitch sequence was extracted from the MIDI titled “Etude No. 4, Liszt,” hosted by Alex’s Piano Service in its Kuhmann / Disklavier World collection:
https://www.alexanderpeppe.com/midi/117-liszt-etude-no-4-aus-grandes-etudes-d-161e7413/

Source MIDI:
https://www.alexanderpeppe.com/kuhmann/Classical%203/117-Liszt%20Etude%20No-4%20aus%20Grandes%20Etudes%20d.mid

Adaptation: all 1,432 positive-velocity note-on pitches are retained in 1,113 onset groups. Notes with exactly the same MIDI tick play together on one press, regardless of hand or pitch; distinct onset ticks require separate presses. No rounding or proximity window merges nearby notes. Tempo, note durations, velocities and pedal data are omitted. Rests do not trigger timers or blank presses: the next onset waits for the user. This is a user-paced adaptation of the source MIDI. Its metadata does not identify the sequencer; no authorship of the transcription is claimed here.

## Original demo

“Morning Steps” is an original 24-note demo made for this app, free to reuse.

## Additional Liszt presets

All compositions are public domain. MIDI sources are from Alex’s Piano Service / Kuhmann collection. Only note pitches and onset grouping are retained; performance tempo, durations, velocity and pedal data are omitted. Exact onset ticks are grouped across every track, with no timing quantization. Expressively staggered chord tones in a source remain separate presses.

- Paganini Étude No. 6 (Franz Liszt · S.141/6 · A minor): 4,971 notes in 3,563 presses. Source: https://www.alexanderpeppe.com/midi/lizst-etude-no-6-aus-grandes-etudes-8b2ae40a/
- Paganini Étude No. 3 — La Campanella (Franz Liszt · S.141/3 · G-sharp minor): 4,077 notes in 3,855 presses. Source: https://www.alexanderpeppe.com/midi/242-liszt-la-campanella-from-paganinis-2nd-conc-a7ab7bc9/
- Hungarian Rhapsody No. 2 (Franz Liszt · S.244/2 · C-sharp minor): 6,684 notes in 3,265 presses. Source: https://www.alexanderpeppe.com/midi/230-liszt-franz-no-2-hungarian-raphsody-2b3ef2aa/
- Liebesträume No. 3 (Franz Liszt · S.541/3 · A-flat major): 1,879 notes in 1,708 presses. Source: https://www.alexanderpeppe.com/midi/127-liszt-liebestraume-no-3-482bdc41/
