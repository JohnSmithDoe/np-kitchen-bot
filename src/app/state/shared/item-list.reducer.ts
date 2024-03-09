import {
  IBaseItem,
  IListState,
  IStorageItem,
  TItemListMode,
  TItemListSort,
  TItemListSortDir,
  TItemListSortType,
  TUpdateDTO,
} from '../../@types/types';
// TODO: this is really not okay
import { createStorageItem } from '../../app.factory';

export const addListItem = <T extends IListState<R>, R extends IBaseItem>(
  state: T,
  item: R
): T => ({
  ...state,
  items: [item, ...state.items],
});
export const removeListItem = <T extends IListState<R>, R extends IBaseItem>(
  state: T,
  item: R
): T => ({
  ...state,
  items: state.items.filter((listItem) => listItem.id !== item.id),
});
export const createAndEditListItem = <
  T extends IListState<R>,
  R extends IBaseItem,
>(
  state: T,
  data?: Partial<R>
) => {
  // use search query as initial name
  const name = data?.name?.length ? data.name : state.searchQuery ?? '';
  const newItem = createStorageItem(name);
  const editData: TUpdateDTO<IStorageItem> = {
    ...data,
    ...newItem,
  };
  return { ...state, data: editData, isEditing: true, editMode: 'create' };
};

export const createListItem = <T extends IListState<R>, R extends IBaseItem>(
  state: T,
  data?: Partial<R>
) => {
  // use search query as initial name
  const name = data?.name?.length ? data.name : state.searchQuery ?? '';
  const newItem: IStorageItem = {
    ...createStorageItem(name),
    ...data,
  };
  return { ...state, items: [newItem, ...state.items] };
};

export const updateInPosition = <T extends IListState<R>, R extends IBaseItem>(
  state: T,
  item: TUpdateDTO<R> | undefined
): T => {
  if (!item) return state;
  const items = [...state.items];
  const itemIdx = state.items.findIndex((listItem) => listItem.id === item.id);
  if (itemIdx >= 0) {
    const original = state.items[itemIdx];
    const updatedItem = { ...original, ...item };
    items.splice(itemIdx, 1, updatedItem);
  } else {
    // hmmmmmmm
    console.error(item, state.items, 'not found');
  }
  return { ...state, items };
};

export function addListItemFromSearchQuery<
  T extends IListState<R>,
  R extends IBaseItem,
>(state: T) {
  // do not add an empty item
  // do not add an already contained item (could be triggered by a shortcut)
  if (
    !state.searchQuery?.trim().length ||
    !!state.items.find((item) => item.name.toLowerCase() === state.searchQuery)
  )
    return state;
  //if (contained) throw new Error('Already contained'); // Breaks EVERYTHING hmmm
  // TODO: errorhandler maybe or effect
  //   await this.#uiService.showToast(
  //     this.translate.instant('toast.add.item.error.contained', {
  //       name: item?.name,
  //     }),
  //     'storage'
  //   );
  const item = createStorageItem(state.searchQuery);
  return { ...state, items: [item, ...state.items] };
}

export function editListItem<T extends IListState<R>, R extends IBaseItem>(
  state: T,
  item: R
): T {
  const editData: TUpdateDTO<R> = {
    ...item,
    name: item?.name ?? state.searchQuery ?? '', // use search query as initial name
  };
  return { ...state, data: editData, isEditing: true, editMode: 'update' };
}

export const endEditListItem = <T extends IListState<R>, R extends IBaseItem>(
  state: T,
  item?: Partial<R>
): T => {
  const result: T = {
    ...state,
    data: undefined,
    isEditing: false,
    isCreating: false,
  };
  if (!item || !state.editMode || !state.data) return result;
  switch (state.editMode) {
    case 'update':
      const updatedItem = { ...state.data, ...item };
      return updateInPosition<T, R>(result, updatedItem);
    case 'create':
      const newItem: IStorageItem = { ...state.data, quantity: 1, ...item };
      return {
        ...result,
        items: [newItem, ...state.items],
      };
  }
};
export const updateListSort = (
  sortBy?: TItemListSortType,
  newDir?: TItemListSortDir | 'keep' | 'toggle',
  currentDir?: TItemListSortDir
) => {
  let result: TItemListSort | undefined;
  if (!!sortBy) {
    const defaultSort = 'asc';
    let sortDir: 'asc' | 'desc' = defaultSort;
    switch (newDir) {
      case 'asc':
      case 'desc':
        sortDir = newDir;
        break;
      case 'keep':
        sortDir = currentDir ?? defaultSort;
        break;
      case 'toggle':
        sortDir = currentDir === 'asc' ? 'desc' : 'asc';
        break;
    }
    result = { sortBy, sortDir };
  }
  return result;
};

export const updateListMode = <T extends IListState<R>, R extends IBaseItem>(
  state: T,
  mode?: TItemListMode
): T => {
  // reset sort on mode change, otherwise toggle
  const sort: TItemListSort | undefined =
    state.mode !== mode
      ? { sortBy: 'name', sortDir: 'asc' }
      : updateListSort('name', 'toggle', state.sort?.sortDir);
  return {
    ...state,
    sort: sort,
    mode: mode ?? 'alphabetical',
    // clear search ... maybe
    searchQuery: undefined,
    filterBy: undefined,
  };
};
