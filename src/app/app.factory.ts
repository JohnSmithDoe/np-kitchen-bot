import * as dayjs from 'dayjs';
import { IGlobalItem, ILocalItem } from './@types/types';
import { uuidv4 } from './app.utils';

export function createLocalItem(
  name: string,
  category?: string,
  quantity = 0
): ILocalItem {
  return {
    id: uuidv4(),
    name,
    quantity,
    category: category ? [category] : undefined,
    unit: 'pieces',
    packaging: 'loose',
    createdAt: dayjs().format(),
  };
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
  return {
    id: uuidv4(),
    name: global.name,
    quantity,
    category: global.category,
    unit: global.unit,
    packaging: global.packaging,
    createdAt: dayjs().format(),
    bestBefore,
  };
}

export function createGlobalItem(
  name: string,
  category?: string | string[],
  quantity = 0
): IGlobalItem {
  return {
    id: uuidv4(),
    name,
    quantity,
    category: category
      ? Array.isArray(category)
        ? category
        : [category]
      : undefined,
    unit: 'pieces',
    packaging: 'loose',
    bestBeforeTimespan: 'forever',
    bestBeforeTimevalue: 1,
    createdAt: dayjs().format(),
  };
}

export function createGlobalItemFrom(item: ILocalItem): IGlobalItem {
  return createGlobalItem(item.name, item.category);
}
