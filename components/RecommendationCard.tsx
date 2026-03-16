'use client'

import { useState } from 'react'
import type { Recommendation } from '@/app/page'

interface Props {
  rec: Recommendation
  index: number
}

const CATEGORY_LABELS: Record<string, string> = {
  performance: 'Performance',
  accessibility: 'Accessibility',
  seo: 'SEO',
  'best-practices': 'Best Practices',
}

const IMPACT_CONFIG = {
  high: {
    label: 'High Impact',
    dotColor: '#FF3B30',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
  },
  medium: {
    label: 'Medium Impact',
    dotColor: '#FF9500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    text: 'text-orange-400',
  },
  low: {
    label: 'Low Impact',
    dotColor: '#00BFA5',
    bg: 'bg-chl-teal/10',
    border: 'border-chl-teal/20',
    text: 'text-chl-teal',
  },
}

const CATEGORY_CONFIG: Record<string, { bg: string; border: string; text: string }> = {
  performance: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
  accessibility: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
  seo: { bg: 'bg-chl-teal/10', border: 'border-chl-teal/20', text: 'text-chl-teal' },
  'best-practices': { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400' },
}

const QUICK_TIPS: Record<string, string> = {
  'render-blocking-resources': 'Move scripts to the end of <body> or add defer/async attributes. Use <link rel="preload"> for critical CSS.',
  'unused-css-rules': 'Use PurgeCSS or remove unused stylesheets. Consider code-splitting your CSS per page.',
  'unused-javascript': 'Use dynamic imports and code splitting. Remove polyfills for modern browsers.',
  'uses-optimized-images': 'Compress images with tools like Squoosh or ImageOptim. Aim for < 100KB per image.',
  'uses-webp-images': 'Convert images to WebP format — typically 25–35% smaller than JPEG/PNG.',
  'uses-responsive-images': 'Use the srcset attribute and sizes to serve appropriately-sized images for each device.',
  'offscreen-images': 'Add loading="lazy" to images below the fold.',
  'uses-text-compression': 'Enable Gzip or Brotli compression on your web server or CDN.',
  'server-response-time': 'Optimize database queries, use caching (Redis/Memcached), or upgrade hosting.',
  'uses-long-cache-ttl': 'Set Cache-Control headers to cache static assets for at least 1 year.',
  'color-contrast': 'Ensure text-to-background contrast ratio is at least 4.5:1 for normal text, 3:1 for large text.',
  'image-alt': 'Add descriptive alt attributes to all <img> elements. Use alt="" for decorative images.',
  'label': 'Associate every form input with a <label> element using the for/id attributes.',
  'link-name': 'Ensure all links have descriptive text or aria-label attributes.',
  'meta-description': 'Add a unique <meta name="description"> tag (150–160 characters) to every page.',
  'document-title': 'Add a descriptive, unique <title> tag to every page.',
  'canonical': 'Add <link rel="canonical"> to prevent duplicate content issues.',
  'robots-txt': 'Create a /robots.txt file to guide search engine crawlers.',
  'is-on-https': 'Migrate your site to HTTPS. Get a free SSL certificate from Let\'s Encrypt.',
  'no-vulnerable-libraries': 'Update all JavaScript libraries to their latest versions.',
  'errors-in-console': 'Fix JavaScript errors shown in the browser console.',
  'tap-targets': 'Ensure clickable elements are at least 48×48 pixels and spaced at least 8px apart.',
  'font-size': 'Use a minimum base font size of 16px for body text.',
  'dom-size': 'Reduce the number of DOM nodes. A good target is under 1,500 nodes total.',
  'font-display': 'Add font-display: swap to @font-face rules to prevent invisible text during font loading.',
  'total-byte-weight': 'Reduce total page size. Aim for under 500KB for initial load.',
  'bootup-time': 'Reduce JavaScript execution time by splitting bundles and deferring non-critical scripts.',
  'uses-rel-preconnect': 'Add <link rel="preconnect"> for third-party origins (fonts, analytics, CDNs).',
  'heading-order': 'Use headings (H1–H6) in a logical, sequential order without skipping levels.',
  'structured-data': 'Add JSON-LD structured data markup to help search engines understand your content.',
}

export default function RecommendationCard({ rec, index }: Props) {
  const [expanded, setExpanded] = useState(false)
  const impact = IMPACT_CONFIG[rec.impact]
  const catConfig = CATEGORY_CONFIG[rec.category] || CATEGORY_CONFIG['best-practices']
  const tip = QUICK_TIPS[rec.id]

  return (
    <div
      className="bg-chl-card border border-chl-border rounded-xl overflow-hidden card-glow transition-all duration-300"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <button
        className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded(prev => !prev)}
      >
        {/* Index number */}
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-chl-card-2 border border-chl-border flex items-center justify-center mt-0.5">
          <span className="text-xs font-bold text-chl-muted">{index + 1}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-white font-semibold text-sm leading-snug">{rec.title}</h3>
          </div>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {/* Category badge */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${catConfig.bg} ${catConfig.border} ${catConfig.text}`}>
              {CATEGORY_LABELS[rec.category] || rec.category}
            </span>
            {/* Impact badge */}
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${impact.bg} ${impact.border} ${impact.text}`}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: impact.dotColor }} />
              {impact.label}
            </span>
            {/* Display value */}
            {rec.displayValue && (
              <span className="text-xs text-chl-muted bg-chl-card-2 px-2 py-0.5 rounded-full border border-chl-border">
                {rec.displayValue}
              </span>
            )}
          </div>
        </div>

        {/* Expand chevron */}
        <div className={`flex-shrink-0 text-chl-muted transition-transform duration-200 mt-1 ${expanded ? 'rotate-180' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-5 pt-0 ml-11 border-t border-chl-border/50">
          <p className="text-chl-muted text-sm leading-relaxed mt-4">
            {rec.description}
          </p>
          {tip && (
            <div className="mt-4 bg-chl-teal-dim border border-chl-teal/20 rounded-lg px-4 py-3">
              <p className="text-xs font-semibold text-chl-teal mb-1 uppercase tracking-wider">
                Quick Fix
              </p>
              <p className="text-sm text-white/80 leading-relaxed">{tip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
