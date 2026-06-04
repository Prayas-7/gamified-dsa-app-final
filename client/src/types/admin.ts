export interface Player {
  _id: string;
  username: string;
  email: string;
  currentLevel: number;
  totalPoints: number;
  lastActive: string;
  status: 'active' | 'banned';
}

export interface GameAnalytics {
  totalAttempts: number;
  successRate: number;
  averageTime: number; // in seconds
  commonErrors: { errorType: string; count: number }[];
}

export interface AdminSummary {
  activeUsers: number;
  totalPuzzles: number;
  systemHealth: number;
  recentLogs: string[];
}

export interface LevelDist {
  level: string;
  students: number;
}

export interface PerformanceTrend {
  name: string;
  xp: number;
}

export interface AnalyticsData {
  success: boolean;
  averageXP: number;
  levelDistribution: LevelDist[];
  performanceTrend: PerformanceTrend[];
}