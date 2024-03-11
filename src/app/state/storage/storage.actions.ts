import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  IGlobalItem,
  IStorageItem,
  TItemListMode,
  TUpdateDTO,
} from '../../@types/types';

export const StorageActions = createActionGroup({
  source: 'Storage',
  events: {
    'Add Item': (item: IStorageItem) => ({ item }),
    'Update Item': (item: TUpdateDTO<IStorageItem>) => ({ item }),
    'Remove Item': (item: IStorageItem) => ({ item }),

    'Add Item From Search': emptyProps(),
    'Show Create Dialog From Search': emptyProps(),
    'Add Global Item': (item: IGlobalItem) => ({ item }),
    'Move To Shoppinglist': (item: IStorageItem) => ({ item }),

    'Update Search': (searchQuery?: string) => ({ searchQuery }),
    'Update Filter': (filterBy?: string) => ({ filterBy }),
    'Update Mode': (mode?: TItemListMode) => ({ mode }),
    'Update Sort': (
      sortBy?: 'name' | 'bestBefore',
      sortDir?: 'asc' | 'desc' | 'keep' | 'toggle'
    ) => ({ sortBy, sortDir }),
  },
});
