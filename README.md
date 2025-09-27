# EventMate — Intelligent Participant Experience (IPX) Hub

A complete hackathon solution that enhances participant experience at SAP events through **intelligent registration**, **personalized session recommendations**, **AI-powered assistance**, and **secure check-in**.

---

## 🌟 Overview

**EventMate** is a next-gen event companion platform designed for **SAP hackathons and conferences**.  
It provides a seamless, **end-to-end attendee journey**: from registration and personalized agenda management to secure QR check-in and AI-powered assistance.

✨ **Why EventMate?**
- Attendees often face **long queues, session overload, and missed networking opportunities**.  
- EventMate solves this by delivering **AI-driven personalization, smart check-in, and intelligent support**, making every attendee’s journey smoother and smarter.  

<div align="center">
  <img src="./docs/banner.png" alt="EventMate Banner" width="80%" />
</div>

---

## ✨ Key Features

- ✅ **Intelligent Registration**  
  Multi-step form (Student / Professional) with real-time validation and personalized flow.  

- ✅ **AI-Powered Concierge**  
  *SIT Concierge Chatbot* powered by **Google Gemini LLM** — instant answers to FAQs, sessions, speakers, and venues.  

- ✅ **Personalized Agenda Builder**  
  Smart recommendations based on attendee’s interests, with no overlapping/conflicting sessions.  

- ✅ **Secure Check-in**  
  **HMAC-signed QR codes** for fast, tamper-proof event check-in.  

- ✅ **Smart Networking Assistant**  
  AI-suggested attendee matches with optional LinkedIn/X/Instagram connect.  

- ✅ **Organizer Dashboard**  
  Real-time view of registrations, check-ins, and attendee lists with CSV export.  

- ✅ **Seamless Integrations**  
  - Google Calendar export (ICS + OAuth)  
  - Gemini API for chatbot  
  - SAP HANA-ready backend (roadmap)  

- ✅ **Mobile-Responsive Design**  
  SAP + Apple-inspired UI (React + Tailwind + Framer Motion).  

---

## 🛠️ Technical Stack

### Frontend
- **Framework:** React  
- **Styling:** Tailwind CSS (SAP theme)  
- **Animations:** Framer Motion  
- **Routing:** React Router  
- **Forms:** React Hook Form  
- **State:** Context API + Hooks  
- **Testing:** Jest + React Testing Library  

### Backend
- **Server:** Express.js  
- **Data:** `db.json` (Phase 1 mock DB) → scalable to Firebase / SAP HANA  
- **AI Integration:** Google Gemini API  
- **QR Security:** HMAC-signed QR codes  
- **Testing:** Jest + Supertest  

---

## 📸 Screenshots

| Landing Page | Registration | Dashboard |
|:---:|:---:|:---:|
| ![](./docs/screenshots/landing.png) | ![](./docs/screenshots/register.png) | ![](./docs/screenshots/dashboard.png) |
| **SIT Concierge** | **Check-in Portal** | **Admin Dashboard** |
| ![](./docs/screenshots/chatbot.png) | ![](./docs/screenshots/checkin.png) | ![](./docs/screenshots/admin.png) |

---

## 🏗️ Architecture

EventMate follows a **modular client–server architecture**:

<div align="center">
  <img src="./docs/architecture.png" alt="Architecture Diagram" width="80%" />
</div>

- **Frontend Layer:** React (UI, state, routing)  
- **Backend Layer:** Express (REST APIs, business logic, QR generation)  
- **AI Layer:** Gemini LLM for chatbot + recommendations  
- **Data Layer:** JSON mock DB → migration-ready to SAP HANA / Firebase  

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+  
- npm or yarn  

### Installation
```bash
git clone https://github.com/yourusername/eventmate.git
cd eventmate
🔒 Security Features
	•	HMAC Signatures — secure, tamper-proof QR codes.
	•	Environment Variables — secrets never stored in code.
	•	Input Validation — strong server-side validation for all registration data.

⸻

🛣️ Roadmap
	•	Phase 1 (Hackathon PoC) — Mock DB, core flows, AI fallback.
	•	Phase 2 (MVP) — Full Gemini chatbot integration, Google Calendar sync, Firebase Auth.
	•	Phase 3 (Production) — SAP HANA migration, enterprise analytics, SuccessFactors integration.
