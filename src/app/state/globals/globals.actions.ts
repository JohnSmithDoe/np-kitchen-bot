import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  IGlobalItem,
  TItemListMode,
  TItemListSortType,
  TUpdateDTO,
} from '../../@types/types';

export const GlobalsActions = createActionGroup({
  source: 'Globals',
  events: {
    // Effects only
    'Add Item From Search': emptyProps(),
    'Show Create Dialog With Search': emptyProps(),

    // Operations

    'Add Item': (item: IGlobalItem) => ({ item }),
    'Remove Item': (item: IGlobalItem) => ({ item }),
    'Update Item': (item: TUpdateDTO<IGlobalItem>) => ({ item }),
    'Update Search': (searchQuery?: string) => ({ searchQuery }),
    'Update Filter': (filterBy?: string) => ({ filterBy }),
    'Update Mode': (mode?: TItemListMode) => ({ mode }),
    'Update Sort': (
      sortBy?: TItemListSortType,
      sortDir?: 'asc' | 'desc' | 'keep' | 'toggle'
    ) => ({ sortBy, sortDir }),
  },
});
