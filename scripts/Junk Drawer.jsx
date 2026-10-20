#target photoshop
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
      "Junk Drawer helper could not write its trigger file.\n\n" +
        "You can still open search from:\n" +
        "Plugins → Junk Drawer → Open Junk Drawer"
    );
  }
})();
