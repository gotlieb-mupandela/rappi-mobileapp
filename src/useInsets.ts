import { Platform, StatusBar } from 'react-native';

export function useAppInsets() {
  if (Platform.OS === 'web') {
    return { top: 0, bottom: 0 };
  }
  if (Platform.OS === 'android') {
    return { top: StatusBar.currentHeight ?? 0, bottom: 16 };
  }
  return { top: 47, bottom: 34 };
}
