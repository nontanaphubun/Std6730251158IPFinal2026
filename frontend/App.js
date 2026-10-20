import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  const [userToken, setUserToken] = useState(null);

  const handleLoginSuccess = (token) => {
    setUserToken(token);
  };

  const handleLogout = () => {
    setUserToken(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {userToken ? (
        <DashboardScreen userToken={userToken} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a'
  }
});
