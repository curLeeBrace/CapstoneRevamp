import { useEffect } from 'react';

const useStationaryValidation = <T extends Record<string, any>>(
  inputState: T,
  setInputState: React.Dispatch<React.SetStateAction<T>>,
  limit: number,
  resetValue: number = 0
) => {
  useEffect(() => {
    const checkInputLimits = () => {
      const exceededKeys = Object.keys(inputState).filter(
        key => typeof inputState[key] === "number" && inputState[key] > limit
      );

      if (exceededKeys.length > 0) {
        alert(`Maximum input exceeded (3 digits max))`);
        setInputState(prevState => ({
          ...prevState,
          [exceededKeys[0]]: resetValue,
        }));
      }
    };

    checkInputLimits();
  }, [inputState, setInputState, limit, resetValue]);
};

export default useStationaryValidation;
