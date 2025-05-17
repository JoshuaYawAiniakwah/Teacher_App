import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  Dimensions
} from 'react-native';

const mockStudents = {
  'All Classes': [],
  'Creche': [
    { id: '1', name: 'Ama Asantewaa', attendance: 'absent', absenceCount: 2, tardyCount: 1 },
  ],
  'Nursery 1': [
    { id: '2', name: 'Kwame Nkrumah', attendance: 'absent', absenceCount: 4, tardyCount: 0 },
  ],
  'Nursery 2': [
    { id: '3', name: 'Yaw Boateng', attendance: 'absent', absenceCount: 1, tardyCount: 3 },
  ],
  'KG 1': [
    { id: '4', name: 'Esi Mensah', attendance: 'absent', absenceCount: 0, tardyCount: 0 },
  ],
  'KG 2': [
    { id: '5', name: 'Kofi Addo', attendance: 'absent', absenceCount: 5, tardyCount: 2 },
  ],
  'Grade 1': [
    { id: '6', name: 'Abena Serwaa', attendance: 'absent', absenceCount: 1, tardyCount: 0 },
  ],
  'Grade 2': [
    { id: '7', name: 'Yaa Nkrumah', attendance: 'absent', absenceCount: 2, tardyCount: 1 },
  ],
  'Grade 3': [
    { id: '8', name: 'Kwabena Osei', attendance: 'absent', absenceCount: 3, tardyCount: 0 },
  ],
  'Grade 4': [
    { id: '9', name: 'Ama Ampofo', attendance: 'absent', absenceCount: 1, tardyCount: 2 },
  ],
  'Grade 5': [
    { id: '10', name: 'Kofi Asante', attendance: 'absent', absenceCount: 0, tardyCount: 1 },
  ],
  'Grade 6': [
    { id: '11', name: 'Adwoa Mensah', attendance: 'absent', absenceCount: 2, tardyCount: 0 },
  ],
  'Grade 7': [
    { id: '12', name: 'Yaw Boateng', attendance: 'absent', absenceCount: 1, tardyCount: 1 },
  ],
  'Grade 8': [
    { id: '13', name: 'Esi Asante', attendance: 'absent', absenceCount: 0, tardyCount: 0 },
  ],
  'Grade 9': [
    { id: '14', name: 'Kwame Nkrumah', attendance: 'absent', absenceCount: 1, tardyCount: 0 },
  ],
};

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

const AttendanceScreen = () => {
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [students, setStudents] = useState(mockStudents[selectedClass]);
  const [lastSynced, setLastSynced] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const screenWidth = Dimensions.get('window').width;

  const handleClassSelect = (cls) => {
    setSelectedClass(cls);
    setStudents(mockStudents[cls]);
  };

  const updateAttendance = (id, status) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === id) {
          const wasAbsent = student.attendance === 'absent';
          const wasTardy = student.attendance === 'tardy';
          
          return {
            ...student,
            attendance: status,
            absenceCount: 
              status === 'absent' && !wasAbsent 
                ? student.absenceCount + 1 
                : student.absenceCount,
            tardyCount: 
              status === 'tardy' && !wasTardy 
                ? student.tardyCount + 1 
                : student.tardyCount,
          };
        }
        return student;
      })
    );
  };

  const generateReport = () => {
    const date = new Date().toLocaleDateString();
    const report = {
      date,
      class: selectedClass,
      totalStudents: students.length,
      present: students.filter(s => s.attendance === 'present').length,
      absent: students.filter(s => s.attendance === 'absent').length,
      tardy: students.filter(s => s.attendance === 'tardy').length,
      students: students.map(student => ({
        name: student.name,
        status: student.attendance,
        absenceCount: student.absenceCount,
        tardyCount: student.tardyCount,
      })),
    };

    console.log('Detailed Attendance Report:', JSON.stringify(report, null, 2));
    Alert.alert(
      'Report Generated',
      `Attendance report for ${selectedClass} on ${date} created successfully!\n\nPresent: ${report.present}\nAbsent: ${report.absent}\nTardy: ${report.tardy}`,
      [
        {
          text: 'Share',
          onPress: () => console.log('Sharing report...'),
        },
        { text: 'OK' },
      ]
    );
  };

  const flagFrequentAbsences = () => {
    const flaggedStudents = students.filter((student) => student.absenceCount >= 3);
    
    if (flaggedStudents.length > 0) {
      Alert.alert(
        'Flagged Students',
        `The following students have 3+ absences:\n\n${flaggedStudents
          .map((student) => `${student.name} (${student.absenceCount} absences)`)
          .join('\n')}`,
        [
          {
            text: 'Notify Admin',
            onPress: () => notifyAdministration(flaggedStudents),
          },
          { text: 'Close' },
        ]
      );
    } else {
      Alert.alert('No Frequent Absences', 'No student has 3 or more absences.');
    }
  };

  const notifyAdministration = (flaggedStudents) => {
    console.log('Notifying administration about:', flaggedStudents);
    Alert.alert(
      'Administration Notified',
      `Administration has been notified about ${flaggedStudents.length} student(s) with frequent absences.`
    );
  };

  const syncWithSchoolSystem = () => {
    setIsSyncing(true);
    console.log('Syncing attendance data with school system...');
    
    setTimeout(() => {
      setLastSynced(new Date().toLocaleTimeString());
      setIsSyncing(false);
      Alert.alert('Sync Complete', 'Attendance data synced successfully with school system.');
    }, 1500);
  };

  const submitAttendance = () => {
    if (students.length === 0) {
      Alert.alert('No Students', 'Please select a class first.');
      return;
    }

    const absentStudents = students.filter(s => s.attendance === 'absent').length;
    Alert.alert(
      'Confirm Submission',
      `You are about to submit attendance for ${selectedClass}.\n\nPresent: ${students.filter(s => s.attendance === 'present').length}\nAbsent: ${absentStudents}\nTardy: ${students.filter(s => s.attendance === 'tardy').length}\n\nContinue?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Submit',
          onPress: () => {
            console.log('Attendance submitted:', students);
            Alert.alert('Success', 'Attendance submitted successfully!');
          },
        },
      ]
    );
  };

  const renderStudent = ({ item }) => (
    <View style={styles.studentRow}>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <View style={styles.countContainer}>
          {item.absenceCount > 0 && (
            <View style={[styles.badge, styles.absenceBadge]}>
              <Text style={styles.badgeText}>{item.absenceCount} A</Text>
            </View>
          )}
          {item.tardyCount > 0 && (
            <View style={[styles.badge, styles.tardyBadge]}>
              <Text style={styles.badgeText}>{item.tardyCount} T</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.attendanceBtns}>
        <TouchableOpacity
          style={[
            styles.statusBtn,
            item.attendance === 'present' && styles.presentBtn,
          ]}
          onPress={() => updateAttendance(item.id, 'present')}
        >
          <Text style={styles.statusText}>Present</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statusBtn,
            item.attendance === 'absent' && styles.absentBtn,
          ]}
          onPress={() => updateAttendance(item.id, 'absent')}
        >
          <Text style={styles.statusText}>Absent</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statusBtn,
            item.attendance === 'tardy' && styles.tardyBtn,
          ]}
          onPress={() => updateAttendance(item.id, 'tardy')}
        >
          <Text style={styles.statusText}>Tardy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Class Attendance</Text>
        <TouchableOpacity 
          style={styles.syncButton} 
          onPress={syncWithSchoolSystem}
          disabled={isSyncing}
        >
          <Text style={styles.syncButtonText}>
            {isSyncing ? 'Syncing...' : 'Sync Data'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {lastSynced && (
        <Text style={styles.syncStatus}>Last synced: {lastSynced}</Text>
      )}

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.classFilterScroll}
        contentContainerStyle={styles.classFilterContainer}
      >
        {classes.map(cls => (
          <TouchableOpacity
            key={cls}
            style={[
              styles.classFilter,
              selectedClass === cls && styles.selectedClassFilter,
              { width: screenWidth / 4.5 }
            ]}
            onPress={() => handleClassSelect(cls)}
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

      {selectedClass !== 'All Classes' && students.length > 0 ? (
        <>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>
              Present: {students.filter(s => s.attendance === 'present').length}
            </Text>
            <Text style={styles.summaryText}>
              Absent: {students.filter(s => s.attendance === 'absent').length}
            </Text>
            <Text style={styles.summaryText}>
              Tardy: {students.filter(s => s.attendance === 'tardy').length}
            </Text>
          </View>

          <FlatList
            data={students}
            keyExtractor={(item) => item.id}
            renderItem={renderStudent}
            contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {selectedClass === 'All Classes' 
              ? 'Please select a class to view students' 
              : 'No students found in this class'}
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.reportButton]}
          onPress={generateReport}
        >
          <Text style={styles.actionButtonText}>Generate Report</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.submitButton]}
          onPress={submitAttendance}
        >
          <Text style={styles.actionButtonText}>Submit Attendance</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.flagButton]}
          onPress={flagFrequentAbsences}
        >
          <Text style={styles.actionButtonText}>Flag Absences</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03AC13',
  },
  syncButton: {
    backgroundColor: '#03AC13',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  syncButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  syncStatus: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 12,
    textAlign: 'right',
  },
  classFilterScroll: {
    marginBottom: 16,
    maxHeight: 50,
  },
  classFilterContainer: {
    paddingRight: 16,
  },
  classFilter: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedClassFilter: {
    backgroundColor: '#03AC13',
  },
  classFilterText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 14,
  },
  selectedClassFilterText: {
    color: 'white',
  },
  studentRow: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#03AC13',
    elevation: 2,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  countContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absenceBadge: {
    backgroundColor: '#e74c3c',
  },
  tardyBadge: {
    backgroundColor: '#f39c12',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  attendanceBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
  },
  presentBtn: {
    backgroundColor: '#03AC13',
  },
  absentBtn: {
    backgroundColor: '#e74c3c',
  },
  tardyBtn: {
    backgroundColor: '#f39c12',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingBottom: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  reportButton: {
    backgroundColor: '#03AC13',
  },
  submitButton: {
    backgroundColor: '#3498db',
  },
  flagButton: {
    backgroundColor: '#e74c3c',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#03AC13',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  summaryText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default AttendanceScreen;