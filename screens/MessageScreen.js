import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Alert  // Added Alert import here
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockMessages = [
  {
    id: '1',
    sender: 'Principal Smith',
    content: 'Reminder: Staff meeting tomorrow at 3pm in the auditorium',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    sender: 'Admin Office',
    content: 'Your request for classroom supplies has been approved',
    time: '1 day ago',
    read: true,
  },
  {
    id: '3',
    sender: 'Vice Principal Johnson',
    content: 'Please submit your grades by Friday',
    time: '2 days ago',
    read: true,
  },
  {
    id: '4',
    sender: 'IT Department',
    content: 'Your password has been reset as requested',
    time: '3 days ago',
    read: true,
  },
];

const MessageScreen = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [activeTab, setActiveTab] = useState('inbox');
  const [newMessage, setNewMessage] = useState('');

  const markAsRead = (id) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Add the new message to sent items
      const newMsg = {
        id: Date.now().toString(),
        sender: 'You',
        content: newMessage,
        time: 'Just now',
        read: true
      };
      
      setMessages(prev => [...prev, newMsg]);
      Alert.alert('Success', 'Message sent to admin');
      setNewMessage('');
    } else {
      Alert.alert('Error', 'Please enter a message');
    }
  };

  const renderMessage = ({ item }) => (
    <TouchableOpacity 
      style={[styles.messageCard, !item.read && styles.unreadMessage]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.messageHeader}>
        <Text style={styles.sender}>{item.sender}</Text>
        {!item.read && <View style={styles.unreadBadge} />}
      </View>
      <Text style={styles.messageContent}>{item.content}</Text>
      <Text style={styles.messageTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  const sentMessages = messages.filter(msg => msg.sender === 'You');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'inbox' && styles.activeTab]}
          onPress={() => setActiveTab('inbox')}
        >
          <Text style={[styles.tabText, activeTab === 'inbox' && styles.activeTabText]}>Inbox</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sent' && styles.activeTab]}
          onPress={() => setActiveTab('sent')}
        >
          <Text style={[styles.tabText, activeTab === 'sent' && styles.activeTabText]}>Sent</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'inbox' ? (
        <FlatList
          data={messages.filter(msg => msg.sender !== 'You')}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
        />
      ) : (
        <FlatList
          data={sentMessages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.messagesList,
            sentMessages.length === 0 && styles.emptyState
          ]}
          ListEmptyComponent={
            <View style={styles.emptyContent}>
              <Ionicons name="paper-plane" size={48} color="#03AC13" />
              <Text style={styles.emptyText}>No sent messages</Text>
            </View>
          }
        />
      )}

      <View style={styles.composeContainer}>
        <TextInput
          style={styles.composeInput}
          placeholder="Type a message to admin..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
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
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#03AC13',
  },
  tabText: {
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  messagesList: {
    paddingBottom: 80,
  },
  messageCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  unreadMessage: {
    borderLeftWidth: 4,
    borderLeftColor: '#03AC13',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sender: {
    fontWeight: '600',
    color: '#03AC13',
  },
  unreadBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#03AC13',
  },
  messageContent: {
    marginBottom: 8,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    color: '#666',
  },
  composeContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
  },
  composeInput: {
    flex: 1,
    padding: 12,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: '#03AC13',
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
});

export default MessageScreen;