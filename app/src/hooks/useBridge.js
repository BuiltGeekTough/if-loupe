import { useEffect } from "react";
import { extractRoomNameFromGrid } from "../../../parser/rooms.js";
import { extractObjectsFromText } from "../../../parser/objects.js";

// Listens for messages forwarded by the bookmarklet hook and dispatches
// parsed deltas into the graph reducer. Same-tab (postMessage) transport
// for the MVP; swap/extend for BroadcastChannel or a WebSocket relay for
// cross-tab/cross-device setups.
export function useBridge(dispatch) {
  useEffect(() => {
    function handleMessage(event) {
      const msg = event.data;
      if (!msg || msg.source !== "if-loupe") return;

      if (msg.type === "glkote-update") {
        const roomName = extractRoomNameFromGrid(msg.payload);
        if (roomName) {
          dispatch({ type: "ROOM_ENTERED", name: roomName });
        }
      }

      if (msg.type === "player-command") {
        // Movement/edge inference and object-extraction wiring happens here
        // once the exit tracker (parser/exits.js) is connected to live state.
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [dispatch]);
}
