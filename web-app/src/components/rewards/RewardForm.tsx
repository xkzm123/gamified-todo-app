import { useState } from 'react';

interface Props {
  initialTitle?: string;
  initialDescription?: string;
  initialGoldCost?: number;
  onSave: (data: { title: string; description: string; goldCost: number }) => void;
}

export default function RewardForm({
  initialTitle = '',
  initialDescription = '',
  initialGoldCost = 10,
  onSave,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [goldCost, setGoldCost] = useState(String(initialGoldCost));

  const handleSave = () => {
    if (!title.trim()) return;
    const cost = parseInt(goldCost, 10);
    if (isNaN(cost) || cost <= 0) return;
    onSave({ title: title.trim(), description: description.trim(), goldCost: cost });
  };

  return (
    <div className="form-page">
      <label className="form-label">奖励名称</label>
      <input
        className="form-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="例如：看一部电影"
        autoFocus
      />

      <label className="form-label">描述 (可选)</label>
      <input
        className="form-input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="奖励的详细描述..."
      />

      <label className="form-label">金币价格</label>
      <input
        className="form-input"
        value={goldCost}
        onChange={(e) => setGoldCost(e.target.value)}
        placeholder="10"
        type="number"
        inputMode="numeric"
      />

      <button className="save-btn save-reward" onClick={handleSave}>保存</button>
    </div>
  );
}
