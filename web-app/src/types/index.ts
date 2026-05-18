export type UUID = string;

export enum TaskType {
  Daily = 'daily',
  Todo = 'todo',
}

export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export enum HabitDirection {
  Positive = 'positive',
  Negative = 'negative',
  Both = 'both',
}

export interface SubTask {
  id: UUID;
  title: string;
  completed: boolean;
}

export interface BaseTask {
  id: UUID;
  title: string;
  difficulty: Difficulty;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface Daily extends BaseTask {
  type: TaskType.Daily;
  completedToday: boolean;
  streak: number;
  longestStreak: number;
}

export interface Todo extends BaseTask {
  type: TaskType.Todo;
  completed: boolean;
  completedAt?: string;
  subTasks: SubTask[];
}

export type Task = Daily | Todo;

export interface Habit {
  id: UUID;
  title: string;
  direction: HabitDirection;
  difficulty: Difficulty;
  streak: number;
  longestStreak: number;
  positiveCount: number;
  negativeCount: number;
  todayPositiveCount: number;
  todayNegativeCount: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export enum RewardType {
  HealthPotion = 'health_potion',
  XpBoost = 'xp_boost',
  StreakFreeze = 'streak_freeze',
  Custom = 'custom',
}

export interface Reward {
  id: UUID;
  title: string;
  description?: string;
  goldCost: number;
  type: RewardType;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  xp: number;
  gold: number;
  hp: number;
  maxHp: number;
  level: number;
  totalTasksCompleted: number;
  totalHabitClicks: number;
  deathCount: number;
  currentStreak: number;
  longestStreak: number;
}

export interface ActivityLogEntry {
  id: UUID;
  timestamp: string;
  message: string;
  type: 'xp' | 'gold' | 'hp_damage' | 'hp_heal' | 'levelup' | 'death' | 'boss';
  amount?: number;
  taskId?: string;
}

export interface Boss {
  id: UUID;
  name: string;
  type: 'goblin' | 'skeleton' | 'dragon' | 'demon';
  hp: number;
  maxHp: number;
  level: number;
  xpReward: number;
  goldReward: number;
  defeated: boolean;
  damageDealt: number;
  imageType: string;
}

export enum ThemeColor {
  Blue = 'blue',
  Green = 'green',
  Purple = 'purple',
  Orange = 'orange',
}

export interface AppState {
  user: UserStats;
  dailies: Daily[];
  todos: Todo[];
  habits: Habit[];
  rewards: Reward[];
  activityLog: ActivityLogEntry[];
  lastResetDate: string;
  schemaVersion: number;
  boss: Boss | null;
  totalBossesDefeated: number;
  xpBoostRemaining: number;
  streakFrozen: boolean;
  taskFilter: 'daily' | 'todo';
  theme: ThemeColor;
}
