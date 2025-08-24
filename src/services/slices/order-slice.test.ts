import reducer, {
  postOrder,
  fetchUserOrders,
  clearOrder
} from './order-slice';

describe('Слайс заказов (order-slice)', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' } as any);
    expect(state).toEqual({
      order: null,
      userOrders: [],
      isLoading: false,
      error: null
    });
  });

  test('postOrder.pending: ставит isLoading = true и очищает ошибку', () => {
    const state = reducer(undefined, { type: postOrder.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('postOrder.fulfilled: сохраняет заказ и ставит isLoading = false', () => {
    const payload = { _id: 'o1', number: 12345 } as any; // форма упрощена для теста
    const state = reducer(
      { order: null, userOrders: [], isLoading: true, error: null },
      { type: postOrder.fulfilled.type, payload }
    );
    expect(state.isLoading).toBe(false);
    expect(state.order).toEqual(payload);
  });

  test('postOrder.rejected: сохраняет ошибку и ставит isLoading = false', () => {
    const action: any = {
      type: postOrder.rejected.type,
      payload: 'Ошибка при создании заказа'
    };
    const state = reducer(
      { order: null, userOrders: [], isLoading: true, error: null },
      action
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка при создании заказа');
  });

  test('fetchUserOrders.pending: ставит isLoading = true и очищает ошибку', () => {
    const state = reducer(undefined, { type: fetchUserOrders.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fetchUserOrders.fulfilled: сохраняет список заказов и ставит isLoading = false', () => {
    const payload = [
      { _id: 'o1', number: 111 } as any,
      { _id: 'o2', number: 222 } as any
    ];
    const state = reducer(
      { order: null, userOrders: [], isLoading: true, error: null },
      { type: fetchUserOrders.fulfilled.type, payload }
    );
    expect(state.isLoading).toBe(false);
    expect(state.userOrders).toEqual(payload);
  });

  test('fetchUserOrders.rejected: сохраняет ошибку и ставит isLoading = false', () => {
    const action: any = {
      type: fetchUserOrders.rejected.type,
      payload: 'Ошибка при загрузке заказов пользователя'
    };
    const state = reducer(
      { order: null, userOrders: [], isLoading: true, error: null },
      action
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка при загрузке заказов пользователя');
  });

  test('clearOrder: обнуляет текущий заказ', () => {
    const prev = {
      order: { _id: 'o1', number: 999 } as any,
      userOrders: [],
      isLoading: false,
      error: null
    };
    const state = reducer(prev, clearOrder());
    expect(state.order).toBeNull();
  });
});
