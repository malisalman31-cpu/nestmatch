import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = new URL("../dist/", import.meta.url).pathname;
const port = Number(process.env.PORT || 4180);
const types = { ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".webmanifest": "application/manifest+json", ".xml": "application/xml", ".txt": "text/plain", ".jpg": "image/jpeg", ".png": "image/png" };

createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname); }
  catch { response.writeHead(400); response.end("Invalid URL"); return; }
  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  let candidate = normalize(join(root, relative));
  if (!extname(candidate) && existsSync(`${candidate}.html`)) candidate += ".html";
  if (!candidate.startsWith(root) || !existsSync(candidate) || !statSync(candidate).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }
  response.writeHead(200, { "content-type": types[extname(candidate)] || "application/octet-stream", "cache-control": "no-store", "x-content-type-options": "nosniff" });
  createReadStream(candidate).pipe(response);
}).listen(port, "127.0.0.1", () => console.log(`Local: http://127.0.0.1:${port}`));
