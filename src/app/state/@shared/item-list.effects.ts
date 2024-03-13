import { IAppState, IQuickAddState, TColor, TMarker } from '../../@types/types';
import { matchesSearchExactly } from '../../app.utils';

export const updateQuickAddState = (
  state: IAppState,
  listName: TMarker,
  color: TColor
): IQuickAddState => {
  const searchQuery = state.storage.searchQuery;
  return {
    searchQuery,
    exactMatchLocal: !!state.storage.items.find((item) =>
      matchesSearchExactly(item, searchQuery)
    ),
    exactMatchGlobal: !!state.globals.items.find((item) =>
      matchesSearchExactly(item, searchQuery)
    ),
    listName,
    color,
  };
};
