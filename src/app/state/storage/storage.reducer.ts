import { createReducer, on } from '@ngrx/store';
import {
  IStorageItem,
  TItemListSort,
  TStorageList,
  TUpdateDTO,
} from '../../@types/types';
import { uuidv4 } from '../../app.utils';
import { ApplicationActions } from '../application.actions';
import { StorageActions } from './storage.actions';

export type IStorageState = Readonly<TStorageList>;

export const initialState: IStorageState = {
  title: 'Storage',
  id: '_storage',
  items: [],
  mode: 'alphabetical',
};

export const storageReducer = createReducer(
  initialState,
  on(
    StorageActions.addItem,
    (state: IStorageState, { item }): IStorageState => {
      const newItem = { ...item, name: state.searchQuery ?? 'new item' };
      return { ...state, items: [newItem, ...state.items] };
    }
  ),
  on(StorageActions.removeItem, (state, { item }): IStorageState => {
    return {
      ...state,
      items: state.items.filter((listItem) => listItem.id !== item.id),
    };
  }),
  on(
    StorageActions.startEditItem,
    (state: IStorageState, { data }): IStorageState => {
      const editMode = data ? 'update' : 'create';
      const itemData: TUpdateDTO<IStorageItem> = {
        ...data,
        id: data?.id ?? uuidv4(), // ensure id
        name: data?.name ?? state.searchQuery ?? '', // use search query as initial name
      };
      return { ...state, data: itemData, isEditing: true, editMode };
    }
  ),

  on(StorageActions.endEditItem, (state, { data }): IStorageState => {
    return {
      ...updateStorageItem(data, state),
      data: undefined,
      isEditing: false,
    };
  }),
  on(StorageActions.updateItem, (state, { item }): IStorageState => {
    return updateStorageItem(item, state);
  }),
  on(StorageActions.updateSearch, (state, { searchQuery }): IStorageState => {
    return { ...state, searchQuery };
  }),
  on(StorageActions.updateFilter, (state, { filterBy }): IStorageState => {
    return { ...state, filterBy };
  }),
  on(StorageActions.updateMode, (state, { mode }): IStorageState => {
    // reset sort on mode change, otherwise toggle
    const sort: TItemListSort | undefined =
      state.mode !== mode
        ? { sortBy: 'name', sortDir: 'asc' }
        : updateSort(state.sort?.sortBy, 'toggle', state.sort?.sortDir);
    // clear search ... maybe
    return { ...state, sort: sort, mode: mode ?? 'alphabetical' };
  }),
  on(StorageActions.updateSort, (state, { sortBy, sortDir }): IStorageState => {
    const sort = updateSort(sortBy, sortDir, state.sort?.sortDir);
    return { ...state, sort };
  }),
  on(
    ApplicationActions.loadedSuccessfully,
    (_state, { datastore }): IStorageState => {
      return datastore.storage ?? _state;
    }
  )
);

function updateStorageItem(
  item: Partial<IStorageItem> | undefined,
  state: IStorageState
) {
  if (!item) return state;
  const items = [...state.items];
  const itemIdx = state.items.findIndex((listItem) => listItem.id === item.id);
  if (itemIdx >= 0) {
    const original = state.items[itemIdx];
    items.splice(itemIdx, 1, { ...original, ...item });
  }
  return { ...state, items };
}

function updateSort(
  sortBy?: 'name' | 'bestBefore' | string,
  newDir?: 'asc' | 'desc' | 'keep' | 'toggle',
  currentDir?: 'asc' | 'desc'
) {
  let result: TItemListSort | undefined;
  if (!!sortBy) {
    const defaultSort = 'asc';
    let sortDir: 'asc' | 'desc' = defaultSort;
    switch (newDir) {
      case 'asc':
      case 'desc':
        sortDir = newDir;
        break;
      case 'keep':
        sortDir = currentDir ?? defaultSort;
        break;
      case 'toggle':
        sortDir = currentDir === 'asc' ? 'desc' : 'asc';
        break;
    }
    result = { sortBy, sortDir };
  }
  return result;
}
