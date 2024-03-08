import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IBaseItem,
  ISearchResult,
  IShoppingItem,
  IShoppingState,
  TItemListCategory,
  TItemListSort,
} from '../../@types/types';
import { IShoppinglistsState } from './shopping-lists.reducer';

export const selectShoppinglistState =
  createFeatureSelector<IShoppinglistsState>('shoppinglist');

export const selectShoppingList = createSelector(
  selectShoppinglistState,
  (state) => state.items
);

export const selectShoppingListSearchResult = createSelector(
  selectShoppinglistState,
  (state: IShoppingState) => search(state, state.items)
);

function sortShoppingListFn(sort?: TItemListSort) {
  return (a: IShoppingItem, b: IShoppingItem) => {
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

export const selectShoppingListItems = createSelector(
  selectShoppinglistState,
  selectShoppingListSearchResult,
  (state: IShoppingState, result): IShoppingItem[] | undefined => {
    return (result?.listItems ?? [...state.items])
      .filter(
        (item) => !state.filterBy || item.category?.includes(state.filterBy)
      )
      .sort(sortShoppingListFn(state.sort));
  }
);
export const selectShoppingListCategories = createSelector(
  selectShoppinglistState,
  (state: IShoppingState): TItemListCategory[] | undefined => {
    return [...new Set(state.items.flatMap((item) => item.category ?? []))];
  }
);

function search(
  state: IShoppingState,
  items: IShoppingItem[]
): ISearchResult<IShoppingItem> | undefined {
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
