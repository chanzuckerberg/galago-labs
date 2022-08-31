import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import Selectors from "./selectors";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Button, FormLabel } from "@mui/material";
import Theme from "../../../theme";
import ContinuousDataSlider from "./continuousDataSlider";
import CategoricalDataSelector from "./categoricalDataSelector";

export const CaseDefinitionConstructor = () => {
  // @ts-ignore -- TODO: figure out how to add types to state
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const fieldIsValid = (fieldSummary: any) => {
    if (fieldSummary["dataType"] == "categorical") {
      return (
        fieldSummary["uniqueValues"].length <= 100 &&
        fieldSummary["uniqueValues"].length >= 2
      );
    } else {
      return (
        !isNaN(fieldSummary["min"]) &&
        fieldSummary["min"] !== fieldSummary["max"]
      );
    }
  };

  const validFields: Array<any> = [];
  Object.entries(state.metadataCensus).forEach((entry, i) => {
    if (fieldIsValid(entry[1])) {
      validFields.push({ label: entry[0], id: i });
    }
  });

  return (
    <div // TODO: this a column flex div with the two buttons together in a div/row at the bottom
      style={{
        //@ts-ignore
        backgroundColor: Theme.palette.secondary.lighter,
        padding: 10,
        borderRadius: 5,
      }}
    >
      <h4 style={{ margin: 0 }}>Add samples by case definition:</h4>
      <FormLabel>
        Samples matching selected metadata will be added to the list of Sample
        Names.
      </FormLabel>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Autocomplete
            multiple
            id="tags-outlined"
            style={{ paddingTop: 15, width: 250 }}
            options={validFields}
            getOptionLabel={(option: any) => option.label}
            limitTags={5}
            disableCloseOnSelect
            size="small"
            filterSelectedOptions
            onChange={(event: any, newValue: any) => {
              setSelectedFields(newValue.map((nv: any) => nv.label));
            }}
            isOptionEqualToValue={(opt, value) => {
              return opt.label === value.label;
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select metadata" />
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
        >
          {selectedFields.map((field: string) => {
            return state.metadataCensus[field]["dataType"] === "continuous" ? (
              <ContinuousDataSlider field={field} />
            ) : (
              <CategoricalDataSelector field={field} />
            );
          })}
        </div>
      </div>
      <div
        style={
          {
            // display: "flex",
            // flexDirection: "row",
            // justifyContent: "space-around",
          }
        }
      >
        <Button
          disableElevation
          disableRipple
          style={{ marginTop: 30 }}
          variant="contained"
          name="submitCaseDef"
          onClick={(e) => {
            dispatch({
              type: "case definition submitted",
            });
          }}
          size="small"
          disabled={Object.keys(state.caseDefFilters).length === 0}
        >
          Add matches to Samples of Interest
        </Button>
        <Button
          variant="text"
          style={{ marginTop: 30 }}
          onClick={() => {
            setSelectedFields([]);
            dispatch({ type: "case definition filters cleared" });
          }}
        >
          CANCEL
        </Button>
      </div>
    </div>
  );
};

export default CaseDefinitionConstructor;
