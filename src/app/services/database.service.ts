import { inject, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Store } from '@ngrx/store';
import { IDatastore, IItemList } from '../@types/types';
import { categoriesFromList } from '../state/@shared/item-list.utils';
import { VERSION } from '../state/settings/settings.reducer';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  readonly #storageService = inject(Storage);
  readonly store = inject(Store);

  async create() {
    await this.#storageService.create();
    let initialData: IDatastore = {
      globals: await this.#loadAs('globals'),
      tasks: await this.#loadAs('tasks'),
      storage: await this.#loadAs('storage'),
      shopping: await this.#loadAs('shopping'),
      settings: await this.#loadAs('settings'),
    };
    if (
      !initialData.settings.version ||
      initialData.settings.version !== VERSION
    ) {
      if (VERSION === '1') {
        initialData = await this.#updateCategories(initialData);
        initialData.settings.version = VERSION;
        await this.save('settings', initialData.settings);
      }
    }
    initialData.settings.showQuickAddCategory = true;
    return initialData;
  }

  async #updateCategories(initialData: IDatastore) {
    if (!initialData.tasks.categories) {
      initialData.tasks.categories = categoriesFromList(
        initialData.tasks.items
      );
      await this.save('tasks', initialData.tasks);
    }
    if (!initialData.storage.categories) {
      initialData.storage.categories = categoriesFromList(
        initialData.storage.items
      );
      await this.save('storage', initialData.storage);
    }
    if (!initialData.shopping.categories) {
      initialData.shopping.categories = categoriesFromList(
        initialData.shopping.items
      );
      await this.save('shopping', initialData.shopping);
    }
    if (!initialData.globals.categories) {
      initialData.globals.categories = categoriesFromList(
        initialData.globals.items
      );
      await this.save('globals', initialData.globals);
    }
    return initialData;
  }

  async #loadAs<T extends keyof IDatastore>(key: T): Promise<IDatastore[T]> {
    return await this.#storageService.get('npkh-' + key);
  }

  async save<T extends keyof IDatastore>(key: T, value: IDatastore[T]) {
    console.log('44:save-', key, value);
    return await this.#storageService.set('npkh-' + key, value);
  }

  reorder(list: IItemList<any>, from: number, to: number) {
    const item = list.items.splice(from, 1);
    list.items.splice(to, 0, ...item);
  }
}
