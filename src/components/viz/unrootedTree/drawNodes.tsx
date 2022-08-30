import { Node } from "../../../d";
import * as d3 from "d3";
//@ts-ignore
import uuid from "react-uuid";
import { useSelector } from "react-redux";
import {
  getNodeAttr,
  get_dist,
  traverse_preorder,
} from "../../../utils/treeMethods";

type DrawNodesProps = {
  mrca: Node;
  colorScale: [string, string, string];
  chartWidth: number;
  chartHeight: number;
  chartMargin: number;
  scaleDomainX: [number, number];
  scaleDomainY: [number, number];
};

const outlineColor = "black"; //"rgba(80,80,80,1)";

const getColor = (
  node: Node,
  mrca: Node,
  muts_per_trans_minmax: number,
  colorScale: [string, string, string]
) => {
  if (node.children.length === 0) {
    return "green";
  }
  const distanceFromMrca = get_dist([node, mrca]);
  if (distanceFromMrca === 0) {
    return "blue";
  }

  //@ts-ignore -- not sure why the `extend` works for forceLink but not forceNode in d.ts
  if (distanceFromMrca === 0) {
    return colorScale[0];
    //@ts-ignore
  } else if (
    //@ts-ignore
    distanceFromMrca <=
    muts_per_trans_minmax * 2
  ) {
    return colorScale[1];
  } else {
    return colorScale[2];
  }
};

// const drawSquare = (
//   node: Node,
//   mrca: Node,
//   muts_per_trans_minmax: number,
//   colorScale: [string, string, string],
//   scaleX: Function,
//   scaleY: Function
// ) => {
//   const color = getColor(node, mrca, muts_per_trans_minmax, colorScale);
//   return (
//     <rect
//       onClick={() => {}}
//       className="node"
//       x={scaleX(getNodeAttr(node, "x") - getNodeAttr(node, "nodeSize"))}
//       y={scaleY(getNodeAttr(node, "y") - getNodeAttr(node, "nodeSize"))}
//       width={2 * getNodeAttr(node, "nodeSize")}
//       height={2 * getNodeAttr(node, "nodeSize")}
//       fill={color}
//       key={`node-${uuid()}`}
//       stroke={outlineColor}
//       opacity={0.95}
//     ></rect>
//   );
// };

const drawCircle = (
  node: Node,
  mrca: Node,
  muts_per_trans_minmax: number,
  colorScale: [string, string, string],
  scaleX: Function,
  scaleY: Function
) => {
  const color = getColor(node, mrca, muts_per_trans_minmax, colorScale);

  return (
    <circle
      onClick={() => {}}
      className="node"
      cx={scaleX(getNodeAttr(node, "x"))}
      cy={scaleY(getNodeAttr(node, "y"))}
      r={getNodeAttr(node, "nodeSize")}
      fill={color}
      key={`node-${uuid()}`}
      opacity={0.95}
      stroke={outlineColor}
    ></circle>
  );
};

export const DrawNodes = (props: DrawNodesProps) => {
  const {
    colorScale,
    chartWidth,
    chartHeight,
    chartMargin,
    scaleDomainX,
    scaleDomainY,
  } = props;

  const scaleX = d3
    .scaleLinear()
    .domain(scaleDomainX)
    .range([chartMargin, chartWidth - chartMargin]);

  const scaleY = d3
    .scaleLinear()
    .domain(scaleDomainY)
    .range([chartMargin, chartHeight - chartMargin]);

  // @ts-ignore
  const state = useSelector((state) => state.global);

  const nodes = traverse_preorder(state.mrca);

  return (
    <g className="nodes">
      {nodes.map((node: Node) => {
        //@ts-ignore
        // if (!forceNode.isLeaf) {
        //   return <></>;
        // }

        //@ts-ignore
        return drawCircle(
          //@ts-ignore
          node,
          state.mrca,
          state.mutsPerTransmissionMax,
          colorScale,
          scaleX,
          scaleY
        );
      })}

      {nodes.map((node: Node) => {
        if (node.parent && node !== state.mrca) {
          return (
            <line
              className="link"
              x1={scaleX(getNodeAttr(node, "x"))}
              x2={scaleX(getNodeAttr(node.parent, "x"))}
              y1={scaleY(getNodeAttr(node, "y"))}
              y2={scaleY(getNodeAttr(node.parent, "y"))}
              stroke={"black"}
              // onMouseOver={(event) => {
              //   onMouseOverHandler(event);
              // }}
              // onMouseOut={(event) => {
              //   onMouseOutHandler();
              // }}
              key={`links-${uuid()}`}
            />
          );
        }
      })}
      {/* 
      {nodes.map((node: Node) => {
        return (
          <text
            x={scaleX(getNodeAttr(node, "x"))}
            y={scaleY(getNodeAttr(node, "y"))}
          >
            {(getNodeAttr(node, "theta") / Math.PI).toFixed(2)}
          </text>
        );
      })} */}
    </g>
  );
};

export default DrawNodes;
