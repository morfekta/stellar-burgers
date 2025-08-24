import { Preloader } from '@ui';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectUser
} from '../../services/slices/user-slice';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyForGuest?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyForGuest
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  // если пользователь авторизован и пытается попасть на страницы только для неавторизованных, перенаправляем на главную или откуда он пришел
  if (onlyForGuest && user) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  // если пользователь не авторизован и пытается попасть на защищенные страницы, перенаправляем на страницу логина
  if (!onlyForGuest && !user) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return children;
};
