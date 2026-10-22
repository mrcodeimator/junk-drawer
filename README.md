# Junk Drawer

Thin Photoshop search launcher for **Filters**, **Adjustments**, and **Layer Styles**.

A Spotlight-style search box opens from a shortcut. Pick an item to open Photoshop’s **native dialog** on your current document/layer.

## Requirements

- Adobe Photoshop **27.0+** (tested target: 27.10.0)
- macOS or Windows
- Creative Cloud desktop app (installs the `.ccx` package)

---

## Install (Step-by-Step Guide)

### Step 1: Download & Install the Plugin
1. From the **Assets** section at the bottom of the [latest GitHub Release](../../releases/latest), download **`com.junkdrawer.search.ccx`**.
2. Open your **Downloads** folder and **double-click `com.junkdrawer.search.ccx`**.
3. The **Adobe Creative Cloud** desktop app will open and ask you to confirm installing a plugin from outside the Marketplace — click **Install** (or **OK**).
4. Open **Adobe Photoshop** and go to **Plugins → Junk Drawer → Junk Drawer** in the top menu bar.
   - *Tip:* Dock this small panel into a corner or collapsed sidebar of your Photoshop workspace and leave it open — it needs to stay open in the background if you use a keyboard shortcut.

---

### Step 2: Set Up Your Keyboard Shortcut (Built-In Walkthrough)

You can set up your keyboard shortcut directly from the **Junk Drawer** panel inside Photoshop:

![Step 1: Junk Drawer Panel Shortcut Walkthrough](docs/images/install-step-1-panel.svg)

1. In the **Junk Drawer** panel, click **Set Up Shortcut…**
2. Click **1. Save Shortcut File…**
   - Junk Drawer will try to copy `Junk Drawer.jsx` into your Photoshop `Presets/Scripts` folder automatically.
   - If Windows or macOS asks where to save it (because the Applications/Program Files folder is administrator-protected), save `Junk Drawer.jsx` into:
     - **Windows:** `C:\Program Files\Adobe\Adobe Photoshop 2026\Presets\Scripts`
     - **Mac:** `/Applications/Adobe Photoshop 2026/Presets/Scripts`
     *(If your computer blocks saving directly there, save to **Downloads** first and drag `Junk Drawer.jsx` into that `Scripts` folder.)*
3. **Quit and reopen Photoshop** so Photoshop detects the new script.
4. Back in the Junk Drawer panel, click **2. Open Keyboard Shortcuts** (or go to **Edit → Keyboard Shortcuts…** in the top menu).

![Step 2: Assign Shortcut in Photoshop](docs/images/install-step-2-shortcut.svg)

5. In the **Keyboard Shortcuts** window:
   - Expand **File → Scripts** and click **Junk Drawer**.
   - Press **`Ctrl + Shift + Space`** (Windows) or **`Control + Shift + Space`** (Mac).
     *(On Mac, avoid `Option + Space` or `Cmd + Space` since macOS reserves those for Spotlight / Input Sources.)*
   - Click **Accept**, then click **OK**.

---

## How to Use

1. Press your shortcut (e.g. **Ctrl+Shift+Space**) or click **Open Search** in the Junk Drawer panel.
2. With an empty field, see up to **5 recent** items.
3. Type to filter Filters / Adjustments / Layer Styles.
4. **↑ / ↓** to move, **Enter** to run, or click a row.
5. Photoshop’s native dialog opens when the command supports one.
6. **Esc** to dismiss.

If no document is open, search still opens. Running a command shows an error until a document exists.

---

## Send Feedback / Report an Issue

Click **Send Feedback** in the bottom-right corner of the Junk Drawer panel inside Photoshop, or open the feedback form directly here:
👉 **[Junk Drawer Feedback Form](https://forms.gle/HXWdUyUf8LyiaFfK9)**

---

## How to Uninstall

Open the **Adobe Creative Cloud** desktop app → **Stock & Marketplace** → **Plugins** → **Manage plugins**, click the **`…`** menu next to **Junk Drawer**, and select **Uninstall**.

---

## Install (Development)

1. Install [Adobe UXP Developer Tools](https://developer.adobe.com/photoshop/uxp/guides/devtool/).
2. Add this folder as a plugin and **Load**.

## Building a Release

Run `./scripts/package.sh`. It writes `dist/com.junkdrawer.search.ccx` (plugin files zipped with `manifest.json` at the root) and copies `Junk Drawer.jsx` next to it.

## Project Layout

- `manifest.json` — UXP plugin manifest (PS 27+)
- `catalog.js` — searchable Filters / Adjustments / Layer Styles
- `search-ui.js` — search overlay behavior
- `invoke.js` — native dialog invocation via `batchPlay` + `executeAsModal`
- `recents.js` — recent items (max 5)
- `scripts/Junk Drawer.jsx` — standalone copy of the shortcut helper
- `scripts/package.sh` — builds the `.ccx`
