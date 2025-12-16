import { useMemo, useState } from "react";
import type { ADDate } from "./core/types";
import { getBSMonthFromAD } from "./calendar/calendarData";
import { getBSMonthLength } from "./calendar/bsMonth";
import { shiftDays, snapToBSMonthStart } from "./calendar/nav";
import { getItemsForADDate } from "./store/calendarStore";
import DayTimeline from "./components/DayTimeline";
import { useEffect } from "react";
import { addCalendarItem } from "./store/calendarStore";



const todayDate = new Date();
const todayAD: ADDate = {
  year: todayDate.getFullYear(),
  month: todayDate.getMonth() + 1,
  day: todayDate.getDate(),
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function App() {

  // BS month anchor (AD date of BS day 1)
  const [startAD, setStartAD] = useState<ADDate>(todayAD);

  // Selected day for timeline
  const [selectedAD, setSelectedAD] = useState<ADDate>(todayAD);

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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "420px 1fr",
        gap: 32,
        padding: 24,
        fontFamily: "system-ui",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      {/* LEFT: MONTH VIEW */}
      <div>
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
          <button onClick={goPrevMonth} style={navButtonStyle}>
            ←
          </button>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>
              {data.monthName} {data.year}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              Starts on {weekDays[data.startWeekday]}
            </div>
          </div>

          <button onClick={goNextMonth} style={navButtonStyle}>
            →
          </button>
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
                height: 72,
                padding: 10,
                opacity: cell.inCurrentMonth ? 1 : 0.45,
                background: isToday(cell.ad)
                  ? "rgba(26,115,232,0.15)"
                  : "transparent",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              {/* BS day */}
              <div style={{ fontWeight: 800, fontSize: 16 }}>
                {cell.bsDay}
              </div>

              {/* AD date */}
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                {cell.ad.day}/{cell.ad.month}
              </div>

              {/* EVENTS */}
              <div style={{ marginTop: 6 }}>
                {getItemsForADDate(cell.ad).map((item) => (
                  <div
                    key={item.id}
                    style={{
                      fontSize: 11,
                      padding: "2px 4px",
                      borderRadius: 6,
                      background: "rgba(26,115,232,0.25)",
                      marginBottom: 2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: DAY TIMELINE */}
      <DayTimeline selectedAD={selectedAD} />
    </div>
  );
}

const navButtonStyle = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #333",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
};

export default App;
