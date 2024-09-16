import { FC } from "react";
import { toEther } from "thirdweb";
import { useReadContract } from "thirdweb/react";
import { useStateContext } from "../context";
import { DisplayCampaign } from "../components";

type Campaign = {
  owner: string;
  title: string;
  description: string;
  target: string;
  deadline: number;
  amountCollected: string;
  image: string;
  pId: number;
};

const Profile: FC = () => {
  const { contract, address } = useStateContext();
  const { data: campaignsData, isLoading: isLoadingCampaigns } =
    useReadContract({
      contract,
      method:
        "function getCampaigns() view returns ((address owner, string title, string description, uint256 target, uint256 deadline, uint256 amountCollected, string image, address[] donators, uint256[] donations)[])",
      params: [],
    });

  const getCampaignByOwner = campaignsData?.filter(
    (campaign) => campaign.owner === address
  );

  const parsedCampaigns: Campaign[] = (getCampaignByOwner || []).map(
    (campaign: any, i: number) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: toEther(campaign.target),
      deadline: campaign.deadline,
      amountCollected: toEther(campaign.amountCollected),
      image: campaign.image,
      pId: i,
    })
  );

  return (
    <DisplayCampaign
      title={"My Campaign"}
      isLoading={isLoadingCampaigns}
      data={parsedCampaigns}
    />
  );
};

export default Profile;
