import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';

const mockStudents = [
  { id: '1', name: 'Ama Asantewaa', grades: { '1': 85, '2': 90 } },
  { id: '2', name: 'Kwame Nkrumah', grades: { '1': 72, '2': 68 } },
  { id: '3', name: 'Yaw Boateng', grades: { '1': 92, '2': 88 } },
  { id: '4', name: 'Esi Mensah', grades: { '1': 65, '2': 70 } },
  { id: '5', name: 'Kofi Addo', grades: { '1': 78, '2': 82 } },
];

const mockAssignments = [
  { id: '1', title: 'Math Quiz', maxScore: 100, date: '2023-10-15' },
  { id: '2', title: 'Science Test', maxScore: 100, date: '2023-10-20' },
];

const GradebookScreen = () => {
  const [students, setStudents] = useState(mockStudents);
  const [assignments, setAssignments] = useState(mockAssignments);
  const [selectedAssignment, setSelectedAssignment] = useState(mockAssignments[0]);
  const [newAssignment, setNewAssignment] = useState({ title: '', maxScore: '' });

  const updateGrade = (studentId, grade) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          grades: {
            ...student.grades,
            [selectedAssignment.id]: parseInt(grade) || 0
          }
        };
      }
      return student;
    }));
  };

  const addAssignment = () => {
    if (!newAssignment.title || !newAssignment.maxScore) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const newId = (assignments.length + 1).toString();
    setAssignments(prev => [
      ...prev,
      {
        id: newId,
        title: newAssignment.title,
        maxScore: parseInt(newAssignment.maxScore),
        date: new Date().toISOString().split('T')[0]
      }
    ]);
    setNewAssignment({ title: '', maxScore: '' });
    setSelectedAssignment(assignments[0]);
  };

  const exportGrades = () => {
    Alert.alert('Success', 'Grades exported successfully (mock)');
  };

  const calculateAverage = (student) => {
    const grades = Object.values(student.grades);
    if (grades.length === 0) return 0;
    return (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1);
  };

  const renderStudent = ({ item }) => (
    <View style={styles.studentRow}>
      <Text style={styles.studentName}>{item.name}</Text>
      <Text style={styles.gradeText}>
        {item.grades[selectedAssignment.id] || '--'} / {selectedAssignment.maxScore}
      </Text>
      <TextInput
        style={styles.gradeInput}
        keyboardType="numeric"
        placeholder="Grade"
        onChangeText={(text) => updateGrade(item.id, text)}
        value={item.grades[selectedAssignment.id]?.toString() || ''}
      />
      <Text style={styles.averageText}>{calculateAverage(item)}%</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Gradebook</Text>
      
      <View style={styles.assignmentHeader}>
        <Text style={styles.sectionTitle}>Assignments</Text>
        <TouchableOpacity style={styles.addButton} onPress={addAssignment}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.newAssignmentContainer}>
        <TextInput
          style={styles.input}
          placeholder="Assignment Title"
          value={newAssignment.title}
          onChangeText={(text) => setNewAssignment({...newAssignment, title: text})}
        />
        <TextInput
          style={[styles.input, { width: 80 }]}
          placeholder="Max Score"
          keyboardType="numeric"
          value={newAssignment.maxScore}
          onChangeText={(text) => setNewAssignment({...newAssignment, maxScore: text})}
        />
      </View>

      <FlatList
        horizontal
        data={assignments}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.assignmentTab, 
              selectedAssignment?.id === item.id && styles.selectedAssignment
            ]}
            onPress={() => setSelectedAssignment(item)}
          >
            <Text>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.assignmentsList}
      />

      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={styles.studentHeader}>
            <Text style={styles.headerText}>Student</Text>
            <Text style={styles.headerText}>Grade</Text>
            <Text style={styles.headerText}>Input</Text>
            <Text style={styles.headerText}>Avg</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.exportButton} onPress={exportGrades}>
        <Text style={styles.exportButtonText}>Export Grades</Text>
      </TouchableOpacity>
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
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#03AC13',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  newAssignmentContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    backgroundColor: 'white',
  },
  assignmentsList: {
    paddingBottom: 8,
  },
  assignmentTab: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#03AC13',
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: 'white',
  },
  selectedAssignment: {
    backgroundColor: '#03AC13',
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#03AC13',
    borderRadius: 8,
    marginBottom: 8,
  },
  headerText: {
    color: 'white',
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
  },
  studentName: {
    flex: 1,
    fontSize: 16,
  },
  gradeText: {
    flex: 1,
    textAlign: 'center',
  },
  gradeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    textAlign: 'center',
    marginHorizontal: 4,
  },
  averageText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
  },
  exportButton: {
    backgroundColor: '#03AC13',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  exportButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default GradebookScreen;