import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  setBun,
  clearConstructor,
  initialState
} from './burger-constructor-slice';
import { TConstructorIngredient } from '@utils-types';

const makeIng = (
  over: Partial<TConstructorIngredient> = {}
): TConstructorIngredient => ({
  _id: over._id ?? 'id-' + Math.random().toString(36).slice(2),
  id: over.id ?? 'uuid-' + Math.random().toString(36).slice(2),
  name: over.name ?? 'Test',
  type: over.type ?? 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: over.price ?? 100,
  image: '',
  image_large: '',
  image_mobile: ''
});

describe('Слайс конструктора бургера', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' } as any);
    expect(state).toEqual(initialState);
  });

  test('устанавливает булку (setBun)', () => {
    const bun = makeIng({ type: 'bun', name: 'Булка' });
    const state = reducer(undefined, setBun(bun));
    expect(state.bun?._id).toBe(bun._id);
  });

  test('добавляет ингредиенты (addIngredient)', () => {
    const a = makeIng({ name: 'A' });
    const b = makeIng({ name: 'B' });
    let state = reducer(undefined, addIngredient(a));
    state = reducer(state, addIngredient(b));
    expect(state.ingredients.map((i) => i.id)).toEqual([a.id, b.id]);
  });

  test('меняет порядок ингредиентов (moveIngredient)', () => {
    const a = makeIng({ name: 'A' });
    const b = makeIng({ name: 'B' });
    let state = reducer(undefined, addIngredient(a));
    state = reducer(state, addIngredient(b));

    // переносим элемент с позиции 0 на позицию 1
    state = reducer(state, moveIngredient({ from: 0, to: 1 } as any));
    expect(state.ingredients.map(i => i.id)).toEqual([b.id, a.id]);

    // переносим обратно: с позиции 1 на позицию 0
    state = reducer(state, moveIngredient({ from: 1, to: 0 } as any));
    expect(state.ingredients.map(i => i.id)).toEqual([a.id, b.id]);
  });

  test('удаляет ингредиент (removeIngredient)', () => {
    const a = makeIng({ name: 'A' });
    const b = makeIng({ name: 'B' });
    let state = reducer(undefined, addIngredient(a));
    state = reducer(state, addIngredient(b));
    state = reducer(state, removeIngredient(a.id));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].id).toBe(b.id);
  });

  test('очищает конструктор (clearConstructor)', () => {
    const bun = makeIng({ type: 'bun' });
    let state = reducer(undefined, setBun(bun));
    state = reducer(state, addIngredient(makeIng()));
    state = reducer(state, clearConstructor());
    expect(state).toEqual(initialState);
  });
});
