export interface User {
  id: string;
  username: string;
  role: 'SURVIVOR' | 'ADMIN' | 'LOSER';
}

export interface Round {
  id: string;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED';
  totalTaps: number;
  userScore?: number;
  userTaps?: number;
  winner?: {
    username: string;
    score: number;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TapResponse {
  score: number;
  taps: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
