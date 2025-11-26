/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      getConstructor(): Chainable;
      closeModal(): Chainable;
      openIngredientModal(name: string | RegExp): Chainable;
      addIngredient(name: string | RegExp): Chainable;
    }
  }
}

export {};
