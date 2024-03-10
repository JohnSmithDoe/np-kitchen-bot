import { createReducer, on } from '@ngrx/store';
import { IStorageState } from '../../@types/types';
import { ApplicationActions } from '../application.actions';
import {
  addListItem,
  removeListItem,
  updateListItem,
  updateListMode,
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
  on(StorageActions.updateItem, (state, { item }) =>
    updateListItem(state, item)
  ),
  on(
    StorageActions.updateSearch,
    (state, { searchQuery }): IStorageState => ({ ...state, searchQuery })
  ),
  on(
    StorageActions.updateFilter,
    (state, { filterBy }): IStorageState => ({
      ...state,
      filterBy,
      mode: 'alphabetical',
    })
  ),
  on(StorageActions.updateMode, (state, { mode }) =>
    updateListMode(state, mode)
  ),
  on(StorageActions.updateSort, (state, { sortBy, sortDir }) => {
    const sort = updateListSort(sortBy, sortDir, state.sort?.sortDir);
    return { ...state, sort };
  }),
  on(
    ApplicationActions.loadedSuccessfully,
    (_state, { datastore }): IStorageState => {
      return datastore.storage ?? _state;
    }
  )
);
