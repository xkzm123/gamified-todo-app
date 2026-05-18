import { IconEmptyTasks, IconEmptyHabits, IconEmptyRewards } from './Icons';

interface Props {
  icon: 'tasks' | 'habits' | 'rewards';
  message: string;
}

const iconMap = {
  tasks: IconEmptyTasks,
  habits: IconEmptyHabits,
  rewards: IconEmptyRewards,
};

export default function EmptyState({ icon, message }: Props) {
  const Icon = iconMap[icon];
  return (
    <div className="empty-state">
      <div className="empty-icon-svg"><Icon size={64} /></div>
      <div className="empty-message">
        {message.split('\n').map((line, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
