import { createActionGroup } from '@ngrx/store';
import { IStorageItem } from '../../@types/types';

export const StorageActions = createActionGroup({
  source: 'Storage',
  events: {
    'Add Item': (item: IStorageItem) => ({ item }),
    'Remove Item': (item: IStorageItem) => ({ item }),
    'Update Item': (item?: IStorageItem) => ({ item }),
  },
});
