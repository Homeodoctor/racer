# Car Racing Game

## Overview

This is a React-based 2D car racing game with a full-stack architecture. The game features a canvas-based racing experience where players control a car, avoid enemies, and collect items. The project uses modern web technologies including React, TypeScript, and Express.js for the backend with PostgreSQL database support through Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with Radix UI components for consistent design
- **Canvas Rendering**: HTML5 Canvas for game graphics and animations
- **State Management**: Zustand for game state, audio state, and racing state management
- **Build Tool**: Vite for fast development and optimized builds
- **3D Graphics**: Three.js integration with React Three Fiber for potential 3D elements

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful routes with `/api` prefix
- **Database Layer**: Drizzle ORM for type-safe database operations
- **Session Management**: In-memory storage with potential PostgreSQL session store
- **Development Mode**: Vite middleware integration for hot module replacement

### Game Logic Architecture
- **Game Engine**: Custom canvas-based game loop with collision detection
- **Game States**: Menu, playing, and game over states managed through Zustand
- **Audio System**: HTML5 Audio API with mute/unmute functionality
- **Input Handling**: Keyboard and touch controls for cross-platform support
- **Responsive Design**: Mobile-first approach with touch controls

### Data Storage
- **Primary Database**: PostgreSQL via Neon Database serverless
- **ORM**: Drizzle with migrations support
- **Local Storage**: Browser localStorage for high scores and preferences
- **Schema Design**: User management with username/password authentication

### Authentication & Authorization
- **User System**: Basic username/password authentication
- **Session Management**: Cookie-based sessions with connect-pg-simple
- **Authorization**: Middleware-based route protection

## External Dependencies

### Database & Storage
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database toolkit
- **connect-pg-simple**: PostgreSQL session store

### Frontend Libraries
- **React Ecosystem**: React 18, React DOM, React Query for server state
- **UI Components**: Radix UI primitives with custom styling
- **3D Graphics**: React Three Fiber, React Three Drei for 3D capabilities
- **Animations**: CSS-based animations with Tailwind utilities

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Build tool with hot module replacement
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS

### Audio & Media
- **Font Loading**: Fontsource for Inter font family
- **Audio Processing**: Native HTML5 Audio API
- **Asset Handling**: Vite asset processing for models and audio files

### Backend Services
- **Express.js**: Web application framework
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: tsx for TypeScript execution in development