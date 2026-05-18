import { Difficulty } from '../types';

export const XP_PER_DIFFICULTY: Record<Difficulty, number> = {
  [Difficulty.Easy]: 10,
  [Difficulty.Medium]: 25,
  [Difficulty.Hard]: 50,
};

export const GOLD_PER_DIFFICULTY: Record<Difficulty, number> = {
  [Difficulty.Easy]: 5,
  [Difficulty.Medium]: 12,
  [Difficulty.Hard]: 25,
};

export const HP_DAMAGE_PER_DIFFICULTY: Record<Difficulty, number> = {
  [Difficulty.Easy]: 2,
  [Difficulty.Medium]: 4,
  [Difficulty.Hard]: 8,
};

export const DAILY_HP_PENALTY = 5;
export const DEFAULT_MAX_HP = 50;
export const HP_PER_LEVEL = 2;

export const HEALTH_POTION_HEAL = 15;
export const HEALTH_POTION_COST = 25;

export const DEATH_GOLD_LOSS_PERCENT = 0.1;
export const DEATH_XP_LOSS = 50;
export const DEATH_REVIVE_HP_PERCENT = 0.2;

export const STREAK_BONUS_INTERVAL = 7;
export const STREAK_BONUS_XP = 50;
export const STREAK_BONUS_GOLD = 30;

export const MAX_LOG_ENTRIES = 100;

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  [Difficulty.Easy]: '简单',
  [Difficulty.Medium]: '中等',
  [Difficulty.Hard]: '困难',
};

export const HABIT_DIRECTION_LABELS: Record<string, string> = {
  positive: '好习惯 (+)',
  negative: '坏习惯 (-)',
  both: '双向 (+/-)',
};
