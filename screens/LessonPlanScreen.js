import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';

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
  const [plans, setPlans] = useState(mockLessonPlans);
  const [newPlan, setNewPlan] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    objectives: '',
    materials: ''
  });
  const [showForm, setShowForm] = useState(false);

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

  const renderPlan = ({ item }) => (
    <View style={styles.planCard}>
      <View style={styles.planHeader}>
        <Text style={styles.planTitle}>{item.title}</Text>
        <Text style={styles.planDate}>{item.date}</Text>
      </View>
      <Text style={styles.sectionTitle}>Objectives:</Text>
      <Text style={styles.planText}>{item.objectives}</Text>
      <Text style={styles.sectionTitle}>Materials:</Text>
      <Text style={styles.planText}>{item.materials}</Text>
      {!item.shared && (
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={() => sharePlan(item.id)}
        >
          <Text style={styles.shareButtonText}>Share with Admin</Text>
        </TouchableOpacity>
      )}
      {item.shared && (
        <Text style={styles.sharedText}>Shared with administration</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lesson Plans</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.addButtonText}>{showForm ? 'Cancel' : '+ New Plan'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Lesson Title"
            value={newPlan.title}
            onChangeText={(text) => setNewPlan({...newPlan, title: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={newPlan.date}
            onChangeText={(text) => setNewPlan({...newPlan, date: text})}
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Learning Objectives"
            multiline
            value={newPlan.objectives}
            onChangeText={(text) => setNewPlan({...newPlan, objectives: text})}
          />
          <TextInput
            style={[styles.input, { height: 60 }]}
            placeholder="Required Materials"
            multiline
            value={newPlan.materials}
            onChangeText={(text) => setNewPlan({...newPlan, materials: text})}
          />
          <TouchableOpacity 
            style={styles.submitButton}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03AC13',
  },
  addButton: {
    backgroundColor: '#03AC13',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  submitButton: {
    backgroundColor: '#03AC13',
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
    backgroundColor: 'white',
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
    color: '#666',
  },
  sectionTitle: {
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    color: '#03AC13',
  },
  planText: {
    lineHeight: 20,
  },
  shareButton: {
    backgroundColor: '#03AC13',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  shareButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  sharedText: {
    color: '#03AC13',
    fontStyle: 'italic',
    marginTop: 12,
  },
});

export default LessonPlansScreen;