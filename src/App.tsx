import { useEffect, useRef, useState } from "react";
import { EndGameModal } from "./components/EndGameModal";
import { KeyboarKey } from "./components/KeyboardKey";
import LetterList from './components/LetterList';

import { Answer, LetterCorrection } from './utils/Answer';
import { keyboardKeysLayout, acceptedKeys, KeyColors } from "./utils/Keys";
import { randomWord, wordIsAvailable } from "./utils/randomWord";

function App() {

  const GAME_CONFIGS = useRef({
    maximumTries: 6,
    maximumLetters: 5
  });

  const [ insertedWord, setInsertedWord ] = useState('');
  const [ currentTry, setCurrentTry ] = useState(0);
  const [ answers, setAnswers ] = useState(
    new Array(GAME_CONFIGS.current.maximumTries).fill([]).map(() => Answer(GAME_CONFIGS.current.maximumLetters))
  );
  const [ showEndGameModal, setShowEndGameModal ] = useState(false);
  const [ insertedCorrectWord, setInsertedCorrectWord ] = useState(false);
  const [ correctWord, setCorrectWord ] = useState(randomWord());

  function checkWord() {
    if (insertedWord.length < 5 || currentTry > 6 || insertedCorrectWord) return;
    if (!wordIsAvailable(insertedWord)) return;

    if (insertedWord == correctWord) {
      setInsertedCorrectWord(true);
      setTimeout(() => {
        setShowEndGameModal(true);
      }, 5000 / 3);
    }

    let copyOfCorrectWord = correctWord;
    const newCorrections = new Array(5).fill([]).map(() => new LetterCorrection());

    insertedWord.split('').forEach((letter, index) => {
      if (copyOfCorrectWord.includes(letter)) {
        newCorrections[ index ].isInside = true;
        newCorrections[ index ].isInCorrectPlace = letter == copyOfCorrectWord[ index ];
        copyOfCorrectWord = copyOfCorrectWord.replace(letter, '.');
      }
    });

    keyboardKeysLayout.forEach(listOfKeys => {
      listOfKeys.forEach(key => {
        const indexOfKey = insertedWord.indexOf(key.value);

        if (indexOfKey >= 0) {
          if (newCorrections[ indexOfKey ].isInCorrectPlace) {
            key.color = KeyColors.Correct;
          } else if (newCorrections[ indexOfKey ].isInside) {
            key.color = KeyColors.Close;
          } else {
            key.color = KeyColors.Wrong;
          }
        }
      });
    });


    setCurrentTry(currentTry < 6 ? currentTry + 1 : currentTry);

    setInsertedWord('');

    setAnswers(prevAnswer => {
      return prevAnswer.map((answer, index) => {
        if (currentTry == index) {
          return {
            ...answer,
            correction: [ ...newCorrections ],
            gotCorrected: true
          };
        }

        return answer;
      });
    });

  };

  function addKey(eventKey: string) {
    if (insertedCorrectWord || !(currentTry < 6)) return;
    if (insertedWord.length < 5) setInsertedWord(prevWord => prevWord + eventKey);
  }

  function deleteKey() {
    setInsertedWord(prevWord => {
      const newWord = prevWord.slice(0, prevWord.length - 1);

      return newWord;
    });
  }

  useEffect(() => {
    if (insertedWord.length <= 5) {
      setAnswers(prevAnswer => {
        return prevAnswer.map((answer, index) => {
          if (index == currentTry) {
            return {
              ...answer,
              insertion: insertedWord
            };
          }

          return answer;
        });
      });
    }
  }, [ insertedWord, currentTry ]);

  useEffect(() => {
    document.onkeydown = (ev) => {
      const eventKey = ev.key == 'Backspace' ? 'DELETE' : ev.key.toUpperCase();
      const findedKey = acceptedKeys.includes(eventKey);

      if (findedKey) {
        if (eventKey == 'ENTER') return checkWord();
        if (eventKey == 'DELETE') return deleteKey();

        addKey(eventKey);
      }

    };
  });

  useEffect(() => {
    if (currentTry == 6 && !insertedCorrectWord) {
      setTimeout(() => {
        setShowEndGameModal(true);
        setInsertedCorrectWord(false);
      }, 5500 / 3);
    }
  }, [ currentTry, insertedCorrectWord ]);

  function resetGame() {
    setCorrectWord(randomWord());
    setCurrentTry(0);
    setShowEndGameModal(false);
    setInsertedCorrectWord(false);
    setInsertedWord('');
    setAnswers(new Array(6).fill([]).map(() => Answer(5)));
    keyboardKeysLayout.forEach(keyList => {
      keyList.forEach(key => {
        key.color = KeyColors.Default;
      });
    });
  }

  return (
    <>
      <section style={{
        width: '100vw',
        height: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 50% 1fr',
        gridTemplateRows: '8% 1fr auto',
        gridTemplateAreas: "'header header header' '. main .' '. footer .'",
        placeItems: 'center',
        gridGap: '5px',
        backgroundColor: '#0D0812'
      }}>
        <header style={{
          gridArea: 'header',
          width: '100%',
          height: '100%',
          backgroundColor: '#966BED',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          letterSpacing: '3px'
        }}>
          <h1>WORDLE</h1>
        </header>

        <main style={{
          display: 'grid',
          gridAutoRows: '50px',
          gridRowGap: '5px',
          gridArea: 'main'
        }}>
          {
            answers.map((answer, index) => {
              return (
                <LetterList
                  key={index}
                  insertedWord={answer}
                />
              );
            })
          }
        </main>

        <footer style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gridArea: 'footer',
          gap: '10px',
          paddingBlock: '10px'
        }}>
          {
            keyboardKeysLayout.map((listOfKeys, index) => {
              return (
                <div className='keyList' key={index} style={{
                  display: 'grid',
                  gridAutoFlow: 'column',
                  gridAutoColumns: index != 1 ? (index == 2 && '1fr repeat(7, 45px) 1fr') || '1fr' : '45px',
                  gridGap: '10px',
                  alignSelf: index == 1 ? 'center' : 'stretch'
                }}>
                  {
                    listOfKeys.map((currentKey) => {
                      const click = (
                        currentKey.value == 'ENTER'
                          ? checkWord
                          : (
                            currentKey.value == 'DELETE'
                              ? deleteKey
                              : addKey.bind(null, currentKey.value)
                          )
                      );

                      return (
                        <KeyboarKey handleClick={() => click()} key={currentKey.value} keyItem={currentKey} />
                      );
                    })
                  }
                </div>
              );
            })
          }
        </footer>
      </section>
      {showEndGameModal && (
        <EndGameModal
          wordIsCorrect={insertedCorrectWord}
          closeModal={() => setShowEndGameModal(false)}
          playAgain={() => resetGame()}
          correctWord={showEndGameModal ? correctWord : ''}
        />
      )}
    </>
  );
}

export default App;
