import { Difficulty } from '../types';
import {
  XP_PER_DIFFICULTY,
  GOLD_PER_DIFFICULTY,
  HP_DAMAGE_PER_DIFFICULTY,
  HP_PER_LEVEL,
  DEFAULT_MAX_HP,
} from '../constants/game';

export function xpToNextLevel(level: number): number {
  return Math.floor(100 + (level - 1) * 30 + Math.pow(level - 1, 2) * 5);
}

export function calculateXPForDifficulty(difficulty: Difficulty): number {
  return XP_PER_DIFFICULTY[difficulty];
}

export function calculateGoldForDifficulty(difficulty: Difficulty): number {
  return GOLD_PER_DIFFICULTY[difficulty];
}

export function calculateHPDamage(difficulty: Difficulty): number {
  return HP_DAMAGE_PER_DIFFICULTY[difficulty];
}

export function calculateMaxHp(level: number): number {
  return DEFAULT_MAX_HP + (level - 1) * HP_PER_LEVEL;
}
