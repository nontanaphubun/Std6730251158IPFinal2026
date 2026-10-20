import { Alert, Platform } from 'react-native';

/**
 * Cross-platform Alert helper that works seamlessly on iOS, Android, and Web
 */
export function showAlert(title, message, buttons) {
  if (Platform.OS === 'web') {
    if (buttons && buttons.length > 1) {
      // Confirmation dialog
      const confirmed = window.confirm(`${title ? title + ':\n' : ''}${message}`);
      if (confirmed) {
        const confirmBtn = buttons.find(b => b.style !== 'cancel' && b.text !== 'Cancel') || buttons[buttons.length - 1];
        if (confirmBtn && confirmBtn.onPress) {
          confirmBtn.onPress();
        }
      } else {
        const cancelBtn = buttons.find(b => b.style === 'cancel' || b.text === 'Cancel');
        if (cancelBtn && cancelBtn.onPress) {
          cancelBtn.onPress();
        }
      }
    } else {
      // Simple message alert
      window.alert(`${title ? title + ':\n' : ''}${message}`);
      if (buttons && buttons[0] && buttons[0].onPress) {
        buttons[0].onPress();
      }
    }
  } else {
    // Native Mobile Alert
    Alert.alert(title, message, buttons);
  }
}
