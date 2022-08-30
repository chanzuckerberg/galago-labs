import { Node } from "../d";
import { getNodeAttr, traverse_preorder } from "./treeMethods";

const polarToCartesian = (theta: number, radius: number) => {
  return { x: radius * Math.cos(theta), y: radius * Math.sin(theta) };
};

const getNodeSize = (node: Node) => {
  // how many sample(s) should be represented by this node?

  // descendent leaves with branch length 0 do not have size of their own (allocated to parent)
  if (node.children.length === 0 && node.branch_attrs.length === 0) {
    return 0; //
  } else if (node.children.length === 0) {
    return 1; // leaf, not part of a polytomy, gets its own space
  } else {
    // internal nodes get size allocated based on N direct descendent leaves with branch length 0
    return node.children.filter(
      (child: Node) =>
        child.children.length === 0 && child.branch_attrs.length === 0
    ).length;
  }
};

const getNodeThetaAllocationEqualShare = (
  node: Node,
  parentThetaAllocation: number
) => {
  // How many degrees around the circle are allocated to this node is based on the fraction of the parent's total descendents that are also descendents of this node
  if (!node.parent) {
    // should never encounter
    console.error("orphan node found in unrooted tree layout");
    return 2 * Math.PI;
  }
  let tipCount;
  // tips get to take up theta space for themselves unless they're part of a polytomy
  if (node.children.length === 0 && node.branch_attrs.length > 0) {
    tipCount = 1;
    // internal nodes take up space for all descendent tips except those that are part of a polytomy
  } else {
    const nodeSize = getNodeSize(node); // N polytomy samples at this internal node
    tipCount = getNodeAttr(node, "tipCount") - nodeSize; // all samples that descend from this node
  }

  const proportionOfParentsDescendentTips =
    tipCount / getNodeAttr(node.parent, "tipCount");

  const thetaAngleAllocation =
    proportionOfParentsDescendentTips * parentThetaAllocation;
  return thetaAngleAllocation;
};

export const initializeEqualAnglePolarCoordinates = (mrca: Node) => {
  // WARNING: impure function

  const orderedNodes = traverse_preorder(mrca); // traverse through each parent node before its children

  // keep track of x,y axis ranges while we're at it for use later in scale.domain
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;
  let maxSize = 0;

  orderedNodes.forEach((node: Node) => {
    if (!node.parent || node === mrca) {
      // root of the (sub)tree
      const { x, y } = polarToCartesian(Math.PI, 0); // initialize at (0,0)

      const nodeSize = getNodeSize(node);
      maxSize = nodeSize > maxSize ? nodeSize : maxSize;

      node.node_attrs = {
        ...node.node_attrs,
        theta: Math.PI, // start rotating from the halfway point around the circle (arbitrary)
        thetaMin: 0,
        thetaMax: 2 * Math.PI, // full circle available to divvy up amongst direct children
        radius: 0, // 0 branch length
        nodeSize: nodeSize, // check if polytomy, plot accordingly
        x: x,
        y: y,
      };
    } else if (node.children.length === 0 && node.branch_attrs.length === 0) {
      // leaves that descend from a polytomy node (i.e., have 0 branch length) should not take up rotational space
      node.node_attrs = {
        ...node.node_attrs,
        theta: getNodeAttr(node.parent, "theta"),
        thetaMin: getNodeAttr(node.parent, "thetaMin"),
        thetaMax: getNodeAttr(node.parent, "thetaMax"),
        radius: getNodeAttr(node, "div"),
        nodeSize: 0,
        x: getNodeAttr(node.parent, "x"),
        y: getNodeAttr(node.parent, "y"),
      };
    } else {
      // share of the circle allocated to the parent node
      const parentThetaMin = getNodeAttr(node.parent, "thetaMin");
      const parentThetaMax = getNodeAttr(node.parent, "thetaMax");
      const parentThetaAllocation = parentThetaMax - parentThetaMin;

      const nodeThetaShare = getNodeThetaAllocationEqualShare(
        node,
        parentThetaAllocation
      );

      const nodeSiblingIndex = node.parent.children.indexOf(node);
      let nodeThetaMin = parentThetaMin;
      for (let i = 0; i < nodeSiblingIndex; i++) {
        nodeThetaMin += getNodeThetaAllocationEqualShare(
          node.parent.children[i],
          parentThetaAllocation
        );
      }

      const nodeThetaMax = nodeThetaMin + nodeThetaShare;

      const theta = (nodeThetaMax - nodeThetaMin) / 2; // midpoint of allocated theta range

      const radius = getNodeAttr(node, "div");

      // convert to rectangular coordinates
      const { x, y } = polarToCartesian(theta, radius);

      const nodeSize = getNodeSize(node);

      minX = x && x < minX ? x : minX;
      maxX = x && x > maxX ? x : maxX;
      minY = y && y < minY ? y : minY;
      maxY = y && y > maxY ? y : maxY;
      maxSize = nodeSize > maxSize ? nodeSize : maxSize;

      node.node_attrs = {
        ...node.node_attrs,
        theta: theta,
        thetaMin: nodeThetaMin,
        thetaMax: nodeThetaMax,
        radius: radius,
        nodeSize: nodeSize,
        x: x,
        y: y,
      };
    }
  });
  return { minX: minX, maxX: maxX, minY: minY, maxY: maxY, maxSize: maxSize };
};
