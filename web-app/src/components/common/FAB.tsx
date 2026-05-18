import { IconPlus } from './Icons';

interface Props {
  onClick: () => void;
}

export default function FAB({ onClick }: Props) {
  return (
    <button className="fab" onClick={onClick}>
      <IconPlus size={26} />
    </button>
  );
}
