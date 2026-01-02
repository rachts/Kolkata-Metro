"use client"

import { useState, useCallback } from "react"
import { stations, lines, type LineId, type Station } from "@/lib/metro-data"
import type { RouteResult } from "@/lib/route-calculator"
import { cn } from "@/lib/utils"

interface MetroMapProps {
  selectedSource: string | null
  selectedDestination: string | null
  route: RouteResult | null
  onStationClick: (stationId: string) => void
  isSelectingSource: boolean
}

const LINE_COLORS: Record<LineId, string> = {
  blue: "#0055a5",
  green: "#007a33",
  purple: "#8100fb",
  orange: "#f78500",
  yellow: "#f6be00",
  pink: "#ff6ab2",
}

export function MetroMap({
  selectedSource,
  selectedDestination,
  route,
  onStationClick,
  isSelectingSource,
}: MetroMapProps) {
  const [hoveredStation, setHoveredStation] = useState<string | null>(null)

  const isStationOnRoute = useCallback(
    (stationId: string) => {
      if (!route) return false
      return route.path.some((s) => s.id === stationId)
    },
    [route],
  )

  const renderLines = () => {
    return lines.map((line) => {
      const lineStations = line.stations.map((id) => stations.find((s) => s.id === id)).filter(Boolean) as Station[]

      if (lineStations.length < 2) return null

      const pathData = lineStations
        .map((station, index) => {
          const command = index === 0 ? "M" : "L"
          return `${command} ${station.x} ${station.y}`
        })
        .join(" ")

      return (
        <path
          key={line.id}
          d={pathData}
          stroke={LINE_COLORS[line.id]}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-opacity duration-300"
          style={{
            opacity: route ? 0.3 : 1,
          }}
        />
      )
    })
  }

  const renderRouteHighlight = () => {
    if (!route || route.segments.length === 0) return null

    return route.segments.map((segment, index) => (
      <line
        key={`route-${index}`}
        x1={segment.from.x}
        y1={segment.from.y}
        x2={segment.to.x}
        y2={segment.to.y}
        stroke={LINE_COLORS[segment.line]}
        strokeWidth={6}
        strokeLinecap="round"
        className="animate-pulse"
      />
    ))
  }

  const renderStations = () => {
    return stations.map((station) => {
      const isSource = station.id === selectedSource
      const isDestination = station.id === selectedDestination
      const isOnRoute = isStationOnRoute(station.id)
      const isInterchangeOnRoute = route?.interchangeStations.some((s) => s.id === station.id)
      const isHovered = hoveredStation === station.id

      let radius = station.isInterchange ? 10 : 8
      if (isSource || isDestination) radius = 12
      if (isHovered) radius += 2

      return (
        <g key={station.id}>
          <circle
            cx={station.x}
            cy={station.y}
            r={20}
            fill="transparent"
            className="cursor-pointer"
            onMouseEnter={() => setHoveredStation(station.id)}
            onMouseLeave={() => setHoveredStation(null)}
            onClick={() => onStationClick(station.id)}
          />

          {/* Outer ring for interchanges */}
          {station.isInterchange && (
            <circle
              cx={station.x}
              cy={station.y}
              r={radius + 3}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="text-foreground/30 pointer-events-none"
            />
          )}

          {/* Main station circle */}
          <circle
            cx={station.x}
            cy={station.y}
            r={radius}
            fill={
              isSource
                ? "#22c55e"
                : isDestination
                  ? "#ef4444"
                  : isInterchangeOnRoute
                    ? "#f59e0b"
                    : isOnRoute
                      ? "#3b82f6"
                      : "white"
            }
            stroke={isHovered ? "#6366f1" : station.isInterchange ? "#374151" : "#6b7280"}
            strokeWidth={isHovered ? 3 : 2}
            className={cn("pointer-events-none transition-all duration-200", isOnRoute && "drop-shadow-lg")}
          />

          {/* Station name label - Slightly larger text for readability */}
          <text
            x={station.x + (station.x > 250 ? -12 : 16)}
            y={station.y + 4}
            textAnchor={station.x > 250 ? "end" : "start"}
            className={cn(
              "text-[9px] sm:text-[8px] fill-current pointer-events-none select-none",
              isOnRoute ? "font-semibold text-foreground" : "text-muted-foreground",
              isHovered && "font-semibold text-primary",
            )}
          >
            {station.name}
          </text>
        </g>
      )
    })
  }

  return (
    <div className="relative w-full h-full bg-card rounded-lg border border-border overflow-hidden touch-pan-x touch-pan-y">
      {/* Selection mode indicator - More compact on mobile */}
      <div className="absolute top-2 left-2 z-10 px-2 py-1 sm:px-3 sm:py-1.5 bg-background/90 backdrop-blur-sm rounded-md text-[10px] sm:text-xs font-medium border border-border">
        {isSelectingSource ? (
          <span className="text-green-600 dark:text-green-400">● Select Source</span>
        ) : (
          <span className="text-red-600 dark:text-red-400">● Select Destination</span>
        )}
      </div>

      <svg viewBox="0 0 550 750" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-border" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Metro lines */}
        <g className="metro-lines">{renderLines()}</g>

        {/* Route highlight */}
        <g className="route-highlight">{renderRouteHighlight()}</g>

        {/* Stations */}
        <g className="stations">{renderStations()}</g>
      </svg>

      {/* Legend - More compact and repositioned for mobile */}
      <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm rounded-md p-1.5 sm:p-2 text-[10px] sm:text-xs border border-border">
        <div className="font-medium mb-1 text-foreground">Lines</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 sm:grid-cols-1 sm:gap-1">
          {lines.map((line) => (
            <div key={line.id} className="flex items-center gap-1.5">
              <div className="w-2.5 h-1 rounded-full" style={{ backgroundColor: LINE_COLORS[line.id] }} />
              <span className="text-muted-foreground truncate">{line.name.replace(" Line", "")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
