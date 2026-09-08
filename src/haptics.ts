import { Platform, Vibration } from 'react-native';

export function hapticTap() {
  if (Platform.OS === 'web') return;
  try {
    Vibration.vibrate(10);
  } catch {
    // Some environments (simulators, web) do not support haptics.
  }
}

export function hapticSuccess() {
  if (Platform.OS === 'web') return;
  try {
    Vibration.vibrate([0, 12, 40, 12]);
  } catch {
    // ignore
  }
}
