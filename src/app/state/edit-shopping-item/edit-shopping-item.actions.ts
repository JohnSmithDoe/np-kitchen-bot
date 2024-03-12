import { createActionGroup, emptyProps } from '@ngrx/store';
import { IShoppingItem, TItemListCategory } from '../../@types/types';

export const EditShoppingItemActions = createActionGroup({
  source: 'EditShoppingItem',
  events: {
    'Show Dialog': (item: IShoppingItem) => ({ item }),
    'Update Item': (data: Partial<IShoppingItem>) => ({ data }),
    'Remove Category': (category: TItemListCategory) => ({ category }),
    'Hide Dialog': emptyProps(),
    'Confirm Changes': emptyProps(),
    'Abort Changes': emptyProps(),
  },
});
