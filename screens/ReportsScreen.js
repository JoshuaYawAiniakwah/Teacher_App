import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const mockAttendanceData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  present: [85, 90, 88, 92],
  absent: [5, 3, 6, 2],
  tardy: [10, 7, 6, 6]
};

const mockGradeDistribution = {
  labels: ['A', 'B', 'C', 'D', 'F'],
  data: [8, 12, 6, 3, 1]
};

const mockStudentsNeedingSupport = [
  { id: '1', name: 'Kofi Mensah', subject: 'Math', score: 62 },
  { id: '2', name: 'Ama Boateng', subject: 'Science', score: 58 },
  { id: '3', name: 'Yaw Asante', subject: 'English', score: 65 },
];

const ReportsScreen = () => {
  const [activeReport, setActiveReport] = useState('attendance');

  const generateFullReport = () => {
    Alert.alert('Success', 'Full report generated (mock)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reports & Insights</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeReport === 'attendance' && styles.activeTab
          ]}
          onPress={() => setActiveReport('attendance')}
        >
          <Text style={styles.tabButtonText}>Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeReport === 'grades' && styles.activeTab
          ]}
          onPress={() => setActiveReport('grades')}
        >
          <Text style={styles.tabButtonText}>Grades</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeReport === 'support' && styles.activeTab
          ]}
          onPress={() => setActiveReport('support')}
        >
          <Text style={styles.tabButtonText}>Support Needed</Text>
        </TouchableOpacity>
      </View>

      {activeReport === 'attendance' && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Monthly Attendance Trends</Text>
          <BarChart
            data={{
              labels: mockAttendanceData.labels,
              datasets: [
                {
                  data: mockAttendanceData.present,
                  color: (opacity = 1) => `rgba(3, 172, 19, ${opacity})`, // Green
                },
                {
                  data: mockAttendanceData.absent,
                  color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`, // Red
                },
                {
                  data: mockAttendanceData.tardy,
                  color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`, // Yellow
                },
              ],
            }}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#03AC13' }]} />
              <Text>Present</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
              <Text>Absent</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FFC107' }]} />
              <Text>Tardy</Text>
            </View>
          </View>
        </View>
      )}

      {activeReport === 'grades' && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Grade Distribution</Text>
          <PieChart
            data={[
              {
                name: 'A',
                population: mockGradeDistribution.data[0],
                color: '#4CAF50',
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
              },
              {
                name: 'B',
                population: mockGradeDistribution.data[1],
                color: '#8BC34A',
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
              },
              {
                name: 'C',
                population: mockGradeDistribution.data[2],
                color: '#FFC107',
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
              },
              {
                name: 'D',
                population: mockGradeDistribution.data[3],
                color: '#FF9800',
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
              },
              {
                name: 'F',
                population: mockGradeDistribution.data[4],
                color: '#F44336',
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
              },
            ]}
            width={screenWidth - 32}
            height={200}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      )}

      {activeReport === 'support' && (
        <View style={styles.supportContainer}>
          <Text style={styles.supportTitle}>Students Needing Additional Support</Text>
          {mockStudentsNeedingSupport.map(student => (
            <View key={student.id} style={styles.studentCard}>
              <Text style={styles.studentName}>{student.name}</Text>
              <View style={styles.studentDetails}>
                <Text style={styles.studentSubject}>{student.subject}</Text>
                <Text style={styles.studentScore}>{student.score}%</Text>
              </View>
              <TouchableOpacity style={styles.supportButton}>
                <Text style={styles.supportButtonText}>Create Intervention Plan</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity 
        style={styles.fullReportButton}
        onPress={generateFullReport}
      >
        <Text style={styles.fullReportButtonText}>Generate Full Report</Text>
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#03AC13',
  },
  tabButtonText: {
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#03AC13',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    marginRight: 8,
    borderRadius: 8,
  },
  supportContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#03AC13',
  },
  studentCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
    marginBottom: 12,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  studentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  studentSubject: {
    color: '#666',
  },
  studentScore: {
    color: '#F44336',
    fontWeight: '600',
  },
  supportButton: {
    backgroundColor: '#03AC13',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  supportButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  fullReportButton: {
    backgroundColor: '#03AC13',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  fullReportButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ReportsScreen;