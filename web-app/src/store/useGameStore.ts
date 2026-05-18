import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState,
  UserStats,
  Daily,
  Todo,
  Habit,
  Reward,
  ActivityLogEntry,
  SubTask,
  Boss,
} from '../types';
import {
  TaskType,
  RewardType,
  HabitDirection,
  ThemeColor,
} from '../types';
import { generateId } from '../utils/id';
import { getTodayDateString } from '../utils/date';
import {
  calculateXPForDifficulty,
  calculateGoldForDifficulty,
  calculateHPDamage,
  calculateMaxHp,
  xpToNextLevel,
  calculateBossDPS,
} from '../utils/gamification';
import {
  DAILY_HP_PENALTY,
  HEALTH_POTION_HEAL,
  HEALTH_POTION_COST,
  XP_BOOST_MULTIPLIER,
  XP_BOOST_COST,
  XP_BOOST_DURATION_TASKS,
  STREAK_FREEZE_COST,
  DEATH_GOLD_LOSS_PERCENT,
  DEATH_XP_LOSS,
  DEATH_REVIVE_HP_PERCENT,
  STREAK_BONUS_INTERVAL,
  STREAK_BONUS_XP,
  STREAK_BONUS_GOLD,
  MAX_LOG_ENTRIES,
  BOSS_DAMAGE_PER_TASK,
  BOSS_HP_PER_LEVEL,
  BOSS_XP_REWARD,
  BOSS_GOLD_REWARD,
  BOSS_NAMES,
  BOSS_TYPES,
} from '../constants/game';
import { runMigrations } from '../utils/migration';

const DEFAULT_USER: UserStats = {
  xp: 0,
  gold: 0,
  hp: 50,
  maxHp: 50,
  level: 1,
  totalTasksCompleted: 0,
  totalHabitClicks: 0,
  deathCount: 0,
  currentStreak: 0,
  longestStreak: 0,
};

const BUILT_IN_HEALTH_POTION_ID = 'health-potion-builtin';
const BUILT_IN_XP_BOOST_ID = 'xp-boost-builtin';
const BUILT_IN_STREAK_FREEZE_ID = 'streak-freeze-builtin';

function createHealthPotion(): Reward {
  return {
    id: BUILT_IN_HEALTH_POTION_ID,
    title: '生命药水',
    description: `恢复 ${HEALTH_POTION_HEAL} 点生命值`,
    goldCost: HEALTH_POTION_COST,
    type: RewardType.HealthPotion,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function createXpBoost(): Reward {
  return {
    id: BUILT_IN_XP_BOOST_ID,
    title: 'XP 增幅器',
    description: `接下来 ${XP_BOOST_DURATION_TASKS} 个任务获得 ${XP_BOOST_MULTIPLIER} 倍 XP`,
    goldCost: XP_BOOST_COST,
    type: RewardType.XpBoost,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function createStreakFreeze(): Reward {
  return {
    id: BUILT_IN_STREAK_FREEZE_ID,
    title: '连胜冻结',
    description: '今日未完成每日任务不会中断连胜',
    goldCost: STREAK_FREEZE_COST,
    type: RewardType.StreakFreeze,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function createBoss(level: number): Boss {
  const bossTypes = BOSS_TYPES as readonly string[];
  const idx = Math.min(Math.floor((level - 1) / 5), bossTypes.length - 1);
  const type = bossTypes[idx];
  const name = BOSS_NAMES[type] || '怪物';
  const maxHp = BOSS_HP_PER_LEVEL[type] || 50;
  return {
    id: generateId(),
    name,
    type: type as Boss['type'],
    hp: maxHp,
    maxHp,
    level: level,
    xpReward: BOSS_XP_REWARD[type] || 50,
    goldReward: BOSS_GOLD_REWARD[type] || 30,
    defeated: false,
    damageDealt: 0,
    imageType: type,
  };
}

interface GameActions {
  addDaily: (data: { title: string; difficulty: Daily['difficulty']; notes?: string }) => void;
  updateDaily: (id: string, updates: Partial<Daily>) => void;
  deleteDaily: (id: string) => void;
  toggleDaily: (id: string) => void;

  addTodo: (data: { title: string; difficulty: Todo['difficulty']; notes?: string; subTasks?: { title: string }[] }) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  completeTodo: (id: string) => void;
  uncompleteTodo: (id: string) => void;
  addSubTask: (todoId: string, title: string) => void;
  toggleSubTask: (todoId: string, subTaskId: string) => void;
  deleteSubTask: (todoId: string, subTaskId: string) => void;

  addHabit: (data: {
    title: string;
    direction: HabitDirection;
    difficulty: Habit['difficulty'];
    notes?: string;
  }) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  triggerHabit: (id: string, direction: 'up' | 'down') => void;

  addReward: (data: { title: string; description?: string; goldCost: number }) => void;
  updateReward: (id: string, updates: Partial<Reward>) => void;
  deleteReward: (id: string) => void;
  redeemReward: (rewardId: string) => boolean;

  checkAndResetDailies: () => void;
  addXP: (amount: number) => void;
  addGold: (amount: number) => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  addLogEntry: (entry: Omit<ActivityLogEntry, 'id'>) => void;
  removeLogEntry: (taskId: string) => void;

  spawnBoss: () => void;
  dealDamageToBoss: (amount: number) => void;

  setTaskFilter: (filter: 'daily' | 'todo') => void;
  setTheme: (theme: ThemeColor) => void;
}

type GameStore = AppState & GameActions;

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      user: { ...DEFAULT_USER },
      dailies: [],
      todos: [],
      habits: [],
      rewards: [createHealthPotion(), createXpBoost(), createStreakFreeze()],
      activityLog: [],
      lastResetDate: getTodayDateString(),
      schemaVersion: 2,
      boss: null,
      totalBossesDefeated: 0,
      xpBoostRemaining: 0,
      streakFrozen: false,
      taskFilter: 'daily' as const,
      theme: ThemeColor.Blue,

      addDaily: (data) => {
        const now = new Date().toISOString();
        const daily: Daily = {
          ...data,
          type: TaskType.Daily,
          id: generateId(),
          completedToday: false,
          streak: 0,
          longestStreak: 0,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ dailies: [...s.dailies, daily] }));
      },

      updateDaily: (id, updates) => {
        set((s) => ({
          dailies: s.dailies.map((d) =>
            d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d,
          ),
        }));
      },

      deleteDaily: (id) => {
        set((s) => ({ dailies: s.dailies.filter((d) => d.id !== id) }));
      },

      toggleDaily: (id) => {
        get().checkAndResetDailies();
        const daily = get().dailies.find((d) => d.id === id);
        if (!daily) return;

        if (daily.completedToday) {
          const xp = calculateXPForDifficulty(daily.difficulty);
          const gold = calculateGoldForDifficulty(daily.difficulty);
          set((s) => ({
            user: {
              ...s.user,
              xp: Math.max(0, s.user.xp - xp),
              gold: Math.max(0, s.user.gold - gold),
              totalTasksCompleted: Math.max(0, s.user.totalTasksCompleted - 1),
            },
            dailies: s.dailies.map((d) =>
              d.id === id
                ? { ...d, completedToday: false, streak: Math.max(0, d.streak - 1) }
                : d,
            ),
          }));
          get().removeLogEntry(id);
        } else {
          const baseXp = calculateXPForDifficulty(daily.difficulty);
          const gold = calculateGoldForDifficulty(daily.difficulty);
          const state = get();
          const xpMult = state.xpBoostRemaining > 0 ? XP_BOOST_MULTIPLIER : 1;
          const xp = baseXp * xpMult;
          const newStreak = daily.streak + 1;

          if (state.xpBoostRemaining > 0) {
            set((s) => ({ xpBoostRemaining: s.xpBoostRemaining - 1 }));
          }

          set((s) => ({
            dailies: s.dailies.map((d) =>
              d.id === id
                ? {
                    ...d,
                    completedToday: true,
                    streak: newStreak,
                    longestStreak: Math.max(d.longestStreak, newStreak),
                  }
                : d,
            ),
          }));
          get().addXP(xp);
          get().addGold(gold);
          set((s) => ({
            user: { ...s.user, totalTasksCompleted: s.user.totalTasksCompleted + 1 },
          }));
          get().addLogEntry({
            timestamp: new Date().toISOString(),
            message: `完成每日「${daily.title}」+${xp}XP +${gold}💰`,
            type: 'xp',
            amount: xp,
            taskId: id,
          });
          get().dealDamageToBoss(BOSS_DAMAGE_PER_TASK);
        }
      },

      addTodo: (data) => {
        const now = new Date().toISOString();
        const subTasks: SubTask[] = (data.subTasks || []).map((st) => ({
          id: generateId(),
          title: st.title,
          completed: false,
        }));
        const { subTasks: _, ...rest } = data;
        const todo: Todo = {
          ...rest,
          type: TaskType.Todo,
          id: generateId(),
          completed: false,
          subTasks,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ todos: [...s.todos, todo] }));
      },

      updateTodo: (id, updates) => {
        set((s) => ({
          todos: s.todos.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t,
          ),
        }));
      },

      deleteTodo: (id) => {
        set((s) => ({ todos: s.todos.filter((t) => t.id !== id) }));
      },

      completeTodo: (id) => {
        const todo = get().todos.find((t) => t.id === id);
        if (!todo || todo.completed) return;

        const baseXp = calculateXPForDifficulty(todo.difficulty);
        const gold = calculateGoldForDifficulty(todo.difficulty);
        const state = get();
        const xpMult = state.xpBoostRemaining > 0 ? XP_BOOST_MULTIPLIER : 1;
        const xp = baseXp * xpMult;
        const now = new Date().toISOString();

        if (state.xpBoostRemaining > 0) {
          set((s) => ({ xpBoostRemaining: s.xpBoostRemaining - 1 }));
        }

        set((s) => ({
          todos: s.todos.map((t) =>
            t.id === id ? { ...t, completed: true, completedAt: now, updatedAt: now } : t,
          ),
        }));
        get().addXP(xp);
        get().addGold(gold);
        set((s) => ({
          user: { ...s.user, totalTasksCompleted: s.user.totalTasksCompleted + 1 },
        }));
        get().addLogEntry({
          timestamp: now,
          message: `完成待办「${todo.title}」+${xp}XP +${gold}💰`,
          type: 'xp',
          amount: xp,
          taskId: id,
        });
        get().dealDamageToBoss(BOSS_DAMAGE_PER_TASK);
      },

      uncompleteTodo: (id) => {
        const todo = get().todos.find((t) => t.id === id);
        if (!todo || !todo.completed) return;

        const xp = calculateXPForDifficulty(todo.difficulty);
        const gold = calculateGoldForDifficulty(todo.difficulty);
        set((s) => ({
          user: {
            ...s.user,
            xp: Math.max(0, s.user.xp - xp),
            gold: Math.max(0, s.user.gold - gold),
            totalTasksCompleted: Math.max(0, s.user.totalTasksCompleted - 1),
          },
          todos: s.todos.map((t) =>
            t.id === id
              ? { ...t, completed: false, completedAt: undefined, updatedAt: new Date().toISOString() }
              : t,
          ),
        }));
        get().removeLogEntry(id);
      },

      addSubTask: (todoId, title) => {
        set((s) => ({
          todos: s.todos.map((t) =>
            t.id === todoId
              ? {
                  ...t,
                  subTasks: [...t.subTasks, { id: generateId(), title, completed: false }],
                  updatedAt: new Date().toISOString(),
                }
              : t,
          ),
        }));
      },

      toggleSubTask: (todoId, subTaskId) => {
        set((s) => ({
          todos: s.todos.map((t) =>
            t.id === todoId
              ? {
                  ...t,
                  subTasks: t.subTasks.map((st) =>
                    st.id === subTaskId ? { ...st, completed: !st.completed } : st,
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : t,
          ),
        }));
      },

      deleteSubTask: (todoId, subTaskId) => {
        set((s) => ({
          todos: s.todos.map((t) =>
            t.id === todoId
              ? {
                  ...t,
                  subTasks: t.subTasks.filter((st) => st.id !== subTaskId),
                  updatedAt: new Date().toISOString(),
                }
              : t,
          ),
        }));
      },

      addHabit: (data) => {
        const now = new Date().toISOString();
        const habit: Habit = {
          ...data,
          id: generateId(),
          streak: 0,
          longestStreak: 0,
          positiveCount: 0,
          negativeCount: 0,
          todayPositiveCount: 0,
          todayNegativeCount: 0,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ habits: [...s.habits, habit] }));
      },

      updateHabit: (id, updates) => {
        set((s) => ({
          habits: s.habits.map((h) =>
            h.id === id ? { ...h, ...updates, updatedAt: new Date().toISOString() } : h,
          ),
        }));
      },

      deleteHabit: (id) => {
        set((s) => ({ habits: s.habits.filter((h) => h.id !== id) }));
      },

      triggerHabit: (id, direction) => {
        const habit = get().habits.find((h) => h.id === id);
        if (!habit) return;

        if (direction === 'up' && (habit.direction === HabitDirection.Positive || habit.direction === HabitDirection.Both)) {
          const xp = Math.ceil(calculateXPForDifficulty(habit.difficulty) / 2);
          const gold = Math.ceil(calculateGoldForDifficulty(habit.difficulty) / 2);
          get().addXP(xp);
          get().addGold(gold);
          const newTodayPos = habit.todayPositiveCount + 1;
          set((s) => ({
            habits: s.habits.map((h) =>
              h.id === id
                ? {
                    ...h,
                    positiveCount: h.positiveCount + 1,
                    todayPositiveCount: newTodayPos,
                    streak: h.streak + 1,
                    longestStreak: Math.max(h.longestStreak, h.streak + 1),
                  }
                : h,
            ),
            user: { ...s.user, totalHabitClicks: s.user.totalHabitClicks + 1 },
          }));
          get().addLogEntry({
            timestamp: new Date().toISOString(),
            message: `好习惯「${habit.title}」+${xp}XP +${gold}💰`,
            type: 'xp',
            amount: xp,
            taskId: id,
          });
        }

        if (direction === 'down' && (habit.direction === HabitDirection.Negative || habit.direction === HabitDirection.Both)) {
          const damage = calculateHPDamage(habit.difficulty);
          get().takeDamage(damage);
          set((s) => ({
            habits: s.habits.map((h) =>
              h.id === id
                ? { ...h, negativeCount: h.negativeCount + 1, todayNegativeCount: h.todayNegativeCount + 1 }
                : h,
            ),
            user: { ...s.user, totalHabitClicks: s.user.totalHabitClicks + 1 },
          }));
          get().addLogEntry({
            timestamp: new Date().toISOString(),
            message: `坏习惯「${habit.title}」-${damage} HP`,
            type: 'hp_damage',
            amount: damage,
            taskId: id,
          });
        }
      },

      addReward: (data) => {
        const now = new Date().toISOString();
        const reward: Reward = {
          ...data,
          id: generateId(),
          type: RewardType.Custom,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ rewards: [...s.rewards, reward] }));
      },

      updateReward: (id, updates) => {
        set((s) => ({
          rewards: s.rewards.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r,
          ),
        }));
      },

      deleteReward: (id) => {
        if (id === BUILT_IN_HEALTH_POTION_ID || id === BUILT_IN_XP_BOOST_ID || id === BUILT_IN_STREAK_FREEZE_ID) return;
        set((s) => ({ rewards: s.rewards.filter((r) => r.id !== id) }));
      },

      redeemReward: (rewardId) => {
        const state = get();
        const reward = state.rewards.find((r) => r.id === rewardId);
        if (!reward || state.user.gold < reward.goldCost) return false;

        set((s) => ({
          user: { ...s.user, gold: s.user.gold - reward.goldCost },
        }));

        if (reward.type === RewardType.HealthPotion) {
          get().heal(HEALTH_POTION_HEAL);
          get().addLogEntry({
            timestamp: new Date().toISOString(),
            message: `使用了生命药水 +${HEALTH_POTION_HEAL} HP`,
            type: 'hp_heal',
            amount: HEALTH_POTION_HEAL,
          });
        } else if (reward.type === RewardType.XpBoost) {
          set(() => ({ xpBoostRemaining: XP_BOOST_DURATION_TASKS }));
          get().addLogEntry({
            timestamp: new Date().toISOString(),
            message: `激活了 XP 增幅器！接下来 ${XP_BOOST_DURATION_TASKS} 个任务将获得 ${XP_BOOST_MULTIPLIER} 倍 XP`,
            type: 'xp',
            amount: XP_BOOST_DURATION_TASKS,
          });
        } else if (reward.type === RewardType.StreakFreeze) {
          set(() => ({ streakFrozen: true }));
          get().addLogEntry({
            timestamp: new Date().toISOString(),
            message: '激活了连胜冻结！今日未完成每日任务不会中断连胜',
            type: 'gold',
            amount: 0,
          });
        } else {
          get().addLogEntry({
            timestamp: new Date().toISOString(),
            message: `兑换了「${reward.title}」花费 ${reward.goldCost} 💰`,
            type: 'gold',
            amount: -reward.goldCost,
          });
        }
        return true;
      },

      addXP: (amount) => {
        set((s) => {
          let { xp, level } = s.user;
          xp += amount;
          while (xp >= xpToNextLevel(level)) {
            xp -= xpToNextLevel(level);
            level += 1;
            get().addLogEntry({
              timestamp: new Date().toISOString(),
              message: `升级了！达到等级 ${level}！`,
              type: 'levelup',
              amount: level,
            });
            if (!get().boss || get().boss?.defeated) {
              get().spawnBoss();
            }
          }
          const newMaxHp = calculateMaxHp(level);
          return {
            user: { ...s.user, xp, level, maxHp: newMaxHp, hp: s.user.hp },
          };
        });
      },

      addGold: (amount) => {
        set((s) => ({
          user: { ...s.user, gold: s.user.gold + amount },
        }));
      },

      takeDamage: (amount) => {
        set((s) => {
          const newHp = Math.max(0, s.user.hp - amount);
          if (newHp <= 0 && s.user.hp > 0) {
            const goldLoss = Math.floor(s.user.gold * DEATH_GOLD_LOSS_PERCENT);
            const revivedHp = Math.floor(s.user.maxHp * DEATH_REVIVE_HP_PERCENT);
            get().addLogEntry({
              timestamp: new Date().toISOString(),
              message: `生命值归零！失去了 ${goldLoss} 💰 和 ${DEATH_XP_LOSS} XP...`,
              type: 'death',
            });
            return {
              user: {
                ...s.user,
                hp: revivedHp,
                gold: Math.max(0, s.user.gold - goldLoss),
                xp: Math.max(0, s.user.xp - DEATH_XP_LOSS),
                deathCount: s.user.deathCount + 1,
              },
            };
          }
          return { user: { ...s.user, hp: newHp } };
        });
      },

      heal: (amount) => {
        set((s) => ({
          user: {
            ...s.user,
            hp: Math.min(s.user.maxHp, s.user.hp + amount),
          },
        }));
      },

      addLogEntry: (entry) => {
        const logEntry: ActivityLogEntry = { id: generateId(), ...entry };
        set((s) => ({
          activityLog: [logEntry, ...s.activityLog].slice(0, MAX_LOG_ENTRIES),
        }));
      },

      removeLogEntry: (taskId) => {
        set((s) => ({
          activityLog: s.activityLog.filter((e) => e.taskId !== taskId),
        }));
      },

      spawnBoss: () => {
        const level = get().user.level;
        const boss = createBoss(level);
        set({ boss });
        get().addLogEntry({
          timestamp: new Date().toISOString(),
          message: `新的首领出现了：「${boss.name}」(Lv.${level}) HP:${boss.maxHp}`,
          type: 'boss',
          amount: boss.maxHp,
        });
      },

      dealDamageToBoss: (amount) => {
        const boss = get().boss;
        if (!boss || boss.defeated) return;
        const newHp = Math.max(0, boss.hp - amount);
        const newDamage = boss.damageDealt + amount;
        if (newHp <= 0) {
          set((s) => ({
            boss: { ...boss, hp: 0, defeated: true, damageDealt: newDamage },
            totalBossesDefeated: s.totalBossesDefeated + 1,
          }));
          const xp = boss.xpReward;
          const gold = boss.goldReward;
          get().addXP(xp);
          get().addGold(gold);
          get().addLogEntry({
            timestamp: new Date().toISOString(),
            message: `击败了首领「${boss.name}」！+${xp}XP +${gold}💰`,
            type: 'boss',
            amount: xp,
          });
        } else {
          set({ boss: { ...boss, hp: newHp, damageDealt: newDamage } });
        }
      },

      setTaskFilter: (filter) => set({ taskFilter: filter }),

      setTheme: (theme) => {
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
      },

      checkAndResetDailies: () => {
        const today = getTodayDateString();
        const state = get();
        if (state.lastResetDate === today) return;

        let totalDamage = 0;
        const uncompleted = state.dailies.filter((d) => !d.completedToday);
        state.dailies.forEach((d) => {
          if (!d.completedToday) {
            totalDamage += DAILY_HP_PENALTY;
          }
        });

        const allCompleted = uncompleted.length === 0 && state.dailies.length > 0;
        const wasFrozen = state.streakFrozen;
        const newCurrentStreak = allCompleted
          ? state.user.currentStreak + 1
          : wasFrozen
            ? state.user.currentStreak
            : 0;

        set((s) => ({
          lastResetDate: today,
          streakFrozen: false,
          dailies: s.dailies.map((d) => ({
            ...d,
            completedToday: false,
            streak: d.completedToday ? d.streak : 0,
          })),
          habits: s.habits.map((h) => ({
            ...h,
            todayPositiveCount: 0,
            todayNegativeCount: 0,
            streak: h.todayPositiveCount > 0 ? h.streak : 0,
            longestStreak: Math.max(h.longestStreak, h.streak),
          })),
          user: {
            ...s.user,
            currentStreak: newCurrentStreak,
            longestStreak: Math.max(s.user.longestStreak, newCurrentStreak),
          },
        }));

        if (totalDamage > 0 && !wasFrozen) {
          get().takeDamage(totalDamage);
          get().addLogEntry({
            timestamp: new Date().toISOString(),
            message: `${uncompleted.length} 个每日任务未完成 -${totalDamage} HP`,
            type: 'hp_damage',
            amount: totalDamage,
          });
        }

        if (allCompleted && newCurrentStreak > 0 && newCurrentStreak % STREAK_BONUS_INTERVAL === 0) {
          get().addXP(STREAK_BONUS_XP);
          get().addGold(STREAK_BONUS_GOLD);
          get().addLogEntry({
            timestamp: new Date().toISOString(),
            message: `${STREAK_BONUS_INTERVAL} 天连胜奖励！+${STREAK_BONUS_XP}XP +${STREAK_BONUS_GOLD}💰`,
            type: 'xp',
            amount: STREAK_BONUS_XP,
          });
        }
      },
    }),
    {
      name: 'gamified-todo-storage',
      version: 2,
      migrate: (persistedState, version) => runMigrations(persistedState, version) as GameStore,
      onRehydrateStorage: () => (state) => {
        if (state) {
          const hasHealthPotion = state.rewards.some((r) => r.id === BUILT_IN_HEALTH_POTION_ID);
          if (!hasHealthPotion) {
            state.rewards = [createHealthPotion(), ...state.rewards];
          }
          const hasXpBoost = state.rewards.some((r) => r.id === BUILT_IN_XP_BOOST_ID);
          if (!hasXpBoost) {
            state.rewards = [...state.rewards, createXpBoost()];
          }
          const hasStreakFreeze = state.rewards.some((r) => r.id === BUILT_IN_STREAK_FREEZE_ID);
          if (!hasStreakFreeze) {
            state.rewards = [...state.rewards, createStreakFreeze()];
          }
          if (!state.boss) {
            state.boss = null;
          }
          if (state.totalBossesDefeated === undefined) {
            state.totalBossesDefeated = 0;
          }
          if (state.xpBoostRemaining === undefined) {
            state.xpBoostRemaining = 0;
          }
          if (state.streakFrozen === undefined) {
            state.streakFrozen = false;
          }
          if (state.taskFilter === undefined) {
            state.taskFilter = 'daily';
          }
          if (state.theme === undefined) {
            state.theme = ThemeColor.Blue;
          }
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    },
  ),
);
