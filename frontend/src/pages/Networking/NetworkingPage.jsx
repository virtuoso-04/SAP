import React from 'react';
import { 
  Page, 
  PageHeader,
  DynamicPageTitle,
  Title,
  FlexBox,
  Text,
  Icon,
  Button,
  Tab,
  TabContainer
} from '@ui5/webcomponents-react';
import NetworkingAssistant from '../../components/NetworkingAssistant';
import './NetworkingPage.scss';

/**
 * NetworkingPage displays networking features for event attendees
 * including AI-powered connection recommendations and networking tools.
 */
const NetworkingPage = () => {
  return (
    <Page
      className="networking-page"
      header={
        <PageHeader
          title="Networking Hub"
          showSubHeader
          subHeader={
            <DynamicPageTitle>
              <Title>Connect with Industry Professionals</Title>
              <FlexBox direction="Column" className="networking-header-content">
                <Text>Expand your professional network with AI-powered connection suggestions based on your interests, session attendance, and industry.</Text>
              </FlexBox>
              <FlexBox slot="actions">
                <Button design="Emphasized" icon="message-information">My Connections</Button>
                <Button icon="settings">Preferences</Button>
              </FlexBox>
            </DynamicPageTitle>
          }
        />
      }
    >
      <TabContainer>
        <Tab text="Suggested Connections" icon="group" selected>
          <div className="networking-container">
            <NetworkingAssistant />
          </div>
        </Tab>
        <Tab text="My Connections" icon="contacts">
          <div className="networking-container">
            <div className="networking-placeholder">
              <Icon name="person-placeholder" />
              <Title level="H3">My Connections</Title>
              <Text>This section will display your current connections and pending requests.</Text>
              <Button>View Pending Requests (2)</Button>
            </div>
          </div>
        </Tab>
        <Tab text="Networking Events" icon="calendar">
          <div className="networking-container">
            <div className="networking-placeholder">
              <Icon name="calendar" />
              <Title level="H3">Networking Events</Title>
              <Text>Upcoming networking events, meetups and social gatherings will be displayed here.</Text>
              <Button>View Event Schedule</Button>
            </div>
          </div>
        </Tab>
      </TabContainer>
    </Page>
  );
};

export default NetworkingPage;