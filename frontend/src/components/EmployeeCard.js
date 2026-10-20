import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function EmployeeCard({ employee, onToggleStatus, onDeletePress, isToggling, isDeleting }) {
  const isActive = employee.status === 'Active';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.infoCol}>
          <Text style={styles.name}>{employee.name}</Text>
          <Text style={styles.position}>{employee.position}</Text>
        </View>

        <View style={[styles.statusBadge, isActive ? styles.statusActive : styles.statusLeave]}>
          <View style={[styles.statusDot, isActive ? styles.dotActive : styles.dotLeave]} />
          <Text style={[styles.statusText, isActive ? styles.statusTextActive : styles.statusTextLeave]}>
            {employee.status}
          </Text>
        </View>
      </View>

      <View style={styles.salaryRow}>
        <Text style={styles.salaryLabel}>Monthly Salary:</Text>
        <Text style={styles.salaryValue}>฿{Number(employee.salary || 0).toLocaleString()}</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.btnToggle, isToggling && styles.btnDisabled]}
          onPress={() => onToggleStatus(employee.id)}
          disabled={isToggling || isDeleting}
        >
          {isToggling ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.btnToggleText}>
              🔄 Toggle Status ({isActive ? 'Set On Leave' : 'Set Active'})
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnDelete, isDeleting && styles.btnDisabled]}
          onPress={() => onDeletePress(employee)}
          disabled={isToggling || isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.btnDeleteText}>🗑️ Delete</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  infoCol: {
    flex: 1,
    marginRight: 10
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 2
  },
  position: {
    fontSize: 13,
    color: '#94a3b8'
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1
  },
  statusActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: '#22c55e'
  },
  statusLeave: {
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: '#eab308'
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6
  },
  dotActive: {
    backgroundColor: '#22c55e'
  },
  dotLeave: {
    backgroundColor: '#eab308'
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700'
  },
  statusTextActive: {
    color: '#4ade80'
  },
  statusTextLeave: {
    color: '#facc15'
  },
  salaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#334155',
    marginBottom: 12
  },
  salaryLabel: {
    fontSize: 13,
    color: '#94a3b8'
  },
  salaryValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#38bdf8'
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10
  },
  btnToggle: {
    flex: 1,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnToggleText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  },
  btnDelete: {
    backgroundColor: '#dc2626',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnDeleteText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  },
  btnDisabled: {
    opacity: 0.6
  }
});
