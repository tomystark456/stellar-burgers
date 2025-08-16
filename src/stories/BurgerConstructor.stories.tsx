import { BurgerConstructorUI } from '@ui';
import type { Meta, StoryObj } from '@storybook/react';
import { TConstructorIngredient } from '@utils-types';

const meta = {
  title: 'Example/BurgerConstructor',
  component: BurgerConstructorUI,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof BurgerConstructorUI>;

export default meta;
type Story = StoryObj<typeof meta>;

// Создаем моковые данные для тестирования
const mockBun: TConstructorIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  id: 'test-id-1'
};

const mockIngredient: TConstructorIngredient = {
  _id: 'ingredient-1',
  name: 'Соус фирменный Space Sauce',
  type: 'sauce',
  proteins: 50,
  fat: 22,
  carbohydrates: 11,
  calories: 14,
  price: 80,
  image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
  id: 'test-id-2'
};

export const EmptyConstructor: Story = {
  args: {
    constructorItems: { bun: null, ingredients: [] },
    orderRequest: false,
    price: 0,
    onOrderClick: () => console.log('Order clicked')
  }
};

export const WithBunOnly: Story = {
  args: {
    constructorItems: { bun: mockBun, ingredients: [] },
    orderRequest: false,
    price: mockBun.price * 2,
    onOrderClick: () => console.log('Order clicked')
  }
};

export const WithIngredients: Story = {
  args: {
    constructorItems: {
      bun: mockBun,
      ingredients: [mockIngredient, mockIngredient]
    },
    orderRequest: false,
    price: mockBun.price * 2 + mockIngredient.price * 2,
    onOrderClick: () => console.log('Order clicked')
  }
};

export const Loading: Story = {
  args: {
    constructorItems: { bun: mockBun, ingredients: [] },
    orderRequest: true,
    price: mockBun.price * 2,
    onOrderClick: () => console.log('Order clicked')
  }
};
