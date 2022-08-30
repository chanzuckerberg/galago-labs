import { getUrlToFetch } from "../utils/fetchData";

const FetchTree = () => {
  const urlToFetch = getUrlToFetch();
  console.log("urlToFetch", urlToFetch); // REMOVE
  return (
    <div> hello there </div>
  );
};

export default FetchTree;
