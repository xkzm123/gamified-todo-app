interface Props {
  onClick: () => void;
}

export default function FAB({ onClick }: Props) {
  return (
    <button className="fab" onClick={onClick}>
      +
    </button>
  );
}
