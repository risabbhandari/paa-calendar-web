import { adToBs } from "../core/ad-to-bs";
import { BS_MONTH_DATA } from "../core/bs-data";
import type { ADDate } from "../core/types";

export function getBSMonthLength(startAD: ADDate): number {
  const bs = adToBs(startAD);
  const months = BS_MONTH_DATA[bs.year];

  if (!months) {
    throw new Error(`Missing BS data for year ${bs.year}`);
  }

  return months[bs.month - 1];
}
