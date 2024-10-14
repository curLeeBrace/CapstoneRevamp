// useInputLimit.ts
import { useEffect } from 'react';

const useInputValidation = <T extends Record<string, number>>(
  inputState: T,
  setInputState: React.Dispatch<React.SetStateAction<T>>, 
  limit: number
) => {
  useEffect(() => {
    const checkInputLimits = () => {
      const exceededKeys = Object.keys(inputState).filter(key => inputState[key] > limit);
      if (exceededKeys.length > 0) {
        alert("Maximum input exceeded (3 digits max)");
        setInputState(prevState => ({
          ...prevState,
          [exceededKeys[0]]: 0, // Reset the exceeded field to 0
        }));
      }
    };

    checkInputLimits();
  }, [inputState, setInputState, limit]); // Run effect whenever `inputState` changes
};

export default useInputValidation;
