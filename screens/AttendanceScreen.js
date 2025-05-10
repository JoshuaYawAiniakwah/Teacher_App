import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';

const AttendanceScreen = () => {
  const [students, setStudents] = useState([
    { id: '1', name: 'Ama Asantewaa', attendance: 'absent', absenceCount: 2, tardyCount: 1 },
    { id: '2', name: 'Kwame Nkrumah', attendance: 'absent', absenceCount: 4, tardyCount: 0 },
    { id: '3', name: 'Yaw Boateng', attendance: 'absent', absenceCount: 1, tardyCount: 3 },
    { id: '4', name: 'Esi Mensah', attendance: 'absent', absenceCount: 0, tardyCount: 0 },
    { id: '5', name: 'Kofi Addo', attendance: 'absent', absenceCount: 5, tardyCount: 2 },
  ]);

  const [lastSynced, setLastSynced] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

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
      `Attendance report for ${date} created successfully!\n\nPresent: ${report.present}\nAbsent: ${report.absent}\nTardy: ${report.tardy}`,
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

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderStudent}
        contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
        ListHeaderComponent={
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
        }
      />

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.reportButton]}
          onPress={generateReport}
        >
          <Text style={styles.actionButtonText}>Generate Report</Text>
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

export default AttendanceScreen;

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
    backgroundColor: '#03AC13',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
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
});