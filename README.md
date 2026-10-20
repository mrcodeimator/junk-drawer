# Junk Drawer

Thin Photoshop search launcher for **Filters**, **Adjustments**, and **Layer Styles**.

A Spotlight-style search box opens from a shortcut. Pick an item to open Photoshop’s **native dialog** on your current document/layer.

## Requirements

- Adobe Photoshop **27.0+** (tested target: 27.10.0)
- macOS or Windows
- Creative Cloud desktop app (installs the `.ccx` package)

## Install (release package)

1. Download `com.junkdrawer.search.ccx` and `Junk Drawer.jsx` from the release.
2. Double-click `com.junkdrawer.search.ccx`. Creative Cloud asks to confirm installing a plugin from outside the Marketplace — accept.
3. In Photoshop, open **Plugins → Junk Drawer** once and leave the panel open for the session (keeps the shortcut watcher alive).
4. Confirm **Plugins → Junk Drawer → Open Junk Drawer** works.

To uninstall: Creative Cloud desktop app → **Stock & Marketplace → Plugins → Manage plugins**.

## Install (development)

1. Install [Adobe UXP Developer Tools](https://developer.adobe.com/photoshop/uxp/guides/devtool/).
2. Add this folder as a plugin and **Load**.

## One-time shortcut setup

UXP plugins cannot register their own global shortcuts, so Junk Drawer uses a tiny Photoshop script.

1. Copy [`scripts/Junk Drawer.jsx`](scripts/Junk%20Drawer.jsx) into Photoshop’s Scripts folder:
   - macOS: `/Applications/Adobe Photoshop 2026/Presets/Scripts/`
   - Windows: `C:\Program Files\Adobe\Adobe Photoshop 2026\Presets\Scripts\` (needs admin rights)
   - Version folder name may differ for your install.
2. Quit and reopen Photoshop.
3. Confirm **File → Scripts → Junk Drawer** appears.
4. **Edit → Keyboard Shortcuts…** (⌥⇧⌘K on macOS, Alt+Shift+Ctrl+K on Windows).
5. Find **File → Scripts → Junk Drawer** and assign a free shortcut.

### Recommended shortcut

Use **Control+Shift+Space**.

On macOS, **Option+Space usually will not work** — macOS often owns ⌥Space for Input Sources (or Spotlight, Raycast, Alfred, etc. do), so Photoshop refuses the binding. Clear it in **System Settings → Keyboard → Keyboard Shortcuts → Input Sources** if you want it.

### How the helper works

The script only writes a timestamp to `.junk-drawer-open.trigger` in your home folder (`~` on macOS, `%USERPROFILE%` on Windows). The loaded plugin notices that within ~50ms and opens search.

## Use

1. Press your Scripts shortcut (or Plugins → Junk Drawer → Open Junk Drawer).
2. With an empty field, see up to **5 recent** items.
3. Type to filter Filters / Adjustments / Layer Styles.
4. **↑ / ↓** to move, **Enter** to run, or click a row.
5. Photoshop’s native dialog opens when the command supports one.
6. **Esc** to dismiss.

If no document is open, search still opens. Running a command shows an error until a document exists.

## Building a release

Run `./scripts/package.sh`. It writes `dist/com.junkdrawer.search.ccx` (plugin files zipped with `manifest.json` at the root) and copies `Junk Drawer.jsx` next to it. Alternatively use **Package** in UXP Developer Tools.

## Project layout

- `manifest.json` — UXP plugin manifest (PS 27+)
- `catalog.js` — searchable Filters / Adjustments / Layer Styles
- `search-ui.js` — search overlay behavior
- `invoke.js` — native dialog invocation via `batchPlay` + `executeAsModal`
- `recents.js` — recent items (max 5)
- `scripts/Junk Drawer.jsx` — shortcut helper
- `scripts/package.sh` — builds the `.ccx`

## Notes

- Some Photoshop menu/filter IDs vary by version; if an item fails, it may need a catalog tweak.
- This is a launcher only — it does not reimplement effect UIs.
- Keep the Junk Drawer panel open (or at least the plugin loaded) so the shortcut trigger is noticed.
