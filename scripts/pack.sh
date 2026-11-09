#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
version="$(node -p "require('${root}/package.json').version")"
name="ziman-ai-${version}"
staging="${root}/dist/${name}"
out="${root}/dist/${name}.zip"

rm -rf "${root}/dist"
mkdir -p "${staging}/lib" "${staging}/icons" "${staging}/assets"

cp "${root}/manifest.json" \
   "${root}/background.js" \
   "${root}/popup.html" \
   "${root}/popup.js" \
   "${root}/options.html" \
   "${root}/options.js" \
   "${root}/content.js" \
   "${root}/content.css" \
   "${root}/theme.css" \
   "${root}/aiml-api.js" \
   "${root}/error-handler.js" \
   "${root}/PRIVACY.md" \
   "${root}/LICENSE" \
   "${staging}/"

cp "${root}/lib/"*.js "${staging}/lib/"
cp "${root}/icons/icon16.png" \
   "${root}/icons/icon32.png" \
   "${root}/icons/icon48.png" \
   "${root}/icons/icon128.png" \
   "${staging}/icons/"
cp "${root}/assets/owner-photo.jpg" \
   "${root}/assets/owner-banner.png" \
   "${root}/assets/owner-mark.svg" \
   "${staging}/assets/"

python3 - "${staging}" "${out}" <<'PY'
import sys, zipfile
from pathlib import Path
staging = Path(sys.argv[1])
out = Path(sys.argv[2])
root = staging.parent
with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED) as zf:
    for path in sorted(staging.rglob("*")):
        if path.is_file():
            zf.write(path, path.relative_to(root).as_posix())
print(f"Wrote {out}")
PY

rm -rf "${staging}"
