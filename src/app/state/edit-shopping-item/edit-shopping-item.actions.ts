import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  IShoppingItem,
  IStorageItem,
  TItemListCategory,
} from '../../@types/types';

export const EditShoppingItemActions = createActionGroup({
  source: 'EditShoppingItem',
  events: {
    'Show Dialog': (item?: IShoppingItem) => ({ item }),
    'Update Item': (data: Partial<IStorageItem>) => ({ data }),
    'Remove Category': (category: TItemListCategory) => ({ category }),
    'Hide Dialog': emptyProps(),
    'Confirm Changes': emptyProps(),
    'Abort Changes': emptyProps(),
  },
});
