import {StorageCategory, StorageItemList} from "./@types/types";

export function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => {
      // @ts-ignore
      return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
    }
  );
}

// grouping items by category
// creates a new StorageCategory array from the given list
export function getCategoriesFromList(itemList: StorageItemList) {
  return itemList.items.reduce(
    (categories, item) => {
      if (item.category) {
        // hmm: string category on item
        const found = categories.find(cat => cat.name === item.category);
        if (!found) {
          categories.push({name: item.category, items: [item]})
        }else {
          found.items.push(item);
        }
      }
      return categories;
    },
    [] as StorageCategory[]
  );
}
