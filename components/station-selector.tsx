"use client"

import { useState, useMemo } from "react"
import { Check, ChevronsUpDown, MapPin, Navigation } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getStationsSorted, getStation, type LineId } from "@/lib/metro-data"

interface StationSelectorProps {
  type: "source" | "destination"
  value: string | null
  onChange: (stationId: string | null) => void
  disabled?: boolean
}

const LINE_COLORS: Record<LineId, string> = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  pink: "bg-pink-500",
}

export function StationSelector({ type, value, onChange, disabled }: StationSelectorProps) {
  const [open, setOpen] = useState(false)
  const stations = useMemo(() => getStationsSorted(), [])

  const selectedStation = value ? getStation(value) : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between h-10 sm:h-12 text-left font-normal", !value && "text-muted-foreground")}
        >
          <div className="flex items-center gap-2 truncate">
            {type === "source" ? (
              <Navigation className="h-4 w-4 text-green-500 shrink-0" />
            ) : (
              <MapPin className="h-4 w-4 text-red-500 shrink-0" />
            )}
            <span className="truncate text-sm">{selectedStation?.name || `Select ${type}...`}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-24px)] sm:w-[320px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${type}...`} className="h-10" />
          <CommandList className="max-h-[40vh] sm:max-h-[300px]">
            <CommandEmpty>No station found.</CommandEmpty>
            <CommandGroup>
              {stations.map((station) => (
                <CommandItem
                  key={station.id}
                  value={station.name}
                  onSelect={() => {
                    onChange(station.id === value ? null : station.id)
                    setOpen(false)
                  }}
                  className="py-2.5"
                >
                  <Check className={cn("mr-2 h-4 w-4", value === station.id ? "opacity-100" : "opacity-0")} />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-sm">{station.name}</span>
                    <div className="flex gap-1 items-center">
                      {station.lines.map((lineId) => (
                        <span key={lineId} className={cn("w-2 h-2 rounded-full", LINE_COLORS[lineId])} />
                      ))}
                      {station.isInterchange && (
                        <span className="text-[10px] text-muted-foreground ml-1">Interchange</span>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
