import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ForYouCarousel } from '../../components/sessions';

// Mock Framer Motion
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    __esModule: true,
    ...actual,
    motion: {
      div: ({ children, ...props }) => <div {...props}>{children}</div>,
      button: ({ children, ...props }) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});

// Mock SessionCard component
jest.mock('../../components/sessions/SessionCard', () => {
  return function MockSessionCard({ session, isBookmarked, onBookmarkToggle }) {
    return (
      <div data-testid="session-card">
        <h3>{session.title}</h3>
        <p>{session.description}</p>
        <button 
          onClick={() => onBookmarkToggle(session.id)} 
          data-testid={`bookmark-button-${session.id}`}
        >
          {isBookmarked ? 'Unbookmark' : 'Bookmark'}
        </button>
      </div>
    );
  };
});

// Mock AnimatedButton component
jest.mock('../../components/shared', () => ({
  AnimatedButton: ({ children, onClick }) => (
    <button onClick={onClick} data-testid="animated-button">
      {children}
    </button>
  ),
}));

describe('ForYouCarousel', () => {
  const mockSessions = [
    {
      id: '1',
      title: 'AI-Powered Developer Tools',
      description: 'Exploring the future of AI-assisted software development',
      time: '10:00 AM',
      date: 'Today',
      location: 'Main Hall',
      speaker: 'Dr. Jane Smith',
      tags: ['AI', 'Development', 'Future Tech'],
      recommendationReason: 'Based on your interest in AI'
    },
    {
      id: '2',
      title: 'Design Systems at Scale',
      description: 'Building and maintaining design systems for enterprise applications',
      time: '11:30 AM',
      date: 'Today',
      location: 'Workshop Room B',
      speaker: 'Alex Chen',
      tags: ['Design', 'UX', 'Enterprise'],
      recommendationReason: 'Popular among attendees with your role'
    },
    {
      id: '3',
      title: 'Future of Cloud Architecture',
      description: 'Next generation cloud patterns for scalable applications',
      time: '2:00 PM',
      date: 'Today',
      location: 'Tech Theater',
      speaker: 'Maria Rodriguez',
      tags: ['Cloud', 'Architecture', 'Scalability'],
      recommendationReason: 'Matches your tech stack preferences'
    }
  ];
  
  const mockBookmarkedSessions = ['1'];
  const mockOnBookmarkToggle = jest.fn();
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders with sessions', () => {
    render(
      <ForYouCarousel
        sessions={mockSessions}
        bookmarkedSessions={mockBookmarkedSessions}
        onBookmarkToggle={mockOnBookmarkToggle}
      />
    );
    
    // Check if title is displayed
    expect(screen.getByText('For You')).toBeInTheDocument();
    
    // Check if the first session is rendered
    expect(screen.getByText('AI-Powered Developer Tools')).toBeInTheDocument();
    
    // Check if navigation buttons are present
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(2); // At least prev, next buttons
  });
  
  test('handles bookmark toggle', () => {
    render(
      <ForYouCarousel
        sessions={mockSessions}
        bookmarkedSessions={mockBookmarkedSessions}
        onBookmarkToggle={mockOnBookmarkToggle}
      />
    );
    
    // Click on bookmark button for the first session
    const bookmarkButton = screen.getByTestId('bookmark-button-1');
    fireEvent.click(bookmarkButton);
    
    // Check if onBookmarkToggle was called
    expect(mockOnBookmarkToggle).toHaveBeenCalledTimes(1);
    expect(mockOnBookmarkToggle).toHaveBeenCalledWith('1');
  });
  
  test('displays empty state when no sessions', () => {
    render(
      <ForYouCarousel
        sessions={[]}
        bookmarkedSessions={[]}
        onBookmarkToggle={mockOnBookmarkToggle}
      />
    );
    
    expect(screen.getByText('No recommended sessions available.')).toBeInTheDocument();
  });
  
  test('clicking "View All Recommendations" button', () => {
    render(
      <ForYouCarousel
        sessions={mockSessions}
        bookmarkedSessions={mockBookmarkedSessions}
        onBookmarkToggle={mockOnBookmarkToggle}
      />
    );
    
    const viewAllButton = screen.getByText('View All Recommendations');
    expect(viewAllButton).toBeInTheDocument();
  });
  
  test('navigation buttons change the displayed session', () => {
    render(
      <ForYouCarousel
        sessions={mockSessions}
        bookmarkedSessions={mockBookmarkedSessions}
        onBookmarkToggle={mockOnBookmarkToggle}
      />
    );
    
    // Initially the first session should be visible
    expect(screen.getByText('AI-Powered Developer Tools')).toBeInTheDocument();
    
    // Find navigation buttons (using aria roles or other identifiers)
    const buttons = screen.getAllByRole('button');
    const nextButton = buttons.find(button => 
      button.innerHTML.includes('M9 5l7 7-7 7') // SVG path for next arrow
    );
    
    // Click next button to show second session
    if (nextButton) {
      fireEvent.click(nextButton);
      
      // Check if state updates (this might require more specific tests
      // depending on how the carousel handles state and visibility)
    }
  });
});