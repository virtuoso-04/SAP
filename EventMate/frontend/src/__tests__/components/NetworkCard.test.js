import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NetworkCard } from '../../components/networking';

// Mock Framer Motion to avoid animation-related issues in tests
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

// Mock the shared components
jest.mock('../../components/shared', () => ({
  AnimatedButton: ({ children, onClick }) => (
    <button onClick={onClick} data-testid="animated-button">
      {children}
    </button>
  ),
}));

describe('NetworkCard', () => {
  const mockAttendee = {
    id: '123',
    name: 'John Doe',
    title: 'Software Engineer',
    company: 'Tech Corp',
    skills: ['React', 'JavaScript', 'Node.js'],
    profileImage: null,
  };
  
  const mockCommonInterests = ['AI', 'Web Development', 'UX Design'];
  const mockCommonSessions = [
    { id: '1', title: 'AI Workshop', time: '10:00 AM', location: 'Room A' },
    { id: '2', title: 'React Patterns', time: '2:00 PM', location: 'Room B' },
  ];
  
  const mockConnect = jest.fn();
  const mockViewProfile = jest.fn();
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders with attendee data', () => {
    render(
      <NetworkCard
        attendee={mockAttendee}
        matchScore={85}
        commonInterests={mockCommonInterests}
        commonSessions={mockCommonSessions}
        onConnect={mockConnect}
        onViewProfile={mockViewProfile}
      />
    );
    
    // Check if basic attendee information is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('85% Match')).toBeInTheDocument();
    
    // Check if skills are displayed
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    
    // Check if common interests are displayed
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('UX Design')).toBeInTheDocument();
    
    // Check if the correct common sessions count is displayed
    expect(screen.getByText('Both attending 2 sessions')).toBeInTheDocument();
  });
  
  test('calls onConnect when Connect button is clicked', () => {
    render(
      <NetworkCard
        attendee={mockAttendee}
        matchScore={85}
        commonInterests={mockCommonInterests}
        commonSessions={mockCommonSessions}
        onConnect={mockConnect}
        onViewProfile={mockViewProfile}
      />
    );
    
    const buttons = screen.getAllByTestId('animated-button');
    const connectButton = buttons.find(button => button.textContent === 'Connect');
    
    fireEvent.click(connectButton);
    
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledWith('123');
  });
  
  test('calls onViewProfile when View Profile button is clicked', () => {
    render(
      <NetworkCard
        attendee={mockAttendee}
        matchScore={85}
        commonInterests={mockCommonInterests}
        commonSessions={mockCommonSessions}
        onConnect={mockConnect}
        onViewProfile={mockViewProfile}
      />
    );
    
    const buttons = screen.getAllByTestId('animated-button');
    const viewProfileButton = buttons.find(button => button.textContent === 'View Profile');
    
    fireEvent.click(viewProfileButton);
    
    expect(mockViewProfile).toHaveBeenCalledTimes(1);
    expect(mockViewProfile).toHaveBeenCalledWith('123');
  });
  
  test('shows recommendation reason based on common data', () => {
    render(
      <NetworkCard
        attendee={mockAttendee}
        matchScore={85}
        commonInterests={mockCommonInterests}
        commonSessions={mockCommonSessions}
        onConnect={mockConnect}
        onViewProfile={mockViewProfile}
      />
    );
    
    expect(screen.getByText('Common interests & sessions')).toBeInTheDocument();
  });
  
  test('renders with only common interests', () => {
    render(
      <NetworkCard
        attendee={mockAttendee}
        matchScore={85}
        commonInterests={mockCommonInterests}
        commonSessions={[]}
        onConnect={mockConnect}
        onViewProfile={mockViewProfile}
      />
    );
    
    expect(screen.getByText('Similar interests')).toBeInTheDocument();
    expect(screen.queryByText('Both attending')).not.toBeInTheDocument();
  });
  
  test('renders with only common sessions', () => {
    render(
      <NetworkCard
        attendee={mockAttendee}
        matchScore={85}
        commonInterests={[]}
        commonSessions={mockCommonSessions}
        onConnect={mockConnect}
        onViewProfile={mockViewProfile}
      />
    );
    
    expect(screen.getByText('Attending same sessions')).toBeInTheDocument();
    expect(screen.queryByText('Common Interests')).not.toBeInTheDocument();
  });
  
  test('renders with no common interests or sessions', () => {
    render(
      <NetworkCard
        attendee={mockAttendee}
        matchScore={85}
        commonInterests={[]}
        commonSessions={[]}
        onConnect={mockConnect}
        onViewProfile={mockViewProfile}
      />
    );
    
    expect(screen.getByText('Recommended for you')).toBeInTheDocument();
    expect(screen.queryByText('Common Interests')).not.toBeInTheDocument();
    expect(screen.queryByText('Both attending')).not.toBeInTheDocument();
  });
});