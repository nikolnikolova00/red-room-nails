import type { GroceryCategory, GroceryItem } from '@/types/models';

export const GROCERY_CATEGORY_ORDER: GroceryCategory[] = [
  'produce',
  'dairy',
  'meat',
  'bakery',
  'pantry',
  'frozen',
  'household',
  'other',
];

export function activeGroceries(items: GroceryItem[]) {
  return items.filter((item) => !item.deletedAt);
}

export function uncheckedCount(items: GroceryItem[]) {
  return activeGroceries(items).filter((item) => !item.checked).length;
}

export function groupGroceries(items: GroceryItem[]) {
  const active = activeGroceries(items);
  const activeItems = active
    .filter((item) => !item.checked)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const categories = GROCERY_CATEGORY_ORDER.map((category) => ({
    category,
    data: activeItems.filter((item) => item.category === category),
  })).filter((section) => section.data.length > 0);

  const bought = active
    .filter((item) => item.checked)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return { categories, bought };
}
