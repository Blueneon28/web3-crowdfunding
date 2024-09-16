import { FC, useEffect, useMemo } from "react";
import { toEther } from "thirdweb";
import { useReadContract } from "thirdweb/react";
import { DisplayCampaign } from "../components";
import { useStateContext } from "../context";

type Campaign = {
  owner: string;
  title: string;
  description: string;
  target: string;
  deadline: number | bigint;
  amountCollected: string;
  image: string;
  pId: number;
};

const Home: FC = () => {
  const { setCampaignsData, contract } = useStateContext();
  const { data: campaignsData, isLoading: isLoadingCampaigns } =
    useReadContract({
      contract,
      method:
        "function getCampaigns() view returns ((address owner, string title, string description, uint256 target, uint256 deadline, uint256 amountCollected, string image, address[] donators, uint256[] donations)[])",
      params: [],
    });

  const parsedCampaigns: Campaign[] = useMemo(() => {
    return (campaignsData || [])?.map((campaign: any, i: number) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: toEther(campaign.target),
      deadline: campaign.deadline,
      amountCollected: toEther(campaign.amountCollected),
      image: campaign.image,
      pId: i,
    }));
  }, [campaignsData]);

  useEffect(() => {
    if (!isLoadingCampaigns && parsedCampaigns?.length) {
      setCampaignsData(parsedCampaigns);
    }
  }, [isLoadingCampaigns, parsedCampaigns, setCampaignsData]);

  return (
    <DisplayCampaign
      title={"All Campaign"}
      isLoading={isLoadingCampaigns}
      data={parsedCampaigns}
    />
  );
};

export default Home;
