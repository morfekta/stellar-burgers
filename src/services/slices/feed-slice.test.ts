import reducer, {
  fetchFeed,
  fetchOrderByNumber,
} from './feed-slice';

describe('Слайс ленты заказов (feed-slice)', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' } as any);
    expect(state).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null,
      orderByNumber: [],
    });
  });

  test('fetchFeed.pending: ставит isLoading = true и очищает ошибку', () => {
    const state = reducer(undefined, { type: fetchFeed.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fetchFeed.fulfilled: сохраняет заказы и суммы, isLoading = false', () => {
    const payload = {
      orders: [{ _id: 'o1', number: 1 } as any, { _id: 'o2', number: 2 } as any],
      total: 1000,
      totalToday: 123,
    };

    const state = reducer(
      {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: true,
        error: null,
        orderByNumber: [],
      },
      { type: fetchFeed.fulfilled.type, payload }
    );

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(payload.orders);
    expect(state.total).toBe(1000);
    expect(state.totalToday).toBe(123);
  });

  test('fetchFeed.rejected: сохраняет ошибку и ставит isLoading = false', () => {
    const action: any = {
      type: fetchFeed.rejected.type,
      error: { message: 'Ошибка при загрузке заказов' },
    };

    const state = reducer(
      {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: true,
        error: null,
        orderByNumber: [],
      },
      action
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка при загрузке заказов');
  });

  test('fetchOrderByNumber.pending: ставит isLoading = true и очищает ошибку', () => {
    const state = reducer(undefined, { type: fetchOrderByNumber.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fetchOrderByNumber.fulfilled: сохраняет найденные заказы по номеру и ставит isLoading = false', () => {
    const payload = [{ _id: 'o21', number: 21 } as any];

    const state = reducer(
      {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: true,
        error: null,
        orderByNumber: [],
      },
      { type: fetchOrderByNumber.fulfilled.type, payload }
    );

    expect(state.isLoading).toBe(false);
    expect(state.orderByNumber).toEqual(payload);
  });

  test('fetchOrderByNumber.rejected: сохраняет ошибку и ставит isLoading = false', () => {
    const action: any = {
      type: fetchOrderByNumber.rejected.type,
      error: { message: 'Ошибка при загрузке заказа по номеру' },
    };

    const state = reducer(
      {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: true,
        error: null,
        orderByNumber: [],
      },
      action
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка при загрузке заказа по номеру');
  });
});
