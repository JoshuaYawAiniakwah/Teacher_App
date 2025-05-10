import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const mockClasses = [
  {
    id: '1',
    name: 'Mathematics 7A',
    time: 'Mon/Wed/Fri 9:00-10:00',
    room: 'Room 201',
    students: 25
  },
  {
    id: '2',
    name: 'Science 7B',
    time: 'Tue/Thu 11:00-12:30',
    room: 'Lab 3',
    students: 22
  },
  {
    id: '3',
    name: 'English 7C',
    time: 'Mon/Wed/Fri 13:00-14:00',
    room: 'Room 105',
    students: 28
  },
];

const ClassesScreen = ({ navigation }) => {
  const renderClass = ({ item }) => (
    <TouchableOpacity 
      style={styles.classCard}
      onPress={() => navigation.navigate('Attendance', { classId: item.id })}
    >
      <Text style={styles.className}>{item.name}</Text>
      <Text style={styles.classInfo}>{item.time}</Text>
      <Text style={styles.classInfo}>{item.room}</Text>
      <View style={styles.classFooter}>
        <Text style={styles.studentCount}>{item.students} students</Text>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Gradebook', { classId: item.id })}
          >
            <Text style={styles.actionButtonText}>Gradebook</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Reports', { classId: item.id })}
          >
            <Text style={styles.actionButtonText}>Reports</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Classes</Text>
      <FlatList
        data={mockClasses}
        renderItem={renderClass}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  classCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  className: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#03AC13',
  },
  classInfo: {
    marginBottom: 4,
    color: '#666',
  },
  classFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  studentCount: {
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#03AC13',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ClassesScreen;