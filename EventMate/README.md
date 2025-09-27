# EventMate — Intelligent Participant Experience (IPX) Hub

A complete hackathon prototype for the SAP-themed track that enhances the participant experience at SAP events through intelligent registration, personalized session recommendations, and seamless check-in.

![EventMate Banner](./docs/banner.png)

## Overview

EventMate is an intelligent event management platform designed specifically for SAP events. It provides a seamless end-to-end experience for attendees, from registration to check-in and session management, with personalized recommendations based on attendee interests.

### Key Features

- **Dynamic Registration System**: Multi-step registration form with validation
- **QR Code Check-in**: Secure QR code generation with HMAC signatures
- **Personalized Recommendations**: Rule-based "mock AI" recommendation engine
- **Calendar Integration**: Export sessions to iCalendar, Google Calendar, or Outlook
- **Staff Tools**: Check-in portal and admin dashboard

## Technical Stack

- **Frontend**: React (Create React App), React Router, Tailwind CSS
- **Backend**: Express.js
- **Database**: File-based mock DB (`db.json`)
- **Authentication**: HMAC-SHA256 signature for QR codes
- **Utilities**: Calendar integration (ICS, Google Calendar, Outlook)
- **Testing**: Jest for API endpoints

## Screenshots

| Landing Page | Registration | Dashboard |
|:---:|:---:|:---:|
| ![Landing](./docs/screenshots/landing.png) | ![Registration](./docs/screenshots/registration.png) | ![Dashboard](./docs/screenshots/dashboard.png) |

| Session Detail | Check-in | Admin View |
|:---:|:---:|:---:|
| ![Session](./docs/screenshots/session.png) | ![Checkin](./docs/screenshots/checkin.png) | ![Admin](./docs/screenshots/admin.png) |

## Architecture

![Architecture Diagram](./docs/architecture.png)

The application follows a client-server architecture:

1. **Frontend (React)**: User interface with components and pages
2. **Backend (Express.js)**: RESTful API endpoints
3. **Mock Database**: JSON file-based data store
4. **Service Layer**: Business logic, recommendation engine, QR code generation

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/eventmate.git
cd eventmate
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server:

```bash
cd backend
npm start
```

2. Start the frontend development server:

```bash
cd frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage Guide

### Demo Credentials

- **Staff Check-in Portal**: Access code `SAP2025`
- **Admin Dashboard**: Access code `ADMIN2025`

### Registration Flow

1. Complete the registration form
2. Receive QR code for check-in
3. Add event to calendar

### Check-in Process

1. Staff scans attendee's QR code
2. System verifies HMAC signature
3. Attendee is marked as checked in

### Admin Features

- View all attendees and their check-in status
- Export attendee data as CSV
- View event statistics

## Security Features

- QR codes signed with HMAC-SHA256
- Check-in verification ensures data integrity
- Session storage for admin credentials

## Future Enhancements

- **Real AI Integration**: Replace rule-based recommendations with ML model
- **Mobile App**: Native mobile experience with push notifications
- **Offline Support**: Enable check-in without internet connection
- **Advanced Analytics**: Detailed insights for event organizers

## Contribution

This project was created as a hackathon prototype. Feel free to fork and extend!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Created with ❤️ for the SAP Hackathon