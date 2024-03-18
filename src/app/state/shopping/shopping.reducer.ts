import { createReducer, on } from '@ngrx/store';
import { IShoppingState } from '../../@types/types';
import {
  addListCategory,
  addListItem,
  removeListCategory,
  removeListItem,
  removeListItems,
  updateListItem,
  updateListMode,
  updateListSort,
} from '../@shared/item-list.utils';
import { ApplicationActions } from '../application.actions';
import { ShoppingActions } from './shopping.actions';

export const initialState: IShoppingState = {
  title: 'Shopping Items',
  id: '_shopping',
  items: [],
  mode: 'alphabetical',
  categories: [],
  showActionSheet: false,
};

function updateSearch(
  state: IShoppingState,
  searchQuery?: string
): IShoppingState {
  if (searchQuery === state.searchQuery) return state;
  return { ...state, searchQuery };
}

// prettier-ignore
export const shoppingReducer = createReducer(
  initialState,
  on(ShoppingActions.addItem,(state, { item }) => addListItem(state, item)),
  // on(ShoppingActions.addItemOrIncreaseQuantity,(state, { item }) => addListItemOrIncreaseQuantity(state, item)),
  on(ShoppingActions.removeItem,(state, { item }) => removeListItem(state, item)),
  on(ShoppingActions.removeItems,(state, { items }) => removeListItems(state, items)),
  on(ShoppingActions.updateItem,(state, { item }) => updateListItem(state, item)),
  on(ShoppingActions.updateSearch,(state, { searchQuery }): IShoppingState => updateSearch(state, searchQuery)),
  on(ShoppingActions.updateFilter,(state, { filterBy }): IShoppingState => ({ ...state, filterBy, mode: 'alphabetical', })),
  on(ShoppingActions.updateMode, (state, { mode }) => updateListMode(state, mode)),
  on(ShoppingActions.updateSort, (state, { sortBy, sortDir }) => ({ ...state, sort: updateListSort(sortBy, sortDir, state.sort?.sortDir),})),
  on(ShoppingActions.showActionSheet, (state):IShoppingState =>  ({...state, showActionSheet: true})),
  on(ShoppingActions.hideActionSheet, (state):IShoppingState =>  ({...state, showActionSheet: false})),
  on(ShoppingActions.addCategory, (state, { category }) => ({ ...state, categories: addListCategory(state.categories, category),})),
  on(ShoppingActions.removeCategory, (state, { category }) => ({ ...state, categories: removeListCategory(state.categories, category),})),

  on(ApplicationActions.loadedSuccessfully,(_state, { datastore }): IShoppingState => {
    return {...(datastore.shopping ?? _state), searchQuery:undefined,mode:'alphabetical',filterBy: undefined, showActionSheet: false};
  }),
);
