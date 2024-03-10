import { createReducer, on } from '@ngrx/store';
import { IGlobalsState } from '../../@types/types';
import { ApplicationActions } from '../application.actions';
import {
  addListItem,
  removeListItem,
  updateListItem,
  updateListMode,
  updateListSort,
} from '../shared/item-list.reducer';
import { GlobalsActions } from './globals.actions';

export const initialState: IGlobalsState = {
  title: 'Global Items',
  id: '_globals',
  items: [],
  mode: 'alphabetical',
};

export const globalsReducer = createReducer(
  initialState,
  on(GlobalsActions.addItem, (state, { item }) => addListItem(state, item)),
  on(GlobalsActions.removeItem, (state, { item }) =>
    removeListItem(state, item)
  ),
  on(GlobalsActions.updateItem, (state, { item }) =>
    updateListItem(state, item)
  ),
  on(GlobalsActions.updateSearch, (state, { searchQuery }): IGlobalsState => {
    return { ...state, searchQuery };
  }),
  on(GlobalsActions.updateFilter, (state, { filterBy }): IGlobalsState => {
    return { ...state, filterBy, mode: 'alphabetical' };
  }),
  on(GlobalsActions.updateMode, (state, { mode }) =>
    updateListMode(state, mode)
  ),
  on(GlobalsActions.updateSort, (state, { sortBy, sortDir }) => {
    const sort = updateListSort(sortBy, sortDir, state.sort?.sortDir);
    return { ...state, sort };
  }),
  on(
    ApplicationActions.loadedSuccessfully,
    (_state, { datastore }): IGlobalsState => {
      return datastore.globals ?? _state;
    }
  )
);
