import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

interface IFeedState extends TOrdersData {
  isLoading: boolean;
  error: string | null;
  orderByNumber: TOrder[];
}

export const initialState: IFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  orderByNumber: []
};

export const fetchFeed = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>('feed/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка при загрузке заказов');
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder[],
  number,
  { rejectValue: string }
>('feed/fetchOrderByNumber', async (orderNumber, { rejectWithValue }) => {
  try {
    const data = await getOrderByNumberApi(orderNumber);
    return data.orders;
  } catch (error: any) {
    return rejectWithValue(
      error.message || 'Ошибка при загрузке заказа по номеру'
    );
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    selectOrders: (state: IFeedState) => state.orders,
    selectTotal: (state: IFeedState) => state.total,
    selectTotalToday: (state: IFeedState) => state.totalToday,
    selectIsLoading: (state: IFeedState) => state.isLoading,
    selectError: (state: IFeedState) => state.error,
    selectOrderByNumber: (state: IFeedState) => state.orderByNumber
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при загрузке заказов';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderByNumber = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка при загрузке заказа по номеру';
      });
  }
});

export const {
  selectOrders,
  selectTotal,
  selectTotalToday,
  selectIsLoading,
  selectError,
  selectOrderByNumber
} = feedSlice.selectors;

export default feedSlice.reducer;
