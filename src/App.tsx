import { useMemo, useState } from "react";
import type { ADDate } from "./core/types";
import { getBSMonthFromAD } from "./calendar/calendarData";
import { getBSMonthLength } from "./calendar/bsMonth";
import { shiftDays, snapToBSMonthStart } from "./calendar/nav";
import { getItemsForADDate } from "./store/calendarStore";


const todayDate = new Date();
const todayAD = {
  year: todayDate.getFullYear(),
  month: todayDate.getMonth() + 1,
  day: todayDate.getDate(),
};


const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function App() {



  // This must always represent the AD date corresponding to BS day 1 of the current BS month
  
  const today = new Date();

const [startAD, setStartAD] = useState<ADDate>({
  year: today.getFullYear(),
  month: today.getMonth() + 1,
  day: today.getDate(),
});


  const data = useMemo(() => getBSMonthFromAD(startAD), [startAD]);

  function goNextMonth() {
    setStartAD((prev) => {
      const len = getBSMonthLength(prev); // exact BS month length
      return shiftDays(prev, len); // next BS month start in AD
    });
  }

  function goPrevMonth() {
    setStartAD((prev) => {
      // Step back one day, then snap backwards to the previous BS month start (BS day 1)
      const backOne = shiftDays(prev, -1);
      return snapToBSMonthStart(backOne);
    });
  }

  function isToday(ad: { year: number; month: number; day: number }) {
  return (
    ad.year === todayAD.year &&
    ad.month === todayAD.month &&
    ad.day === todayAD.day
  );

  
}


  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 520 }}>
      <h1 style={{ margin: 0, marginBottom: 12 }}>Paa Calendar</h1>

      {/* Navigation header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <button
          onClick={goPrevMonth}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #333",
            background: "transparent",
            color: "inherit",
            cursor: "pointer",
          }}
        >
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

        <button
          onClick={goNextMonth}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #333",
            background: "transparent",
            color: "inherit",
            cursor: "pointer",
          }}
        >
          →
        </button>
      </div>

      {/* Weekday header */}
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
    style={{
      border: isToday(cell.ad)
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
  );

}

export default App;
