import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  IGlobalItem,
  IShoppingItem,
  IStorageItem,
  TItemListCategory,
  TItemListId,
  TItemListMode,
  TItemListSortType,
} from '../../@types/types';
// prettier-ignore
export const ItemListActions = createActionGroup({
  source: 'ItemList',
  events: {
    // Effects only
    'Add Item From Search': (listId:TItemListId) => ({ listId }),
    'Add Global Item': (listId:TItemListId, item: IGlobalItem) => ({ item, listId }),
    'Add Storage Item': (listId:TItemListId, item: IStorageItem) => ({ item, listId }),
    'Add Shopping Item': (listId:TItemListId, item: IShoppingItem) => ({ item, listId }),
    'Configuration Error': emptyProps(),
    // Operations
    'Add Category': (listId:TItemListId, category: TItemListCategory) => ({ listId, category }),
    'Update Search': (listId:TItemListId, searchQuery?: string) => ({ searchQuery, listId }),
    'Update Filter': (listId:TItemListId, filterBy?: string) => ({ filterBy, listId }),
    'Update Mode': (listId:TItemListId, mode?: TItemListMode) => ({ mode, listId }),
    'Update Sort': (listId:TItemListId, sortBy?: TItemListSortType, sortDir?: 'asc' | 'desc' | 'keep' | 'toggle') => ({ sortBy, sortDir, listId }),
  },
});
