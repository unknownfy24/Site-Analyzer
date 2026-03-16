import { NextRequest, NextResponse } from 'next/server'

// Category mapping for audits
const AUDIT_CATEGORY_MAP: Record<string, string> = {
  // Performance
  'first-contentful-paint': 'performance',
  'largest-contentful-paint': 'performance',
  'total-blocking-time': 'performance',
  'cumulative-layout-shift': 'performance',
  'speed-index': 'performance',
  'interactive': 'performance',
  'render-blocking-resources': 'performance',
  'unused-css-rules': 'performance',
  'unused-javascript': 'performance',
  'uses-optimized-images': 'performance',
  'uses-responsive-images': 'performance',
  'uses-webp-images': 'performance',
  'offscreen-images': 'performance',
  'efficiently-animated-content': 'performance',
  'uses-text-compression': 'performance',
  'uses-rel-preconnect': 'performance',
  'server-response-time': 'performance',
  'redirects': 'performance',
  'uses-http2': 'performance',
  'critical-request-chains': 'performance',
  'total-byte-weight': 'performance',
  'uses-long-cache-ttl': 'performance',
  'dom-size': 'performance',
  'no-document-write': 'performance',
  'bootup-time': 'performance',
  'mainthread-work-breakdown': 'performance',
  'font-display': 'performance',
  // Accessibility
  'color-contrast': 'accessibility',
  'image-alt': 'accessibility',
  'label': 'accessibility',
  'link-name': 'accessibility',
  'button-name': 'accessibility',
  'html-has-lang': 'accessibility',
  'document-title': 'accessibility',
  'meta-viewport': 'accessibility',
  'aria-allowed-attr': 'accessibility',
  'aria-required-attr': 'accessibility',
  'aria-roles': 'accessibility',
  'aria-valid-attr': 'accessibility',
  'aria-valid-attr-value': 'accessibility',
  'duplicate-id-aria': 'accessibility',
  'frame-title': 'accessibility',
  'heading-order': 'accessibility',
  'html-lang-valid': 'accessibility',
  'list': 'accessibility',
  'listitem': 'accessibility',
  'skip-link': 'accessibility',
  'tabindex': 'accessibility',
  // Best Practices
  'is-on-https': 'best-practices',
  'no-vulnerable-libraries': 'best-practices',
  'csp-xss': 'best-practices',
  'no-mixed-content': 'best-practices',
  'errors-in-console': 'best-practices',
  'image-aspect-ratio': 'best-practices',
  'image-size-responsive': 'best-practices',
  'doctype': 'best-practices',
  'charset': 'best-practices',
  'js-libraries': 'best-practices',
  'deprecations': 'best-practices',
  'notification-on-start': 'best-practices',
  'geolocation-on-start': 'best-practices',
  // SEO
  'meta-description': 'seo',
  'link-text': 'seo',
  'crawlable-anchors': 'seo',
  'is-crawlable': 'seo',
  'robots-txt': 'seo',
  'tap-targets': 'seo',
  'hreflang': 'seo',
  'plugins': 'seo',
  'canonical': 'seo',
  'font-size': 'seo',
  'structured-data': 'seo',
  'viewport': 'seo',
}

function getImpact(score: number | null): 'high' | 'medium' | 'low' {
  if (score === null) return 'medium'
  if (score === 0) return 'high'
  if (score < 0.5) return 'high'
  if (score < 0.9) return 'medium'
  return 'low'
}

function getCategoryForAudit(auditId: string): string {
  return AUDIT_CATEGORY_MAP[auditId] || 'best-practices'
}

export async function POST(request: NextRequest) {
  let targetUrl: string

  try {
    const body = await request.json()
    targetUrl = body.url
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  // Validate URL format
  try {
    new URL(targetUrl)
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
  }

  try {
    // Dynamic imports to avoid issues with Next.js bundling
    const chromeLauncher = await import('chrome-launcher')
    const lighthouse = await import('lighthouse')

    const chrome = await chromeLauncher.launch({
      chromeFlags: [
        '--headless',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-extensions',
      ],
    })

    const options = {
      logLevel: 'error' as const,
      output: 'json' as const,
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port,
      formFactor: 'desktop' as const,
      screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false,
      },
      throttlingMethod: 'simulate' as const,
    }

    let runnerResult
    try {
      const lh = lighthouse.default || lighthouse
      runnerResult = await (lh as Function)(targetUrl, options)
    } finally {
      await chrome.kill()
    }

    if (!runnerResult || !runnerResult.lhr) {
      return NextResponse.json({ error: 'Lighthouse returned no results' }, { status: 500 })
    }

    const lhr = runnerResult.lhr
    const categories = lhr.categories
    const audits = lhr.audits

    // Extract category scores (0–100)
    const scores = {
      performance: categories.performance?.score != null
        ? Math.round(categories.performance.score * 100) : 0,
      accessibility: categories.accessibility?.score != null
        ? Math.round(categories.accessibility.score * 100) : 0,
      bestPractices: categories['best-practices']?.score != null
        ? Math.round(categories['best-practices'].score * 100) : 0,
      seo: categories.seo?.score != null
        ? Math.round(categories.seo.score * 100) : 0,
    }

    // Extract actionable failed/warning audits
    const recommendations: object[] = []

    for (const [id, audit] of Object.entries(audits as Record<string, any>)) {
      // Skip informational/passed audits
      if (audit.scoreDisplayMode === 'informative' || audit.scoreDisplayMode === 'notApplicable') {
        continue
      }
      if (audit.score === null || audit.score === 1) continue
      // Skip audits without real descriptions
      if (!audit.title || !audit.description) continue

      const category = getCategoryForAudit(id)

      // Get a clean description (strip markdown links)
      const cleanDesc = (audit.description as string)
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .split('.')[0] + '.'

      recommendations.push({
        id,
        title: audit.title,
        description: cleanDesc,
        score: audit.score,
        displayValue: audit.displayValue || null,
        category,
        impact: getImpact(audit.score),
      })
    }

    // Sort by score ascending (0 = worst first), then by impact
    recommendations.sort((a: any, b: any) => {
      if (a.score === b.score) return 0
      if (a.score === 0 && b.score !== 0) return -1
      if (b.score === 0 && a.score !== 0) return 1
      return (a.score || 0) - (b.score || 0)
    })

    return NextResponse.json({
      url: targetUrl,
      scores,
      recommendations: recommendations.slice(0, 18),
      fetchTime: lhr.fetchTime,
    })
  } catch (err) {
    console.error('Lighthouse error:', err)
    const message = err instanceof Error ? err.message : 'Analysis failed'

    if (message.includes('net::ERR') || message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { error: 'Could not reach the website. Please check the URL and try again.' },
        { status: 422 }
      )
    }

    if (message.includes('Chrome') || message.includes('chrome')) {
      return NextResponse.json(
        { error: 'Chrome browser not found. Please ensure Google Chrome is installed.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Analysis failed. Please try again with a different URL.' },
      { status: 500 }
    )
  }
}
