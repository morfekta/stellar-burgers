import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearConstructor,
  selectBun,
  selectIngredients
} from '../../services/slices/burger-constructor-slice';
import {
  clearOrder,
  postOrder,
  selectIsLoading,
  selectOrder
} from '../../services/slices/order-slice';
import { selectUser } from '../../services/slices/user-slice';
import { useNavigate, useLocation } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = {
    bun: useSelector(selectBun),
    ingredients: useSelector(selectIngredients)
  };

  const user = useSelector(selectUser);

  const orderRequest = useSelector(selectIsLoading);
  const orderModalData = useSelector(selectOrder);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login', {
        state: { from: location }
      });
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    const orderIngredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];

    dispatch(postOrder(orderIngredients))
      .unwrap()
      .finally(() => {
        dispatch(clearConstructor());
      });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
