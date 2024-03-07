import { createActionGroup } from '@ngrx/store';
import { ISettings } from '../../@types/types';

export const SettingsActions = createActionGroup({
  source: 'Settings',
  events: {
    'Update Settings': (settings: ISettings) => ({ settings }),
  },
});
