# Project: four-tris (AutoIt3)

## Overview
- Open-source Tetris training tool written in AutoIt3.
- Rendering and input are handled via WinAPI calls; audio uses BASS.

## Key Files and Layout
- `Tetris.au3`: Main entry point; contains most gameplay, rendering, and settings logic.
- `ai/TetrisAI.au3`: Experimental AI scaffolding (currently minimal).
- `lib/*.au3`: Local helper libraries (keyboard handling, Base64, LZNT, BASS wrappers).
- `settings.ini`: Runtime configuration and defaults (installed on first run).
- `colors.ini`: Color palette configuration.
- `textures/*.png`, `buttons.bmp`, `icon.*`: UI textures and icons.
- `se/*.wav`, `se/bassx86.dll`, `se/bassx64.dll`: Sound effects and audio runtime.
- `piece_list.txt`: Static piece list data when enabled.

## Build and Run
- Install AutoIt3 (latest).
- Run `Tetris.au3` with the AutoIt3 interpreter.
- Optional: compile via AutoIt3Wrapper using directives at the top of `Tetris.au3`.

## Development Notes
- The app relies heavily on global state in `Tetris.au3`; prefer small, localized changes.
- When adding new settings, update both `settings.ini` defaults and any read/write logic in `Tetris.au3`.
- Keep assets and DLL names stable; hard-coded paths expect the current layout.
- No automated tests; validate changes by running the script manually.
