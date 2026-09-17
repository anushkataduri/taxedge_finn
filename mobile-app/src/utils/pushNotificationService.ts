import * as Device from 'expo-device';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

const isExpoGo =
  Constants.appOwnership === 'expo' ||
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let Notifications: any = null;

try {
  if (!isExpoGo) {
    // Only require expo-notifications in development builds or standalone apps
    Notifications = require('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }
} catch {
  // Gracefully ignored in Expo Go
}

/**
 * Requests push notification permissions and fetches the Expo Push Token.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (isExpoGo) {
    console.log('ℹ️ Running in Expo Go: using dev token (remote push notifications require a development build in SDK 53+)');
    return `ExponentPushToken[dev-expo-go-token-${Date.now()}]`;
  }

  if (!Device.isDevice) {
    console.log('Push notifications require a physical device or emulator with dev-client');
    return `ExponentPushToken[dev-emulator-token-${Date.now()}]`;
  }

  if (!Notifications) {
    return `ExponentPushToken[dev-mock-token-${Date.now()}]`;
  }

  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF236C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Push notification permission denied by user');
      return null;
    }

    // 1. In standalone APKs with Firebase FCM, get the native FCM device registration token
    let token: string | null = null;
    try {
      const deviceTokenData = await Notifications.getDevicePushTokenAsync();
      if (deviceTokenData?.data) {
        token = deviceTokenData.data;
        console.log('✅ FCM NATIVE DEVICE TOKEN FETCHED:', token);
      }
    } catch (fcmErr) {
      console.log('ℹ️ getDevicePushTokenAsync failed or not standalone, falling back to Expo push token:', fcmErr);
    }

    // 2. Fallback to Expo push token if native token unavailable
    if (!token) {
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId;
      const tokenData = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined
      );
      token = tokenData.data;
      console.log('✅ EXPO PUSH TOKEN FETCHED:', token);
    }

    return token;
  } catch (error) {
    console.warn('Could not fetch real push token, using fallback:', error);
    return `ExponentPushToken[dev-fallback-token-${Date.now()}]`;
  }
}

