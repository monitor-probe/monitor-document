// Deletes every deployment of the Pages project but the ones main may be
// serving: the newest successful one, and the newest of all, which the API can
// list before reporting its success. Each older deployment stays reachable at
// its own address with the text it was built from, superseded instructions
// included.
//
//   CLOUDFLARE_API_TOKEN=… CLOUDFLARE_ACCOUNT_ID=… node scripts/prune-deployments.mjs <project>

const [project] = process.argv.slice(2)
const { CLOUDFLARE_API_TOKEN: TOKEN, CLOUDFLARE_ACCOUNT_ID: ACCOUNT } = process.env
if (!project || !TOKEN || !ACCOUNT) throw new Error("usage: CLOUDFLARE_API_TOKEN=… CLOUDFLARE_ACCOUNT_ID=… prune-deployments.mjs <project>")
const API = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/pages/projects/${project}/deployments`

async function cloudflare(url, init = {}) {
  const res = await fetch(url, { ...init, headers: { authorization: `Bearer ${TOKEN}` } })
  const body = await res.json()
  if (!body.success) throw new Error(`${init.method ?? "GET"} ${url}: ${JSON.stringify(body.errors)}`)
  return body
}

// Listed in full before deleting, since each deletion shifts later pages.
const all = []
for (const env of ["production", "preview"]) {
  for (let page = 1; ; page++) {
    const { result } = await cloudflare(`${API}?env=${env}&per_page=25&page=${page}`)
    if (!result.length) break
    all.push(...result)
  }
}

const kept = new Set()
let newest = false, succeeded = false
for (const d of [...all].sort((a, b) => b.created_on.localeCompare(a.created_on))) {
  if (d.deployment_trigger?.metadata?.branch !== "main") continue
  const ok = d.latest_stage?.status === "success"
  if (!newest || (ok && !succeeded)) kept.add(d.id)
  newest = true
  succeeded ||= ok
}

const doomed = all.filter((d) => !kept.has(d.id))
for (const d of doomed) await cloudflare(`${API}/${d.id}?force=true`, { method: "DELETE" })
console.log(`kept ${kept.size}, deleted ${doomed.length}`)
