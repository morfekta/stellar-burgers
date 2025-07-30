import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { selectIngredients } from '../../services/slices/ingredients-slice';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrderByNumber,
  selectOrderByNumber,
  selectOrders
} from '../../services/slices/feed-slice';
import { useParams } from 'react-router-dom';
import { selectUserOrders } from '../../services/slices/order-slice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();

  const feedOrders = useSelector(selectOrders);
  const userOrders = useSelector(selectUserOrders);
  const fetchedOrder = useSelector(selectOrderByNumber);

  const allOrders = useMemo(
    () => [...feedOrders, ...userOrders, ...fetchedOrder],
    [feedOrders, userOrders, fetchedOrder]
  );

  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);

  if (!number) {
    return <Preloader />;
  }

  const orderData =
    allOrders.find((order) => order.number === orderNumber) ?? null;

  const ingredients: TIngredient[] = useSelector(selectIngredients);

  useEffect(() => {
    if (!orderData) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderData, orderNumber]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
