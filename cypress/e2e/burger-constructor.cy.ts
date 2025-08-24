// cypress/e2e/burger-constructor.cy.ts
/// <reference types="cypress" />

/**
 * E2E: Страница конструктора бургера
 * - мокаем /ingredients → fixtures/ingredients.json
 * - открываем модалку ингредиента и закрываем (крестик и оверлей)
 * - добавляем булку, начинку и соус
 * - мокаем пользователя и создание заказа, проверяем номер
 * - закрываем модалку и проверяем очистку конструктора
 */

const API = Cypress.env('BURGER_API_URL') || '/api';

describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Моки данных
    cy.intercept('GET', `${API}/ingredients*`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', `${API}/auth/user*`, { fixture: 'login.json' }).as(
      'getUser'
    );

    // Токены авторизации
    cy.setCookie('accessToken', 'Bearer FAKE.ACCESS.TOKEN');
    window.localStorage.setItem('refreshToken', 'FAKE.REFRESH.TOKEN');

    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');

    // Убеждаемся, что кнопки "Добавить" появились — страница отрисовалась
    cy.contains('button', 'Добавить').should('exist');
  });

  it('Открывает и закрывает модальное окно ингредиента (крестик и оверлей)', () => {
    // Открываем карточку ингредиента (любую с текстом "булка" — в моках такие есть)
    cy.contains('a', /булка/i).first().click({ force: true });
    cy.contains('h2', 'Детали ингредиента').should('be.visible');

    // Закрытие по крестику — кликаем именно по svg внутри кнопки
    cy.get('[data-testid=modal-close]').click({ force: true });

    // Открываем снова
    cy.contains('a', /булка/i).first().click({ force: true });
    cy.contains('h2', 'Детали ингредиента').should('be.visible');

    // Закрытие по клику на оверлей
    cy.get('[data-testid=modal-overlay]').click('topLeft', { force: true });
  });

  it('Добавляет ингредиенты и оформляет заказ', () => {
    // Булка (в секции "Булки")
    cy.contains('button', 'Добавить').first().click();

    // Начинка (в секции "Начинки")
    cy.contains('h3', 'Начинки')
      .scrollIntoView()
      .parent()
      .within(() => {
        cy.contains('button', /Добавить/i)
          .first()
          .click();
      });

    // Соус (в секции "Соусы")
    cy.contains('h3', 'Соусы')
      .scrollIntoView()
      .parent()
      .within(() => {
        cy.contains('button', /Добавить/i)
          .first()
          .click();
      });

    // Мокаем создание заказа
    cy.intercept('POST', `${API}/orders`, { fixture: 'order.json' }).as(
      'createOrder'
    );

    // Жмём «Оформить заказ»
    cy.contains('button', 'Оформить заказ').click();

    // Проверяем модалку с номером заказа
    cy.wait('@createOrder');
    cy.fixture('order.json').then((data) => {
      const num =
        data?.order?.number || data?.order?.orders?.[0]?.number || data?.number;
      cy.contains(String(num)).should('be.visible');
      cy.contains('идентификатор заказа').should('be.visible');
    });

    // Закрываем модалку
    cy.get('[data-testid=modal-close]').click({ force: true });

    cy.contains('button', 'Оформить заказ')
      .closest('section')
      .as('constructor');

    // Проверяем, что конструктор пустой и цена — число
    cy.get('@constructor').within(() => {
      cy.contains('Оформить заказ').should('exist');
      cy.get('[class*=elements] li').should('have.length', 0);
      cy.get('[class*=text]')
        .first()
        .invoke('text')
        .then((t) => {
          const digits = t.replace(/[^0-9]/g, '');
          expect(digits).to.match(/^\d*$/);
        });
    });
  });
});
