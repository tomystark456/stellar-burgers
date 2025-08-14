import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import {
  ModalRoute,
  OrderInfo,
  IngredientDetails,
  ProtectedRoute,
  AuthRoute
} from '@components';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '@components';

const App = () => (
  <Router>
    <div className={styles.app}>
      <AppHeader />
      <Routes>
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
          path='/profile'
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
        <Route
          path='/feed/:number'
          element={
            <ModalRoute title='Детали заказа'>
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
              <ModalRoute title='Детали заказа'>
                <OrderInfo />
              </ModalRoute>
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  </Router>
);

export default App;
