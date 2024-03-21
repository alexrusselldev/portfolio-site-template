import { Navigation } from '../Navigation/Navigation';

interface IProps {}

export const TopBar: React.FC<IProps> = () => {
  return (
    <div className="sticky mx-auto w-full">
      <Navigation />
    </div>
  );
};
