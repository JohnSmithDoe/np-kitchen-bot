import { IAppState, IQuickAddState, TColor, TMarker } from '../../@types/types';

export const updateQuickAddState = (
  state: IAppState,
  listName: TMarker,
  color: TColor
): IQuickAddState => {
  const searchQuery = state.storage.searchQuery;
  return {
    searchQuery,
    exactMatchLocal: !!state.storage.items.find(
      (item) => item.name.toLowerCase() === searchQuery
    ),
    exactMatchGlobal: !!state.globals.items.find(
      (item) => item.name.toLowerCase() === searchQuery
    ),
    listName,
    color,
  };
};
