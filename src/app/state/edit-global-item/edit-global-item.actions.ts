import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  IGlobalItem,
  TItemListCategory,
  TItemListId,
} from '../../@types/types';
//prettier-ignore
export const EditGlobalItemActions = createActionGroup({
  source: 'EditGlobalItem',
  events: {
    'Show Dialog': (item?: IGlobalItem, addToListId?: TItemListId) => ({ item, addToListId }),
    'Update Item': (data: Partial<IGlobalItem>) => ({ data }),
    'Remove Category': (category: TItemListCategory) => ({ category }),
    'Hide Dialog': emptyProps(),
    'Confirm Changes': emptyProps(),
    'Abort Changes': emptyProps(),
  },
});
