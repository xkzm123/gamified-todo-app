import { useState } from 'react';
import { Difficulty, HabitDirection } from '../../types';
import { DIFFICULTY_LABELS, HABIT_DIRECTION_LABELS } from '../../constants/game';

interface Props {
  initialTitle?: string;
  initialDirection?: HabitDirection;
  initialDifficulty?: Difficulty;
  initialNotes?: string;
  onSave: (data: { title: string; direction: HabitDirection; difficulty: Difficulty; notes: string }) => void;
}

const DIFFICULTIES = [Difficulty.Easy, Difficulty.Medium, Difficulty.Hard];
const DIRECTIONS = [HabitDirection.Positive, HabitDirection.Negative, HabitDirection.Both];

export default function HabitForm({
  initialTitle = '',
  initialDirection = HabitDirection.Positive,
  initialDifficulty = Difficulty.Easy,
  initialNotes = '',
  onSave,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [direction, setDirection] = useState<HabitDirection>(initialDirection);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [notes, setNotes] = useState(initialNotes);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), direction, difficulty, notes: notes.trim() });
  };

  return (
    <div className="form-page">
      <label className="form-label">习惯名称</label>
      <input
        className="form-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="输入习惯名称..."
        autoFocus
      />

      <label className="form-label">类型</label>
      <div className="option-row">
        {DIRECTIONS.map((d) => (
          <button
            key={d}
            className={`option-btn ${direction === d ? 'option-active' : ''}`}
            onClick={() => setDirection(d)}
          >
            {HABIT_DIRECTION_LABELS[d]}
          </button>
        ))}
      </div>

      <label className="form-label">难度</label>
      <div className="option-row">
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            className={`option-btn ${difficulty === d ? 'option-active' : ''}`}
            onClick={() => setDifficulty(d)}
          >
            {DIFFICULTY_LABELS[d]}
          </button>
        ))}
      </div>

      <label className="form-label">备注 (可选)</label>
      <textarea
        className="form-input form-textarea"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="添加备注..."
      />

      <button className="save-btn save-habit" onClick={handleSave}>保存</button>
    </div>
  );
}
