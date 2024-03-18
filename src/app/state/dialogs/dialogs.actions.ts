import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  IBaseItem,
  TAllItemTypes,
  TItemListCategory,
  TItemListId,
} from '../../@types/types';

//prettier-ignore
export const DialogsActions = createActionGroup({
  source: 'Dialogs',
  events: {
    'Show Edit Dialog': (item: TAllItemTypes, listId: TItemListId,  additional?: TItemListId) => ({ item, listId, additional }),
    'Show Create Dialog With Search': (listId: TItemListId) => ({ listId }),
    'Show Create And Add Global Dialog': (listId: TItemListId) => ({ listId }),
    'Update Item': (data: Partial<TAllItemTypes>) => ({ data }),
    'Remove Category': (category: TItemListCategory) => ({ category }),
    'Hide Dialog': emptyProps(),
    'Confirm Changes': emptyProps(),
    'Abort Changes': emptyProps(),
  },
});

export const CategoriesActions = createActionGroup({
  source: 'Categories',
  events: {
    'Add Category': emptyProps(),
    'Toggle Category': (category: TItemListCategory) => ({ category }),
    'Remove Category': (category: TItemListCategory) => ({ category }),
    'Update Search Query': (query?: string) => ({ query }),
    'Update Selection': (item?: IBaseItem, items?: IBaseItem[]) => ({
      item,
      items,
    }),
    'Show Dialog': emptyProps(),
    'Confirm Changes': emptyProps(),
    'Abort Changes': emptyProps(),
  },
});
