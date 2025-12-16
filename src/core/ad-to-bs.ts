import type { ADDate, BSDate } from "./types";
import { BS_MONTH_DATA, BS_MONTH_NAMES } from "./bs-data";



// Reference: 2024-04-13 AD = 2081-01-01 BS
const REF_AD: ADDate = { year: 2024, month: 4, day: 13 };
const REF_BS: BSDate = {
  year: 2081,
  month: 1,
  day: 1,
  monthName: BS_MONTH_NAMES[0],
};

function daysBetween(a: ADDate, b: ADDate): number {
  const d1 = new Date(a.year, a.month - 1, a.day);
  const d2 = new Date(b.year, b.month - 1, b.day);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((d2.getTime() - d1.getTime()) / msPerDay);
}

export function adToBs(ad: ADDate): BSDate {
  let offset = daysBetween(REF_AD, ad);

  let year = REF_BS.year;
  let month = REF_BS.month;
  let day = REF_BS.day;

  while (offset > 0) {
    const monthLengths = BS_MONTH_DATA[year];
    if (!monthLengths) {
      throw new Error(`BS data missing for year ${year}`);
    }

    day++;
    if (day > monthLengths[month - 1]) {
      day = 1;
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }
    offset--;
  }

  return {
    year,
    month,
    day,
    monthName: BS_MONTH_NAMES[month - 1],
  };
}
