import { Collapse, Alert, AlertTitle } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

export const FetchError = () => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();

  return (
    <Collapse in={state.fetchData.displayError}>
      <Alert
        severity="error"
        style={{
          width: 450,
          height: 90,
          position: "absolute",
          top: 95,
          right: 0,
        }}
        onClose={() => {
          dispatch({ type: "fetch error cleared" });
        }}
      >
        <AlertTitle>
          <strong>Woops! Error fetching data</strong>
        </AlertTitle>
        <span style={{}}>
          {state.fetchData.errorMessage && state.fetchData.errorMessage}
        </span>
      </Alert>
    </Collapse>
  );
};
