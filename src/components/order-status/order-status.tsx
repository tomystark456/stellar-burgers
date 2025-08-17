import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

const statusColors: { [key: string]: string } = {
  pending: '#E52B1A',
  done: '#00CCCC',
  created: '#F2F2F3'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  const textStyle = statusColors[status] || '#F2F2F3';
  const text = statusText[status] || 'Создан';

  return <OrderStatusUI textStyle={textStyle} text={text} />;
};
