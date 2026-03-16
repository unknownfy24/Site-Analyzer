'use client'

import { useState, useRef } from 'react'
import Header from '@/components/Header'
import ScoreRing from '@/components/ScoreRing'
import RecommendationCard from '@/components/RecommendationCard'
import Footer from '@/components/Footer'

export interface LighthouseScores {
  performance: number
  accessibility: number
  bestPractices: number
  seo: number
}

export interface Recommendation {
  id: string
  title: string
  description: string
  score: number | null
  displayValue: string | null
  category: string
  impact: 'high' | 'medium' | 'low'
}

export interface AnalysisResult {
  url: string
  scores: LighthouseScores
  recommendations: Recommendation[]
  fetchTime: string
}

type AnalysisState = 'idle' | 'loading' | 'success' | 'error'

const ANALYSIS_STEPS = [
  'Launching Chrome headless browser…',
  'Loading your website…',
  'Running performance audits…',
  'Analyzing accessibility…',
  'Checking SEO signals…',
  'Compiling recommendations…',
]

export default function Home() {
  const [url, setUrl] = useState('')
  const [state, setState] = useState<AnalysisState>('idle')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [stepIndex, setStepIndex] = useState(0)
  const resultsRef = useRef<HTMLDivElement>(null)
  const stepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startStepCycle = () => {
    setStepIndex(0)
    stepIntervalRef.current = setInterval(() => {
      setStepIndex(prev => (prev + 1) % ANALYSIS_STEPS.length)
    }, 4000)
  }

  const stopStepCycle = () => {
    if (stepIntervalRef.current) {
      clearInterval(stepIntervalRef.current)
      stepIntervalRef.current = null
    }
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    let analysisUrl = url.trim()
    if (!analysisUrl.startsWith('http://') && !analysisUrl.startsWith('https://')) {
      analysisUrl = 'https://' + analysisUrl
    }

    setState('loading')
    setError('')
    setResult(null)
    startStepCycle()

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: analysisUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed. Please try again.')
      }

      stopStepCycle()
      setResult(data)
      setState('success')

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      stopStepCycle()
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setState('error')
    }
  }

  const handleReset = () => {
    setState('idle')
    setResult(null)
    setError('')
    setUrl('')
  }

  const overallScore = result
    ? Math.round(
        (result.scores.performance +
          result.scores.accessibility +
          result.scores.bestPractices +
          result.scores.seo) / 4
      )
    : 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-24 pb-20 px-4">
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,191,165,1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,191,165,1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
          {/* Glow orb */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-chl-teal opacity-[0.06] blur-[120px] pointer-events-none" />

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-chl-teal-dim border border-chl-teal/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-chl-teal animate-pulse" />
              <span className="text-chl-teal text-sm font-medium tracking-wide">
                Powered by Google Lighthouse
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              Know exactly how
              <br />
              <span className="gradient-text">your site performs</span>
            </h1>

            <p className="text-chl-muted text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              Enter any URL and get instant scores for performance, SEO, accessibility,
              and best practices — plus actionable recommendations to improve them.
            </p>

            {/* Analyzer Form */}
            <form onSubmit={handleAnalyze} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-chl-muted-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="url-input w-full bg-chl-card border border-chl-border rounded-xl pl-11 pr-4 py-4 text-white placeholder-chl-muted-2 text-base transition-all duration-200"
                    disabled={state === 'loading'}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={state === 'loading' || !url.trim()}
                  className="btn-teal rounded-xl px-8 py-4 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none whitespace-nowrap"
                >
                  {state === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing…
                    </span>
                  ) : 'Analyze Site'}
                </button>
              </div>
            </form>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-8 mt-12 text-sm text-chl-muted">
              {[
                { icon: '⚡', label: 'Performance Score' },
                { icon: '♿', label: 'Accessibility Check' },
                { icon: '🔍', label: 'SEO Analysis' },
                { icon: '✅', label: 'Best Practices' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span className="hidden sm:block">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Loading State */}
        {state === 'loading' && (
          <section className="max-w-3xl mx-auto px-4 pb-20">
            <div className="bg-chl-card border border-chl-border rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-chl-border" />
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-t-chl-teal animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">🔍</span>
                  </div>
                </div>
              </div>
              <p className="text-chl-teal font-semibold mb-2 text-lg">
                {ANALYSIS_STEPS[stepIndex]}
              </p>
              <p className="text-chl-muted text-sm">
                This typically takes 15–30 seconds
              </p>
              <div className="mt-6 flex gap-1.5 justify-center">
                {ANALYSIS_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === stepIndex
                        ? 'w-8 bg-chl-teal'
                        : i < stepIndex
                        ? 'w-3 bg-chl-teal/40'
                        : 'w-3 bg-chl-border'
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Error State */}
        {state === 'error' && (
          <section className="max-w-2xl mx-auto px-4 pb-20">
            <div className="bg-chl-card border border-red-500/20 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold mb-2 text-red-400">Analysis Failed</h3>
              <p className="text-chl-muted mb-6">{error}</p>
              <button
                onClick={handleReset}
                className="btn-teal rounded-xl px-6 py-3 text-sm font-bold"
              >
                Try Again
              </button>
            </div>
          </section>
        )}

        {/* Results */}
        {state === 'success' && result && (
          <section ref={resultsRef} className="max-w-5xl mx-auto px-4 pb-24 animate-fade-in">
            {/* Analyzed URL bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 bg-chl-card border border-chl-border rounded-xl px-5 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-chl-teal-dim border border-chl-teal/30 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00BFA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-chl-muted mb-0.5">Analyzed</p>
                  <p className="text-white font-medium truncate text-sm">{result.url}</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="text-chl-teal text-sm font-semibold hover:text-chl-teal-light transition-colors flex items-center gap-1.5 flex-shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0" />
                  <path d="M3 12l4-4m-4 4l4 4" />
                </svg>
                Analyze another
              </button>
            </div>

            {/* Overall score + 4 category scores */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
              {/* Overall - big card */}
              <div className="lg:col-span-2 bg-chl-card border border-chl-border rounded-2xl p-8 flex flex-col items-center justify-center card-glow transition-all duration-300">
                <p className="text-chl-muted text-sm font-medium mb-6 uppercase tracking-widest">
                  Overall Score
                </p>
                <ScoreRing score={overallScore} size={140} strokeWidth={10} />
                <p className={`text-sm font-semibold mt-4 ${
                  overallScore >= 90 ? 'score-good' :
                  overallScore >= 50 ? 'score-average' : 'score-poor'
                }`}>
                  {overallScore >= 90 ? '✓ Excellent' : overallScore >= 50 ? '~ Needs Work' : '✗ Poor'}
                </p>
              </div>

              {/* 4 scores in 2x2 grid */}
              <div className="lg:col-span-3 grid grid-cols-2 gap-4">
                {[
                  { label: 'Performance', score: result.scores.performance, icon: '⚡', desc: 'Speed & loading' },
                  { label: 'Accessibility', score: result.scores.accessibility, icon: '♿', desc: 'Inclusive design' },
                  { label: 'Best Practices', score: result.scores.bestPractices, icon: '✅', desc: 'Modern standards' },
                  { label: 'SEO', score: result.scores.seo, icon: '🔍', desc: 'Search visibility' },
                ].map(item => (
                  <div
                    key={item.label}
                    className="bg-chl-card border border-chl-border rounded-2xl p-5 flex flex-col items-center card-glow transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-4 self-start w-full">
                      <span className="text-base">{item.icon}</span>
                      <div>
                        <p className="text-white text-sm font-semibold leading-tight">{item.label}</p>
                        <p className="text-chl-muted text-xs">{item.desc}</p>
                      </div>
                    </div>
                    <ScoreRing score={item.score} size={88} strokeWidth={7} />
                  </div>
                ))}
              </div>
            </div>

            {/* Score legend */}
            <div className="flex items-center gap-6 mb-10 px-1 text-xs text-chl-muted">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF3B30]" />0–49 Poor</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF9500]" />50–89 Needs Work</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-chl-teal" />90–100 Excellent</div>
            </div>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-1">Recommendations</h2>
                  <p className="text-chl-muted text-sm">
                    Top {result.recommendations.length} improvements ranked by impact
                  </p>
                </div>
                <div className="space-y-3">
                  {result.recommendations.map((rec, i) => (
                    <RecommendationCard key={rec.id} rec={rec} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-14 bg-chl-card border border-chl-teal/20 rounded-2xl p-8 md:p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-chl-teal/5 to-transparent pointer-events-none" />
              <div className="relative">
                <p className="text-xs uppercase tracking-widest text-chl-teal font-semibold mb-3">
                  Want expert help?
                </p>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">
                  We fix what Lighthouse finds.
                </h3>
                <p className="text-chl-muted mb-8 max-w-md mx-auto">
                  Click Here Labs specializes in turning these scores into real-world improvements.
                  Let's talk about your site.
                </p>
                <a
                  href="https://clickherelabs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-teal inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold"
                >
                  Get a Free Consultation
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Features section (shown on idle) */}
        {state === 'idle' && (
          <section className="max-w-5xl mx-auto px-4 pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: '⚡',
                  title: 'Performance',
                  desc: 'Measure load time, Core Web Vitals, render-blocking resources, and time to interactive.',
                  color: 'text-blue-400',
                  bg: 'bg-blue-500/10',
                  border: 'border-blue-500/20',
                },
                {
                  icon: '♿',
                  title: 'Accessibility',
                  desc: 'Check color contrast, ARIA labels, keyboard navigation, and screen reader compatibility.',
                  color: 'text-purple-400',
                  bg: 'bg-purple-500/10',
                  border: 'border-purple-500/20',
                },
                {
                  icon: '🔍',
                  title: 'SEO',
                  desc: 'Audit meta tags, structured data, crawlability, mobile-friendliness, and link quality.',
                  color: 'text-chl-teal',
                  bg: 'bg-chl-teal/10',
                  border: 'border-chl-teal/20',
                },
                {
                  icon: '✅',
                  title: 'Best Practices',
                  desc: 'Verify HTTPS usage, console errors, deprecated APIs, and security vulnerabilities.',
                  color: 'text-orange-400',
                  bg: 'bg-orange-500/10',
                  border: 'border-orange-500/20',
                },
              ].map(feature => (
                <div
                  key={feature.title}
                  className={`bg-chl-card border ${feature.border} rounded-2xl p-6 card-glow transition-all duration-300`}
                >
                  <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center text-xl mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${feature.color}`}>{feature.title}</h3>
                  <p className="text-chl-muted text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Trust bar */}
            <div className="mt-8 bg-chl-card border border-chl-border rounded-xl px-6 py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-chl-muted">
              {['Free to use', 'No account required', 'Powered by Google Lighthouse', 'By Click Here Labs'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <span className="text-chl-teal">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
