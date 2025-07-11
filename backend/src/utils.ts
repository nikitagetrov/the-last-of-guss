import { UserRole } from './types';

export const getUserRole = (username: string): UserRole => {
  const lowerUsername = username.toLowerCase();
  
  if (lowerUsername === 'admin') {
    return UserRole.ADMIN;
  }
  
  if (lowerUsername === 'никита') {
    return UserRole.NIKITA;
  }
  
  return UserRole.SURVIVOR;
};

export const calculateScore = (taps: number): number => {
  const bonusTaps = Math.floor(taps / 11);
  const regularTaps = taps - bonusTaps;
  return regularTaps + bonusTaps * 10;
};

export const isRoundActive = (startTime: Date, endTime: Date): boolean => {
  const now = new Date();
  return now >= startTime && now <= endTime;
};

export const getRoundStatus = (startTime: Date, endTime: Date): 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' => {
  const now = new Date();
  
  if (now < startTime) {
    return 'SCHEDULED';
  }
  
  if (now >= startTime && now <= endTime) {
    return 'ACTIVE';
  }
  
  return 'COMPLETED';
};
