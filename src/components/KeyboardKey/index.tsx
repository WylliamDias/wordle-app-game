import './styles.css';

import { IKey } from '../../utils/Keys';

interface IkeyboardKeyProps {
  keyItem: IKey;
  handleClick: () => void;
}

export const KeyboarKey: React.FC<IkeyboardKeyProps> = ({ keyItem, handleClick }) => {
  return (
    <div onClick={handleClick} style={{ backgroundColor: keyItem.color }} className='keyContainer'>
      <span>
        {keyItem.value}
      </span>
    </div>
  );
};
