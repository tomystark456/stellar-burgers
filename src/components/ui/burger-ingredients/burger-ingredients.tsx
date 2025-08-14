import React, { FC, memo } from 'react';
import { Tab } from '@zlden/react-developer-burger-ui-components';

import styles from './burger-ingredients.module.css';
import { BurgerIngredientsUIProps } from './type';
import { IngredientsCategory } from '@components';
import { TTabMode } from '@utils-types';

export const BurgerIngredientsUI: FC<BurgerIngredientsUIProps> = memo(
  ({
    currentTab,
    buns,
    mains,
    sauces,
    titleBunRef,
    titleMainRef,
    titleSaucesRef,
    bunsRef,
    mainsRef,
    saucesRef,
    onTabClick
  }) => (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value='bun'
            active={currentTab === 'bun'}
            onClick={(val) => onTabClick(val as TTabMode)}
          >
            Булки
          </Tab>
          <Tab
            value='main'
            active={currentTab === 'main'}
            onClick={(val) => onTabClick(val as TTabMode)}
          >
            Начинки
          </Tab>
          <Tab
            value='sauce'
            active={currentTab === 'sauce'}
            onClick={(val) => onTabClick(val as TTabMode)}
          >
            Соусы
          </Tab>
        </ul>
      </nav>
      <div className={styles.content}>
        <IngredientsCategory
          title='Булки'
          titleRef={titleBunRef}
          ingredients={buns}
          ref={bunsRef}
        />
        <IngredientsCategory
          title='Начинки'
          titleRef={titleMainRef}
          ingredients={mains}
          ref={mainsRef}
        />
        <IngredientsCategory
          title='Соусы'
          titleRef={titleSaucesRef}
          ingredients={sauces}
          ref={saucesRef}
        />
      </div>
    </section>
  )
);
