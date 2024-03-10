import { createReducer, on } from '@ngrx/store';
import { IEditGlobalItemState } from '../../@types/types';
import { createGlobalItem } from '../../app.factory';
import { EditGlobalItemActions } from './edit-global-item.actions';

export const initialSettings: IEditGlobalItemState = {
  isEditing: false,
  item: createGlobalItem('initial'),
};
export const editGlobalItemReducer = createReducer(
  initialSettings,
  on(
    EditGlobalItemActions.showDialog,
    (state, { item }): IEditGlobalItemState => {
      return { ...state, isEditing: true };
    }
  ),
  on(EditGlobalItemActions.hideDialog, (state): IEditGlobalItemState => {
    return { ...state, isEditing: false };
  }),
  on(EditGlobalItemActions.confirmChanges, (state): IEditGlobalItemState => {
    return { ...state, isEditing: false };
  }),
  on(EditGlobalItemActions.abortChanges, (state): IEditGlobalItemState => {
    return { ...state, isEditing: false };
  })
);
