import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { loader } from "../assets";
import FundCard from "./FundCard";

interface Campaign {
  pId: number;
  title: string;
  description: string;
  target: string;
  deadline: number | bigint;
  amountCollected: string;
  owner: string;
  image: string;
}

interface DisplayCampaignProps {
  title: string;
  isLoading?: boolean;
  data: Campaign[];
}

const DisplayCampaign: FC<DisplayCampaignProps> = ({
  title,
  isLoading,
  data,
}) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign: Campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };
  return (
    <div>
      <h1 className="font-epilogue font-semibold text-lg text-white text-left">
        {title} ({data?.length})
      </h1>

      <div className="flex flex-wrap mt-5 gap-7">
        {isLoading ? (
          <img src={loader} alt="loader" className="w-24 h-24 object-contain" />
        ) : data.length <= 0 ? (
          <p className="font-epilogue font-semibold text-sm leading-8 text-[#818183]">
            You have not created any campaigns yet.
          </p>
        ) : (
          data.map((campaign: any) => (
            <FundCard
              key={campaign.pId}
              {...campaign}
              handleClick={() => handleNavigate(campaign)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DisplayCampaign;
