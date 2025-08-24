import {
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejectedWithValue
} from '@reduxjs/toolkit';
import { clearUser, setUser } from './user-slice';
import { deleteCookie, setCookie } from '../../utils/cookie';

interface IAuthState {
  isLoading: boolean;
  error: string | null;
}

const initialState: IAuthState = {
  isLoading: false,
  error: null
};

export const loginUser = createAsyncThunk<
  void,
  TLoginData,
  { rejectValue: string }
>('auth/loginUser', async (credentials, { rejectWithValue, dispatch }) => {
  try {
    const { accessToken, refreshToken, user } = await loginUserApi(credentials);
    setCookie('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    dispatch(setUser(user));
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка при авторизации');
  }
});

export const registerUser = createAsyncThunk<
  void,
  TRegisterData,
  { rejectValue: string }
>('auth/registerUser', async (credentials, { rejectWithValue, dispatch }) => {
  try {
    const { accessToken, refreshToken, user } =
      await registerUserApi(credentials);
    setCookie('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    dispatch(setUser(user));
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка при регистрации');
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch(clearUser());
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка при выходе из системы');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  selectors: {
    selectIsLoading: (state: IAuthState) => state.isLoading,
    selectError: (state: IAuthState) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending(loginUser, registerUser), (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(isFulfilled(loginUser, registerUser), (state) => {
        state.isLoading = false;
      })
      .addMatcher(
        isRejectedWithValue(loginUser, registerUser),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        }
      );
  }
});

export const { selectIsLoading, selectError } = authSlice.selectors;

export default authSlice.reducer;
