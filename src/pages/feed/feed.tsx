import { useSelector, useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { fetchFeedOrders } from '../../services/slices/orders-slice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

export const Feed = () => {
  const dispatch = useDispatch();
  const { feedOrders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchFeedOrders());
  }, [dispatch]);

  if (loading && !feedOrders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={feedOrders}
      handleGetFeeds={() => dispatch(fetchFeedOrders())}
    />
  );
};
