import {
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { extname, join } from "node:path";

const from = join(process.cwd(), "out");
const to = join(process.cwd(), "www");

if (!existsSync(join(from, "index.html"))) {
  throw new Error("Build statique introuvable : out/index.html");
}

rmSync(to, { recursive: true, force: true });
cpSync(from, to, { recursive: true });

const TEXT_EXT = new Set([".html", ".js", ".css", ".json", ".txt", ".map", ".svg"]);

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, files);
    else files.push(path);
  }
  return files;
}

/**
 * Next emits root-absolute /_next/static/... URLs. Relative ./_next/static
 * works on FTP (domain root or a subfolder). Do not rewrite the
 * getAssetPrefix needle indexOf("/_next/") — pathname never contains "./".
 */
function relativize(content, isHtml) {
  let out = content
    .replaceAll('"/_next/static', '"./_next/static')
    .replaceAll("'/_next/static", "'./_next/static")
    .replaceAll("`/_next/static", "`./_next/static")
    .replaceAll(
      'TURBOPACK_CHUNK_BASE_PATH:"/_next/"',
      'TURBOPACK_CHUNK_BASE_PATH:"./_next/"',
    )
    .replaceAll('"/favicon.ico', '"./favicon.ico')
    .replaceAll("'/favicon.ico", "'./favicon.ico");
  if (isHtml) {
    out = out.replace(/\s+crossorigin(?:="[^"]*")?/gi, "");
  }
  return out;
}

let rewritten = 0;
for (const file of walk(to)) {
  if (!TEXT_EXT.has(extname(file).toLowerCase())) continue;
  const before = readFileSync(file, "utf8");
  const after = relativize(before, extname(file).toLowerCase() === ".html");
  if (after !== before) {
    writeFileSync(file, after);
    rewritten += 1;
  }
}

const index = readFileSync(join(to, "index.html"), "utf8");
if (index.includes('href="/_next/') || index.includes('src="/_next/')) {
  throw new Error("index.html contient encore des chemins /_next/ absolus");
}
if (!index.includes('href="./_next/static')) {
  throw new Error("index.html n'a pas de CSS relatif ./_next/");
}

const runtime = walk(join(to, "_next")).find((file) =>
  file.endsWith("3byuobrkyz9bj.js"),
);
if (runtime) {
  const js = readFileSync(runtime, "utf8");
  if (!js.includes('indexOf("/_next/")')) {
    throw new Error("getAssetPrefix a perdu le marqueur /_next/ (pathname)");
  }
  if (js.includes('indexOf("./_next/")')) {
    throw new Error("getAssetPrefix ne doit pas chercher ./_next/ dans le pathname");
  }
}

console.log(`Site copie vers www/ (${rewritten} fichiers en chemins relatifs)`);
