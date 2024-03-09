import * as dayjs from 'dayjs';
import {
  IBaseItem,
  IListState,
  ISearchResult,
  TItemListSort,
} from '../../@types/types';
import { isStorageItem } from '../../app.utils';

export const filterBySearchQuery = <
  T extends IListState<R>,
  R extends IBaseItem,
>(
  state: T
): ISearchResult<R> | undefined => {
  const searchQuery = state.searchQuery?.trim();
  if (!searchQuery || !searchQuery.length) return;

  const matchesName = (item: IBaseItem, other: IBaseItem) =>
    item.name.toLowerCase() === other.name.toLowerCase();
  const matchesSearch = (item: IBaseItem) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesSearchExactly = (item: IBaseItem) =>
    item.name.toLowerCase() === searchQuery.toLowerCase();
  const matchesCategory = (item: IBaseItem) =>
    (item.category?.findIndex(
      (cat) => cat.toLowerCase().indexOf(searchQuery) >= 0
    ) ?? -1) >= 0;

  const listItems = state.items.filter((item) => matchesSearch(item));

  // const storageItems = state.items.filter(
  //   (item) =>
  //     !listItems.find((litem) => matchesName(item, litem)) &&
  //     matchesSearch(item)
  // );

  // const globalItemsByName = this.all.items.filter(
  //   (item) =>
  //     !listItems.find((litem) => matchesName(item, litem)) &&
  //     !storageItems.find((sitem) => matchesName(item, sitem)) &&
  //     matchesSearch(item)
  // );
  // const globalItemsByCat = this.all.items.filter(
  //   (item) =>
  //     !listItems.find((litem) => matchesName(item, litem)) &&
  //     !globalItemsByName.includes(item) &&
  //     matchesCategory(item)
  // );
  // const globalItems = [...globalItemsByName, ...globalItemsByCat];

  // const all: IBaseItem[] = ([] as IBaseItem[])
  //   .concat(listItems)
  //   // .concat(globalItems)
  //   .concat(storageItems);
  // function findCategory(item: IBaseItem, category?: string) {
  //   if (!category) return true;
  //   return !!item.category?.find(
  //     (cat) => cat.toLowerCase() === category.toLowerCase()
  //   );
  // }
  //
  // function findByName(item: IBaseItem, searchQuery?: string) {
  //   return item.name.toLowerCase().includes(searchQuery ?? '');
  // }

  const exactMatch = listItems.find((base) => matchesSearchExactly(base));
  return {
    searchTerm: searchQuery,
    hasSearchTerm: !!searchQuery.length,
    exactMatch,
    foundInGlobal: undefined,
    showQuickAdd: !exactMatch && !!searchQuery.length,
    showQuickAddGlobal: false,
    all: [],
    listItems,
    globalItems: [],
    storageItems: [],
  };
};
function sortItemListFn<T extends IBaseItem>(sort?: TItemListSort) {
  const MAXDATE = '5000-1-1';
  const MINDATE = '1970-1-1';
  return (a: T, b: T) => {
    switch (sort?.sortBy) {
      case 'name':
        return sort.sortDir === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      case 'bestBefore':
        if (isStorageItem(a) && isStorageItem(b)) {
          return sort.sortDir === 'asc'
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
