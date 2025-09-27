# NetworkingAssistant Component

## Overview
The NetworkingAssistant is an AI-powered component that facilitates networking between event attendees. It provides personalized connection suggestions based on user interests, session attendance, and company/industry information.

## Features

- **AI-Powered Suggestions**: Intelligent matching algorithm that connects attendees with similar interests or complementary skills
- **Multiple Suggestion Modes**: Filter suggestions by interests, session attendance, or company/industry
- **Search and Filter**: Find specific professionals based on name, company, role, or interests
- **Connection Management**: Send and manage connection requests within the platform
- **Match Percentage**: Visual indicator of how well each suggestion matches with your profile
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Component Structure

```
NetworkingAssistant/
├── NetworkingAssistant.jsx     # Main component implementation
├── NetworkingAssistant.scss    # Component-specific styles
└── index.js                    # Export file
```

## Usage

```jsx
import NetworkingAssistant from '../components/NetworkingAssistant';

const MyPage = () => {
  return (
    <div className="my-container">
      <NetworkingAssistant />
    </div>
  );
};
```

## Dependencies

- `@ui5/webcomponents-react` - UI components following the SAP Fiori design language
- `UserContext` - For accessing the current user's profile information
- `networkingService` - API service for networking functionality
- `networkingMocks` - Mock data for development and demo purposes

## API Services

The NetworkingAssistant component uses the following API endpoints:

- `GET /api/networking/suggestions` - Fetches personalized connection suggestions
- `POST /api/networking/requests` - Sends a connection request
- `GET /api/networking/requests` - Retrieves pending connection requests
- `PUT /api/networking/requests/:id` - Responds to a connection request (accept/reject)

## Algorithms

The component uses several matching algorithms to determine connection recommendations:

1. **Interest-based matching**: Analyzes interests listed in user profiles to find common areas
2. **Session-based matching**: Recommends connections based on similar session attendance patterns
3. **Industry/Company matching**: Suggests connections from similar companies or industries

The final match percentage is calculated using a weighted combination of these factors.

## Future Enhancements

- Integration with calendar for scheduling 1:1 meetings
- Real-time chat functionality between connected users
- Advanced filters for more granular matching preferences
- LinkedIn/other social media integration for expanding network
- Badge scanning feature for in-person networking at events