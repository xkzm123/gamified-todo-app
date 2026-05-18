import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import HabitCard from '../../components/habits/HabitCard';
import StatusBar from '../../components/common/StatusBar';
import FAB from '../../components/common/FAB';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';
import { useToast } from '../../hooks/useToast';

export default function HabitListScreen() {
  const navigate = useNavigate();
  const habits = useGameStore((s) => s.habits);
  const triggerHabit = useGameStore((s) => s.triggerHabit);
  const deleteHabit = useGameStore((s) => s.deleteHabit);
  const checkAndResetDailies = useGameStore((s) => s.checkAndResetDailies);
  const { toast, showToast } = useToast();

  useEffect(() => {
    checkAndResetDailies();
  }, []);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`确定要删除"${title}"吗？`)) {
      deleteHabit(id);
    }
  };

  return (
    <div className="screen">
      <StatusBar />

      <div className="list-container">
        {habits.length === 0 ? (
          <EmptyState icon="habits" message="还没有习惯\n点击下方按钮添加" />
        ) : (
          habits.map((item) => (
            <HabitCard
              key={item.id}
              habit={item}
              onTapUp={() => {
                triggerHabit(item.id, 'up');
                showToast('好习惯！继续坚持！');
              }}
              onTapDown={() => {
                triggerHabit(item.id, 'down');
                showToast('记得避免坏习惯哦');
              }}
              onEdit={() => navigate(`/habits/edit/${item.id}`)}
              onDelete={() => handleDelete(item.id, item.title)}
            />
          ))
        )}
        <div className="bottom-spacer" />
      </div>

      <FAB onClick={() => navigate('/habits/add')} />
      <Toast toast={toast} />
    </div>
  );
}
