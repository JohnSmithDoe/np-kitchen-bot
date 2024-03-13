import {
  IListState,
  IShoppingItem,
  IStorageItem,
  TAllItemTypes,
  TItemListMode,
  TItemListSort,
  TItemListSortDir,
  TItemListSortType,
  TUpdateDTO,
} from '../../@types/types';
import { matchesItem, matchesItemIdx } from '../../app.utils';

export const addListItem = <T extends IListState<R>, R extends TAllItemTypes>(
  state: T,
  item: R
): T => {
  // do not add an empty item
  const name = item.name.trim();
  if (!name.length) {
    return state;
  }
  return {
    ...state,
    items: [item, ...state.items],
  };
};

export const addListItemOrIncreaseQuantity = <
  T extends IListState<R>,
  R extends IStorageItem | IShoppingItem,
>(
  state: T,
  item: R
): T => {
  const found = matchesItem(item, state.items);
  if (found) {
    console.log('found so inc quantity', found.quantity + 1);
    return updateListItem<T, R>(state, {
      ...found,
      quantity: found.quantity + 1,
    });
  }
  console.log('not found so add');
  return addListItem<T, R>(state, item);
};

export const removeListItem = <
  T extends IListState<R>,
  R extends TAllItemTypes,
>(
  state: T,
  item: R
): T => ({
  ...state,
  items: state.items.filter((listItem) => listItem.id !== item.id),
});

export const updateListItem = <
  T extends IListState<R>,
  R extends TAllItemTypes,
>(
  state: T,
  item: TUpdateDTO<R> | undefined
): T => {
  if (!item) return state;
  const items: TUpdateDTO<R>[] = [...state.items];
  const itemIdx = matchesItemIdx(item, state.items);
  if (itemIdx >= 0) {
    const original = state.items[itemIdx];
    const updatedItem = { ...original, ...item };
    items.splice(itemIdx, 1, updatedItem);
  } else {
    console.error(item);
    throw new Error('Dont update an item that is not in the list');
  }
  return { ...state, items };
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

export const updateListMode = <
  T extends IListState<R>,
  R extends TAllItemTypes,
>(
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
  };
};
