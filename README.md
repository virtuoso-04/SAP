# EventMate — Intelligent Participant Experience (IPX) Hub

<div align="center">
  <p>A complete hackathon solution that enhances participant experience at SAP events through <strong>intelligent registration</strong>, <strong>personalized session recommendations</strong>, <strong>AI-powered assistance</strong>, and <strong>secure check-in</strong>.</p>

  <p>
    <img src="https://img.shields.io/badge/EventMate-IPX%20Hub-0A6ED1" alt="EventMate" />
    <img src="https://img.shields.io/badge/Version-2.0.0-blue" alt="Version" />
    <img src="https://img.shields.io/badge/License-Proprietary-red" alt="License" />
    <img src="https://img.shields.io/badge/Platform-Web-lightgrey" alt="Platform" />
    <img src="https://img.shields.io/badge/Made%20with-React%20+%20Vercel-61DAFB" alt="Made with" />
    <img src="https://img.shields.io/badge/UI-Apple+SAP_Hybrid-black" alt="UI Design" />
  </p>
</div>

---

## 🌟 Overview

EventMate is a comprehensive event management platform designed specifically for SAP events and hackathons. It provides a seamless end-to-end experience for attendees, from registration to check-in and session management, with AI-powered personalized recommendations and intelligent assistance.

---

## ✨ Key Features

- ✅ **Intelligent Registration** - Multi-step form with real-time validation and personalization options
- ✅ **AI-Powered Concierge** - SIT Chatbot using Google's Gemini LLM with rule-based fallback
- ✅ **Personalized Agenda Builder** - Smart recommendations based on attendee interests and behavior
- ✅ **Secure Check-in** - HMAC-signed QR codes for tamper-proof venue access
- ✅ **Smart Networking Assistant** - Connect attendees with similar interests and backgrounds
- ✅ **Calendar Integration** - Export sessions to iCalendar, Google Calendar, or Outlook
- ✅ **Admin Dashboard** - Comprehensive management tools for event organizers
- ✅ **Mobile-Responsive Design** - Optimized experience across all devices

---

## 🛠️ Technical Stack

### Frontend
- **Framework:** React.js (Create React App)
- **Routing:** React Router v6
- **Styling:** Tailwind CSS with custom SAP UI Theme
- **Animation:** Framer Motion
- **State Management:** React Context API & Hooks
- **Form Handling:** React Hook Form
- **Testing:** Jest & React Testing Library

### Backend
- **Server:** Vercel Serverless Functions (Node.js)
- **Database:** JSON file-based (easily replaceable with any database)
- **Authentication:** HMAC-SHA256 signature for QR codes
- **AI Integration:** Google Gemini API
- **Testing:** Jest for API endpoints

---

## 🏗️ Architecture

EventMate follows a **modular client–server architecture**:

- **Frontend Layer:** React components with responsive UI/UX design
- **Backend Layer:** Vercel Serverless Functions (REST APIs, business logic, QR generation)
- **AI Layer:** Gemini LLM for chatbot + recommendations
- **Data Layer:** JSON mock DB → migration-ready to SAP HANA / Firebase

---

## 📱 Application Screens

| Landing Page | Registration | Dashboard |
|:---:|:---:|:---:|
| ![Landing](./docs/screenshots/landing.png) | ![Registration](./docs/screenshots/registration.png) | ![Dashboard](./docs/screenshots/dashboard.png) |

| SIT Concierge | Check-in Portal | Admin View |
|:---:|:---:|:---:|
| ![Chatbot](./docs/screenshots/chatbot.png) | ![Checkin](./docs/screenshots/checkin.png) | ![Admin](./docs/screenshots/admin.png) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Google Gemini API Key (optional for enhanced chatbot)

### Installation

```bash
# Clone the repository
git clone https://github.com/virtuoso-04/SAP.git
cd SAP

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the development server
npm start
```

Open your browser to `http://localhost:3000`

### Environment Configuration

Create a `.env` file in the root directory:

```env
# HMAC secret for QR code signing
HMAC_SECRET=your_secure_hmac_secret_here

# Google Gemini API key (optional)
GEMINI_API_KEY=your_gemini_api_key_here

# Node environment
NODE_ENV=development
```

---

## 🚀 Vercel Deployment

EventMate is configured for seamless deployment on Vercel!

### Quick Deploy Steps:

1. **Fork this repository** on GitHub
2. **Go to [vercel.com](https://vercel.com)** and sign up/login
3. **Click "Import Project"** and connect your GitHub repository
4. **Vercel will automatically detect** the React app and serverless functions
5. **Deploy!** Your app will be live at `https://your-project-name.vercel.app`

### Environment Variables (Optional):

Set these in your Vercel dashboard:
- `HMAC_SECRET`: Your secure HMAC secret for QR code signing
- `GEMINI_API_KEY`: Your Google Gemini API key for enhanced chatbot

### Features Ready for Production:

✅ **Serverless API** - No server management needed  
✅ **Global CDN** - Fast loading worldwide  
✅ **Automatic HTTPS** - SSL certificates included  
✅ **Custom Domain** - Easy domain setup  
✅ **Analytics** - Built-in performance monitoring  

---

## 🔐 Security Features

- **HMAC Signatures** - All QR codes are cryptographically signed to prevent tampering
- **Environment Variables** - Sensitive data never stored in code
- **Input Validation** - Strong server-side validation for all data
- **Security Headers** - Proper HTTP headers to prevent common web vulnerabilities

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## 🛣️ Roadmap

- [ ] **Q4 2025**: Mobile app with offline support
- [ ] **Q1 2026**: Advanced analytics dashboard
- [ ] **Q2 2026**: Integration with SAP SuccessFactors for enterprise events
- [ ] **Q3 2026**: Multi-language support with AI translation
- [ ] **Q4 2026**: Real-time notifications and push messaging

---

## 📄 License

This project is proprietary and not licensed for public use without explicit permission.

---

<div align="center">
  <p><strong>Built with ❤️ for enhancing SAP event experiences</strong></p>
  <p>© 2025 EventMate | Intelligent Participant Experience Hub</p>
</div></p>

  <p>
