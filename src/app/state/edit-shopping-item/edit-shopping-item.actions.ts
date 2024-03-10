import { createActionGroup, emptyProps } from '@ngrx/store';
import { IShoppingItem } from '../../@types/types';

export const EditShoppingItemActions = createActionGroup({
  source: 'EditShoppingItem',
  events: {
    'Show Dialog': (item?: IShoppingItem) => ({ item }),
    'Hide Dialog': emptyProps(),
    'Confirm Changes': (item?: IShoppingItem) => ({ item }),
    'Abort Changes': emptyProps(),
  },
});
