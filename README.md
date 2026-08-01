# Cairn Notes

A Chrome extension (Manifest V3) that lets you capture and organize responses from Claude.ai conversations.

## What it does

**Three ways to save content from a conversation:**

- **Clip** — saves a block of text and marks it with a left-border highlight in the conversation. Useful for preserving anything you want to revisit.
- **Annotate** — same as Clip, but attaches a label and uses a secondary highlight color. Good for tagging content by theme or action item.
- **Comment** — saves selected text with a free-form note attached. Highlighted in yellow in the conversation. Comments don't appear in Clips — they live in their own tab.

Select any text in a Claude conversation and a button bar appears with all three options.

**Keyboard shortcut:**

With text selected in a message (or code block), double-tap **`c`** within about 400ms to Clip it — same as clicking the Clip button. Works even when Claude steals focus to the chat box; the taps are blocked from typing into the composer. Ignored while you're selecting inside the composer or Cairn UI, and when Cmd/Ctrl/Alt is held (so Copy still works).

**In-conversation modal:**

A floating modal loads automatically on every conversation. It shows your Clips, Annotations, and Comments in separate tabs. Click any card to scroll back to the highlighted text. Dismiss it with the close button; reopen it with the **Notes** button next to Share in the conversation header.

**Library page:**

Click the extension toolbar icon to open a full-page library. Browse all saved notes across every conversation, search by keyword, filter annotations by label, and export everything as Markdown.

## Installation

This is a development build — no Web Store listing yet.

1. Clone or download this repository
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the repository folder

## Storage

Everything is saved locally via Chrome's storage API under the key `claudeNotesV2`. Nothing leaves your browser.

## Development

Edit the files, then reload the extension at `chrome://extensions/` and refresh Claude.ai. Most logic lives in `content.js`; the library page is `library.html/js/css`; `background.js` is a thin message relay.

## License

MIT
