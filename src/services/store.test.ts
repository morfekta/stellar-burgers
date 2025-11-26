import store from './store';

describe('Инициализация rootReducer', () => {
  test('Создание стора со следующими ключами', () => {
    const state = store.getState();
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('order');
  });
});
