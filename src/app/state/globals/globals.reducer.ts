import { createReducer, on } from '@ngrx/store';
import { IGlobalsState, TItemListSort } from '../../@types/types';
import { ApplicationActions } from '../application.actions';
import {
  addListItem,
  addListItemFromSearchQuery,
  createAndEditListItem,
  createListItem,
  editListItem,
  endEditListItem,
  removeListItem,
  updateInPosition,
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
  on(
    GlobalsActions.createAndEditItem,
    (state, { data }) => createAndEditListItem(state, data) // TODO this is not correct... adds an storage item......
  ),
  on(
    GlobalsActions.createItem,
    (state, { data }) => createListItem(state, data) // TODO this is not correct... adds an storage item......
  ),
  on(GlobalsActions.addItemFromSearch, (state) =>
    addListItemFromSearchQuery(state)
  ),
  on(GlobalsActions.editItem, (state: IGlobalsState, { item }) =>
    editListItem(state, item)
  ),

  on(GlobalsActions.endEditItem, (state, { item }) =>
    endEditListItem(state, item)
  ),
  on(GlobalsActions.updateItem, (state, { item }) =>
    updateInPosition(state, item)
  ),
  on(GlobalsActions.updateSearch, (state, { searchQuery }): IGlobalsState => {
    return { ...state, searchQuery };
  }),
  on(GlobalsActions.updateFilter, (state, { filterBy }): IGlobalsState => {
    return { ...state, filterBy, mode: 'alphabetical' };
  }),
  on(GlobalsActions.updateMode, (state, { mode }) => {
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
