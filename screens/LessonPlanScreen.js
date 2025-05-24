import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { useTheme } from '../context/themeContext';

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

const durations = [
  '30 minutes',
  '45 minutes',
  '1 hour',
  '1.5 hours',
  '2 hours',
  '2.5 hours',
  '3 hours'
];

const mockLessonPlans = [
  {
    id: '1',
    title: 'Introduction to Algebra',
    subject: 'Mathematics',
    class: 'Grade 5',
    duration: '1 hour',
    date: '2023-10-10',
    objectives: 'Understand basic algebraic concepts and solve simple equations',
    materials: 'Textbook Chapter 1, Worksheets 1-3',
    shared: false
  },
  {
    id: '2',
    title: 'Photosynthesis Process',
    subject: 'Science',
    class: 'Grade 6',
    duration: '45 minutes',
    date: '2023-10-12',
    objectives: 'Learn about photosynthesis and its importance in ecosystems',
    materials: 'Microscope, plant samples, textbook Chapter 4',
    shared: true
  },
];

const LessonPlansScreen = () => {
  const { colors } = useTheme();
  const [plans, setPlans] = useState(mockLessonPlans);
  const [newPlan, setNewPlan] = useState({
    title: '',
    subject: null,
    class: null,
    duration: null,
    date: new Date().toISOString().split('T')[0],
    objectives: '',
    materials: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const styles = createStyles(colors);

  const createLessonPlan = () => {
    if (!newPlan.title || !newPlan.objectives || !newPlan.subject || !newPlan.class || !newPlan.duration) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const newId = (plans.length + 1).toString();
    setPlans(prev => [
      ...prev,
      {
        id: newId,
        ...newPlan,
        shared: false
      }
    ]);
    setNewPlan({
      title: '',
      subject: null,
      class: null,
      duration: null,
      date: new Date().toISOString().split('T')[0],
      objectives: '',
      materials: ''
    });
    setShowForm(false);
  };

  const sharePlan = (planId) => {
    setPlans(prev => prev.map(plan => 
      plan.id === planId ? { ...plan, shared: true } : plan
    ));
    Alert.alert('Success', 'Lesson plan shared with administration');
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditingPlan(null);
  };

  const handleEditChange = (field, value) => {
    setEditingPlan(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateLessonPlan = () => {
    if (!editingPlan.title || !editingPlan.objectives || !editingPlan.subject || !editingPlan.class || !editingPlan.duration) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setPlans(prev => prev.map(plan => 
      plan.id === editingPlan.id ? editingPlan : plan
    ));
    closeEditModal();
    Alert.alert('Success', 'Lesson plan updated successfully');
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
      backgroundColor: colors.inputBackground,
      marginBottom: 12,
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
      marginBottom: 12,
    },
    iconContainer: {
      top: 10,
      right: 12,
    },
    placeholder: {
      color: colors.textSecondary,
    },
  };

  const renderPlan = ({ item }) => (
    <View style={[styles.planCard, { backgroundColor: colors.card }]}>
      <View style={styles.planHeader}>
        <Text style={[styles.planTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.planDate, { color: colors.textSecondary }]}>{item.date}</Text>
      </View>
      
      <View style={styles.planMetaContainer}>
        <View style={styles.planMetaItem}>
          <Ionicons name="book" size={16} color={colors.textSecondary} />
          <Text style={[styles.planMetaText, { color: colors.text }]}>{item.subject}</Text>
        </View>
        <View style={styles.planMetaItem}>
          <Ionicons name="people" size={16} color={colors.textSecondary} />
          <Text style={[styles.planMetaText, { color: colors.text }]}>{item.class}</Text>
        </View>
        <View style={styles.planMetaItem}>
          <Ionicons name="time" size={16} color={colors.textSecondary} />
          <Text style={[styles.planMetaText, { color: colors.text }]}>{item.duration}</Text>
        </View>
      </View>
      
      <Text style={[styles.sectionTitle, { color: colors.primary }]}>Objectives:</Text>
      <Text style={[styles.planText, { color: colors.text }]}>{item.objectives}</Text>
      <Text style={[styles.sectionTitle, { color: colors.primary }]}>Materials:</Text>
      <Text style={[styles.planText, { color: colors.text }]}>{item.materials}</Text>
      <View style={styles.buttonsContainer}>
        {!item.shared && (
          <TouchableOpacity 
            style={[styles.shareButton, { backgroundColor: colors.primary }]}
            onPress={() => sharePlan(item.id)}
          >
            <Text style={styles.shareButtonText}>Share with Admin</Text>
          </TouchableOpacity>
        )}
        {item.shared && (
          <Text style={[styles.sharedText, { color: colors.primary }]}>Shared with administration</Text>
        )}
        <TouchableOpacity 
          style={[styles.editButton, { backgroundColor: colors.secondary }]}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.primary }]}>Lesson Plans</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.addButtonText}>{showForm ? 'Cancel' : '+ New Plan'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.input, { 
              borderColor: colors.border, 
              backgroundColor: colors.inputBackground,
              color: colors.text 
            }]}
            placeholder="Lesson Title (required)"
            placeholderTextColor={colors.textSecondary}
            value={newPlan.title}
            onChangeText={(text) => setNewPlan({...newPlan, title: text})}
          />
          
          <RNPickerSelect
            onValueChange={(value) => setNewPlan({...newPlan, subject: value})}
            items={subjects.map(subject => ({ label: subject, value: subject }))}
            value={newPlan.subject}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
            placeholder={{ label: "Select Subject (required)", value: null }}
            Icon={() => {
              return <Ionicons name="chevron-down" size={20} color={colors.primary} />;
            }}
          />
          
          <RNPickerSelect
            onValueChange={(value) => setNewPlan({...newPlan, class: value})}
            items={classes.map(cls => ({ label: cls, value: cls }))}
            value={newPlan.class}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
            placeholder={{ label: "Select Class (required)", value: null }}
            Icon={() => {
              return <Ionicons name="chevron-down" size={20} color={colors.primary} />;
            }}
          />
          
          <RNPickerSelect
            onValueChange={(value) => setNewPlan({...newPlan, duration: value})}
            items={durations.map(duration => ({ label: duration, value: duration }))}
            value={newPlan.duration}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
            placeholder={{ label: "Select Duration (required)", value: null }}
            Icon={() => {
              return <Ionicons name="chevron-down" size={20} color={colors.primary} />;
            }}
          />
          
          <TextInput
            style={[styles.input, { 
              borderColor: colors.border, 
              backgroundColor: colors.inputBackground,
              color: colors.text 
            }]}
            placeholder="Date (YYYY-MM-DD) (required)"
            placeholderTextColor={colors.textSecondary}
            value={newPlan.date}
            onChangeText={(text) => setNewPlan({...newPlan, date: text})}
          />
          
          <TextInput
            style={[styles.input, { 
              height: 80, 
              borderColor: colors.border, 
              backgroundColor: colors.inputBackground,
              color: colors.text 
            }]}
            placeholder="Learning Objectives (required)"
            placeholderTextColor={colors.textSecondary}
            multiline
            value={newPlan.objectives}
            onChangeText={(text) => setNewPlan({...newPlan, objectives: text})}
          />
          
          <TextInput
            style={[styles.input, { 
              height: 60, 
              borderColor: colors.border, 
              backgroundColor: colors.inputBackground,
              color: colors.text 
            }]}
            placeholder="Required Materials"
            placeholderTextColor={colors.textSecondary}
            multiline
            value={newPlan.materials}
            onChangeText={(text) => setNewPlan({...newPlan, materials: text})}
          />
          
          <TouchableOpacity 
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={createLessonPlan}
          >
            <Text style={styles.submitButtonText}>Create Lesson Plan</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={plans}
        renderItem={renderPlan}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Edit Lesson Plan Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeEditModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={[styles.editModalContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.primary }]}>Edit Lesson Plan</Text>
              
              <TextInput
                style={[styles.modalInput, { 
                  borderColor: colors.border, 
                  backgroundColor: colors.inputBackground,
                  color: colors.text 
                }]}
                placeholder="Lesson Title (required)"
                placeholderTextColor={colors.textSecondary}
                value={editingPlan?.title || ''}
                onChangeText={(text) => handleEditChange('title', text)}
              />
              
              <RNPickerSelect
                onValueChange={(value) => handleEditChange('subject', value)}
                items={subjects.map(subject => ({ label: subject, value: subject }))}
                value={editingPlan?.subject || null}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                placeholder={{ label: "Select Subject (required)", value: null }}
                Icon={() => {
                  return <Ionicons name="chevron-down" size={20} color={colors.primary} />;
                }}
              />
              
              <RNPickerSelect
                onValueChange={(value) => handleEditChange('class', value)}
                items={classes.map(cls => ({ label: cls, value: cls }))}
                value={editingPlan?.class || null}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                placeholder={{ label: "Select Class (required)", value: null }}
                Icon={() => {
                  return <Ionicons name="chevron-down" size={20} color={colors.primary} />;
                }}
              />
              
              <RNPickerSelect
                onValueChange={(value) => handleEditChange('duration', value)}
                items={durations.map(duration => ({ label: duration, value: duration }))}
                value={editingPlan?.duration || null}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                placeholder={{ label: "Select Duration (required)", value: null }}
                Icon={() => {
                  return <Ionicons name="chevron-down" size={20} color={colors.primary} />;
                }}
              />
              
              <TextInput
                style={[styles.modalInput, { 
                  borderColor: colors.border, 
                  backgroundColor: colors.inputBackground,
                  color: colors.text 
                }]}
                placeholder="Date (YYYY-MM-DD) (required)"
                placeholderTextColor={colors.textSecondary}
                value={editingPlan?.date || ''}
                onChangeText={(text) => handleEditChange('date', text)}
              />
              
              <TextInput
                style={[styles.modalInput, styles.modalTextArea, { 
                  borderColor: colors.border, 
                  backgroundColor: colors.inputBackground,
                  color: colors.text 
                }]}
                placeholder="Learning Objectives (required)"
                placeholderTextColor={colors.textSecondary}
                multiline
                value={editingPlan?.objectives || ''}
                onChangeText={(text) => handleEditChange('objectives', text)}
              />
              
              <TextInput
                style={[styles.modalInput, styles.modalTextArea, { 
                  borderColor: colors.border, 
                  backgroundColor: colors.inputBackground,
                  color: colors.text 
                }]}
                placeholder="Required Materials"
                placeholderTextColor={colors.textSecondary}
                multiline
                value={editingPlan?.materials || ''}
                onChangeText={(text) => handleEditChange('materials', text)}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.inputBackground }]}
                  onPress={closeEditModal}
                >
                  <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.updateButton, { backgroundColor: colors.primary }]}
                  onPress={updateLessonPlan}
                >
                  <Text style={[styles.modalButtonText, { color: 'white' }]}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  formContainer: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  submitButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  planCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  planDate: {
    fontSize: 14,
  },
  planMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  planMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planMetaText: {
    marginLeft: 4,
    fontSize: 14,
  },
  sectionTitle: {
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  planText: {
    lineHeight: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  shareButton: {
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  shareButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  sharedText: {
    fontStyle: 'italic',
    marginRight: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  editModalContainer: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  modalTextArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginLeft: 10,
  },
  cancelButton: {},
  updateButton: {},
  modalButtonText: {
    fontWeight: '600',
  },
});

export default LessonPlansScreen;