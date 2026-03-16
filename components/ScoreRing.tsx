'use client'

import { useEffect, useRef, useState } from 'react'

interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
}

function getScoreColor(score: number): string {
  if (score >= 90) return '#00BFA5'
  if (score >= 50) return '#FF9500'
  return '#FF3B30'
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Good'
  if (score >= 50) return 'Needs Work'
  return 'Poor'
}

export default function ScoreRing({ score, size = 120, strokeWidth = 8 }: ScoreRingProps) {
  const [animated, setAnimated] = useState(false)
  const ringRef = useRef<SVGCircleElement>(null)

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color = getScoreColor(score)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [score])

  const fontSize = size >= 130 ? size * 0.22 : size * 0.24
  const labelSize = size >= 130 ? size * 0.1 : size * 0.09

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
        aria-label={`Score: ${score} out of 100`}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1E1E1E"
          strokeWidth={strokeWidth}
        />
        {/* Score fill */}
        <circle
          ref={ringRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          style={{
            transition: 'stroke-dashoffset 1.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
        {/* Score number — centered, accounting for the rotation */}
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize={fontSize}
          fontWeight="800"
          fontFamily="Inter, system-ui, sans-serif"
          style={{ transform: `rotate(90deg)`, transformOrigin: `${size / 2}px ${size / 2}px` }}
        >
          {score}
        </text>
      </svg>
      <span
        className="mt-1 font-medium"
        style={{
          color,
          fontSize: `${labelSize * 1.1}px`,
        }}
      >
        {getScoreLabel(score)}
      </span>
    </div>
  )
}
