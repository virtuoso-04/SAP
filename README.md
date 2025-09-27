# EventMate — Intelligent Participant Experience (IPX) Hub

<<<<<<< HEAD
# EventMate — Intelligent Participant Experience (IPX) Hub

<div align="center">
  <p>A complete hackathon solution that enhances the participant experience at SAP events through intelligent registration, personalized session recommendations, AI-powered assistance, and seamless check-in.</p>

  <p>
    <img src="https://img.shields.io/badge/EventMate-IPX%20Hub-0A6ED1" alt="EventMate" />
    <img src="https://img.shields.io/badge/Version-2.0.0-blue" alt="Version" />
    <img src="https://img.shields.io/badge/License-Proprietary-red" alt="License" />
    <img src="https://img.shields.io/badge/Platform-Web-lightgrey" alt="Platform" />
    <img src="https://img.shields.io/badge/Made%20with-React%20+%20Vercel-61DAFB" alt="Made with" />
    <img src="https://img.shields.io/badge/UI-Apple+SAP_Hybrid-black" alt="UI Design" />
  </p>

  <p>EventMate is an intelligent event management platform designed specifically for SAP events. It provides a seamless end-to-end experience for attendees, from registration to check-in and session management, with AI-powered personalized recommendations and intelligent assistance.</p>
</div>

### Key Features



## 🌟 Overview

EventMate is a comprehensive event management platform designed specifically for SAP events and hackathons. It provides a seamless end-to-end experience for attendees, from registration to check-in and session management, with AI-powered personalized recommendations and intelligent assistance.

<div align="center">
  ![EventMate Banner](./docs/banner.png)
</div>

## Technical Stack

- **Frontend**: React (Create React App), React Router, Tailwind CSS
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: JSON file-based (easily replaceable with any database)
- **Deployment**: Vercel
- **Authentication**: HMAC-SHA256 signature for QR codes

## 🚀 Key Features- **Database**: File-based mock DB (`db.json`)

- **Authentication**: HMAC-SHA256 signature for QR codes

- **Dynamic Registration System**: Multi-step form with real-time validation and personalization options- **Utilities**: Calendar integration (ICS, Google Calendar, Outlook)

- **SIT Concierge Chatbot**: AI-powered chatbot using Google's Gemini LLM with rule-based fallback- **Testing**: Jest for API endpoints

- **Personalized Agenda**: Smart recommendations based on attendee interests and behavior

- **Secure QR Code Check-in**: HMAC-signed QR codes for secure venue access## Screenshots

- **Networking Assistant**: Connect attendees with similar interests and backgrounds

- **Calendar Integration**: Export sessions to iCalendar, Google Calendar, or Outlook| Landing Page | Registration | Dashboard |

- **Admin Dashboard**: Comprehensive management tools for event organizers|:---:|:---:|:---:|

- **Mobile-Responsive Design**: Optimized experience across all devices| ![Landing](./docs/screenshots/landing.png) | ![Registration](./docs/screenshots/registration.png) | ![Dashboard](./docs/screenshots/dashboard.png) |



## 🛠️ Technology Stack| Session Detail | Check-in | Admin View |

|:---:|:---:|:---:|

### Frontend| ![Session](./docs/screenshots/session.png) | ![Checkin](./docs/screenshots/checkin.png) | ![Admin](./docs/screenshots/admin.png) |

- **Framework**: React.js

- **Routing**: React Router v6## Architecture

- **Styling**: Tailwind CSS with custom SAP UI Theme

- **Animation**: Framer Motion![Architecture Diagram](./docs/architecture.png)

- **State Management**: React Context API & Hooks

- **Form Handling**: React Hook FormThe application follows a client-server architecture:

- **Testing**: Jest & React Testing Library

1. **Frontend (React)**: User interface with components and pages

### Backend2. **Backend (Express.js)**: RESTful API endpoints

- **Server**: Express.js3. **Mock Database**: JSON file-based data store

- **Authentication**: Custom HMAC implementation, Firebase Auth support4. **Service Layer**: Business logic, recommendation engine, QR code generation

- **AI Integration**: Google Gemini API

- **Data Storage**: JSON file-based (with ready migration to SAP HANA)## Getting Started

- **API Documentation**: OpenAPI/Swagger

- **Testing**: Jest### Prerequisites



## 📱 Application Screens- Node.js (v14+)

- npm or yarn

<div align="center">

  <table>### Installation

    <tr>

      <td align="center"><strong>Landing Page</strong></td>1. Clone the repository:

      <td align="center"><strong>Registration</strong></td>

      <td align="center"><strong>Dashboard</strong></td>```bash

    </tr>git clone https://github.com/yourusername/eventmate.git

    <tr>cd eventmate

      <td><img src="./docs/screenshots/landing.png" alt="Landing Page" width="250"/></td>```

      <td><img src="./docs/screenshots/registration.png" alt="Registration" width="250"/></td>

      <td><img src="./docs/screenshots/dashboard.png" alt="Dashboard" width="250"/></td>2. Install backend dependencies:

    </tr>

    <tr>```bash

      <td align="center"><strong>SIT Concierge</strong></td>cd backend

      <td align="center"><strong>Check-in Portal</strong></td>npm install

      <td align="center"><strong>Admin View</strong></td>```

    </tr>

    <tr>3. Install frontend dependencies:

      <td><img src="./docs/screenshots/chatbot.png" alt="SIT Concierge" width="250"/></td>

      <td><img src="./docs/screenshots/checkin.png" alt="Check-in Portal" width="250"/></td>```bash

      <td><img src="./docs/screenshots/admin.png" alt="Admin View" width="250"/></td>cd ../frontend

    </tr>npm install

  </table>```

</div>

### Running the Application

## 🏗️ Architecture

1. Start the backend server:

<div align="center">

  <img src="./docs/architecture.png" alt="Architecture Diagram" width="700"/>```bash

</div>cd backend

npm start

The application follows a modern client-server architecture:```



1. **Frontend Layer**: React components with responsive UI/UX design2. Start the frontend development server:

2. **API Gateway**: RESTful endpoints with proper error handling

3. **Business Logic Layer**: Core event management functionality```bash

4. **AI Services**: Recommendation engine and Gemini-powered chatbotcd frontend

5. **Data Layer**: Structured storage with JSON (expandable to databases)npm start

```

## 🚦 Getting Started

3. Open your browser and navigate to `http://localhost:3000`

### Prerequisites

## Usage Guide

- Node.js (v14.0.0 or newer)

- npm/yarn### Demo Credentials

- Google Gemini API Key (optional for enhanced chatbot)

- **Staff Check-in Portal**: Access code `SAP2025`

### Installation- **Admin Dashboard**: Access code `ADMIN2025`



#### Backend Setup### Registration Flow



```bash1. Complete the registration form

# Clone the repository2. Receive QR code for check-in

git clone https://github.com/yourusername/eventmate.git3. Add event to calendar

cd eventmate

### Check-in Process

# Install backend dependencies

cd backend1. Staff scans attendee's QR code

npm install2. System verifies HMAC signature

3. Attendee is marked as checked in

# Configure environment

cp .env.example .env### Admin Features

# Edit .env with your configuration

- View all attendees and their check-in status

# Start backend server- Export attendee data as CSV

npm run dev- View event statistics

```

## Security Features

#### Frontend Setup

- QR codes signed with HMAC-SHA256

```bash- Check-in verification ensures data integrity

# Navigate to frontend directory- Session storage for admin credentials

cd ../frontend

## Future Enhancements

# Install frontend dependencies

npm install- **Real AI Integration**: Replace rule-based recommendations with ML model

- **Mobile App**: Native mobile experience with push notifications

# Start development server- **Offline Support**: Enable check-in without internet connection

npm start- **Advanced Analytics**: Detailed insights for event organizers

```

## Contribution

### Environment Configuration

This project was created as a hackathon prototype. Feel free to fork and extend!

Create a `.env` file in the backend directory with:

## License

```

PORT=5000This project is licensed under the MIT License - see the LICENSE file for details.

HMAC_SECRET=your_secure_hmac_secret_for_qr_code_signing

GEMINI_API_KEY=your_gemini_api_key_here---

NODE_ENV=development

```Created with ❤️ for the SAP Hackathon

## 🔧 API Integration

### SIT Concierge Chatbot

The intelligent chatbot uses Google's Gemini API for natural language understanding and contextual responses:

```javascript
// Example API usage
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: "When is the next keynote?",
    attendeeId: "att_12345"
  })
});
```

### Personalized Recommendations

```javascript
// Get personalized session recommendations
const recommendations = await fetch(`/api/attendee/${attendeeId}/recommendations`);
```

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend component tests
cd frontend
npm run test:components

# Run frontend integration tests
npm run test:integration
```

## 🔐 Security Features

- **HMAC Signatures**: All QR codes are cryptographically signed to prevent tampering
- **Environment Variables**: Sensitive information stored in environment, not in code
- **Input Validation**: All user inputs validated server-side
- **Security Headers**: Proper HTTP headers to prevent common web vulnerabilities

## 🏆 Use Cases

1. **Event Registration & Check-in**
   - Streamlined registration process
   - Secure and quick check-in with QR codes
   
2. **Event Navigation & Information**
   - AI-powered chatbot assistant
   - Personalized session recommendations
   
3. **Networking & Community Building**
   - Connect attendees with similar interests
   - Facilitate meaningful professional connections

## 🛣️ Roadmap

- [ ] **Q4 2025**: Mobile app with offline support
- [ ] **Q1 2026**: Advanced analytics dashboard
- [ ] **Q2 2026**: Integration with SAP SuccessFactors for enterprise events
- [ ] **Q3 2026**: Multi-language support with AI translation

## 🤝 Contributing

This is a proprietary project. Please contact the repository administrators for contribution guidelines.

## � Vercel Deployment Guide

EventMate is now configured for seamless deployment on Vercel!

### Quick Deploy Steps:

1. **Fork this repository** on GitHub
2. **Go to [vercel.com](https://vercel.com)** and sign up/login
3. **Click "Import Project"** and connect your GitHub repository
4. **Vercel will automatically detect** the React app and serverless functions
5. **Deploy!** Your app will be live at `https://your-project-name.vercel.app`

### Project Structure for Vercel:

- **Frontend**: React app in the root directory
- **API**: Serverless functions in the `/api` directory
- **Database**: JSON file-based (easily upgradeable to any database)
- **Configuration**: `vercel.json` handles routing and builds

### Environment Variables (Optional):

Set these in your Vercel dashboard if needed:
- `REACT_APP_API_URL`: Defaults to `/api` for relative URLs

### Features Ready for Production:

✅ **Serverless API** - No server management needed  
✅ **Global CDN** - Fast loading worldwide  
✅ **Automatic HTTPS** - SSL certificates included  
✅ **Custom Domain** - Easy domain setup  
✅ **Analytics** - Built-in performance monitoring  

---

## �📄 License

This project is proprietary and not licensed for public use without explicit permission.
=======
A complete hackathon solution that enhances participant experience at SAP events through **intelligent registration**, **personalized session recommendations**, **AI-powered assistance**, and **secure check-in**.
>>>>>>> 4177df2270306498d53c4796d6c5d85efeba2ec2

## 🚀 Vercel Deployment Guide

EventMate is now configured for seamless deployment on Vercel!

### Quick Deploy Steps:

1. **Fork this repository** on GitHub
2. **Go to [vercel.com](https://vercel.com)** and sign up/login
3. **Click "Import Project"** and connect your GitHub repository
4. **Vercel will automatically detect** the React app and serverless functions
5. **Deploy!** Your app will be live at `https://your-project-name.vercel.app`

### Project Structure for Vercel:

- **Frontend**: React app in the root directory
- **API**: Serverless functions in the `/api` directory
- **Database**: JSON file-based (easily upgradeable to any database)
- **Configuration**: `vercel.json` handles routing and builds

### Environment Variables (Optional):

Set these in your Vercel dashboard if needed:
- `REACT_APP_API_URL`: Defaults to `/api` for relative URLs

### Features Ready for Production:

✅ **Serverless API** - No server management needed  
✅ **Global CDN** - Fast loading worldwide  
✅ **Automatic HTTPS** - SSL certificates included  
✅ **Custom Domain** - Easy domain setup  
✅ **Analytics** - Built-in performance monitoring  

---

## 🏗️ Architecture

EventMate follows a **modular client–server architecture**:

- **Frontend Layer:** React components with responsive UI/UX design
- **Backend Layer:** Vercel Serverless Functions (REST APIs, business logic, QR generation)
- **AI Layer:** Gemini LLM for chatbot + recommendations
- **Data Layer:** JSON mock DB → migration-ready to SAP HANA / Firebase

---

## 🛠️ Technical Stack

### Frontend
- **Framework:** React.js
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

## ✨ Key Features

- ✅ **Intelligent Registration** - Multi-step form with real-time validation
- ✅ **AI-Powered Concierge** - SIT Chatbot using Google's Gemini LLM
- ✅ **Personalized Agenda Builder** - Smart recommendations based on interests
- ✅ **Secure Check-in** - HMAC-signed QR codes for tamper-proof access
- ✅ **Smart Networking Assistant** - AI-suggested attendee matches
- ✅ **Calendar Integration** - Export to Google Calendar and ICS
- ✅ **Admin Dashboard** - Real-time analytics and attendee management
- ✅ **Mobile-Responsive Design** - Optimized for all devices

---

## � Application Screens

| Landing Page | Registration | Dashboard |
|:---:|:---:|:---:|
| ![Landing](./docs/screenshots/landing.png) | ![Registration](./docs/screenshots/registration.png) | ![Dashboard](./docs/screenshots/dashboard.png) |

| SIT Concierge | Check-in Portal | Admin View |
|:---:|:---:|:---:|
| ![Chatbot](./docs/screenshots/chatbot.png) | ![Checkin](./docs/screenshots/checkin.png) | ![Admin](./docs/screenshots/admin.png) |

---

## � Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
git clone https://github.com/yourusername/eventmate.git
cd eventmate
npm install
```

### Running Locally
```bash
npm start
```
Open your browser to `http://localhost:3000`

---

## � Security Features

- **HMAC Signatures** - All QR codes are cryptographically signed
- **Environment Variables** - Sensitive data never stored in code
- **Input Validation** - Strong server-side validation for all data
- **Security Headers** - Proper HTTP headers to prevent vulnerabilities

---

## 🛣️ Roadmap

- [ ] **Q4 2025**: Mobile app with offline support
- [ ] **Q1 2026**: Advanced analytics dashboard
- [ ] **Q2 2026**: Integration with SAP SuccessFactors
- [ ] **Q3 2026**: Multi-language support with AI translation

---

## 📄 License

This project is proprietary and not licensed for public use without explicit permission.

---

<div align="center">
  <p>Built with ❤️ for enhancing SAP event experiences</p>
  <p>© 2025 EventMate</p>
</div>
