import type { CalendarItem } from "../core/calendar-item";

const STORAGE_KEY = "paa-calendar-items";

export function loadCalendarItems(): CalendarItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

export function saveCalendarItems(items: CalendarItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addCalendarItem(item: CalendarItem) {
  const items = loadCalendarItems();
  items.push(item);
  saveCalendarItems(items);
}

/**
 * 🔥 NEW: update an existing calendar item
 */
export function updateCalendarItem(
  id: string,
  updates: Partial<CalendarItem>
) {
  const items = loadCalendarItems();

  const updatedItems = items.map((item) =>
    item.id === id ? { ...item, ...updates } : item
  );

  saveCalendarItems(updatedItems);
}

export function deleteCalendarItem(id: string) {
  const items = loadCalendarItems();
  const filtered = items.filter((item) => item.id !== id);
  saveCalendarItems(filtered);
}

export function getItemsForADDate(ad: {
  year: number;
  month: number;
  day: number;
}) {
  const items = loadCalendarItems();

  return items.filter((item) => {
    const d = new Date(item.startAD);
    return (
      d.getFullYear() === ad.year &&
      d.getMonth() + 1 === ad.month &&
      d.getDate() === ad.day
    );
  });
}
