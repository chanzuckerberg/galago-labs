import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import { Theme } from "../../../theme";
import { Group } from "@visx/group";
import { Pack, hierarchy } from "@visx/hierarchy";
import { Node } from "src/d";
import PackLayoutTooltip from "./packLayoutTooltip";
import { HierarchyCircularNode } from "d3";

type PackLayoutProps = {
  width: number;
  height: number;
  margin: number;
};

const PackLayout = ({ width, height, margin }: PackLayoutProps) => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const [hoveredCircle, setHoveredCircle] =
    useState<HierarchyCircularNode<Node> | null>(null);

  const root = hierarchy<Node>(state.mrca, (d) => d.children)
    .count() //(d) => d.node_attrs.tipCount + 1)
    .sort(
      (a, b) =>
        // sort by hierarchy, then distance
        a.data.node_attrs.div - b.data.node_attrs.div ||
        (a.children ? 1 : -1) - (b.children ? 1 : -1)
    );

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill="#ffffff" />

      <Pack<Node> root={root} size={[width, height]}>
        {(packData) => {
          const circles = packData.descendants().slice(2); // skip outer hierarchies
          return (
            <Group>
              {circles.map((circle, i) => (
                <circle
                  key={`circle-${i}`}
                  r={circle.r}
                  cx={circle.x}
                  cy={circle.y}
                  fill={
                    circle.data.node_attrs.tipCount > 0
                      ? "mediumgray"
                      : Theme.palette.primary.main
                  }
                  fillOpacity={circle.data.node_attrs.tipCount > 0 ? 0.1 : 1}
                  onClick={() =>
                    dispatch({
                      type: "mrca selected",
                      data:
                        circle.data.node_attrs.tipCount > 0
                          ? circle.data.name
                          : circle.parent?.data.name,
                    })
                  }
                  onMouseEnter={() => setHoveredCircle(circle)}
                  onMouseDown={() => setHoveredCircle(null)}
                />
              ))}
            </Group>
          );
        }}
      </Pack>
      {hoveredCircle && <PackLayoutTooltip hoveredCircle={hoveredCircle} />}
    </svg>
  );
};

export default PackLayout;
