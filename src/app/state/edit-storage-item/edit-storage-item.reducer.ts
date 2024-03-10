import { createReducer, on } from '@ngrx/store';
import { IEditStorageItemState } from '../../@types/types';
import { createStorageItem } from '../../app.factory';
import { EditStorageItemActions } from './edit-storage-item.actions';

export const initialSettings: IEditStorageItemState = {
  isEditing: false,
  item: createStorageItem('initial'),
};

function marker(key: string) {
  return key;
}

export const editStorageItemReducer = createReducer(
  initialSettings,
  on(
    EditStorageItemActions.showDialog,
    (state, { item }): IEditStorageItemState => {
      const saveButtonText = item
        ? marker('edit.item.dialog.button.update')
        : marker('edit.item.dialog.button.create');

      const dialogTitle = item
        ? marker('edit.item.dialog.title.update')
        : marker('edit.item.dialog.title.create');

      return {
        ...state,
        isEditing: true,
        item: item ? { ...item } : createStorageItem('new item'),
        editMode: item ? 'update' : 'create',
        saveButtonText,
        dialogTitle,
      };
    }
  ),
  on(
    EditStorageItemActions.updateItem,
    (state, { data }): IEditStorageItemState => {
      return { ...state, item: { ...state.item, ...data } };
    }
  ),
  on(EditStorageItemActions.hideDialog, (state): IEditStorageItemState => {
    return { ...state, isEditing: false };
  }),
  on(EditStorageItemActions.confirmChanges, (state): IEditStorageItemState => {
    return { ...state, isEditing: false };
  }),
  on(EditStorageItemActions.abortChanges, (state): IEditStorageItemState => {
    return { ...state, isEditing: false };
  })
);
