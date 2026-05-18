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
  type: 'xp' | 'gold' | 'hp_damage' | 'hp_heal' | 'levelup' | 'death';
  amount?: number;
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
}
