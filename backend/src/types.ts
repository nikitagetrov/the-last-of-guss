export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Round {
  id: string;
  startTime: Date;
  endTime: Date;
  status: RoundStatus;
  totalTaps: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserTap {
  id: string;
  userId: string;
  roundId: string;
  taps: number;
  score: number;
}

export enum UserRole {
  SURVIVOR = 'SURVIVOR',
  ADMIN = 'ADMIN',
  LOSER = 'LOSER'
}

export enum RoundStatus {
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TapRequest {
  roundId: string;
}

export interface CreateRoundRequest {
  startTime?: Date;
}

export interface RoundInfo {
  id: string;
  startTime: Date;
  endTime: Date;
  status: RoundStatus;
  totalTaps: number;
  userScore?: number;
  userTaps?: number;
  winner?: {
    username: string;
    score: number;
  };
}

export interface TapResponse {
  score: number;
  taps: number;
}
