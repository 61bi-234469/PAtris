# Third-Party Notices (fumen bridge)

This document lists third-party packages used by `tools/fumen-bridge` and
their licenses so the information can be published with the project.

Last reviewed: 2026-02-28

## Dependency list

`tools/fumen-bridge/package-lock.json` pins the bridge dependency to:

- Package: `tetris-fumen`
- Version: `1.1.3`
- Source: <https://www.npmjs.com/package/tetris-fumen>
- Repository: <https://github.com/knewjade/tetris-fumen>
- License (declared): `MIT`
- Transitive dependencies: none (for this pinned version)

## License text: tetris-fumen (MIT)

Source in local install:
`tools/fumen-bridge/node_modules/tetris-fumen/LICENSE`

```text
MIT License

Copyright (c) 2019

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Recheck procedure

From repository root:

```powershell
cd tools/fumen-bridge
npm ci
npm ls --depth=0
```

Then confirm:

- `package-lock.json` entry for `node_modules/tetris-fumen`
- local license file at `node_modules/tetris-fumen/LICENSE`
