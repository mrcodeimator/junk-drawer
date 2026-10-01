#target photoshop
/*
  Junk Drawer launcher
  --------------------
  1. Copy this file into Photoshop's Presets/Scripts folder
  2. Restart Photoshop
  3. Edit > Keyboard Shortcuts… → File > Scripts > Junk Drawer
  4. Assign Option+Space (⌥ Space)

  If macOS uses Option+Space for input sources, clear that in
  System Settings → Keyboard → Keyboard Shortcuts → Input Sources.
*/

(function () {
  function writeTrigger() {
    try {
      var trigger = new File("/tmp/junk-drawer-open.trigger");
      trigger.open("w");
      trigger.write(String(new Date().getTime()));
      trigger.close();
      return true;
    } catch (e) {
      return false;
    }
  }

  function clickPluginMenu() {
    // Writes a temp AppleScript file to avoid nested-quote pain,
    // then asks System Events to click:
    // Plugins → Junk Drawer → Open Junk Drawer
    // May require Accessibility permission on newer macOS.
    try {
      var scpt = new File(Folder.temp.fsName + "/junk-drawer-launch.scpt");
      scpt.open("w");
      scpt.writeln('tell application "System Events"');
      scpt.writeln('  set ps to first process whose name contains "Photoshop"');
      scpt.writeln("  tell ps");
      scpt.writeln("    set frontmost to true");
      scpt.writeln("    try");
      scpt.writeln(
        '      click menu item "Open Junk Drawer" of menu 1 of menu item "Junk Drawer" of menu "Plugins" of menu bar 1'
      );
      scpt.writeln("    on error");
      scpt.writeln(
        '      click menu item "Open Junk Drawer" of menu 1 of menu item "Junk Drawer" of menu 1 of menu bar item "Plugins" of menu bar 1'
      );
      scpt.writeln("    end try");
      scpt.writeln("  end tell");
      scpt.writeln("end tell");
      scpt.close();
      app.system('osascript "' + scpt.fsName + '"');
      return true;
    } catch (e) {
      return false;
    }
  }

  app.bringToFront();
  writeTrigger();
  var clicked = clickPluginMenu();
  if (!clicked) {
    alert(
      "Junk Drawer helper could not open the plugin menu.\n\n" +
        "Make sure the Junk Drawer UXP plugin is loaded, then try:\n" +
        "Plugins → Junk Drawer → Open Junk Drawer\n\n" +
        "If the panel is open, the trigger file alone may still launch search."
    );
  }
})();
