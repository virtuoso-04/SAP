import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ChatMessage component for rendering individual chat messages
 */
const ChatMessage = ({ message, isUser }) => {
  return (
    <motion.div
      className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-sap-blue flex items-center justify-center text-white text-sm mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        </div>
      )}
      
      <div
        className={`px-4 py-3 rounded-apple-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${
          isUser
            ? 'bg-sap-blue text-white rounded-tr-none'
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
        }`}
      >
        {message.text}
        
        {/* Session recommendations */}
        {message.sessions && message.sessions.length > 0 && (
          <div className="mt-3 border-t border-gray-200 pt-3">
            <p className="text-sm font-medium mb-2">
              {isUser ? 'Recommended Sessions:' : 'You might be interested in:'}
            </p>
            {message.sessions.map((session, idx) => (
              <div 
                key={idx} 
                className={`p-2 mb-2 rounded-apple-sm text-sm ${
                  isUser 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-white hover:bg-gray-50 shadow-sm'
                }`}
              >
                <p className={`font-medium ${isUser ? 'text-white' : 'text-gray-800'}`}>
                  {session.title}
                </p>
                <p className={`text-xs ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                  {session.time} • {session.location}
                </p>
              </div>
            ))}
          </div>
        )}
        
        {/* People recommendations */}
        {message.people && message.people.length > 0 && (
          <div className="mt-3 border-t border-gray-200 pt-3">
            <p className="text-sm font-medium mb-2">
              {isUser ? 'People you might want to meet:' : 'Connect with:'}
            </p>
            {message.people.map((person, idx) => (
              <div 
                key={idx} 
                className={`p-2 mb-2 rounded-apple-sm text-sm ${
                  isUser 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-white hover:bg-gray-50 shadow-sm'
                }`}
              >
                <p className={`font-medium ${isUser ? 'text-white' : 'text-gray-800'}`}>
                  {person.name}
                </p>
                <p className={`text-xs ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                  {person.title} • {person.company}
                </p>
              </div>
            ))}
          </div>
        )}
        
        {/* Links or buttons */}
        {message.links && message.links.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.links.map((link, idx) => (
              <a 
                key={idx}
                href={link.url}
                className={`block text-sm px-3 py-2 rounded-apple-sm ${
                  isUser 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-white text-sap-blue hover:bg-gray-50'
                }`}
              >
                {link.text} →
              </a>
            ))}
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </motion.div>
  );
};

/**
 * ChatSuggestion component for quick reply suggestions
 */
const ChatSuggestion = ({ text, onClick }) => {
  return (
    <motion.button
      className="bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm py-2 px-4 rounded-full mr-2 mb-2 whitespace-nowrap"
      onClick={() => onClick(text)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {text}
    </motion.button>
  );
};

/**
 * Loading indicator for chat messages
 */
const LoadingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 px-4 py-2 rounded-apple-lg bg-gray-100 text-gray-800 w-16">
      <motion.div
        className="w-2 h-2 rounded-full bg-gray-400"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0 }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-gray-400"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 1.5, delay: 0.2, repeat: Infinity, repeatDelay: 0 }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-gray-400"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 1.5, delay: 0.4, repeat: Infinity, repeatDelay: 0 }}
      />
    </div>
  );
};

/**
 * ChatbotInterface component for the SIT Concierge Chatbot
 * @param {Object} props - Component props
 * @param {Array} props.initialMessages - Initial messages to display
 * @param {Function} props.onSendMessage - Function to call when sending a message
 * @param {boolean} props.isLoading - Whether a response is being loaded
 * @param {Array} props.suggestions - Array of quick reply suggestions
 */
const ChatbotInterface = ({
  initialMessages = [],
  onSendMessage,
  isLoading = false,
  suggestions = []
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);
  
  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    
    // Add user message to chat
    const userMessage = { id: Date.now(), text: inputValue, isUser: true };
    setMessages([...messages, userMessage]);
    
    // Call parent's onSendMessage handler
    if (onSendMessage) {
      onSendMessage(inputValue);
    }
    
    // Clear input
    setInputValue('');
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (text) => {
    setInputValue(text);
    inputRef.current?.focus();
  };
  
  // Toggle chat expansion
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Animation variants
  const chatVariants = {
    expanded: {
      height: 'calc(100% - 2rem)',
      opacity: 1
    },
    collapsed: {
      height: '3.5rem',
      opacity: 0.9
    }
  };
  
  const headerVariants = {
    expanded: {
      borderRadius: '1rem 1rem 0 0'
    },
    collapsed: {
      borderRadius: '1rem'
    }
  };
  
  return (
    <motion.div
      className="chatbot-interface fixed bottom-4 right-4 w-full max-w-md bg-white shadow-lg rounded-apple overflow-hidden border border-gray-100 z-10"
      initial={{ y: 100, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        height: isExpanded ? 'calc(100% - 2rem)' : '3.5rem',
        maxHeight: isExpanded ? '36rem' : '3.5rem'
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ maxHeight: isExpanded ? '36rem' : '3.5rem' }}
    >
      {/* Chat header */}
      <motion.div
        className="flex items-center justify-between bg-sap-blue text-white p-4 cursor-pointer"
        variants={headerVariants}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        onClick={toggleExpansion}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sap-blue" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold">SIT Concierge</h3>
            <p className="text-xs text-blue-100">Ask me about sessions, rooms, or people</p>
          </div>
        </div>
        <motion.button
          className="text-white flex-shrink-0"
          animate={{ rotate: isExpanded ? 0 : 180 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </motion.button>
      </motion.div>
      
      {/* Chat messages container */}
      {isExpanded && (
        <motion.div
          className="p-4 overflow-y-auto flex-1"
          ref={chatContainerRef}
          style={{ height: 'calc(100% - 9rem)' }} // Adjust based on header + input heights
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Welcome message if no messages */}
          {messages.length === 0 && (
            <motion.div
              className="text-center py-8 px-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sap-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">Welcome to SIT Concierge!</h3>
              <p className="text-gray-500 mb-6">
                I can help you find sessions, navigate the venue, or connect with other attendees. How can I assist you today?
              </p>
            </motion.div>
          )}
          
          {/* Chat messages */}
          {messages.map(message => (
            <ChatMessage
              key={message.id}
              message={message}
              isUser={message.isUser}
            />
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex mb-4">
              <LoadingIndicator />
            </div>
          )}
          
          {/* Element to scroll to */}
          <div ref={messagesEndRef} />
        </motion.div>
      )}
      
      {/* Quick suggestions */}
      {isExpanded && suggestions.length > 0 && (
        <motion.div 
          className="px-4 py-2 border-t border-gray-100 overflow-x-auto flex"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {suggestions.map((suggestion, index) => (
            <ChatSuggestion
              key={index}
              text={suggestion}
              onClick={handleSuggestionClick}
            />
          ))}
        </motion.div>
      )}
      
      {/* Input form */}
      {isExpanded && (
        <motion.form
          className="border-t border-gray-100 p-4 flex"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-apple-sm px-4 py-2 focus:outline-none focus:border-sap-blue focus:ring-1 focus:ring-sap-blue"
            placeholder="Type your message..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            ref={inputRef}
          />
          <motion.button
            type="submit"
            className="ml-2 p-2 bg-sap-blue text-white rounded-apple-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={inputValue.trim() === ''}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </motion.button>
        </motion.form>
      )}
    </motion.div>
  );
};

export default ChatbotInterface;