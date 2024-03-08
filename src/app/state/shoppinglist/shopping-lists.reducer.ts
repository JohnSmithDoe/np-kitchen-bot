import { createReducer, on } from '@ngrx/store';
import {
  IShoppingState,
  TItemListSort,
  TShoppingList,
} from '../../@types/types';
import { ApplicationActions } from '../application.actions';
import {
  addListItem,
  addListItemFromSearchQuery,
  createAndEditListItem,
  editListItem,
  endEditListItem,
  removeListItem,
  updateInPosition,
  updateListSort,
} from '../shared/item-list.reducer';
import { ShoppingListActions } from './shopping-list.actions';

export type IShoppinglistsState = Readonly<TShoppingList>;

export const initialState: IShoppinglistsState = {
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
  on(
    ShoppingListActions.createItem,
    (state, { data }) => createAndEditListItem(state, data) // TODO storage item is added....
  ),
  on(ShoppingListActions.addItemFromSearch, (state) =>
    addListItemFromSearchQuery(state)
  ),
  on(ShoppingListActions.editItem, (state: IShoppinglistsState, { item }) =>
    editListItem(state, item)
  ),

  on(ShoppingListActions.endEditItem, (state, { item }) =>
    endEditListItem(state, item)
  ),
  on(ShoppingListActions.updateItem, (state, { item }) =>
    updateInPosition(state, item)
  ),
  on(
    ShoppingListActions.updateSearch,
    (state, { searchQuery }): IShoppinglistsState => ({
      ...state,
      searchQuery,
    })
  ),
  on(
    ShoppingListActions.updateFilter,
    (state, { filterBy }): IShoppingState => {
      return { ...state, filterBy, mode: 'alphabetical' };
    }
  ),
  on(ShoppingListActions.updateMode, (state, { mode }) => {
    // reset sort on mode change, otherwise toggle
    const sort: TItemListSort | undefined =
      state.mode !== mode
        ? { sortBy: 'name', sortDir: 'asc' }
        : updateListSort(state.sort?.sortBy, 'toggle', state.sort?.sortDir);
    // clear search ... maybe
    return {
      ...state,
      sort: sort,
      mode: mode ?? 'alphabetical',
      filterBy: undefined,
    };
  }),
  on(ShoppingListActions.updateSort, (state, { sortBy, sortDir }) => {
    const sort = updateListSort(sortBy, sortDir, state.sort?.sortDir);
    return { ...state, sort };
  }),

  on(
    ApplicationActions.loadedSuccessfully,
    (_state, { datastore }): IShoppinglistsState => {
      console.log('loaded shoppinglist', _state, datastore.shoppinglist);
      return datastore.shoppinglist ?? _state;
    }
  )
);
