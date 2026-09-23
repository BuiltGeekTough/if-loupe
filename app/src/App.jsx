import React, { useEffect, useReducer } from "react";
import GraphView from "./components/GraphView.jsx";
import { graphReducer, initialGraphState } from "./state/graphReducer.js";
import { useBridge } from "./hooks/useBridge.js";

export default function App() {
  const [graph, dispatch] = useReducer(graphReducer, initialGraphState);

  // Listens for postMessage / BroadcastChannel events forwarded by the
  // bookmarklet hook (see /hook/hook.js) and dispatches parsed deltas.
  useBridge(dispatch);

  return (
    <div className="if-loupe-app">
      <header className="if-loupe-header">
        <h1>if-loupe</h1>
        <span className="if-loupe-subtitle">
          {graph.currentRoom ? `Now in: ${graph.currentRoom}` : "Waiting for game data..."}
        </span>
      </header>
      <main className="if-loupe-main">
        <GraphView graph={graph} />
      </main>
    </div>
  );
}
