# Gemini Sucks - Firefox Extension

A Firefox extension that aggressively removes Google AI Overviews and AI generated content from search results using three layered approaches.

## How It Works

### Layer 1 — Query Term (`-ai`)
Appends `-ai` to every search query. This signals to Google's ranking engine to exclude AI-heavy content from results.

### Layer 2 — CSS + DOM Removal (content script)
A content script and injected stylesheet hide known AI Overview DOM elements using their CSS class names and `jscontroller` attributes. This is a belt-and-suspenders fallback for any AI content that slips through despite the URL parameters.

## Installation (Temporary / Developer)

1. Open Firefox and navigate to `about:debugging`
2. Click **"This Firefox"**
3. Click **"Load Temporary Add-on..."**
4. Select the `manifest.json` file from this directory

## Prod Version Available on Firefox Extensions Page

The extension will stay active until you restart Firefox. For a permanent install, the extension must be signed via [AMO](https://addons.mozilla.org).

## Files

- `manifest.json` — Extension manifest (Manifest V2)
- `background.js` — `webRequest` interceptor that rewrites Google Search URLs
- `content.js` — DOM observer that removes AI elements after page load
- `content.css` — CSS injected at `document_start` to instantly hide AI blocks
- `icons/icon.svg` — Extension icon

## Notes

- Only plain web searches are modified (`tbm` parameter absent). Image, Video, News, and Shopping searches are left untouched.
- The extension does not collect, transmit, or store any data.
