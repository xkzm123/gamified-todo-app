import { useState } from 'react';
import { Difficulty } from '../../types';
import { DIFFICULTY_LABELS } from '../../constants/game';

interface Props {
  initialTitle?: string;
  initialDifficulty?: Difficulty;
  initialNotes?: string;
  onSave: (data: { title: string; difficulty: Difficulty; notes: string }) => void;
}

const DIFFICULTIES = [Difficulty.Easy, Difficulty.Medium, Difficulty.Hard];

export default function TaskForm({ initialTitle = '', initialDifficulty = Difficulty.Easy, initialNotes = '', onSave }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [notes, setNotes] = useState(initialNotes);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), difficulty, notes: notes.trim() });
  };

  return (
    <div className="form-page">
      <label className="form-label">任务名称</label>
      <input
        className="form-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="输入任务名称..."
        autoFocus
      />

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

      <button className="save-btn" onClick={handleSave}>保存</button>
    </div>
  );
}
