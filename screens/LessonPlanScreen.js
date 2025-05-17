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
import { useTheme } from '../context/themeContext';

const mockLessonPlans = [
  {
    id: '1',
    title: 'Introduction to Algebra',
    date: '2023-10-10',
    objectives: 'Understand basic algebraic concepts and solve simple equations',
    materials: 'Textbook Chapter 1, Worksheets 1-3',
    shared: false
  },
  {
    id: '2',
    title: 'Photosynthesis Process',
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
    date: new Date().toISOString().split('T')[0],
    objectives: '',
    materials: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const styles = createStyles(colors);

  const createLessonPlan = () => {
    if (!newPlan.title || !newPlan.objectives) {
      Alert.alert('Error', 'Title and Objectives are required');
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
    if (!editingPlan.title || !editingPlan.objectives) {
      Alert.alert('Error', 'Title and Objectives are required');
      return;
    }

    setPlans(prev => prev.map(plan => 
      plan.id === editingPlan.id ? editingPlan : plan
    ));
    closeEditModal();
    Alert.alert('Success', 'Lesson plan updated successfully');
  };

  const renderPlan = ({ item }) => (
    <View style={[styles.planCard, { backgroundColor: colors.card }]}>
      <View style={styles.planHeader}>
        <Text style={[styles.planTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.planDate, { color: colors.textSecondary }]}>{item.date}</Text>
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
            placeholder="Lesson Title"
            placeholderTextColor={colors.textSecondary}
            value={newPlan.title}
            onChangeText={(text) => setNewPlan({...newPlan, title: text})}
          />
          <TextInput
            style={[styles.input, { 
              borderColor: colors.border, 
              backgroundColor: colors.inputBackground,
              color: colors.text 
            }]}
            placeholder="Date (YYYY-MM-DD)"
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
            placeholder="Learning Objectives"
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
                placeholder="Lesson Title"
                placeholderTextColor={colors.textSecondary}
                value={editingPlan?.title || ''}
                onChangeText={(text) => handleEditChange('title', text)}
              />
              
              <TextInput
                style={[styles.modalInput, { 
                  borderColor: colors.border, 
                  backgroundColor: colors.inputBackground,
                  color: colors.text 
                }]}
                placeholder="Date (YYYY-MM-DD)"
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
                placeholder="Learning Objectives"
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