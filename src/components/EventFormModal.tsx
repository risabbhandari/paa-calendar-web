import { useState } from "react";
import type { ADDate } from "../core/types";
import type { CalendarItem } from "../core/calendar-item";
import {
  addCalendarItem,
  updateCalendarItem,
  deleteCalendarItem,
} from "../store/calendarStore";

type Props = {
  mode: "create" | "edit";
  ad: ADDate;
  startHour?: number;
  event?: CalendarItem;
  onClose: () => void;
};

export default function EventFormModal({
  mode,
  ad,
  startHour,
  event,
  onClose,
}: Props) {
  const initialStartHour =
    mode === "edit"
      ? new Date(event!.startAD).getHours()
      : startHour ?? 9;

  const initialEndHour =
    mode === "edit"
      ? new Date(event!.endAD ?? event!.startAD).getHours()
      : initialStartHour + 1;

  const [title, setTitle] = useState(event?.title ?? "");
  const [startTime, setStartTime] = useState(
    `${String(initialStartHour).padStart(2, "0")}:00`
  );
  const [endTime, setEndTime] = useState(
    `${String(initialEndHour).padStart(2, "0")}:00`
  );
  const [location, setLocation] = useState(event?.location ?? "");
  const [description, setDescription] = useState(event?.description ?? "");

  function save() {
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);

    const start = new Date(ad.year, ad.month - 1, ad.day, sh, sm);
    const end = new Date(ad.year, ad.month - 1, ad.day, eh, em);

    if (mode === "create") {
      addCalendarItem({
        id: crypto.randomUUID(),
        title: title || "Untitled",
        startAD: start.toISOString(),
        endAD: end.toISOString(),
        allDay: false,
        type: "event",
        createdAt: new Date().toISOString(),
        location,
        description,
      });
    } else {
      updateCalendarItem(event!.id, {
        title: title || "Untitled",
        startAD: start.toISOString(),
        endAD: end.toISOString(),
        location,
        description,
      });
    }

    onClose();
  }

  function handleDelete() {
    if (!event) return;

    const ok = window.confirm("Delete this event?");
    if (!ok) return;

    deleteCalendarItem(event.id);
    onClose();
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 420,
          background: "#1e1e1e",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h3>{mode === "create" ? "Create event" : "Edit event"}</h3>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={input}
        />

        <div style={{ marginBottom: 8 }}>
          {ad.day}/{ad.month}/{ad.year}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={input}
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            style={input}
          />
        </div>

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={input}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...input, height: 80 }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 16,
          }}
        >
          {mode === "edit" && (
            <button
              onClick={handleDelete}
              style={{
                color: "#ff6b6b",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose}>Cancel</button>
            <button
              onClick={save}
              style={{ background: "#1a73e8", color: "white" }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const input = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #333",
  background: "#111",
  color: "inherit",
  marginBottom: 10,
};
