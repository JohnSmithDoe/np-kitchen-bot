import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage-angular";
import {StorageItem} from "../@types/types";

interface NPDatabase {
  items: StorageItem[];
  storage: StorageItem[];
  shoppinglist: StorageItem[];
  categories: { name: string; items: StorageItem[] }[]
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  static readonly CNP_STORAGE_KEY = 'np-kitchen-helper';
  #store: NPDatabase = {
    items: [],
    storage: [],
    shoppinglist: [],
    categories: []
  }

  constructor(private storageService: Storage) {

  }

  async initialize() {
    await this.storageService.create();
    this.#store = await this.storageService.get(DatabaseService.CNP_STORAGE_KEY);
    console.log('jo ho');
  }

  get items() {
    return this.#store.items;
  }

  get storage() {
    return this.#store.storage;
  }

  get shoppinglist() {
    return this.#store.shoppinglist;
  }

  get categories() {
    return this.#store.categories;
  }
}
