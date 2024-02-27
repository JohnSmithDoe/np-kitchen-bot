import { inject, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Datastore, StorageItem, StorageItemList } from '../@types/types';
import { uuidv4 } from '../utils';

const INITIAL_DATA: StorageItem[] = [
  {
    id: '1',
    quantity: 0,
    name: 'Apfel',
    category: ['Obst'],
    unit: 'pieces',
    packaging: 'loose',
  },
  {
    id: '2',
    quantity: 0,
    name: 'Banane',
    category: ['Obst'],
    unit: 'pieces',
    packaging: 'loose',
  },
  {
    id: '3',
    quantity: 0,
    name: 'Karotte',
    category: ['Gemüse'],
    unit: 'pieces',
    packaging: 'loose',
  },
  {
    id: '4',
    quantity: 0,
    name: 'Eier',
    category: ['Protein'],
    unit: 'pieces',
    packaging: 'loose',
  },
  {
    id: '5',
    quantity: 0,
    name: 'Milch',
    category: ['Milchprodukte'],
    unit: 'ml',
    packaging: 'bottle',
    packagingWeight: 1000,
  },
  {
    id: '6',
    quantity: 0,
    name: 'Brot',
    category: ['Getreideprodukte'],
    unit: 'pieces',
    packaging: 'loose',
  },
  {
    id: '8',
    quantity: 0,
    name: 'Rahmspinat',
    category: ['Gemüse'],
    unit: 'g',
    packaging: 'package',
    packagingWeight: 750,
  },
  // {id: '10', quantity: 0, name: "Joghurt", category: ["Milchprodukte"]},
  // {id: '11', quantity: 0, name: "Reis", category: ["Getreideprodukte"]},
  // {id: '12', quantity: 0, name: "Tomate", category: ["Gemüse"]},
  // {id: '14', quantity: 0, name: "Käse", category: ["Milchprodukte"]},
  // {id: '15', quantity: 0, name: "Haferflocken", category: ["Getreideprodukte"]},
  {
    id: '16',
    quantity: 0,
    name: 'Thunfisch',
    category: ['Fisch'],
    unit: 'g',
    packaging: 'tin-can',
    packagingWeight: 220,
  },
  // {id: '17', quantity: 0, name: "Brokkoli", category: ["Gemüse"]},
  // {id: '19', quantity: 0, name: "Quark", category: ["Milchprodukte"]},
  // {id: '20', quantity: 0, name: "Nudeln", category: ["Getreideprodukte"]},
  // {id: '22', quantity: 0, name: "Paprika", category: ["Gemüse"]},
  // {id: '24', quantity: 0, name: "Butter", category: ["Milchprodukte"]},
  // {id: '25', quantity: 0, name: "Müsli", category: ["Getreideprodukte"]},
  // {id: '27', quantity: 0, name: "Zucchini", category: ["Gemüse"]},
  // {id: '29', quantity: 0, name: "Milchreis", category: ["Milchprodukte"]},
];

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  static readonly CNP_STORAGE_KEY = 'np-kitchen-helper';

  static createStorageItem(
    name: string,
    category?: string,
    quantity = 0
  ): StorageItem {
    return {
      id: uuidv4(),
      name,
      quantity,
      category: category ? [category] : undefined,
      unit: 'pieces',
      packaging: 'loose',
    };
  }

  readonly #storageService = inject(Storage);

  #store: Datastore = {
    all: { title: 'All Items', id: '_all', items: [] },
    storage: { title: 'Inventory', id: '_storage', items: [] },
    shoppinglists: [],
    categories: [],
  };

  async initialize() {
    await this.#storageService.create();
    const stored = await this.#storageService.get(
      DatabaseService.CNP_STORAGE_KEY
    );
    if (stored) this.#store = stored;
    if (!stored) {
      this.all.items = INITIAL_DATA;
      this.all.items = [];
      this.updateDatabase();
    }
  }

  async save() {
    this.updateDatabase();
    await this.#storageService.set(
      DatabaseService.CNP_STORAGE_KEY,
      this.#store
    );
  }

  private updateDatabase() {
    // reset item references
    this.categories.forEach((cat) => (cat.items = []));
    // add all categories from all and link the items
    this.all.items.forEach((item) => {
      item.category?.forEach((category) => {
        let cat = this.categories.find(
          (aCategory) => category === aCategory.name
        );
        if (!cat && item.category) {
          cat = { items: [item], name: category };
          this.categories.push(cat);
        } else {
          cat?.items.push(item);
        }
      });
    });
  }

  get all() {
    return this.#store.all;
  }

  get storage() {
    return this.#store.storage;
  }

  shoppinglist(id = 'default') {
    let list = this.#store.shoppinglists.find((list) => list.id === id);
    if (!list) {
      list = {
        id,
        items: [],
        title: '',
      };
      this.#store.shoppinglists.push(list);
    }
    return list;
  }
  get categories() {
    return this.#store.categories;
  }

  async addItem(item: StorageItem | undefined, list: StorageItemList) {
    let result = item;
    if (item) {
      // check duplicates
      result = list.items.find((aItem) => aItem.id === item.id);
      if (result) {
        result.quantity++;
      } else {
        item.quantity = 1;
        result = { ...item };
        list.items.push(result);
      }
      await this.save();
    }
    return result;
  }

  async deleteItem(item: StorageItem, list: StorageItemList) {
    list.items.splice(
      list.items.findIndex((aItem) => aItem.id === item.id),
      1
    );
    return this.save();
  }

  async reorder(list: StorageItemList, from: number, to: number) {
    const item = list.items.splice(from, 1);
    list.items.splice(to, 0, ...item);
    return this.save();
  }

  async addOrUpdateItem(item: StorageItem) {
    const gItemIdx = this.#store.all.items.findIndex(
      (aItem) => aItem.id === item.id
    );
    // remove old if it exists and update copies
    if (gItemIdx >= 0) {
      this.#store.all.items.splice(gItemIdx, 1, item);
      this.#updateItem(item, this.#store.storage);
      this.#store.shoppinglists.forEach((list) => this.#updateItem(item, list));
    } else {
      this.#store.all.items.push(item);
    }
    return this.save();
  }

  #updateItem(item: StorageItem, list: StorageItemList) {
    const value = list.items.find((listItem) => listItem.id === item.id);
    if (value) {
      value.name = item.name;
      value.category = item.category;
    }
  }

  cloneStorageItem(item: StorageItem): StorageItem {
    return {
      ...item,
      category: item.category ? [...item.category] : undefined,
    };
  }
}
