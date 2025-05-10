import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AssignmentScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assignments</Text>
      {/* Add your assignment content here */}
    </View>
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
    marginBottom: 20,
  },
});

export default AssignmentScreen;