import { inject, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Store } from '@ngrx/store';
import { IDatastore, IItemList } from '../@types/types';

export const CSTORAGE_KEY = 'np-kitchen-helper';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  readonly #storageService = inject(Storage);
  readonly store = inject(Store);

  async create() {
    await this.#storageService.create();
    const initialData: IDatastore = {
      globals: await this.#loadAs('globals'),
      storage: await this.#loadAs('storage'),
      shopping: await this.#loadAs('shopping'),
      settings: await this.#loadAs('settings'),
    };
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
