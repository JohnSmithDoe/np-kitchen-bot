import { marker } from '@colsen1991/ngx-translate-extract-marker';
import {
  IAppState,
  IQuickAddState,
  TColor,
  TItemListId,
} from '../../@types/types';
import { matchesSearchExactly } from '../../app.utils';

export const createQuickAddState = (
  state: IAppState,
  listId: TItemListId
): IQuickAddState => {
  let searchQuery: string | undefined;
  let exactMatchLocal = false;
  let listName: string | undefined;
  let color: TColor | undefined;
  switch (listId) {
    case '_storage':
      searchQuery = state.storage.searchQuery;
      listName = marker('list-header.storage');
      color = 'storage';
      exactMatchLocal = !!state.storage.items.find((item) =>
        matchesSearchExactly(item, searchQuery)
      );
      break;
    case '_globals':
      searchQuery = state.globals.searchQuery;
      listName = marker('list-header.globals.dativ');
      color = 'global';
      exactMatchLocal = !!state.globals.items.find((item) =>
        matchesSearchExactly(item, searchQuery)
      );
      break;
    case '_shopping':
      searchQuery = state.shopping.searchQuery;
      listName = marker('list-header.shopping');
      color = 'shopping';
      exactMatchLocal = !!state.shopping.items.find((item) =>
        matchesSearchExactly(item, searchQuery)
      );
      break;
  }
  return {
    searchQuery,
    exactMatchLocal,
    exactMatchGlobal: !!state.globals.items.find((item) =>
      matchesSearchExactly(item, searchQuery)
    ),
    listName,
    color,
  };
};
