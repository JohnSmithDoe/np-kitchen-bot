import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as dayjs from 'dayjs';
import {
  IBaseItem,
  ISearchResult,
  IStorageItem,
  TItemListCategory,
  TItemListSort,
} from '../../@types/types';
import { IStorageState } from './storage.reducer';

export const selectStorageState =
  createFeatureSelector<IStorageState>('storage');

export const selectStorageList = createSelector(
  selectStorageState,
  (state) => state.items
);

export const selectStorageListSearchResult = createSelector(
  selectStorageState,
  (state: IStorageState) => search(state, state.items)
);

function sortStorageListFn(sort?: TItemListSort) {
  return (a: IStorageItem, b: IStorageItem) => {
    const MAXDATE = '5000-1-1';
    switch (sort?.sortBy) {
      case 'name':
        return sort.sortDir === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      case 'bestBefore':
        return sort.sortDir === 'asc'
          ? dayjs(a.bestBefore ?? MAXDATE).unix() -
              dayjs(b.bestBefore ?? MAXDATE).unix()
          : dayjs(b.bestBefore ?? MAXDATE).unix() -
              dayjs(a.bestBefore ?? MAXDATE).unix();
      default:
        return 0;
    }
  };
}

export const selectStorageListItems = createSelector(
  selectStorageState,
  selectStorageListSearchResult,
  (state: IStorageState, result): IStorageItem[] | undefined => {
    return (result?.listItems ?? [...state.items])
      .filter(
        (item) => !state.filterBy || item.category?.includes(state.filterBy)
      )
      .sort(sortStorageListFn(state.sort));
  }
);
export const selectStorageListCategories = createSelector(
  selectStorageState,
  (state: IStorageState): TItemListCategory[] | undefined => {
    return [...new Set(state.items.flatMap((item) => item.category ?? []))];
  }
);

function search(
  state: IStorageState,
  items: IStorageItem[]
): ISearchResult<IStorageItem> | undefined {
  const searchQuery = state.searchQuery;
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

  const listItems = items.filter((item) => matchesSearch(item));

  const storageItems = items.filter(
    (item) =>
      !listItems.find((litem) => matchesName(item, litem)) &&
      matchesSearch(item)
  );

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
    storageItems,
  };
}
