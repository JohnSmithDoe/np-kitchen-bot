import * as dayjs from 'dayjs';
import { IBaseItem, IGlobalItem, ILocalItem, TTimestamp } from './@types/types';
import { uuidv4 } from './app.utils';

export function createBaseItem(
  name: string,
  category?: string | string[]
): IBaseItem {
  return {
    id: uuidv4(),
    name,
    category: category
      ? Array.isArray(category)
        ? category
        : [category]
      : undefined,
    createdAt: dayjs().format(),
  };
}

export function createLocalItem(
  name: string,
  category?: string | string[],
  quantity = 0,
  bestBefore?: TTimestamp
): ILocalItem {
  const base = createBaseItem(name, category);
  return { ...base, quantity, bestBefore };
}
export function createLocalItemFrom(
  global: IGlobalItem,
  quantity = 0
): ILocalItem {
  let bestBefore: string | undefined;
  if (global.bestBeforeTimespan !== 'forever') {
    bestBefore = dayjs()
      .add(global.bestBeforeTimevalue ?? 1, global.bestBeforeTimespan)
      .format();
  }
  return createLocalItem(global.name, global.category, quantity, bestBefore);
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
