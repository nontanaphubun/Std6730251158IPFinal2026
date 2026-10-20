import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { API_BASE_URL } from '../config';
import { showAlert } from '../utils/alertPolyfill';
import EmployeeCard from '../components/EmployeeCard';
import AddEmployeeForm from '../components/AddEmployeeForm';
import ClusterSummary from '../components/ClusterSummary';

export default function DashboardScreen({ userToken, onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Status/action states
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Phase 2: K-Means Analytics states
  const [clusters, setClusters] = useState(null);
  const [loadingClusters, setLoadingClusters] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');

  // Fetch employees list
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees`);
      if (response.ok) {
        const data = await response.json();
        setEmployees(Array.isArray(data) ? data : []);
      } else {
        showAlert('Error', 'Failed to fetch employees from server.');
      }
    } catch (err) {
      console.error('Fetch employees error:', err);
      showAlert('Connection Error', `Could not connect to server at ${API_BASE_URL}.`);
    } finally {
      setLoadingEmployees(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEmployees();
  };

  // Add Employee handler
  const handleAddEmployee = async (newEmployeeData) => {
    setIsAdding(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployeeData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showAlert('Success', `Employee "${newEmployeeData.name}" added successfully.`);
        // Automatically update the UI
        await fetchEmployees();
        // If clusters were already loaded, refresh analytics as well
        if (clusters) {
          fetchClusters();
        }
        return true;
      } else {
        showAlert('Add Failed', result.message || 'Could not add employee.');
        return false;
      }
    } catch (err) {
      showAlert('Error', 'Network error while adding employee: ' + err.message);
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  // Toggle Status handler
  const handleToggleStatus = async (employeeId) => {
    setTogglingId(employeeId);
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees/${employeeId}/status`, {
        method: 'PUT'
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Optimistically / immediately update local UI state
        setEmployees(prev =>
          prev.map(emp => (emp.id === employeeId ? result.data : emp))
        );
      } else {
        showAlert('Error', result.message || 'Failed to toggle employee status.');
      }
    } catch (err) {
      showAlert('Error', 'Network error toggling status: ' + err.message);
    } finally {
      setTogglingId(null);
    }
  };

  // Delete Employee handler with confirmation alert
  const handleDeletePress = (employee) => {
    showAlert(
      'Confirm Deletion',
      `Are you sure you want to delete "${employee.name}" (${employee.position}) from the system?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDelete(employee.id, employee.name)
        }
      ]
    );
  };

  const confirmDelete = async (employeeId, employeeName) => {
    setDeletingId(employeeId);
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees/${employeeId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showAlert('Deleted', `Employee "${employeeName}" was removed.`);
        // Automatically remove from local UI list
        setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
        // Refresh clusters if open
        if (clusters) {
          fetchClusters();
        }
      } else {
        showAlert('Delete Failed', result.message || 'Could not delete employee.');
      }
    } catch (err) {
      showAlert('Error', 'Network error deleting employee: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Phase 2: Fetch Salary Clusters
  const fetchClusters = async () => {
    setLoadingClusters(true);
    setAnalyticsError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees/salary-clusters`);
      const result = await response.json();

      if (response.ok && result.success) {
        setClusters(result.clusters);
      } else {
        const msg = result.message || 'Failed to generate salary clusters.';
        setAnalyticsError(msg);
        showAlert('Analytics Error', msg);
      }
    } catch (err) {
      const msg = 'Network error calculating clusters: ' + err.message;
      setAnalyticsError(msg);
      showAlert('Analytics Error', msg);
    } finally {
      setLoadingClusters(false);
    }
  };

  // Stats calculation
  const totalCount = employees.length;
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const leaveCount = employees.filter(e => e.status === 'On Leave').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <View style={styles.navLeft}>
          <Text style={styles.navTitle}>HR Manager & Analytics</Text>
          <Text style={styles.navSub}>std6730251158 | Final Exam 2026</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutBtnText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#38bdf8"
            colors={['#38bdf8']}
          />
        }
      >
        {/* KPI Summary Cards */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiNumber}>{totalCount}</Text>
            <Text style={styles.kpiLabel}>Total Staff</Text>
          </View>
          <View style={[styles.kpiCard, styles.kpiActive]}>
            <Text style={[styles.kpiNumber, styles.textGreen]}>{activeCount}</Text>
            <Text style={styles.kpiLabel}>Active</Text>
          </View>
          <View style={[styles.kpiCard, styles.kpiLeave]}>
            <Text style={[styles.kpiNumber, styles.textYellow]}>{leaveCount}</Text>
            <Text style={styles.kpiLabel}>On Leave</Text>
          </View>
        </View>

        {/* Phase 2: Salary Clustering Section */}
        <View style={styles.analyticsSection}>
          <View style={styles.analyticsHeader}>
            <View>
              <Text style={styles.analyticsTitle}>Phase 2: Salary Analytics</Text>
              <Text style={styles.analyticsDesc}>1D K-Means clustering (k=3 tiers)</Text>
            </View>

            <TouchableOpacity
              style={[styles.btnAnalyze, loadingClusters && styles.btnDisabled]}
              onPress={fetchClusters}
              disabled={loadingClusters}
            >
              {loadingClusters ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.btnAnalyzeText}> Analyzing...</Text>
                </View>
              ) : (
                <Text style={styles.btnAnalyzeText}>📊 Analyze Salary Structure</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Render Cluster Summary Cards if loaded */}
          {clusters && <ClusterSummary clusters={clusters} />}

          {analyticsError !== '' && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {analyticsError}</Text>
            </View>
          )}
        </View>

        {/* Phase 1: Add Employee Form */}
        <AddEmployeeForm onAddEmployee={handleAddEmployee} isSubmitting={isAdding} />

        {/* Phase 1: Employee Management List */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Employee Directory ({totalCount})</Text>
            <TouchableOpacity onPress={fetchEmployees} style={styles.refreshIconBtn}>
              <Text style={styles.refreshIconText}>🔄 Reload</Text>
            </TouchableOpacity>
          </View>

          {loadingEmployees ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#38bdf8" />
              <Text style={styles.loadingText}>Loading employee directory...</Text>
            </View>
          ) : employees.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>📂</Text>
              <Text style={styles.emptyTitle}>No Employees Found</Text>
              <Text style={styles.emptySubtitle}>Use the form above to add an employee.</Text>
            </View>
          ) : (
            employees.map(emp => (
              <EmployeeCard
                key={emp.id}
                employee={emp}
                onToggleStatus={handleToggleStatus}
                onDeletePress={handleDeletePress}
                isToggling={togglingId === emp.id}
                isDeleting={deletingId === emp.id}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  container: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155'
  },
  navLeft: {
    flex: 1
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc'
  },
  navSub: {
    fontSize: 11,
    color: '#38bdf8',
    fontWeight: '600'
  },
  logoutBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  logoutBtnText: {
    color: '#f1f5f9',
    fontSize: 12,
    fontWeight: '700'
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155'
  },
  kpiActive: {
    borderColor: 'rgba(34, 197, 94, 0.3)'
  },
  kpiLeave: {
    borderColor: 'rgba(234, 179, 8, 0.3)'
  },
  kpiNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc'
  },
  kpiLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2
  },
  textGreen: {
    color: '#4ade80'
  },
  textYellow: {
    color: '#facc15'
  },
  analyticsSection: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155'
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 10
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc'
  },
  analyticsDesc: {
    fontSize: 12,
    color: '#94a3b8'
  },
  btnAnalyze: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3
  },
  btnDisabled: {
    opacity: 0.6
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  btnAnalyzeText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  },
  errorBox: {
    backgroundColor: '#451a1a',
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 10
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 12
  },
  listSection: {
    marginTop: 6
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc'
  },
  refreshIconBtn: {
    padding: 4
  },
  refreshIconText: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '600'
  },
  loadingBox: {
    padding: 40,
    alignItems: 'center'
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 10
  },
  emptyBox: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155'
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8
  },
  emptyTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700'
  },
  emptySubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4
  }
});
