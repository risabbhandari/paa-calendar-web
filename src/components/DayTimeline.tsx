import type { ADDate } from "../core/types";

type Props = {
  selectedAD: ADDate;
};

export default function DayTimeline({ selectedAD }: Props) {
  return (
    <div
      style={{
        borderLeft: "1px solid #333",
        paddingLeft: 24,
        height: "100%",
        overflowY: "auto",
      }}
    >
      <h2 style={{ marginTop: 0 }}>
        {selectedAD.day}/{selectedAD.month}/{selectedAD.year}
      </h2>

      {Array.from({ length: 24 }).map((_, hour) => (
        <div
          key={hour}
          style={{
            display: "flex",
            alignItems: "flex-start",
            height: 60,
            borderTop: "1px solid #2a2a2a",
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

          <div style={{ flex: 1 }} />
        </div>
      ))}
    </div>
  );
}
