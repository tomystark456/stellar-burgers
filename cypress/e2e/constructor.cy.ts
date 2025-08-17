import { SELECTORS } from '../support/selectors';

describe('Burger Constructor', () => {
  beforeEach(() => {
    // Настройка перехватов API перед каждым тестом
    cy.mockIngredientsApi();
    cy.mockUserApi();
    cy.mockCreateOrderApi();
    
    // Переходим на главную страницу
    cy.visit('/');
    
    // Ждем загрузки ингредиентов
    cy.waitForIngredientsLoad();
  });

  describe('Ingredients loading and display', () => {
    it('should load and display ingredients', () => {
      // Проверяем, что ингредиенты загрузились и отображаются
      cy.get(SELECTORS.INGREDIENTS_LIST).should('be.visible');
      
      // Проверяем наличие разных типов ингредиентов
      cy.contains('Булки').should('be.visible');
      cy.contains('Соусы').should('be.visible');
      cy.contains('Начинки').should('be.visible');
      
      // Проверяем конкретные ингредиенты из моковых данных
      cy.contains('Краторная булка N-200i').scrollIntoView().should('be.visible');
      cy.contains('Говяжий метеорит (отбивная)').scrollIntoView().should('be.visible');
      cy.contains('Соус Spicy-X').scrollIntoView().should('be.visible');
    });
  });

  describe('Adding ingredients to constructor', () => {
    it('should add bun to constructor', () => {
      const bunName = 'Краторная булка N-200i';
      
      // Проверяем, что конструктор изначально пуст
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).should('be.visible');
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('not.exist');
      
      // Добавляем булку через кнопку добавления
      cy.contains(bunName).scrollIntoView().should('be.visible')
        .parents('[data-testid="ingredient-card"]')
        .find('[data-testid="add-ingredient-button"] button')
        .click({ force: true });
      
      // Ждем обновления состояния
      cy.wait(1000);
      
      // Проверяем, что булка добавилась в конструктор
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('contain.text', bunName);
      cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('contain.text', bunName);
      
      // Проверяем, что цена обновилась
      cy.get(SELECTORS.CONSTRUCTOR_TOTAL_PRICE).should('contain.text', '2510'); // 1255 * 2
    });

    it('should add main ingredient to constructor', () => {
      const ingredientName = 'Говяжий метеорит (отбивная)';
      
      // Добавляем основной ингредиент через кнопку добавления
      cy.contains(ingredientName).scrollIntoView().should('be.visible')
        .parents('[data-testid="ingredient-card"]')
        .find('[data-testid="add-ingredient-button"] button')
        .click({ force: true });
      
      // Ждем обновления состояния
      cy.wait(1000);
      
      // Проверяем, что ингредиент добавился в конструктор
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS)
        .should('contain.text', ingredientName);
    });

    it('should add sauce to constructor', () => {
      const sauceName = 'Соус Spicy-X';
      
      // Добавляем соус через кнопку добавления
      cy.contains(sauceName).scrollIntoView().should('be.visible')
        .parents('[data-testid="ingredient-card"]')
        .find('[data-testid="add-ingredient-button"] button')
        .click({ force: true });
      
      // Ждем обновления состояния
      cy.wait(1000);
      
      // Проверяем, что соус добавился в конструктор
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS)
        .should('contain.text', sauceName);
    });

    it('should add multiple ingredients and calculate total price', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i').scrollIntoView().should('be.visible')
        .parents('[data-testid="ingredient-card"]')
        .find('[data-testid="add-ingredient-button"] button')
        .click({ force: true });
      cy.wait(1000);
      
      // Добавляем начинку
      cy.contains('Говяжий метеорит (отбивная)').scrollIntoView().should('be.visible')
        .parents('[data-testid="ingredient-card"]')
        .find('[data-testid="add-ingredient-button"] button')
        .click({ force: true });
      cy.wait(1000);
      
      // Добавляем соус
      cy.contains('Соус Spicy-X').scrollIntoView().should('be.visible')
        .parents('[data-testid="ingredient-card"]')
        .find('[data-testid="add-ingredient-button"] button')
        .click({ force: true });
      cy.wait(1000);
      
      // Проверяем итоговую цену: (1255 * 2) + 3000 + 90 = 5600
      cy.get(SELECTORS.CONSTRUCTOR_TOTAL_PRICE).should('contain.text', '5600');
      
      // Проверяем, что все ингредиенты присутствуют
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('contain.text', 'Краторная булка N-200i');
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should('contain.text', 'Говяжий метеорит (отбивная)');
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should('contain.text', 'Соус Spicy-X');
      cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('contain.text', 'Краторная булка N-200i');
    });
  });

  describe('Modal windows', () => {
    it('should open ingredient modal and display correct data', () => {
      const ingredientName = 'Краторная булка N-200i';
      
      // Кликаем на ингредиент для открытия модального окна
      cy.contains(ingredientName).scrollIntoView().should('be.visible').click({ force: true });
      
      // Проверяем, что модальное окно открылось
      cy.get(SELECTORS.MODAL).should('be.visible');
      cy.get(SELECTORS.MODAL_TITLE).should('contain.text', 'Детали ингредиента');
      cy.get(SELECTORS.INGREDIENT_NAME).should('contain.text', ingredientName);
      
      // Проверяем наличие информации об именно этом ингредиенте
      cy.get(SELECTORS.INGREDIENT_CALORIES).should('contain.text', '420');
      cy.get(SELECTORS.INGREDIENT_PROTEINS).should('contain.text', '80');
      cy.get(SELECTORS.INGREDIENT_FAT).should('contain.text', '24');
      cy.get(SELECTORS.INGREDIENT_CARBOHYDRATES).should('contain.text', '53');
    });

    it('should close ingredient modal on close button click', () => {
      const ingredientName = 'Краторная булка N-200i';
      
      // Открываем модальное окно
      cy.contains(ingredientName).scrollIntoView().click({ force: true });
      cy.get(SELECTORS.MODAL).should('be.visible');
      
      // Закрываем модальное окно по клику на крестик
      cy.get(SELECTORS.MODAL_CLOSE).click();
      
      // Проверяем, что модальное окно закрылось
      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('should close ingredient modal on overlay click', () => {
      const ingredientName = 'Краторная булка N-200i';
      
      // Открываем модальное окно
      cy.contains(ingredientName).scrollIntoView().click({ force: true });
      cy.get(SELECTORS.MODAL).should('be.visible');
      
      // Закрываем модальное окно по клику на оверлей
      cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true });
      
      // Проверяем, что модальное окно закрылось
      cy.get(SELECTORS.MODAL).should('not.exist');
    });
  });

  describe('Order creation process', () => {
    beforeEach(() => {
      // Устанавливаем токены авторизации перед тестами создания заказа
      cy.setAuthTokens();
    });

    afterEach(() => {
      // Очищаем токены после каждого теста
      cy.window().then((win) => {
        win.localStorage.clear();
      });
      cy.clearCookies();
    });

    it.skip('should create order with correct number and clear constructor', () => {
      // Собираем бургер - добавляем ингредиенты в конструктор
      cy.contains('Флюоресцентная булка R2-D3').scrollIntoView().should('be.visible')
        .parents('[data-testid="ingredient-card"]')
        .find('[data-testid="add-ingredient-button"] button')
        .click({ force: true }); // Добавляем булку
      cy.wait(1000);
      
      cy.contains('Говяжий метеорит (отбивная)').scrollIntoView().should('be.visible')
        .parents('[data-testid="ingredient-card"]')
        .find('[data-testid="add-ingredient-button"] button')
        .click({ force: true }); // Добавляем начинку
      cy.wait(1000);
      
      cy.contains('Соус Spicy-X').scrollIntoView().should('be.visible')
        .parents('[data-testid="ingredient-card"]')
        .find('[data-testid="add-ingredient-button"] button')
        .click({ force: true }); // Добавляем соус
      cy.wait(1000);
      
      // Проверяем, что кнопка оформления заказа активна
      cy.get(SELECTORS.ORDER_BUTTON).should('not.be.disabled');
      
      // Кликаем на кнопку "Оформить заказ"
      cy.get(SELECTORS.ORDER_BUTTON).click({ force: true });
      
      // Ждем немного и проверяем отображение модального окна
      cy.wait(2000);
      
      // Проверяем отображение модального окна с верным номером заказа
      cy.get(SELECTORS.ORDER_DETAILS_MODAL, { timeout: 10000 }).should('be.visible');
      cy.get(SELECTORS.ORDER_NUMBER).should('contain.text', '12345');
      
      // Проверяем текст подтверждения
      cy.get(SELECTORS.ORDER_STATUS).should('contain.text', 'идентификатор заказа');
      
      // Закрываем модальное окно
      cy.get(SELECTORS.MODAL_CLOSE).click();
      
      // Проверяем очистку конструктора от добавленных ингредиентов
      cy.get(SELECTORS.ORDER_DETAILS_MODAL).should('not.exist');
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('not.exist');
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should('be.empty');
      cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('not.exist');
      
      // Проверяем, что цена сбросилась
      cy.get(SELECTORS.CONSTRUCTOR_TOTAL_PRICE).should('contain.text', '0');
    });

    it('should show order button as disabled when no bun', () => {
      // Добавляем только начинку без булки
      cy.contains('Говяжий метеорит (отбивная)').scrollIntoView().should('be.visible')
        .parents('[data-testid="ingredient-card"]')
        .find('[data-testid="add-ingredient-button"] button')
        .click({ force: true });
      cy.wait(1000);
      
      // Проверяем, что кнопка заказа неактивна
      cy.get(SELECTORS.ORDER_BUTTON).should('be.disabled');
    });

    it('should show order button as disabled when constructor is empty', () => {
      // Проверяем, что кнопка заказа неактивна при пустом конструкторе
      cy.get(SELECTORS.ORDER_BUTTON).should('be.disabled');
    });
  });

  describe('Constructor interaction', () => {
    it.skip('should remove ingredient from constructor', () => {
      const ingredientName = 'Говяжий метеорит (отбивная)';
      
      // Добавляем ингредиент
      cy.contains(ingredientName).scrollIntoView().should('be.visible')
        .parents('[data-testid="ingredient-card"]')
        .find('[data-testid="add-ingredient-button"] button')
        .click({ force: true });
      cy.wait(1000);
      
      // Проверяем, что ингредиент добавился
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS)
        .should('contain.text', ingredientName);
      
      // Удаляем ингредиент
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT_REMOVE).first().click({ force: true });
      
      // Проверяем, что ингредиент удалился (показывается заглушка или список пуст)
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should(($el) => {
        const text = $el.text();
        expect(text).to.not.contain('Говяжий метеорит (отбивная)');
      });
    });

    it('should replace bun when adding new bun', () => {
      const firstBun = 'Краторная булка N-200i';
      const secondBun = 'Флюоресцентная булка R2-D3';
      
      // Добавляем первую булку
      cy.contains(firstBun).scrollIntoView().should('be.visible')
        .parents('[data-testid="ingredient-card"]')
        .find('[data-testid="add-ingredient-button"] button')
        .click({ force: true });
      cy.wait(1000);
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('contain.text', firstBun);
      
      // Добавляем вторую булку
      cy.contains(secondBun).scrollIntoView().should('be.visible')
        .parents('[data-testid="ingredient-card"]')
        .find('[data-testid="add-ingredient-button"] button')
        .click({ force: true });
      cy.wait(1000);
      
      // Проверяем, что булка заменилась
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('contain.text', secondBun);
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('not.contain.text', firstBun);
    });
  });
}); 