import { Color } from '@ionic/core/dist/types/interface';

export type TIonDragEvent = CustomEvent<{ amount: number; ratio: number }>;

export type TColor =
  | Color
  | 'global'
  | 'category'
  | 'storage'
  | 'shopping'
  | 'low-stock-warn'
  | 'low-stock';

export type TTimestamp = string;
// Todo
export interface IItemLocation {}
export interface IItemCategory {
  name: string;
  items: IBaseItem[];
}

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
export type TBestBeforeTimespan =
  | 'forever'
  | 'days'
  | 'weeks'
  | 'months'
  | 'years';

//
export interface IBaseItem {
  id: string;
  name: string;
  createdAt: TTimestamp;

  category?: string[];

  price?: number;
  desc?: string;
  location?: string;
}

export interface IGlobalItem extends IBaseItem {
  unit: TItemUnit;
  packaging: TPackagingUnit;
  packagingWeight?: number;

  bestBeforeTimespan: TBestBeforeTimespan;
  bestBeforeTimevalue?: number;
}

export interface IShoppingItem extends IBaseItem {
  quantity: number;
  state: 'bought' | 'active';
}

export interface IStorageItem extends IBaseItem {
  quantity: number;
  minAmount?: number;
  bestBefore?: TTimestamp;
}

export interface IItemList<T extends IBaseItem = IBaseItem> {
  id: string;
  title: string;
  items: T[];
}

export interface IDatastore {
  all: IItemList<IGlobalItem> & {
    id: '_all';
    title: 'All Items';
  };
  storage: IItemList<IStorageItem> & {
    id: '_storage';
    title: 'Storage';
  };
  shoppinglists: IItemList<IShoppingItem>[];
}
