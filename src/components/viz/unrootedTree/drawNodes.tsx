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
import {
  containsSamplesOfInterest,
  getColor,
} from "../../../utils/unrootedTree";

type DrawNodesProps = {
  mrca: Node;
  colorScale: [string, string, string];
  chartWidth: number;
  chartHeight: number;
  chartMargin: number;
  scaleDomainX: [number, number];
  scaleDomainY: [number, number];
  scaleDomainR: [number, number];
  tooltip: any;
};

const outlineColor = "gray";

const drawSampleOfInterestMarker = (
  x: number,
  y: number,
  r: number,
  color: string
) => {
  return (
    <g className="sample of interest marker">
      <line
        x1={x - r}
        x2={x + r}
        y1={y}
        y2={y}
        stroke={color}
        strokeWidth={r / 2}
      />
      <line
        x1={x}
        x2={x}
        y1={y - r}
        y2={y + r}
        stroke={color}
        strokeWidth={r / 2}
      />
    </g>
  );
};

const drawSquare = (
  node: Node,
  mrca: Node,
  mutsPerTransmissionMax: number,
  samplesOfInterestNames: string[],
  colorScale: [string, string, string],
  scaleX: Function,
  scaleY: Function,
  scaleR: Function,
  tooltip: any
) => {
  const [color, markerColor] = getColor(
    node,
    mrca,
    mutsPerTransmissionMax,
    colorScale
  );
  const size = scaleR(Math.max(5, getNodeAttr(node, "nodeSize")));
  const x = scaleX(getNodeAttr(node, "x"));
  const y = scaleY(getNodeAttr(node, "y"));
  let nodes = node.children.filter(
    (ch: Node) => ch.branch_attrs.length === 0 && ch.children.length === 0
  );

  return (
    <g className="mrca node">
      <rect
        x={x - size}
        y={y - size}
        width={2 * size}
        height={2 * size}
        fill={color}
        key={`node-${uuid()}`}
        stroke={outlineColor}
        opacity={0.95}
        onMouseMove={() => {
          tooltip.showTooltip({
            tooltipData: nodes,
            tooltipLeft: x,
            tooltipTop: y,
          });
        }}
        onMouseLeave={() => {
          tooltip.hideTooltip();
        }}
      />
      {containsSamplesOfInterest(node, samplesOfInterestNames) &&
        drawSampleOfInterestMarker(x, y, size / 2, markerColor)}
    </g>
  );
};

const drawCircle = (
  node: Node,
  mrca: Node,
  mutsPerTransmissionMax: number,
  samplesOfInterestNames: string[],
  colorScale: [string, string, string],
  scaleX: Function,
  scaleY: Function,
  scaleR: Function,
  tooltip: any
) => {
  const [color, markerColor] = getColor(
    node,
    mrca,
    mutsPerTransmissionMax,
    colorScale
  );

  const x = scaleX(getNodeAttr(node, "x"));
  const y = scaleY(getNodeAttr(node, "y"));
  const size = scaleR(getNodeAttr(node, "nodeSize"));
  let nodes = [node];
  nodes.concat(
    node.children.filter(
      (ch: Node) => ch.branch_attrs.length === 0 && ch.children.length === 0
    )
  );

  return (
    <g className="node">
      <circle
        onClick={() => {}}
        className="node"
        cx={x}
        cy={y}
        r={size}
        fill={color}
        key={`node-${uuid()}`}
        opacity={0.95}
        stroke={outlineColor}
        onMouseMove={() => {
          tooltip.showTooltip({
            tooltipData: nodes,
            tooltipLeft: x,
            tooltipTop: y,
          });
        }}
        onMouseLeave={() => {
          tooltip.hideTooltip();
        }}
      />
      {containsSamplesOfInterest(node, samplesOfInterestNames) &&
        drawSampleOfInterestMarker(x, y, size / 2, markerColor)}
    </g>
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
    scaleDomainR,
    tooltip,
  } = props;

  const scaleX = d3
    .scaleLinear()
    .domain(scaleDomainX)
    .range([chartMargin, chartWidth - chartMargin]);

  const scaleY = d3
    .scaleLinear()
    .domain(scaleDomainY)
    .range([chartMargin, chartHeight - chartMargin]);

  const scaleR = d3.scaleLinear().domain(scaleDomainR).range([6, 20]);

  // @ts-ignore
  const state = useSelector((state) => state.global);

  // only draw nodes with size > 0 (i.e., internal nodes with polytomies and leaves that aren't already polytomies)
  const nodesToDraw = traverse_preorder(state.mrca).filter(
    (n: Node) => getNodeAttr(n, "nodeSize") > 0
  );

  // only draw links to internal nodes & non-polytomy leaves
  const linksToDraw = traverse_preorder(state.mrca).filter((n: Node) => {
    if (n.children.length === 0 && getNodeAttr(n, "nodeSize") > 0) {
      return true;
    } else if (n.children.length > 0) {
      return true;
    } else {
      return false;
    }
  });

  return (
    <g className="nodes">
      {linksToDraw.map((node: Node) => {
        if (
          node.parent &&
          node !== state.mrca //&&
          // getNodeAttr(node, "nodeSize") > 0
        ) {
          return (
            <line
              className="link"
              x1={scaleX(getNodeAttr(node.parent, "x"))}
              x2={scaleX(getNodeAttr(node, "x"))}
              y1={scaleY(getNodeAttr(node.parent, "y"))}
              y2={scaleY(getNodeAttr(node, "y"))}
              stroke={"gray"}
              markerEnd={"url(#arrowHead)"}
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

      {nodesToDraw.map((node: Node) => {
        if (getNodeAttr(node, "nodeSize") > 0) {
          //@ts-ignore
          return drawCircle(
            //@ts-ignore
            node,
            state.mrca,
            state.mutsPerTransmissionMax,
            state.samplesOfInterestNames,
            colorScale,
            scaleX,
            scaleY,
            scaleR,
            tooltip
          );
        }
      })}

      {drawSquare(
        state.mrca,
        state.mrca,
        state.mutsPerTransmissionMax,
        state.samplesOfInterestNames,
        colorScale,
        scaleX,
        scaleY,
        scaleR,
        tooltip
      )}
    </g>
  );
};

export default DrawNodes;
