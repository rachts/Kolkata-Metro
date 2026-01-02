# Kolkata Metro Route Planner

A modern, interactive web application for planning journeys across the Kolkata Metro network. Built with Next.js 15, React, and TypeScript.

![Kolkata Metro Route Planner](https://placeholder.svg?height=400&width=800&query=kolkata%20metro%20route%20planner%20screenshot)

## Features

- **Route Planning** - Calculate optimal routes between any two stations using Dijkstra's algorithm
- **Interactive Map** - Visual metro network with clickable stations for quick selection
- **6 Metro Lines** - Complete coverage of Blue, Green, Purple, Orange, Yellow, and Pink lines
- **Travel Time Breakdown** - Detailed breakdown of travel time, dwell time, and interchange penalties
- **Peak Hour Mode** - Toggle peak time calculations for accurate journey estimates
- **Least Interchanges** - Option to minimize line changes for convenience
- **Dark/Light Mode** - Full theme support for comfortable viewing
- **Mobile Optimized** - Responsive design with tabbed interface for mobile devices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Theming**: next-themes
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rachts/kolkata-metro-planner.git
   cd kolkata-metro-planner
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy on Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/kolkata-metro-planner)

### Manual Deployment

Build the production version:

```bash
npm run build
npm run start
```

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles and CSS variables
│   ├── layout.tsx       # Root layout with theme provider
│   └── page.tsx         # Main application page
├── components/
│   ├── metro-map.tsx    # Interactive SVG metro map
│   ├── route-display.tsx # Route results and breakdown
│   ├── station-selector.tsx # Searchable station dropdown
│   ├── theme-provider.tsx # Dark/light mode provider
│   └── theme-toggle.tsx # Theme switch button
├── lib/
│   ├── metro-data.ts    # Station and line data
│   ├── route-calculator.ts # Dijkstra's algorithm implementation
│   └── utils.ts         # Utility functions
└── components/ui/       # shadcn/ui components
```

## Metro Lines

| Line | Color | Route |
|------|-------|-------|
| Blue | #0066CC | Dakshineswar - Kavi Subhash |
| Green | #00A650 | Howrah Maidan - Salt Lake Sector V |
| Purple | #9B59B6 | Joka - Esplanade |
| Orange | #F39C12 | New Garia - Airport |
| Yellow | #F1C40F | Noapara - Baranagar |
| Pink | #E91E63 | Baranagar - Barrackpore |

## Algorithm

The route calculation uses Dijkstra's shortest path algorithm with weighted edges:

- **Travel Time**: 2 minutes between adjacent stations
- **Dwell Time**: 30 seconds per station stop
- **Interchange Penalty**: 5 minutes for line changes
- **Peak Multiplier**: 1.2x during peak hours

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Kolkata Metro Rail Corporation for the metro network data
- [shadcn/ui](https://ui.shadcn.com) for the beautiful UI components
- [Lucide](https://lucide.dev) for the icon set
