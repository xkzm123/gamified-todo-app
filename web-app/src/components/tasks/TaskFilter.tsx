interface Props {
  selected: 'daily' | 'todo';
  onSelect: (type: 'daily' | 'todo') => void;
}

export default function TaskFilter({ selected, onSelect }: Props) {
  return (
    <div className="filter-bar">
      <button
        className={`filter-btn ${selected === 'daily' ? 'filter-active' : ''}`}
        onClick={() => onSelect('daily')}
      >
        每日任务
      </button>
      <button
        className={`filter-btn ${selected === 'todo' ? 'filter-active' : ''}`}
        onClick={() => onSelect('todo')}
      >
        待办事项
      </button>
    </div>
  );
}
