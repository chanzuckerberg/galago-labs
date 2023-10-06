import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
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

  // const checkIfCurrentMrcaSample = (sample: Node) => {
  //   if (!state.mrca) {
  //     return false;
  //   }

  //   const currentMrcaSampleNames =
  //     state.cladeDescription.unselected_samples_in_cluster
  //       .concat(state.cladeDescription.selected_samples)
  //       .map((n: Node) => n.name);
  //   return currentMrcaSampleNames.includes(sample.name);
  // };

  // const plotSampleOfInterest = (sample: Node, isCurrentMrcaSample: boolean) => {
  //   const color = isCurrentMrcaSample ? Theme.palette.primary : "black";
  //   const strokeWidth = isCurrentMrcaSample ? 3 : 1;

  //   return (
  //     <g
  //       transform={`translate(
  //     ${_xScaleTime(sample.node_attrs.num_date.value)},
  //     ${_yMutsScale(sample.node_attrs.div)}
  //   )`}
  //       key={`sampleOfInterestGroup-${uuid()}`}
  //     >
  //       <line
  //         x1="-6"
  //         y1="0"
  //         x2="6"
  //         y2="0"
  //         stroke={Theme.palette.primary.main} //getMetadataColor(sample)}
  //         strokeWidth={strokeWidth}
  //         key={`sampleOfInterest-${uuid()}`}
  //       />
  //       <line
  //         x1="0"
  //         y1="-6"
  //         x2="0"
  //         y2="6"
  //         stroke={Theme.palette.primary.main} //getMetadataColor(sample)}
  //         strokeWidth={strokeWidth}
  //         key={`sampleOfInterest-${uuid()}`}
  //       />
  //     </g>
  //   );
  // };

  // const plotOtherSample = (sample: Node, isCurrentMrcaSample: boolean) => {
  //   let radius, strokeWidth, color;

  //   if (isCurrentMrcaSample) {
  //     radius = 3;
  //     strokeWidth = 1;
  //     color = Theme.palette.primary.light;
  //   } else {
  //     radius = 2.5;
  //     strokeWidth = 0;
  //     color = Theme.palette.secondary.light;
  //   }

  //   return (
  //     <circle
  //       key={`otherSample-${uuid()}`}
  //       cx={_xScaleTime(sample.node_attrs.num_date.value)}
  //       cy={_yMutsScale(sample.node_attrs.div)}
  //       r={radius}
  //       style={{
  //         fill: color,
  //         stroke: Theme.palette.secondary.dark,
  //         strokeWidth: strokeWidth,
  //       }}
  //     />
  //   );
  // };

  // const plotSample = (sample: Node) => {
  //   const isSampleOfInterest = checkIfSampleOfInterest(sample);
  //   const isCurrentMrcaSample = checkIfCurrentMrcaSample(sample);

  //   if (isSampleOfInterest) {
  //     return plotSampleOfInterest(sample, isCurrentMrcaSample);
  //   } else {
  //     return plotOtherSample(sample, isCurrentMrcaSample);
  //   }
  // };

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
                  onMouseLeave={() => setHoveredCircle(null)}
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
