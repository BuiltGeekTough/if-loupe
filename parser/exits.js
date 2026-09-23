// Exit/adjacency inference.
//
// Rule: only record an edge when a movement command is immediately followed by an
// observed room-name change. Never infer edges from prose pattern-matching alone
// (e.g. "there is a wall to the north" printed in descriptive text is not a real exit).

const { normalizeDirection } = require("./directions");

function createExitTracker(graph) {
  let pendingDirection = null;
  let roomBeforeCommand = null;

  return {
    onPlayerCommand(command, currentRoom) {
      const direction = normalizeDirection(command);
      if (direction) {
        pendingDirection = direction;
        roomBeforeCommand = currentRoom;
      } else {
        pendingDirection = null;
        roomBeforeCommand = null;
      }
    },

    onRoomResolved(newRoom) {
      if (!pendingDirection || !roomBeforeCommand) return;
      if (newRoom && newRoom !== roomBeforeCommand) {
        graph.edges[roomBeforeCommand] = graph.edges[roomBeforeCommand] || {};
        graph.edges[roomBeforeCommand][pendingDirection] = newRoom;
      }
      pendingDirection = null;
      roomBeforeCommand = null;
    },
  };
}

module.exports = { createExitTracker };
