/// <reference types="cypress" />
/// <reference path="./commands.d.ts" />

// Найти контейнер конструктора «от кнопки Оформить заказ»
Cypress.Commands.add('getConstructor', () => {
  return cy.contains('button', 'Оформить заказ').closest('section');
});

// Закрыть любую модалку по крестику
Cypress.Commands.add('closeModal', () => {
  return cy.get('[data-testid=modal-close]').click({ force: true });
});

// Открыть модалку ингредиента по имени (клик по карточке)
Cypress.Commands.add('openIngredientModal', (name: string | RegExp) => {
  return cy.contains('li', name).find('a').first().click({ force: true });
});

// Добавить ингредиент по имени (кнопка «Добавить» внутри карточки)
Cypress.Commands.add('addIngredient', (name: string | RegExp) => {
  return cy.contains('li', name).within(() => {
    cy.contains('button', /Добавить/i).click();
  });
});

export {};
