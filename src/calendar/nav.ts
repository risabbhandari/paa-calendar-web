import { adToBs } from "../core/ad-to-bs";
import type { ADDate } from "../core/types";

function toDate(ad: ADDate): Date {
  return new Date(ad.year, ad.month - 1, ad.day);
}

function fromDate(d: Date): ADDate {
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
  };
}

export function snapToBSMonthStart(ad: ADDate): ADDate {
  const d = toDate(ad);

  for (let i = 0; i < 40; i++) {
    const bs = adToBs(fromDate(d));
    if (bs.day === 1) return fromDate(d);
    d.setDate(d.getDate() - 1);
  }

  throw new Error("Could not snap to BS month start");
}

export function shiftDays(ad: ADDate, deltaDays: number): ADDate {
  const d = toDate(ad);
  d.setDate(d.getDate() + deltaDays);
  return fromDate(d);
}
