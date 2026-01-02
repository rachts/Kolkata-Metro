"use client"

import { Train, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { RouteResult } from "@/lib/route-calculator"
import { getLine, type LineId } from "@/lib/metro-data"
import { cn } from "@/lib/utils"

interface RouteDisplayProps {
  route: RouteResult
  isPeakTime: boolean
}

const LINE_COLORS: Record<LineId, { bg: string; text: string; border: string }> = {
  blue: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", border: "border-blue-500" },
  green: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-500",
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-500",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-500",
  },
  yellow: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-700 dark:text-yellow-300",
    border: "border-yellow-500",
  },
  pink: { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-700 dark:text-pink-300", border: "border-pink-500" },
}

export function RouteDisplay({ route, isPeakTime }: RouteDisplayProps) {
  if (route.path.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4 pt-3 sm:pt-4">
        <CardTitle className="flex items-center justify-between text-sm sm:text-lg">
          <div className="flex items-center gap-2">
            <Train className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Your Route
          </div>
          {isPeakTime && (
            <Badge variant="secondary" className="text-[10px] sm:text-xs">
              Peak
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-4 pb-3 sm:pb-4">
        {/* Time Summary - 2x2 grid on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="bg-primary/10 rounded-lg p-2 sm:p-3 text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">{Math.round(route.totalTime)}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Total Min</div>
          </div>
          <div className="bg-secondary rounded-lg p-2 sm:p-3 text-center">
            <div className="text-base sm:text-lg font-semibold text-secondary-foreground">{route.path.length - 1}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Stops</div>
          </div>
          <div className="bg-secondary rounded-lg p-2 sm:p-3 text-center">
            <div className="text-base sm:text-lg font-semibold text-secondary-foreground">{route.interchangeCount}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Changes</div>
          </div>
          <div className="bg-secondary rounded-lg p-2 sm:p-3 text-center">
            <div className="text-base sm:text-lg font-semibold text-secondary-foreground">
              {route.travelTime.toFixed(0)}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Travel Min</div>
          </div>
        </div>

        {/* Time Breakdown - More compact on mobile */}
        <div className="bg-muted/50 rounded-lg p-2 sm:p-3 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Travel time</span>
            <span className="font-medium">{route.travelTime.toFixed(1)} min</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Dwell time</span>
            <span className="font-medium">{route.dwellTime.toFixed(1)} min</span>
          </div>
          {route.interchangeCount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Interchange</span>
              <span className="font-medium">{route.interchangeTime.toFixed(1)} min</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-primary">{route.totalTime.toFixed(1)} min</span>
          </div>
        </div>

        {/* Route Path - More compact on mobile */}
        <div className="space-y-1.5 sm:space-y-2">
          <div className="text-xs sm:text-sm font-medium text-foreground">Route Details</div>
          <div className="relative max-h-[200px] sm:max-h-[300px] overflow-y-auto pr-1">
            {route.path.map((station, index) => {
              const isFirst = index === 0
              const isLast = index === route.path.length - 1
              const isInterchange = route.interchangeStations.some((s) => s.id === station.id)
              const currentSegment = route.segments[index]
              const prevSegment = route.segments[index - 1]

              return (
                <div key={station.id} className="flex items-start gap-2 sm:gap-3">
                  {/* Line indicator */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 z-10",
                        isFirst && "bg-green-500 border-green-600",
                        isLast && "bg-red-500 border-red-600",
                        !isFirst && !isLast && isInterchange && "bg-amber-500 border-amber-600",
                        !isFirst && !isLast && !isInterchange && "bg-white border-gray-400",
                      )}
                    />
                    {!isLast && (
                      <div
                        className="w-0.5 h-6 sm:h-8"
                        style={{
                          backgroundColor: currentSegment
                            ? {
                                blue: "#0055a5",
                                green: "#007a33",
                                purple: "#8100fb",
                                orange: "#f78500",
                                yellow: "#f6be00",
                                pink: "#ff6ab2",
                              }[currentSegment.line]
                            : "#d1d5db",
                        }}
                      />
                    )}
                  </div>

                  {/* Station info */}
                  <div className={cn("pb-3 sm:pb-4", isLast && "pb-0")}>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span
                        className={cn(
                          "font-medium text-xs sm:text-sm",
                          (isFirst || isLast) && "font-semibold",
                          isInterchange && "text-amber-600 dark:text-amber-400",
                        )}
                      >
                        {station.name}
                      </span>
                      {isFirst && (
                        <Badge
                          variant="outline"
                          className="text-[8px] sm:text-[10px] h-4 sm:h-5 px-1 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                        >
                          Start
                        </Badge>
                      )}
                      {isLast && (
                        <Badge
                          variant="outline"
                          className="text-[8px] sm:text-[10px] h-4 sm:h-5 px-1 bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                        >
                          End
                        </Badge>
                      )}
                      {isInterchange && (
                        <Badge
                          variant="outline"
                          className="text-[8px] sm:text-[10px] h-4 sm:h-5 px-1 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                        >
                          <RefreshCw className="h-2 w-2 sm:h-2.5 sm:w-2.5 mr-0.5" />
                          Change
                        </Badge>
                      )}
                    </div>
                    {!isLast && currentSegment && (
                      <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                        {getLine(currentSegment.line)?.name}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
