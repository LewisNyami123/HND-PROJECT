// components/Countdown.jsx
import { useState, useEffect } from "react";
import '../styles/Countdown.css'
function Countdown({ scheduledTime, duration = 0 }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const start = new Date(scheduledTime);
      const end = new Date(start.getTime() + duration * 60 * 1000);
      const toStart = start - now;
      const toEnd = end - now;

      // Case 1: Exam hasn't started yet (future)
      if (toStart > 0) {
        const days = Math.floor(toStart / (1000 * 60 * 60 * 24));
        const hours = Math.floor((toStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((toStart % (1000 * 60 * 60)) / (1000 * 60));

        let text = "";
        if (days > 0) text += `${days}d `;
        if (hours > 0 || days > 0) text += `${hours}h `;
        text += `${minutes}m`;

        // Warning if < 30 mins
        if (toStart <= 30 * 60 * 1000) {
          setDisplay(<span style={{ color: "#d32f2f", fontWeight: "bold", fontSize: "1.1em" }}>Exam is starting soon!</span>);
        } else {
          setDisplay(<span style={{ color: "#1976d2", fontWeight: "600" }}>{text}</span>);
        }
      }
      // Case 2: Exam is ongoing
      else if (toEnd > 0) {
        const minsLeft = Math.floor(toEnd / (1000 * 60));
        const secsLeft = Math.floor((toEnd % (1000 * 60)) / 1000);
        setDisplay(
          <span style={{ color: "#ef6c00", fontWeight: "bold", fontSize: "1.2em" }}>
            Time left: {minsLeft}m {secsLeft}s
          </span>
        );
      }
      // Case 3: Exam ended
      else {
        setDisplay(<span style={{ color: "#666", fontStyle: "italic" }}>Exam completed</span>);
      }
    };

    update();
    const interval = setInterval(update, 1000); // Update every second for live feel

    return () => clearInterval(interval);
  }, [scheduledTime, duration]);

  return <div className="countdown-display">{display}</div>;
}

export default Countdown;