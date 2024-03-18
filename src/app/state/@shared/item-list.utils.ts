import { marker } from '@colsen1991/ngx-translate-extract-marker';
import * as dayjs from 'dayjs';
import {
  IAppState,
  IBaseItem,
  IListState,
  IQuickAddState,
  ISearchResult,
  IShoppingItem,
  IStorageItem,
  IStorageState,
  TAllItemTypes,
  TColor,
  TItemListCategory,
  TItemListId,
  TItemListMode,
  TItemListSort,
  TItemListSortDir,
  TItemListSortType,
  TUpdateDTO,
} from '../../@types/types';
import { createStorageItemFromShopping } from '../../app.factory';
import {
  isStorageItem,
  isTaskItem,
  matchesCategory,
  matchesItemExactly,
  matchesItemExactlyIdx,
  matchesNameExactly,
  matchesSearch,
  matchesSearchExactly,
  matchingTxtIsNotEmpty,
} from '../../app.utils';

export const stateByListId = (
  state: IAppState,
  listId: TItemListId
): IListState<any> => {
  //prettier-ignore
  switch (listId) {
    case '_storage':
      return state.storage;
    case '_globals':
      return state.globals;
    case '_shopping':
      return state.shopping;
    case '_tasks':
      return state.tasks;
  }
};

export const searchQueryByListId = (state: IAppState, listId: TItemListId) =>
  stateByListId(state, listId).searchQuery;

export const updateQuickAddState = (
  state: IAppState,
  listId: TItemListId
): IQuickAddState => {
  let searchQuery: string | undefined;
  let exactMatchLocal = false;
  let listName: string | undefined;
  let color: TColor | undefined;
  let isCategoryMode: boolean | undefined;
  switch (listId) {
    case '_storage':
      searchQuery = state.storage.searchQuery;
      listName = marker('list-header.storage');
      color = 'storage';
      isCategoryMode = state.storage.mode === 'categories';
      exactMatchLocal = !!state.storage.items.find((item) =>
        matchesSearchExactly(item, searchQuery)
      );
      break;
    case '_globals':
      searchQuery = state.globals.searchQuery;
      listName = marker('list-header.globals');
      color = 'global';
      isCategoryMode = state.globals.mode === 'categories';
      exactMatchLocal = !!state.globals.items.find((item) =>
        matchesSearchExactly(item, searchQuery)
      );
      break;
    case '_shopping':
      searchQuery = state.shopping.searchQuery;
      listName = marker('list-header.shopping');
      color = 'shopping';
      isCategoryMode = state.shopping.mode === 'categories';
      exactMatchLocal = !!state.shopping.items.find((item) =>
        matchesSearchExactly(item, searchQuery)
      );
      break;
  }
  const doShow = matchingTxtIsNotEmpty(searchQuery);
  return {
    searchQuery,
    canAddLocal: !isCategoryMode && doShow && !exactMatchLocal,
    canAddGlobal:
      !isCategoryMode &&
      doShow &&
      listId !== '_globals' && // dont show in globals
      !state.globals.items.find((item) =>
        matchesSearchExactly(item, searchQuery)
      ),
    listName,
    color,
  };
};

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
const additionalSearch = <R extends TAllItemTypes, T extends TAllItemTypes>(
  items: T[],
  result: ISearchResult<R>,
  searchQuery: string,
  others?: IBaseItem[]
) => {
  others = others || [];
  const additionalItemsByName = items.filter(
    (item) =>
      !others?.find((litem) => matchesNameExactly(item, litem)) &&
      !result.listItems.find((litem) => matchesNameExactly(item, litem)) &&
      matchesSearch(item, searchQuery)
  );
  // then by category
  const additionalItemsByCat = items.filter(
    (item) =>
      !others?.find((litem) => matchesNameExactly(item, litem)) &&
      !result.listItems.find((litem) => matchesNameExactly(item, litem)) &&
      !additionalItemsByName.includes(item) &&
      matchesCategory(item, searchQuery)
  );
  return [...additionalItemsByName, ...additionalItemsByCat];
};

export const filterBySearchQuery = <
  T extends IListState<R>,
  R extends TAllItemTypes,
>(
  state: IAppState,
  listState: T
): ISearchResult<R> | undefined => {
  const searchQuery = listState.searchQuery?.trim();
  if (!searchQuery || !searchQuery.length) return;
  const result: ISearchResult<R> = {
    searchTerm: searchQuery,
    hasSearchTerm: !!searchQuery.length,
    listItems: [],
    globalItems: [],
    storageItems: [],
    shoppingItems: [],
  };
  result.listItems = listState.items.filter((item) =>
    matchesSearch(item, searchQuery)
  );
  //prettier-ignore
  switch (listState.id) {
    case '_storage':
      if (state.settings.showGlobalsInStorage)
        result.globalItems = additionalSearch(state.globals.items, result, searchQuery);
      if (state.settings.showShoppingInStorage)
        result.shoppingItems = additionalSearch(state.shopping.items, result, searchQuery, result.globalItems);
      break;
    case '_globals':
      if (state.settings.showStorageInGlobals)
        result.storageItems = additionalSearch(state.storage.items, result, searchQuery);
      if (state.settings.showShoppingInGlobals)
        result.shoppingItems = additionalSearch(state.shopping.items, result, searchQuery, result.storageItems);
      break;
    case '_shopping':
      if (state.settings.showGlobalsInShopping)
        result.globalItems = additionalSearch(state.globals.items, result, searchQuery);
      if (state.settings.showStorageInShopping)
        result.storageItems = additionalSearch(state.storage.items, result, searchQuery, result.globalItems);
      break;
  }

  result.exactMatch = result.listItems.find((base) =>
    matchesSearchExactly(base, searchQuery)
  );
  return result;
};

export const sortItemListFn = <T extends TAllItemTypes>(
  sort?: TItemListSort
) => {
  const MAXPRIO = Number.MAX_SAFE_INTEGER;
  const MINPRIO = Number.MIN_SAFE_INTEGER;
  const MAXDATE = '5000-1-1';
  const MINDATE = '1970-1-1';
  return (a: T, b: T): number => {
    switch (sort?.sortBy) {
      case 'name':
        return sort.sortDir === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      case 'bestBefore':
        if (isStorageItem(a) && isStorageItem(b)) {
          return !a.bestBefore && !b.bestBefore
            ? sortItemListFn<T>({ ...sort, sortBy: 'name' })(a, b)
            : sort.sortDir === 'asc'
              ? dayjs(a.bestBefore ?? MAXDATE).unix() -
                dayjs(b.bestBefore ?? MAXDATE).unix()
              : dayjs(b.bestBefore ?? MINDATE).unix() -
                dayjs(a.bestBefore ?? MINDATE).unix();
        } else {
          return 0;
        }
      case 'prio':
        if (isTaskItem(a) && isTaskItem(b)) {
          return !a.prio && !b.prio
            ? sortItemListFn<T>({ ...sort, sortBy: 'name' })(a, b)
            : sort.sortDir === 'asc'
              ? (a.prio ?? MAXPRIO) - (b.prio ?? MAXPRIO)
              : (b.prio ?? MINPRIO) - (a.prio ?? MINPRIO);
        } else {
          return 0;
        }
      case 'dueAt':
        if (isTaskItem(a) && isTaskItem(b)) {
          return !a.dueAt && !b.dueAt
            ? sortItemListFn<T>({ ...sort, sortBy: 'name' })(a, b)
            : sort.sortDir === 'asc'
              ? dayjs(a.dueAt ?? MAXDATE).unix() -
                dayjs(b.dueAt ?? MAXDATE).unix()
              : dayjs(b.dueAt ?? MINDATE).unix() -
                dayjs(a.dueAt ?? MINDATE).unix();
        } else {
          return 0;
        }

      default:
        return 0;
    }
  };
};

export const filterAndSortItemList = <
  T extends IListState<R>,
  R extends TAllItemTypes,
>(
  state: T,
  result?: ISearchResult<R>
): R[] => {
  return (result?.listItems ?? [...state.items])
    .filter(
      (item) => !state.filterBy || item.category?.includes(state.filterBy)
    )
    .sort(sortItemListFn<R>(state.sort));
};

export const sortCategoriesFn = (sort?: TItemListSort) => {
  return (a: TItemListCategory, b: TItemListCategory) => {
    return sort?.sortDir === 'desc' ? b.localeCompare(a) : a.localeCompare(b);
  };
};

export const categoriesFromList = (items: IBaseItem[]): TItemListCategory[] => {
  return [...new Set(items.flatMap((item) => item.category ?? []))];
};

export const addListCategory = (
  categories: TItemListCategory[],
  category?: TItemListCategory
): TItemListCategory[] => {
  return !category?.length || categories.includes(category)
    ? categories
    : [category, ...categories];
};

export const removeListCategory = (
  categories: TItemListCategory[],
  category?: TItemListCategory
): TItemListCategory[] => {
  return categories.filter((cat) => cat !== category);
};
