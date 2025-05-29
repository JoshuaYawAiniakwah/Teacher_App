import React, { useState, useRef, useEffect } from 'react';
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
import { useTheme } from '../context/themeContext';
import * as ScreenOrientation from 'expo-screen-orientation';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const classes = [
  'Creche', 'Nursery 1', 'Nursery 2', 'KG 1', 'KG 2', 
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'
];

const subjects = [
  'Mathematics', 'English', 'Science', 'Social Studies', 
  'ICT', 'Creative Arts', 'Physical Education', 'French',
  'Religious Studies', 'Ghanaian Language'
];

const mockStudents = [
  {
    id: '1', name: 'Dick Kwamena Norbert', gender: 'Boy', class: 'Grade 1',
    monthlyTest1: 18, monthlyTest2: 19, groupExercise: 10, homeWork: 19,
    classEve1: 10, classEve2: 10, projectWork: 10, endOfTermExam: 60
  },
  {
    id: '2', name: 'Sampson Kelvin Moses', gender: 'Boy', class: 'Grade 1',
    monthlyTest1: 18, monthlyTest2: 20, groupExercise: 10, homeWork: 18,
    classEve1: 10, classEve2: 10, projectWork: 10, endOfTermExam: 52
  },
  {
    id: '3', name: 'Appiah Olygere George', gender: 'Boy', class: 'Grade 1',
    monthlyTest1: 19, monthlyTest2: 19, groupExercise: 10, homeWork: 18,
    classEve1: 10, classEve2: 10, projectWork: 10, endOfTermExam: 50
  },
  {
    id: '4', name: 'Adwoa Mansa', gender: 'Girl', class: 'Grade 2',
    monthlyTest1: 15, monthlyTest2: 17, groupExercise: 9, homeWork: 16,
    classEve1: 8, classEve2: 9, projectWork: 10, endOfTermExam: 55
  },
  {
    id: '5', name: 'Kwame Asante', gender: 'Boy', class: 'Grade 2',
    monthlyTest1: 20, monthlyTest2: 20, groupExercise: 10, homeWork: 20,
    classEve1: 10, classEve2: 10, projectWork: 10, endOfTermExam: 80
  },
  {
    id: '6', name: 'Esi Nyarko', gender: 'Girl', class: 'Grade 3',
    monthlyTest1: 12, monthlyTest2: 14, groupExercise: 8, homeWork: 15,
    classEve1: 7, classEve2: 8, projectWork: 9, endOfTermExam: 45
  },
  {
    id: '7', name: 'Yaw Boateng', gender: 'Boy', class: 'Grade 3',
    monthlyTest1: 17, monthlyTest2: 18, groupExercise: 9, homeWork: 17,
    classEve1: 9, classEve2: 9, projectWork: 10, endOfTermExam: 65
  },
  {
    id: '8', name: 'Ama Serwaa', gender: 'Girl', class: 'Grade 4',
    monthlyTest1: 19, monthlyTest2: 20, groupExercise: 10, homeWork: 19,
    classEve1: 10, classEve2: 10, projectWork: 10, endOfTermExam: 75
  },
  {
    id: '9', name: 'Kofi Mensah', gender: 'Boy', class: 'Grade 4',
    monthlyTest1: 14, monthlyTest2: 16, groupExercise: 8, homeWork: 15,
    classEve1: 8, classEve2: 8, projectWork: 9, endOfTermExam: 48
  },
  {
    id: '10', name: 'Akosua Agyemang', gender: 'Girl', class: 'Grade 5',
    monthlyTest1: 20, monthlyTest2: 20, groupExercise: 10, homeWork: 20,
    classEve1: 10, classEve2: 10, projectWork: 10, endOfTermExam: 90
  },
  {
    id: '11', name: 'Kwabena Osei', gender: 'Boy', class: 'Grade 5',
    monthlyTest1: 16, monthlyTest2: 18, groupExercise: 9, homeWork: 17,
    classEve1: 9, classEve2: 9, projectWork: 9, endOfTermExam: 68
  },
  {
    id: '12', name: 'Abena Konadu', gender: 'Girl', class: 'Grade 6',
    monthlyTest1: 13, monthlyTest2: 15, groupExercise: 7, homeWork: 14,
    classEve1: 7, classEve2: 7, projectWork: 8, endOfTermExam: 42
  }
];

const calculateSBAScore = (student) => (
  student.monthlyTest1 + student.monthlyTest2 + student.groupExercise + 
  student.homeWork + student.classEve1 + student.classEve2 + student.projectWork
);

const calculateSBAPercentage = (sbaScore) => (sbaScore / 100) * 50;
const calculateExamPercentage = (examScore) => (examScore / 100) * 50;
const calculateGrandTotal = (sbaPercentage, examPercentage) => sbaPercentage + examPercentage;

const calculateGrade = (grandTotal) => {
  if (grandTotal >= 80) return 'A';
  if (grandTotal >= 70) return 'B';
  if (grandTotal >= 60) return 'C';
  if (grandTotal >= 50) return 'D';
  if (grandTotal >= 40) return 'E';
  return 'F';
};

const calculatePosition = (students) => {
  const sortedStudents = [...students].sort((a, b) => {
    const aTotal = calculateGrandTotal(
      calculateSBAPercentage(calculateSBAScore(a)),
      calculateExamPercentage(a.endOfTermExam)
    );
    const bTotal = calculateGrandTotal(
      calculateSBAPercentage(calculateSBAScore(b)),
      calculateExamPercentage(b.endOfTermExam)
    );
    return bTotal - aTotal;
  });

  return sortedStudents.map((student, index) => ({
    ...student,
    position: index + 1
  }));
};

const SBAScreen = () => {
  const { colors } = useTheme();
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState(calculatePosition(mockStudents));
  const [editingStudent, setEditingStudent] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [tempStudent, setTempStudent] = useState({
    monthlyTest1: 0, monthlyTest2: 0, groupExercise: 0, homeWork: 0,
    classEve1: 0, classEve2: 0, projectWork: 0, endOfTermExam: 0
  });
  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width > Dimensions.get('window').height ? 'LANDSCAPE' : 'PORTRAIT'
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation(window.width > window.height ? 'LANDSCAPE' : 'PORTRAIT');
    });
    return () => subscription?.remove();
  }, []);

  const tableHeaders = [
    { text: 'SN', flex: 0.5, minWidth: 40 }, // Serial Number
    { text: 'Names', flex: 3, minWidth: 150 }, // Student Names
    { text: 'Gender', flex: 0.8, minWidth: 60 }, // Gender
    { text: 'MT1 (20)', flex: 0.8, minWidth: 60 }, // Monthly Test 1
    { text: 'MT2 (20)', flex: 0.8, minWidth: 60 }, // Monthly Test 2
    { text: 'GE (10)', flex: 0.7, minWidth: 50 }, // Group Exercise
    { text: 'HW (20)', flex: 0.8, minWidth: 60 }, // Homework
    { text: 'CE1 (10)', flex: 0.7, minWidth: 50 }, // Class Exercise 1
    { text: 'CE2 (10)', flex: 0.7, minWidth: 50 }, // Class Exercise 2
    { text: 'PW (10)', flex: 0.7, minWidth: 50 }, // Project Work
    { text: 'SBA (100)', flex: 0.9, minWidth: 70 }, // Total SBA
    { text: '50%', flex: 0.7, minWidth: 50 }, // SBA 50%
    { text: 'Exam (100)', flex: 0.9, minWidth: 70 }, // End of Term Exam
    { text: '50%', flex: 0.7, minWidth: 50 }, // Exam 50%
    { text: 'Total', flex: 0.8, minWidth: 60 }, // Grand Total
    { text: 'Grade', flex: 0.7, minWidth: 50 }, // Grade
    { text: 'Action', flex: 0.9, minWidth: 70 } // Edit Action
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      textAlign: 'center',
      color: colors.primary,
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
      backgroundColor: colors.inputBackground,
      width: orientation === 'PORTRAIT' ? screenWidth / 4.5 : screenWidth / 8
    },
    selectedClassFilter: {
      backgroundColor: colors.primary,
    },
    classFilterText: {
      fontWeight: '500',
      fontSize: 14,
      color: colors.text,
    },
    selectedClassFilterText: {
      color: 'white',
    },
    subjectFilterContainer: {
      marginBottom: 16,
      borderRadius: 8,
      paddingHorizontal: 10,
      backgroundColor: colors.card,
    },
    tableScrollContainer: {
      paddingBottom: 20,
    },
    tableContainer: {
      marginBottom: 16,
      borderRadius: 8,
      overflow: 'hidden',
      minWidth: orientation === 'PORTRAIT' ? screenWidth * 2.5 : screenWidth * 1.5,
    },
    tableHeader: {
      flexDirection: 'row',
      paddingVertical: 12,
      paddingHorizontal: 8,
      backgroundColor: colors.primary,
    },
    headerCellContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 2,
      minWidth: 40, // Minimum width for each cell
    },
    headerCell: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: orientation === 'PORTRAIT' ? 10 : 12,
      textAlign: 'center',
      flex: 1,
    },
    verticalDivider: {
      width: 1,
      height: '80%',
      backgroundColor: 'rgba(255,255,255,0.3)',
      marginLeft: 4,
    },
    studentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    },
    cellContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 2,
      minHeight: 40,
      minWidth: 40, // Minimum width for each cell
    },
    cell: {
      fontSize: orientation === 'PORTRAIT' ? 10 : 12,
      textAlign: 'center',
      flex: 1,
      color: colors.text,
      paddingHorizontal: 2, // Add small horizontal padding
    },
    editButton: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    editButtonText: {
      color: 'white',
      fontSize: orientation === 'PORTRAIT' ? 10 : 12,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
      width: '100%',
    },
    emptyText: {
      marginTop: 16,
      fontSize: 16,
      color: colors.textSecondary,
    },
    exportButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      elevation: 3,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    exportButtonText: {
      color: 'white',
      fontWeight: 'bold',
      marginRight: 8,
    },
    exportIcon: {
      marginLeft: 5,
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
      backgroundColor: colors.card,
      maxHeight: screenHeight * 0.8,
    },
    modalScrollContent: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
      color: colors.primary,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 6,
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderRadius: 6,
      padding: 12,
      marginBottom: 16,
      borderColor: colors.border,
      backgroundColor: colors.inputBackground,
      color: colors.text,
    },
    scoreSummary: {
      marginVertical: 16,
      padding: 12,
      borderRadius: 6,
      backgroundColor: colors.inputBackground,
    },
    summaryText: {
      fontSize: 14,
      marginBottom: 8,
      color: colors.text,
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
      backgroundColor: colors.inputBackground,
    },
    saveButton: {
      marginLeft: 8,
      backgroundColor: colors.primary,
    },
    modalButtonText: {
      fontWeight: '600',
    },
  });

  const pickerStyles = {
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
  };

  const filteredStudents = selectedClass 
    ? students.filter(student => student.class === selectedClass)
    : students;

  const handleEdit = (student) => {
    setEditingStudent(student);
    setTempStudent({
      monthlyTest1: student.monthlyTest1,
      monthlyTest2: student.monthlyTest2,
      groupExercise: student.groupExercise,
      homeWork: student.homeWork,
      classEve1: student.classEve1,
      classEve2: student.classEve2,
      projectWork: student.projectWork,
      endOfTermExam: student.endOfTermExam
    });
    setEditModalVisible(true);
  };

  const handleSave = () => {
    if (editingStudent) {
      const updatedStudents = students.map(student => 
        student.id === editingStudent.id ? { ...student, ...tempStudent } : student
      );
      setStudents(calculatePosition(updatedStudents));
      setEditModalVisible(false);
    }
  };

  const handleScoreChange = (field, value) => {
    let numValue = parseInt(value) || 0;
    const maxValues = {
      monthlyTest1: 20, monthlyTest2: 20, groupExercise: 10,
      homeWork: 20, classEve1: 10, classEve2: 10,
      projectWork: 10, endOfTermExam: 100
    };
    numValue = Math.min(maxValues[field], Math.max(0, numValue));
    setTempStudent(prev => ({ ...prev, [field]: numValue }));
  };

  const exportToAdmin = () => {
    if (!selectedClass || !selectedSubject) {
      Alert.alert('Error', 'Please select both class and subject before exporting');
      return;
    }

    const dataToExport = {
      class: selectedClass,
      subject: selectedSubject,
      students: filteredStudents,
      exportedAt: new Date().toISOString()
    };

    console.log('Exporting data:', dataToExport);
    Alert.alert('Success', 'SBA data has been exported to admin successfully!');
  };

  const renderStudentItem = ({ item }) => {
    const sbaScore = calculateSBAScore(item);
    const sbaPercentage = calculateSBAPercentage(sbaScore);
    const examPercentage = calculateExamPercentage(item.endOfTermExam);
    const grandTotal = calculateGrandTotal(sbaPercentage, examPercentage);
    const grade = calculateGrade(grandTotal);

    const cellData = [
      item.position,
      item.name,
      item.gender,
      item.monthlyTest1,
      item.monthlyTest2,
      item.groupExercise,
      item.homeWork,
      item.classEve1,
      item.classEve2,
      item.projectWork,
      sbaScore,
      sbaPercentage.toFixed(0),
      item.endOfTermExam,
      examPercentage.toFixed(0),
      grandTotal.toFixed(0),
      grade
    ];

    return (
      <View style={styles.studentRow}>
        {tableHeaders.map((header, index) => {
          // Skip the last header (Action) for now
          if (index === tableHeaders.length - 1) return null;
          
          return (
            <View 
              key={index} 
              style={[
                styles.cellContainer, 
                { 
                  flex: header.flex,
                  minWidth: header.minWidth,
                  justifyContent: 'center'
                }
              ]}
            >
              <Text 
                style={[
                  styles.cell,
                  { 
                    width: '100%',
                    textAlign: 'center'
                  }
                ]} 
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {cellData[index]}
              </Text>
              {index < tableHeaders.length - 2 && <View style={styles.verticalDivider} />}
            </View>
          );
        })}
        {/* Action Cell */}
        <View style={[
          styles.cellContainer, 
          { 
            flex: tableHeaders[tableHeaders.length - 1].flex,
            minWidth: tableHeaders[tableHeaders.length - 1].minWidth
          }
        ]}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEdit(item)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>SBA Records</Text>
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
                  selectedClass === cls && styles.selectedClassFilter
                ]}
                onPress={() => {
                  setSelectedClass(cls);
                  setSelectedSubject(null);
                }}
              >
                <Text 
                  style={[
                    styles.classFilterText,
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
          <View style={styles.subjectFilterContainer}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedSubject(value)}
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
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.tableScrollContainer}
          >
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                {tableHeaders.map((header, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.headerCellContainer, 
                      { 
                        flex: header.flex,
                        minWidth: header.minWidth,
                        justifyContent: 'center'
                      }
                    ]}
                  >
                    <Text 
                      style={styles.headerCell} 
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {header.text}
                    </Text>
                    {index < tableHeaders.length - 1 && <View style={styles.verticalDivider} />}
                  </View>
                ))}
              </View>

              <FlatList
                data={filteredStudents}
                renderItem={renderStudentItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Ionicons name="people" size={48} color={colors.primary} />
                    <Text style={styles.emptyText}>
                      No students found
                    </Text>
                  </View>
                }
              />
            </View>
          </ScrollView>
        )}
      </ScrollView>

      {selectedClass && selectedSubject && (
        <TouchableOpacity 
          style={styles.exportButton}
          onPress={exportToAdmin}
        >
          <Text style={styles.exportButtonText}>Export to Admin</Text>
          <Ionicons name="cloud-upload" size={20} color="white" style={styles.exportIcon} />
        </TouchableOpacity>
      )}

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalContainer}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContent}
            >
              <ScrollView contentContainerStyle={styles.modalScrollContent}>
                <Text style={styles.modalTitle}>
                  Edit Scores for {editingStudent?.name}
                </Text>

                {[
                  { label: 'Monthly Test 1 (20)', field: 'monthlyTest1' },
                  { label: 'Monthly Test 2 (20)', field: 'monthlyTest2' },
                  { label: 'Group Exercise (10)', field: 'groupExercise' },
                  { label: 'Home Work (20)', field: 'homeWork' },
                  { label: 'Class Exe 1 (10)', field: 'classEve1' },
                  { label: 'Class Exe 2 (10)', field: 'classEve2' },
                  { label: 'Project Work (10)', field: 'projectWork' },
                  { label: 'End of Term Exam (100)', field: 'endOfTermExam' }
                ].map(({ label, field }) => (
                  <React.Fragment key={field}>
                    <Text style={styles.inputLabel}>{label}</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={tempStudent[field].toString()}
                      onChangeText={(text) => handleScoreChange(field, text)}
                    />
                  </React.Fragment>
                ))}

                <View style={styles.scoreSummary}>
                  <Text style={styles.summaryText}>
                    SBA Score: {calculateSBAScore(tempStudent)}
                  </Text>
                  <Text style={styles.summaryText}>
                    SBA 50%: {calculateSBAPercentage(calculateSBAScore(tempStudent)).toFixed(0)}
                  </Text>
                  <Text style={styles.summaryText}>
                    Exam 50%: {calculateExamPercentage(tempStudent.endOfTermExam).toFixed(0)}
                  </Text>
                  <Text style={styles.summaryText}>
                    Grand Total: {calculateGrandTotal(
                      calculateSBAPercentage(calculateSBAScore(tempStudent)),
                      calculateExamPercentage(tempStudent.endOfTermExam)
                    ).toFixed(0)}
                  </Text>
                  <Text style={styles.summaryText}>
                    Grade: {calculateGrade(
                      calculateGrandTotal(
                        calculateSBAPercentage(calculateSBAScore(tempStudent)),
                        calculateExamPercentage(tempStudent.endOfTermExam)
                      )
                    )}
                  </Text>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setEditModalVisible(false)}
                  >
                    <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSave}
                  >
                    <Text style={[styles.modalButtonText, { color: 'white' }]}>Save</Text>
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

export default SBAScreen;