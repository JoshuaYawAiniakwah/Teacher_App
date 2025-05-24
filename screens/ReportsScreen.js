import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  Dimensions,
  Modal,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
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

const currentYear = new Date().getFullYear();
const attendanceOptions = [
  { label: '2022/2023 Academic Year', value: '2022-2023' },
  { label: '2023/2024 Academic Year', value: '2023-2024' },
  { label: 'January 2023', value: 'january-2023' },
  { label: 'February 2023', value: 'february-2023' },
  { label: 'March 2023', value: 'march-2023' },
  { label: 'April 2023', value: 'april-2023' },
  { label: 'May 2023', value: 'may-2023' },
  { label: 'June 2023', value: 'june-2023' },
  { label: 'July 2023', value: 'july-2023' },
  { label: 'August 2023', value: 'august-2023' },
  { label: 'September 2023', value: 'september-2023' },
  { label: 'October 2023', value: 'october-2023' },
  { label: 'November 2023', value: 'november-2023' },
  { label: 'December 2023', value: 'december-2023' },
  { label: 'January 2024', value: 'january-2024' },
  { label: 'February 2024', value: 'february-2024' },
  { label: 'March 2024', value: 'march-2024' },
  { label: 'April 2024', value: 'april-2024' },
  { label: 'May 2024', value: 'may-2024' },
  { label: 'June 2024', value: 'june-2024' },
  { label: 'July 2024', value: 'july-2024' },
  { label: 'August 2024', value: 'august-2024' },
  { label: 'September 2024', value: 'september-2024' },
  { label: 'October 2024', value: 'october-2024' },
  { label: 'November 2024', value: 'november-2024' },
  { label: 'December 2024', value: 'december-2024' },
  { label: 'Weekly', value: 'weekly' }
];

const mockGrades = {
  'Mathematics': [
    { type: 'Test 1', score: '85%', date: '2023-05-15' },
    { type: 'Test 2', score: '90%', date: '2023-05-20' },
    { type: 'Assignment', score: '90%', date: '2023-05-10' },
    { type: 'Exam', score: '78%', date: '2023-05-25' },
  ],
  'English': [
    { type: 'Test 1', score: '92%', date: '2023-05-12' },
    { type: 'Test 2', score: '88%', date: '2023-05-19' },
    { type: 'Assignment', score: '88%', date: '2023-05-08' },
  ],
  'Science': [
    { type: 'Test 1', score: '76%', date: '2023-05-18' },
    { type: 'Test 2', score: '84%', date: '2023-05-22' },
    { type: 'Exam', score: '82%', date: '2023-05-25' },
  ],
  'Social Studies': [
    { type: 'Test 1', score: '89%', date: '2023-05-15' },
    { type: 'Test 2', score: '93%', date: '2023-05-22' },
    { type: 'Assignment', score: '95%', date: '2023-05-05' },
  ],
};

const calculateTestAverage = (subjectGrades) => {
  // Get only Test 1 and Test 2
  const test1 = subjectGrades.find(grade => grade.type === 'Test 1');
  const test2 = subjectGrades.find(grade => grade.type === 'Test 2');
  
  // Return null if either test is missing
  if (!test1 || !test2) return null;
  
  // Parse scores and handle NaN cases
  const score1 = parseInt(test1.score) || 0;
  const score2 = parseInt(test2.score) || 0;
  
  // Calculate average of just Test 1 and Test 2
  const average = (score1 + score2) / 2;
  return `${Math.round(average)}%`;
};

const attendanceData = {
  '2022-2023': [
    { term: '1st Term 2022/2023', present: 45, absent: 5 },
    { term: '2nd Term 2022/2023', present: 40, absent: 8 },
    { term: '3rd Term 2022/2023', present: 42, absent: 6 },
  ],
  '2023-2024': [
    { term: '1st Term 2023/2024', present: 48, absent: 2 },
    { term: '2nd Term 2023/2024', present: 43, absent: 5 },
    { term: '3rd Term 2023/2024', present: 44, absent: 4 },
  ],
  weekly: [
    { week: 'Week 1', present: 4, absent: 1 },
    { week: 'Week 2', present: 5, absent: 0 },
    { week: 'Week 3', present: 3, absent: 2 },
    { week: 'Week 4', present: 5, absent: 0 },
  ],
  'january-2023': { present: 18, absent: 2, month: 'January 2023' },
  'february-2023': { present: 16, absent: 4, month: 'February 2023' },
  'march-2023': { present: 20, absent: 1, month: 'March 2023' },
  'april-2023': { present: 19, absent: 1, month: 'April 2023' },
  'may-2023': { present: 17, absent: 3, month: 'May 2023' },
  'june-2023': { present: 16, absent: 4, month: 'June 2023' },
  'july-2023': { present: 18, absent: 2, month: 'July 2023' },
  'august-2023': { present: 20, absent: 0, month: 'August 2023' },
  'september-2023': { present: 19, absent: 1, month: 'September 2023' },
  'october-2023': { present: 18, absent: 2, month: 'October 2023' },
  'november-2023': { present: 17, absent: 3, month: 'November 2023' },
  'december-2023': { present: 15, absent: 5, month: 'December 2023' },
  'january-2024': { present: 19, absent: 1, month: 'January 2024' },
  'february-2024': { present: 17, absent: 3, month: 'February 2024' },
  'march-2024': { present: 21, absent: 0, month: 'March 2024' },
  'april-2024': { present: 20, absent: 1, month: 'April 2024' },
  'may-2024': { present: 18, absent: 2, month: 'May 2024' },
  'june-2024': { present: 17, absent: 3, month: 'June 2024' },
  'july-2024': { present: 19, absent: 1, month: 'July 2024' },
  'august-2024': { present: 22, absent: 0, month: 'August 2024' },
  'september-2024': { present: 20, absent: 1, month: 'September 2024' },
  'october-2024': { present: 19, absent: 2, month: 'October 2024' },
  'november-2024': { present: 18, absent: 3, month: 'November 2024' },
  'december-2024': { present: 16, absent: 5, month: 'December 2024' },
};

const ReportsScreen = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedAttendanceOption, setSelectedAttendanceOption] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportDescription, setSupportDescription] = useState('');
  const [gradeDescription, setGradeDescription] = useState('');
  const [attendanceDescription, setAttendanceDescription] = useState('');

  const attendanceScrollRef = useRef(null);
  const gradeScrollRef = useRef(null);
  const supportScrollRef = useRef(null);

  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors, screenWidth, isDarkMode);

  const filteredStudents = selectedClass 
    ? mockStudents.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass = student.class === selectedClass;
        return matchesSearch && matchesClass;
      })
    : [];

  const handleSubmitAttendance = () => {
    Alert.alert('Success', `Attendance report for ${selectedStudent?.name} submitted`);
    setShowAttendanceModal(false);
    setAttendanceDescription('');
    setSelectedAttendanceOption(null);
  };

  const handleSendGradeReport = () => {
    Alert.alert('Success', `Grade report for ${selectedStudent?.name} in ${selectedSubject} sent to admin`);
    setShowGradeModal(false);
    setGradeDescription('');
    setSelectedSubject(null);
  };

  const handleSendSupportReport = () => {
    Alert.alert('Success', `Support report for ${selectedStudent?.name} in ${selectedSubject} sent to admin`);
    setShowSupportModal(false);
    setSupportDescription('');
    setSelectedSubject(null);
  };

  const handleAttendanceOptionChange = (option) => {
    setSelectedAttendanceOption(option);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const isAttendanceFormComplete = selectedAttendanceOption && attendanceDescription.trim().length > 0;
  const isGradeFormComplete = selectedSubject && gradeDescription.trim().length > 0;
  const isSupportFormComplete = selectedSubject && supportDescription.trim().length > 0;

  const renderStudentItem = ({ item }) => (
    <View style={[styles.studentCard, { borderLeftColor: colors.primary }]}>
      <View style={[styles.studentAvatar, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name="person" size={24} color={colors.primary} />
      </View>
      <View style={styles.studentInfo}>
        <Text style={[styles.studentName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.studentClass, { color: colors.textSecondary }]}>{item.class}</Text>
      </View>
      <TouchableOpacity 
        style={[styles.reportButton, { backgroundColor: colors.primary }]}
        onPress={() => {
          setSelectedStudent(item);
          if (activeTab === 'attendance') {
            setShowAttendanceModal(true);
          } else if (activeTab === 'grades') {
            setShowGradeModal(true);
          } else {
            setShowSupportModal(true);
          }
        }}
      >
        <Text style={styles.reportButtonText}>
          {activeTab === 'attendance' ? 'Attendance' : 
           activeTab === 'grades' ? 'Grades' : 'Support'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAttendanceItems = () => {
    if (!selectedAttendanceOption) return null;
    
    if (selectedAttendanceOption === '2022-2023' || selectedAttendanceOption === '2023-2024') {
      return attendanceData[selectedAttendanceOption].map((item, index) => (
        <View key={index} style={[styles.attendanceItem, { borderBottomColor: colors.border }]}>
          <Text style={[styles.attendancePeriod, { color: colors.text }]}>{item.term}</Text>
          <View style={styles.attendanceStats}>
            <Text style={[styles.presentText, { color: colors.success }]}>Present: {item.present} days</Text>
            <Text style={[styles.absentText, { color: colors.error }]}>Absent: {item.absent} days</Text>
          </View>
        </View>
      ));
    } else if (selectedAttendanceOption === 'weekly') {
      return attendanceData.weekly.map((item, index) => (
        <View key={index} style={[styles.attendanceItem, { borderBottomColor: colors.border }]}>
          <Text style={[styles.attendancePeriod, { color: colors.text }]}>{item.week}</Text>
          <View style={styles.attendanceStats}>
            <Text style={[styles.presentText, { color: colors.success }]}>Present: {item.present} days</Text>
            <Text style={[styles.absentText, { color: colors.error }]}>Absent: {item.absent} days</Text>
          </View>
        </View>
      ));
    } else if (selectedAttendanceOption.includes('-20')) {
      const monthData = attendanceData[selectedAttendanceOption];
      return (
        <View style={[styles.monthAttendanceContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.monthTitle, { color: colors.primary }]}>{monthData.month}</Text>
          <View style={styles.attendanceStats}>
            <Text style={[styles.presentText, { color: colors.success }]}>Present: {monthData.present} days</Text>
            <Text style={[styles.absentText, { color: colors.error }]}>Absent: {monthData.absent} days</Text>
          </View>
        </View>
      );
    }
    return null;
  };

  const renderGradeItems = () => {
    if (!selectedSubject || !mockGrades[selectedSubject]) return null;
    
    const subjectGrades = mockGrades[selectedSubject];
    const testAverage = calculateTestAverage(subjectGrades);
    
    return (
      <View>
        {testAverage && (
          <View style={[styles.averageContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.averageLabel, { color: colors.text }]}>Test Average:</Text>
            <Text style={[styles.averageValue, { color: colors.primary }]}>{testAverage}</Text>
          </View>
        )}
        
        {subjectGrades.map((item, index) => (
          <View key={index} style={[styles.gradeDetailItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.gradeType, { color: colors.text }]}>{item.type}</Text>
            <View style={styles.gradeScoreContainer}>
              <Text style={[styles.gradeScore, { color: colors.primary }]}>{item.score}</Text>
              <Text style={[styles.gradeDate, { color: colors.textSecondary }]}>{item.date}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const pickerSelectStyles = {
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 8,
      color: colors.text,
      paddingRight: 30,
      backgroundColor: colors.card,
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
      backgroundColor: colors.card,
      marginBottom: 16,
    },
    iconContainer: {
      top: 10,
      right: 12,
    },
    placeholder: {
      color: colors.textSecondary,
    },
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Reports</Text>
      </View>

      <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'attendance' && [styles.activeTab, { backgroundColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('attendance')}
        >
          <Text style={[
            styles.tabButtonText,
            { color: colors.text },
            activeTab === 'attendance' && styles.activeTabText
          ]}>Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'grades' && [styles.activeTab, { backgroundColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('grades')}
        >
          <Text style={[
            styles.tabButtonText,
            { color: colors.text },
            activeTab === 'grades' && styles.activeTabText
          ]}>Grades</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'support' && [styles.activeTab, { backgroundColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('support')}
        >
          <Text style={[
            styles.tabButtonText,
            { color: colors.text },
            activeTab === 'support' && styles.activeTabText
          ]}>Support Needed</Text>
        </TouchableOpacity>
      </View>

      {!selectedClass ? (
        <View style={styles.classSelectionContainer}>
          <Text style={[styles.classSelectionText, { color: colors.textSecondary }]}>
            Please select a class to view reports
          </Text>
        </View>
      ) : (
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

          <FlatList
            data={filteredStudents}
            renderItem={renderStudentItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="people" size={48} color={colors.primary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No students found</Text>
              </View>
            }
          />
        </>
      )}

      <View style={[styles.fixedFilterBar, { backgroundColor: colors.background }]}>
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
                selectedClass === cls && styles.selectedClassFilter,
                { 
                  width: screenWidth / 4.5,
                  backgroundColor: selectedClass === cls ? colors.primary : colors.card,
                }
              ]}
              onPress={() => setSelectedClass(cls)}
            >
              <Text 
                style={[
                  styles.classFilterText,
                  { color: selectedClass === cls ? 'white' : colors.text }
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

      {/* Attendance Modal */}
      <Modal
        visible={showAttendanceModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAttendanceModal(false)}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.modalContainer}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={[styles.modalContent, { 
                maxHeight: screenHeight * 0.8,
                backgroundColor: colors.card 
              }]}
            >
              <ScrollView 
                ref={attendanceScrollRef}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={true}
              >
                <Text style={[styles.modalTitle, { color: colors.primary }]}>
                  {selectedStudent?.name}'s Attendance
                </Text>
                
                <View style={styles.pickerContainer}>
                  <RNPickerSelect
                    onValueChange={handleAttendanceOptionChange}
                    items={attendanceOptions}
                    value={selectedAttendanceOption}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    placeholder={{ label: "Select time period (required)", value: null }}
                    Icon={() => {
                      return <Ionicons name="chevron-down" size={20} color={colors.primary} />;
                    }}
                  />
                </View>
                
                {renderAttendanceItems()}
                
                <TextInput
                  style={[
                    styles.descriptionInput, 
                    { 
                      borderColor: colors.border,
                      backgroundColor: colors.card,
                      color: colors.text 
                    }
                  ]}
                  placeholder="Add description (required)"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  value={attendanceDescription}
                  onChangeText={setAttendanceDescription}
                />
                
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.border }]}
                    onPress={() => {
                      setShowAttendanceModal(false);
                      setSelectedAttendanceOption(null);
                      setAttendanceDescription('');
                    }}
                  >
                    <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalButton, 
                      styles.submitButton, 
                      { backgroundColor: colors.primary },
                      !isAttendanceFormComplete && styles.disabledButton
                    ]}
                    onPress={handleSubmitAttendance}
                    disabled={!isAttendanceFormComplete}
                  >
                    <Text style={styles.modalButtonText}>Submit Attendance</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Grade Modal */}
      <Modal
        visible={showGradeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGradeModal(false)}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.modalContainer}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={[styles.modalContent, { 
                maxHeight: screenHeight * 0.8,
                backgroundColor: colors.card 
              }]}
            >
              <ScrollView 
                ref={gradeScrollRef}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={true}
              >
                <Text style={[styles.modalTitle, { color: colors.primary }]}>
                  {selectedStudent?.name}'s Grades
                </Text>
                
                <View style={styles.pickerContainer}>
                  <RNPickerSelect
                    onValueChange={(value) => setSelectedSubject(value)}
                    items={subjects.map(subject => ({ label: subject, value: subject }))}
                    value={selectedSubject}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    placeholder={{ label: "Select a subject (required)", value: null }}
                    Icon={() => {
                      return <Ionicons name="chevron-down" size={20} color={colors.primary} />;
                    }}
                  />
                </View>
                
                {renderGradeItems()}
                
                <TextInput
                  style={[
                    styles.descriptionInput, 
                    { 
                      borderColor: colors.border,
                      backgroundColor: colors.card,
                      color: colors.text 
                    }
                  ]}
                  placeholder="Add description (required)"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  value={gradeDescription}
                  onChangeText={setGradeDescription}
                />
                
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.border }]}
                    onPress={() => {
                      setShowGradeModal(false);
                      setSelectedSubject(null);
                      setGradeDescription('');
                    }}
                  >
                    <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalButton, 
                      styles.submitButton, 
                      { backgroundColor: colors.primary },
                      !isGradeFormComplete && styles.disabledButton
                    ]}
                    onPress={handleSendGradeReport}
                    disabled={!isGradeFormComplete}
                  >
                    <Text style={styles.modalButtonText}>Send Report</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Support Modal */}
      <Modal
        visible={showSupportModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSupportModal(false)}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.modalContainer}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={[styles.modalContent, { 
                maxHeight: screenHeight * 0.8,
                backgroundColor: colors.card 
              }]}
            >
              <ScrollView 
                ref={supportScrollRef}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={true}
              >
                <Text style={[styles.modalTitle, { color: colors.primary }]}>
                  Support for {selectedStudent?.name}
                </Text>
                
                <View style={styles.pickerContainer}>
                  <RNPickerSelect
                    onValueChange={(value) => setSelectedSubject(value)}
                    items={subjects.map(subject => ({ label: subject, value: subject }))}
                    value={selectedSubject}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    placeholder={{ label: "Select a subject (required)", value: null }}
                    Icon={() => {
                      return <Ionicons name="chevron-down" size={20} color={colors.primary} />;
                    }}
                  />
                </View>
                
                <TextInput
                  style={[
                    styles.descriptionInput, 
                    { 
                      minHeight: 100,
                      borderColor: colors.border,
                      backgroundColor: colors.card,
                      color: colors.text 
                    }
                  ]}
                  placeholder="Describe the support needed (required)"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  value={supportDescription}
                  onChangeText={setSupportDescription}
                />
                
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.border }]}
                    onPress={() => {
                      setShowSupportModal(false);
                      setSelectedSubject(null);
                      setSupportDescription('');
                    }}
                  >
                    <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalButton, 
                      styles.submitButton, 
                      { backgroundColor: colors.primary },
                      !isSupportFormComplete && styles.disabledButton
                    ]}
                    onPress={handleSendSupportReport}
                    disabled={!isSupportFormComplete}
                  >
                    <Text style={styles.modalButtonText}>Generate Report</Text>
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

const createStyles = (colors, screenWidth, isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
  activeTabText: {
    color: 'white',
  },
  classSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  classSelectionText: {
    fontSize: 16,
    textAlign: 'center',
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
  fixedFilterBar: {
    marginBottom: 16,
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
  listContent: {
    paddingBottom: 20,
  },
  studentCard: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
    alignItems: 'center',
    borderLeftWidth: 4,
    backgroundColor: colors.card,
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
  reportButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  reportButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
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
  pickerContainer: {
    marginBottom: 16,
  },
  modalButtonContainer: {
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
  submitButton: {},
  disabledButton: {
    backgroundColor: colors.disabled,
  },
  modalButtonText: {
    fontWeight: '600',
    fontSize: 16,
    color: 'white',
  },
  gradeDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  gradeType: {
    fontSize: 14,
  },
  gradeScoreContainer: {
    alignItems: 'flex-end',
  },
  gradeScore: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  gradeDate: {
    fontSize: 12,
  },
  averageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  averageLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  averageValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  attendanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  attendancePeriod: {
    fontSize: 14,
  },
  attendanceStats: {
    alignItems: 'flex-end',
  },
  presentText: {
    fontSize: 14,
  },
  absentText: {
    fontSize: 14,
  },
  monthAttendanceContainer: {
    marginBottom: 16,
    padding: 10,
    borderRadius: 8,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
});

export default ReportsScreen;