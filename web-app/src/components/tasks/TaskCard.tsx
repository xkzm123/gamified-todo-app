import type { Daily, Todo } from '../../types';
import { TaskType, Difficulty } from '../../types';
import { DIFFICULTY_LABELS } from '../../constants/game';
import { calculateXPForDifficulty, calculateGoldForDifficulty } from '../../utils/gamification';
import { IconCheck, IconCoin, IconFire, IconTrash } from '../common/Icons';

interface Props {
  task: Daily | Todo;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleSubTask?: (subTaskId: string) => void;
}

const DIFF_COLORS: Record<Difficulty, string> = {
  [Difficulty.Easy]: '#27ae60',
  [Difficulty.Medium]: '#f39c12',
  [Difficulty.Hard]: '#e74c3c',
};

export default function TaskCard({ task, onToggle, onEdit, onDelete, onToggleSubTask }: Props) {
  const isDaily = task.type === TaskType.Daily;
  const isCompleted = isDaily ? (task as Daily).completedToday : (task as Todo).completed;
  const isTodo = task.type === TaskType.Todo;
  const subTasks = isTodo ? (task as Todo).subTasks : [];
  const subDone = subTasks.filter((st) => st.completed).length;

  return (
    <div className={`card ${isCompleted ? 'card-done' : ''}`}>
      <button className="check-btn" onClick={onToggle}>
        <div className={`check-circle ${isCompleted ? 'check-checked' : ''}`}>
          {isCompleted && <IconCheck size={14} />}
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
              +{calculateXPForDifficulty(task.difficulty)} XP +{calculateGoldForDifficulty(task.difficulty)} <IconCoin size={14} />
            </span>
          )}
          {isDaily && (task as Daily).streak > 0 && (
            <span className="streak-text"><IconFire size={12} /> {(task as Daily).streak}天</span>
          )}
        </div>
        {task.notes && <div className="card-notes">{task.notes}</div>}

        {subTasks.length > 0 && (
          <div className="subtask-list" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>
              子任务 {subDone}/{subTasks.length}
            </div>
            {subTasks.map((st) => (
              <div
                key={st.id}
                className="subtask-item"
                onClick={() => onToggleSubTask?.(st.id)}
              >
                <div className={`subtask-dot ${st.completed ? 'subtask-done' : ''}`}>
                  {st.completed && <span className="subtask-check"><IconCheck size={10} /></span>}
                </div>
                <span className={`subtask-title ${st.completed ? 'subtask-title-done' : ''}`}>{st.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="del-btn" onClick={onDelete}><IconTrash size={16} /></button>
    </div>
  );
}
