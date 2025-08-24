import { getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface IOrderState {
  order: TOrder | null;
  userOrders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IOrderState = {
  order: null,
  userOrders: [],
  isLoading: false,
  error: null
};

export const postOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/postOrder', async (orderData, { rejectWithValue }) => {
  try {
    const data = await orderBurgerApi(orderData);
    return data.order;
  } catch (error) {
    return rejectWithValue('Ошибка при создании заказа');
  }
});

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('order/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error) {
    return rejectWithValue('Ошибка при загрузке заказов пользователя');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    }
  },
  selectors: {
    selectOrder: (state: IOrderState) => state.order,
    selectUserOrders: (state: IOrderState) => state.userOrders,
    selectIsLoading: (state: IOrderState) => state.isLoading,
    selectError: (state: IOrderState) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка при создании заказа';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || 'Ошибка при загрузке заказов пользователя';
      });
  }
});

export const { clearOrder } = orderSlice.actions;

export const { selectOrder, selectUserOrders, selectIsLoading, selectError } =
  orderSlice.selectors;

export default orderSlice.reducer;
