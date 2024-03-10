import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  IGlobalItem,
  IShoppingItem,
  IStorageItem,
  TItemListMode,
  TUpdateDTO,
} from '../../@types/types';

export const ShoppingListActions = createActionGroup({
  source: 'Shoppinglist',
  events: {
    'Add Item': (item: IShoppingItem) => ({ item }),
    'Add Item From Search': emptyProps(),
    'Remove Item': (item: IShoppingItem) => ({ item }),
    'Create And Edit Item': (data?: Partial<IShoppingItem>) => ({ data }),
    'Create Item': (data?: Partial<IShoppingItem>) => ({ data }),
    'Add Storage Item': (data: IStorageItem) => ({ data }),
    // 'Edit Item': (item: TUpdateDTO<IShoppingItem>) => ({ item }),
    // 'End Edit Item': (item?: Partial<IShoppingItem>) => ({ item }),
    'Update Item': (item: TUpdateDTO<IShoppingItem>) => ({ item }),

    'Create Global Item': emptyProps(),
    'End Create Global Item': emptyProps(),
    'Create Global And Add As Item': (data: Partial<IGlobalItem>) => ({ data }),

    'Buy Item': (item: IShoppingItem) => ({ item }),

    'Update Search': (searchQuery?: string) => ({ searchQuery }),
    'Update Filter': (filterBy?: string) => ({ filterBy }),
    'Update Mode': (mode?: TItemListMode) => ({ mode }),
    'Update Sort': (
      sortBy?: 'name' | 'bestBefore',
      sortDir?: 'asc' | 'desc' | 'keep' | 'toggle'
    ) => ({ sortBy, sortDir }),
  },
});
