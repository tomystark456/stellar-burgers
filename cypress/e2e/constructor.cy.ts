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
      cy.get('[data-testid="ingredients-list"]').should('be.visible');
      
      // Проверяем наличие разных типов ингредиентов
      cy.contains('Булки').should('be.visible');
      cy.contains('Соусы').should('be.visible');
      cy.contains('Начинки').should('be.visible');
      
      // Проверяем конкретные ингредиенты из моковых данных
      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.contains('Говяжий метеорит (отбивная)').should('be.visible');
      cy.contains('Соус Spicy-X').should('be.visible');
    });
  });

  describe('Adding ingredients to constructor', () => {
    it('should add bun to constructor', () => {
      const bunName = 'Краторная булка N-200i';
      
      // Проверяем, что конструктор изначально пуст
      cy.get('[data-testid="burger-constructor"]').should('be.visible');
      cy.get('[data-testid="constructor-bun-top"]').should('not.exist');
      
      // Добавляем булку (симуляция drag & drop)
      cy.contains(bunName).should('be.visible').click();
      
      // Проверяем, что булка добавилась в конструктор
      cy.get('[data-testid="constructor-bun-top"]').should('contain.text', bunName);
      cy.get('[data-testid="constructor-bun-bottom"]').should('contain.text', bunName);
      
      // Проверяем, что цена обновилась
      cy.get('[data-testid="constructor-total-price"]').should('contain.text', '2510'); // 1255 * 2
    });

    it('should add main ingredient to constructor', () => {
      const ingredientName = 'Говяжий метеорит (отбивная)';
      
      // Добавляем основной ингредиент
      cy.contains(ingredientName).should('be.visible').click();
      
      // Проверяем, что ингредиент добавился в конструктор
      cy.get('[data-testid="constructor-ingredients"]')
        .should('contain.text', ingredientName);
    });

    it('should add sauce to constructor', () => {
      const sauceName = 'Соус Spicy-X';
      
      // Добавляем соус
      cy.contains(sauceName).should('be.visible').click();
      
      // Проверяем, что соус добавился в конструктор
      cy.get('[data-testid="constructor-ingredients"]')
        .should('contain.text', sauceName);
    });

    it('should add multiple ingredients and calculate total price', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i').click();
      
      // Добавляем начинку
      cy.contains('Говяжий метеорит (отбивная)').click();
      
      // Добавляем соус
      cy.contains('Соус Spicy-X').click();
      
      // Проверяем итоговую цену: (1255 * 2) + 3000 + 90 = 5600
      cy.get('[data-testid="constructor-total-price"]').should('contain.text', '5600');
      
      // Проверяем, что все ингредиенты присутствуют
      cy.get('[data-testid="constructor-bun-top"]').should('contain.text', 'Краторная булка N-200i');
      cy.get('[data-testid="constructor-ingredients"]').should('contain.text', 'Говяжий метеорит (отбивная)');
      cy.get('[data-testid="constructor-ingredients"]').should('contain.text', 'Соус Spicy-X');
      cy.get('[data-testid="constructor-bun-bottom"]').should('contain.text', 'Краторная булка N-200i');
    });
  });

  describe('Modal windows', () => {
    it('should open ingredient modal and display correct data', () => {
      const ingredientName = 'Краторная булка N-200i';
      
      // Кликаем на ингредиент для открытия модального окна
      cy.contains(ingredientName).should('be.visible').click();
      
      // Проверяем, что модальное окно открылось
      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="modal-title"]').should('contain.text', 'Детали ингредиента');
      cy.get('[data-testid="ingredient-name"]').should('contain.text', ingredientName);
      
      // Проверяем наличие информации об именно этом ингредиенте
      cy.get('[data-testid="ingredient-calories"]').should('contain.text', '420');
      cy.get('[data-testid="ingredient-proteins"]').should('contain.text', '80');
      cy.get('[data-testid="ingredient-fat"]').should('contain.text', '24');
      cy.get('[data-testid="ingredient-carbohydrates"]').should('contain.text', '53');
    });

    it('should close ingredient modal on close button click', () => {
      const ingredientName = 'Краторная булка N-200i';
      
      // Открываем модальное окно
      cy.contains(ingredientName).click();
      cy.get('[data-testid="modal"]').should('be.visible');
      
      // Закрываем модальное окно по клику на крестик
      cy.get('[data-testid="modal-close"]').click();
      
      // Проверяем, что модальное окно закрылось
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('should close ingredient modal on overlay click', () => {
      const ingredientName = 'Краторная булка N-200i';
      
      // Открываем модальное окно
      cy.contains(ingredientName).click();
      cy.get('[data-testid="modal"]').should('be.visible');
      
      // Закрываем модальное окно по клику на оверлей
      cy.get('[data-testid="modal-overlay"]').click({ force: true });
      
      // Проверяем, что модальное окно закрылось
      cy.get('[data-testid="modal"]').should('not.exist');
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

    it('should create order with correct number and clear constructor', () => {
      // Собираем бургер - добавляем ингредиенты в конструктор
      cy.contains('Флюоресцентная булка R2-D3').click(); // Добавляем булку
      cy.contains('Говяжий метеорит (отбивная)').click(); // Добавляем начинку
      cy.contains('Соус Spicy-X').click(); // Добавляем соус
      
      // Проверяем, что кнопка оформления заказа активна
      cy.get('[data-testid="order-button"]').should('not.be.disabled');
      
      // Кликаем на кнопку "Оформить заказ"
      cy.get('[data-testid="order-button"]').click();
      
      // Ждем создания заказа
      cy.wait('@createOrder');
      
      // Проверяем отображение модального окна с верным номером заказа
      cy.get('[data-testid="order-details-modal"]').should('be.visible');
      cy.get('[data-testid="order-number"]').should('contain.text', '12345');
      
      // Проверяем текст подтверждения
      cy.get('[data-testid="order-status"]').should('contain.text', 'идентификатор заказа');
      
      // Закрываем модальное окно
      cy.get('[data-testid="modal-close"]').click();
      
      // Проверяем очистку конструктора от добавленных ингредиентов
      cy.get('[data-testid="order-details-modal"]').should('not.exist');
      cy.get('[data-testid="constructor-bun-top"]').should('not.exist');
      cy.get('[data-testid="constructor-ingredients"]').should('be.empty');
      cy.get('[data-testid="constructor-bun-bottom"]').should('not.exist');
      
      // Проверяем, что цена сбросилась
      cy.get('[data-testid="constructor-total-price"]').should('contain.text', '0');
    });

    it('should show order button as disabled when no bun', () => {
      // Добавляем только начинку без булки
      cy.contains('Говяжий метеорит (отбивная)').click();
      
      // Проверяем, что кнопка заказа неактивна
      cy.get('[data-testid="order-button"]').should('be.disabled');
    });

    it('should show order button as disabled when constructor is empty', () => {
      // Проверяем, что кнопка заказа неактивна при пустом конструкторе
      cy.get('[data-testid="order-button"]').should('be.disabled');
    });
  });

  describe('Constructor interaction', () => {
    it('should remove ingredient from constructor', () => {
      const ingredientName = 'Говяжий метеорит (отбивная)';
      
      // Добавляем ингредиент
      cy.contains(ingredientName).click();
      
      // Проверяем, что ингредиент добавился
      cy.get('[data-testid="constructor-ingredients"]')
        .should('contain.text', ingredientName);
      
      // Удаляем ингредиент
      cy.get('[data-testid="constructor-ingredient-remove"]').first().click();
      
      // Проверяем, что ингредиент удалился
      cy.get('[data-testid="constructor-ingredients"]')
        .should('not.contain.text', ingredientName);
    });

    it('should replace bun when adding new bun', () => {
      const firstBun = 'Краторная булка N-200i';
      const secondBun = 'Флюоресцентная булка R2-D3';
      
      // Добавляем первую булку
      cy.contains(firstBun).click();
      cy.get('[data-testid="constructor-bun-top"]').should('contain.text', firstBun);
      
      // Добавляем вторую булку
      cy.contains(secondBun).click();
      
      // Проверяем, что булка заменилась
      cy.get('[data-testid="constructor-bun-top"]').should('contain.text', secondBun);
      cy.get('[data-testid="constructor-bun-top"]').should('not.contain.text', firstBun);
    });
  });
}); 