# EventMate Architecture

## System Architecture

```mermaid
graph TD
    subgraph "Frontend - React"
        A[Landing Page] --> B[Registration Form]
        B --> C[Success/QR Page]
        C --> D[Dashboard]
        D --> E[Session Detail]
        D --> F[Concierge Chatbot]
        D --> G[Networking Assistant]
        H[Staff Check-in] 
        I[Admin Dashboard]
    end

    subgraph "Backend - Express.js"
        J[Authentication Service] --> K[Firebase Auth]
        L[Session Service]
        M[Attendee Service]
        N[Recommendation Service]
        O[Check-in Service]
        P[Chatbot Service] --> Q[Gemini API Integration]
        P --> R[Rule-based Fallback]
        S[Analytics Service]
        T[Calendar Service] --> U[Google Calendar/ICS]
        V[Networking Service] --> W[Social OAuth Stubs]
    end

    subgraph "Database"
        X[Phase 1: JSON DB]
        Y[Phase 2: Firebase]
        Z[Phase 3: SAP HANA]
    end

    B --> M
    D --> L
    D --> N
    E --> L
    F --> P
    G --> V
    H --> O
    I --> S
    I --> M
    M --> X
    L --> X
    N --> X
    O --> X
    S --> X
    V --> X

    style A fill:#0F4C81,color:white
    style B fill:#0F4C81,color:white
    style C fill:#0F4C81,color:white
    style D fill:#0F4C81,color:white
    style E fill:#0F4C81,color:white
    style F fill:#0F4C81,color:white
    style G fill:#0F4C81,color:white
    style H fill:#0F4C81,color:white
    style I fill:#0F4C81,color:white
    style X fill:#4CAF50,color:white
    style Y fill:#2196F3,color:white
    style Z fill:#9C27B0,color:white
    style Q fill:#FF5722,color:white
```

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    participant ExternalAPIs
    
    User->>Frontend: Register for event
    Frontend->>Backend: POST /api/register
    Backend->>Database: Save attendee data
    Backend->>Frontend: Return ID + QR code
    Frontend->>User: Show QR code & success
    
    User->>Frontend: Access dashboard
    Frontend->>Backend: GET /api/sessions
    Backend->>Database: Fetch sessions
    Backend->>Frontend: Return sessions list
    Frontend->>User: Display sessions
    
    User->>Frontend: Request recommendations
    Frontend->>Backend: GET /api/attendee/:id/recommendations
    Backend->>Database: Get attendee interests & session data
    Backend->>Backend: Apply recommendation algorithm
    Backend->>Frontend: Return personalized sessions
    Frontend->>User: Display "For You" sessions
    
    User->>Frontend: Ask chatbot a question
    Frontend->>Backend: POST /api/chat
    Backend->>ExternalAPIs: Send to Gemini API
    alt API Success
        ExternalAPIs->>Backend: Return AI response
    else API Failure
        Backend->>Backend: Use rule-based fallback
    end
    Backend->>Frontend: Return response
    Frontend->>User: Display chatbot answer
    
    User->>Frontend: Check in to event
    Frontend->>Backend: POST /api/checkin with QR data
    Backend->>Backend: Verify HMAC signature
    Backend->>Database: Update check-in status
    Backend->>Frontend: Return check-in confirmation
    Frontend->>User: Display welcome message
```

## Component Structure

```mermaid
classDiagram
    class App {
        +Router
        +AuthContext
    }
    
    class Pages {
        Landing
        Register
        Success
        Dashboard
        SessionDetail
        ChatbotPage
        NetworkingPage
        StaffCheckin
        AdminPage
        NotFound
    }
    
    class Components {
        Header
        Footer
        RegistrationForm
        ForYouCarousel
        SessionCard
        SessionDetail
        SITConcierge
        NetworkingCard
        QRCodeDisplay
        StaffCheckin
        AdminTable
    }
    
    class Services {
        apiService
        authService
        chatbotService
        recommendationService
        calendarService
        networkingService
    }
    
    class Utils {
        validation
        formatting
        qrGenerator
        calendar
    }
    
    App --> Pages
    Pages --> Components
    Components --> Services
    Services --> Utils
```

## Database Schema

```mermaid
erDiagram
    ATTENDEES ||--o{ SESSIONS : bookmarks
    ATTENDEES {
        string id PK
        string registration_id
        string full_name
        string email
        string mobile
        string category
        string company
        string designation
        string college
        string education_level
        number year
        string food_choice
        string country
        string gender
        string blood_group
        string emergency_contact
        array interests
        datetime created_at
        boolean checked_in
        array bookmarked_sessions
    }
    SESSIONS {
        string id PK
        string title
        string description
        string speaker
        string speaker_bio
        datetime start_time
        datetime end_time
        string location
        number capacity
        array tags
        number popularity
        number bookmarks
    }
    SPEAKERS {
        string id PK
        string name
        string bio
        string company
        string position
        string photo_url
        array session_ids
    }
```

## Deployment Architecture

```mermaid
flowchart TD
    subgraph "Development"
        A[Local Development]
        B[GitHub Repository]
    end
    
    subgraph "Phase 1 - JSON DB"
        C[Express Backend]
        D[JSON File DB]
        E[React Frontend]
    end
    
    subgraph "Phase 2 - Firebase"
        F[Express Backend]
        G[Firebase Authentication]
        H[Firebase Firestore]
        I[Firebase Hosting]
    end
    
    subgraph "Phase 3 - SAP BTP"
        J[SAP BTP Runtime]
        K[SAP HANA Cloud DB]
        L[SAP Event Mesh]
        M[SAP AI Core]
    end
    
    A --> B
    B --> C
    B --> E
    C --> D
    C --Phase 2--> F
    F --> G
    F --> H
    E --Phase 2--> I
    F --Phase 3--> J
    J --> K
    J --> L
    J --> M
```

## How to Generate Diagram Images

To generate PNG images from these Mermaid diagrams:
1. Visit https://mermaid.live/
2. Paste each Mermaid code block into the editor
3. Use the "Export" button to save as PNG
4. Alternatively, install the Mermaid CLI:
   ```bash
   npm install -g @mermaid-js/mermaid-cli
   mmdc -i architecture_diagram.md -o architecture.png
   ```