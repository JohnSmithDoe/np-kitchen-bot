export type NPIonDragEvent = CustomEvent<{amount: number, ratio: number}>

export type NPTimestamp = string;
// Todo
export interface StorageLocation {}
export interface StorageCategory { name: string; items: StorageItem[] }
export interface StorageUnit {}
export interface Recipe {}

// Orangensaft
// Einheit: milliliter
// Packung: Flasche
// Packungsinhalt: 1000ml

// Spaghetti
// Einheit: gramm
// Packung: Päckchen
// Packungsinhalt: 500g

export type TItemUnit = 'ml' | 'g' | 'pieces';
export type TPackagingUnit = 'bottle' | 'package' | 'loose' | 'tin-can';

//
export interface StorageItem {
  id: string;
  name: string;
  quantity: number;

  unit: TItemUnit

  packaging: TPackagingUnit;
  packagingWeight?: number;

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

