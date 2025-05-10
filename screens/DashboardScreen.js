import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const colors = {
  primary: '#03AC13',
  secondary: '#2E7D32',
  accent: '#FFC107',
  background: '#f5f5f5',
};

const screenWidth = Dimensions.get('window').width;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const DashboardScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const navigation = useNavigation();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setNotificationCount(0);
    }, 1500);
  }, []);

  const quickActions = [
    { 
      title: 'Assignments', 
      icon: 'book-outline',
      screen: 'AssignmentScreen'
    },
    { 
      title: 'Reports', 
      icon: 'document-text-outline',
      screen: 'ReportsScreen'
    },
    { 
      title: 'Lesson Plan', 
      icon: 'calendar-outline',
      screen: 'LessonPlanScreen'
    },
    { 
      title: 'Classes', 
      icon: 'school-outline',
      screen: 'ClassesScreen'
    },
    { 
      title: 'Communication', 
      icon: 'chatbubbles-outline',
      screen: 'CommunicationScreen'
    },
    { 
      title: 'Gradebook', 
      icon: 'reader-outline',
      screen: 'GradebookScreen'
    },
  ];

  const events = [
    {
      id: '1',
      title: 'Math Test',
      date: 'May 10, 2023',
      time: '10:00 AM',
      subject: 'Mathematics',
      description: 'End of term examination for all students',
      image: require('../assets/math-test.jpg'),
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Science Fair',
      date: 'May 5, 2023',
      time: '9:00 AM',
      subject: 'Science',
      description: 'Annual science fair showcasing student projects',
      image: require('../assets/science-fair.jpg'),
      status: 'completed'
    },
    {
      id: '3',
      title: 'PTA Meeting',
      date: 'May 15, 2023',
      time: '2:00 PM',
      subject: 'General',
      description: 'Quarterly parent-teacher association meeting',
      image: require('../assets/pta-meeting.jpg'),
      status: 'upcoming'
    },
    {
      id: '4',
      title: 'Sports Day',
      date: 'April 28, 2023',
      time: '8:00 AM',
      subject: 'Physical Education',
      description: 'Annual inter-house sports competition',
      image: require('../assets/sports-day.jpg'),
      status: 'completed'
    },
    {
      id: '5',
      title: 'Art Exhibition',
      date: 'May 20, 2023',
      time: '11:00 AM',
      subject: 'Creative Arts',
      description: 'Showcase of student artwork from the term',
      image: require('../assets/art-exhibition.jpg'),
      status: 'upcoming'
    }
  ];

  // Sort events by date (newest first)
  const sortedEvents = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <Animated.View entering={FadeIn.duration(800)}>
          {/* Top Header */}
          <View style={styles.topBar}>
            <View style={styles.leftHeader}>
              <Image 
                source={require('../assets/yaw.jpg')} 
                style={styles.avatar} 
                resizeMode="cover"
              />
              <Text style={[styles.welcome, { color: colors.primary }]} numberOfLines={1}>
                {getGreeting()}, Mr. Johnson!
              </Text>
            </View>
            <View style={styles.rightIcons}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Icon name="notifications-outline" size={20} color="#333" />
                {notificationCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{notificationCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconBtn, { marginLeft: 16 }]}
                onPress={() => console.log('Logout action')}
              >
                <Icon name="log-out-outline" size={20} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

          {/* School Logo */}
          <View style={styles.logoCard}>
            <Image 
              source={require('../assets/OAIS NEW LOGO.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
            <Text style={styles.schoolName}>OFORI-ATTAH INT. SCHOOL</Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsContainer}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.actionButton}
                  onPress={() => navigation.navigate(action.screen)}
                >
                  <View style={styles.actionIconContainer}>
                    <Icon name={action.icon} size={24} color={colors.primary} />
                  </View>
                  <Text style={styles.actionText}>{action.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Events List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>School Events</Text>
            <View style={styles.eventsContainer}>
              {sortedEvents.map((event) => (
                <View key={event.id} style={[
                  styles.eventItem,
                  event.status === 'completed' && styles.completedEvent
                ]}>
                  <Image source={event.image} style={styles.eventImage} />
                  <View style={styles.eventDetails}>
                    <View style={styles.eventHeader}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <View style={styles.eventStatus}>
                        <Text style={[
                          styles.statusText,
                          event.status === 'upcoming' ? styles.upcomingStatus : styles.completedStatus
                        ]}>
                          {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.eventSubject}>{event.subject}</Text>
                    <Text style={styles.eventDateTime}>{event.date} • {event.time}</Text>
                    <Text style={styles.eventDescription}>{event.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  welcome: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    flexShrink: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#eee',
  },
  rightIcons: {
    flexDirection: 'row',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  logoCard: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 10,
  },
  logo: {
    width: 120,
    height: 120,
  },
  schoolName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#222',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
  eventsContainer: {
    marginTop: 8,
  },
  eventItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedEvent: {
    opacity: 0.8,
  },
  eventImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  eventDetails: {
    padding: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  eventTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  eventStatus: {
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  upcomingStatus: {
    backgroundColor: '#E8F5E9',
    color: '#03AC13',
  },
  completedStatus: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
  eventSubject: {
    fontSize: 14,
    color: '#03AC13',
    marginBottom: 4,
  },
  eventDateTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

export default DashboardScreen;