import { createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface IIngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    return await getIngredientsApi();
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка при загрузке ингредиентов');
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state: IIngredientsState) => state.ingredients,
    selectIsLoading: (state: IIngredientsState) => state.isLoading,
    selectError: (state: IIngredientsState) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка при загрузке ингредиентов';
      });
  }
});

export const { selectIngredients, selectIsLoading, selectError } =
  ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
