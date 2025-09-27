import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Sample FAQ responses for the mock chatbot
const CHATBOT_RESPONSES = {
  default: "Hello! I'm SIT Concierge, your virtual assistant for this event. How can I help you today?",
  greeting: "Hello there! I'm SIT Concierge, your virtual assistant. You can ask me questions about the event schedule, venue facilities, or general help.",
  help: "I can help you with: event information, session details, venue navigation, food options, or connecting with support staff. What do you need assistance with?",
  schedule: "The event runs from October 1-2, 2025. Sessions start at 9:00 AM and end at 5:30 PM each day. You can check your personalized recommendations on your dashboard.",
  location: "The event is being held at the Innovation Center, 123 Tech Boulevard. You can find detailed directions and a map in the event app under 'Venue'.",
  wifi: "Free Wi-Fi is available throughout the venue. Network: SIT-Event, Password: VIBE2025IPX",
  food: "Meals and refreshments are provided throughout the day. Breakfast is served 8:00-9:00 AM, lunch 12:30-1:30 PM, and there are coffee breaks at 10:30 AM and 3:30 PM.",
  contact: "Need immediate assistance? Please visit the help desk in the main lobby, or contact our support team at support@eventmate.example.com or call +1-555-123-4567.",
  registration: "Your registration QR code is available on your dashboard. If you're having trouble accessing it, please visit the registration desk with your ID.",
  sessions: "You can view all sessions on your dashboard. We've created personalized recommendations based on your interests!",
  speakers: "We have industry experts from SAP, partner companies, and academia. Each session page has detailed speaker information.",
  feedback: "We value your feedback! You can rate each session you attend through the app, and there will be a comprehensive survey at the end of the event."
};

// Quick reply options
const QUICK_REPLIES = [
  { id: 'schedule', text: 'Event Schedule' },
  { id: 'location', text: 'Venue Info' },
  { id: 'wifi', text: 'Wi-Fi Password' },
  { id: 'food', text: 'Meals & Breaks' },
  { id: 'contact', text: 'Contact Support' },
  { id: 'sessions', text: 'Session Info' },
  { id: 'feedback', text: 'How to Give Feedback' },
  { id: 'help', text: 'What can you do?' }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 25,
      when: 'beforeChildren',
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    scale: 0.95,
    transition: { duration: 0.3 }
  }
};

const buttonVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.1,
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: { scale: 0.95 }
};

const logoVariants = {
  rest: { rotate: 0 },
  hover: { 
    rotate: 15,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10
    }
  }
};

const messageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.9 },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const SITConcierge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: CHATBOT_RESPONSES.default, time: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);
  
  // Handle message submission
  const handleSendMessage = (message = inputValue) => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: message,
      time: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: getBotResponse(message),
        time: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };
  
  // Get appropriate bot response based on user input
  const getBotResponse = (message) => {
    const normalizedMessage = message.toLowerCase();
    
    // Check for keywords
    if (/hello|hi|hey|greetings/i.test(normalizedMessage)) {
      return CHATBOT_RESPONSES.greeting;
    }
    if (/help|support|assist/i.test(normalizedMessage)) {
      return CHATBOT_RESPONSES.help;
    }
    if (/schedule|timing|when|time|agenda/i.test(normalizedMessage)) {
      return CHATBOT_RESPONSES.schedule;
    }
    if (/where|location|venue|place|address/i.test(normalizedMessage)) {
      return CHATBOT_RESPONSES.location;
    }
    if (/wifi|internet|network|password/i.test(normalizedMessage)) {
      return CHATBOT_RESPONSES.wifi;
    }
    if (/food|meal|eat|lunch|breakfast|dinner|coffee/i.test(normalizedMessage)) {
      return CHATBOT_RESPONSES.food;
    }
    if (/contact|email|phone|call|support/i.test(normalizedMessage)) {
      return CHATBOT_RESPONSES.contact;
    }
    if (/register|registration|qr|code/i.test(normalizedMessage)) {
      return CHATBOT_RESPONSES.registration;
    }
    if (/session|talk|presentation|workshop/i.test(normalizedMessage)) {
      return CHATBOT_RESPONSES.sessions;
    }
    if (/speaker|presenter|expert/i.test(normalizedMessage)) {
      return CHATBOT_RESPONSES.speakers;
    }
    if (/feedback|survey|review|rating/i.test(normalizedMessage)) {
      return CHATBOT_RESPONSES.feedback;
    }
    
    // Fallback response
    return "I'm not sure I understand. You can ask me about the event schedule, venue, Wi-Fi, food, or how to contact support.";
  };
  
  // Handle quick reply selection
  const handleQuickReply = (replyId) => {
    const reply = QUICK_REPLIES.find(r => r.id === replyId);
    if (reply) {
      handleSendMessage(reply.text);
    }
  };
  
  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render the logo for the chatbot
  const renderLogo = () => (
    <motion.div 
      variants={logoVariants}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-sap-blue to-sap-light-blue text-white shadow-md"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="w-6 h-6"
      >
        <path d="M11.5 2C6.81 2 3 5.81 3 10.5c0 1.8.55 3.5 1.58 4.91L3 18l2.59-1.58C7 17.45 8.7 18 10.5 18c4.69 0 8.5-3.81 8.5-8.5S16.19 2 11.5 2zM6 11.5c-.83 0-1.5-.67-1.5-1.5S5.17 8.5 6 8.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      </svg>
    </motion.div>
  );
  
  return (
    <>
      {/* Floating button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        animate="rest"
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-sap-blue to-sap-light-blue text-white shadow-lg focus:outline-none"
          variants={buttonVariants}
          aria-label="Chat with SIT Concierge"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          ) : (
            <motion.div variants={logoVariants}>
              {renderLogo()}
            </motion.div>
          )}
        </motion.button>
      </motion.div>

      {/* Chatbot dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-full max-w-sm bg-white rounded-apple shadow-2xl z-40 overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-sap-blue to-sap-light-blue text-white">
              <div className="flex items-center">
                {renderLogo()}
                <div className="ml-3">
                  <h3 className="font-bold">SIT Concierge</h3>
                  <div className="flex items-center text-xs">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                    <span>Online</span>
                  </div>
                </div>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 focus:outline-none"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close chatbot"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </div>

            {/* Messages area */}
            <div className="h-96 p-4 overflow-y-auto bg-gray-50">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  className={`mb-3 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  variants={messageVariants}
                  initial="initial"
                  animate="animate"
                  custom={index}
                  transition={{
                    delay: index * 0.1,
                  }}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-sap-blue text-white rounded-br-none'
                        : 'bg-white shadow-sm text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-sap-grey'}`}>
                      {formatTime(message.time)}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  className="mb-3 flex justify-start"
                  variants={messageVariants}
                  initial="initial"
                  animate="animate"
                >
                  <div className="bg-white p-3 rounded-2xl shadow-sm rounded-bl-none">
                    <div className="flex space-x-1">
                      <motion.div
                        className="w-2 h-2 bg-sap-blue rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'loop', delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-sap-blue rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'loop', delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-sap-blue rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'loop', delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestions */}
            <div className="p-3 border-t border-gray-100 overflow-x-auto">
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES.map((reply, index) => (
                  <motion.button
                    key={reply.id}
                    className="text-xs px-3 py-1.5 bg-gray-100 text-sap-blue rounded-full hover:bg-gray-200"
                    onClick={() => handleQuickReply(reply.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                  >
                    {reply.text}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input area */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t border-gray-100 bg-white flex items-center"
            >
              <motion.input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 p-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sap-blue bg-gray-50 text-sm"
                placeholder="Type your message..."
                disabled={isTyping}
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
              <motion.button
                type="submit"
                className="ml-2 p-2 rounded-full bg-sap-blue text-white focus:outline-none disabled:opacity-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={!inputValue.trim() || isTyping}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SITConcierge;