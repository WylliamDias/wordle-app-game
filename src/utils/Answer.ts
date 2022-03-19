export class LetterCorrection {
  public isInside = false;
  public isInCorrectPlace = false;
}

export interface IAnswer {
  insertion: string;
  correction: LetterCorrection[];
  gotCorrected: boolean;
}

export function Answer(numOfLetters: number) {
  return {
    insertion: '',
    correction: new Array(numOfLetters).fill([]).map(() => new LetterCorrection()),
    gotCorrected: false
  };
}
