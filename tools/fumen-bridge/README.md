# four-tris fumen bridge

Node.js bridge for `Tetris.au3` to encode/decode fumen (`v115`) using `tetris-fumen`.

## Requirements

- Node.js

## Setup

```powershell
cd tools/fumen-bridge
npm ci
```

If `npm ci` is not available for your environment, run:

```powershell
npm install
```

## CLI

```powershell
node bridge.js encode --input "<input-file>"
node bridge.js encode-pages --input "<input-file>"
node bridge.js decode --input "<input-file>"
```

Input is line-based `KEY=VALUE`.

- `encode`:
  - `BOARD=<230 digits 0-8>`
  - `HOLD=<I|J|L|O|S|T|Z|->`
  - `QUEUE=<IJLOSTZ...>`
- `encode-pages`:
  - `PAGE_COUNT=<n>`
  - `PAGE1_BOARD=...`, `PAGE1_HOLD=...`, `PAGE1_QUEUE=...`
  - `PAGE2_BOARD=...`, `PAGE2_HOLD=...`, `PAGE2_QUEUE=...`
  - ...
- `decode`:
  - `FUMEN=<v115 token or URL>`

Output is line-based:

- success:
  - `OK=1`
  - plus result keys (`FUMEN`, `BOARD`, `HAS_QUIZ`, `HOLD`, `QUEUE`, `HOLD_PROVIDED`, `PAGES`, `USED_PAGE`)
- failure:
  - `OK=0`
  - `ERR=...`
  - `MSG=...`

## Comment queue format (decode)

- `HOLD:NEXT`:
  - left side (`HOLD`) is a single hold mino (`IOTLJSZ`)
  - right side (`NEXT`) is next queue (`IOTLJSZ...`)
- `NEXT` only:
  - no `:`
  - treated as next queue only (hold is not provided)
- If any character other than `IOTLJSZ` is included in queue text, queue info is rejected.

## Known constraints

- Bridge supports only four-tris standard board size for integration: `10x24` (`10x23` fumen area + 1 hidden row in app).
- Multi-page decode uses the **last** page.

## Third-party licenses

- `tetris-fumen` license details: `tools/fumen-bridge/THIRD_PARTY_NOTICES.md`
