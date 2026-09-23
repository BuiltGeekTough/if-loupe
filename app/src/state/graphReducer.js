export const initialGraphState = {
  rooms: {},       // { [name]: { objects: string[], visited: true } }
  edges: {},       // { [from]: { [direction]: to } }
  currentRoom: null,
};

export function graphReducer(state, action) {
  switch (action.type) {
    case "ROOM_ENTERED": {
      const { name } = action;
      if (!name) return state;
      const rooms = { ...state.rooms };
      if (!rooms[name]) rooms[name] = { objects: [], visited: true };
      return { ...state, rooms, currentRoom: name };
    }
    case "EDGE_OBSERVED": {
      const { from, direction, to } = action;
      const edges = { ...state.edges };
      edges[from] = { ...(edges[from] || {}), [direction]: to };
      return { ...state, edges };
    }
    case "OBJECTS_OBSERVED": {
      const { room, objects } = action;
      if (!state.rooms[room]) return state;
      const rooms = {
        ...state.rooms,
        [room]: { ...state.rooms[room], objects },
      };
      return { ...state, rooms };
    }
    default:
      return state;
  }
}
