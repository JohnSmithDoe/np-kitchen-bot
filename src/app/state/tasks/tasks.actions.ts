import { createActionGroup, emptyProps } from '@ngrx/store';
import { ITaskItem, TItemListMode, TUpdateDTO } from '../../@types/types';

export const TasksActions = createActionGroup({
  source: 'Tasks',
  events: {
    // Effects only
    'Enter Page': emptyProps(),
    'Add Or Update Item': (item: ITaskItem) => ({ item }),
    'Add Item From Search': emptyProps(),

    // Operations

    'Add Item': (item: ITaskItem) => ({ item }),
    'Add Item Failure': (item: ITaskItem) => ({ item }),

    'Remove Item': (item: ITaskItem) => ({ item }),
    'Update Item': (item: TUpdateDTO<ITaskItem>) => ({ item }),
    'Update Search': (searchQuery?: string) => ({ searchQuery }),
    'Update Filter': (filterBy?: string) => ({ filterBy }),
    'Update Mode': (mode?: TItemListMode) => ({ mode }),
    'Update Sort': (
      sortBy?: 'name' | 'prio' | 'dueAt' | string,
      sortDir?: 'asc' | 'desc' | 'keep' | 'toggle'
    ) => ({ sortBy, sortDir }),
  },
});
