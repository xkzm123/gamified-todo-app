import type { Habit } from '../../types';
import { HabitDirection, Difficulty } from '../../types';
import { DIFFICULTY_LABELS, HABIT_DIRECTION_LABELS } from '../../constants/game';
import { calculateXPForDifficulty, calculateHPDamage } from '../../utils/gamification';

interface Props {
  habit: Habit;
  onTapUp: () => void;
  onTapDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const DIFF_COLORS: Record<Difficulty, string> = {
  [Difficulty.Easy]: '#27ae60',
  [Difficulty.Medium]: '#f39c12',
  [Difficulty.Hard]: '#e74c3c',
};

export default function HabitCard({ habit, onTapUp, onTapDown, onEdit, onDelete }: Props) {
  const showUp = habit.direction === HabitDirection.Positive || habit.direction === HabitDirection.Both;
  const showDown = habit.direction === HabitDirection.Negative || habit.direction === HabitDirection.Both;

  return (
    <div className="card">
      <div className="card-content" onClick={onEdit}>
        <div className="card-title">{habit.title}</div>
        <div className="card-meta">
          <span className="badge" style={{ backgroundColor: DIFF_COLORS[habit.difficulty] }}>
            {DIFFICULTY_LABELS[habit.difficulty]}
          </span>
          <span className="dir-text">{HABIT_DIRECTION_LABELS[habit.direction]}</span>
          {habit.streak > 0 && <span className="streak-text">🔥 {habit.streak}天</span>}
        </div>
      </div>

      <div className="habit-actions">
        {showUp && (
          <button className="habit-btn habit-up" onClick={onTapUp}>
            <span className="habit-btn-icon">+</span>
            <span className="habit-btn-sub">+{Math.ceil(calculateXPForDifficulty(habit.difficulty) / 2)}XP</span>
          </button>
        )}
        {showDown && (
          <button className="habit-btn habit-down" onClick={onTapDown}>
            <span className="habit-btn-icon">-</span>
            <span className="habit-btn-sub">-{calculateHPDamage(habit.difficulty)}HP</span>
          </button>
        )}
      </div>

      <button className="del-btn" onClick={onDelete}>🗑</button>
    </div>
  );
}
