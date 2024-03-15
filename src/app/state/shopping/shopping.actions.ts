import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  IGlobalItem,
  IShoppingItem,
  IStorageItem,
  TItemListMode,
  TItemListSortType,
  TUpdateDTO,
} from '../../@types/types';

export const ShoppingActions = createActionGroup({
  source: 'Shopping',
  events: {
    // Effects only
    'Enter Page': emptyProps(),
    'Add Or Update Item': (item: IShoppingItem) => ({ item }),
    'Add Item From Search': emptyProps(),
    'Add Global Item': (item: IGlobalItem) => ({ item }),
    'Add Storage Item': (item: IStorageItem) => ({ item }),

    'Add Item Or Increase Quantity': (item: IShoppingItem) => ({ item }),
    'Add Item Or Increase Quantity Success': (item: IShoppingItem) => ({
      item,
    }),

    'Show Create Dialog With Search': emptyProps(),
    'Show Create Global Dialog With Search': emptyProps(),

    'Buy Item': (item: IShoppingItem) => ({ item }),

    // Operations

    'Add Item': (item: IShoppingItem) => ({ item }),
    'Add Item Failure': (item: IShoppingItem) => ({ item }),

    'Remove Item': (item: IShoppingItem) => ({ item }),
    'Update Item': (item: TUpdateDTO<IShoppingItem>) => ({ item }),
    'Update Search': (searchQuery?: string) => ({ searchQuery }),
    'Update Filter': (filterBy?: string) => ({ filterBy }),
    'Update Mode': (mode?: TItemListMode) => ({ mode }),
    'Update Sort': (
      sortBy?: TItemListSortType,
      sortDir?: 'asc' | 'desc' | 'keep' | 'toggle'
    ) => ({ sortBy, sortDir }),
  },
});
