# EventMate — Intelligent Participant Experience (IPX) Hub

\<p\>A complete hackathon solution that enhances the participant experience at SAP events through intelligent registration, personalized session recommendations, AI-powered assistance, and seamless check-in.\</p\>

-----

### 🌟 Overview

EventMate is a comprehensive event management platform designed specifically for SAP events and hackathons. It provides a seamless, end-to-end experience for attendees, from registration and personalized agenda management to secure check-in and intelligent assistance. The platform uses AI to deliver smart recommendations and a conversational chatbot, ensuring attendees get the most out of their event.

\<div align="center"\>
\<img src="./docs/banner.png" alt="EventMate Banner" /\>
\</div\>

-----

### ✨ Key Features

  * **Intelligent Registration:** A dynamic, multi-step form with real-time validation to capture attendee interests and personalize their experience.
  * **AI-Powered Concierge:** The **SIT Concierge** chatbot, powered by **Google's Gemini LLM**, provides instant, context-aware answers to participant questions.
  * **Personalized Agenda:** Recommends sessions and workshops based on an attendee's registered interests and behavior, helping them navigate the event efficiently.
  * **Secure Check-in:** Uses **HMAC-signed QR codes** to ensure a quick, secure, and tamper-proof check-in process at the venue.
  * **Networking Assistant:** Facilitates connections between attendees by identifying and suggesting individuals with similar backgrounds and interests.
  * **Event Management Dashboard:** A comprehensive **Admin Dashboard** for event organizers to manage attendees, monitor check-in status, and access event statistics.
  * **Seamless Integration:** Allows attendees to easily export their personalized session schedule to popular calendar applications like **iCalendar, Google Calendar, and Outlook**.
  * **Mobile-Responsive Design:** Optimized to provide a consistent and intuitive experience across all devices.

-----

### 🛠️ Technical Stack

EventMate is built with a modern, scalable **MERN-like stack**.

#### **Frontend**

  * **Framework:** React
  * **Styling:** Tailwind CSS with a custom SAP-inspired UI theme
  * **Animation:** Framer Motion
  * **Routing:** React Router
  * **State Management:** React Context API & Hooks
  * **Form Handling:** React Hook Form
  * **Testing:** Jest & React Testing Library

#### **Backend**

  * **Server:** Express.js
  * **Authentication:** Custom HMAC implementation for QR codes
  * **AI Integration:** Google Gemini API
  * **Data Storage:** File-based mock database (`db.json`) with an architecture ready for migration to a relational database like SAP HANA
  * **Testing:** Jest

-----

### 📸 Application Screenshots

| Landing Page | Registration | Dashboard |
|:---:|:---:|:---:|
|  |  |  |
| **SIT Concierge** | **Check-in Portal** | **Admin View** |
|  |  |  |

-----

### 🏗️ Architecture

The application follows a standard client-server architecture, ensuring a clear separation of concerns.

\<div align="center"\>
\<img src="./docs/architecture.png" alt="Architecture Diagram" /\>
\</div\>

  * **Frontend Layer:** The React application provides the user interface and handles client-side logic.
  * **Backend Layer:** The Express.js server exposes RESTful API endpoints for data management and business logic.
  * **AI Service Layer:** Manages integration with the Google Gemini API for the chatbot and recommendation engine.
  * **Data Layer:** A simple JSON-based file system stores attendee and event data, allowing for rapid prototyping.

-----

### 🚀 Getting Started

#### **Prerequisites**

  * Node.js (v14.0.0 or newer)
  * npm or yarn

#### **Installation**

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/eventmate.git
    cd eventmate
    ```
2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```
3.  **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```
4.  **Configure environment variables:**
    Create a `.env` file in the **backend** directory and add the following:
    ```
    PORT=5000
    HMAC_SECRET=your_secure_hmac_secret_for_qr_code_signing
    GEMINI_API_KEY=your_gemini_api_key_here
    NODE_ENV=development
    ```

#### **Running the Application**

1.  **Start the backend server:**
    ```bash
    cd backend
    npm start
    ```
2.  **Start the frontend development server:**
    ```bash
    cd ../frontend
    npm start
    ```
3.  Open your browser and navigate to `http://localhost:3000`.

-----

### 🔒 Security Features

  * **HMAC Signatures:** All QR codes are cryptographically signed to prevent tampering and ensure the integrity of attendee data.
  * **Input Validation:** All user inputs are validated on the server to prevent security vulnerabilities.
  * **Environment Variables:** Sensitive information, such as API keys and secrets, is stored in environment variables, not in the codebase.

-----

### 🛣️ Roadmap

  * **Q4 2025:** Develop a native mobile application with offline support for check-in.
  * **Q1 2026:** Implement a robust analytics dashboard with detailed insights for event organizers.
  * **Q2 2026:** Integrate with SAP SuccessFactors for enhanced enterprise event management.
  * **Q3 2026:** Introduce multi-language support with AI-powered translation for the chatbot.

-----

### 📄 License

This project is proprietary and not licensed for public use without explicit permission.

-----

\<div align="center"\>
\<p\>Built with ❤️ for enhancing SAP event experiences\</p\>
\<p\>© 2025 EventMate\</p\>
\</div\>
