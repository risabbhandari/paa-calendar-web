import { adToBs } from "../core/ad-to-bs";
import { BS_MONTH_DATA } from "../core/bs-data";
import type { ADDate } from "../core/types";
import { shiftDays, snapToBSMonthStart } from "./nav";

export type MonthCell = {
  bsDay: number;
  ad: ADDate;
  inCurrentMonth: boolean;
};

function getBSMonthLength(startAD: ADDate): number {
  const bs = adToBs(startAD);
  const months = BS_MONTH_DATA[bs.year];
  if (!months) throw new Error(`Missing BS data for year ${bs.year}`);
  return months[bs.month - 1];
}

export function getBSMonthFromAD(startAD: ADDate) {
  // Ensure startAD is BS day 1
  const start = snapToBSMonthStart(startAD);

  const startDate = new Date(start.year, start.month - 1, start.day);
  const startWeekday = startDate.getDay();

  const monthLength = getBSMonthLength(start);
  const prevStart = snapToBSMonthStart(shiftDays(start, -1));
  const prevMonthLength = getBSMonthLength(prevStart);

  const firstBS = adToBs(start);

  // Build 42 cells (6 weeks)
  const cells: MonthCell[] = [];
  for (let i = 0; i < 42; i++) {
    const offset = i - startWeekday; // days relative to month start
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + offset);

    const ad: ADDate = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    };

    let bsDay: number;
    let inCurrentMonth: boolean;

    if (offset < 0) {
      // previous month tail
      bsDay = prevMonthLength + offset + 1;
      inCurrentMonth = false;
    } else if (offset >= monthLength) {
      // next month head
      bsDay = offset - monthLength + 1;
      inCurrentMonth = false;
    } else {
      // current month
      bsDay = offset + 1;
      inCurrentMonth = true;
    }

    cells.push({ bsDay, ad, inCurrentMonth });
  }

  return {
    monthName: firstBS.monthName,
    year: firstBS.year,
    startWeekday,
    monthLength,
    cells,
  };
}
