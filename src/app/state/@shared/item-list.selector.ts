import * as dayjs from 'dayjs';
import {
  IAppState,
  IBaseItem,
  IListState,
  ISearchResult,
  TItemListCategory,
  TItemListSort,
} from '../../@types/types';
import { isStorageItem } from '../../app.utils';

const matchesNameExactly = (item: IBaseItem, other: IBaseItem) =>
  item.name.toLowerCase() === other.name.toLowerCase();
const matchesSearch = (item: IBaseItem, searchQuery: string) =>
  item.name.toLowerCase().includes(searchQuery.toLowerCase());
const matchesSearchExactly = (item: IBaseItem, searchQuery: string) =>
  item.name.toLowerCase() === searchQuery.toLowerCase();
const matchesCategory = (item: IBaseItem, searchQuery: string) =>
  (item.category?.findIndex(
    (cat) => cat.toLowerCase().indexOf(searchQuery) >= 0
  ) ?? -1) >= 0;
const additionalSearch = <R extends IBaseItem, T extends IBaseItem>(
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
  R extends IBaseItem,
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
    case "_storage":
      if(state.settings.showGlobalsInStorage)
        result.globalItems = additionalSearch(state.globals.items, result, searchQuery);
      if(state.settings.showShoppingInStorage)
        result.shoppingItems = additionalSearch(state.shopping.items, result, searchQuery, result.globalItems);
      break;
    case "_globals":
      if(state.settings.showStorageInGlobals)
        result.storageItems = additionalSearch(state.storage.items, result, searchQuery);
      if(state.settings.showShoppingInGlobals)
        result.shoppingItems = additionalSearch(state.shopping.items, result, searchQuery, result.storageItems);
      break;
    case "_shopping":
      console.log('additional shopping');
      if(state.settings.showGlobalsInShopping)
        result.globalItems = additionalSearch(state.globals.items, result, searchQuery);
      if(state.settings.showStorageInShopping)
        result.storageItems = additionalSearch(state.storage.items, result, searchQuery, result.globalItems);
      break;
  }

  result.exactMatch = result.listItems.find((base) =>
    matchesSearchExactly(base, searchQuery)
  );
  return result;
};

function sortItemListFn<T extends IBaseItem>(sort?: TItemListSort) {
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

      default:
        return 0;
    }
  };
}

export const filterAndSortItemList = <
  T extends IListState<R>,
  R extends IBaseItem,
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
