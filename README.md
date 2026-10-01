# Cairn Notes

[![Cairn promo — click to watch the full video](promo/cairn-promo.gif)](promo/cairn-promo.mp4)

*Click the preview to watch the full 30-second video (MP4).*

A Chrome extension (Manifest V3) for keeping what matters from everything you read — on Claude.ai, other AI chats, or any web page.

## What it does

Select text on a page and a small bar appears with these actions:

- **Clip** — saves the selection and highlights it on the page so you can find it again.
- **Add to Topic** — saves the selection under a topic (pick an existing one or create a new one) with a separate highlight color. Your last-used topic stays selected, so filing a run of clips takes one click each. Topics are shared across every site: a topic you use in Claude and on any other page collects all of those clips in one place.
- **Comment** *(Claude.ai only)* — saves the selection with a note attached, highlighted in yellow.

**Keyboard shortcuts** — with text selected, double-tap a key within about 400ms:

| Keys | Action |
|---|---|
| `c` `c` | Clip |
| `t` `t` | Add to Topic |
| `k` `k` | Comment (Claude.ai only) |

Shortcut saves don't open the Notes panel; a small toast appears at the top right with an **Open notes** link instead. Shortcuts are ignored inside Cairn's own UI and when Cmd/Ctrl/Alt is held, so Copy still works. On Claude.ai they're also ignored while selecting inside the message composer.

**Notes panel** — an in-page panel with **Clips** (for the current page or conversation), **Topics** (filter by topic across every site), and on Claude.ai **Comments**. Click a card to scroll back to its highlight. Open it from the extension's toolbar icon on any site, or the **Notes** button next to Share in a Claude conversation header. It also opens automatically on pages where you already have clips.

**Settings** — the gear icon in the Notes panel header lets you:

- turn off **Show buttons on highlight**, if the selection bar pops up more than you'd like — the double-tap shortcuts keep working, and
- **View onboarding again**.

**Library** — **Open notebook** in the Notes panel opens a full-page library of every saved note across all sites, with Clips, Topics, and Comments tabs, search, topic management, and a Markdown download for each conversation or site.

## Installation

This is a development build — no Web Store listing yet.

1. Clone or download this repository
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the repository folder

## Storage

Everything is saved locally via Chrome's storage API — notes under `cairnNotesV2`, topics under `cairnTopics`. Nothing leaves your browser.

## Development

Edit the files, then reload the extension at `chrome://extensions/` and refresh the page you're testing on. Most logic lives in `content.js`; the library page is `library.html/js/css`; `background.js` is a thin message relay.

The promo video is rendered from `promo/promo.html` — open it in Chrome for a live preview, or add `?t=12` to the URL to freeze a single frame.

## License

MIT
