import { createActionGroup, emptyProps } from '@ngrx/store';
import { IDatastore, IStorageItem } from '../@types/types';

export const StorageActions = createActionGroup({
  source: 'Storage',
  events: {
    'Add Item': (item: IStorageItem) => ({ item }),
    'Remove Item': (item: IStorageItem) => ({ item }),
    'Update Item': (item: IStorageItem) => ({ item }),
  },
});

export const DatabaseActions = createActionGroup({
  source: 'Database',
  events: {
    Load: (store: IDatastore) => ({ store }),
    Save: emptyProps(),
  },
});
