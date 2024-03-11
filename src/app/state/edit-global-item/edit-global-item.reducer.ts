import { createReducer, on } from '@ngrx/store';
import { IEditGlobalItemState } from '../../@types/types';
import { createGlobalItem } from '../../app.factory';
import { showEditDialog } from '../@shared/edit-dialog.reducer';
import { EditGlobalItemActions } from './edit-global-item.actions';

export const initialSettings: IEditGlobalItemState = {
  isEditing: false,
  item: createGlobalItem('initial'),
};
export const editGlobalItemReducer = createReducer(
  initialSettings,
  on(
    EditGlobalItemActions.showDialog,
    (state, { item }): IEditGlobalItemState => ({
      ...showEditDialog(
        state,
        item ?? createGlobalItem(''),
        item ? 'update' : 'create'
      ),
      listId: undefined,
    })
  ),
  on(
    EditGlobalItemActions.updateItem,
    (state, { data }): IEditGlobalItemState => {
      return { ...state, item: { ...state.item, ...data } };
    }
  ),
  on(
    EditGlobalItemActions.showDialogAndAddToList,
    (state, { listId }): IEditGlobalItemState => ({
      ...showEditDialog(state, createGlobalItem(''), 'create'),
      listId,
    })
  ),
  on(EditGlobalItemActions.hideDialog, (state): IEditGlobalItemState => {
    return { ...state, isEditing: false };
  }),
  on(EditGlobalItemActions.confirmChanges, (state): IEditGlobalItemState => {
    return { ...state, isEditing: false };
  }),
  on(EditGlobalItemActions.abortChanges, (state): IEditGlobalItemState => {
    return { ...state, isEditing: false, listId: undefined };
  })
);
