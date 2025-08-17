import React from 'react';
import styles from './order-details.module.css';
import doneImg from '../../../images/done.svg';
import { OrderDetailsUIProps } from './type';
import { OrderStatus } from '@components';

export const OrderDetailsUI: React.FC<OrderDetailsUIProps> = ({
  orderNumber
}) => (
  <div className={styles.container} data-testid='order-details-modal'>
    <p className='text text_type_main-medium mb-8'>Номер заказа:</p>
    <h2
      className={`${styles.title} text text_type_digits-large mb-8`}
      data-testid='order-number'
    >
      {String(orderNumber).padStart(6, '0')}
    </h2>
    <OrderStatus status='created' />
    <img
      className={`${styles.img} mt-15 mb-15`}
      src={doneImg}
      alt='изображение статуса заказа.'
    />
    <p className='text text_type_main-default mb-2'>
      Ваш заказ начали готовить
    </p>
    <p className={`${styles.text} text text_type_main-default mb-30`}>
      Дождитесь готовности на орбитальной станции
    </p>
  </div>
);
