// Константы селекторов для использования в тестах
export const SELECTORS = {
  // Конструктор бургера
  CONSTRUCTOR_INGREDIENTS: '[data-testid="constructor-ingredients"]',
  CONSTRUCTOR_BUN_TOP: '[data-testid="constructor-bun-top"]',
  CONSTRUCTOR_BUN_BOTTOM: '[data-testid="constructor-bun-bottom"]',
  CONSTRUCTOR_TOTAL_PRICE: '[data-testid="constructor-total-price"]',
  BURGER_CONSTRUCTOR: '[data-testid="burger-constructor"]',
  
  // Кнопки и элементы управления
  ORDER_BUTTON: '[data-testid="order-button"]',
  CONSTRUCTOR_INGREDIENT_REMOVE: '[data-testid="constructor-ingredient-remove"]',
  
  // Модальные окна
  MODAL: '[data-testid="modal"]',
  MODAL_CLOSE: '[data-testid="modal-close"]',
  MODAL_OVERLAY: '[data-testid="modal-overlay"]',
  MODAL_TITLE: '[data-testid="modal-title"]',
  
  // Детали заказа
  ORDER_DETAILS_MODAL: '[data-testid="order-details-modal"]',
  ORDER_NUMBER: '[data-testid="order-number"]',
  ORDER_STATUS: '[data-testid="order-status"]',
  
  // Ингредиенты
  INGREDIENTS_LIST: '[data-testid="ingredients-list"]',
  INGREDIENT_NAME: '[data-testid="ingredient-name"]',
  INGREDIENT_CALORIES: '[data-testid="ingredient-calories"]',
  INGREDIENT_PROTEINS: '[data-testid="ingredient-proteins"]',
  INGREDIENT_FAT: '[data-testid="ingredient-fat"]',
  INGREDIENT_CARBOHYDRATES: '[data-testid="ingredient-carbohydrates"]'
}; 