import {
  IBaseItem,
  IItemCategory,
  IItemList,
  TIonDragEvent,
} from './@types/types';

export function uuidv4() {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) => {
    return (
      // prettier-ignore
      ( // @ts-expect-error
        c ^
        // @ts-expect-error
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  });
}

// grouping items by category
// creates a new IItemCategory array from the given list
export function getCategoriesFromList<T extends IBaseItem = IBaseItem>(
  itemList: IItemList<T>
) {
  return itemList.items.reduce((categories, item) => {
    item.category?.forEach((category) => {
      // hmm: string category on item
      const found = categories.find((cat) => cat.name === category);
      if (!found) {
        categories.push({ name: category, items: [item] });
      } else {
        found.items.push(item);
      }
    });
    return categories;
  }, [] as IItemCategory<T>[]);
}

// handle the dragging from the list items
export function checkItemOptionsOnDrag(ev: TIonDragEvent, triggerAmount = 200) {
  return ev.detail.amount > triggerAmount
    ? 'end'
    : ev.detail.amount < -triggerAmount
      ? 'start'
      : false;
}
