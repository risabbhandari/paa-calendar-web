export type CalendarItemType = "event" | "task" | "reminder";

export type CalendarItem = {
  id: string;
  title: string;
  startAD: string;
  endAD?: string;
  allDay: boolean;
  type: "event";
  createdAt: string;

  // ✅ NEW (optional, safe)
  location?: string;
  description?: string;
};

