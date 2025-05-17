import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Alert 
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useTheme } from '../context/themeContext';

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

const mockTeachers = [
  { label: 'Mr. Kwame Mensah', value: 'Mr. Kwame Mensah' },
  { label: 'Mrs. Ama Serwaa', value: 'Mrs. Ama Serwaa' },
  { label: 'Mr. Yaw Boateng', value: 'Mr. Yaw Boateng' },
];

const mockParents = [
  { label: 'Mr. & Mrs. Asante', value: 'Mr. & Mrs. Asante' },
  { label: 'Mrs. Adwoa Safo', value: 'Mrs. Adwoa Safo' },
  { label: 'Mr. Kofi Annan', value: 'Mr. Kofi Annan' },
];

const CommunicationScreen = () => {
  const { colors } = useTheme();
  const [messages, setMessages] = useState(mockMessages);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('messages');
  const [recipientType, setRecipientType] = useState('Admin');
  const [specificRecipient, setSpecificRecipient] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const styles = createStyles(colors);
  const pickerStyles = createPickerStyles(colors);

  const recipientOptions = [
    { label: 'Admin', value: 'Admin' },
    { label: 'All Teachers', value: 'All Teachers' },
    { label: 'Specific Teacher', value: 'Specific Teacher' },
    { label: 'All Parents', value: 'All Parents' },
    { label: 'Specific Parent', value: 'Specific Parent' },
    { label: 'All', value: 'All' },
  ];

  const handleRecipientChange = (value) => {
    setRecipientType(value);
    setShowSearch(value === 'Specific Teacher' || value === 'Specific Parent');
    setSpecificRecipient('');
  };

  const handleSearch = () => {
    if (recipientType === 'Specific Teacher') {
      setSearchResults(mockTeachers.filter(teacher => 
        teacher.label.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } else if (recipientType === 'Specific Parent') {
      setSearchResults(mockParents.filter(parent => 
        parent.label.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    }
  };

  const selectRecipient = (recipient) => {
    setSpecificRecipient(recipient);
    setShowSearch(false);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    let recipientName;
    if (recipientType === 'Specific Teacher' || recipientType === 'Specific Parent') {
      if (!specificRecipient) {
        Alert.alert('Error', 'Please select a recipient');
        return;
      }
      recipientName = specificRecipient;
    } else {
      recipientName = recipientType;
    }

    const newId = (messages.length + 1).toString();
    setMessages(prev => [
      {
        id: newId,
        sender: 'You',
        content: `To ${recipientName}: ${newMessage}`,
        timestamp: new Date().toISOString(),
        isMe: true
      },
      ...prev
    ]);
    setNewMessage('');
    setSpecificRecipient('');
    Alert.alert('Success', 'Message sent');
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.isMe ? styles.myMessage : styles.otherMessage,
      item.isMe ? { backgroundColor: colors.myMessageBackground } : { backgroundColor: colors.card }
    ]}>
      <Text style={[styles.senderName, { color: colors.text }]}>{item.sender}</Text>
      <Text style={[styles.messageContent, { color: colors.text }]}>{item.content}</Text>
      <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  const renderAnnouncement = ({ item }) => (
    <View style={[styles.announcementCard, { backgroundColor: colors.card }]}>
      <Text style={[styles.announcementTitle, { color: colors.primary }]}>{item.title}</Text>
      <Text style={[styles.announcementDate, { color: colors.textSecondary }]}>{item.date}</Text>
      <Text style={[styles.announcementContent, { color: colors.text }]}>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Communication</Text>

      <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'messages' && [styles.activeTab, { backgroundColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('messages')}
        >
          <Text style={[
            styles.tabButtonText,
            { color: colors.text },
            activeTab === 'messages' && { color: 'white' }
          ]}>
            Messages
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'announcements' && [styles.activeTab, { backgroundColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('announcements')}
        >
          <Text style={[
            styles.tabButtonText,
            { color: colors.text },
            activeTab === 'announcements' && { color: 'white' }
          ]}>
            Announcements
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'messages' && (
        <>
          <View style={[styles.composeContainer, { backgroundColor: colors.card }]}>
            <View style={styles.recipientContainer}>
              <RNPickerSelect
                onValueChange={handleRecipientChange}
                items={recipientOptions}
                value={recipientType}
                style={pickerStyles}
                useNativeAndroidPickerStyle={false}
                placeholder={{}}
                Icon={() => {
                  return <Text style={[styles.pickerIcon, { color: colors.primary }]}>▼</Text>;
                }}
              />
            </View>

            {showSearch && (
              <View style={styles.searchContainer}>
                <TextInput
                  style={[styles.searchInput, { 
                    borderColor: colors.border, 
                    backgroundColor: colors.inputBackground,
                    color: colors.text 
                  }]}
                  placeholder={`Search ${recipientType === 'Specific Teacher' ? 'teachers' : 'parents'}`}
                  placeholderTextColor={colors.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <TouchableOpacity
                  style={[styles.searchButton, { backgroundColor: colors.primary }]}
                  onPress={handleSearch}
                >
                  <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
              </View>
            )}

            {searchResults.length > 0 && (
              <View style={[styles.resultsContainer, { 
                borderColor: colors.border,
                backgroundColor: colors.inputBackground 
              }]}>
                {searchResults.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.resultItem, { 
                      borderBottomColor: colors.border 
                    }]}
                    onPress={() => selectRecipient(item.value)}
                  >
                    <Text style={{ color: colors.text }}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {specificRecipient && (
              <Text style={[styles.selectedRecipient, { 
                backgroundColor: colors.primary + '20',
                color: colors.primary 
              }]}>
                Selected: {specificRecipient}
              </Text>
            )}

            <TextInput
              style={[styles.messageInput, { 
                borderColor: colors.border, 
                backgroundColor: colors.inputBackground,
                color: colors.text 
              }]}
              placeholder="Type your message here"
              placeholderTextColor={colors.textSecondary}
              multiline
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: colors.primary }]}
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
    </SafeAreaView>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeTab: {},
  tabButtonText: {
    fontWeight: '600',
  },
  composeContainer: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  recipientContainer: {
    marginBottom: 12,
  },
  pickerIcon: {
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
  },
  searchButton: {
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  resultsContainer: {
    maxHeight: 150,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
  selectedRecipient: {
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
  },
  messageInput: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  sendButton: {
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
    borderTopRightRadius: 0,
  },
  otherMessage: {
    alignSelf: 'flex-start',
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
    marginTop: 4,
    textAlign: 'right',
  },
  announcementsList: {
    paddingBottom: 20,
  },
  announcementCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  announcementTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  announcementDate: {
    marginBottom: 8,
  },
  announcementContent: {
    lineHeight: 20,
  },
});

const createPickerStyles = (colors) => ({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    color: colors.text,
    paddingRight: 30,
    backgroundColor: colors.inputBackground,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    color: colors.text,
    paddingRight: 30,
    backgroundColor: colors.inputBackground,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});

export default CommunicationScreen;