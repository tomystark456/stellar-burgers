import { FC } from 'react';
import styles from './ingredient-page.module.css';
import { IngredientDetails } from '@components';

export const IngredientPage: FC = () => (
  <main className={styles.main}>
    <div className={styles.container}>
      <h1 className='text text_type_main-large'>Детали ингредиента</h1>
      <IngredientDetails />
    </div>
  </main>
);
