import { useMemo, useState } from "react";
import type { ADDate } from "./core/types";
import { getBSMonthFromAD } from "./calendar/calendarData";
import { getBSMonthLength } from "./calendar/bsMonth";
import { shiftDays, snapToBSMonthStart } from "./calendar/nav";
import { getItemsForADDate } from "./store/calendarStore";
import DayTimeline from "./components/DayTimeline";
import EventFormModal from "./components/EventFormModal";
import type { CalendarItem } from "./core/calendar-item";

const todayDate = new Date();
const todayAD: ADDate = {
  year: todayDate.getFullYear(),
  month: todayDate.getMonth() + 1,
  day: todayDate.getDate(),
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function App() {
  const [startAD, setStartAD] = useState<ADDate>(todayAD);
  const [selectedAD, setSelectedAD] = useState<ADDate>(todayAD);

  // create-event context
  const [createContext, setCreateContext] = useState<{
    ad: ADDate;
    startHour: number;
  } | null>(null);

  // edit-event context
  const [editEvent, setEditEvent] = useState<CalendarItem | null>(null);

  const data = useMemo(() => getBSMonthFromAD(startAD), [startAD]);

  function goNextMonth() {
    setStartAD((prev) => {
      const len = getBSMonthLength(prev);
      return shiftDays(prev, len);
    });
  }

  function goPrevMonth() {
    setStartAD((prev) => {
      const backOne = shiftDays(prev, -1);
      return snapToBSMonthStart(backOne);
    });
  }

  function isToday(ad: ADDate) {
    return (
      ad.year === todayAD.year &&
      ad.month === todayAD.month &&
      ad.day === todayAD.day
    );
  }

  function isSelected(ad: ADDate) {
    return (
      ad.year === selectedAD.year &&
      ad.month === selectedAD.month &&
      ad.day === selectedAD.day
    );
  }

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "420px 1fr",
          height: "100vh",
          padding: 24,
          gap: 32,
          boxSizing: "border-box",
          overflow: "hidden",
          fontFamily: "system-ui",
        }}
      >
        {/* LEFT: MONTH VIEW */}
        <div style={{ overflow: "hidden" }}>
          <h1 style={{ margin: 0, marginBottom: 12 }}>Paa Calendar</h1>

          {/* Navigation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <button onClick={goPrevMonth}>←</button>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>
                {data.monthName} {data.year}
              </div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                Starts on {weekDays[data.startWeekday]}
              </div>
            </div>

            <button onClick={goNextMonth}>→</button>
          </div>

          {/* Weekdays */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              textAlign: "center",
              fontWeight: 600,
              marginBottom: 8,
              opacity: 0.9,
            }}
          >
            {weekDays.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gridAutoRows: "1fr",
              gap: 8,
            }}
          >
            {data.cells.map((cell, i) => (
              <div
                key={i}
                onClick={() => setSelectedAD(cell.ad)}
                style={{
                  border: isSelected(cell.ad)
                    ? "2px solid #1a73e8"
                    : isToday(cell.ad)
                    ? "2px solid #1a73e8"
                    : "1px solid #3a3a3a",
                  borderRadius: 10,
                  minHeight: 60,
                  padding: 10,
                  opacity: cell.inCurrentMonth ? 1 : 0.45,
                  background: isToday(cell.ad)
                    ? "rgba(26,115,232,0.15)"
                    : "transparent",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 800 }}>{cell.bsDay}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {cell.ad.day}/{cell.ad.month}
                </div>

                {(() => {
                  const items = getItemsForADDate(cell.ad);
                  const visible = items.slice(0, 2);
                  const remaining = items.length - visible.length;

                  return (
                    <>
                      {visible.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            fontSize: 11,
                            padding: "2px 4px",
                            borderRadius: 6,
                            background: "rgba(26,115,232,0.25)",
                            marginTop: 4,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.title}
                        </div>
                      ))}

                      {remaining > 0 && (
                        <div
                          style={{
                            fontSize: 11,
                            marginTop: 4,
                            opacity: 0.7,
                          }}
                        >
                          +{remaining} more
                        </div>
                      )}
                    </>
                  );
                })()}

              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: DAY TIMELINE */}
        <DayTimeline
          selectedAD={selectedAD}
          onRequestCreateEvent={(ctx) => setCreateContext(ctx)}
          onRequestEditEvent={(event) => setEditEvent(event)}
        />
      </div>

      {/* CREATE EVENT MODAL */}
      {createContext && (
        <EventFormModal
          mode="create"
          ad={createContext.ad}
          startHour={createContext.startHour}
          onClose={() => setCreateContext(null)}
        />
      )}

      {/* EDIT EVENT MODAL */}
      {editEvent && (
        <EventFormModal
          mode="edit"
          ad={{
            year: new Date(editEvent.startAD).getFullYear(),
            month: new Date(editEvent.startAD).getMonth() + 1,
            day: new Date(editEvent.startAD).getDate(),
          }}
          event={editEvent}
          onClose={() => setEditEvent(null)}
        />
      )}
    </>
  );
}
