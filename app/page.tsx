"use client"

import { useState, useCallback, useEffect } from "react"
import { ArrowDownUp, Clock, Zap, RefreshCw, Train, Map, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetroMap } from "@/components/metro-map"
import { StationSelector } from "@/components/station-selector"
import { RouteDisplay } from "@/components/route-display"
import { ThemeToggle } from "@/components/theme-toggle"
import { calculateRoute, type RouteResult } from "@/lib/route-calculator"

export default function Home() {
  const [sourceStation, setSourceStation] = useState<string | null>(null)
  const [destinationStation, setDestinationStation] = useState<string | null>(null)
  const [isPeakTime, setIsPeakTime] = useState(false)
  const [routeType, setRouteType] = useState<"fastest" | "least-interchanges">("fastest")
  const [route, setRoute] = useState<RouteResult | null>(null)
  const [isSelectingSource, setIsSelectingSource] = useState(true)
  const [mobileView, setMobileView] = useState<"map" | "controls">("controls")

  // Calculate route when stations change
  useEffect(() => {
    if (sourceStation && destinationStation) {
      const preferLessInterchanges = routeType === "least-interchanges"
      const result = calculateRoute(sourceStation, destinationStation, isPeakTime, preferLessInterchanges)
      setRoute(result)
    } else {
      setRoute(null)
    }
  }, [sourceStation, destinationStation, isPeakTime, routeType])

  const handleStationClick = useCallback(
    (stationId: string) => {
      if (isSelectingSource) {
        setSourceStation(stationId)
        setIsSelectingSource(false)
      } else {
        setDestinationStation(stationId)
        setIsSelectingSource(true)
      }
    },
    [isSelectingSource],
  )

  const handleSwapStations = useCallback(() => {
    const temp = sourceStation
    setSourceStation(destinationStation)
    setDestinationStation(temp)
  }, [sourceStation, destinationStation])

  const handleReset = useCallback(() => {
    setSourceStation(null)
    setDestinationStation(null)
    setRoute(null)
    setIsSelectingSource(true)
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - Made more compact on mobile */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-12 sm:h-14 items-center justify-between px-3 sm:px-4">
          <div className="flex items-center gap-2">
            <Train className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h1 className="text-base sm:text-lg font-semibold text-foreground">Kolkata Metro</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="lg:hidden border-b border-border bg-background">
        <div className="flex">
          <button
            onClick={() => setMobileView("controls")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              mobileView === "controls" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            <Settings2 className="h-4 w-4" />
            Plan Journey
          </button>
          <button
            onClick={() => setMobileView("map")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              mobileView === "map" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            <Map className="h-4 w-4" />
            View Map
          </button>
        </div>
      </div>

      <main className="flex-1 px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid lg:grid-cols-[1fr_380px] gap-4 sm:gap-6 h-full">
          {/* Map Section - Hidden on mobile unless map tab is active */}
          <div className={`${mobileView === "map" ? "block" : "hidden"} lg:block order-2 lg:order-1`}>
            <Card className="h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)] lg:h-[calc(100vh-120px)]">
              <CardHeader className="py-2 sm:py-3 px-3 sm:px-4">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <span>Metro Network</span>
                  {route && <span className="text-xs font-normal text-muted-foreground">• Route shown</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-1 sm:p-2 h-[calc(100%-48px)] sm:h-[calc(100%-56px)]">
                <MetroMap
                  selectedSource={sourceStation}
                  selectedDestination={destinationStation}
                  route={route}
                  onStationClick={handleStationClick}
                  isSelectingSource={isSelectingSource}
                />
              </CardContent>
            </Card>
          </div>

          {/* Controls Section - Hidden on mobile unless controls tab is active */}
          <div
            className={`${mobileView === "controls" ? "block" : "hidden"} lg:block order-1 lg:order-2 space-y-3 sm:space-y-4`}
          >
            {/* Station Selection */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4 pt-3 sm:pt-4">
                <CardTitle className="text-sm sm:text-base">Plan Your Journey</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Select stations or tap on map</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-4 pb-3 sm:pb-4">
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">From</Label>
                    <StationSelector
                      type="source"
                      value={sourceStation}
                      onChange={(id) => {
                        setSourceStation(id)
                        setIsSelectingSource(false)
                      }}
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSwapStations}
                      disabled={!sourceStation && !destinationStation}
                      className="h-8 w-8 rounded-full"
                    >
                      <ArrowDownUp className="h-4 w-4" />
                      <span className="sr-only">Swap stations</span>
                    </Button>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">To</Label>
                    <StationSelector
                      type="destination"
                      value={destinationStation}
                      onChange={(id) => {
                        setDestinationStation(id)
                        setIsSelectingSource(true)
                      }}
                    />
                  </div>
                </div>

                {/* Options - More compact on mobile */}
                <div className="space-y-2 sm:space-y-3 pt-1 sm:pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="peak-time" className="text-xs sm:text-sm">
                        Peak Hours
                      </Label>
                    </div>
                    <Switch id="peak-time" checked={isPeakTime} onCheckedChange={setIsPeakTime} />
                  </div>

                  <Tabs value={routeType} onValueChange={(v) => setRouteType(v as "fastest" | "least-interchanges")}>
                    <TabsList className="grid w-full grid-cols-2 h-8 sm:h-9">
                      <TabsTrigger value="fastest" className="text-xs gap-1">
                        <Zap className="h-3 w-3" />
                        Fastest
                      </TabsTrigger>
                      <TabsTrigger value="least-interchanges" className="text-xs gap-1">
                        <RefreshCw className="h-3 w-3" />
                        Less Changes
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Reset Button */}
                {(sourceStation || destinationStation) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="w-full bg-transparent text-xs sm:text-sm h-8 sm:h-9"
                  >
                    Clear Selection
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Route Results */}
            {route && route.path.length > 1 && <RouteDisplay route={route} isPeakTime={isPeakTime} />}

            {/* Empty State - More compact */}
            {!route && sourceStation && destinationStation && (
              <Card>
                <CardContent className="py-6 sm:py-8 text-center text-muted-foreground">
                  <p className="text-sm">No route found between selected stations.</p>
                </CardContent>
              </Card>
            )}

            {!sourceStation && !destinationStation && (
              <Card>
                <CardContent className="py-6 sm:py-8 text-center text-muted-foreground">
                  <Train className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 opacity-30" />
                  <p className="text-xs sm:text-sm">Select source and destination stations to see your route</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer - Updated to show on all devices with "Made by Rachit" credit */}
      <footer className="border-t border-border">
        <div className="px-4 py-3 text-center text-xs text-muted-foreground">
          <p>Kolkata Metro Route Planner</p>
          <p className="mt-1">Made by Rachit</p>
        </div>
      </footer>
    </div>
  )
}
