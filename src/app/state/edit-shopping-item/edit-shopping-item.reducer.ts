import { createReducer, on } from '@ngrx/store';
import { IEditShoppingItemState } from '../../@types/types';
import { createShoppingItem } from '../../app.factory';
import { EditShoppingItemActions } from './edit-shopping-item.actions';

export const initialSettings: IEditShoppingItemState = {
  isEditing: false,
  item: createShoppingItem('initial'),
};
export const editShoppingItemReducer = createReducer(
  initialSettings,
  on(
    EditShoppingItemActions.showDialog,
    (state, { item }): IEditShoppingItemState => {
      return { ...state, isEditing: true };
    }
  ),
  on(EditShoppingItemActions.hideDialog, (state): IEditShoppingItemState => {
    return { ...state, isEditing: false };
  }),
  on(
    EditShoppingItemActions.confirmChanges,
    (state): IEditShoppingItemState => {
      return { ...state, isEditing: false };
    }
  ),
  on(EditShoppingItemActions.abortChanges, (state): IEditShoppingItemState => {
    return { ...state, isEditing: false };
  })
);
