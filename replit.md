# PawnValue Pro - Replit Project Guide

## Overview

PawnValue Pro is a comprehensive item valuation application designed for pawn shops and resellers. The system provides real-time pricing analysis by aggregating data from multiple sources including eBay, Edmunds, and other pricing APIs. Built with a modern full-stack architecture, it offers an intuitive dashboard for managing inventory, performing valuations, and tracking market trends.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom dark theme
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful endpoints with JSON responses
- **Session Management**: Express sessions with PostgreSQL store

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations
- **Development Storage**: In-memory storage implementation for testing
- **File Structure**: Shared schema definitions between client and server

## Key Components

### Database Schema
- **Categories**: Item categorization with icon support (PostgreSQL)
- **Items**: Core inventory with specifications, conditions, and metadata
- **Valuations**: Pricing analysis results with confidence scores
- **Price History**: Historical pricing data from multiple sources
- **Market Trends**: Category-specific market analysis

### Authentication & Authorization
- Session-based authentication (configured but not fully implemented)
- PostgreSQL session store for persistence
- Ready for user management implementation

### External Service Integrations
- **eBay API**: Product pricing and market data
- **Edmunds API**: Vehicle valuation (automotive items)
- **Price API**: General product pricing information
- **Configurable Sources**: Extensible pricing service architecture

### UI/UX Components
- **Dark Theme**: Custom color scheme optimized for professional use
- **Responsive Design**: Mobile-first approach with grid layouts
- **Interactive Dashboard**: Real-time data visualization
- **Advanced Filtering**: Multi-criteria search and filtering
- **Quick Search**: Autocomplete with suggestions
- **Quick Scan**: Barcode scanning with camera support and manual entry
- **AI Assistant**: Context-aware chatbot for valuation guidance and market insights

### New Features (January 2025)
- **Quick Scan Component**: Camera-based barcode scanning with fallback manual entry
- **AI Assistant**: Floating chat interface providing valuation advice, market insights, and authentication tips
- **Database Integration**: Full PostgreSQL implementation with persistent data storage
- **Sample Data**: Pre-loaded items including electronics, jewelry, and vehicles for testing

## Data Flow

1. **Item Input**: Users search or scan items via barcode/manual entry
2. **Multi-Source Analysis**: System queries multiple pricing APIs simultaneously
3. **Data Aggregation**: Pricing service combines and weights data from sources
4. **Valuation Calculation**: Algorithm determines market value and recommended offer
5. **Result Display**: Dashboard shows comprehensive pricing analysis
6. **Historical Tracking**: System stores pricing history for trend analysis

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL client
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **express**: Web application framework
- **vite**: Frontend build tool and dev server

### UI Libraries
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **wouter**: Lightweight React router

### Development Tools
- **typescript**: Type safety and development experience
- **esbuild**: Fast JavaScript bundler for production
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite dev server with HMR
- **Database**: Neon Database with development credentials
- **API Proxy**: Vite proxy for API requests during development
- **Environment Variables**: Configurable API keys and database URLs

### Production Build
- **Frontend**: Static assets built with Vite
- **Backend**: Bundled with esbuild for optimized Node.js execution
- **Database**: Production PostgreSQL via Neon Database
- **Deployment**: Suitable for platforms like Replit, Vercel, or traditional hosting

### Configuration Management
- Environment-based configuration for API keys
- Graceful fallbacks for missing external service credentials
- Modular pricing service architecture for easy API integration

### Performance Considerations
- Lazy loading for dashboard components
- Optimized database queries with proper indexing
- Caching strategy for pricing data to reduce API calls
- Responsive image handling for item photos

The application is designed to be production-ready with proper error handling, loading states, and a professional user interface suitable for business environments.