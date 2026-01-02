// Kolkata Metro Network Data
// Structured JSON data for stations, lines, and travel times

export type LineId = "blue" | "green" | "purple" | "orange" | "yellow" | "pink"

export interface Station {
  id: string
  name: string
  lines: LineId[]
  x: number // SVG coordinate
  y: number
  isInterchange: boolean
}

export interface Connection {
  from: string
  to: string
  line: LineId
  travelTime: number // in minutes
}

export interface Line {
  id: LineId
  name: string
  color: string
  stations: string[] // station IDs in order
}

export const DWELL_TIME = 0.5 // 30 seconds at each station
export const INTERCHANGE_PENALTY = 4 // 4 minutes for line change
export const PEAK_MULTIPLIER = 1.3 // 30% longer during peak hours

export const lines: Line[] = [
  {
    id: "blue",
    name: "Line 1 (Blue)",
    color: "#0055a5",
    stations: [
      "dakshineswar",
      "baranagar",
      "noapara",
      "dumdum",
      "belgachia",
      "shyambazar",
      "sovabazar-sutanuti",
      "girish-park",
      "mahatma-gandhi-road",
      "central",
      "chandni-chowk",
      "esplanade",
      "park-street",
      "maidan",
      "rabindra-sadan",
      "netaji-bhavan",
      "jatin-das-park",
      "kalighat",
      "rabindra-sarobar",
      "masterda-surya-sen",
      "netaji",
      "kavi-subhash",
    ],
  },
  {
    id: "green",
    name: "Line 2 (Green)",
    color: "#007a33",
    stations: [
      "salt-lake-sector-v",
      "karunamoyee",
      "central-park",
      "city-centre",
      "bengal-chemical",
      "saltlake-stadium",
      "phoolbagan",
      "sealdah",
      "esplanade",
      "howrah-maidan",
      "howrah",
    ],
  },
  {
    id: "purple",
    name: "Line 3 (Purple)",
    color: "#8100fb",
    stations: [
      "joka",
      "thakurpukur",
      "sakher-bazar",
      "behala-chowrasta",
      "behala-bazar",
      "taratala",
      "majerhat",
      "rabindra-sadan",
    ],
  },
  {
    id: "orange",
    name: "Line 4 (Orange)",
    color: "#f78500",
    stations: ["noapara", "airport", "jessore-road", "dum-dum-cantonment", "bagjola", "hemnath-bazu"],
  },
  {
    id: "yellow",
    name: "Line 5 (Yellow)",
    color: "#f6be00",
    stations: ["sealdah", "moulali", "college-street", "mahatma-gandhi-road"],
  },
  {
    id: "pink",
    name: "Line 6 (Pink)",
    color: "#ff6ab2",
    stations: ["kavi-subhash", "satyajit-ray", "ruby", "ruby-east", "hemanta-mukherjee"],
  },
]

// Generate stations with their properties
export const stations: Station[] = [
  // Line 1 (Blue) - North to South
  { id: "dakshineswar", name: "Dakshineswar", lines: ["blue"], x: 200, y: 40, isInterchange: false },
  { id: "baranagar", name: "Baranagar", lines: ["blue"], x: 200, y: 70, isInterchange: false },
  { id: "noapara", name: "Noapara", lines: ["blue", "orange"], x: 200, y: 100, isInterchange: true },
  { id: "dumdum", name: "Dum Dum", lines: ["blue"], x: 200, y: 130, isInterchange: false },
  { id: "belgachia", name: "Belgachia", lines: ["blue"], x: 200, y: 160, isInterchange: false },
  { id: "shyambazar", name: "Shyambazar", lines: ["blue"], x: 200, y: 190, isInterchange: false },
  { id: "sovabazar-sutanuti", name: "Sovabazar-Sutanuti", lines: ["blue"], x: 200, y: 220, isInterchange: false },
  { id: "girish-park", name: "Girish Park", lines: ["blue"], x: 200, y: 250, isInterchange: false },
  {
    id: "mahatma-gandhi-road",
    name: "Mahatma Gandhi Road",
    lines: ["blue", "yellow"],
    x: 200,
    y: 280,
    isInterchange: true,
  },
  { id: "central", name: "Central", lines: ["blue"], x: 200, y: 310, isInterchange: false },
  { id: "chandni-chowk", name: "Chandni Chowk", lines: ["blue"], x: 200, y: 340, isInterchange: false },
  { id: "esplanade", name: "Esplanade", lines: ["blue", "green"], x: 200, y: 370, isInterchange: true },
  { id: "park-street", name: "Park Street", lines: ["blue"], x: 200, y: 400, isInterchange: false },
  { id: "maidan", name: "Maidan", lines: ["blue"], x: 200, y: 430, isInterchange: false },
  { id: "rabindra-sadan", name: "Rabindra Sadan", lines: ["blue", "purple"], x: 200, y: 460, isInterchange: true },
  { id: "netaji-bhavan", name: "Netaji Bhavan", lines: ["blue"], x: 200, y: 490, isInterchange: false },
  { id: "jatin-das-park", name: "Jatin Das Park", lines: ["blue"], x: 200, y: 520, isInterchange: false },
  { id: "kalighat", name: "Kalighat", lines: ["blue"], x: 200, y: 550, isInterchange: false },
  { id: "rabindra-sarobar", name: "Rabindra Sarobar", lines: ["blue"], x: 200, y: 580, isInterchange: false },
  { id: "masterda-surya-sen", name: "Masterda Surya Sen", lines: ["blue"], x: 200, y: 610, isInterchange: false },
  { id: "netaji", name: "Netaji", lines: ["blue"], x: 200, y: 640, isInterchange: false },
  { id: "kavi-subhash", name: "Kavi Subhash", lines: ["blue", "pink"], x: 200, y: 670, isInterchange: true },

  // Line 2 (Green) - East to West
  { id: "salt-lake-sector-v", name: "Salt Lake Sector V", lines: ["green"], x: 450, y: 300, isInterchange: false },
  { id: "karunamoyee", name: "Karunamoyee", lines: ["green"], x: 420, y: 320, isInterchange: false },
  { id: "central-park", name: "Central Park", lines: ["green"], x: 390, y: 340, isInterchange: false },
  { id: "city-centre", name: "City Centre", lines: ["green"], x: 360, y: 360, isInterchange: false },
  { id: "bengal-chemical", name: "Bengal Chemical", lines: ["green"], x: 330, y: 370, isInterchange: false },
  { id: "saltlake-stadium", name: "Salt Lake Stadium", lines: ["green"], x: 300, y: 370, isInterchange: false },
  { id: "phoolbagan", name: "Phoolbagan", lines: ["green"], x: 270, y: 370, isInterchange: false },
  { id: "sealdah", name: "Sealdah", lines: ["green", "yellow"], x: 240, y: 370, isInterchange: true },
  // esplanade already defined above
  { id: "howrah-maidan", name: "Howrah Maidan", lines: ["green"], x: 140, y: 370, isInterchange: false },
  { id: "howrah", name: "Howrah", lines: ["green"], x: 100, y: 370, isInterchange: false },

  // Line 3 (Purple) - South extension
  { id: "joka", name: "Joka", lines: ["purple"], x: 120, y: 650, isInterchange: false },
  { id: "thakurpukur", name: "Thakurpukur", lines: ["purple"], x: 130, y: 620, isInterchange: false },
  { id: "sakher-bazar", name: "Sakher Bazar", lines: ["purple"], x: 140, y: 590, isInterchange: false },
  { id: "behala-chowrasta", name: "Behala Chowrasta", lines: ["purple"], x: 150, y: 560, isInterchange: false },
  { id: "behala-bazar", name: "Behala Bazar", lines: ["purple"], x: 160, y: 530, isInterchange: false },
  { id: "taratala", name: "Taratala", lines: ["purple"], x: 170, y: 500, isInterchange: false },
  { id: "majerhat", name: "Majerhat", lines: ["purple"], x: 180, y: 480, isInterchange: false },
  // rabindra-sadan already defined above

  // Line 4 (Orange) - Airport extension
  { id: "airport", name: "Airport", lines: ["orange"], x: 280, y: 60, isInterchange: false },
  { id: "jessore-road", name: "Jessore Road", lines: ["orange"], x: 260, y: 80, isInterchange: false },
  { id: "dum-dum-cantonment", name: "Dum Dum Cantonment", lines: ["orange"], x: 240, y: 100, isInterchange: false },
  { id: "bagjola", name: "Bagjola", lines: ["orange"], x: 300, y: 80, isInterchange: false },
  { id: "hemnath-bazu", name: "Hemnath Bazu Sarani", lines: ["orange"], x: 320, y: 100, isInterchange: false },

  // Line 5 (Yellow)
  { id: "moulali", name: "Moulali", lines: ["yellow"], x: 230, y: 300, isInterchange: false },
  { id: "college-street", name: "College Street", lines: ["yellow"], x: 215, y: 290, isInterchange: false },

  // Line 6 (Pink)
  { id: "satyajit-ray", name: "Satyajit Ray", lines: ["pink"], x: 250, y: 680, isInterchange: false },
  { id: "ruby", name: "Ruby", lines: ["pink"], x: 300, y: 690, isInterchange: false },
  { id: "ruby-east", name: "Ruby East", lines: ["pink"], x: 350, y: 700, isInterchange: false },
  { id: "hemanta-mukherjee", name: "Hemanta Mukherjee", lines: ["pink"], x: 400, y: 710, isInterchange: false },
]

// Generate connections based on station order in each line
export const connections: Connection[] = []

lines.forEach((line) => {
  for (let i = 0; i < line.stations.length - 1; i++) {
    connections.push({
      from: line.stations[i],
      to: line.stations[i + 1],
      line: line.id,
      travelTime: 2 + Math.random() * 1.5, // 2-3.5 minutes between stations
    })
    // Add reverse connection
    connections.push({
      from: line.stations[i + 1],
      to: line.stations[i],
      line: line.id,
      travelTime: 2 + Math.random() * 1.5,
    })
  }
})

// Helper function to get station by ID
export function getStation(id: string): Station | undefined {
  return stations.find((s) => s.id === id)
}

// Helper function to get line by ID
export function getLine(id: LineId): Line | undefined {
  return lines.find((l) => l.id === id)
}

// Get all stations sorted alphabetically
export function getStationsSorted(): Station[] {
  return [...stations].sort((a, b) => a.name.localeCompare(b.name))
}
