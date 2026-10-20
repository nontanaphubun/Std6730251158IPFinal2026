import { Platform } from 'react-native';

// In development, detect appropriate host for Web, Android emulator, iOS simulator
let defaultHost = 'http://localhost:5000';

if (Platform.OS === 'android') {
  defaultHost = 'http://10.0.2.2:5000';
} else if (Platform.OS === 'web') {
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    defaultHost = `http://${window.location.hostname}:5000`;
  } else {
    defaultHost = 'http://localhost:5000';
  }
}

export const API_BASE_URL = defaultHost;
