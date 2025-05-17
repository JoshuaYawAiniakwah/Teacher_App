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
  Dimensions,
  Modal,
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/themeContext';

const mockStudents = [
  { id: '1', name: 'Ama Asantewaa', class: 'Creche', grade: 'A', attendance: '92%', performance: 'Excellent' },
  { id: '2', name: 'Kwame Nkrumah', class: 'Nursery 1', grade: 'B', attendance: '85%', performance: 'Good' },
  { id: '3', name: 'Yaw Boateng', class: 'Nursery 2', grade: 'A-', attendance: '95%', performance: 'Very Good' },
  { id: '4', name: 'Esi Mensah', class: 'KG 1', grade: 'C+', attendance: '78%', performance: 'Average' },
  { id: '5', name: 'Kofi Addo', class: 'KG 2', grade: 'B+', attendance: '88%', performance: 'Good' },
  { id: '6', name: 'Abena Serwaa', class: 'Grade 1', grade: 'A', attendance: '93%', performance: 'Excellent' },
  { id: '7', name: 'Yaa Nkrumah', class: 'Grade 2', grade: 'B-', attendance: '82%', performance: 'Satisfactory' },
  { id: '8', name: 'Kwabena Osei', class: 'Grade 3', grade: 'C', attendance: '75%', performance: 'Needs Improvement' },
  { id: '9', name: 'Ama Ampofo', class: 'Grade 4', grade: 'B', attendance: '87%', performance: 'Good' },
  { id: '10', name: 'Kofi Asante', class: 'Grade 5', grade: 'A-', attendance: '91%', performance: 'Very Good' },
  { id: '11', name: 'Adwoa Mensah', class: 'Grade 6', grade: 'B+', attendance: '89%', performance: 'Good' },
  { id: '12', name: 'Yaw Boateng', class: 'Grade 7', grade: 'A', attendance: '96%', performance: 'Excellent' },
  { id: '13', name: 'Esi Asante', class: 'Grade 8', grade: 'B', attendance: '84%', performance: 'Good' },
  { id: '14', name: 'Kwame Nkrumah', class: 'Grade 9', grade: 'A', attendance: '94%', performance: 'Excellent' },
];

const classes = [
  'All Classes',
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

const StudentsScreen = () => {
  const { colors } = useTheme();
  const [students, setStudents] = useState(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const screenWidth = Dimensions.get('window').width;

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'All Classes' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const openStudentDetails = (student) => {
    setSelectedStudent(student);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Student Roster</Text>
      </View>

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

      <FlatList
        data={filteredStudents}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.studentCard, 
              { 
                backgroundColor: colors.card,
                borderLeftColor: colors.primary 
              }
            ]}
            onPress={() => openStudentDetails(item)}
          >
            <View style={[styles.studentAvatar, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="person" size={24} color={colors.primary} />
            </View>
            <View style={styles.studentInfo}>
              <Text style={[styles.studentName, { color: colors.text }]}>{item.name}</Text>
              <View style={styles.studentMeta}>
                <Text style={[styles.studentClass, { color: colors.textSecondary }]}>{item.class}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.viewDetailsButton}
              onPress={() => openStudentDetails(item)}
            >
              <Text style={[styles.viewDetailsButtonText, { color: colors.primary }]}>View Details</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people" size={48} color={colors.primary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No students found</Text>
          </View>
        }
      />

      {/* Student Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {selectedStudent?.name}'s Details
            </Text>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.text }]}>Class:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{selectedStudent?.class}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.text }]}>Grade:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{selectedStudent?.grade}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.text }]}>Attendance:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{selectedStudent?.attendance}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.text }]}>Performance:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{selectedStudent?.performance}</Text>
            </View>

            <Pressable
              style={[styles.closeButton, { backgroundColor: colors.primary }]}
              onPress={closeModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (colors) => StyleSheet.create({
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
  studentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentClass: {
    fontSize: 14,
    marginRight: 8,
  },
  viewDetailsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  viewDetailsButtonText: {
    fontWeight: '500',
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 10,
    padding: 20,
    width: '90%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  detailValue: {
    fontSize: 16,
  },
  closeButton: {
    borderRadius: 5,
    padding: 12,
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default StudentsScreen;