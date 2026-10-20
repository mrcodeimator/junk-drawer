(() => {
const { app, core, action } = require("photoshop");

const BLACK = { _obj: "RGBColor", red: 0, grain: 0, blue: 0 };
const WHITE = { _obj: "RGBColor", red: 255, grain: 255, blue: 255 };
const PX = (value) => ({ _unit: "pixelsUnit", _value: value });
const PCT = (value) => ({ _unit: "percentUnit", _value: value });
const ANGLE = (value) => ({ _unit: "angleUnit", _value: value });
const BLEND = (value) => ({ _enum: "blendMode", _value: value });

/** Minimal defaults so Photoshop can open each effect pane in Layer Style. */
const LAYER_EFFECT_DEFAULTS = {
  dropShadow: {
    _obj: "dropShadow",
    mode: BLEND("multiply"),
    color: BLACK,
    opacity: PCT(35),
    useGlobalAngle: true,
    localLightingAngle: ANGLE(120),
    distance: PX(5),
    chokeMatte: PX(0),
    blur: PX(5),
    noise: PCT(0),
    antiAlias: false,
    layerConceals: true
  },
  innerShadow: {
    _obj: "innerShadow",
    mode: BLEND("multiply"),
    color: BLACK,
    opacity: PCT(35),
    useGlobalAngle: true,
    localLightingAngle: ANGLE(120),
    distance: PX(5),
    chokeMatte: PX(0),
    blur: PX(5),
    noise: PCT(0),
    antiAlias: false
  },
  outerGlow: {
    _obj: "outerGlow",
    mode: BLEND("screen"),
    opacity: PCT(35),
    noise: PCT(0),
    glowColor: WHITE,
    glowTechnique: { _enum: "matteTechnique", _value: "softMatte" },
    chokeMatte: PX(0),
    blur: PX(5),
    shadingNoise: PCT(0),
    inputRange: PCT(50)
  },
  innerGlow: {
    _obj: "innerGlow",
    mode: BLEND("screen"),
    opacity: PCT(35),
    noise: PCT(0),
    glowColor: WHITE,
    glowTechnique: { _enum: "matteTechnique", _value: "softMatte" },
    innerGlowSource: { _enum: "innerGlowSourceType", _value: "edgeGlow" },
    chokeMatte: PX(0),
    blur: PX(5),
    shadingNoise: PCT(0),
    inputRange: PCT(50)
  },
  bevelEmboss: {
    _obj: "bevelEmboss",
    highlightMode: BLEND("screen"),
    highlightColor: WHITE,
    highlightOpacity: PCT(50),
    shadowMode: BLEND("multiply"),
    shadowColor: BLACK,
    shadowOpacity: PCT(50),
    bevelTechnique: { _enum: "bevelTechnique", _value: "softMatte" },
    bevelStyle: { _enum: "bevelEmbossStyle", _value: "innerBevel" },
    useGlobalAngle: true,
    localLightingAngle: ANGLE(120),
    localLightingAltitude: ANGLE(30),
    strengthRatio: PCT(100),
    blur: PX(5),
    bevelDirection: { _enum: "bevelEmbossStampStyle", _value: "in" }
  },
  chromeFX: {
    _obj: "chromeFX",
    mode: BLEND("multiply"),
    color: BLACK,
    antiAlias: true,
    invert: false,
    opacity: PCT(50),
    localLightingAngle: ANGLE(120),
    distance: PX(11),
    blur: PX(14)
  },
  solidFill: {
    _obj: "solidFill",
    mode: BLEND("normal"),
    opacity: PCT(100),
    color: BLACK
  },
  gradientFill: {
    _obj: "gradientFill",
    mode: BLEND("normal"),
    opacity: PCT(100),
    type: { _enum: "gradientType", _value: "linear" },
    angle: ANGLE(90),
    dither: false,
    reverse: false,
    align: true,
    scale: PCT(100)
  },
  patternFill: {
    _obj: "patternFill",
    mode: BLEND("normal"),
    opacity: PCT(100),
    align: true,
    scale: PCT(100)
  },
  frameFX: {
    _obj: "frameFX",
    mode: BLEND("normal"),
    opacity: PCT(100),
    size: PX(3),
    style: { _enum: "frameStyle", _value: "outsetFrame" },
    paintType: { _enum: "frameFill", _value: "solidColor" },
    color: BLACK,
    overprint: false
  }
};

function friendlyError(err, entryName) {
  const raw = (err && (err.message || err.errorMessage || String(err))) || "";
  if (/unknown.*menu item/i.test(raw) || /not currently available/i.test(raw)) {
    return `"${entryName}" isn’t available on the current layer/document (or Photoshop rejected that command).`;
  }
  return raw || `Could not run "${entryName}".`;
}

async function playCommands(commands) {
  const results = await action.batchPlay(commands, {});
  const first = results && results[0];
  if (first && first.message) {
    const err = new Error(first.message);
    throw err;
  }
  return results;
}

async function playEvent(eventName, params) {
  await playCommands([
    {
      _obj: eventName,
      ...(params || {}),
      _options: { dialogOptions: "display" }
    }
  ]);
}

async function playDescriptor(descriptor) {
  await playCommands([
    {
      ...descriptor,
      _options: { dialogOptions: "display" }
    }
  ]);
}

async function openBlendingOptions() {
  await playCommands([
    {
      _obj: "set",
      _target: [
        { _ref: "property", _property: "blendOptions" },
        { _ref: "layer", _enum: "ordinal", _value: "targetEnum" }
      ],
      to: {
        _obj: "blendOptions",
        blendOptions: { _class: "blendOptions" }
      },
      _options: { dialogOptions: "display" }
    }
  ]);
}

async function getExistingLayerEffects() {
  try {
    const [result] = await action.batchPlay(
      [
        {
          _obj: "get",
          _target: [
            { _ref: "property", _property: "layerEffects" },
            { _ref: "layer", _enum: "ordinal", _value: "targetEnum" }
          ]
        }
      ],
      {}
    );
    if (result && result.layerEffects && typeof result.layerEffects === "object") {
      return { ...result.layerEffects, _obj: "layerEffects" };
    }
  } catch (_) {
    // Layer may have no effects yet.
  }
  return { _obj: "layerEffects", scale: PCT(100) };
}

async function openLayerEffect(effectKey) {
  const defaults = LAYER_EFFECT_DEFAULTS[effectKey];
  if (!defaults) {
    throw new Error(`No defaults for layer effect "${effectKey}".`);
  }

  const existing = await getExistingLayerEffects();
  const previous =
    existing[effectKey] && typeof existing[effectKey] === "object"
      ? existing[effectKey]
      : {};

  const effect = {
    ...defaults,
    ...previous,
    _obj: defaults._obj,
    enabled: true,
    present: true,
    showInDialog: true
  };

  await playCommands([
    {
      _obj: "set",
      _target: [
        { _ref: "property", _property: "layerEffects" },
        { _ref: "layer", _enum: "ordinal", _value: "targetEnum" }
      ],
      to: {
        ...existing,
        _obj: "layerEffects",
        scale: existing.scale || PCT(100),
        [effectKey]: effect
      },
      _options: { dialogOptions: "display" }
    }
  ]);
}

async function invokeMenuItem(menuItem) {
  await playCommands([
    {
      _obj: "select",
      _target: [
        {
          _ref: "menuItemClass",
          _enum: "menuItemType",
          _value: menuItem
        }
      ],
      _options: { dialogOptions: "display" }
    }
  ]);
}

/**
 * Run a catalog entry.
 * Order: blendingOptions → layerEffect → descriptor → event → menuItem
 * For event failures, try a couple of known alternate event IDs.
 */
async function invokeEntry(entry) {
  if (!app.documents.length) {
    const err = new Error("Open a document first.");
    err.code = "NO_DOCUMENT";
    throw err;
  }

  const alternates = entry.eventAlternates || [];

  try {
    await core.executeAsModal(
      async () => {
        if (entry.blendingOptions) {
          await openBlendingOptions();
          return;
        }

        if (entry.layerEffect) {
          try {
            await openLayerEffect(entry.layerEffect);
          } catch (_) {
            await openBlendingOptions();
          }
          return;
        }

        if (entry.descriptor) {
          await playDescriptor(entry.descriptor);
          return;
        }

        if (entry.event) {
          let lastError = null;
          const candidates = [entry.event].concat(alternates);
          for (let i = 0; i < candidates.length; i += 1) {
            try {
              await playEvent(candidates[i], entry.params);
              return;
            } catch (err) {
              lastError = err;
            }
          }
          // Last resort: treat the event name as a menu item.
          try {
            await invokeMenuItem(entry.event);
            return;
          } catch (_) {
            throw lastError || new Error(`Could not run "${entry.name}".`);
          }
        }

        if (entry.menuItem) {
          try {
            await invokeMenuItem(entry.menuItem);
          } catch (menuErr) {
            try {
              await playEvent(entry.menuItem, entry.params);
            } catch (_) {
              throw menuErr;
            }
          }
          return;
        }

        throw new Error(`No invoke method for "${entry.name}".`);
      },
      { commandName: entry.name, interactive: true }
    );
  } catch (err) {
    if (err && err.code === "NO_DOCUMENT") throw err;
    const wrapped = new Error(friendlyError(err, entry.name));
    wrapped.cause = err;
    throw wrapped;
  }
}

// Scripts share one global lexical scope; the IIFE keeps PX/PCT etc. from colliding with catalog.js.
window.invokeEntry = invokeEntry;
})();
