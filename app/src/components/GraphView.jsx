import React, { useRef, useEffect } from "react";
import { forceSimulation, forceLink, forceManyBody, forceCenter } from "d3-force";
import { select } from "d3-selection";
import { zoom } from "d3-zoom";

// Minimal force-directed SVG renderer. Scoped zoom/pan to this component's
// own <svg> only, to avoid trapping page scroll on touch devices.
export default function GraphView({ graph }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const roomNames = Object.keys(graph.rooms);
    const nodes = roomNames.map((name) => ({ id: name }));
    const links = [];
    for (const [from, dirs] of Object.entries(graph.edges)) {
      for (const to of Object.values(dirs)) {
        if (roomNames.includes(from) && roomNames.includes(to)) {
          links.push({ source: from, target: to });
        }
      }
    }

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 400;

    const svg = select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`);

    svg.selectAll("*").remove();
    const g = svg.append("g");

    svg.call(
      zoom()
        .scaleExtent([0.3, 3])
        .on("zoom", (event) => g.attr("transform", event.transform))
    );

    const simulation = forceSimulation(nodes)
      .force("link", forceLink(links).id((d) => d.id).distance(120))
      .force("charge", forceManyBody().strength(-200))
      .force("center", forceCenter(width / 2, height / 2));

    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-width", 1.5);

    const node = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g");

    node
      .append("circle")
      .attr("r", 10)
      .attr("fill", (d) => (d.id === graph.currentRoom ? "#e63946" : "#457b9d"));

    node
      .append("text")
      .text((d) => d.id)
      .attr("dy", -14)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px");

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [graph]);

  return (
    <div className="if-loupe-graph-container" ref={containerRef}>
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
}
