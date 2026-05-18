import type { Daily, Todo } from '../../types';
import { TaskType, Difficulty } from '../../types';
import { DIFFICULTY_LABELS } from '../../constants/game';
import { calculateXPForDifficulty, calculateGoldForDifficulty } from '../../utils/gamification';

interface Props {
  task: Daily | Todo;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const DIFF_COLORS: Record<Difficulty, string> = {
  [Difficulty.Easy]: '#27ae60',
  [Difficulty.Medium]: '#f39c12',
  [Difficulty.Hard]: '#e74c3c',
};

export default function TaskCard({ task, onToggle, onEdit, onDelete }: Props) {
  const isDaily = task.type === TaskType.Daily;
  const isCompleted = isDaily ? (task as Daily).completedToday : (task as Todo).completed;

  return (
    <div className={`card ${isCompleted ? 'card-done' : ''}`}>
      <button className="check-btn" onClick={onToggle}>
        <div className={`check-circle ${isCompleted ? 'check-checked' : ''}`}>
          {isCompleted && <span>✓</span>}
        </div>
      </button>

      <div className="card-content" onClick={onEdit}>
        <div className={`card-title ${isCompleted ? 'title-done' : ''}`}>{task.title}</div>
        <div className="card-meta">
          <span className="badge" style={{ backgroundColor: DIFF_COLORS[task.difficulty] }}>
            {DIFFICULTY_LABELS[task.difficulty]}
          </span>
          {!isCompleted && (
            <span className="reward-text">
              +{calculateXPForDifficulty(task.difficulty)} XP +{calculateGoldForDifficulty(task.difficulty)} 🪙
            </span>
          )}
          {isDaily && (task as Daily).streak > 0 && (
            <span className="streak-text">🔥 {(task as Daily).streak}天</span>
          )}
        </div>
        {task.notes && <div className="card-notes">{task.notes}</div>}
      </div>

      <button className="del-btn" onClick={onDelete}>🗑</button>
    </div>
  );
}
