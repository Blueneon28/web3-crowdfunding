import { FC } from "react";
import { useLocation } from "react-router-dom";
import { DisplayCampaign } from "../components";

const SearchResult: FC = () => {
  const { state } = useLocation();

  return (
    <DisplayCampaign
      title={`Search Result for : '${state.key}'`}
      data={state.data}
    />
  );
};

export default SearchResult;
