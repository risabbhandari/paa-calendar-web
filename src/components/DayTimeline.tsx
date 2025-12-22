import { useState } from "react";
import type { ADDate } from "../core/types";
import type { CalendarItem } from "../core/calendar-item";
import { loadCalendarItems, updateCalendarItem } from "../store/calendarStore";

type Props = {
  selectedAD: ADDate;
  onRequestCreateEvent: (args: { ad: ADDate; startHour: number }) => void;
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

// snap to 30-minute increments
function snapMinutes(minutes: number) {
  return Math.round(minutes / 30) * 30;
}

type Interaction =
  | {
      type: "move";
      id: string;
      startMinutes: number;
      duration: number;
      prevY: number;
    }
  | {
      type: "resize";
      id: string;
      startMinutes: number;
      duration: number;
      prevY: number;
    };

export default function DayTimeline({
  selectedAD,
  onRequestCreateEvent,
  onRequestEditEvent,
}: Props) {
  const items = loadCalendarItems().filter(
    (item) => !item.allDay && isSameDay(selectedAD, item.startAD)
  );

  const [interaction, setInteraction] = useState<Interaction | null>(null);

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
      <h2 style={{ marginTop: 0 }}>
        {selectedAD.day}/{selectedAD.month}/{selectedAD.year}
      </h2>

      <div
        style={{
          position: "relative",
          flex: 1,
          overflowY: "auto",
        }}
        onMouseMove={(e) => {
          if (!interaction) return;

          const deltaY = e.clientY - interaction.prevY;
          const deltaMinutes = snapMinutes(deltaY);
          if (deltaMinutes === 0) return;

          setInteraction((prev) => {
            if (!prev) return null;

            if (prev.type === "move") {
              return {
                ...prev,
                startMinutes: Math.max(
                  0,
                  Math.min(1440 - prev.duration, prev.startMinutes + deltaMinutes)
                ),
                prevY: e.clientY,
              };
            }

            return {
              ...prev,
              duration: Math.max(30, prev.duration + deltaMinutes),
              prevY: e.clientY,
            };
          });
        }}
        onMouseUp={() => {
          if (!interaction) return;

          const start = new Date(
            selectedAD.year,
            selectedAD.month - 1,
            selectedAD.day,
            0,
            interaction.startMinutes
          );

          const end = new Date(start);
          end.setMinutes(end.getMinutes() + interaction.duration);

          updateCalendarItem(interaction.id, {
            startAD: start.toISOString(),
            endAD: end.toISOString(),
          });

          setInteraction(null);
        }}
        onMouseLeave={() => setInteraction(null)}
      >
        {/* Hour grid (hover highlight restored) */}
        {Array.from({ length: 24 }).map((_, hour) => (
          <div
            key={hour}
            onClick={() =>
              onRequestCreateEvent({ ad: selectedAD, startHour: hour })
            }
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(100,150,255,0.08)";
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
            <div
              style={{
                width: 60,
                fontSize: 12,
                opacity: 0.6,
                paddingTop: 4,
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
          </div>
        ))}

        {/* Events */}
        <div style={{ pointerEvents: "none" }}>
          {items.map((item) => {
            const start = new Date(item.startAD);
            const end = new Date(item.endAD!);

            const startMinutes = start.getHours() * 60 + start.getMinutes();
            const endMinutes = end.getHours() * 60 + end.getMinutes();

            const active = interaction?.id === item.id;

            const top =
              ((active ? interaction.startMinutes : startMinutes) / 60) * 60;

            const height =
              ((active
                ? interaction.duration
                : endMinutes - startMinutes) /
                60) *
              60;

            return (
              <div
                key={item.id}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setInteraction({
                    type: "move",
                    id: item.id,
                    startMinutes,
                    duration: endMinutes - startMinutes,
                    prevY: e.clientY,
                  });
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!interaction) onRequestEditEvent(item);
                }}
                style={{
                  pointerEvents: "auto",
                  position: "absolute",
                  left: 60,
                  right: 8,
                  top,
                  height: Math.max(30, height),
                  background: "rgba(26,115,232,0.35)",
                  borderRadius: 8,
                  padding: 6,
                  cursor: active ? "grabbing" : "grab",
                  userSelect: "none",
                }}
              >
                {item.title}

                {/* Resize handle */}
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setInteraction({
                      type: "resize",
                      id: item.id,
                      startMinutes,
                      duration: endMinutes - startMinutes,
                      prevY: e.clientY,
                    });
                  }}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 6,
                    cursor: "ns-resize",
                    background: "rgba(0,0,0,0.25)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
