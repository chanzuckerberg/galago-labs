import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DrawNodes from "./drawNodes";
import ForceGraphLegend from "./drawLegend";
import CircularProgress from "@mui/material/CircularProgress";
import Theme from "../../../theme";
import { Node } from "../../../d";
import { initializeEqualAnglePolarCoordinates } from "../../../utils/unrootedTreeLayout";

type unrootedTreeProps = {
  chartHeight: number;
  chartWidth: number;
  chartMargin: number;
};

export const unrootedTree = (props: unrootedTreeProps) => {
  const { chartHeight, chartWidth, chartMargin } = props;
  /** Initialize state */
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const colorScale: [string, string, string] = [
    Theme.palette.primary.main,
    Theme.palette.primary.light,
    //@ts-ignore
    Theme.palette.primary.lighter,
  ];

  const [scaleDomainX, setScaleDomainX] = useState<[number, number]>([
    0,
    chartWidth,
  ]);
  const [scaleDomainY, setScaleDomainY] = useState<[number, number]>([
    0,
    chartHeight,
  ]);

  const [ready, setReady] = useState<boolean>(false);

  // only run the simulation (once) if the tree or the mrca is changed
  useEffect(() => {
    setReady(false);
    const { minX, maxX, minY, maxY, maxSize } =
      initializeEqualAnglePolarCoordinates(state.mrca);

    console.log("min max x", minX, maxX, "min max Y", minY, maxY);
    setScaleDomainX([minX, maxX]);
    setScaleDomainY([minY, maxY]);
    setReady(true);
    // setReady(true);
  }, [state.mrca, state.tree]);

  return (
    <div>
      {!ready && (
        <div
          style={{
            position: "relative",
            top: chartHeight / 2 - 37.5,
            left: chartWidth / 2 - 37.5,
          }}
        >
          <CircularProgress variant="indeterminate" size={75} color="primary" />
        </div>
      )}
      {ready && (
        <svg
          // style={{ border: "1px solid pink" }}
          width={chartWidth}
          height={chartHeight}
        >
          {/* <g
          transform={`scale(0.5,0.5) translate{${chartMargin}, ${chartMargin}}`}
        > */}
          {/* <g id="forceLinks">
            {positionedNodes &&
              positionedLinks &&
              positionedLinks.map((forceLink: forceLink) => (
                <DrawForceLink
                  forceLink={forceLink}
                  forceNodes={positionedNodes}
                  chartWidth={chartWidth}
                  chartHeight={chartHeight}
                  chartMargin={chartMargin}
                  scaleDomainX={scaleDomainX}
                  scaleDomainY={scaleDomainY}
                />
              ))}
          </g> */}

          <DrawNodes
            mrca={state.mrca}
            colorScale={colorScale}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
            chartMargin={chartMargin}
            scaleDomainX={scaleDomainX}
            scaleDomainY={scaleDomainY}
          />
          {/* <DrawLabels nodes={forceNodes} onNodeSelected={() => {}} /> */}

          {/* <ForceGraphLegend colorScale={colorScale} /> */}
        </svg>
      )}
    </div>
  );
};

export default unrootedTree;
