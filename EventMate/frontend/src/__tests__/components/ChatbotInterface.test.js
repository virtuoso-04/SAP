import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatbotInterface } from '../../components/chat';

// Mock Framer Motion
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    __esModule: true,
    ...actual,
    motion: {
      div: ({ children, ...props }) => <div {...props}>{children}</div>,
      button: ({ children, ...props }) => <button {...props}>{children}</button>,
      form: ({ children, ...props }) => <form {...props}>{children}</form>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});

describe('ChatbotInterface', () => {
  const mockInitialMessages = [
    {
      id: 1,
      text: "Hello! I'm your SIT Concierge. How can I help you navigate the hackathon today?",
      isUser: false
    }
  ];
  
  const mockSuggestions = [
    "Where is lunch served?", 
    "Sessions about AI", 
    "Who should I meet?",
    "Next keynote time"
  ];
  
  const mockOnSendMessage = jest.fn();
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders with initial messages', () => {
    render(
      <ChatbotInterface
        initialMessages={mockInitialMessages}
        onSendMessage={mockOnSendMessage}
        isLoading={false}
        suggestions={mockSuggestions}
      />
    );
    
    // Check if title is displayed
    expect(screen.getByText('SIT Concierge')).toBeInTheDocument();
    
    // Check if initial message is displayed
    expect(screen.getByText("Hello! I'm your SIT Concierge. How can I help you navigate the hackathon today?")).toBeInTheDocument();
    
    // Check if input field is displayed
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
  });
  
  test('displays suggestions', () => {
    render(
      <ChatbotInterface
        initialMessages={mockInitialMessages}
        onSendMessage={mockOnSendMessage}
        isLoading={false}
        suggestions={mockSuggestions}
      />
    );
    
    // Check if suggestions are displayed
    mockSuggestions.forEach(suggestion => {
      expect(screen.getByText(suggestion)).toBeInTheDocument();
    });
  });
  
  test('handles sending a message', async () => {
    render(
      <ChatbotInterface
        initialMessages={mockInitialMessages}
        onSendMessage={mockOnSendMessage}
        isLoading={false}
        suggestions={mockSuggestions}
      />
    );
    
    // Get input field and submit button
    const inputField = screen.getByPlaceholderText('Type your message...');
    const form = inputField.closest('form');
    
    // Type a message
    fireEvent.change(inputField, { target: { value: 'Where is the main hall?' } });
    
    // Submit the form
    fireEvent.submit(form);
    
    // Check if onSendMessage was called
    expect(mockOnSendMessage).toHaveBeenCalledTimes(1);
    expect(mockOnSendMessage).toHaveBeenCalledWith('Where is the main hall?');
    
    // Check if input is cleared after submission
    await waitFor(() => {
      expect(inputField.value).toBe('');
    });
  });
  
  test('clicking a suggestion fills the input field', () => {
    render(
      <ChatbotInterface
        initialMessages={mockInitialMessages}
        onSendMessage={mockOnSendMessage}
        isLoading={false}
        suggestions={mockSuggestions}
      />
    );
    
    // Click on a suggestion
    fireEvent.click(screen.getByText('Sessions about AI'));
    
    // Check if input field is filled with suggestion text
    const inputField = screen.getByPlaceholderText('Type your message...');
    expect(inputField.value).toBe('Sessions about AI');
  });
  
  test('shows loading state', () => {
    render(
      <ChatbotInterface
        initialMessages={mockInitialMessages}
        onSendMessage={mockOnSendMessage}
        isLoading={true}
        suggestions={mockSuggestions}
      />
    );
    
    // Check if loading indicator is displayed
    // This would depend on how you've implemented the loading state
    // For example, if you're using a specific data-testid for the loading indicator
    const loadingIndicator = document.querySelector('.w-2.h-2.rounded-full.bg-gray-400');
    expect(loadingIndicator).toBeInTheDocument();
  });
  
  test('toggles expansion state when header is clicked', () => {
    render(
      <ChatbotInterface
        initialMessages={mockInitialMessages}
        onSendMessage={mockOnSendMessage}
        isLoading={false}
        suggestions={mockSuggestions}
      />
    );
    
    // Get header element
    const header = screen.getByText('SIT Concierge').closest('div');
    
    // Initial state should be expanded (input field visible)
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    
    // Click header to collapse
    fireEvent.click(header);
    
    // Input field should not be visible after collapse
    expect(screen.queryByPlaceholderText('Type your message...')).not.toBeInTheDocument();
    
    // Click header again to expand
    fireEvent.click(header);
    
    // Input field should be visible again
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
  });
  
  test('renders messages with session recommendations', () => {
    const messagesWithRecommendations = [
      ...mockInitialMessages,
      {
        id: 2,
        text: 'Here are some AI sessions you might be interested in:',
        isUser: false,
        sessions: [
          {
            title: 'AI Workshop',
            time: '10:00 AM',
            location: 'Room A'
          },
          {
            title: 'Machine Learning 101',
            time: '2:00 PM',
            location: 'Room B'
          }
        ]
      }
    ];
    
    render(
      <ChatbotInterface
        initialMessages={messagesWithRecommendations}
        onSendMessage={mockOnSendMessage}
        isLoading={false}
        suggestions={mockSuggestions}
      />
    );
    
    // Check if message text is displayed
    expect(screen.getByText('Here are some AI sessions you might be interested in:')).toBeInTheDocument();
    
    // Check if session recommendations are displayed
    expect(screen.getByText('AI Workshop')).toBeInTheDocument();
    expect(screen.getByText('Machine Learning 101')).toBeInTheDocument();
  });
});