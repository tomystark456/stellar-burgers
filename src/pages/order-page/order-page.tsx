import { FC } from 'react';
import styles from './order-page.module.css';
import { OrderInfo } from '@components';

export const OrderPage: FC = () => (
  <main className={styles.main}>
    <div className={styles.container}>
      <OrderInfo />
    </div>
  </main>
);
