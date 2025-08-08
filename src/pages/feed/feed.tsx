import { useSelector, useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { fetchFeedOrders } from '../../services/slices/orders-slice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { feedOrders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchFeedOrders());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={feedOrders}
      handleGetFeeds={() => dispatch(fetchFeedOrders())}
    />
  );
};
