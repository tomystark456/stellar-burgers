import { useSelector, useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import { fetchFeedOrders } from '../../services/slices/orders-slice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

export const Feed = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const match = useMatch('/feed/:number');
  const { feedOrders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchFeedOrders());
  }, [dispatch]);

  useEffect(() => {
    if (
      match?.params.number &&
      feedOrders.length > 0 &&
      !location.state?.background
    ) {
      navigate(`/feed/${match.params.number}`, {
        state: { background: { pathname: '/feed', search: '' } },
        replace: true
      });
    }
  }, [match, feedOrders, location.state, navigate]);

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
