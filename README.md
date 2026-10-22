# Junk Drawer

Thin Photoshop search launcher for **Filters**, **Adjustments**, and **Layer Styles**.

A Spotlight-style search box opens from a shortcut. Pick an item to open Photoshop’s **native dialog** on your current document/layer.

## Requirements

- Adobe Photoshop **27.0+** (tested target: 27.10.0)
- macOS or Windows
- Creative Cloud desktop app (installs the `.ccx` package)

## Install (Step-by-Step Guide)

### Step 1: Download the files
From the **Assets** section at the bottom of the [latest GitHub Release](../../releases/latest), download:
- **`com.junkdrawer.search.ccx`** (the Photoshop plugin)
- **`Junk Drawer.jsx`** (optional helper if you want a keyboard shortcut)

### Step 2: Install the plugin
1. Find **`com.junkdrawer.search.ccx`** in your **Downloads** folder and **double-click** it.
2. The **Adobe Creative Cloud** desktop app will open and warn that this plugin wasn't installed from the Adobe Marketplace. Click **Install** (or **OK**) to confirm.
3. Open **Adobe Photoshop**.
4. In the top menu bar, click **Plugins → Junk Drawer → Junk Drawer** to open the small Junk Drawer panel.
   - *Tip:* Dock this panel into a corner or collapsed sidebar of your Photoshop workspace and leave it open — it needs to stay open in the background if you use a keyboard shortcut.
5. Test it out by clicking **Open Search** inside the panel (or **Plugins → Junk Drawer → Open Junk Drawer** in the top menu).

---

## Step 3: Set up a Keyboard Shortcut (Recommended)

Photoshop doesn't let plugins assign their own keyboard shortcuts directly, so Junk Drawer uses the small `Junk Drawer.jsx` file you downloaded to trigger the search bar from any key combo you like.

### 1. Move `Junk Drawer.jsx` into Photoshop's Scripts folder
- **On Windows:**
  1. Open **File Explorer** and go to:
     `C:\Program Files\Adobe\Adobe Photoshop 2026\Presets\Scripts`
     *(If you use a different year of Photoshop, open that year's folder instead.)*
  2. Drag **`Junk Drawer.jsx`** from your Downloads folder into the **Scripts** folder.
  3. If Windows asks for Administrator permission to copy the file, click **Continue**.
- **On Mac:**
  1. Open **Finder** and click **Applications** in the sidebar.
  2. Open your **Adobe Photoshop 2026** folder *(or your current Photoshop year)* → **Presets** → **Scripts**.
  3. Drag **`Junk Drawer.jsx`** from your Downloads folder into the **Scripts** folder (enter your Mac password if prompted).

### 2. Pick your shortcut inside Photoshop
1. **Quit and reopen Photoshop** (Photoshop only scans for new scripts when it starts up).
2. In the top menu bar, click **Edit → Keyboard Shortcuts…**
   *(Shortcut: `Alt + Shift + Ctrl + K` on Windows, `Option + Shift + Cmd + K` on Mac).*
3. Set **Shortcuts For** to **Application Menus**.
4. In the list below, click the arrow next to **File**, then scroll down to **Scripts** and expand it.
5. Click **`Junk Drawer`** in the list.
6. Press the keyboard shortcut you want to use (we recommend **`Ctrl + Shift + Space`** on Windows or **`Control + Shift + Space`** on Mac).
   - *Mac note:* Avoid `Option + Space` or `Cmd + Space`, as macOS reserves those for Spotlight / Input Sources.
7. Click **Accept**, then click **OK**.

---

## How to Uninstall

Open the **Adobe Creative Cloud** desktop app → **Stock & Marketplace** → **Plugins** → **Manage plugins**, click the **`…`** menu next to **Junk Drawer**, and select **Uninstall**.

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
