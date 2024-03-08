import * as dayjs from 'dayjs';
import {
  IBaseItem,
  IGlobalItem,
  IShoppingItem,
  IStorageItem,
  TTimestamp,
} from './@types/types';
import { uuidv4 } from './app.utils';

export function createBaseItem(
  name: string,
  category?: string | string[]
): IBaseItem {
  return {
    id: uuidv4(),
    name: name.trim(),
    category: category
      ? Array.isArray(category)
        ? category
        : [category]
      : undefined,
    createdAt: dayjs().format(),
  };
}

export function createStorageItem(
  name: string,
  category?: string | string[],
  quantity = 1,
  bestBefore?: TTimestamp
): IStorageItem {
  const base = createBaseItem(name, category);
  return { ...base, quantity, bestBefore };
}
export function createStorageItemFromGlobal(
  global: IGlobalItem,
  quantity = 1
): IStorageItem {
  let bestBefore: string | undefined;
  if (global.bestBeforeTimespan !== 'forever') {
    bestBefore = dayjs()
      .add(global.bestBeforeTimevalue ?? 1, global.bestBeforeTimespan)
      .format();
  }
  return createStorageItem(global.name, global.category, quantity, bestBefore);
}
export function createShoppingItemFromGlobal(
  global: IGlobalItem,
  quantity = 1
): IShoppingItem {
  return createShoppingItem(global.name, global.category, quantity);
}
export function createShoppingItemFromStorage(
  storage: IStorageItem,
  quantity = 1
): IShoppingItem {
  return createShoppingItem(storage.name, storage.category, quantity);
}
export function createShoppingItem(
  name: string,
  category?: string | string[],
  quantity = 1
): IShoppingItem {
  const base = createBaseItem(name, category);
  return {
    ...base,
    quantity,
    state: 'active',
  };
}
export function createGlobalItem(
  name: string,
  category?: string | string[]
): IGlobalItem {
  const base = createBaseItem(name, category);
  return {
    ...base,
    unit: 'pieces',
    packaging: 'loose',
    bestBeforeTimespan: 'forever',
    bestBeforeTimevalue: 1,
  };
}

export function createGlobalItemFrom(item: IBaseItem): IGlobalItem {
  return createGlobalItem(item.name, item.category);
}
