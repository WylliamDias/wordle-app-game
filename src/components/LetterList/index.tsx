import { memo, useMemo, } from "react";
import { IAnswer } from "../../utils/Answer";

import './styles.css';

interface ILetterList {
  insertedWord: IAnswer;
};

const LetterList: React.FC<ILetterList> = ({ insertedWord }) => {
  const listOfInsertedLetters = useMemo(() => {
    return new Array(5).fill([]).map((_, index) => {
      return (
        <div
          key={index}
          className={`letter ${insertedWord.gotCorrected ? 'flip' : ''}`}
          style={{
            backgroundColor: (insertedWord.gotCorrected && ((insertedWord.correction[ index ].isInCorrectPlace && '#009874') || (insertedWord.correction[ index ].isInside && '#E4D00A') || '#222020')) || '#454654',
            transitionDelay: insertedWord.gotCorrected ? `calc(0.3s + ${index / 3}s)` : '0s',
            transitionDuration: insertedWord.gotCorrected ? '0.3s' : '0s',
            animationDelay: `${index / 3}s`
          }}>
          {insertedWord.insertion[ index ] && (<span style={{ animationDelay: `${index / 3}s` }}>{insertedWord.insertion[ index ]}</span>)}
        </div>
      );
    });
  }, [ insertedWord.insertion, insertedWord.gotCorrected ]);

  return (
    <div className='letter-list'>
      {listOfInsertedLetters.map(letter => letter)}
    </div>
  );
};

export default memo(LetterList);
