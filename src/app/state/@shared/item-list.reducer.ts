import {
  IBaseItem,
  IListState,
  TItemListMode,
  TItemListSort,
  TItemListSortDir,
  TItemListSortType,
  TUpdateDTO,
} from '../../@types/types';

export const addListItem = <T extends IListState<R>, R extends IBaseItem>(
  state: T,
  item: R
): T => {
  // do not add an empty item
  // do not add an already contained item (could be triggered by a shortcut)
  const name = item.name.trim();
  if (
    !name.length ||
    !!state.items.find(
      (listItem) => name.toLowerCase() === listItem.name.toLowerCase()
    )
  ) {
    return state;
  }
  return {
    ...state,
    items: [item, ...state.items],
    searchQuery: undefined,
  };
};
export const removeListItem = <T extends IListState<R>, R extends IBaseItem>(
  state: T,
  item: R
): T => ({
  ...state,
  items: state.items.filter((listItem) => listItem.id !== item.id),
});

export const updateListItem = <T extends IListState<R>, R extends IBaseItem>(
  state: T,
  item: TUpdateDTO<R> | undefined
): T => {
  if (!item) return state;
  const items: TUpdateDTO<R>[] = [...state.items];
  const itemIdx = state.items.findIndex((listItem) => listItem.id === item.id);
  let searchQueryAfter = state.searchQuery;
  if (itemIdx >= 0) {
    const original = state.items[itemIdx];
    const updatedItem = { ...original, ...item };
    items.splice(itemIdx, 1, updatedItem);
    if (!updatedItem.name.includes(searchQueryAfter ?? ''))
      searchQueryAfter = undefined;
  } else {
    items.unshift(item);
    searchQueryAfter = undefined;
  }
  return { ...state, items, searchQuery: searchQueryAfter };
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