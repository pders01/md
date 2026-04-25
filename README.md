# md-server (deprecated)

> ⚠️ **This package is deprecated.** Its functionality has been folded
> into [`mdv`](https://github.com/pders01/mdv) as `mdv serve`.
> Please switch — this package will receive no further releases.

## Why

`md-server` and `mdv` (a terminal markdown viewer) shared the same
goal: make markdown easy to read wherever you are. They've been merged
into a single tool with two modes:

- `mdv ./docs` — terminal UI with vim-style keybindings
- `mdv serve ./docs` — HTTP server with the same vim keymap on the web

The serve mode replaces `md-server` entirely, with extras the old
package didn't have:

- Same Shiki syntax highlighting as the TUI (any of 30+ themes)
- Live reload over WebSocket on `--watch`
- Mermaid diagrams (locally vendored, no CDN)
- Vim-style keyboard navigation (j/k, Tab panes, `/` search, etc.)
- WAI-ARIA tree sidebar with arrow-key support
- Single binary distribution via `bun build --compile`

## Migration

Install `mdv`:

```bash
brew install pders01/mdv/mdv
```

Or download a binary from
[Releases](https://github.com/pders01/mdv/releases).

Then swap commands:

| Old `md-server`              | New `mdv serve`                |
| ---------------------------- | ------------------------------ |
| `md-server`                  | `mdv serve .`                  |
| `md-server -d ./docs`        | `mdv serve ./docs`             |
| `md-server -p 3000`          | `mdv serve . -p 3000`          |
| `md-server -h 0.0.0.0`       | `mdv serve . --host 0.0.0.0`   |

## Archive

The original README and source are preserved in git history. The last
non-deprecated release is tagged
[`v1.1.2`](https://github.com/pders01/md/releases/tag/v1.1.2). If you
specifically need the old Express + Tailwind + Prism stack, that
release is the last one.

## License

MIT
