import { IBaseItem, IEditItemState, TEditItemMode } from '../../@types/types';

const marker = (key: string) => key;

export const showEditDialog = <R extends IBaseItem>(
  state: IEditItemState<R>,
  item: R,
  editMode: TEditItemMode
): IEditItemState<R> => {
  const saveButtonText = item
    ? marker('edit.item.dialog.button.update')
    : marker('edit.item.dialog.button.create');

  const dialogTitle = item
    ? marker('edit.item.dialog.title.update')
    : marker('edit.item.dialog.title.create');

  return {
    ...state,
    isEditing: true,
    item,
    editMode,
    saveButtonText,
    dialogTitle,
  };
};
