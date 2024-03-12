import { createReducer, on } from '@ngrx/store';
import { ISettings } from '../../@types/types';
import { ApplicationActions } from '../application.actions';
import { SettingsActions } from './settings.actions';
//TODO: all false for release..
export const initialSettings: ISettings = {
  showQuickAdd: true,
  showQuickAddGlobal: true,
  showGlobalsInShopping: true,
  showGlobalsInStorage: true,
  showShoppingInGlobals: true,
  showShoppingInStorage: true,
  showStorageInGlobals: true,
  showStorageInShopping: true,
};

export const settingsReducer = createReducer(
  initialSettings,
  on(SettingsActions.updateSettings, (_state, { settings }) => {
    console.log('Update Settings', settings);
    return settings;
  }),
  on(ApplicationActions.loadedSuccessfully, (_state, { datastore }) => {
    console.log('Load Settings', datastore);
    return datastore.settings ?? _state;
  })
);
