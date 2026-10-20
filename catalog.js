/**
 * Curated searchable catalog for Junk Drawer.
 *
 * Prefer Action Manager `event` / `descriptor` over `menuItem`.
 * menuItemType strings are unreliable in PS 27+ and often throw
 * "unknown menu item". Event `_obj` names match ScriptListener / Adobe event codes.
 */
const PX = (v) => ({ _unit: "pixelsUnit", _value: v });
const PCT = (v) => ({ _unit: "percentUnit", _value: v });
const PRESET_CUSTOM = {
  _enum: "presetKindType",
  _value: "presetKindCustom"
};
const PRESET_DEFAULT = {
  _enum: "presetKindType",
  _value: "presetKindDefault"
};

const CATALOG = [
  // —— Filters ——
  { id: "filter.average", name: "Average", category: "filter", event: "average" },
  { id: "filter.blur", name: "Blur", category: "filter", event: "blurEvent" },
  { id: "filter.blurMore", name: "Blur More", category: "filter", event: "blurMore", eventAlternates: ["blurMethod"] },
  {
    id: "filter.gaussianBlur",
    name: "Gaussian Blur",
    category: "filter",
    event: "gaussianBlur",
    params: { radius: PX(10) }
  },
  {
    id: "filter.boxBlur",
    name: "Box Blur",
    category: "filter",
    event: "boxblur",
    params: { radius: PX(10) }
  },
  {
    id: "filter.motionBlur",
    name: "Motion Blur",
    category: "filter",
    event: "motionBlur",
    params: { angle: 0, distance: PX(10) }
  },
  {
    id: "filter.radialBlur",
    name: "Radial Blur",
    category: "filter",
    event: "radialBlur",
    params: {
      amount: 10,
      blurMethod: { _enum: "blurMethod", _value: "spin" },
      blurQuality: { _enum: "blurQuality", _value: "good" }
    }
  },
  {
    id: "filter.smartBlur",
    name: "Smart Blur",
    category: "filter",
    event: "smartBlur",
    params: {
      radius: 3,
      threshold: 25,
      smartBlurQuality: { _enum: "smartBlurQuality", _value: "medium" },
      mode: { _enum: "smartBlurMode", _value: "normal" }
    }
  },
  {
    id: "filter.surfaceBlur",
    name: "Surface Blur",
    category: "filter",
    event: "surfaceBlur",
    params: { radius: PX(5), threshold: 15 }
  },
  { id: "filter.lensBlur", name: "Lens Blur", category: "filter", event: "lensBlur" },
  { id: "filter.shapeBlur", name: "Shape Blur", category: "filter", event: "shapeBlur" },
  { id: "filter.fieldBlur", name: "Field Blur", category: "filter", event: "blurGalleryFieldBlur" },
  { id: "filter.irisBlur", name: "Iris Blur", category: "filter", event: "blurGalleryIrisBlur" },
  { id: "filter.tiltShift", name: "Tilt-Shift", category: "filter", event: "blurGalleryTiltShift" },
  { id: "filter.pathBlur", name: "Path Blur", category: "filter", event: "blurGalleryPathBlur" },
  { id: "filter.spinBlur", name: "Spin Blur", category: "filter", event: "blurGallerySpinBlur" },
  { id: "filter.sharpen", name: "Sharpen", category: "filter", event: "sharpen" },
  { id: "filter.sharpenMore", name: "Sharpen More", category: "filter", event: "sharpenMore" },
  { id: "filter.sharpenEdges", name: "Sharpen Edges", category: "filter", event: "sharpenEdges" },
  {
    id: "filter.unsharpMask",
    name: "Unsharp Mask",
    category: "filter",
    event: "unsharpMask",
    params: { amount: PCT(50), radius: PX(1), threshold: 0 }
  },
  { id: "filter.smartSharpen", name: "Smart Sharpen", category: "filter", event: "smartSharpen" },
  { id: "filter.shakeReduction", name: "Shake Reduction", category: "filter", event: "shakeReduction" },
  {
    id: "filter.noiseAdd",
    name: "Add Noise",
    category: "filter",
    event: "addNoise",
    params: {
      noise: PCT(10),
      distribution: { _enum: "distribution", _value: "uniformDistribution" },
      monochromatic: false
    }
  },
  { id: "filter.despeckle", name: "Despeckle", category: "filter", event: "despeckle" },
  {
    id: "filter.dustAndScratches",
    name: "Dust & Scratches",
    category: "filter",
    event: "dustAndScratches",
    params: { radius: 1, threshold: 0 }
  },
  {
    id: "filter.median",
    name: "Median",
    category: "filter",
    event: "median",
    params: { radius: PX(1) }
  },
  { id: "filter.reduceNoise", name: "Reduce Noise", category: "filter", event: "reduceNoise" },
  { id: "filter.pixelateColorHalftone", name: "Color Halftone", category: "filter", event: "colorHalftone" },
  {
    id: "filter.crystallize",
    name: "Crystallize",
    category: "filter",
    event: "crystallize",
    params: { cellSize: 10 }
  },
  { id: "filter.facet", name: "Facet", category: "filter", event: "facet" },
  { id: "filter.fragment", name: "Fragment", category: "filter", event: "fragment" },
  { id: "filter.mezzotint", name: "Mezzotint", category: "filter", event: "mezzotint" },
  {
    id: "filter.mosaic",
    name: "Mosaic",
    category: "filter",
    event: "mosaic",
    params: { cellSize: PX(8) }
  },
  {
    id: "filter.pointillize",
    name: "Pointillize",
    category: "filter",
    event: "pointillize",
    params: { cellSize: 5 }
  },
  { id: "filter.clouds", name: "Clouds", category: "filter", event: "clouds" },
  { id: "filter.differenceClouds", name: "Difference Clouds", category: "filter", event: "differenceClouds" },
  { id: "filter.fibers", name: "Fibers", category: "filter", event: "fibers" },
  { id: "filter.lensFlare", name: "Lens Flare", category: "filter", event: "lensFlare" },
  { id: "filter.lightingEffects", name: "Lighting Effects", category: "filter", event: "lightingEffects" },
  { id: "filter.renderFlame", name: "Flame", category: "filter", event: "flameGenerator" },
  { id: "filter.renderPictureFrame", name: "Picture Frame", category: "filter", event: "pictureFrame" },
  { id: "filter.renderTree", name: "Tree", category: "filter", event: "treeGenerator" },
  { id: "filter.displace", name: "Displace", category: "filter", event: "displace" },
  {
    id: "filter.pinch",
    name: "Pinch",
    category: "filter",
    event: "pinch",
    params: { amount: PCT(50), radius: 20 }
  },
  { id: "filter.polarCoordinates", name: "Polar Coordinates", category: "filter", event: "polar", eventAlternates: ["polarCoordinates"] },
  { id: "filter.ripple", name: "Ripple", category: "filter", event: "ripple" },
  { id: "filter.shear", name: "Shear", category: "filter", event: "shear" },
  {
    id: "filter.spherize",
    name: "Spherize",
    category: "filter",
    event: "spherize",
    params: {
      amount: PCT(50),
      mode: { _enum: "spherizeMode", _value: "normal" }
    }
  },
  {
    id: "filter.twirl",
    name: "Twirl",
    category: "filter",
    event: "twirl",
    params: { angle: 50, radius: 20 }
  },
  { id: "filter.wave", name: "Wave", category: "filter", event: "wave" },
  { id: "filter.zigZag", name: "ZigZag", category: "filter", event: "zigZag" },
  { id: "filter.liquify", name: "Liquify", category: "filter", event: "liquify" },
  { id: "filter.vanishPoint", name: "Vanishing Point", category: "filter", event: "vanishingPoint" },
  {
    id: "filter.adaptiveWideAngle",
    name: "Adaptive Wide Angle",
    category: "filter",
    event: "adaptiveWideAngle"
  },
  {
    id: "filter.cameraRaw",
    name: "Camera Raw Filter",
    category: "filter",
    event: "Adobe Camera Raw Filter"
  },
  { id: "filter.lensCorrection", name: "Lens Correction", category: "filter", event: "lensCorrection" },
  { id: "filter.oilPaint", name: "Oil Paint", category: "filter", event: "oilPaint" },
  {
    id: "filter.highPass",
    name: "High Pass",
    category: "filter",
    event: "highPass",
    params: { radius: PX(10) }
  },
  {
    id: "filter.maximum",
    name: "Maximum",
    category: "filter",
    event: "maximum",
    params: { radius: PX(1) }
  },
  {
    id: "filter.minimum",
    name: "Minimum",
    category: "filter",
    event: "minimum",
    params: { radius: PX(1) }
  },
  { id: "filter.offset", name: "Offset", category: "filter", event: "offset" },
  { id: "filter.findEdges", name: "Find Edges", category: "filter", event: "findEdges" },
  { id: "filter.traceContour", name: "Trace Contour", category: "filter", event: "traceContour" },
  { id: "filter.wind", name: "Wind", category: "filter", event: "wind" },
  {
    id: "filter.emboss",
    name: "Emboss",
    category: "filter",
    event: "emboss",
    params: { angle: 135, height: 3, amount: PCT(100) }
  },
  { id: "filter.extrude", name: "Extrude", category: "filter", event: "extrude" },
  { id: "filter.diffuse", name: "Diffuse", category: "filter", event: "diffuse" },
  { id: "filter.solarize", name: "Solarize", category: "filter", event: "solarize" },
  { id: "filter.tiles", name: "Tiles", category: "filter", event: "tiles" },
  { id: "filter.watercolor", name: "Watercolor", category: "filter", event: "watercolor" },
  { id: "filter.fresco", name: "Fresco", category: "filter", event: "fresco" },
  { id: "filter.paletteKnife", name: "Palette Knife", category: "filter", event: "paletteKnife" },
  { id: "filter.plasticWrap", name: "Plastic Wrap", category: "filter", event: "plasticWrap" },
  { id: "filter.posterEdges", name: "Poster Edges", category: "filter", event: "posterEdges" },
  { id: "filter.roughPastels", name: "Rough Pastels", category: "filter", event: "roughPastels" },
  { id: "filter.smudgeStick", name: "Smudge Stick", category: "filter", event: "smudgeStick" },
  { id: "filter.sponge", name: "Sponge", category: "filter", event: "sponge" },
  { id: "filter.underpainting", name: "Underpainting", category: "filter", event: "underpainting" },
  { id: "filter.accentedEdges", name: "Accented Edges", category: "filter", event: "accentedEdges" },
  { id: "filter.angledStrokes", name: "Angled Strokes", category: "filter", event: "angledStrokes" },
  { id: "filter.crosshatch", name: "Crosshatch", category: "filter", event: "crosshatch" },
  { id: "filter.darkStrokes", name: "Dark Strokes", category: "filter", event: "darkStrokes" },
  { id: "filter.inkOutlines", name: "Ink Outlines", category: "filter", event: "inkOutlines" },
  { id: "filter.spatter", name: "Spatter", category: "filter", event: "spatter" },
  { id: "filter.sprayedStrokes", name: "Sprayed Strokes", category: "filter", event: "sprayedStrokes" },
  { id: "filter.sumie", name: "Sumi-e", category: "filter", event: "sumie" },
  { id: "filter.diffuseGlow", name: "Diffuse Glow", category: "filter", event: "diffuseGlow" },
  { id: "filter.glass", name: "Glass", category: "filter", event: "glass" },
  { id: "filter.oceanRipple", name: "Ocean Ripple", category: "filter", event: "oceanRipple" },
  { id: "filter.basRelief", name: "Bas Relief", category: "filter", event: "basRelief" },
  { id: "filter.chalkCharcoal", name: "Chalk & Charcoal", category: "filter", event: "chalkCharcoal" },
  { id: "filter.charcoal", name: "Charcoal", category: "filter", event: "charcoal" },
  { id: "filter.chrome", name: "Chrome", category: "filter", event: "chrome" },
  { id: "filter.conteCrayon", name: "Conté Crayon", category: "filter", event: "conteCrayon" },
  { id: "filter.graphicPen", name: "Graphic Pen", category: "filter", event: "graphicPen" },
  { id: "filter.halftonePattern", name: "Halftone Pattern", category: "filter", event: "halftonePattern" },
  { id: "filter.notePaper", name: "Note Paper", category: "filter", event: "notePaper" },
  { id: "filter.photocopy", name: "Photocopy", category: "filter", event: "photocopy" },
  { id: "filter.plaster", name: "Plaster", category: "filter", event: "plaster" },
  { id: "filter.reticulation", name: "Reticulation", category: "filter", event: "reticulation" },
  { id: "filter.stamp", name: "Stamp", category: "filter", event: "stamp" },
  { id: "filter.tornEdges", name: "Torn Edges", category: "filter", event: "tornEdges" },
  { id: "filter.waterPaper", name: "Water Paper", category: "filter", event: "waterPaper" },
  { id: "filter.glowingEdges", name: "Glowing Edges", category: "filter", event: "glowingEdges" },
  {
    id: "filter.neuralFilters",
    name: "Neural Filters",
    category: "filter",
    event: "neuralFiltersWorkspace"
  },
  { id: "filter.filterGallery", name: "Filter Gallery", category: "filter", event: "filterGallery" },

  // —— Adjustments (Image > Adjustments) ——
  {
    id: "adj.brightnessContrast",
    name: "Brightness/Contrast",
    category: "adjustment",
    event: "brightnessEvent",
    params: { brightness: 0, contrast: 0, useLegacy: false }
  },
  {
    id: "adj.levels",
    name: "Levels",
    category: "adjustment",
    event: "levels",
    params: { presetKind: PRESET_CUSTOM }
  },
  {
    id: "adj.curves",
    name: "Curves",
    category: "adjustment",
    event: "curves",
    params: { presetKind: PRESET_CUSTOM }
  },
  {
    id: "adj.exposure",
    name: "Exposure",
    category: "adjustment",
    event: "exposure",
    params: {
      presetKind: PRESET_CUSTOM,
      exposure: 0,
      offset: 0,
      gammaCorrection: 1
    }
  },
  {
    id: "adj.vibrance",
    name: "Vibrance",
    category: "adjustment",
    event: "vibrance",
    params: { vibrance: 0, saturation: 0 }
  },
  {
    id: "adj.hueSaturation",
    name: "Hue/Saturation",
    category: "adjustment",
    event: "hueSaturation",
    params: { presetKind: PRESET_CUSTOM }
  },
  {
    id: "adj.colorBalance",
    name: "Color Balance",
    category: "adjustment",
    event: "colorBalance",
    params: {
      shadowLevels: [0, 0, 0],
      midtoneLevels: [0, 0, 0],
      highlightLevels: [0, 0, 0],
      preserveLuminosity: true
    }
  },
  {
    id: "adj.blackAndWhite",
    name: "Black & White",
    category: "adjustment",
    event: "blackAndWhite",
    params: { presetKind: PRESET_DEFAULT }
  },
  {
    id: "adj.photoFilter",
    name: "Photo Filter",
    category: "adjustment",
    event: "photoFilter",
    params: {
      color: { _obj: "RGBColor", red: 236.6, grain: 138.1, blue: 43.9 },
      density: 25,
      preserveLuminosity: true
    }
  },
  {
    id: "adj.channelMixer",
    name: "Channel Mixer",
    category: "adjustment",
    event: "channelMixer",
    params: { presetKind: PRESET_DEFAULT }
  },
  {
    id: "adj.colorLookup",
    name: "Color Lookup",
    category: "adjustment",
    event: "colorLookup"
  },
  { id: "adj.invert", name: "Invert", category: "adjustment", event: "invert" },
  {
    id: "adj.posterize",
    name: "Posterize",
    category: "adjustment",
    event: "posterization",
    params: { levels: 4 }
  },
  {
    id: "adj.threshold",
    name: "Threshold",
    category: "adjustment",
    event: "thresholdClassEvent",
    params: { level: 128 }
  },
  {
    id: "adj.gradientMap",
    name: "Gradient Map",
    category: "adjustment",
    event: "gradientMapEvent"
  },
  {
    id: "adj.selectiveColor",
    name: "Selective Color",
    category: "adjustment",
    event: "selectiveColor",
    params: { presetKind: PRESET_CUSTOM }
  },
  {
    id: "adj.shadowsHighlights",
    name: "Shadows/Highlights",
    category: "adjustment",
    event: "adaptCorrect"
  },
  { id: "adj.hdrToning", name: "HDR Toning", category: "adjustment", event: "hdrToning" },
  { id: "adj.matchColor", name: "Match Color", category: "adjustment", event: "matchColor" },
  { id: "adj.replaceColor", name: "Replace Color", category: "adjustment", event: "replaceColor" },
  { id: "adj.equalize", name: "Equalize", category: "adjustment", event: "equalize" },
  { id: "adj.desaturate", name: "Desaturate", category: "adjustment", event: "desaturate" },
  { id: "adj.autoTone", name: "Auto Tone", category: "adjustment", event: "autoLevels" },
  { id: "adj.autoContrast", name: "Auto Contrast", category: "adjustment", event: "autoContrast" },
  { id: "adj.autoColor", name: "Auto Color", category: "adjustment", event: "autoColor" },

  // —— Layer Styles ——
  { id: "style.blendingOptions", name: "Blending Options", category: "style", blendingOptions: true },
  { id: "style.bevelEmboss", name: "Bevel & Emboss", category: "style", layerEffect: "bevelEmboss" },
  { id: "style.stroke", name: "Stroke", category: "style", layerEffect: "frameFX" },
  { id: "style.innerShadow", name: "Inner Shadow", category: "style", layerEffect: "innerShadow" },
  { id: "style.innerGlow", name: "Inner Glow", category: "style", layerEffect: "innerGlow" },
  { id: "style.satin", name: "Satin", category: "style", layerEffect: "chromeFX" },
  { id: "style.colorOverlay", name: "Color Overlay", category: "style", layerEffect: "solidFill" },
  {
    id: "style.gradientOverlay",
    name: "Gradient Overlay",
    category: "style",
    layerEffect: "gradientFill"
  },
  {
    id: "style.patternOverlay",
    name: "Pattern Overlay",
    category: "style",
    layerEffect: "patternFill"
  },
  { id: "style.outerGlow", name: "Outer Glow", category: "style", layerEffect: "outerGlow" },
  { id: "style.dropShadow", name: "Drop Shadow", category: "style", layerEffect: "dropShadow" },
  { id: "style.copyLayerStyle", name: "Copy Layer Style", category: "style", event: "copyEffects" },
  { id: "style.pasteLayerStyle", name: "Paste Layer Style", category: "style", event: "pasteEffects", eventAlternates: ["pasteFX"] },
  {
    id: "style.clearLayerStyle",
    name: "Clear Layer Style",
    category: "style",
    event: "disableLayerFX",
    eventAlternates: ["clearStyle", "disableLayerStyle"]
  },
  {
    id: "style.createLayers",
    name: "Create Layers",
    category: "style",
    event: "createLayersFromLayerEffects"
  },
  { id: "style.hideAll", name: "Hide All Effects", category: "style", event: "hideAllEffects" },
  { id: "style.scaleEffects", name: "Scale Effects", category: "style", event: "scaleEffectsEvent" }
];

const CATEGORY_LABELS = {
  filter: "Filter",
  adjustment: "Adjustment",
  style: "Layer Style"
};
