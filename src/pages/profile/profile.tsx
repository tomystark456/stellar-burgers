import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getUser, updateUser } from '../../services/slices/auth-slice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    // Проверяем, есть ли уже пользователь и токен
    const accessToken = document.cookie.includes('accessToken');
    if (!user && accessToken && !loading) {
      dispatch(getUser());
    }
  }, []); // Убираем все зависимости, чтобы загрузить только один раз

  // Добавляем дополнительную проверку для предотвращения повторных запросов
  useEffect(() => {
    if (user && !loading) {
      setFormValue((prevState) => ({
        ...prevState,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user, loading]);

  // Обработка ошибок
  useEffect(() => {
    if (error) {
      console.error('Auth error:', error);
    }
  }, [error]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const updateData: { name?: string; email?: string; password?: string } = {};

    if (formValue.name !== user?.name) updateData.name = formValue.name;
    if (formValue.email !== user?.email) updateData.email = formValue.email;
    if (formValue.password) updateData.password = formValue.password;

    dispatch(updateUser(updateData));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Ошибка: {error}</p>
        <button onClick={() => window.location.reload()}>
          Обновить страницу
        </button>
      </div>
    );
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
