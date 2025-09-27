# EventMate Frontend Components

This directory contains the frontend components for the EventMate application, an intelligent participant experience for hackathons. The components are organized by feature and follow a modular, reusable design pattern.

## Core Modules

### 1. SIT Concierge Chatbot
The intelligent chatbot assistant helps attendees navigate the event, find sessions, and connect with other participants.

**Key Components:**
- `ChatbotInterface`: The main chatbot UI with message display and input
- Message components for various response types (text, suggestions, session cards)

### 2. AI-Powered Agenda Builder
Personalized session recommendations and agenda creation based on attendee interests and preferences.

**Key Components:**
- `ForYouCarousel`: Displays personalized session recommendations in a carousel
- `SessionCard`: Renders individual session information with interactive elements
- `SessionList`: Displays a filterable list of all available sessions
- `SessionFilter`: Provides filtering options for session discovery

### 3. Smart Networking Assistant
Helps attendees connect with like-minded participants based on interests and session attendance.

**Key Components:**
- `NetworkingSection`: Container for networking recommendations
- `NetworkCard`: Individual attendee cards with match information
- `AttendeeProfile`: Detailed view of an attendee's profile and common interests

## Shared Components

The `shared` directory contains reusable UI elements used throughout the application:

- `AnimatedButton`: Interactive button with various styles and animations
- `EventMateLogo`: The application logo with animation options
- `Card`: Basic card container with variants
- `Input`, `Select`: Form controls
- `Modal`: Dialog component for overlays
- `Toast`: Notification system

## Design System

The components follow an Apple+SAP-inspired design system with:
- Rounded corners (rounded-apple classes)
- Clean typography
- Motion effects using Framer Motion
- SAP blue as primary color
- Consistent spacing and elevation

## Usage

Import components from their respective directories:

```jsx
import { ChatbotInterface } from '../components/chat';
import { ForYouCarousel, SessionCard } from '../components/sessions';
import { NetworkingSection, NetworkCard } from '../components/networking';
import { AnimatedButton, EventMateLogo } from '../components/shared';
```

## Animation

Components use Framer Motion for animations:
- Spring animations for natural movement
- Staggered animations for lists
- Hover and tap effects
- Page transitions

## Accessibility

Components are designed with accessibility in mind:
- Proper ARIA attributes
- Keyboard navigation
- Focus management
- Color contrast compliance