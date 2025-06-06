
import { Capacitor } from '@capacitor/core';

export const isNativePlatform = () => Capacitor.isNativePlatform();
export const getPlatform = () => Capacitor.getPlatform();
export const isAndroid = () => getPlatform() === 'android';
export const isIOS = () => getPlatform() === 'ios';
export const isWeb = () => getPlatform() === 'web';

export const getDeviceInfo = async () => {
  if (!isNativePlatform()) return null;
  
  try {
    const { Device } = await import('@capacitor/device');
    return await Device.getInfo();
  } catch (error) {
    console.error('Error getting device info:', error);
    return null;
  }
};

export const getNetworkStatus = async () => {
  if (!isNativePlatform()) return { connected: true, connectionType: 'wifi' };
  
  try {
    const { Network } = await import('@capacitor/network');
    return await Network.getStatus();
  } catch (error) {
    console.error('Error getting network status:', error);
    return { connected: true, connectionType: 'unknown' };
  }
};
