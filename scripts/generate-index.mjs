import { readdirSync, existsSync, writeFileSync } from "fs";
import { resolve, join } from "path";

const root = process.cwd();
const clientDir = resolve(root, "dist/client");
const assetsDir = join(clientDir, "assets");

if (!existsSync(assetsDir)) {
  console.error("dist/client/assets not found — run npm run build first");
  process.exit(1);
}

const files = readdirSync(assetsDir);
const mainJs = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));
const mainCss = files.find((f) => f.endsWith(".css"));

if (!mainJs) {
  console.error("Could not find main JS chunk in dist/client/assets:", files);
  process.exit(1);
}

// This HTML structure MUST match what __root.tsx renders so that
// React's hydrateRoot(document, ...) can match and hydrate it.
// __root.tsx renders: <html lang="en" className="dark"><head>...</head><body>...</body></html>
const html = `<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Veritas — Truth Platform</title>
    <meta name="description" content="Signal over noise, verified over viral." />
    ${mainCss ? `<link rel="stylesheet" href="/assets/${mainCss}" />` : ""}
    <script type="module" src="/assets/${mainJs}"></script>
  </head>
  <body></body>
</html>`;

writeFileSync(resolve(clientDir, "index.html"), html);
console.log(`✓ Generated dist/client/index.html`);
console.log(`  JS:  /assets/${mainJs}`);
console.log(`  CSS: /assets/${mainCss ?? "(none)"}`);
