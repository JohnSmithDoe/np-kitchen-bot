import { createReducer, on } from '@ngrx/store';
import { IEditStorageItemState } from '../../@types/types';
import { createStorageItem } from '../../app.factory';
import { showEditDialog } from '../@shared/edit-dialog.reducer';
import { EditStorageItemActions } from './edit-storage-item.actions';

export const initialSettings: IEditStorageItemState = {
  isEditing: false,
  item: createStorageItem('initial'),
};

export const editStorageItemReducer = createReducer(
  initialSettings,
  on(
    EditStorageItemActions.showDialog,
    (state, { item }): IEditStorageItemState => {
      return showEditDialog(state, { ...item }, item ? 'update' : 'create');
    }
  ),
  on(
    EditStorageItemActions.updateItem,
    (state, { data }): IEditStorageItemState => {
      return { ...state, item: { ...state.item, ...data } };
    }
  ),
  on(
    EditStorageItemActions.removeCategory,
    (state, { category }): IEditStorageItemState => {
      return {
        ...state,
        item: {
          ...state.item,
          category: state.item.category?.filter((cat) => cat !== category),
        },
      };
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
