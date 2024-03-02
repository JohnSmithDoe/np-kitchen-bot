import { Color } from '@ionic/core/dist/types/interface';

export type TIonDragEvent = CustomEvent<{ amount: number; ratio: number }>;

export type TColor =
  | Color
  | 'global'
  | 'local'
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
  quantity: number;
  minAmount?: number;

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

export interface ILocalItem extends IBaseItem {
  state?: 'bought';
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
  storage: IItemList<ILocalItem> & {
    id: '_storage';
    title: 'Storage';
  };
  shoppinglists: IItemList<ILocalItem>[];
}
