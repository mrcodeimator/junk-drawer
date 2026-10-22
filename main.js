const { entrypoints, shell, host } = require("uxp");
const fs = require("uxp").storage.localFileSystem;
const { core, action } = require("photoshop");

const FEEDBACK_FORM_URL = "https://forms.gle/HXWdUyUf8LyiaFfK9";

const HELPER_SCRIPT_NAME = "Junk Drawer.jsx";
const HELPER_SCRIPT_SOURCE = `#target photoshop
/*
  Junk Drawer launcher (macOS + Windows)
  --------------------------------------
  1. Copy this file into Photoshop's Presets/Scripts folder
  2. Restart Photoshop
  3. Edit > Keyboard Shortcuts… → File > Scripts > Junk Drawer
  4. Assign a free shortcut (Control+Shift+Space works well)

  Writes a timestamp to ~/.junk-drawer-open.trigger. The loaded
  Junk Drawer plugin watches that file and opens search.
*/

(function () {
  var isWindows = $.os.indexOf("Windows") !== -1;
  var home = $.getenv(isWindows ? "USERPROFILE" : "HOME");

  function writeTrigger() {
    if (!home) return false;
    try {
      var trigger = new File(home + "/.junk-drawer-open.trigger");
      trigger.encoding = "UTF-8";
      if (!trigger.open("w")) return false;
      trigger.write(String(new Date().getTime()));
      trigger.close();
      return true;
    } catch (e) {
      return false;
    }
  }

  if (!writeTrigger()) {
    alert(
      "Junk Drawer helper could not write its trigger file.\\n\\n" +
        "You can still open search from:\\n" +
        "Plugins → Junk Drawer → Open Junk Drawer"
    );
  }
})();
`;

const dialog = document.getElementById("search-dialog");
const search = createSearchController(dialog, window.invokeEntry);

function isWindowsOS() {
  try {
    return require("os").platform() === "win32";
  } catch (_) {
    return navigator.platform.indexOf("Win") !== -1;
  }
}

function toFileUrl(nativePath) {
  const clean = String(nativePath).replace(/\\/g, "/").replace(/\/+$/, "");
  const prefix = clean.startsWith("/") ? "file://" : "file:///";
  return `${prefix}${encodeURI(clean)}`;
}

// Must match the path written by scripts/Junk Drawer.jsx (HOME on macOS, USERPROFILE on Windows).
function triggerUrl() {
  const home = require("os").homedir().replace(/\\/g, "/").replace(/\/+$/, "");
  const prefix = home.startsWith("/") ? "file://" : "file:///";
  return `${prefix}${home}/.junk-drawer-open.trigger`;
}

const TRIGGER_URL = triggerUrl();
let lastTriggerStamp = "";
let pollTimer = null;

function openJunkDrawer() {
  search.open();
}

async function checkTriggerFile() {
  try {
    const entry = await fs.getEntryWithUrl(TRIGGER_URL);
    if (!entry) return;
    const text = await entry.read();
    const stamp = String(text || "").trim();
    if (!stamp || stamp === lastTriggerStamp) return;
    lastTriggerStamp = stamp;
    openJunkDrawer();
  } catch (_) {
    // Trigger file missing is normal until the helper script runs.
  }
}

function startTriggerPolling() {
  if (pollTimer) return;
  // 50ms keeps shortcut → search snappy without AppleScript menu clicking.
  pollTimer = setInterval(checkTriggerFile, 50);
  checkTriggerFile();
}

/**
 * Candidate Photoshop Presets/Scripts directories on macOS and Windows.
 */
function candidateScriptsFolders() {
  const years = ["2026", "2027", "2025", "Beta"];
  if (isWindowsOS()) {
    return years.map((yr) => `C:/Program Files/Adobe/Adobe Photoshop (${yr})/Presets/Scripts`).concat(
      years.map((yr) => `C:/Program Files/Adobe/Adobe Photoshop ${yr}/Presets/Scripts`)
    );
  }
  return years.map((yr) => `/Applications/Adobe Photoshop ${yr}/Presets/Scripts`).concat(
    years.map((yr) => `/Applications/Adobe Photoshop (${yr})/Presets/Scripts`)
  );
}

/**
 * Check if Junk Drawer.jsx is already installed in any Photoshop Presets/Scripts folder.
 */
async function findInstalledHelperScript() {
  const folders = candidateScriptsFolders();
  for (let i = 0; i < folders.length; i += 1) {
    try {
      const fileUrl = toFileUrl(`${folders[i]}/${HELPER_SCRIPT_NAME}`);
      const entry = await fs.getEntryWithUrl(fileUrl);
      if (entry && entry.isFile) {
        return folders[i];
      }
    } catch (_) {
      // Not in this folder
    }
  }
  return null;
}

/**
 * Attempt to automatically copy Junk Drawer.jsx into existing Photoshop Presets/Scripts folders,
 * or fall back to an easy Save File dialog if the OS requires Administrator elevation.
 */
async function installHelperScript() {
  const statusEl = document.getElementById("setup-status");
  const setStatus = (msg, isErr) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.classList.toggle("is-error", Boolean(isErr));
  };

  const folders = candidateScriptsFolders();
  for (let i = 0; i < folders.length; i += 1) {
    try {
      const folderEntry = await fs.getEntryWithUrl(toFileUrl(folders[i]));
      if (folderEntry && folderEntry.isFolder) {
        const fileEntry = await folderEntry.createFile(HELPER_SCRIPT_NAME, { overwrite: true });
        await fileEntry.write(HELPER_SCRIPT_SOURCE);
        setStatus(`✓ Installed "${HELPER_SCRIPT_NAME}" into ${folders[i]}. Restart Photoshop, then click "2. Open Keyboard Shortcuts".`, false);
        await refreshShortcutStatus();
        return;
      }
    } catch (_) {
      // Folder missing or requires admin permissions — try next or fall back to Save dialog
    }
  }

  // Fallback: Open native Save dialog so the OS handles permissions cleanly
  try {
    const defaultHint = isWindowsOS()
      ? "C:\\Program Files\\Adobe\\Adobe Photoshop 2026\\Presets\\Scripts"
      : "/Applications/Adobe Photoshop 2026/Presets/Scripts";
    setStatus(`Save "${HELPER_SCRIPT_NAME}" into your Photoshop Presets/Scripts folder (${defaultHint}).`, false);

    const saveEntry = await fs.getFileForSaving(HELPER_SCRIPT_NAME, { types: ["jsx"] });
    if (!saveEntry) {
      setStatus("Canceled saving Junk Drawer.jsx.", true);
      return;
    }
    await saveEntry.write(HELPER_SCRIPT_SOURCE);
    setStatus(
      `✓ Saved "${HELPER_SCRIPT_NAME}"! Now restart Photoshop and click "2. Open Keyboard Shortcuts".`,
      false
    );
    await refreshShortcutStatus();
  } catch (err) {
    setStatus(
      `Could not write file directly (${err && err.message ? err.message : "permission denied"}). Save to Downloads first, then drag "Junk Drawer.jsx" into Presets/Scripts.`,
      true
    );
  }
}

/**
 * Open Photoshop's native Edit > Keyboard Shortcuts… dialog.
 */
async function openKeyboardShortcutsDialog() {
  const statusEl = document.getElementById("setup-status");
  try {
    await core.executeAsModal(
      async () => {
        await action.batchPlay(
          [
            {
              _obj: "select",
              _target: [
                {
                  _ref: "menuItemClass",
                  _enum: "menuItemType",
                  _value: "keyboardShortcuts"
                }
              ],
              _options: { dialogOptions: "display" }
            }
          ],
          {}
        );
      },
      { commandName: "Open Keyboard Shortcuts", interactive: true }
    );
  } catch (_) {
    if (statusEl) {
      const keyHint = isWindowsOS() ? "Alt+Shift+Ctrl+K" : "Option+Shift+Cmd+K";
      statusEl.textContent = `Open Edit → Keyboard Shortcuts… (${keyHint}) from the top menu bar.`;
      statusEl.classList.remove("is-error");
    }
  }
}

async function refreshShortcutStatus() {
  const pill = document.getElementById("shortcut-pill");
  const setupBtn = document.getElementById("panel-setup-shortcut");
  const installedFolder = await findInstalledHelperScript();
  if (installedFolder) {
    if (pill) {
      pill.textContent = "✓ Shortcut script installed";
      pill.classList.add("is-ready");
    }
    if (setupBtn) {
      setupBtn.textContent = "Shortcut Setup";
    }
  } else {
    if (pill) {
      pill.textContent = "Keep panel open for shortcut";
      pill.classList.remove("is-ready");
    }
  }
}

function bindPanelControls() {
  const openBtn = document.getElementById("panel-open");
  if (openBtn && !openBtn.dataset.bound) {
    openBtn.dataset.bound = "1";
    openBtn.addEventListener("click", openJunkDrawer);
  }

  const setupBtn = document.getElementById("panel-setup-shortcut");
  const setupCard = document.getElementById("setup-card");
  const closeBtn = document.getElementById("setup-close");
  const installBtn = document.getElementById("setup-install-btn");
  const kbscBtn = document.getElementById("setup-kbsc-btn");
  const feedbackLink = document.getElementById("feedback-link");

  if (setupBtn && !setupBtn.dataset.bound) {
    setupBtn.dataset.bound = "1";
    setupBtn.addEventListener("click", async () => {
      if (!setupCard) return;
      const willShow = setupCard.hasAttribute("hidden");
      if (willShow) {
        setupCard.removeAttribute("hidden");
        const installed = await findInstalledHelperScript();
        const statusEl = document.getElementById("setup-status");
        if (statusEl) {
          statusEl.classList.remove("is-error");
          statusEl.textContent = installed
            ? `✓ Found Junk Drawer.jsx in ${installed}`
            : "Follow these 3 quick steps to set up your shortcut:";
        }
      } else {
        setupCard.setAttribute("hidden", "");
      }
    });
  }

  if (closeBtn && !closeBtn.dataset.bound) {
    closeBtn.dataset.bound = "1";
    closeBtn.addEventListener("click", () => {
      if (setupCard) setupCard.setAttribute("hidden", "");
    });
  }

  if (installBtn && !installBtn.dataset.bound) {
    installBtn.dataset.bound = "1";
    installBtn.addEventListener("click", installHelperScript);
  }

  if (kbscBtn && !kbscBtn.dataset.bound) {
    kbscBtn.dataset.bound = "1";
    kbscBtn.addEventListener("click", openKeyboardShortcutsDialog);
  }

  if (feedbackLink && !feedbackLink.dataset.bound) {
    feedbackLink.dataset.bound = "1";
    feedbackLink.addEventListener("click", async () => {
      try {
        if (shell && typeof shell.openExternal === "function") {
          await shell.openExternal(FEEDBACK_FORM_URL, "Open Junk Drawer feedback form");
        }
      } catch (_) {
        // sp-link href handles navigation natively if openExternal isn't needed
      }
    });
  }

  refreshShortcutStatus();
}

entrypoints.setup({
  plugin: {
    create() {
      startTriggerPolling();
    }
  },
  commands: {
    openSearch: {
      run() {
        openJunkDrawer();
      }
    }
  },
  panels: {
    junkDrawerPanel: {
      show() {
        startTriggerPolling();
        bindPanelControls();
      }
    }
  }
});

window.openJunkDrawer = openJunkDrawer;
