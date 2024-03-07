import { createReducer, on } from '@ngrx/store';
import { TShoppingList } from '../../@types/types';
import { ApplicationActions } from '../application.actions';
import { ShoppingListActions } from './shopping-list.actions';

export type IShoppinglistsState = Readonly<TShoppingList>;

export const initialState: IShoppinglistsState = {
  title: 'Shopping Items',
  id: '_shopping',
  items: [],
};

export const shoppingListsReducer = createReducer(
  initialState,
  on(ShoppingListActions.addItem, (state, action): IShoppinglistsState => {
    return { ...state, items: [action.item, ...state.items] };
  }),
  on(ShoppingListActions.removeItem, (state, { item }): IShoppinglistsState => {
    return {
      ...state,
      items: state.items.filter((listItem) => listItem.id !== item.id),
    };
  }),
  on(ShoppingListActions.updateItem, (state, { item }): IShoppinglistsState => {
    if (!item) return state;
    const items = [...state.items];
    const itemIdx = state.items.findIndex(
      (listItem) => listItem.id === item.id
    );
    if (itemIdx >= 0) {
      items.splice(itemIdx, 1, item);
    }
    return { ...state, items };
  }),
  on(
    ApplicationActions.loadedSuccessfully,
    (_state, { datastore }): IShoppinglistsState => {
      console.log('loaded shoppinglist', _state, datastore.shoppinglist);
      return datastore.shoppinglist ?? _state;
    }
  )
);
