import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import StudentsScreen from '../screens/StudentScreen';
import TimetableScreen from '../screens/TimetableScreen';
import NotificationScreen from '../screens/NotificationScreen';
import AuthStack from './AuthStack';
import AuthContext from '../context/authContext';
import AssignmentScreen from '../screens/AssignmentScreen';
import ReportsScreen from '../screens/ReportsScreen';
import LessonPlanScreen from '../screens/LessonPlanScreen';
import ClassesScreen from '../screens/ClassesScreen';
import CommunicationScreen from '../screens/CommunicationScreen';
import GradebookScreen from '../screens/GradebookScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptions = ({ navigation }) => ({
  headerShown: true,
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitleStyle: {
    color: '#03AC13',
    fontWeight: 'bold',
  },
  headerTintColor: '#03AC13',
  headerLeft: () => (
    <TouchableOpacity 
      onPress={() => navigation.goBack()}
      style={{ marginLeft: 15 }}
    >
      <Ionicons name="arrow-back" size={24} color="#03AC13" />
    </TouchableOpacity>
  ),
});

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#03AC13',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: { 
        height: 60,
        paddingBottom: 5,
      },
      tabBarIcon: ({ color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Dashboard':
            iconName = 'home-outline';
            break;
          case 'Timetable':
            iconName = 'calendar-outline';
            break;
          case 'Attendance':
            iconName = 'checkmark-circle-outline';
            break;
          case 'Students':
            iconName = 'person-outline';
            break;
          // Removed Notifications tab but keeping screen accessible
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen 
      name="Dashboard" 
      component={DashboardScreen} 
      options={{ title: 'Home' }}
    />
    <Tab.Screen 
      name="Timetable" 
      component={TimetableScreen} 
      options={{ title: 'Schedule' }}
    />
    <Tab.Screen 
      name="Attendance" 
      component={AttendanceScreen} 
      options={{ title: 'Attendance' }}
    />
    <Tab.Screen 
      name="Students" 
      component={StudentsScreen} 
      options={{ title: 'Students' }}
    />
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen 
      name="MainTabs" 
      component={MainTabs} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="AssignmentScreen" 
      component={AssignmentScreen} 
      options={{ title: 'Assignments' }}
    />
    <Stack.Screen 
      name="ReportsScreen" 
      component={ReportsScreen} 
      options={{ title: 'Reports' }}
    />
    <Stack.Screen 
      name="LessonPlanScreen" 
      component={LessonPlanScreen} 
      options={{ title: 'Lesson Plans' }}
    />
    <Stack.Screen 
      name="ClassesScreen" 
      component={ClassesScreen} 
      options={{ title: 'Classes' }}
    />
    <Stack.Screen 
      name="CommunicationScreen" 
      component={CommunicationScreen} 
      options={{ title: 'Communication' }}
    />
    <Stack.Screen 
      name="GradebookScreen" 
      component={GradebookScreen} 
      options={{ title: 'Gradebook' }}
    />
    <Stack.Screen 
      name="Notifications" 
      component={NotificationScreen} 
      options={{ 
        headerShown: false, // This hides the default header
        gestureEnabled: true // Allows swipe back gesture
      }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user } = useContext(AuthContext);

  return user ? <MainStack /> : <AuthStack />;
};

export default AppNavigator;