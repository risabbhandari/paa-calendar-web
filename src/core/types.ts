// AD = Gregorian date
export type ADDate = {
  year: number      //igger than 0
  month: number     // 1–12
  day: number       // 1–31
}

// BS = Bikram Sambat date
export type BSDate = {
  year: number
  month: number     // 1–12
  day: number
  monthName: string
  weekday?: number  // 0 (Sun) – 6 (Sat), optional for now
}
