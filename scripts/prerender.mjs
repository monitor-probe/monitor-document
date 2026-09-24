// Renders every route to its own HTML file, so every URL serves real markup --
// what a reader on a slow connection, a search engine and `curl` all get before
// any JavaScript runs.
import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { render, routes } from "../dist-ssr/entry-server.js"

const dist = join(import.meta.dirname, "..", "dist")
const template = await readFile(join(dist, "index.html"), "utf8")
const pages = new Map()
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;")

for (const r of routes) {
  const html = template
    .replace("<!--app-html-->", render(r.path))
    .replace(/<title>.*?<\/title>/, `<title>${esc(r.title)}</title>`)
    .replace(/(<meta name="description" content=").*?(")/, `$1${esc(r.desc)}$2`)
  // "<route>.html", not "<route>/index.html": Pages drops the extension, so
  // the canonical URL is the slashless one the in-app links already use --
  // "/install/quick-start", with "/install/quick-start/" redirecting to it.
  const file = r.path === "/" ? join(dist, "index.html") : join(dist, r.path.slice(1) + ".html")
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, html)
  pages.set(r.path, html)
}

// Anything else -- an old link, a typo -- lands on the home page with a note.
await writeFile(join(dist, "404.html"), template.replace("<!--app-html-->", ""))

console.log(`prerendered ${routes.length} routes`)

// llms.txt is the prompt from /ai as plain text. Extracted from the same MDX
// the page renders, so the two cannot drift.
const ai = await readFile(join(import.meta.dirname, "..", "src", "content", "ai.mdx"), "utf8")
const prompt = ai.match(/```text\n([\s\S]*?)\n```/)
if (!prompt) throw new Error("ai.mdx: no ```text block to publish as llms.txt")
await writeFile(join(dist, "llms.txt"), prompt[1] + "\n")

// Every in-site link must name a rendered route or a built file, and its
// fragment an id on the target page. A renamed route would otherwise land on
// the 404 page and a renamed heading at the top of the page, neither failing
// anything here.
const ids = new Map([...pages].map(([path, html]) => [path, new Set([...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]))]))
const broken = []
for (const [path, html] of pages) {
  for (const [, href] of html.matchAll(/ href="([/#][^"]*)"/g)) {
    const link = decodeURIComponent(href)
    const [target, fragment] = link.split("#")
    const page = target || path
    const found = ids.has(page) ? !fragment || ids.get(page).has(fragment) : existsSync(join(dist, page))
    if (!found) broken.push(`${path}: ${link}`)
  }
}
if (broken.length) throw new Error(`broken in-site links:\n${broken.join("\n")}`)
