import { createReducer, on } from '@ngrx/store';
import { IShoppingItem, IShoppingState } from '../../@types/types';
import { createShoppingItemFromStorage } from '../../app.factory';
import {
  addListItem,
  removeListItem,
  updateListItem,
  updateListMode,
  updateListSort,
} from '../@shared/item-list.reducer';
import { ApplicationActions } from '../application.actions';
import { ShoppingListActions } from './shopping-list.actions';

export const initialState: IShoppingState = {
  title: 'Shopping Items',
  id: '_shopping',
  items: [],
  mode: 'alphabetical',
};

export const shoppingListsReducer = createReducer(
  initialState,
  on(ShoppingListActions.addItem, (state, { item }) =>
    addListItem(state, item)
  ),
  on(ShoppingListActions.removeItem, (state, { item }) =>
    removeListItem(state, item)
  ),
  on(ShoppingListActions.addStorageItem, (state: IShoppingState, { data }) => {
    const found = state.items.find(
      (item) => item.name.toLowerCase() === data?.name?.toLowerCase()
    );
    if (found) {
      return updateListItem<IShoppingState, IShoppingItem>(state, {
        ...found,
        quantity: found.quantity + 1,
      });
    } else {
      const item = createShoppingItemFromStorage(data);
      return addListItem(state, item);
    }
  }),
  // on(ShoppingListActions.editItem, (state: IShoppingState, { item }) =>
  //   editListItem(state, item)
  // ),

  // on(ShoppingListActions.endEditItem, (state, { item }) =>
  //   endEditListItem(state, item)
  // ),
  on(ShoppingListActions.updateItem, (state, { item }) =>
    updateListItem(state, item)
  ),
  on(
    ShoppingListActions.updateSearch,
    (state, { searchQuery }): IShoppingState => ({
      ...state,
      searchQuery,
    })
  ),
  on(
    ShoppingListActions.updateFilter,
    (state, { filterBy }): IShoppingState => ({
      ...state,
      filterBy,
      mode: 'alphabetical',
    })
  ),
  on(ShoppingListActions.updateMode, (state, { mode }) =>
    updateListMode(state, mode)
  ),
  on(ShoppingListActions.updateSort, (state, { sortBy, sortDir }) => {
    const sort = updateListSort(sortBy, sortDir, state.sort?.sortDir);
    return { ...state, sort };
  }),
  on(
    ApplicationActions.loadedSuccessfully,
    (_state, { datastore }): IShoppingState => {
      return datastore.shoppinglist ?? _state;
    }
  ),
  on(
    ShoppingListActions.createGlobalItem,
    (state): IShoppingState => ({
      ...state,
      // data: { id: uuidv4(), name: state.searchQuery ?? '', createdAt: 'now' },
    })
  ),
  on(ShoppingListActions.buyItem, (state, { item }) =>
    updateListItem<IShoppingState, IShoppingItem>(state, {
      ...item,
      state: 'bought',
    })
  ),
  on(
    ShoppingListActions.endCreateGlobalItem,
    (state): IShoppingState => ({
      ...state,
    })
  )
);
