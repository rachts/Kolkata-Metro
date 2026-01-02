// Route calculation using Dijkstra's algorithm
// Separated business logic from UI

import {
  stations,
  connections,
  getStation,
  DWELL_TIME,
  INTERCHANGE_PENALTY,
  PEAK_MULTIPLIER,
  type LineId,
  type Station,
} from "./metro-data"

export interface RouteSegment {
  from: Station
  to: Station
  line: LineId
  travelTime: number
}

export interface RouteResult {
  path: Station[]
  segments: RouteSegment[]
  totalTime: number
  travelTime: number
  dwellTime: number
  interchangeTime: number
  interchangeCount: number
  interchangeStations: Station[]
}

interface DijkstraNode {
  stationId: string
  distance: number
  previousNode: string | null
  previousLine: LineId | null
}

// Build adjacency list from connections
function buildGraph(): Map<string, { to: string; line: LineId; time: number }[]> {
  const graph = new Map<string, { to: string; line: LineId; time: number }[]>()

  stations.forEach((station) => {
    graph.set(station.id, [])
  })

  connections.forEach((conn) => {
    const edges = graph.get(conn.from)
    if (edges) {
      edges.push({
        to: conn.to,
        line: conn.line,
        time: conn.travelTime,
      })
    }
  })

  return graph
}

/**
 * Calculate the shortest route between two stations using Dijkstra's algorithm
 * Considers travel time, dwell time, and interchange penalties
 */
export function calculateRoute(
  fromId: string,
  toId: string,
  isPeakTime = false,
  preferLessInterchanges = false,
): RouteResult | null {
  if (fromId === toId) {
    const station = getStation(fromId)
    if (!station) return null
    return {
      path: [station],
      segments: [],
      totalTime: 0,
      travelTime: 0,
      dwellTime: 0,
      interchangeTime: 0,
      interchangeCount: 0,
      interchangeStations: [],
    }
  }

  const graph = buildGraph()
  const nodes = new Map<string, DijkstraNode>()
  const visited = new Set<string>()

  // Initialize nodes
  stations.forEach((station) => {
    nodes.set(station.id, {
      stationId: station.id,
      distance: station.id === fromId ? 0 : Number.POSITIVE_INFINITY,
      previousNode: null,
      previousLine: null,
    })
  })

  // Priority queue (simple implementation)
  const queue: string[] = [fromId]

  while (queue.length > 0) {
    // Get node with minimum distance
    queue.sort((a, b) => {
      const nodeA = nodes.get(a)!
      const nodeB = nodes.get(b)!
      return nodeA.distance - nodeB.distance
    })

    const currentId = queue.shift()!

    if (visited.has(currentId)) continue
    visited.add(currentId)

    if (currentId === toId) break

    const currentNode = nodes.get(currentId)!
    const edges = graph.get(currentId) || []

    for (const edge of edges) {
      if (visited.has(edge.to)) continue

      const neighborNode = nodes.get(edge.to)!

      // Calculate time including interchange penalty if changing lines
      let edgeTime = edge.time + DWELL_TIME

      if (currentNode.previousLine && currentNode.previousLine !== edge.line) {
        edgeTime += preferLessInterchanges
          ? INTERCHANGE_PENALTY * 2 // Double penalty to discourage interchanges
          : INTERCHANGE_PENALTY
      }

      // Apply peak time multiplier
      if (isPeakTime) {
        edgeTime *= PEAK_MULTIPLIER
      }

      const newDistance = currentNode.distance + edgeTime

      if (newDistance < neighborNode.distance) {
        neighborNode.distance = newDistance
        neighborNode.previousNode = currentId
        neighborNode.previousLine = edge.line

        if (!queue.includes(edge.to)) {
          queue.push(edge.to)
        }
      }
    }
  }

  // Reconstruct path
  const toNode = nodes.get(toId)!
  if (toNode.distance === Number.POSITIVE_INFINITY) {
    return null // No route found
  }

  const path: Station[] = []
  const segments: RouteSegment[] = []
  let currentId: string | null = toId

  while (currentId) {
    const station = getStation(currentId)
    if (station) {
      path.unshift(station)
    }

    const node = nodes.get(currentId)!
    if (node.previousNode && node.previousLine) {
      const fromStation = getStation(node.previousNode)
      const toStation = getStation(currentId)

      if (fromStation && toStation) {
        segments.unshift({
          from: fromStation,
          to: toStation,
          line: node.previousLine,
          travelTime:
            connections.find((c) => c.from === node.previousNode && c.to === currentId && c.line === node.previousLine)
              ?.travelTime || 2,
        })
      }
    }

    currentId = node.previousNode
  }

  // Calculate time breakdown
  let travelTime = 0
  let interchangeCount = 0
  const interchangeStations: Station[] = []
  let previousLine: LineId | null = null

  segments.forEach((segment, index) => {
    travelTime += segment.travelTime

    if (previousLine && previousLine !== segment.line) {
      interchangeCount++
      interchangeStations.push(segment.from)
    }
    previousLine = segment.line
  })

  const dwellTime = (path.length - 1) * DWELL_TIME
  const interchangeTime = interchangeCount * INTERCHANGE_PENALTY
  let totalTime = travelTime + dwellTime + interchangeTime

  if (isPeakTime) {
    totalTime *= PEAK_MULTIPLIER
  }

  return {
    path,
    segments,
    totalTime: Math.round(totalTime * 10) / 10,
    travelTime: Math.round(travelTime * 10) / 10,
    dwellTime: Math.round(dwellTime * 10) / 10,
    interchangeTime: Math.round(interchangeTime * 10) / 10,
    interchangeCount,
    interchangeStations,
  }
}

/**
 * Get multiple route options (fastest and least interchanges)
 */
export function getRouteOptions(
  fromId: string,
  toId: string,
  isPeakTime = false,
): { fastest: RouteResult | null; leastInterchanges: RouteResult | null } {
  const fastest = calculateRoute(fromId, toId, isPeakTime, false)
  const leastInterchanges = calculateRoute(fromId, toId, isPeakTime, true)

  return { fastest, leastInterchanges }
}
