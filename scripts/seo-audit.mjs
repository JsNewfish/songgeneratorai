const BASE_URL = process.env.SEO_AUDIT_BASE_URL || 'https://www.aisonggen.io'
const NON_WWW_URL = process.env.SEO_AUDIT_NON_WWW_URL || 'https://aisonggen.io'
const STRICT_ALIAS_NOINDEX = process.env.SEO_AUDIT_STRICT_ALIAS_NOINDEX === '1'

const checks = []

function addCheck(name, ok, detail) {
  checks.push({ name, ok, detail })
}

function normalizeUrl(input) {
  try {
    return new URL(input, BASE_URL).toString().replace(/\/$/, '')
  } catch {
    return input
  }
}

async function fetchText(url, options = {}) {
  try {
    const response = await fetch(url, options)
    const text = await response.text()
    return { ok: response.ok, status: response.status, headers: response.headers, text }
  } catch (error) {
    return { ok: false, status: 0, headers: new Headers(), text: '', error: String(error) }
  }
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)
  return match ? match[1] : null
}

function hasNoindex(html) {
  const robotsMeta = /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex[^"']*["']/i.test(html)
  const googlebotMeta = /<meta[^>]*name=["']googlebot["'][^>]*content=["'][^"']*noindex[^"']*["']/i.test(html)
  return robotsMeta || googlebotMeta
}

async function checkPageCanonical(path, expectedCanonical, options = {}) {
  const url = new URL(path, BASE_URL).toString()
  const expected = normalizeUrl(expectedCanonical)
  const result = await fetchText(url)

  if (!result.ok) {
    addCheck(`Page reachable: ${path}`, false, `status=${result.status}${result.error ? ` error=${result.error}` : ''}`)
    return
  }

  addCheck(`Page reachable: ${path}`, true, `status=${result.status}`)

  const canonicalHref = extractCanonical(result.text)
  if (!canonicalHref) {
    addCheck(`Canonical exists: ${path}`, false, 'missing canonical tag')
  } else {
    const canonical = normalizeUrl(canonicalHref)
    addCheck(`Canonical correct: ${path}`, canonical === expected, `found=${canonical} expected=${expected}`)
  }

  const noindex = hasNoindex(result.text)
  if (options.expectNoindex === true) {
    if (STRICT_ALIAS_NOINDEX) {
      addCheck(`Noindex present: ${path}`, noindex, 'expected noindex on duplicate/alias page')
    } else {
      addCheck(`Noindex recommended: ${path}`, true, noindex ? 'present' : 'not present yet (set SEO_AUDIT_STRICT_ALIAS_NOINDEX=1 to enforce)')
    }
  } else {
    addCheck(`No noindex: ${path}`, !noindex, noindex ? 'unexpected noindex found' : 'ok')
  }
}

async function run() {
  const robotsUrl = new URL('/robots.txt', BASE_URL).toString()
  const robots = await fetchText(robotsUrl)
  addCheck('robots.txt reachable', robots.ok, `status=${robots.status}`)
  if (robots.ok) {
    const expectedSitemap = `${BASE_URL.replace(/\/$/, '')}/sitemap.xml`
    addCheck('robots.txt has sitemap', robots.text.includes(expectedSitemap), `expected ${expectedSitemap}`)
  }

  const sitemapUrl = new URL('/sitemap.xml', BASE_URL).toString()
  const sitemap = await fetchText(sitemapUrl)
  addCheck('sitemap.xml reachable', sitemap.ok, `status=${sitemap.status}`)

  if (sitemap.ok) {
    const requiredPaths = ['/', '/ai-song-cover-generator', '/tools/lyrics-to-song', '/tools/text-to-song', '/blog']
    for (const path of requiredPaths) {
      const full = normalizeUrl(new URL(path, BASE_URL).toString())
      addCheck(`Sitemap contains ${path}`, sitemap.text.includes(full), full)
    }
  }

  const faviconUrl = new URL('/favicon.ico', BASE_URL).toString()
  const favicon = await fetchText(faviconUrl)
  addCheck('favicon.ico reachable', favicon.ok, `status=${favicon.status}`)

  const redirectProbe = await fetchText(NON_WWW_URL, { redirect: 'manual' })
  const redirectLocation = redirectProbe.headers.get('location') || ''
  const redirectsToWww = redirectProbe.status >= 300 && redirectProbe.status < 400 && redirectLocation.includes('www.aisonggen.io')
  addCheck('non-www redirects to www', redirectsToWww, `status=${redirectProbe.status} location=${redirectLocation || 'none'}`)

  await checkPageCanonical('/', '/')
  await checkPageCanonical('/ai-song-cover-generator', '/ai-song-cover-generator')
  await checkPageCanonical('/tools/lyrics-to-song', '/tools/lyrics-to-song')
  await checkPageCanonical('/tools/text-to-song', '/tools/text-to-song')
  await checkPageCanonical('/tools/ai-cover', '/ai-song-cover-generator', { expectNoindex: true })

  const failed = checks.filter(c => !c.ok)
  for (const check of checks) {
    const marker = check.ok ? 'PASS' : 'FAIL'
    console.log(`[${marker}] ${check.name} - ${check.detail}`)
  }

  console.log(`\nSummary: ${checks.length - failed.length}/${checks.length} checks passed`)
  if (failed.length > 0) {
    process.exitCode = 1
  }
}

run()
