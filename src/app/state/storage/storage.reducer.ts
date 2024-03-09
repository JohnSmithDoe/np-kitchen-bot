import { createReducer, on } from '@ngrx/store';
import { IStorageState } from '../../@types/types';
import { uuidv4 } from '../../app.utils';
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
  on(StorageActions.createAndEditItem, (state, { data }) =>
    createAndEditListItem(state, data)
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
  ),
  on(
    StorageActions.createGlobalItem,
    (state): IStorageState => ({
      ...state,
      isCreating: true,
      data: { id: uuidv4(), name: state.searchQuery ?? '', createdAt: 'now' },
    })
  ),
  on(
    StorageActions.endCreateGlobalItem,
    (state): IStorageState => ({
      ...state,
      isCreating: false,
    })
  )
);
