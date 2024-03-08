import { createActionGroup, emptyProps } from '@ngrx/store';
import { IStorageItem, TItemListMode, TUpdateDTO } from '../../@types/types';

export const StorageActions = createActionGroup({
  source: 'Storage',
  events: {
    'Add Item': (item: IStorageItem) => ({ item }),
    'Add Item From Search': emptyProps(),
    'Remove Item': (item: IStorageItem) => ({ item }),
    'Create Item': (data?: Partial<IStorageItem>) => ({ data }),
    'Edit Item': (item: TUpdateDTO<IStorageItem>) => ({ item }),
    'End Edit Item': (item?: Partial<IStorageItem>) => ({ item }),
    'Update Item': (item: TUpdateDTO<IStorageItem>) => ({ item }),
    'Update Search': (searchQuery?: string) => ({ searchQuery }),
    'Update Filter': (filterBy?: string) => ({ filterBy }),
    'Update Mode': (mode?: TItemListMode) => ({ mode }),
    'Update Sort': (
      sortBy?: 'name' | 'bestBefore',
      sortDir?: 'asc' | 'desc' | 'keep' | 'toggle'
    ) => ({ sortBy, sortDir }),
  },
});
