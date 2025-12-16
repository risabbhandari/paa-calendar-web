export type CalendarItemType = "event" | "task" | "reminder";

export type CalendarItem = {
  id: string;

  title: string;
  description?: string;

  // AD is the source of truth
  startAD: string; // ISO string
  endAD?: string;  // ISO string

  allDay: boolean;

  type: CalendarItemType;

  createdAt: string;
};
