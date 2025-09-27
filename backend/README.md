# EventMate Backend

Backend API for EventMate - Intelligent Participant Experience for events and hackathons.

## Features

- **Authentication**: Firebase Authentication integration for email/password and Google Sign-In
- **Event Management**: Session and attendee registration APIs
- **SIT Concierge Chatbot**: LLM-powered chatbot with fallback to rule-based responses
- **AI-Powered Agenda Builder**: Personalized session recommendations based on user interests
- **Smart Networking Assistant**: Suggest attendees to connect with based on matching interests
- **Calendar Integration**: Generate ICS files and Google Calendar links for sessions
- **QR & Check-in**: Secure QR code generation with HMAC signatures for attendee verification
- **Admin Dashboard**: Export attendee lists and event statistics

## API Endpoints

### Sessions
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get a specific session by ID
- `GET /api/sessions/filter/today` - Get sessions happening today
- `GET /api/sessions/filter/popular` - Get most popular sessions
- `GET /api/sessions/search/query?q=search_term` - Search sessions by query

### Attendees
- `POST /api/attendee/register` - Register a new attendee
- `GET /api/attendee/:id` - Get attendee by ID
- `GET /api/attendee/:id/qr` - Generate QR code for an attendee
- `GET /api/attendee/:id/recommendations` - Get personalized session recommendations
- `GET /api/attendee/:id/networking` - Get networking suggestions
- `POST /api/attendee/:id/bookmark` - Toggle session bookmark

### Calendar
- `GET /api/sessions/:id/calendar/ics` - Generate ICS file for a session
- `GET /api/sessions/:id/calendar/google` - Generate Google Calendar link
- `GET /api/attendee/:id/calendar/ics` - Generate ICS for all bookmarked sessions

### Check-in
- `POST /api/checkin` - Check in an attendee with QR or registration ID
- `GET /api/checkin/status/:id` - Check if an attendee is checked in

### Chat
- `POST /api/chat` - Process a chat message and get a response

### Admin
- `GET /api/admin/attendees` - Get all attendees (with optional filters)
- `GET /api/admin/stats` - Get event statistics

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in the required values
4. Start the development server: `npm run dev`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
HMAC_SECRET=your_secure_hmac_secret_for_qr_code_signing
GEMINI_API_KEY=your_gemini_api_key_here
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/service-account.json
```

## LLM Integration

The SIT Concierge chatbot can use Google's Gemini API if an API key is provided. If not, it falls back to a rule-based response system that can still handle common queries about sessions, speakers, venues, and FAQs.

To enable LLM integration:
1. Obtain a Gemini API key
2. Add it to your `.env` file as `GEMINI_API_KEY`

## Database

This prototype uses a simple JSON file-based database (`db.json`). For production, you should migrate to a proper database like Firestore, SQLite, or SAP HANA.

## Security Notes

- The QR code generation uses HMAC signatures to ensure that QR codes cannot be tampered with
- Never commit real API keys to the repository
- Store the HMAC secret in environment variables, not in the code

## Testing

Run unit tests:
```
npm test
```

## Production Deployment

1. Build the app: `npm run build`
2. Start the production server: `npm start`

## License

This project is proprietary and not licensed for public use.