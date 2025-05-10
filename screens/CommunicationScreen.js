import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';

const mockMessages = [
  {
    id: '1',
    sender: 'Principal Smith',
    content: 'Reminder: Staff meeting tomorrow at 3pm in the auditorium',
    timestamp: '2023-10-10T09:30:00',
    isMe: false
  },
  {
    id: '2',
    sender: 'You',
    content: 'Request for additional science supplies for next week\'s lab',
    timestamp: '2023-10-08T14:15:00',
    isMe: true
  },
  {
    id: '3',
    sender: 'Vice Principal Johnson',
    content: 'Your field trip request has been approved',
    timestamp: '2023-10-05T11:45:00',
    isMe: false
  },
];

const mockAnnouncements = [
  {
    id: '1',
    title: 'School Closed Monday',
    content: 'School will be closed next Monday for professional development day',
    date: '2023-10-09'
  },
  {
    id: '2',
    title: 'New Curriculum Guidelines',
    content: 'Please review the updated curriculum guidelines in your email',
    date: '2023-10-02'
  },
];

const CommunicationScreen = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState('Principal');
  const [activeTab, setActiveTab] = useState('messages');

  const sendMessage = () => {
    if (!newMessage.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    const newId = (messages.length + 1).toString();
    setMessages(prev => [
      {
        id: newId,
        sender: 'You',
        content: newMessage,
        timestamp: new Date().toISOString(),
        isMe: true
      },
      ...prev
    ]);
    setNewMessage('');
    Alert.alert('Success', 'Message sent');
  };

  const submitRequest = (type) => {
    Alert.alert(
      'Request Submitted',
      `Your ${type} request has been submitted to administration`
    );
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.isMe ? styles.myMessage : styles.otherMessage
    ]}>
      <Text style={styles.senderName}>{item.sender}</Text>
      <Text style={styles.messageContent}>{item.content}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  const renderAnnouncement = ({ item }) => (
    <View style={styles.announcementCard}>
      <Text style={styles.announcementTitle}>{item.title}</Text>
      <Text style={styles.announcementDate}>{item.date}</Text>
      <Text style={styles.announcementContent}>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Communication</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'messages' && styles.activeTab
          ]}
          onPress={() => setActiveTab('messages')}
        >
          <Text style={styles.tabButtonText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'announcements' && styles.activeTab
          ]}
          onPress={() => setActiveTab('announcements')}
        >
          <Text style={styles.tabButtonText}>Announcements</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'requests' && styles.activeTab
          ]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={styles.tabButtonText}>Requests</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'messages' && (
        <>
          <View style={styles.composeContainer}>
            <TextInput
              style={styles.recipientInput}
              placeholder="Recipient"
              value={recipient}
              onChangeText={setRecipient}
            />
            <TextInput
              style={styles.messageInput}
              placeholder="Type your message here"
              multiline
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendMessage}
            >
              <Text style={styles.sendButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesList}
            inverted
          />
        </>
      )}

      {activeTab === 'announcements' && (
        <FlatList
          data={announcements}
          renderItem={renderAnnouncement}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.announcementsList}
        />
      )}

      {activeTab === 'requests' && (
        <View style={styles.requestsContainer}>
          <Text style={styles.sectionTitle}>Quick Requests</Text>
          
          <TouchableOpacity
            style={styles.requestButton}
            onPress={() => submitRequest('field trip')}
          >
            <Text style={styles.requestButtonText}>Request Field Trip</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.requestButton}
            onPress={() => submitRequest('supplies')}
          >
            <Text style={styles.requestButtonText}>Request Classroom Supplies</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.requestButton}
            onPress={() => submitRequest('professional development')}
          >
            <Text style={styles.requestButtonText}>Request Professional Development</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.requestButton}
            onPress={() => submitRequest('substitute teacher')}
          >
            <Text style={styles.requestButtonText}>Request Substitute Teacher</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03AC13',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#03AC13',
  },
  tabButtonText: {
    fontWeight: '600',
  },
  composeContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  recipientInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
    marginBottom: 12,
  },
  messageInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#03AC13',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  messagesList: {
    paddingBottom: 20,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 0,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderTopLeftRadius: 0,
    elevation: 1,
  },
  senderName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  messageContent: {
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  announcementsList: {
    paddingBottom: 20,
  },
  announcementCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  announcementTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#03AC13',
  },
  announcementDate: {
    color: '#666',
    marginBottom: 8,
  },
  announcementContent: {
    lineHeight: 20,
  },
  requestsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#03AC13',
  },
  requestButton: {
    backgroundColor: '#03AC13',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  requestButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default CommunicationScreen;