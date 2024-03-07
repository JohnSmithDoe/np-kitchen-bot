import { createReducer, on } from '@ngrx/store';
import { TGlobalsList } from '../../@types/types';
import { ApplicationActions } from '../application.actions';
import { GlobalsActions } from './globals.actions';

export type IGlobalsState = Readonly<TGlobalsList>;

export const initialState: IGlobalsState = {
  title: 'Global Items',
  id: '_globals',
  items: [],
};

export const globalsReducer = createReducer(
  initialState,
  on(GlobalsActions.addItem, (state, action): IGlobalsState => {
    return { ...state, items: [action.item, ...state.items] };
  }),
  on(GlobalsActions.removeItem, (state, { item }): IGlobalsState => {
    return {
      ...state,
      items: state.items.filter((listItem) => listItem.id !== item.id),
    };
  }),
  on(GlobalsActions.updateItem, (state, { item }): IGlobalsState => {
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
    (_state, { datastore }): IGlobalsState => {
      return datastore.globals ?? _state;
    }
  )
);
