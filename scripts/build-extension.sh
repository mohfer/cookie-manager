#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

EXTENSION_DIR="$PROJECT_ROOT/extension"
OUTPUT_DIR="$PROJECT_ROOT/client/public/downloads"
OUTPUT_ZIP="$OUTPUT_DIR/cookie-vault-extension.zip"

ENV_FILE="$EXTENSION_DIR/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  ENV_FILE="$EXTENSION_DIR/.env.example"
fi

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

API_URL="${API_URL:-http://localhost:8000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:5173}"

TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

mkdir -p "$OUTPUT_DIR"
cp -a "$EXTENSION_DIR/." "$TMP_DIR/"
rm -f "$TMP_DIR/.env" "$TMP_DIR/.env.example"

sed -i "s|__API_URL__|${API_URL}|g" "$TMP_DIR/popup.js"
sed -i "s|__FRONTEND_URL__|${FRONTEND_URL}|g" "$TMP_DIR/popup.js"

rm -f "$OUTPUT_ZIP"
(
  cd "$TMP_DIR"
  zip -r "$OUTPUT_ZIP" \
    manifest.json \
    popup.html \
    popup.css \
    popup.js \
    background.js \
    icons \
    -x "*.DS_Store" >/dev/null
)

echo "Built extension: $OUTPUT_ZIP"
