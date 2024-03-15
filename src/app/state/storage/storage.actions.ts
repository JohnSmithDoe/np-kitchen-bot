import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  IGlobalItem,
  IShoppingItem,
  IStorageItem,
  TItemListMode,
  TItemListSortType,
  TUpdateDTO,
} from '../../@types/types';

export const StorageActions = createActionGroup({
  source: 'Storage',
  events: {
    // Effects only
    'Enter Page': emptyProps(),
    'Add Or Update Item': (item: IStorageItem) => ({ item }),
    'Add Item From Search': emptyProps(),
    'Add Global Item': (item: IGlobalItem) => ({ item }),
    'Add Shopping Item': (item: IShoppingItem) => ({ item }),

    'Show Create Dialog With Search': emptyProps(),
    'Show Create Global Dialog With Search': emptyProps(),

    'Copy To Shoppinglist': (item: IStorageItem) => ({ item }),
    'Copy To Shoppinglist Success': (name: string, quantity: number) => ({
      name,
      quantity,
    }),

    // Operations

    'Add Item': (item: IStorageItem) => ({ item }),
    'Add Item Failure': (item: IStorageItem) => ({ item }),

    'Remove Item': (item: IStorageItem) => ({ item }),
    'Update Item': (item: TUpdateDTO<IStorageItem>) => ({ item }),
    'Update Search': (searchQuery?: string) => ({ searchQuery }),
    'Update Filter': (filterBy?: string) => ({ filterBy }),
    'Update Mode': (mode?: TItemListMode) => ({ mode }),
    'Update Sort': (
      sortBy?: TItemListSortType,
      sortDir?: 'asc' | 'desc' | 'keep' | 'toggle'
    ) => ({ sortBy, sortDir }),
  },
});
