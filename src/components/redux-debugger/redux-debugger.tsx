import { FC, useEffect } from 'react';
import { useSelector } from '../../services/store';

export const ReduxDebugger: FC = () => {
  const constructorState = useSelector((state) => state.constructor);

  useEffect(() => {
    console.log('Constructor state updated:', constructorState);
  }, [constructorState]);

  return null; // Этот компонент ничего не рендерит
};
