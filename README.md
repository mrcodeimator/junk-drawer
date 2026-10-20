# Junk Drawer

Thin Photoshop search launcher for **Filters**, **Adjustments**, and **Layer Styles**.

A Spotlight-style search box opens from a shortcut. Pick an item to open Photoshop’s **native dialog** on your current document/layer.

## Requirements

- Adobe Photoshop **27.0+** (tested target: 27.10.0)
- macOS (shortcut helper uses a Scripts shortcut + a tiny trigger file)

## Install the plugin

1. Install [Adobe UXP Developer Tools](https://developer.adobe.com/photoshop/uxp/guides/devtool/) (or load via your usual UXP workflow).
2. Add this folder as a plugin and **Load**.
3. In Photoshop, open **Plugins → Junk Drawer** once and leave the panel open for the session (keeps the shortcut watcher alive).
4. Confirm **Plugins → Junk Drawer → Open Junk Drawer** works.

## One-time shortcut setup

UXP plugins cannot register their own global shortcuts, so Junk Drawer uses a tiny Photoshop script.

1. Copy [`scripts/Junk Drawer.jsx`](scripts/Junk%20Drawer.jsx) into Photoshop’s Scripts folder:
   - Typical path: `/Applications/Adobe Photoshop 2026/Presets/Scripts/`
   - Version folder name may differ for your install.
2. Quit and reopen Photoshop.
3. Confirm **File → Scripts → Junk Drawer** appears.
4. **Edit → Keyboard Shortcuts…** (⌥⇧⌘K).
5. Find **File → Scripts → Junk Drawer** and assign a free shortcut.

### Recommended shortcut

Use **Control+Shift+Space** (⌃⇧Space).

**Option+Space usually will not work.** macOS often owns ⌥Space / related Space combos for Input Sources (or other apps do). Photoshop then refuses the binding or nothing happens.

If you specifically want **⌥ Space**:

1. Open **System Settings → Keyboard → Keyboard Shortcuts → Input Sources**.
2. Turn off / clear shortcuts that use Space.
3. Also check Spotlight, Raycast, Alfred, Keyboard Maestro, etc.
4. Re-open Photoshop’s Keyboard Shortcuts and try assigning ⌥ Space again.

### How the helper works

The script only writes `/tmp/junk-drawer-open.trigger`. The loaded plugin notices that within ~50ms and opens search.

There is no AppleScript menu-clicking anymore (that path was the slow part).

## Use

1. Press your Scripts shortcut (or Plugins → Junk Drawer → Open Junk Drawer).
2. With an empty field, see up to **5 recent** items.
3. Type to filter Filters / Adjustments / Layer Styles.
4. **↑ / ↓** to move, **Enter** to run, or click a row.
5. Photoshop’s native dialog opens when the command supports one.
6. **Esc** to dismiss.

If no document is open, search still opens. Running a command shows an error until a document exists.

## Project layout

- `manifest.json` — UXP plugin manifest (PS 27+)
- `catalog.js` — searchable Filters / Adjustments / Layer Styles
- `search-ui.js` — search overlay behavior
- `invoke.js` — native dialog invocation via `batchPlay` + `executeAsModal`
- `recents.js` — recent items (max 5)
- `scripts/Junk Drawer.jsx` — fast shortcut helper

## Notes

- Some Photoshop menu/filter IDs vary by version; if an item fails, it may need a catalog tweak.
- This is a launcher only — it does not reimplement effect UIs.
- Keep the Junk Drawer panel open (or at least the plugin loaded) so the shortcut trigger is noticed.
