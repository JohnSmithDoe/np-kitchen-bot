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
import { ShoppingActions } from './shopping.actions';

export const initialState: IShoppingState = {
  title: 'Shopping Items',
  id: '_shopping',
  items: [],
  mode: 'alphabetical',
};

export const shoppingReducer = createReducer(
  initialState,
  on(ShoppingActions.addItem, (state, { item }) => addListItem(state, item)),
  on(ShoppingActions.removeItem, (state, { item }) =>
    removeListItem(state, item)
  ),
  on(ShoppingActions.addStorageItem, (state: IShoppingState, { data }) => {
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
  on(ShoppingActions.updateItem, (state, { item }) =>
    updateListItem(state, item)
  ),
  on(
    ShoppingActions.updateSearch,
    (state, { searchQuery }): IShoppingState => ({
      ...state,
      searchQuery,
    })
  ),
  on(
    ShoppingActions.updateFilter,
    (state, { filterBy }): IShoppingState => ({
      ...state,
      filterBy,
      mode: 'alphabetical',
    })
  ),
  on(ShoppingActions.updateMode, (state, { mode }) =>
    updateListMode(state, mode)
  ),
  on(ShoppingActions.updateSort, (state, { sortBy, sortDir }) => {
    const sort = updateListSort(sortBy, sortDir, state.sort?.sortDir);
    return { ...state, sort };
  }),
  on(
    ApplicationActions.loadedSuccessfully,
    (_state, { datastore }): IShoppingState => {
      return datastore.shopping ?? _state;
    }
  ),
  on(
    ShoppingActions.createGlobalItem,
    (state): IShoppingState => ({
      ...state,
      // data: { id: uuidv4(), name: state.searchQuery ?? '', createdAt: 'now' },
    })
  ),
  on(ShoppingActions.buyItem, (state, { item }) =>
    updateListItem<IShoppingState, IShoppingItem>(state, {
      ...item,
      state: 'bought',
    })
  ),
  on(
    ShoppingActions.endCreateGlobalItem,
    (state): IShoppingState => ({
      ...state,
    })
  )
);
