import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

interface IBurgerConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: IBurgerConstructorState = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TConstructorIngredient>) {
      state.bun = action.payload;
    },
    addIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      state.ingredients.push(action.payload);
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredient(state, action) {
      const { from, to } = action.payload;
      const [moved] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, moved);
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    selectBun: (state) => state.bun,
    selectIngredients: (state) => state.ingredients
  }
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export const { selectBun, selectIngredients } =
  burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
