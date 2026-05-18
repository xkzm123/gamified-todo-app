import { useNavigate, useParams } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import HabitForm from '../../components/habits/HabitForm';

export default function EditHabitScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const habits = useGameStore((s) => s.habits);
  const updateHabit = useGameStore((s) => s.updateHabit);

  const habit = habits.find((h) => h.id === id);

  if (!habit) {
    navigate('/habits', { replace: true });
    return null;
  }

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>← 返回</button>
        <span className="header-title">编辑习惯</span>
        <div className="header-spacer" />
      </div>
      <HabitForm
        initialTitle={habit.title}
        initialDirection={habit.direction}
        initialDifficulty={habit.difficulty}
        initialNotes={habit.notes || ''}
        onSave={(data) => {
          updateHabit(id!, data);
          navigate(-1);
        }}
      />
    </div>
  );
}
