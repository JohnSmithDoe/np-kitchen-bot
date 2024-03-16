import {
  IListState,
  IShoppingItem,
  IStorageItem,
  IStorageState,
  TAllItemTypes,
  TItemListMode,
  TItemListSort,
  TItemListSortDir,
  TItemListSortType,
  TUpdateDTO,
} from '../../@types/types';
import { createStorageItemFromShopping } from '../../app.factory';
import { matchesItemExactly, matchesItemExactlyIdx } from '../../app.utils';

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
export const addShoppinglistToStorage = (
  state: IStorageState,
  items: IShoppingItem[]
): IStorageState => {
  let newState: IStorageState = { ...state };
  for (let i = 0; i < items.length; i++) {
    const storageItem = createStorageItemFromShopping(
      items[i],
      items[i].quantity
    );
    newState = addListItemOrIncreaseQuantity(newState, storageItem, false);
  }
  return newState;
};

export const addListItemOrIncreaseQuantity = <
  T extends IListState<R>,
  R extends IStorageItem | IShoppingItem,
>(
  state: T,
  item: R,
  byOne = true
): T => {
  const found = matchesItemExactly(item, state.items);
  if (found) {
    return updateListItem<T, R>(state, {
      ...found,
      quantity: found.quantity + (byOne ? 1 : item.quantity),
    });
  }
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

export const removeListItems = <
  T extends IListState<R>,
  R extends TAllItemTypes,
>(
  state: T,
  items: R[]
): T => {
  const toRemove = items.map((item) => item.id);
  return {
    ...state,
    items: state.items.filter((listItem) => !toRemove.includes(listItem.id)),
  };
};

export const updateListItem = <
  T extends IListState<R>,
  R extends TAllItemTypes,
>(
  state: T,
  item: TUpdateDTO<R> | undefined
): T => {
  if (!item) return state;
  const items: TUpdateDTO<R>[] = [...state.items];
  const itemIdx = matchesItemExactlyIdx(item, state.items);
  if (itemIdx >= 0) {
    const original = state.items[itemIdx];
    const updatedItem = { ...original, ...item };
    items.splice(itemIdx, 1, updatedItem);
  } else {
    console.error(item);
    // throw new Error('Dont update an item that is not in the list');
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
    filterBy: mode === 'categories' ? undefined : state.filterBy,
  };
};
