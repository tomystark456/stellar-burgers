// TypeScript declarations for custom Cypress commands

declare namespace Cypress {
  interface Chainable {
    mockIngredientsApi(): Chainable<void>;
    mockUserApi(): Chainable<void>;
    mockCreateOrderApi(): Chainable<void>;
    setAuthTokens(): Chainable<void>;
    addIngredientToConstructor(ingredientTestId: string): Chainable<void>;
    waitForIngredientsLoad(): Chainable<void>;
  }
} 