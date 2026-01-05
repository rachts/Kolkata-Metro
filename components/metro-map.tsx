"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { stations, lines, type LineId, type Station } from "@/lib/metro-data"
import type { RouteResult } from "@/lib/route-calculator"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw, Move } from "lucide-react"

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

  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null)
  const lastPinchDistRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isStationOnRoute = useCallback(
    (stationId: string) => {
      if (!route) return false
      return route.path.some((s) => s.id === stationId)
    },
    [route],
  )

  const handleZoomIn = () => {
    setScale((s) => Math.min(s * 1.3, 4))
  }

  const handleZoomOut = () => {
    setScale((s) => Math.max(s / 1.3, 0.5))
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      setIsDragging(true)
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
      lastPinchDistRef.current = dist
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && lastTouchRef.current && isDragging) {
      const deltaX = e.touches[0].clientX - lastTouchRef.current.x
      const deltaY = e.touches[0].clientY - lastTouchRef.current.y
      setPosition((p) => ({ x: p.x + deltaX, y: p.y + deltaY }))
      lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    } else if (e.touches.length === 2 && lastPinchDistRef.current) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
      const delta = dist / lastPinchDistRef.current
      setScale((s) => Math.min(Math.max(s * delta, 0.5), 4))
      lastPinchDistRef.current = dist
    }
  }

  const handleTouchEnd = () => {
    lastTouchRef.current = null
    lastPinchDistRef.current = null
    setIsDragging(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      lastTouchRef.current = { x: e.clientX, y: e.clientY }
      setIsDragging(true)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && lastTouchRef.current) {
      const deltaX = e.clientX - lastTouchRef.current.x
      const deltaY = e.clientY - lastTouchRef.current.y
      setPosition((p) => ({ x: p.x + deltaX, y: p.y + deltaY }))
      lastTouchRef.current = { x: e.clientX, y: e.clientY }
    }
  }

  const handleMouseUp = () => {
    lastTouchRef.current = null
    setIsDragging(false)
  }

  const zoomToRoute = useCallback(() => {
    if (!route || route.path.length === 0) return

    const xs = route.path.map((s) => s.x)
    const ys = route.path.map((s) => s.y)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2

    // Calculate scale to fit route with padding
    const routeWidth = maxX - minX + 100
    const routeHeight = maxY - minY + 100
    const newScale = Math.min(550 / routeWidth, 750 / routeHeight, 2.5)

    setScale(newScale)
    // Center on the route
    const containerWidth = containerRef.current?.clientWidth || 400
    const containerHeight = containerRef.current?.clientHeight || 500
    setPosition({
      x: containerWidth / 2 - centerX * newScale,
      y: containerHeight / 2 - centerY * newScale,
    })
  }, [route])

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
            r={24}
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

          {/* Station name label */}
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
    <div
      ref={containerRef}
      className="relative w-full h-full bg-card rounded-lg border border-border overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Selection mode indicator */}
      <div className="absolute top-2 left-2 z-10 px-2 py-1 sm:px-3 sm:py-1.5 bg-background/90 backdrop-blur-sm rounded-md text-[10px] sm:text-xs font-medium border border-border">
        {isSelectingSource ? (
          <span className="text-green-600 dark:text-green-400">● Select Source</span>
        ) : (
          <span className="text-red-600 dark:text-red-400">● Select Destination</span>
        )}
      </div>

      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-background/90 backdrop-blur-sm"
          onClick={handleZoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-background/90 backdrop-blur-sm"
          onClick={handleZoomOut}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-background/90 backdrop-blur-sm"
          onClick={handleReset}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        {route && (
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-background/90 backdrop-blur-sm"
            onClick={zoomToRoute}
            title="Zoom to route"
          >
            <Move className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="absolute bottom-12 left-2 z-10 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-[9px] text-muted-foreground border border-border sm:hidden">
        Pinch to zoom • Drag to pan
      </div>

      <svg
        viewBox="0 0 550 750"
        className="w-full h-full transition-transform duration-100"
        preserveAspectRatio="xMidYMid meet"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: "0 0",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
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

      {/* Legend */}
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
