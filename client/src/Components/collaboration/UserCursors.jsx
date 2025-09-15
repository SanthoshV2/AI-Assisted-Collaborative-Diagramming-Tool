import React , {useState , useEffect} from "react";
import socketManager from "../../utils/socketManager";

function UserCursors({ roomId }) {
  const [cursors, setCursors] = useState({});

  useEffect(() => {
    if (!roomId) return;

    const handleCursorUpdate = ({ userId, position, name, color }) => {
      if (userId === socketManager.currentUser) return;

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
  }, [roomId]);

  return (
    <div className="pointer-events-none absolute inset-0">
        {Object.entries(cursors).map(([userId, cursor]) => (
            <div key={userId} className="absolute pointer-events-none z-50"
            style={{
                left: cursor.position?.x || 10,
                top: cursor.position?.y || 10,
                transform: 'translate(-50%, -50%)'
            }}>
                .
                <div className="flex flex-col items-center">
                    <svg width="24" height= "24" viewBox="0 0 24 24 ">
                        <path
                            d= "M5,2 L19,12 L12,13 L11,19 L5,2"
                            fill={cursor.color || "#3b82f6"}
                            stroke="#fff"
                            strokeWidth="1"
                        />
                    </svg>

                    <div className="mt-1 ps-2 py-0.5 rounded-md shadow-md text-xs whitespace-nowrap" style={{backgroundColor: cursor.color || "#3b82f6" , color : "white"}}>{cursor.name || "User"}</div>
                </div>
            </div>
        ))}
    </div>
  )
}

export default UserCursors;
