import { createReducer, on } from '@ngrx/store';
import { IDatastore, IStorageItem } from '../@types/types';
import { DatabaseActions, StorageActions } from './storage.actions';

type IStorageState = ReadonlyArray<IStorageItem>;
export const initialState: IStorageState = [];

export const storageReducer = createReducer(
  initialState,
  on(
    StorageActions.addItem,
    (state, { item }): IStorageState => [item, ...state]
  ),
  on(
    StorageActions.removeItem,
    (state, { item }): IStorageState =>
      state.filter((listItem) => listItem.name !== item.name)
  ),
  on(StorageActions.updateItem, (state, { item }): IStorageState => {
    const result = [...state];
    const itemIdx = state.findIndex((listItem) => listItem.name === item.name);
    if (itemIdx >= 0) {
      result.splice(itemIdx, 1, item);
    }
    return result;
  }),
  on(DatabaseActions.load, (_state, action): IStorageState => {
    return action.store.storage.items;
  })
);

export const initialDatabaseState: IDatastore = {
  all: { title: 'All Items', id: '_all', items: [] },
  storage: { title: 'Storage', id: '_storage', items: [] },
  shoppinglists: [],
  settings: {
    showQuickAdd: true,
    showQuickAddGlobal: false,
  },
};
export const databaseReducer = createReducer(
  initialDatabaseState
  // on(DatabaseActions.load, (store, action) => {
  //   return action.store;
  // })
);
