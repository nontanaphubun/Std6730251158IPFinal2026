import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { showAlert } from '../utils/alertPolyfill';
import { API_BASE_URL } from '../config';

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    // Basic client validation
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.');
      showAlert('Login Failed', 'Please enter both username and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Successful login
        onLoginSuccess(data.token);
      } else {
        // Failed login
        const msg = data.message || 'Invalid username or password.';
        setErrorMessage(msg);
        showAlert('Authentication Failed', msg);
      }
    } catch (err) {
      const connErr = 'Cannot connect to backend server at ' + API_BASE_URL + '. Ensure Express is running.';
      setErrorMessage(connErr);
      showAlert('Connection Error', connErr);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setUsername('admin');
    setPassword('password123');
    setErrorMessage('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Final Exam 2026</Text>
            </View>
            <Text style={styles.title}>HR Manager & Analytics</Text>
            <Text style={styles.subtitle}>Sign in to access Employee & Salary System</Text>
            <Text style={styles.studentId}>Student ID: std6730251158</Text>
          </View>

          {errorMessage !== '' && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username (e.g. admin)"
              placeholderTextColor="#9ca3af"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password (e.g. password123)"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.demoButton} onPress={fillDemo}>
            <Text style={styles.demoButtonText}>⚡ Auto-Fill Credentials (admin / password123)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8
  },
  header: {
    alignItems: 'center',
    marginBottom: 24
  },
  badge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 6
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 4
  },
  studentId: {
    fontSize: 12,
    color: '#60a5fa',
    fontWeight: '600'
  },
  errorBox: {
    backgroundColor: '#451a1a',
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 13,
    fontWeight: '500'
  },
  formGroup: {
    marginBottom: 18
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 6
  },
  input: {
    backgroundColor: '#0f172a',
    borderColor: '#475569',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#f8fafc'
  },
  loginButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4
  },
  buttonDisabled: {
    opacity: 0.6
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700'
  },
  demoButton: {
    marginTop: 16,
    paddingVertical: 8,
    alignItems: 'center'
  },
  demoButtonText: {
    color: '#93c5fd',
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline'
  }
});
