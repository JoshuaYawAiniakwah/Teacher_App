import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      sender: 'Parent (Kwame Mensah)',
      message: 'Good morning sir, my child will be absent tomorrow due to illness.',
      time: '10:30 AM',
      read: false,
      type: 'parent',
      avatar: require('../assets/yaw 1.jpg')
    },
    {
      id: '2',
      sender: 'Teacher (Mrs. Adjoa)',
      message: 'Reminder: Submit your lesson plans by Friday.',
      time: 'Yesterday',
      read: true,
      type: 'teacher',
      avatar: require('../assets/abena.png')
    },
    {
      id: '3',
      sender: 'Student (Ama Boateng)',
      message: 'Sir, I need help with the math assignment.',
      time: 'May 5',
      read: true,
      type: 'student',
      avatar: require('../assets/yaw.jpg')
    },
  ]);

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleReply = (notification) => {
    setReplyingTo(notification);
  };

  const sendReply = () => {
    if (!replyText.trim()) return;

    const newNotification = {
      id: Date.now().toString(),
      sender: 'You',
      message: replyText,
      time: 'Just now',
      read: true,
      type: 'reply',
      avatar: require('../assets/yaw 2.jpg')
    };

    setNotifications([newNotification, ...notifications]);
    setReplyText('');
    setReplyingTo(null);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? {...notif, read: true} : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header - Only one back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#03AC13" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color="#03AC13" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.notificationItem, !item.read && styles.unreadNotification]}
            onPress={() => markAsRead(item.id)}
          >
            <Image source={item.avatar} style={styles.avatar} />
            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                <Text style={styles.sender}>{item.sender}</Text>
                <View style={styles.notificationMeta}>
                  <Text style={styles.time}>{item.time}</Text>
                  <TouchableOpacity onPress={() => deleteNotification(item.id)}>
                    <Ionicons name="trash-outline" size={18} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.notificationText}>{item.message}</Text>
              {item.type !== 'reply' && (
                <TouchableOpacity 
                  style={styles.replyButton}
                  onPress={() => handleReply(item)}
                >
                  <Text style={styles.replyButtonText}>Reply</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
      />

      {replyingTo && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.replyContainer}
        >
          <Text style={styles.replyingTo}>Replying to: {replyingTo.sender}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your reply..."
              value={replyText}
              onChangeText={setReplyText}
              multiline
            />
            <TouchableOpacity onPress={sendReply} style={styles.sendButton}>
              <Ionicons name="send" size={24} color="#03AC13" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#03AC13',
  },
  listContent: {
    paddingBottom: 80,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unreadNotification: {
    backgroundColor: '#f0f8ff',
    borderLeftWidth: 4,
    borderLeftColor: '#03AC13',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sender: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    color: '#888',
    fontSize: 12,
  },
  notificationText: {
    color: '#555',
    marginBottom: 10,
  },
  replyButton: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#e8f5e9',
    borderRadius: 15,
  },
  replyButtonText: {
    color: '#03AC13',
    fontSize: 14,
  },
  replyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  replyingTo: {
    color: '#666',
    fontSize: 12,
    marginBottom: 5,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 10,
  },
});

export default NotificationScreen;