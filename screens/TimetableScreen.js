import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockTimetable = [
  {
    day: 'Monday',
    classes: [
      { id: '1', time: '8:00 - 9:00', subject: 'Math 7A', room: '201', type: 'lecture' },
      { id: '2', time: '9:00 - 10:00', subject: 'Science 7B', room: 'Lab 3', type: 'lab' },
      { id: '3', time: '11:00 - 12:00', subject: 'English 7C', room: '105', type: 'lecture' },
      { id: '4', time: '2:00 - 3:00', subject: 'Math 7A', room: '201', type: 'tutorial' },
    ]
  },
  {
    day: 'Tuesday',
    classes: [
      { id: '5', time: '8:00 - 9:30', subject: 'Science 7B', room: 'Lab 3', type: 'lab' },
      { id: '6', time: '10:00 - 11:00', subject: 'English 7C', room: '105', type: 'lecture' },
      { id: '7', time: '1:00 - 2:00', subject: 'Math 7A', room: '201', type: 'lecture' },
    ]
  },
  {
    day: 'Wednesday',
    classes: [
      { id: '8', time: '8:00 - 9:00', subject: 'Math 7A', room: '201', type: 'lecture' },
      { id: '9', time: '10:00 - 11:00', subject: 'Staff Meeting', room: 'Library', type: 'meeting' },
      { id: '10', time: '1:00 - 2:00', subject: 'English 7C', room: '105', type: 'discussion' },
    ]
  },
  {
    day: 'Thursday',
    classes: [
      { id: '11', time: '9:00 - 10:30', subject: 'Science 7B', room: 'Lab 3', type: 'lab' },
      { id: '12', time: '11:00 - 12:00', subject: 'Math 7A', room: '201', type: 'lecture' },
    ]
  },
  {
    day: 'Friday',
    classes: [
      { id: '13', time: '8:00 - 9:00', subject: 'English 7C', room: '105', type: 'lecture' },
      { id: '14', time: '10:00 - 11:00', subject: 'Math 7A', room: '201', type: 'quiz' },
      { id: '15', time: '1:00 - 2:00', subject: 'Science 7B', room: 'Lab 3', type: 'lab' },
    ]
  },
];

const TimetableScreen = () => {
  const [currentDay, setCurrentDay] = useState('Monday');
  const screenWidth = Dimensions.get('window').width;

  const currentDayClasses = mockTimetable.find(day => day.day === currentDay)?.classes || [];

  const getTypeColor = (type) => {
    switch(type) {
      case 'lecture': return '#3498db';
      case 'lab': return '#e74c3c';
      case 'meeting': return '#9b59b6';
      case 'tutorial': return '#2ecc71';
      case 'quiz': return '#f39c12';
      default: return '#03AC13';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Class Timetable</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysContainer}
      >
        {mockTimetable.map(day => (
          <TouchableOpacity
            key={day.day}
            style={[
              styles.dayButton,
              currentDay === day.day && styles.activeDayButton,
              { width: screenWidth / 4.5 }
            ]}
            onPress={() => setCurrentDay(day.day)}
          >
            <Text style={[
              styles.dayButtonText,
              currentDay === day.day && styles.activeDayButtonText
            ]}>
              {day.day.substring(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.timetableContainer}>
        {currentDayClasses.length > 0 ? (
          <FlatList
            data={currentDayClasses}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.classCard}>
                <View style={styles.classTimeContainer}>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <View style={styles.classDetails}>
                  <View style={styles.classHeader}>
                    <Text style={styles.subjectText}>{item.subject}</Text>
                    <View style={[
                      styles.typeBadge,
                      { backgroundColor: getTypeColor(item.type) }
                    ]}>
                      <Text style={styles.typeText}>{item.type}</Text>
                    </View>
                  </View>
                  <View style={styles.classFooter}>
                    <View style={styles.roomContainer}>
                      <Ionicons name="location" size={16} color="#666" />
                      <Text style={styles.roomText}>Room {item.room}</Text>
                    </View>
                    <TouchableOpacity style={styles.moreButton}>
                      <Ionicons name="ellipsis-vertical" size={20} color="#999" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.noClasses}>
            <Ionicons name="calendar" size={48} color="#03AC13" />
            <Text style={styles.noClassesText}>No classes scheduled</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03AC13',
  },
  daysContainer: {
    paddingBottom: 10,
    marginBottom: 16,
  },
  dayButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDayButton: {
    backgroundColor: '#03AC13',
  },
  dayButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  activeDayButtonText: {
    color: 'white',
  },
  timetableContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    elevation: 2,
  },
  listContent: {
    paddingBottom: 20,
  },
  classCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#03AC13',
    overflow: 'hidden',
    elevation: 1,
  },
  classTimeContainer: {
    width: 90,
    padding: 12,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontWeight: '600',
    color: '#03AC13',
    textAlign: 'center',
  },
  classDetails: {
    flex: 1,
    padding: 12,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  subjectText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  classFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 4,
  },
  moreButton: {
    padding: 4,
  },
  noClasses: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noClassesText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
});

export default TimetableScreen;