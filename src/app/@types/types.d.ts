type NPTimestamp = string;
// Todo
export interface StorageLocation {}
export interface StorageCategory { name: string; items: StorageItem[] }
export interface StorageUnit {}
export interface Recipe {}
//
export interface StorageItem {
  id: string;
  name: string;
  quantity: number;
  state?: 'bought';

  category?: string[];
  price?: number;
  desc?: string;
  mdh?: NPTimestamp;
  location?: string;

}
export interface StorageItemList {
  id: string;
  title: string;
  items: StorageItem[];
}

export interface Datastore {
  all: StorageItemList & {id: '_all', title: 'All Items'};
  storage: StorageItemList & {id: '_storage', title: 'Inventory'};
  shoppinglists: StorageItemList[];
  categories: StorageCategory[]
}


export type NPIonDragEvent = CustomEvent<{amount: number, ratio: number}>

