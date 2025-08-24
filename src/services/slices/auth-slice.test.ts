import reducer, {
  loginUser,
  registerUser,
} from './auth-slice';

describe('Слайс аутентификации (auth-slice)', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' } as any);
    expect(state).toEqual({
      isLoading: false,
      error: null,
    });
  });

  test('loginUser.pending: ставит isLoading = true и очищает ошибку', () => {
    const state = reducer(undefined, { type: loginUser.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('loginUser.fulfilled: ставит isLoading = false', () => {
    const state = reducer(
      { isLoading: true, error: 'old' },
      { type: loginUser.fulfilled.type }
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('loginUser.rejected: ставит isLoading = false и записывает ошибку', () => {
    const action: any = {
      type: loginUser.rejected.type,
      payload: 'Ошибка при авторизации',
      meta: { rejectedWithValue: true },
    };
    const state = reducer(
      { isLoading: true, error: null },
      action
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка при авторизации');
  });

  test('registerUser.pending: ставит isLoading = true и очищает ошибку', () => {
    const state = reducer(undefined, { type: registerUser.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('registerUser.fulfilled: ставит isLoading = false', () => {
    const state = reducer(
      { isLoading: true, error: 'old' },
      { type: registerUser.fulfilled.type }
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('registerUser.rejected: ставит isLoading = false и записывает ошибку', () => {
    const action: any = {
      type: registerUser.rejected.type,
      payload: 'Ошибка при регистрации',
      meta: { rejectedWithValue: true },
    };
    const state = reducer(
      { isLoading: true, error: null },
      action
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка при регистрации');
  });
});
