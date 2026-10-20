#!/bin/sh
# Builds dist/<plugin id>.ccx plus the shortcut helper script.
set -e
cd "$(dirname "$0")/.."

ID=$(sed -n 's/.*"id": *"\(com\.[^"]*\)".*/\1/p' manifest.json | head -1)
OUT="dist/$ID.ccx"

rm -rf dist
mkdir -p dist
zip -q -X "$OUT" manifest.json index.html styles.css \
  catalog.js recents.js invoke.js search-ui.js main.js \
  icons/icon.png
cp "scripts/Junk Drawer.jsx" dist/

echo "Built $OUT"
unzip -l "$OUT"
