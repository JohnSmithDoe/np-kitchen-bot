import { createActionGroup } from '@ngrx/store';
import { IGlobalItem } from '../../@types/types';

export const GlobalsActions = createActionGroup({
  source: 'Globals',
  events: {
    'Add Item': (item: IGlobalItem) => ({ item }),
    'Remove Item': (item: IGlobalItem) => ({ item }),
    'Update Item': (item?: IGlobalItem) => ({ item }),
  },
});
