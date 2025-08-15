import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
  IngredientPage,
  OrderPage
} from '@pages';
import {
  ModalRoute,
  OrderInfo,
  IngredientDetails,
  ProtectedRoute,
  AuthRoute
} from '@components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUser } from '../../services/slices/auth-slice';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { getCookie } from '../../utils/cookie';
import { Preloader } from '@ui';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '@components';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const background = location.state?.background;
  
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { ingredients, loading: ingredientsLoading } = useSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    // Проверяем наличие токенов и загружаем данные пользователя
    const accessToken = getCookie('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (accessToken && refreshToken) {
      dispatch(getUser());
    }
  }, [dispatch]);

  useEffect(() => {
    // Загружаем ингредиенты, если их еще нет
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  // Показываем прелоадер, пока загружаются критически важные данные
  if (authLoading || ingredientsLoading) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <main className={styles.main}>
          <Preloader />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path='/register'
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <AuthRoute>
              <ForgotPassword />
            </AuthRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <AuthRoute>
              <ResetPassword />
            </AuthRoute>
          }
        />
        <Route
          path='/profile/*'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/feed/:number' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientPage />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <ModalRoute title=''>
                <OrderInfo />
              </ModalRoute>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <ModalRoute title='Детали ингредиента'>
                <IngredientDetails />
              </ModalRoute>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <ModalRoute title=''>
                  <OrderInfo />
                </ModalRoute>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
