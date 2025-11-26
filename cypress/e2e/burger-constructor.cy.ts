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
const testUrl = Cypress.config('baseUrl') || 'http://localhost:4000';

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

    cy.visit(testUrl);
    cy.wait('@getIngredients');

    // Убеждаемся, что кнопки "Добавить" появились — страница отрисовалась
    cy.contains('button', 'Добавить').should('exist');

    // Создадим алиас на контейнер конструктора
    cy.getConstructor().as('constructor');
  });

  it('Открывает и закрывает модальное окно ингредиента (крестик и оверлей)', () => {
    // Берём первую карточку в «Булки» и сохраняем её имя
    cy.contains('h3', 'Булки').parent().find('li').first().as('card');

    cy.get('@card')
      .find('a')
      .find('p')
      .last()
      .invoke('text')
      .then((t) => t.trim())
      .as('cardName');

    // Открываем модалку и сверяем название
    cy.get('@card').find('a').first().click({ force: true });
    cy.contains('h2', 'Детали ингредиента').should('be.visible');
    cy.get('@cardName').then((name) => {
      cy.contains('h3', String(name)).should('be.visible');
    });

    // 1) Закрываем по крестику
    cy.closeModal();

    // Открываем снова ту же карточку
    cy.get('@card').find('a').first().click({ force: true });

    // 2) Закрываем по оверлею
    cy.get('[data-testid=modal-overlay]').click('topLeft', { force: true });
  });

  it('Добавляет ингредиенты и оформляет заказ', () => {
    // 1) Добавим конкретную булку по имени
    cy.get('[data-testid=section-Булки]')
      .parent()
      .find('li')
      .first()
      .as('bunCard');

    cy.get('@bunCard')
      .find('a')
      .find('p')
      .last()
      .invoke('text')
      .then((t) => t.trim())
      .as('bunName');

    cy.get('@bunCard').within(() => {
      cy.contains('button', /Добавить/i).click();
    });

    // Проверяем, что именно эта булка попала в конструктор (верх + низ)
    cy.get('@constructor').within(() => {
      cy.get('@bunName').then((name) => {
        cy.contains(String(name)).should('exist'); // верхняя булка
      });
    });

    // 2) Добавим любую начинку (берём первую карточку в секции «Начинки»)
    cy.get('[data-testid=section-Начинки]')
      .within(() => {
        cy.get('li').first().as('mainCard');
      });

    cy.get('@mainCard')
      .find('a')
      .find('p')
      .last()
      .invoke('text')
      .then((t) => t.trim())
      .as('mainName');

    cy.get('@mainCard').within(() => {
      cy.contains('button', /Добавить/i).click();
    });

    // Проверяем, что именно эта начинка появилась в списке начинок конструктора
    cy.get('@constructor').within(() => {
      cy.get('@mainName').then((name) => {
        cy.contains(String(name)).should('exist');
      });
    });

    // 3) Добавим любой соус
    cy.get('[data-testid=section-Соусы]')
      .within(() => {
        cy.get('li').first().as('sauceCard');
      });

    cy.get('@sauceCard')
      .find('a')
      .find('p')
      .last()
      .invoke('text')
      .then((t) => t.trim())
      .as('sauceName');

    cy.get('@sauceCard').within(() => {
      cy.contains('button', /Добавить/i).click();
    });

    // Проверяем, что именно этот соус появился в списке начинок конструктора
    cy.get('@constructor').within(() => {
      cy.get('@sauceName').then((name) => {
        cy.contains(String(name)).should('exist');
      });
    });

    // Мокаем создание заказа
    cy.intercept('POST', `${API}/orders`, { fixture: 'order.json' }).as('createOrder');

    // Оформляем заказ
    cy.contains('button', 'Оформить заказ').click();

    // В модалке должен быть номер заказа
    cy.wait('@createOrder');
    cy.fixture('order.json').then((data) => {
      const num = data?.order?.number || data?.order?.orders?.[0]?.number || data?.number;
      cy.contains(String(num)).should('be.visible');
    });

    // Закрываем модалку
    cy.closeModal();

    // После оформления: конструктор пуст и цена ровно 0
    cy.get('@constructor').within(() => {
      cy.contains('Выберите булки').should('have.length', 1);
      cy.contains('Выберите начинку').should('exist');
      // список начинок пуст
      cy.get('ul').find('li').should('have.length', 0);
    });

    // цена 0 — берём узел перед кнопкой «Оформить заказ»
    cy.get('@constructor')
      .contains('button', 'Оформить заказ')
      .prev()
      .invoke('text')
      .then((t) => {
        const digits = t.replace(/[^\d]/g, '');
        expect(digits).to.eq('0');
      });
  });
});
