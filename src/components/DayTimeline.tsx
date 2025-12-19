import type { ADDate } from "../core/types";
import type { CalendarItem } from "../core/calendar-item";
import { loadCalendarItems } from "../store/calendarStore";

type Props = {
  selectedAD: ADDate;

  // request creation (hour click)
  onRequestCreateEvent: (args: {
    ad: ADDate;
    startHour: number;
  }) => void;

  // request editing (event click)
  onRequestEditEvent: (event: CalendarItem) => void;
};

function isSameDay(ad: ADDate, iso: string) {
  const d = new Date(iso);
  return (
    d.getFullYear() === ad.year &&
    d.getMonth() + 1 === ad.month &&
    d.getDate() === ad.day
  );
}

export default function DayTimeline({
  selectedAD,
  onRequestCreateEvent,
  onRequestEditEvent,
}: Props) {
  const items = loadCalendarItems().filter((item) =>
    isSameDay(selectedAD, item.startAD)
  );

  const allDay = items.filter((i) => i.allDay);
  const timed = items.filter((i) => !i.allDay);

  return (
    <div
      style={{
        borderLeft: "1px solid #333",
        paddingLeft: 24,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      {/* Header */}
      <h2 style={{ marginTop: 0 }}>
        {selectedAD.day}/{selectedAD.month}/{selectedAD.year}
      </h2>

      {/* All-day events */}
      {allDay.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          {allDay.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "6px 8px",
                background: "rgba(26,115,232,0.25)",
                borderRadius: 6,
                marginBottom: 6,
                fontSize: 13,
                cursor: "pointer",
              }}
              onClick={() => onRequestEditEvent(item)}
            >
              {item.title}
            </div>
          ))}
        </div>
      )}

      {/* Timeline */}
      <div
        style={{
          position: "relative",
          flex: 1,
          overflowY: "auto",
          width: "100%",
        }}
      >
        {/* Hour rows */}
        {Array.from({ length: 24 }).map((_, hour) => (
          <div
            key={hour}
            onClick={() =>
              onRequestCreateEvent({
                ad: selectedAD,
                startHour: hour,
              })
            }
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "rgba(100,150,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            style={{
              display: "flex",
              height: 60,
              borderTop: "1px solid #2a2a2a",
              cursor: "pointer",
              width: "100%",
            }}
          >
            {/* Hour label */}
            <div
              style={{
                width: 60,
                fontSize: 12,
                opacity: 0.6,
                paddingTop: 4,
                flexShrink: 0,
              }}
            >
              {hour === 0
                ? "12 AM"
                : hour < 12
                ? `${hour} AM`
                : hour === 12
                ? "12 PM"
                : `${hour - 12} PM`}
            </div>

            <div style={{ flex: 1 }} />
          </div>
        ))}

        {/* Timed events */}
        <div style={{ pointerEvents: "none" }}>
          {timed.map((item) => {
            const start = new Date(item.startAD);
            const end = item.endAD ? new Date(item.endAD) : null;

            const startMinutes =
              start.getHours() * 60 + start.getMinutes();
            const endMinutes = end
              ? end.getHours() * 60 + end.getMinutes()
              : startMinutes + 60;

            const top = (startMinutes / 60) * 60;
            const height = Math.max(
              ((endMinutes - startMinutes) / 60) * 60,
              30
            );

            return (
              <div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestEditEvent(item);
                }}
                style={{
                  pointerEvents: "auto",
                  position: "absolute",
                  left: 60,
                  right: 8,
                  top,
                  height,
                  background: "rgba(26,115,232,0.35)",
                  borderRadius: 8,
                  padding: 6,
                  fontSize: 13,
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                {item.title}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
