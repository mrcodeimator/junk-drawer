const { app, core, action } = require("photoshop");

async function invokeEntry(entry) {
  if (!app.documents.length) {
    const err = new Error("Open a document first.");
    err.code = "NO_DOCUMENT";
    throw err;
  }

  await core.executeAsModal(
    async () => {
      if (entry.descriptor) {
        await action.batchPlay(
          [
            {
              ...entry.descriptor,
              _options: { dialogOptions: "display" }
            }
          ],
          {}
        );
        return;
      }

      if (entry.menuItem) {
        await action.batchPlay(
          [
            {
              _obj: "select",
              _target: [
                {
                  _ref: "menuItemClass",
                  _enum: "menuItemType",
                  _value: entry.menuItem
                }
              ],
              _options: { dialogOptions: "display" }
            }
          ],
          {}
        );
        return;
      }

      throw new Error(`No invoke method for "${entry.name}".`);
    },
    { commandName: entry.name, interactive: true }
  );
}
