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

const mockAssignments = [
  {
    id: '1',
    title: 'Math Worksheet',
    description: 'Complete problems 1-20 on page 45',
    dueDate: '2023-05-15',
    subject: 'Mathematics',
    class: 'Grade 1',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Science Project',
    description: 'Create a model of the solar system',
    dueDate: '2023-05-20',
    subject: 'Science',
    class: 'Grade 1',
    status: 'submitted'
  },
  {
    id: '3',
    title: 'Reading Assignment',
    description: 'Read chapters 3-5 and write summary',
    dueDate: '2023-05-10',
    subject: 'English',
    class: 'Grade 2',
    status: 'missing'
  },
];

const AssignmentScreen = () => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignments, setAssignments] = useState(mockAssignments);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: new Date(),
    subject: null,
    class: null
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const styles = createStyles(colors);
  const pickerStyles = createPickerStyles(colors);
  const assignmentModalScrollRef = useRef(null);

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

  // Filter assignments by selected class and subject
  const filteredAssignments = selectedClass && selectedSubject
    ? assignments.filter(assignment => 
        assignment.class === selectedClass && 
        assignment.subject === selectedSubject
      )
    : [];

  const handleMarkCollected = (studentId) => {
    Alert.alert('Success', `Assignment marked as collected for student ID: ${studentId}`);
  };

  const handleMarkMissing = (studentId) => {
    Alert.alert('Success', `Assignment marked as missing for student ID: ${studentId}`);
  };

  const handleReportMissing = () => {
    Alert.alert('Success', 'Missing assignments reported to admin');
  };

  const handleSubmitRecords = () => {
    Alert.alert('Success', 'Assignment records submitted to admin');
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || newAssignment.dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setNewAssignment({...newAssignment, dueDate: currentDate});
  };

  const showDatepicker = () => {
    setTempDate(newAssignment.dueDate);
    setShowDatePicker(true);
  };

  const handleAddAssignment = () => {
    if (!newAssignment.title || !newAssignment.class || !newAssignment.subject) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    const formattedDate = newAssignment.dueDate.toISOString().split('T')[0];
    
    const assignment = {
      ...newAssignment,
      id: Date.now().toString(),
      dueDate: formattedDate,
      status: 'pending'
    };
    
    setAssignments([...assignments, assignment]);
    setNewAssignment({
      title: '',
      description: '',
      dueDate: new Date(),
      subject: selectedSubject,
      class: selectedClass
    });
    setShowAssignmentModal(false);
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
      {selectedAssignment && (
        <View style={styles.assignmentActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.collectedButton, { backgroundColor: colors.primary }]}
            onPress={() => handleMarkCollected(item.id)}
          >
            <Text style={styles.actionButtonText}>Collected</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.missingButton, { backgroundColor: colors.error }]}
            onPress={() => handleMarkMissing(item.id)}
          >
            <Text style={styles.actionButtonText}>Missing</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderAssignmentDetails = () => {
    if (!selectedAssignment) return null;
    
    return (
      <View style={[styles.assignmentDetailsContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.detailTitle, { color: colors.primary }]}>Assignment Details</Text>
        <Text style={[styles.detailLabel, { color: colors.text }]}>Title:</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>{selectedAssignment.title}</Text>
        
        <Text style={[styles.detailLabel, { color: colors.text }]}>Subject:</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>{selectedAssignment.subject}</Text>
        
        <Text style={[styles.detailLabel, { color: colors.text }]}>Due Date:</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>{selectedAssignment.dueDate}</Text>
        
        <Text style={[styles.detailLabel, { color: colors.text }]}>Description:</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>{selectedAssignment.description}</Text>
        
        <Text style={[styles.detailLabel, { color: colors.text }]}>Status:</Text>
        <Text style={[
          styles.detailValue,
          { color: colors.text },
          selectedAssignment.status === 'submitted' && styles.statusSubmitted,
          selectedAssignment.status === 'missing' && styles.statusMissing
        ]}>
          {selectedAssignment.status === 'submitted' ? 'Submitted' : 
           selectedAssignment.status === 'missing' ? 'Missing' : 'Pending'}
        </Text>
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
          <Text style={[styles.title, { color: colors.primary }]}>Assignments</Text>
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
                  setSelectedAssignment(null);
                  setNewAssignment(prev => ({ ...prev, class: cls }));
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
                setSelectedAssignment(null);
                setNewAssignment(prev => ({ ...prev, subject: value }));
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
          <View style={[styles.assignmentFilterContainer, { backgroundColor: colors.card }]}>
            <RNPickerSelect
              onValueChange={(value) => {
                const assignment = filteredAssignments.find(a => a.id === value);
                setSelectedAssignment(assignment);
              }}
              items={filteredAssignments.map(assignment => ({ 
                label: assignment.title, 
                value: assignment.id 
              }))}
              value={selectedAssignment?.id}
              style={pickerStyles}
              useNativeAndroidPickerStyle={false}
              placeholder={{ label: "Select an assignment", value: null }}
              Icon={() => {
                return <Ionicons name="chevron-down" size={20} color={colors.primary} />;
              }}
            />
          </View>
        )}

        {selectedAssignment && renderAssignmentDetails()}

        {selectedClass && selectedSubject && selectedAssignment && (
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

      {selectedClass && selectedSubject && selectedAssignment && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.bottomButton, styles.reportButton, { backgroundColor: colors.error }]}
            onPress={handleReportMissing}
          >
            <Text style={styles.bottomButtonText}>Report Missing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bottomButton, styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmitRecords}
          >
            <Text style={styles.bottomButtonText}>Submit Records</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedClass && selectedSubject && !selectedAssignment && (
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowAssignmentModal(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Add Assignment Modal */}
      <Modal
        visible={showAssignmentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAssignmentModal(false)}
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
                ref={assignmentModalScrollRef}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={true}
              >
                <Text style={[styles.modalTitle, { color: colors.primary }]}>Add New Assignment</Text>
                
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
                  placeholder="Assignment title"
                  placeholderTextColor={colors.textSecondary}
                  value={newAssignment.title}
                  onChangeText={(text) => setNewAssignment({...newAssignment, title: text})}
                />
                
                <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput, { 
                    borderColor: colors.border, 
                    backgroundColor: colors.inputBackground,
                    color: colors.text 
                  }]}
                  placeholder="Assignment description"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  value={newAssignment.description}
                  onChangeText={(text) => setNewAssignment({...newAssignment, description: text})}
                />
                
                <Text style={[styles.inputLabel, { color: colors.text }]}>Due Date*</Text>
                <TouchableOpacity 
                  style={[styles.dateInput, { 
                    borderColor: colors.border, 
                    backgroundColor: colors.inputBackground 
                  }]} 
                  onPress={showDatepicker}
                >
                  <Text style={[styles.dateText, { color: colors.text }]}>{newAssignment.dueDate.toLocaleDateString()}</Text>
                  <Ionicons name="calendar" size={20} color={colors.primary} />
                </TouchableOpacity>
                
                {showDatePicker && (
                  <DateTimePicker
                    value={newAssignment.dueDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleDateChange}
                  />
                )}
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.inputBackground }]}
                    onPress={() => setShowAssignmentModal(false)}
                  >
                    <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.addButtonModal, { backgroundColor: colors.primary }]}
                    onPress={handleAddAssignment}
                  >
                    <Text style={[styles.modalButtonText, { color: 'white' }]}>Add Assignment</Text>
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
  assignmentFilterContainer: {
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
  assignmentActions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
  collectedButton: {},
  missingButton: {},
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  assignmentDetailsContainer: {
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
  statusSubmitted: {
    color: '#2ecc71',
    fontWeight: '600',
  },
  statusMissing: {
    color: '#e74c3c',
    fontWeight: '600',
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
  reportButton: {},
  submitButton: {},
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
  cancelButton: {},
  addButtonModal: {},
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

export default AssignmentScreen;