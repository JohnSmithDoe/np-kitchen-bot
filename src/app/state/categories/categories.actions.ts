import { createActionGroup, emptyProps } from '@ngrx/store';
import { IBaseItem, TItemListCategory } from '../../@types/types';

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