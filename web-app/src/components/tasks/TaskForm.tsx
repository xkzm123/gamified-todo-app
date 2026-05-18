import { useState } from 'react';
import { Difficulty } from '../../types';
import { DIFFICULTY_LABELS } from '../../constants/game';

interface Props {
  initialTitle?: string;
  initialDifficulty?: Difficulty;
  initialNotes?: string;
  initialSubTasks?: { title: string }[];
  showSubTasks?: boolean;
  onSave: (data: { title: string; difficulty: Difficulty; notes: string; subTasks?: { title: string }[] }) => void;
}

const DIFFICULTIES = [Difficulty.Easy, Difficulty.Medium, Difficulty.Hard];

export default function TaskForm({
  initialTitle = '',
  initialDifficulty = Difficulty.Easy,
  initialNotes = '',
  initialSubTasks,
  showSubTasks = false,
  onSave,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [notes, setNotes] = useState(initialNotes);
  const [subTasks, setSubTasks] = useState<{ title: string }[]>(initialSubTasks || []);
  const [subInput, setSubInput] = useState('');

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      difficulty,
      notes: notes.trim(),
      subTasks: showSubTasks ? subTasks : undefined,
    });
  };

  const addSubTask = () => {
    if (!subInput.trim()) return;
    setSubTasks([...subTasks, { title: subInput.trim() }]);
    setSubInput('');
  };

  const removeSubTask = (idx: number) => {
    setSubTasks(subTasks.filter((_, i) => i !== idx));
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

      {showSubTasks && (
        <div className="subtask-section">
          <div className="subtask-section-title">子任务</div>
          <div className="subtask-input-row">
            <input
              className="subtask-input"
              value={subInput}
              onChange={(e) => setSubInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubTask(); } }}
              placeholder="添加子任务..."
            />
            <button className="subtask-add-btn" onClick={addSubTask}>添加</button>
          </div>
          {subTasks.length > 0 && (
            <div className="subtask-tags">
              {subTasks.map((st, i) => (
                <span key={i} className="subtask-tag">
                  {st.title}
                  <button className="subtask-tag-remove" onClick={() => removeSubTask(i)}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <button className="save-btn" onClick={handleSave}>保存</button>
    </div>
  );
}
