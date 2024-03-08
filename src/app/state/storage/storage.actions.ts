import { createActionGroup } from '@ngrx/store';
import { IStorageItem, TItemListMode, TUpdateDTO } from '../../@types/types';

export const StorageActions = createActionGroup({
  source: 'Storage',
  events: {
    'Add Item': (item: IStorageItem) => ({ item }),
    'Remove Item': (item: IStorageItem) => ({ item }),
    'Start Edit Item': (data?: Partial<IStorageItem>) => ({ data }),
    'End Edit Item': (data?: Partial<IStorageItem>) => ({ data }),
    'Update Item': (item?: TUpdateDTO<IStorageItem>) => ({ item }),
    'Update Search': (searchQuery?: string) => ({ searchQuery }),
    'Update Filter': (filterBy?: string) => ({ filterBy }),
    'Update Mode': (mode?: TItemListMode) => ({ mode }),
    'Update Sort': (
      sortBy?: 'name' | 'bestBefore',
      sortDir?: 'asc' | 'desc' | 'keep' | 'toggle'
    ) => ({ sortBy, sortDir }),
  },
});
