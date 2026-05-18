import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import type { Daily, Todo } from '../../types';
import { TaskType } from '../../types';
import TaskCard from '../../components/tasks/TaskCard';
import TaskFilter from '../../components/tasks/TaskFilter';
import StatusBar from '../../components/common/StatusBar';
import FAB from '../../components/common/FAB';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';
import { useToast } from '../../hooks/useToast';

export default function TaskListScreen() {
  const [filter, setFilter] = useState<'daily' | 'todo'>('daily');
  const [showArchive, setShowArchive] = useState(false);
  const navigate = useNavigate();
  const dailies = useGameStore((s) => s.dailies);
  const todos = useGameStore((s) => s.todos);
  const toggleDaily = useGameStore((s) => s.toggleDaily);
  const completeTodo = useGameStore((s) => s.completeTodo);
  const uncompleteTodo = useGameStore((s) => s.uncompleteTodo);
  const deleteDaily = useGameStore((s) => s.deleteDaily);
  const deleteTodo = useGameStore((s) => s.deleteTodo);
  const toggleSubTask = useGameStore((s) => s.toggleSubTask);
  const checkAndResetDailies = useGameStore((s) => s.checkAndResetDailies);
  const { toast, showToast } = useToast();

  useEffect(() => {
    checkAndResetDailies();
  }, []);

  const handleToggle = (task: Daily | Todo) => {
    if (task.type === TaskType.Daily) {
      toggleDaily(task.id);
      const d = dailies.find((x) => x.id === task.id);
      if (d && !d.completedToday) {
        showToast('任务完成！');
      }
    } else {
      if ((task as Todo).completed) {
        uncompleteTodo(task.id);
      } else {
        completeTodo(task.id);
        showToast('待办完成！');
      }
    }
  };

  const handleDelete = (task: Daily | Todo) => {
    if (window.confirm(`确定要删除"${task.title}"吗？`)) {
      if (task.type === TaskType.Daily) {
        deleteDaily(task.id);
      } else {
        deleteTodo(task.id);
      }
    }
  };

  const activeTasks: (Daily | Todo)[] = filter === 'daily' ? dailies : todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  const renderTaskCard = (item: Daily | Todo) => (
    <TaskCard
      key={item.id}
      task={item}
      onToggle={() => handleToggle(item)}
      onEdit={() => navigate(`/tasks/edit/${item.type}/${item.id}`)}
      onDelete={() => handleDelete(item)}
      onToggleSubTask={
        item.type === TaskType.Todo
          ? (subId) => toggleSubTask(item.id, subId)
          : undefined
      }
    />
  );

  return (
    <div className="screen">
      <StatusBar />
      <TaskFilter selected={filter} onSelect={setFilter} />

      <div className="list-container">
        {activeTasks.length === 0 && completedTodos.length === 0 ? (
          <EmptyState
            icon="tasks"
            message={filter === 'daily' ? '还没有每日任务\n点击下方按钮添加' : '还没有待办事项\n点击下方按钮添加'}
          />
        ) : (
          <>
            {activeTasks.map(renderTaskCard)}

            {filter === 'todo' && completedTodos.length > 0 && (
              <>
                <div className="archive-toggle" onClick={() => setShowArchive(!showArchive)}>
                  <span>{showArchive ? '▼' : '▶'}</span>
                  <span>已完成的任务 ({completedTodos.length})</span>
                </div>
                {showArchive && completedTodos.map(renderTaskCard)}
              </>
            )}
          </>
        )}
        <div className="bottom-spacer" />
      </div>

      <FAB onClick={() => navigate(`/tasks/add/${filter}`)} />
      <Toast toast={toast} />
    </div>
  );
}
