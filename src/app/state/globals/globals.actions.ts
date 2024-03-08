import { createActionGroup, emptyProps } from '@ngrx/store';
import { IGlobalItem, TItemListMode, TUpdateDTO } from '../../@types/types';

export const GlobalsActions = createActionGroup({
  source: 'Globals',
  events: {
    'Add Item': (item: IGlobalItem) => ({ item }),
    'Add Item From Search': emptyProps(),
    'Remove Item': (item: IGlobalItem) => ({ item }),
    'Create Item': (data?: Partial<IGlobalItem>) => ({ data }),
    'Edit Item': (item: TUpdateDTO<IGlobalItem>) => ({ item }),
    'End Edit Item': (item?: Partial<IGlobalItem>) => ({ item }),
    'Update Item': (item: TUpdateDTO<IGlobalItem>) => ({ item }),
    'Update Search': (searchQuery?: string) => ({ searchQuery }),
    'Update Filter': (filterBy?: string) => ({ filterBy }),
    'Update Mode': (mode?: TItemListMode) => ({ mode }),
    'Update Sort': (
      sortBy?: 'name' | 'bestBefore',
      sortDir?: 'asc' | 'desc' | 'keep' | 'toggle'
    ) => ({ sortBy, sortDir }),
  },
});
