# ABNA Campaign Dashboard

A React-based dashboard for visualizing Narcotics Anonymous campaign data from Google Sheets.

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite 7+
- **Package Manager**: Bun
- **Styling**: Tailwind CSS 4+
- **Charts**: Recharts
- **Testing**: Vitest + @testing-library/react + fast-check (PBT)
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system

### Installation

```bash
# Install dependencies
bun install

# Copy environment variables
cp .env.example .env

# Add your Google Sheets API key to .env
```

### Development

```bash
# Start development server
bun run dev

# Run tests
bun run test

# Run tests once (CI mode)
bun run test:run

# Build for production
bun run build

# Preview production build
bun run preview
```

## Project Structure

```
src/
├── components/     # React components
├── contexts/       # React contexts for state management
├── services/       # Data fetching services
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── test/           # Test setup and utilities
```

## Environment Variables

Create a `.env` file based on `.env.example`:

- `VITE_GOOGLE_SHEETS_API_KEY`: Your Google Sheets API key
- `VITE_GOOGLE_SHEETS_SPREADSHEET_ID`: The spreadsheet ID (default provided)
- `VITE_GOOGLE_SHEETS_RANGE`: The range to fetch (e.g., "Sheet1!A:Z")

## Deployment

The project is configured for automatic deployment to GitHub Pages via GitHub Actions. 

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Start

1. **Enable GitHub Pages**: In your repository settings, go to Pages and set the source to "GitHub Actions"

2. **Configure API Key**: The Google Sheets API key needs to be configured as a repository secret:
   - Go to repository Settings → Secrets and variables → Actions
   - Add a new repository secret named `VITE_GOOGLE_SHEETS_API_KEY`
   - Set the value to your Google Sheets API key

3. **Deploy**: Push to the `main` branch to trigger automatic deployment

The workflow will:
- Install dependencies using Bun
- Run the production build
- Deploy to GitHub Pages

### Manual Deployment

To test the production build locally:

```bash
# Build for production
bun run build

# Preview the production build
bun run preview
```

The production build will be output to the `dist/` directory.

## Testing

The project uses a dual testing approach:

- **Unit Tests**: Specific examples and edge cases using Vitest
- **Property-Based Tests**: Universal correctness properties using fast-check

Run all tests with:

```bash
bun run test:run
```

## License

This project is for internal use by ABNA (Associação Brasileira de Narcóticos Anônimos).
