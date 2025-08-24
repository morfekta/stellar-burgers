import reducer, { fetchIngredients } from './ingredients-slice';

describe('Слайс ингредиентов', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' } as any);
    expect(state).toEqual({ ingredients: [], isLoading: false, error: null });
  });

  test('ставит isLoading = true и очищает ошибку при fetchIngredients.pending', () => {
    const state = reducer(undefined, { type: fetchIngredients.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('сохраняет данные и ставит isLoading = false при fetchIngredients.fulfilled', () => {
    const payload = [
      {
        _id: '1',
        name: 'X',
        type: 'main',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 1,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ];

    const state = reducer(
      { ingredients: [], isLoading: true, error: null },
      { type: fetchIngredients.fulfilled.type, payload }
    );

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(payload);
  });

  test('сохраняет ошибку и ставит isLoading = false при fetchIngredients.rejected', () => {
    const err = { message: 'Ошибка' };
    const action: any = { type: fetchIngredients.rejected.type, error: err };

    const state = reducer(
      { ingredients: [], isLoading: true, error: null },
      action
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});
