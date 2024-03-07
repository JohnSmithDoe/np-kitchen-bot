import { createReducer, on } from '@ngrx/store';
import { TStorageList } from '../../@types/types';
import { ApplicationActions } from '../application.actions';
import { StorageActions } from './storage.actions';

export type IStorageState = Readonly<TStorageList>;

export const initialState: IStorageState = {
  title: 'Storage',
  id: '_storage',
  items: [],
};

export const storageReducer = createReducer(
  initialState,
  on(StorageActions.addItem, (state, action): IStorageState => {
    return { ...state, items: [action.item, ...state.items] };
  }),
  on(StorageActions.removeItem, (state, { item }): IStorageState => {
    return {
      ...state,
      items: state.items.filter((listItem) => listItem.id !== item.id),
    };
  }),
  on(StorageActions.updateItem, (state, { item }): IStorageState => {
    if (!item) return state;
    const items = [...state.items];
    const itemIdx = state.items.findIndex(
      (listItem) => listItem.id === item.id
    );
    if (itemIdx >= 0) {
      items.splice(itemIdx, 1, item);
    }
    return { ...state, items };
  }),
  on(
    ApplicationActions.loadedSuccessfully,
    (_state, { datastore }): IStorageState => {
      return datastore.storage ?? _state;
    }
  )
);
