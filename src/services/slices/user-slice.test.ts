import reducer, {
  fetchUser,
  updateUser,
  setUser,
  clearUser,
  setAuthChecked,
  initialState
} from './user-slice';

describe('Слайс пользователя (user-slice)', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' } as any);
    expect(state).toEqual(initialState);
  });

  test('setUser: записывает пользователя', () => {
    const user = { email: 'alice@example.com', name: 'Alice' };
    const state = reducer(
      { user: null, isAuthChecked: false, error: null },
      setUser(user as any)
    );
    expect(state.user).toEqual(user);
  });

  test('clearUser: очищает пользователя', () => {
    const prev = {
      user: { email: 'bob@example.com', name: 'Bob' } as any,
      isAuthChecked: true,
      error: null
    };
    const state = reducer(prev, clearUser());
    expect(state.user).toBeNull();
  });

  test('setAuthChecked: проставляет флаг isAuthChecked = true', () => {
    const state = reducer(
      { user: null, isAuthChecked: false, error: null },
      setAuthChecked()
    );
    expect(state.isAuthChecked).toBe(true);
  });

  test('fetchUser.pending: очищает ошибку', () => {
    const state = reducer(
      { user: null, isAuthChecked: false, error: 'old' },
      { type: fetchUser.pending.type }
    );
    expect(state.error).toBeNull();
    expect(state.isAuthChecked).toBe(false);
  });

  test('fetchUser.fulfilled: ставит isAuthChecked = true и записывает пользователя', () => {
    const payload = { email: 'carol@example.com', name: 'Carol' } as any;
    const state = reducer(
      { user: null, isAuthChecked: false, error: null },
      { type: fetchUser.fulfilled.type, payload }
    );
    expect(state.isAuthChecked).toBe(true);
    expect(state.user).toEqual(payload);
  });

  test('fetchUser.rejected: ставит isAuthChecked = true и записывает ошибку', () => {
    const action: any = {
      type: fetchUser.rejected.type,
      error: { message: 'Ошибка при загрузке пользователя' }
    };
    const state = reducer(
      { user: null, isAuthChecked: false, error: null },
      action
    );
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBe('Ошибка при загрузке пользователя');
  });

  test('updateUser.pending: очищает ошибку', () => {
    const state = reducer(
      { user: null, isAuthChecked: true, error: 'old' },
      { type: updateUser.pending.type }
    );
    expect(state.error).toBeNull();
  });

  test('updateUser.fulfilled: обновляет пользователя', () => {
    const payload = { email: 'dave@example.com', name: 'Dave' } as any;
    const state = reducer(
      { user: { email: 'old@ex.com', name: 'Old' } as any, isAuthChecked: true, error: null },
      { type: updateUser.fulfilled.type, payload }
    );
    expect(state.user).toEqual(payload);
  });

  test('updateUser.rejected: записывает ошибку', () => {
    const action: any = {
      type: updateUser.rejected.type,
      error: { message: 'Ошибка при обновлении пользователя' }
    };
    const state = reducer(
      { user: { email: 'x@ex.com', name: 'X' } as any, isAuthChecked: true, error: null },
      action
    );
    expect(state.error).toBe('Ошибка при обновлении пользователя');
  });
});
