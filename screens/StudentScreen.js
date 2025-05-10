import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  FlatList, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockStudents = [
  { id: '1', name: 'Ama Asantewaa', class: 'Math 7A', grade: 'A', attendance: '92%', performance: 'Excellent' },
  { id: '2', name: 'Kwame Nkrumah', class: 'Math 7A', grade: 'B', attendance: '85%', performance: 'Good' },
  { id: '3', name: 'Yaw Boateng', class: 'Math 7A', grade: 'A-', attendance: '95%', performance: 'Very Good' },
  { id: '4', name: 'Esi Mensah', class: 'Science 7B', grade: 'C+', attendance: '78%', performance: 'Average' },
  { id: '5', name: 'Kofi Addo', class: 'Science 7B', grade: 'B+', attendance: '88%', performance: 'Good' },
  { id: '6', name: 'Abena Serwaa', class: 'English 7C', grade: 'A', attendance: '93%', performance: 'Excellent' },
  { id: '7', name: 'Yaa Nkrumah', class: 'English 7C', grade: 'B-', attendance: '82%', performance: 'Satisfactory' },
  { id: '8', name: 'Kwabena Osei', class: 'English 7C', grade: 'C', attendance: '75%', performance: 'Needs Improvement' },
];

const StudentsScreen = () => {
  const [students, setStudents] = useState(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const screenWidth = Dimensions.get('window').width;

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'All Classes' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const classes = ['All Classes', ...new Set(students.map(student => student.class))];

  const getPerformanceColor = (performance) => {
    switch(performance) {
      case 'Excellent': return '#2ecc71';
      case 'Very Good': return '#27ae60';
      case 'Good': return '#3498db';
      case 'Satisfactory': return '#f39c12';
      case 'Average': return '#e67e22';
      case 'Needs Improvement': return '#e74c3c';
      default: return '#03AC13';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Student Roster</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search students..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.classFilterScroll}
        contentContainerStyle={styles.classFilterContainer}
      >
        {classes.map(cls => (
          <TouchableOpacity
            key={cls}
            style={[
              styles.classFilter,
              selectedClass === cls && styles.selectedClassFilter,
              { width: screenWidth / 3.5 }
            ]}
            onPress={() => setSelectedClass(cls)}
          >
            <Text style={[
              styles.classFilterText,
              selectedClass === cls && styles.selectedClassFilterText
            ]}>
              {cls}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredStudents}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.studentCard}>
            <View style={styles.studentAvatar}>
              <Ionicons name="person" size={24} color="#03AC13" />
            </View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{item.name}</Text>
              <View style={styles.studentMeta}>
                <Text style={styles.studentClass}>{item.class}</Text>
                <View style={[
                  styles.performanceBadge,
                  { backgroundColor: getPerformanceColor(item.performance) }
                ]}>
                  <Text style={styles.performanceText}>{item.performance}</Text>
                </View>
              </View>
            </View>
            <View style={styles.studentStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Grade</Text>
                <Text style={styles.statValue}>{item.grade}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Attendance</Text>
                <Text style={styles.statValue}>{item.attendance}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people" size={48} color="#03AC13" />
            <Text style={styles.emptyText}>No students found</Text>
          </View>
        }
      />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    elevation: 2,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  classFilterScroll: {
    marginBottom: 16,
  },
  classFilterContainer: {
    paddingRight: 16,
  },
  classFilter: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedClassFilter: {
    backgroundColor: '#03AC13',
  },
  classFilterText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedClassFilterText: {
    color: 'white',
  },
  listContent: {
    paddingBottom: 20,
  },
  studentCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#03AC13',
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
    color: '#2c3e50',
  },
  studentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentClass: {
    color: '#666',
    fontSize: 14,
    marginRight: 8,
  },
  performanceBadge: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  performanceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  studentStats: {
    alignItems: 'flex-end',
  },
  statItem: {
    alignItems: 'center',
    marginLeft: 8,
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
  },
  statValue: {
    fontWeight: '600',
    color: '#03AC13',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
});

export default StudentsScreen;