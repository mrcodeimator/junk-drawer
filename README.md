# Junk Drawer

Thin Photoshop search launcher for **Filters**, **Adjustments**, and **Layer Styles**.

Option+Space opens a Spotlight-style search box. Pick an item to open Photoshop’s **native dialog** on your current document/layer.

## Requirements

- Adobe Photoshop **27.0+** (tested target: 27.10.0)
- macOS (Option+Space helper uses a Scripts shortcut + optional Accessibility click)

## Install the plugin

1. Install [Adobe UXP Developer Tools](https://developer.adobe.com/photoshop/uxp/guides/devtool/) (or load via your usual UXP workflow).
2. Add this folder as a plugin and **Load**.
3. In Photoshop, confirm **Plugins → Junk Drawer → Open Junk Drawer** works.

Optional: open the **Junk Drawer** panel once and leave it docked. That keeps the Option+Space trigger watcher running for the session.

## One-time Option+Space setup

UXP plugins cannot register global shortcuts themselves, so Junk Drawer ships a tiny helper script.

1. Copy [`scripts/Junk Drawer.jsx`](scripts/Junk%20Drawer.jsx) into Photoshop’s Scripts folder:
   - Typical path: `/Applications/Adobe Photoshop 2026/Presets/Scripts/`
   - Version folder name may differ for your install.
2. Quit and reopen Photoshop.
3. Confirm **File → Scripts → Junk Drawer** appears.
4. **Edit → Keyboard Shortcuts…** (⌥⇧⌘K).
5. Find **File → Scripts → Junk Drawer** and assign **⌥ Space** (Option+Space).
6. If macOS steals Option+Space for input switching, clear it under **System Settings → Keyboard → Keyboard Shortcuts → Input Sources**.

### How the helper works

The script writes a trigger file to `/tmp/junk-drawer-open.trigger` and also tries to click **Plugins → Junk Drawer → Open Junk Drawer** via AppleScript.

- Trigger file path works when the Junk Drawer panel/plugin is loaded and polling.
- Menu click works if Accessibility permission allows controlling Photoshop.

## Use

1. Press **Option+Space** (or Plugins → Junk Drawer → Open Junk Drawer).
2. With an empty field, see up to **5 recent** items.
3. Type to filter Filters / Adjustments / Layer Styles.
4. **↑ / ↓** to move, **Enter** to run, or click a row.
5. Photoshop’s native dialog opens when the command supports one.
6. **Esc** or click outside the search box to dismiss.

If no document is open, search still opens. Running a command shows an error until a document exists.

## Project layout

- `manifest.json` — UXP plugin manifest (PS 27+)
- `catalog.js` — searchable Filters / Adjustments / Layer Styles
- `search-ui.js` — search overlay behavior
- `invoke.js` — native dialog invocation via `batchPlay` + `executeAsModal`
- `recents.js` — recent items (max 5)
- `scripts/Junk Drawer.jsx` — Option+Space helper

## Notes

- Some Photoshop menu/filter IDs vary by version; if an item fails, it may need a catalog tweak.
- This is a launcher only — it does not reimplement effect UIs.
