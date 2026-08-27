import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const from = join(process.cwd(), "out");
const to = join(process.cwd(), "www");

if (!existsSync(join(from, "index.html"))) {
  throw new Error("Build statique introuvable : out/index.html");
}

rmSync(to, { recursive: true, force: true });
cpSync(from, to, { recursive: true });
console.log("Site copie vers www/");
