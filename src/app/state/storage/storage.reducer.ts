import { createReducer, on } from '@ngrx/store';
import { IStorageState, TItemListSort } from '../../@types/types';
import { ApplicationActions } from '../application.actions';
import {
  addListItem,
  addListItemFromSearchQuery,
  createListItem,
  editListItem,
  endEditListItem,
  removeListItem,
  updateInPosition,
  updateListSort,
} from '../shared/item-list.reducer';
import { StorageActions } from './storage.actions';

export const initialState: IStorageState = {
  title: 'Storage',
  id: '_storage',
  items: [],
  mode: 'alphabetical',
};

export const storageReducer = createReducer(
  initialState,
  on(StorageActions.addItem, (state, { item }) => addListItem(state, item)),
  on(StorageActions.removeItem, (state, { item }) =>
    removeListItem(state, item)
  ),
  on(StorageActions.createItem, (state, { data }) =>
    createListItem(state, data)
  ),
  on(StorageActions.addItemFromSearch, (state) =>
    addListItemFromSearchQuery(state)
  ),
  on(StorageActions.editItem, (state: IStorageState, { item }) =>
    editListItem(state, item)
  ),

  on(StorageActions.endEditItem, (state, { item }) =>
    endEditListItem(state, item)
  ),
  on(StorageActions.updateItem, (state, { item }) =>
    updateInPosition(state, item)
  ),
  on(StorageActions.updateSearch, (state, { searchQuery }) => {
    return { ...state, searchQuery };
  }),
  on(StorageActions.updateFilter, (state, { filterBy }): IStorageState => {
    return { ...state, filterBy, mode: 'alphabetical' };
  }),
  on(StorageActions.updateMode, (state, { mode }) => {
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
  on(StorageActions.updateSort, (state, { sortBy, sortDir }) => {
    const sort = updateListSort(sortBy, sortDir, state.sort?.sortDir);
    return { ...state, sort };
  }),

  on(ApplicationActions.loadedSuccessfully, (_state, { datastore }) => {
    return datastore.storage ?? _state;
  })
);
