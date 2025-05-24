import React, { useState, useCallback, useContext } from 'react';
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
  Alert,
  ToastAndroid,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AuthContext from '../context/authContext';
import { useTheme } from '../context/themeContext';

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
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownHeight] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const { colors, isDarkMode, toggleTheme } = useTheme();

  const toggleDropdown = () => {
    if (dropdownVisible) {
      Animated.timing(dropdownHeight, {
        toValue: 0,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(() => setDropdownVisible(false));
    } else {
      setDropdownVisible(true);
      Animated.timing(dropdownHeight, {
        toValue: 150, // Adjust based on your content height
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setNotificationCount(0);
    }, 1500);
  }, []);

  const quickActions = [
    { title: 'Assignments', icon: 'book-outline', screen: 'AssignmentScreen' },
    { title: 'Reports', icon: 'document-text-outline', screen: 'ReportsScreen' },
    { title: 'Lesson Plan', icon: 'calendar-outline', screen: 'LessonPlanScreen' },
    { title: 'Communication', icon: 'chatbubbles-outline', screen: 'CommunicationScreen' },
    { title: 'Gradebook', icon: 'reader-outline', screen: 'GradebookScreen' },
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

  const sortedEvents = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            logout();
            ToastAndroid.show("You have logged out successfully", ToastAndroid.SHORT);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleToggleTheme = () => {
    toggleTheme();
    ToastAndroid.show(
      `Changed to ${isDarkMode ? 'light' : 'dark'} mode`,
      ToastAndroid.SHORT
    );
    toggleDropdown(); // Close dropdown after selection
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notifications');
    toggleDropdown(); // Close dropdown after selection
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.card} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
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
        {/* Top Header */}
        <View style={[styles.topBar, { backgroundColor: colors.card }]}>
          <View style={styles.leftHeader}>
            <Image
              source={require('../assets/yaw.jpg')}
              style={styles.avatar}
              resizeMode="cover"
            />
            <Text style={[styles.welcome, { color: colors.text }]} numberOfLines={1}>
              {getGreeting()}, Mr. Johnson!
            </Text>
          </View>
          
          {/* Hamburger Menu Button */}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={toggleDropdown}
          >
            <Icon name="menu-outline" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Dropdown Menu */}
        <Animated.View 
          style={[
            styles.dropdownMenu, 
            { 
              backgroundColor: colors.card,
              height: dropdownHeight,
              borderColor: colors.border,
            }
          ]}
        >
          {dropdownVisible && (
            <>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={handleNotificationPress}
              >
                <View style={styles.dropdownIconContainer}>
                  <Icon name="notifications-outline" size={20} color={colors.text} />
                  {notificationCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{notificationCount}</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.dropdownText, { color: colors.text }]}>Notifications</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={handleToggleTheme}
              >
                <Icon 
                  name={isDarkMode ? 'sunny-outline' : 'moon-outline'} 
                  size={20} 
                  color={colors.text} 
                  style={styles.dropdownIcon}
                />
                <Text style={[styles.dropdownText, { color: colors.text }]}>
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={handleLogout}
              >
                <Icon name="log-out-outline" size={20} color={colors.text} style={styles.dropdownIcon} />
                <Text style={[styles.dropdownText, { color: colors.text }]}>Logout</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>

        {/* School Logo */}
        <View style={styles.logoCard}>
          <Image
            source={require('../assets/splash.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.schoolName, { color: colors.text }]}>OFORI-ATTAH INT. SCHOOL</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionButton}
                onPress={() => navigation.navigate(action.screen)}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: colors.primary + '20' }]}>
                  <Icon name={action.icon} size={24} color={colors.primary} />
                </View>
                <Text style={[styles.actionText, { color: colors.text }]}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Events List */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>School Events</Text>
          <View style={styles.eventsContainer}>
            {sortedEvents.map((event) => (
              <View
                key={event.id}
                style={[
                  styles.eventItem, 
                  { backgroundColor: colors.card },
                  event.status === 'completed' && styles.completedEvent
                ]}
              >
                <Image source={event.image} style={styles.eventImage} />
                <View style={styles.eventDetails}>
                  <View style={styles.eventHeader}>
                    <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>
                    <View style={styles.eventStatus}>
                      <Text
                        style={[
                          styles.statusText, 
                          event.status === 'upcoming' ? styles.upcomingStatus : styles.completedStatus,
                          event.status === 'upcoming' ? { backgroundColor: colors.primary + '20', color: colors.primary } 
                                                     : { backgroundColor: colors.border, color: colors.textSecondary }
                        ]}
                      >
                        {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.eventSubject, { color: colors.primary }]}>{event.subject}</Text>
                  <Text style={[styles.eventDateTime, { color: colors.textSecondary }]}>
                    {event.date} • {event.time}
                  </Text>
                  <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>{event.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors) => StyleSheet.create({
  safeArea: {
    flex: 1,
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
    padding: 16,
    borderRadius: 10,
    elevation: 2,
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
    borderColor: colors.border,
  },
  menuButton: {
    padding: 8,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 80,
    right: 16,
    width: 200,
    borderRadius: 8,
    zIndex: 100,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownIconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  dropdownIcon: {
    marginRight: 12,
  },
  dropdownText: {
    fontSize: 16,
  },
  badge: {
    position: 'absolute',
    right: -8,
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
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  eventsContainer: {
    marginTop: 8,
  },
  eventItem: {
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
  upcomingStatus: {},
  completedStatus: {},
  eventSubject: {
    fontSize: 14,
    marginBottom: 4,
  },
  eventDateTime: {
    fontSize: 12,
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default DashboardScreen;