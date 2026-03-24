# PawnValue Pro

**Professional Item Valuation Platform for Pawn Shops & Resellers**

---

## What It Does

PawnValue Pro gives pawn shop owners instant, data-driven pricing on any item they receive. Instead of guessing or relying on experience alone, staff can scan a barcode, search by name, or manually enter item details and get a real market valuation in seconds — pulled from live sources like eBay sold listings, KBB/Edmunds for vehicles, and electronics pricing APIs.

---

## Key Features

- **Barcode Scanner** — Camera-based scanning to instantly look up items
- **Quick Search** — Autocomplete search with live suggestions from inventory
- **Enter Item Form** — Manually enter any item with condition, brand, model, and age for a full valuation
- **Live Market Valuations** — Multi-source pricing with recommended offer ranges and confidence scores
- **AI Assistant** — Built-in chat assistant for valuation guidance, authentication tips, and market insights
- **Market Trends** — Category-level market movement tracking
- **Advanced Filters** — Multi-criteria filtering and search across inventory
- **Full Database** — All items and valuations stored persistently in PostgreSQL
- **Professional Dashboard** — Dark-themed, mobile-friendly interface built for counter use

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS + Shadcn/ui |
| Routing | Wouter |
| State | TanStack Query |
| Build | Vite |
| Backend | Node.js + Express |
| Database | PostgreSQL (Neon serverless) |
| ORM | Drizzle ORM |
| AI | Anthropic Claude API |

---

## Project Structure

```
PawnValuePro/
├── client/                    # Frontend (React)
│   ├── src/
│   │   ├── components/        # UI components
│   │   │   ├── AIAssistant.tsx       # Floating AI chat
│   │   │   ├── AdvancedFilters.tsx   # Search & filter panel
│   │   │   ├── CategoryGrid.tsx      # Item category browser
│   │   │   ├── ItemEntry.tsx         # Manual item entry form
│   │   │   ├── MarketTrends.tsx      # Trend charts
│   │   │   ├── QuickScan.tsx         # Barcode scanner
│   │   │   ├── QuickSearch.tsx       # Search bar with suggestions
│   │   │   └── ValuationResults.tsx  # Pricing results display
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx         # Main dashboard page
│   │   │   └── ItemValuation.tsx     # Item detail/valuation page
│   │   ├── lib/
│   │   │   ├── api.ts                # API client functions
│   │   │   └── queryClient.ts        # React Query setup
│   │   └── types/index.ts            # Shared frontend types
│   └── index.html
│
├── server/                    # Backend (Node.js + Express)
│   ├── index.ts               # Server entry point
│   ├── routes.ts              # All API endpoints
│   ├── storage.ts             # Database interface layer
│   ├── db.ts                  # PostgreSQL connection
│   └── services/
│       └── pricingService.ts  # Multi-source pricing logic
│
├── shared/
│   └── schema.ts              # Database schema + shared types
│
├── package.json               # Dependencies
├── vite.config.ts             # Frontend build config
├── tailwind.config.ts         # Styling config
├── drizzle.config.ts          # Database migration config
└── tsconfig.json              # TypeScript config
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | List all inventory items |
| GET | `/api/items/:id` | Get single item details |
| POST | `/api/items` | Add new item |
| GET | `/api/items/suggestions` | Search autocomplete |
| GET | `/api/items/search` | Advanced item search |
| POST | `/api/pricing/analyze` | Run valuation on an item |
| GET | `/api/categories` | List all item categories |
| GET | `/api/valuations` | List recent valuations |
| GET | `/api/market-trends` | Market trend data |
| GET | `/api/stats/today` | Daily stats summary |
| POST | `/api/ai/chat` | AI assistant endpoint |

---

## Getting Started

### Requirements
- Node.js 20+
- PostgreSQL database
- Anthropic API key (for AI assistant)

### Setup

```bash
# Install dependencies
npm install

# Set environment variables
DATABASE_URL=your_postgresql_url
ANTHROPIC_API_KEY=your_api_key

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

The app runs on `http://localhost:5000`

---

## Market Opportunity

The pawn industry in the US processes over **$6 billion** in loans annually across 11,000+ shops. Most shops still rely on manual pricing — outdated price guides, personal experience, or time-consuming online searches. PawnValue Pro brings real-time market intelligence directly to the counter, reducing undervaluation risk and increasing shop profitability.

---

## Roadmap

- [ ] Mobile app (iOS/Android) for field valuations
- [ ] Direct eBay/marketplace listing integration
- [ ] Multi-location shop management
- [ ] Customer-facing receipt and valuation reports (PDF)
- [ ] Loan tracking and payment management
- [ ] Compliance and reporting tools

---

*Built with modern web technologies for reliability, speed, and scalability.*
