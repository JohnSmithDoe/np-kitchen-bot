import { createActionGroup } from '@ngrx/store';
import { IQuickAddState } from '../../@types/types';

export const QuickAddActions = createActionGroup({
  source: 'Categories',
  events: {
    'Update State': (newState: IQuickAddState) => ({ newState }),
  },
});
