import { createReducer, on } from '@ngrx/store';
import {
  IStorageItem,
  TItemListSort,
  TStorageList,
  TUpdateDTO,
} from '../../@types/types';
import { createStorageItem } from '../../app.factory';
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
  on(StorageActions.addItem, (state, { item }): IStorageState => {
    return {
      ...state,
      items: [item, ...state.items],
    };
  }),
  on(StorageActions.removeItem, (state, { item }): IStorageState => {
    return {
      ...state,
      items: state.items.filter((listItem) => listItem.id !== item.id),
    };
  }),
  on(
    StorageActions.createItem,
    (
      state: IStorageState,
      { data }: { data?: Partial<IStorageItem> }
    ): IStorageState => {
      // use search query as initial name
      const name = data?.name?.length ? data.name : state.searchQuery ?? '';
      const newItem = createStorageItem(name);
      const editData: TUpdateDTO<IStorageItem> = {
        ...data,
        ...newItem,
      };
      return { ...state, data: editData, isEditing: true, editMode: 'create' };
    }
  ),
  on(
    StorageActions.addItemFromSearch,
    (state: IStorageState): IStorageState => {
      // do not add an empty item
      // do not add an already contained item (could be triggered by a shortcut)
      if (
        !state.searchQuery?.trim().length ||
        !!state.items.find(
          (item) => item.name.toLowerCase() === state.searchQuery
        )
      )
        return state;
      //if (contained) throw new Error('Already contained'); // Breaks EVERYTHING hmmm
      // TODO: errorhandler maybe or effect
      //   await this.#uiService.showToast(
      //     this.translate.instant('toast.add.item.error.contained', {
      //       name: item?.name,
      //     }),
      //     'storage'
      //   );
      const item = createStorageItem(state.searchQuery);
      return { ...state, items: [item, ...state.items] };
    }
  ),
  on(
    StorageActions.editItem,
    (state: IStorageState, { item }): IStorageState => {
      const editData: TUpdateDTO<IStorageItem> = {
        ...item,
        name: item?.name ?? state.searchQuery ?? '', // use search query as initial name
      };
      return { ...state, data: editData, isEditing: true, editMode: 'update' };
    }
  ),

  on(StorageActions.endEditItem, (state, { item }): IStorageState => {
    const result = {
      ...state,
      data: undefined,
      isEditing: false,
    };
    if (!item || !state.editMode || !state.data) return result;
    switch (state.editMode) {
      case 'update':
        return updateStorageItem(item, result);
      case 'create':
        const newItem: IStorageItem = { ...state.data, quantity: 1, ...item };
        return {
          ...result,
          items: [newItem, ...state.items],
        };
    }
  }),
  on(StorageActions.updateItem, (state, { item }): IStorageState => {
    return updateStorageItem(item, state);
  }),
  on(StorageActions.updateSearch, (state, { searchQuery }): IStorageState => {
    return { ...state, searchQuery };
  }),
  on(StorageActions.updateFilter, (state, { filterBy }): IStorageState => {
    return { ...state, filterBy, mode: 'alphabetical' };
  }),
  on(StorageActions.updateMode, (state, { mode }): IStorageState => {
    // reset sort on mode change, otherwise toggle
    const sort: TItemListSort | undefined =
      state.mode !== mode
        ? { sortBy: 'name', sortDir: 'asc' }
        : updateSort(state.sort?.sortBy, 'toggle', state.sort?.sortDir);
    // clear search ... maybe
    return {
      ...state,
      sort: sort,
      mode: mode ?? 'alphabetical',
      filterBy: undefined,
    };
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
    const updatedItem = { ...original, ...item };
    items.splice(itemIdx, 1, updatedItem);
  } else {
    // hmmmmmmm
    console.error(item, state.items, 'not found');
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
