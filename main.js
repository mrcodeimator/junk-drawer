const { entrypoints } = require("uxp");
const fs = require("uxp").storage.localFileSystem;

const dialog = document.getElementById("search-dialog");
const search = createSearchController(dialog, window.invokeEntry);

const TRIGGER_URL = "file:///tmp/junk-drawer-open.trigger";
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
        const button = document.getElementById("panel-open");
        if (button && !button.dataset.bound) {
          button.dataset.bound = "1";
          button.addEventListener("click", openJunkDrawer);
        }
      }
    }
  }
});

window.openJunkDrawer = openJunkDrawer;
