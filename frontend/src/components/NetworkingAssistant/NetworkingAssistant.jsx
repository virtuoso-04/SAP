import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  FormInput,
  Button, 
  Text, 
  Title, 
  FlexBox,
  Avatar,
  List,
  ListItem,
  MessageStrip,
  Badge,
  ProgressIndicator,
  Icon
} from '@ui5/webcomponents-react';
import { useUserContext } from '../../contexts/UserContext';
import { getSuggestedConnections, sendConnectionRequest } from '../../services/networkingService';
import './NetworkingAssistant.scss';

/**
 * NetworkingAssistant component provides an AI-driven networking experience
 * to help event attendees connect with relevant professionals and peers.
 */
const NetworkingAssistant = () => {
  const { user } = useUserContext();
  const [suggestedConnections, setSuggestedConnections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConnections, setFilteredConnections] = useState([]);
  const [aiSuggestionMode, setAiSuggestionMode] = useState('interests'); // 'interests', 'sessions', 'company'
  const [notifications, setNotifications] = useState([]);
  const networkingRef = useRef(null);

  // Fetch suggested connections when component mounts or mode changes
  useEffect(() => {
    const fetchConnections = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would call the actual API with the mode parameter
        const connections = await getSuggestedConnections(aiSuggestionMode, user?.id);
        setSuggestedConnections(connections);
        setFilteredConnections(connections);
      } catch (error) {
        console.error("Error fetching suggested connections:", error);
        addNotification('error', 'Failed to load networking suggestions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchConnections();
    }
  }, [user, aiSuggestionMode]);

  // Filter connections based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredConnections(suggestedConnections);
      return;
    }
    
    const filtered = suggestedConnections.filter(connection => {
      const fullName = `${connection.firstName} ${connection.lastName}`.toLowerCase();
      const company = connection.company?.toLowerCase() || '';
      const role = connection.jobTitle?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();
      
      return fullName.includes(query) || 
             company.includes(query) || 
             role.includes(query) || 
             connection.interests.some(interest => interest.toLowerCase().includes(query));
    });
    
    setFilteredConnections(filtered);
  }, [searchQuery, suggestedConnections]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleModeChange = (mode) => {
    setAiSuggestionMode(mode);
  };

  const addNotification = (type, message) => {
    const newNotification = {
      id: Date.now(),
      type,
      message
    };
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  const handleSendRequest = async (connectionId) => {
    try {
      await sendConnectionRequest(user?.id, connectionId);
      addNotification('success', 'Connection request sent successfully!');
      
      // Update the status in the local state
      setSuggestedConnections(prev => 
        prev.map(conn => 
          conn.id === connectionId ? {...conn, requestSent: true} : conn
        )
      );
    } catch (error) {
      console.error("Error sending connection request:", error);
      addNotification('error', 'Failed to send connection request. Please try again.');
    }
  };

  const calculateMatchPercentage = (connection) => {
    // In a real implementation, this would use actual matching algorithms
    // For demo purposes, we'll use a simplified calculation
    let score = 0;
    
    // Match based on interests overlap
    const userInterests = user?.interests || [];
    const sharedInterests = connection.interests?.filter(interest => 
      userInterests.includes(interest)
    );
    score += (sharedInterests?.length || 0) * 10;
    
    // Match based on industry
    if (user?.industry === connection.industry) {
      score += 15;
    }
    
    // Match based on company size or type
    if (user?.companySize === connection.companySize) {
      score += 5;
    }
    
    // Cap the percentage at 100%
    return Math.min(score, 100);
  };

  const getModeTitle = () => {
    switch (aiSuggestionMode) {
      case 'interests':
        return 'Based on Your Interests';
      case 'sessions':
        return 'Based on Sessions Attended';
      case 'company':
        return 'From Similar Companies';
      default:
        return 'Suggested Connections';
    }
  };

  return (
    <div className="networking-assistant" ref={networkingRef}>
      <Card
        header={
          <CardHeader
            titleText="Networking Assistant"
            subtitleText="AI-powered networking recommendations"
            avatar={<Avatar icon="group" />}
          />
        }
      >
        <CardContent>
          {/* Notifications */}
          <div className="networking-notifications">
            {notifications.map(notification => (
              <MessageStrip
                key={notification.id}
                design={notification.type}
                onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              >
                {notification.message}
              </MessageStrip>
            ))}
          </div>
          
          {/* Search and filters */}
          <div className="networking-controls">
            <FormInput
              placeholder="Search for people, companies, or interests..."
              value={searchQuery}
              onChange={handleSearchChange}
              icon="search"
            />
            
            <FlexBox justifyContent="space-between" className="networking-filters">
              <Title level="H5">{getModeTitle()}</Title>
              <FlexBox>
                <Button 
                  design={aiSuggestionMode === 'interests' ? 'Emphasized' : 'Default'}
                  onClick={() => handleModeChange('interests')}
                  icon="interest"
                >
                  Interests
                </Button>
                <Button 
                  design={aiSuggestionMode === 'sessions' ? 'Emphasized' : 'Default'}
                  onClick={() => handleModeChange('sessions')}
                  icon="calendar"
                >
                  Sessions
                </Button>
                <Button 
                  design={aiSuggestionMode === 'company' ? 'Emphasized' : 'Default'}
                  onClick={() => handleModeChange('company')}
                  icon="building"
                >
                  Company
                </Button>
              </FlexBox>
            </FlexBox>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <FlexBox justifyContent="center" alignItems="center" style={{ padding: '2rem' }}>
              <ProgressIndicator value={0} displayValue="Loading..." />
            </FlexBox>
          )}
          
          {/* Connection suggestions */}
          {!isLoading && filteredConnections.length > 0 && (
            <List>
              {filteredConnections.map(connection => {
                const matchPercentage = calculateMatchPercentage(connection);
                
                return (
                  <ListItem 
                    key={connection.id} 
                    className="connection-item"
                    image={<Avatar image={connection.avatar || undefined}>{connection.firstName?.[0]}{connection.lastName?.[0]}</Avatar>}
                    description={
                      <div className="connection-details">
                        <Text>{connection.jobTitle} at {connection.company}</Text>
                        <FlexBox wrap="Wrap" className="connection-tags">
                          {connection.interests.slice(0, 3).map((interest, idx) => (
                            <Badge key={idx} colorScheme={idx % 3 === 0 ? 'indigo' : idx % 3 === 1 ? 'green' : 'orange'}>
                              {interest}
                            </Badge>
                          ))}
                          {connection.interests.length > 3 && (
                            <Badge colorScheme="teal">+{connection.interests.length - 3} more</Badge>
                          )}
                        </FlexBox>
                      </div>
                    }
                  >
                    <div className="connection-main">
                      <div>
                        <Text weight="Bold">
                          {connection.firstName} {connection.lastName}
                        </Text>
                      </div>
                      <div className="connection-actions">
                        <div className="match-indicator">
                          <Text weight="Bold">{matchPercentage}%</Text>
                          <Text>match</Text>
                        </div>
                        <Button 
                          design="Transparent"
                          icon="message-information"
                          tooltip="View profile"
                        />
                        <Button 
                          design={connection.requestSent ? "Positive" : "Emphasized"}
                          icon={connection.requestSent ? "accept" : "add-contact"}
                          disabled={connection.requestSent}
                          onClick={() => !connection.requestSent && handleSendRequest(connection.id)}
                        >
                          {connection.requestSent ? 'Requested' : 'Connect'}
                        </Button>
                      </div>
                    </div>
                  </ListItem>
                );
              })}
            </List>
          )}
          
          {/* Empty state */}
          {!isLoading && filteredConnections.length === 0 && (
            <div className="networking-empty-state">
              <Icon name="person-placeholder" />
              <Title level="H5">No connections found</Title>
              <Text>
                {searchQuery ? 
                  "No matches for your search criteria. Try adjusting your search." :
                  "We don't have any connection suggestions for you at the moment."}
              </Text>
              {searchQuery && (
                <Button onClick={() => setSearchQuery('')}>Clear search</Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkingAssistant;