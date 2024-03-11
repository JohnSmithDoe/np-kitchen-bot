import { createReducer, on } from '@ngrx/store';
import { IQuickAddState } from '../../@types/types';
import { QuickAddActions } from './quick-add.actions';

export const initialSettings: IQuickAddState = {
  exactMatchGlobal: false,
  exactMatchLocal: false,
  searchQuery: undefined,
};
export const quickAddReducer = createReducer(
  initialSettings,
  on(QuickAddActions.updateState, (_, { newState }): IQuickAddState => {
    return newState;
  })
);
