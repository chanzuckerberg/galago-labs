import { SimulationLinkDatum, SimulationNodeDatum } from "d3";

export interface Node {
  name: string;
  parent: Node | null; // not in default nextstrain export; add later via traversal
  children: Array<Node>; // direct descendents of this node (nodes or leaves)

  branch_attrs: {
    // values we care about are typed explicitly; other arbitrary values may also be present but not required or typed
    length: number; // not in default nextstrain export; add later via traversal
    [key: string]: any;
  };
  node_attrs: {
    // values we care about are typed explicitly; other arbitrary values may also be present but not required or typed
    div: number;
    tipCount: number;
    location?: { value: string };
    country?: { value: string };
    region?: { value: string };
    num_date: { value: Date; confidence: Array<Date> };
    [key: string]: any;
  };
}

export type HomeGeo = {
  location: string;
  division: string;
  country: string;
};

export type PairwiseDistances = {
  [key: string]: { [key: string]: number };
};

export interface CladeDescription {
  selected_samples: Node[]; // samples of interest in this clade
  unselected_samples_in_cluster: Node[];

  parent_for_cousins: Node;
  min_muts_to_parent: number;

  mrca_distances: { [key: string]: number };

  cousins: Node[];

  home_geo?: HomeGeo;
  subclade_geo?: string | null;
  subclades?: Node[];
}

export interface GISAIDRecord {
  year: number;
  month: number;
  count: number;
  country: string;
  division: string;
  location: string;
}

export interface metadataFieldSummary {
  type:
    | "[object String]"
    | "[object Number]"
    | "[object Date]"
    | "[object Boolean]";
  dataType: "continuous" | "categorical";
  min?: number | object;
  max?: number | object;
  uniqueValues?: Array<string>;
  nextstrainAncestralTraitsComputed?: boolean;
  matutilsAncestralTraitsComputed?: boolean;
}

export interface caseDefFilter {
  field: string;
  dataType: "continuous" | "categorical";
  min?: number | object;
  max?: number | object;
  acceptedValues?: Array<string>;
}

export interface papaParseMetadataEntry {
  [key: string]: any;
}
