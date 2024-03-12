import { createReducer, on } from '@ngrx/store';
import { IEditShoppingItemState } from '../../@types/types';
import { createShoppingItem } from '../../app.factory';
import { showEditDialog } from '../@shared/edit-dialog.reducer';
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
      return showEditDialog(state, { ...item }, item ? 'update' : 'create');
    }
  ),
  on(
    EditShoppingItemActions.updateItem,
    (state, { data }): IEditShoppingItemState => {
      return { ...state, item: { ...state.item, ...data } };
    }
  ),
  on(
    EditShoppingItemActions.removeCategory,
    (state, { category }): IEditShoppingItemState => {
      return {
        ...state,
        item: {
          ...state.item,
          category: state.item.category?.filter((cat) => cat !== category),
        },
      };
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
