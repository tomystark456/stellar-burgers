import React, { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();
  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={styles.navLink}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <BurgerIcon type={isActive('/') ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 mr-10 ${
                !isActive('/') ? 'text_color_inactive' : ''
              }`}
            >
              Конструктор
            </p>
          </NavLink>

          <NavLink
            to='/feed'
            className={styles.navLink}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <ListIcon type={isActive('/feed') ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${
                !isActive('/feed') ? 'text_color_inactive' : ''
              }`}
            >
              Лента заказов
            </p>
          </NavLink>
        </div>
        <div className={styles.logo}>
          <NavLink to='/' className={styles.navLink}>
            <Logo className={styles.logo} />
          </NavLink>
        </div>
        <div className={styles.link_position_last}>
          <NavLink
            to='/profile'
            className={styles.navLink}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <ProfileIcon
              type={isActive('/profile') ? 'primary' : 'secondary'}
            />
            <p
              className={`text text_type_main-default ml-2 ${
                !isActive('/profile') ? 'text_color_inactive' : ''
              }`}
            >
              {userName || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
