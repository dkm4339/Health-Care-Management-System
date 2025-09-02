# Smart Health Care Management System

## Overview

This is a comprehensive healthcare management system built with React (frontend) and Express (backend) that facilitates communication between patients, doctors, and administrators. The application provides features like appointment booking, real-time chat, video calling, and user management through role-based dashboards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with functional components and hooks
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack Query for server state management and React Context for authentication
- **Styling**: TailwindCSS with shadcn/ui component library using the "new-york" style variant
- **Real-time Communication**: WebSocket client for chat functionality
- **Build Tool**: Vite with TypeScript support and custom path aliases

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **WebSocket**: Native WebSocket server integrated with Express for real-time messaging
- **Storage**: In-memory storage implementation with interface abstraction for future database migration
- **API Design**: RESTful endpoints with role-based access control middleware

### Database Schema Design
The application uses Drizzle ORM with PostgreSQL dialect, defining four main entities:
- **Users**: Core user information with role-based access (patient, doctor, admin)
- **Doctors**: Extended doctor-specific information linked to users
- **Appointments**: Scheduling system connecting patients and doctors
- **Messages**: Real-time messaging system for user communication

### Authentication & Authorization
- JWT token-based authentication stored in localStorage
- Role-based route protection with three user types: patient, doctor, admin
- Protected routes component that validates user permissions
- Automatic token validation and user session management

### Real-time Features
- WebSocket connection for instant messaging between users
- Socket service abstraction for handling message broadcasting
- Connection management with automatic authentication
- Message persistence and chat history retrieval

### UI/UX Design Patterns
- Responsive design with mobile-first approach using TailwindCSS
- Component composition using Radix UI primitives
- Consistent theming with CSS custom properties for dark/light mode support
- Accessible components following WAI-ARIA standards
- Form handling with React Hook Form and Zod validation

## External Dependencies

### Core Frontend Libraries
- **React Ecosystem**: React 18 with modern hooks, React Router (Wouter), TanStack Query for data fetching
- **UI Components**: Radix UI primitives, shadcn/ui components, Lucide React icons
- **Styling**: TailwindCSS, class-variance-authority for component variants
- **Form Management**: React Hook Form with Hookform Resolvers for validation

### Backend Dependencies
- **Database**: Neon Database (serverless PostgreSQL), Drizzle ORM for type-safe queries
- **Authentication**: jsonwebtoken for JWT handling, bcrypt for password security
- **WebSocket**: Native WebSocket (ws) library for real-time communication
- **Session Management**: connect-pg-simple for PostgreSQL session storage

### Development & Build Tools
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Modern build tool with HMR and optimized bundling
- **ESBuild**: Fast TypeScript compilation for production builds
- **Drizzle Kit**: Database migrations and schema management
- **PostCSS**: CSS processing with autoprefixer

### Third-party Services
- **Neon Database**: Serverless PostgreSQL hosting for scalable data storage
- **Replit Integration**: Development environment plugins and error handling
- **Font Loading**: Google Fonts integration for typography (DM Sans, Geist Mono, etc.)

The architecture prioritizes scalability with the abstracted storage interface, enabling easy migration from in-memory storage to production databases. The modular component structure and clear separation of concerns facilitate maintenance and feature expansion.