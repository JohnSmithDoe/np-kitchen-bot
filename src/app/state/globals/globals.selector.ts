import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IBaseItem,
  IGlobalItem,
  IGlobalsState,
  ISearchResult,
  TItemListCategory,
  TItemListSort,
} from '../../@types/types';

export const selectGlobalsState =
  createFeatureSelector<IGlobalsState>('globals');

export const selectGlobalsList = createSelector(
  selectGlobalsState,
  (state) => state.items
);

export const selectGlobalsListSearchResult = createSelector(
  selectGlobalsState,
  (state: IGlobalsState) => search(state, state.items)
);

function sortGlobalsListFn(sort?: TItemListSort) {
  return (a: IGlobalItem, b: IGlobalItem) => {
    switch (sort?.sortBy) {
      case 'name':
      case 'bestBefore':
        return sort.sortDir === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      default:
        return 0;
    }
  };
}

export const selectGlobalsListItems = createSelector(
  selectGlobalsState,
  selectGlobalsListSearchResult,
  (state: IGlobalsState, result): IGlobalItem[] | undefined => {
    return (result?.listItems ?? [...state.items])
      .filter(
        (item) => !state.filterBy || item.category?.includes(state.filterBy)
      )
      .sort(sortGlobalsListFn(state.sort));
  }
);
export const selectGlobalsListCategories = createSelector(
  selectGlobalsState,
  (state: IGlobalsState): TItemListCategory[] | undefined => {
    return [...new Set(state.items.flatMap((item) => item.category ?? []))];
  }
);

function search(
  state: IGlobalsState,
  items: IGlobalItem[]
): ISearchResult<IGlobalItem> | undefined {
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
    storageItems: [],
  };
}
