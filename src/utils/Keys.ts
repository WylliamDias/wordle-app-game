export enum KeyColors {
  Default = '#454654',
  Wrong = '#222020',
  Correct = '#009874',
  Close = '#E4D00A'
}

export interface IKey {
  value: string;
  color: KeyColors;
}

function Key(keyValue: string): IKey {
  return {
    value: keyValue,
    color: KeyColors.Default
  };
}

export const acceptedKeys: string[] = [
  'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
  'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE'
];

const keyboardKeys: IKey[] = acceptedKeys.map(key => {
  return Key(key);
});

export const keyboardKeysLayout: [ IKey[], IKey[], IKey[] ] = [
  keyboardKeys.slice(0, 10),
  keyboardKeys.slice(10, 19),
  keyboardKeys.slice(19, 28)
];
