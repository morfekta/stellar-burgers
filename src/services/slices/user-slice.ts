import { getUserApi, TRegisterData, updateUserApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

interface IUserState {
  user: TUser | null;
  isAuthChecked: boolean;
  error: string | null;
}

const initialState: IUserState = {
  user: null,
  isAuthChecked: false,
  error: null
};

export const fetchUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserApi();
      return data.user;
    } catch (error) {
      return rejectWithValue('Ошибка при загрузке пользователя');
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/updateUser', async (userData, { rejectWithValue }) => {
  try {
    const data = await updateUserApi(userData);
    return data.user;
  } catch (error) {
    return rejectWithValue('Ошибка при обновлении пользователя');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  selectors: {
    selectUser: (state: IUserState) => state.user,
    selectIsAuthChecked: (state: IUserState) => state.isAuthChecked,
    selectError: (state: IUserState) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.error =
          action.error.message || 'Ошибка при загрузке пользователя';
      })
      .addCase(updateUser.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error =
          action.error.message || 'Ошибка при обновлении пользователя';
      });
  }
});

export const { setUser, clearUser, setAuthChecked } = userSlice.actions;

export const { selectUser, selectIsAuthChecked, selectError } =
  userSlice.selectors;

export default userSlice.reducer;
