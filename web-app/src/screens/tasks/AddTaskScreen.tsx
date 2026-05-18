import { useNavigate, useParams } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import TaskForm from '../../components/tasks/TaskForm';

export default function AddTaskScreen() {
  const { type } = useParams<{ type: 'daily' | 'todo' }>();
  const navigate = useNavigate();
  const addDaily = useGameStore((s) => s.addDaily);
  const addTodo = useGameStore((s) => s.addTodo);

  const handleSave = (data: { title: string; difficulty: any; notes: string }) => {
    if (type === 'daily') {
      addDaily(data);
    } else {
      addTodo(data);
    }
    navigate(-1);
  };

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>← 返回</button>
        <span className="header-title">新建{type === 'daily' ? '每日任务' : '待办事项'}</span>
        <div className="header-spacer" />
      </div>
      <TaskForm onSave={handleSave} />
    </div>
  );
}
