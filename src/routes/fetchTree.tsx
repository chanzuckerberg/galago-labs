import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { getUrlToFetch } from "../utils/fetchData";
import LandingPageRoute from "./landingPageRoute";
import { ACTION_TYPES } from "../reducers/actionTypes";
import { ingestNextstrain } from "../utils/nextstrainAdapter";

/**
 * VOODOO_TODO__DOC_ME
 *
 * necessary to have handling happen here because it's async.
 * If we try to just handle it in the useEffect that kicks this off and return
 * from here, we get a promise and blah blah blah
 *
 * - if we eventually handle anything other than nextstrain tree json, need
 * a way here to know which json type we're trying to ingest. Maybe we can
 * determine it from structure of json and auto-choose?
 */
async function handleDataFetch(targetUrl: string, dispatch: Function) {
  console.log("starting getData"); // REMOVE

  // TODO needs error handling around request
  const response = await axios.get(targetUrl);
  console.log("response", response); // REMOVE

  // TODO Should have some kind of sanity check that we got a Nextstrain tree.
  // If it fails sanity check, kick off an error message about malformed.
  const ingestedNextstrain = ingestNextstrain(response.data);
  dispatch({
    type: ACTION_TYPES.FETCH_TREE_DATA_SUCCEEDED,
    data: ingestedNextstrain,
  });
}

/**
 * VOODOO_TODO__DOC_ME
 */
const FetchTree = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("Kicking off useEffect"); // REMOVE

    const targetUrl = getUrlToFetch();
    if (targetUrl) {
      dispatch({
        type: ACTION_TYPES.FETCH_TREE_DATA_STARTED,
        targetUrl,
      });
      // If successful, will load data into tree and open modal for next step
      handleDataFetch(targetUrl, dispatch);
    } else {
      console.warn("hey, you missed your URL, buddy"); // TODO make real
    }

    console.log("yolo"); // REMOVE
  }, []);
  return (
    <LandingPageRoute />
  );
};

export default FetchTree;
