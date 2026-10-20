import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { showAlert } from '../utils/alertPolyfill';

export default function AddEmployeeForm({ onAddEmployee, isSubmitting }) {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState('Active');
  const [isExpanded, setIsExpanded] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!name || name.trim() === '') {
      newErrors.name = 'Employee name is required.';
    }

    if (!position || position.trim() === '') {
      newErrors.position = 'Position is required.';
    }

    if (!salary || String(salary).trim() === '') {
      newErrors.salary = 'Salary is required.';
    } else {
      const num = Number(salary);
      if (isNaN(num) || num < 0) {
        newErrors.salary = 'Salary must be a positive number.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Client-side validation to prevent submission if fields are empty
    if (!validateForm()) {
      showAlert('Validation Error', 'Please fill in all required fields (Name, Position, Salary) correctly.');
      return;
    }

    const success = await onAddEmployee({
      name: name.trim(),
      position: position.trim(),
      salary: Number(salary),
      status: status
    });

    if (success) {
      // Clear form on success
      setName('');
      setPosition('');
      setSalary('');
      setStatus('Active');
      setErrors({});
      setIsExpanded(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.headerToggle}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.8}
      >
        <View style={styles.headerTitleRow}>
          <Text style={styles.icon}>➕</Text>
          <Text style={styles.headerTitle}>Add New Employee</Text>
        </View>
        <Text style={styles.expandText}>{isExpanded ? '▲ Hide Form' : '▼ Expand Form'}</Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.formBody}>
          <Text style={styles.formHint}>Enter employee details below. All fields are required.</Text>

          {/* Name Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Employee Name <Text style={styles.req}>*</Text></Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="e.g. Toby Flenderson"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={text => {
                setName(text);
                if (errors.name) setErrors(prev => ({ ...prev, name: null }));
              }}
            />
            {errors.name && <Text style={styles.errorText}>⚠️ {errors.name}</Text>}
          </View>

          {/* Position Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Position / Role <Text style={styles.req}>*</Text></Text>
            <TextInput
              style={[styles.input, errors.position && styles.inputError]}
              placeholder="e.g. Quality Assurance Specialist"
              placeholderTextColor="#9ca3af"
              value={position}
              onChangeText={text => {
                setPosition(text);
                if (errors.position) setErrors(prev => ({ ...prev, position: null }));
              }}
            />
            {errors.position && <Text style={styles.errorText}>⚠️ {errors.position}</Text>}
          </View>

          {/* Salary Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Monthly Salary (THB) <Text style={styles.req}>*</Text></Text>
            <TextInput
              style={[styles.input, errors.salary && styles.inputError]}
              placeholder="e.g. 42000"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              value={salary}
              onChangeText={text => {
                setSalary(text);
                if (errors.salary) setErrors(prev => ({ ...prev, salary: null }));
              }}
            />
            {errors.salary && <Text style={styles.errorText}>⚠️ {errors.salary}</Text>}
          </View>

          {/* Status Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Initial Status</Text>
            <View style={styles.statusButtonsRow}>
              <TouchableOpacity
                style={[styles.statusChoice, status === 'Active' && styles.statusActiveSelected]}
                onPress={() => setStatus('Active')}
              >
                <Text style={[styles.statusChoiceText, status === 'Active' && styles.statusActiveSelectedText]}>
                  ✓ Active
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusChoice, status === 'On Leave' && styles.statusLeaveSelected]}
                onPress={() => setStatus('On Leave')}
              >
                <Text style={[styles.statusChoiceText, status === 'On Leave' && styles.statusLeaveSelectedText]}>
                  ✓ On Leave
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>💾 Add Employee to System</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
    overflow: 'hidden'
  },
  headerToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#1e293b'
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  icon: {
    fontSize: 16
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc'
  },
  expandText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#60a5fa'
  },
  formBody: {
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    backgroundColor: '#0f172a'
  },
  formHint: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 14
  },
  inputGroup: {
    marginBottom: 14
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 6
  },
  req: {
    color: '#ef4444'
  },
  input: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 14
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#2d1515'
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500'
  },
  statusButtonsRow: {
    flexDirection: 'row',
    gap: 10
  },
  statusChoice: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center'
  },
  statusActiveSelected: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderColor: '#22c55e'
  },
  statusActiveSelectedText: {
    color: '#4ade80',
    fontWeight: '700'
  },
  statusLeaveSelected: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
    borderColor: '#eab308'
  },
  statusLeaveSelectedText: {
    color: '#facc15',
    fontWeight: '700'
  },
  statusChoiceText: {
    fontSize: 13,
    color: '#94a3b8'
  },
  submitButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3
  },
  submitButtonDisabled: {
    opacity: 0.6
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700'
  }
});
