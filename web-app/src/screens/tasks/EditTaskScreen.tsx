import { useNavigate, useParams } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import TaskForm from '../../components/tasks/TaskForm';

export default function EditTaskScreen() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const dailies = useGameStore((s) => s.dailies);
  const todos = useGameStore((s) => s.todos);
  const updateDaily = useGameStore((s) => s.updateDaily);
  const updateTodo = useGameStore((s) => s.updateTodo);

  const task = type === 'daily'
    ? dailies.find((d) => d.id === id)
    : todos.find((t) => t.id === id);

  if (!task) {
    navigate('/tasks', { replace: true });
    return null;
  }

  const handleSave = (data: { title: string; difficulty: any; notes: string }) => {
    if (type === 'daily') {
      updateDaily(id!, data);
    } else {
      updateTodo(id!, data);
    }
    navigate(-1);
  };

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>← 返回</button>
        <span className="header-title">编辑{type === 'daily' ? '每日任务' : '待办事项'}</span>
        <div className="header-spacer" />
      </div>
      <TaskForm
        initialTitle={task.title}
        initialDifficulty={task.difficulty}
        initialNotes={task.notes || ''}
        onSave={handleSave}
      />
    </div>
  );
}
