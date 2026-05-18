interface Props {
  icon: string;
  message: string;
}

export default function EmptyState({ icon, message }: Props) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div className="empty-message">{message}</div>
    </div>
  );
}
