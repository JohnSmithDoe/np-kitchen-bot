import { createActionGroup, emptyProps } from '@ngrx/store';
import { IGlobalItem, TItemListId } from '../../@types/types';

export const EditGlobalItemActions = createActionGroup({
  source: 'EditGlobalItem',
  events: {
    'Show Dialog': (item?: IGlobalItem) => ({ item }),
    'Show Dialog And Add To List': (listId: TItemListId) => ({ listId }),
    'Update Item': (data: Partial<IGlobalItem>) => ({ data }),
    'Hide Dialog': emptyProps(),
    'Confirm Changes': emptyProps(),
    'Abort Changes': emptyProps(),
  },
});
