// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to intercept ingredients API
Cypress.Commands.add('mockIngredientsApi', () => {
  cy.fixture('ingredients').then((ingredients) => {
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
      statusCode: 200,
      body: {
        success: true,
        data: ingredients
      }
    }).as('getIngredients');
  });
});

// Custom command to mock user data
Cypress.Commands.add('mockUserApi', () => {
  cy.fixture('user').then((user) => {
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: user
      }
    }).as('getUser');
  });
});

// Custom command to mock order creation
Cypress.Commands.add('mockCreateOrderApi', () => {
  cy.fixture('order').then((orderData) => {
    cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', {
      statusCode: 200,
      body: orderData
    }).as('createOrder');
  });
});

// Custom command to set auth tokens
Cypress.Commands.add('setAuthTokens', () => {
  window.localStorage.setItem('accessToken', 'mock-access-token');
  cy.setCookie('refreshToken', 'mock-refresh-token');
});

// Custom command to add ingredient to constructor by drag and drop
Cypress.Commands.add('addIngredientToConstructor', (ingredientTestId) => {
  cy.get(`[data-testid="${ingredientTestId}"]`).trigger('dragstart');
  cy.get('[data-testid="burger-constructor"]').trigger('drop');
});

// Custom command to wait for ingredients to load
Cypress.Commands.add('waitForIngredientsLoad', () => {
  cy.wait('@getIngredients');
  cy.get('[data-testid="ingredients-list"]').should('be.visible');
});

// Note: TypeScript declarations should be in cypress/support/index.d.ts if needed 