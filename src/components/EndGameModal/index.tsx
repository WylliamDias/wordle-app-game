import './styles.css';

interface IEndGameModalProps {
  wordIsCorrect: boolean;
  correctWord?: string;
  closeModal: () => void;
  playAgain: () => void;
}

export const EndGameModal: React.FC<IEndGameModalProps> = ({ wordIsCorrect, correctWord, closeModal, playAgain }) => {
  return (
    <div className="modal">
      <h1>
        <span>{wordIsCorrect ? 'You Win !' : 'You Lose'}</span>
        {!wordIsCorrect && (<p style={{ fontSize: '1rem' }}>Answer was: {correctWord}</p>)}
        <button onClick={closeModal} className="close">X</button>

        <button onClick={playAgain} className="play-again">
          <span>Play Again?</span>
        </button>
      </h1>
    </div>
  );
};
