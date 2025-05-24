import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Dimensions,
  Modal,
  Alert,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../context/themeContext';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const mockStudents = [
  { id: '1', name: 'Ama Asantewaa', class: 'Creche' },
  { id: '2', name: 'Kwame Nkrumah', class: 'Nursery 1' },
  { id: '3', name: 'Yaw Boateng', class: 'Nursery 2' },
  { id: '4', name: 'Esi Mensah', class: 'KG 1' },
  { id: '5', name: 'Kofi Addo', class: 'KG 2' },
  { id: '6', name: 'Abena Serwaa', class: 'Grade 1' },
  { id: '7', name: 'Yaa Nkrumah', class: 'Grade 2' },
  { id: '8', name: 'Kwabena Osei', class: 'Grade 3' },
  { id: '9', name: 'Ama Ampofo', class: 'Grade 4' },
  { id: '10', name: 'Kofi Asante', class: 'Grade 5' },
  { id: '11', name: 'Adwoa Mensah', class: 'Grade 6' },
  { id: '12', name: 'Yaw Boateng', class: 'Grade 7' },
  { id: '13', name: 'Esi Asante', class: 'Grade 8' },
  { id: '14', name: 'Kwame Nkrumah', class: 'Grade 9' },
];

const classes = [
  'Creche',
  'Nursery 1',
  'Nursery 2',
  'KG 1',
  'KG 2',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9'
];

const subjects = [
  'Mathematics',
  'English',
  'Science',
  'Social Studies',
  'ICT',
  'Creative Arts',
  'Physical Education'
];

const terms = ['1st Term', '2nd Term', '3rd Term'];
const academicYears = ['2022/2023', '2023/2024', '2024/2025'];

const mockTests = [
  {
    id: '1',
    title: 'Math Midterm',
    description: 'Covers chapters 1-5',
    date: '2023-05-15',
    assignedDate: '2023-05-01',
    subject: 'Mathematics',
    class: 'Grade 1',
    maxScore: 100,
    term: '2nd Term',
    academicYear: '2022/2023',
    grades: {
      '1': 85,
      '2': 72,
      '3': 92,
      '4': 65,
      '5': 78
    }
  },
  {
    id: '2',
    title: 'Science Quiz',
    description: 'Basic concepts quiz',
    date: '2023-05-20',
    assignedDate: '2023-05-10',
    subject: 'Science',
    class: 'Grade 1',
    maxScore: 50,
    term: '2nd Term',
    academicYear: '2022/2023',
    grades: {
      '1': 42,
      '2': 38,
      '3': 45,
      '4': 30,
      '5': 35
    }
  },
  {
    id: '3',
    title: 'English Test',
    description: 'Grammar and comprehension',
    date: '2023-05-10',
    assignedDate: '2023-05-01',
    subject: 'English',
    class: 'Grade 2',
    maxScore: 80,
    term: '2nd Term',
    academicYear: '2022/2023',
    grades: {
      '6': 65,
      '7': 72,
      '8': 68
    }
  },
];

const GradebookScreen = () => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const [tests, setTests] = useState(mockTests);
  const [newTest, setNewTest] = useState({
    title: '',
    description: '',
    date: new Date(),
    assignedDate: new Date(),
    subject: null,
    class: null,
    maxScore: '',
    term: null,
    academicYear: null
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAssignedDatePicker, setShowAssignedDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState(null);

  const styles = createStyles(colors);
  const pickerStyles = createPickerStyles(colors);
  const testModalScrollRef = useRef(null);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Filter students by selected class
  const filteredStudents = selectedClass 
    ? mockStudents.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass = student.class === selectedClass;
        return matchesSearch && matchesClass;
      })
    : [];

  // Filter tests by selected class and subject
  const filteredTests = selectedClass && selectedSubject
    ? tests.filter(test => 
        test.class === selectedClass && 
        test.subject === selectedSubject
      )
    : [];

  const handleUpdateGrade = (studentId, grade) => {
    if (!selectedTest) return;
    
    const updatedTests = tests.map(test => {
      if (test.id === selectedTest.id) {
        return {
          ...test,
          grades: {
            ...test.grades,
            [studentId]: parseInt(grade) || 0
          }
        };
      }
      return test;
    });
    
    setTests(updatedTests);
    setSelectedTest(updatedTests.find(t => t.id === selectedTest.id));
  };

  const handleSubmitGrades = () => {
    Alert.alert('Success', 'Grades submitted successfully');
  };

  const handleExportGrades = () => {
    Alert.alert('Success', 'Grades exported successfully');
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    setShowAssignedDatePicker(false);
    
    if (datePickerMode === 'testDate') {
      setNewTest({...newTest, date: currentDate});
    } else if (datePickerMode === 'assignedDate') {
      setNewTest({...newTest, assignedDate: currentDate});
    }
  };

  const showDatepicker = (mode) => {
    setDatePickerMode(mode);
    if (mode === 'testDate') {
      setShowDatePicker(true);
    } else {
      setShowAssignedDatePicker(true);
    }
  };

  const handleAddTest = () => {
    if (!newTest.title || !newTest.class || !newTest.subject || !newTest.maxScore || !newTest.term || !newTest.academicYear) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    const formattedDate = newTest.date.toISOString().split('T')[0];
    const formattedAssignedDate = newTest.assignedDate.toISOString().split('T')[0];
    
    const test = {
      ...newTest,
      id: Date.now().toString(),
      date: formattedDate,
      assignedDate: formattedAssignedDate,
      maxScore: parseInt(newTest.maxScore),
      grades: {}
    };
    
    setTests([...tests, test]);
    setNewTest({
      title: '',
      description: '',
      date: new Date(),
      assignedDate: new Date(),
      subject: selectedSubject,
      class: selectedClass,
      maxScore: '',
      term: null,
      academicYear: null
    });
    setShowTestModal(false);
  };

  const renderStudentItem = ({ item }) => (
    <View style={[styles.studentCard, { 
      backgroundColor: colors.card,
      borderLeftColor: colors.primary 
    }]}>
      <View style={[styles.studentAvatar, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name="person" size={24} color={colors.primary} />
      </View>
      <View style={styles.studentInfo}>
        <Text style={[styles.studentName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.studentClass, { color: colors.textSecondary }]}>{item.class}</Text>
      </View>
      {selectedTest && (
        <View style={styles.gradeInputContainer}>
          <TextInput
            style={[styles.gradeInput, { 
              borderColor: colors.border, 
              backgroundColor: colors.inputBackground,
              color: colors.text 
            }]}
            keyboardType="numeric"
            placeholder="Grade"
            placeholderTextColor={colors.textSecondary}
            onChangeText={(text) => handleUpdateGrade(item.id, text)}
            value={selectedTest.grades[item.id]?.toString() || ''}
          />
          <Text style={[styles.maxScoreText, { color: colors.textSecondary }]}>
            / {selectedTest.maxScore}
          </Text>
        </View>
      )}
    </View>
  );

  const renderTestDetails = () => {
    if (!selectedTest) return null;
    
    return (
      <View style={[styles.testDetailsContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.detailTitle, { color: colors.primary }]}>Test Details</Text>
        
        <View style={styles.detailRow}>
          <View style={styles.detailColumn}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>Title:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{selectedTest.title}</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>Subject:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{selectedTest.subject}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailColumn}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>Class:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{selectedTest.class}</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>Max Score:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{selectedTest.maxScore}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailColumn}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>Term:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{selectedTest.term}</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>Academic Year:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{selectedTest.academicYear}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailColumn}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>Test Date:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{selectedTest.date}</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>Assigned Date:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{selectedTest.assignedDate}</Text>
          </View>
        </View>
        
        <Text style={[styles.detailLabel, { color: colors.text }]}>Description:</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>{selectedTest.description || 'No description'}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primary }]}>Gradebook</Text>
        </View>

        <View style={styles.fixedFilterBar}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.classFilterContainer}
          >
            {classes.map(cls => (
              <TouchableOpacity
                key={cls}
                style={[
                  styles.classFilter,
                  { 
                    backgroundColor: colors.inputBackground,
                    width: screenWidth / 4.5 
                  },
                  selectedClass === cls && [
                    styles.selectedClassFilter, 
                    { backgroundColor: colors.primary }
                  ]
                ]}
                onPress={() => {
                  setSelectedClass(cls);
                  setSelectedSubject(null);
                  setSelectedTest(null);
                  setNewTest(prev => ({ ...prev, class: cls }));
                }}
              >
                <Text 
                  style={[
                    styles.classFilterText,
                    { color: colors.text },
                    selectedClass === cls && styles.selectedClassFilterText
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {cls}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {selectedClass && (
          <View style={[styles.subjectFilterContainer, { backgroundColor: colors.card }]}>
            <RNPickerSelect
              onValueChange={(value) => {
                setSelectedSubject(value);
                setSelectedTest(null);
                setNewTest(prev => ({ ...prev, subject: value }));
              }}
              items={subjects.map(subject => ({ label: subject, value: subject }))}
              value={selectedSubject}
              style={pickerStyles}
              useNativeAndroidPickerStyle={false}
              placeholder={{ label: "Select a subject", value: null }}
              Icon={() => {
                return <Ionicons name="chevron-down" size={20} color={colors.primary} />;
              }}
            />
          </View>
        )}

        {selectedClass && selectedSubject && (
          <View style={[styles.testFilterContainer, { backgroundColor: colors.card }]}>
            <RNPickerSelect
              onValueChange={(value) => {
                const test = filteredTests.find(t => t.id === value);
                setSelectedTest(test);
              }}
              items={filteredTests.map(test => ({ 
                label: test.title, 
                value: test.id 
              }))}
              value={selectedTest?.id}
              style={pickerStyles}
              useNativeAndroidPickerStyle={false}
              placeholder={{ label: "Select a test", value: null }}
              Icon={() => {
                return <Ionicons name="chevron-down" size={20} color={colors.primary} />;
              }}
            />
          </View>
        )}

        {selectedTest && renderTestDetails()}

        {selectedClass && selectedSubject && selectedTest && (
          <>
            <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
              <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search students..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <View style={styles.studentListContainer}>
              <FlatList
                data={filteredStudents}
                renderItem={renderStudentItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Ionicons name="people" size={48} color={colors.primary} />
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No students found</Text>
                  </View>
                }
              />
            </View>
          </>
        )}
      </ScrollView>

      {selectedClass && selectedSubject && selectedTest && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.bottomButton, styles.exportButton, { backgroundColor: colors.secondary }]}
            onPress={handleExportGrades}
          >
            <Text style={styles.bottomButtonText}>Export Grades</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bottomButton, styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmitGrades}
          >
            <Text style={styles.bottomButtonText}>Submit Grades</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedClass && selectedSubject && !selectedTest && (
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowTestModal(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Add Test Modal */}
      <Modal
        visible={showTestModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTestModal(false)}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.modalContainer}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={[styles.modalContent, { 
                backgroundColor: colors.card,
                maxHeight: screenHeight * 0.8 
              }]}
            >
              <ScrollView 
                ref={testModalScrollRef}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={true}
              >
                <Text style={[styles.modalTitle, { color: colors.primary }]}>Add New Test</Text>
                
                <Text style={[styles.inputLabel, { color: colors.text }]}>Class</Text>
                <Text style={[styles.readOnlyValue, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text 
                }]}>
                  {selectedClass}
                </Text>
                
                <Text style={[styles.inputLabel, { color: colors.text }]}>Subject</Text>
                <Text style={[styles.readOnlyValue, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text 
                }]}>
                  {selectedSubject}
                </Text>
                
                <Text style={[styles.inputLabel, { color: colors.text }]}>Title*</Text>
                <TextInput
                  style={[styles.input, { 
                    borderColor: colors.border, 
                    backgroundColor: colors.inputBackground,
                    color: colors.text 
                  }]}
                  placeholder="Test title"
                  placeholderTextColor={colors.textSecondary}
                  value={newTest.title}
                  onChangeText={(text) => setNewTest({...newTest, title: text})}
                />
                
                <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput, { 
                    borderColor: colors.border, 
                    backgroundColor: colors.inputBackground,
                    color: colors.text 
                  }]}
                  placeholder="Test description"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  value={newTest.description}
                  onChangeText={(text) => setNewTest({...newTest, description: text})}
                />
                
                <Text style={[styles.inputLabel, { color: colors.text }]}>Term*</Text>
                <RNPickerSelect
                  onValueChange={(value) => setNewTest({...newTest, term: value})}
                  items={terms.map(term => ({ label: term, value: term }))}
                  value={newTest.term}
                  style={pickerStyles}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{ label: "Select term", value: null }}
                />
                
                <Text style={[styles.inputLabel, { color: colors.text }]}>Academic Year*</Text>
                <RNPickerSelect
                  onValueChange={(value) => setNewTest({...newTest, academicYear: value})}
                  items={academicYears.map(year => ({ label: year, value: year }))}
                  value={newTest.academicYear}
                  style={pickerStyles}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{ label: "Select academic year", value: null }}
                />
                
                <Text style={[styles.inputLabel, { color: colors.text }]}>Test Date*</Text>
                <TouchableOpacity 
                  style={[styles.dateInput, { 
                    borderColor: colors.border, 
                    backgroundColor: colors.inputBackground 
                  }]} 
                  onPress={() => showDatepicker('testDate')}
                >
                  <Text style={[styles.dateText, { color: colors.text }]}>{newTest.date.toLocaleDateString()}</Text>
                  <Ionicons name="calendar" size={20} color={colors.primary} />
                </TouchableOpacity>
                
                <Text style={[styles.inputLabel, { color: colors.text }]}>Assigned Date*</Text>
                <TouchableOpacity 
                  style={[styles.dateInput, { 
                    borderColor: colors.border, 
                    backgroundColor: colors.inputBackground 
                  }]} 
                  onPress={() => showDatepicker('assignedDate')}
                >
                  <Text style={[styles.dateText, { color: colors.text }]}>{newTest.assignedDate.toLocaleDateString()}</Text>
                  <Ionicons name="calendar" size={20} color={colors.primary} />
                </TouchableOpacity>
                
                <Text style={[styles.inputLabel, { color: colors.text }]}>Max Score*</Text>
                <TextInput
                  style={[styles.input, { 
                    borderColor: colors.border, 
                    backgroundColor: colors.inputBackground,
                    color: colors.text 
                  }]}
                  placeholder="Maximum score"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  value={newTest.maxScore}
                  onChangeText={(text) => setNewTest({...newTest, maxScore: text})}
                />
                
                {(showDatePicker || showAssignedDatePicker) && (
                  <DateTimePicker
                    value={datePickerMode === 'testDate' ? newTest.date : newTest.assignedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleDateChange}
                  />
                )}
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.inputBackground }]}
                    onPress={() => setShowTestModal(false)}
                  >
                    <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.addButtonModal, { backgroundColor: colors.primary }]}
                    onPress={handleAddTest}
                  >
                    <Text style={[styles.modalButtonText, { color: 'white' }]}>Add Test</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  fixedFilterBar: {
    marginBottom: 16,
    backgroundColor: 'transparent',
    paddingVertical: 4,
    zIndex: 2,
  },
  classFilterContainer: {
    paddingRight: 16,
  },
  classFilter: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedClassFilter: {},
  classFilterText: {
    fontWeight: '500',
    fontSize: 14,
  },
  selectedClassFilterText: {
    color: 'white',
  },
  subjectFilterContainer: {
    marginBottom: 16,
    borderRadius: 8,
  },
  testFilterContainer: {
    marginBottom: 16,
    borderRadius: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  studentListContainer: {
    maxHeight: Dimensions.get('window').height * 0.5,
  },
  listContent: {
    paddingBottom: 16,
  },
  studentCard: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
    alignItems: 'center',
    borderLeftWidth: 4,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  },
  studentClass: {
    fontSize: 14,
  },
  gradeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradeInput: {
    width: 60,
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    textAlign: 'center',
    marginLeft: 8,
  },
  maxScoreText: {
    marginLeft: 4,
    fontSize: 14,
  },
  testDetailsContainer: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailColumn: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  readOnlyValue: {
    fontSize: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  exportButton: {
    marginRight: 8,
  },
  submitButton: {
    marginLeft: 8,
  },
  bottomButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 20,
    borderRadius: 10,
    padding: 16,
    width: '90%',
    alignSelf: 'center',
  },
  modalScrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {},
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 8,
  },
  addButtonModal: {
    marginLeft: 8,
  },
  modalButtonText: {
    fontWeight: '600',
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
    marginBottom: 16,
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
    marginBottom: 16,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
  placeholder: {
    color: colors.textSecondary,
  },
});

export default GradebookScreen;