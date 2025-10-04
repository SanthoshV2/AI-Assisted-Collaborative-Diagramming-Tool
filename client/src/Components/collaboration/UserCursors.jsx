import React, { useState, useEffect } from "react";
import socketManager from "../../utils/socketManager";

const COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#eab308", // yellow
  "#ef4444", // red
  "#a855f7", // purple
  "#f97316", // orange
  "#06b6d4", // teal
  "#ec4899", // pink
];

function UserCursors({ roomId }) {
  const [cursors, setCursors] = useState({});
  const [userColors, setUserColors] = useState({});

  useEffect(() => {
    if (!roomId) return;

    const assignColor = (userId) => {
      if (!userColors[userId]) {
        const available = COLORS.filter(
          (c) => !Object.values(userColors).includes(c)
        );
        const newColor =
          available.length > 0
            ? available[Math.floor(Math.random() * available.length)]
            : COLORS[Math.floor(Math.random() * COLORS.length)];

        setUserColors((prev) => ({ ...prev, [userId]: newColor }));
        return newColor;
      }
      return userColors[userId];
    };

    const handleCursorUpdate = ({ userId, position, name }) => {
      if (userId === socketManager.currentUser) return;

      const color = assignColor(userId);

      setCursors((prev) => ({
        ...prev,
        [userId]: { position, name, color, lastupdated: Date.now() },
      }));
    };

    const handleUserLeft = ({ userId }) => {
      setCursors((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    };

    socketManager.on("cursor-update", handleCursorUpdate);
    socketManager.on("user-left", handleUserLeft);

    // Cleanup stale cursors periodically
    const interval = setInterval(() => {
      const now = Date.now();
      setCursors((prev) => {
        const newCursors = { ...prev };
        Object.entries(newCursors).forEach(([id, cursor]) => {
          if (now - cursor.lastupdated > 5000) {
            delete newCursors[id];
          }
        });
        return newCursors;
      });
    }, 2000);

    return () => {
      socketManager.off("cursor-update", handleCursorUpdate);
      socketManager.off("user-left", handleUserLeft);
      clearInterval(interval);
    };
  }, [roomId, userColors]);

  return (
    <div className="pointer-events-none absolute inset-0">
      {Object.entries(cursors).map(([userId, cursor]) => (
        <div
          key={userId}
          className="absolute pointer-events-none z-50"
          style={{
            left: cursor.position?.x || 10,
            top: cursor.position?.y || 10,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="flex flex-col items-center">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M5,2 L19,12 L12,13 L11,19 L5,2"
                fill={cursor.color}
                stroke="#fff"
                strokeWidth="1"
              />
            </svg>

            <div
              className="mt-1 px-2 py-0.5 rounded-md shadow-md text-xs whitespace-nowrap"
              style={{
                backgroundColor: cursor.color,
                color: "white",
              }}
            >
              {cursor.name || "User"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserCursors;
