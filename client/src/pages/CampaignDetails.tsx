import { ChangeEvent, FC, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReadContract } from "thirdweb/react";
import { toEther } from "thirdweb";
import { thirdweb } from "../assets";
import { CountBox, CustomButton, Loader } from "../components";
import { useStateContext } from "../context";
import { calculateBarPercentage, daysLeft } from "../utils";

const CampaignDetails: FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setMenuActive, contract, donateCampaign } = useStateContext();

  const remainingDays = daysLeft(state.deadline);
  const isEnded = remainingDays <= 0;
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: dataDonators,
    // isLoading: isLoadingDonators
  } = useReadContract({
    contract,
    method:
      "function getDonators(uint256 _id) view returns (address[], uint256[])",
    params: [state.pId],
  });
  const numberOfDonations = dataDonators ? dataDonators[0].length : 0;

  const parsedDonations =
    dataDonators &&
    dataDonators[0]?.map((donator, index) => ({
      donator,
      donation: toEther(dataDonators[1][index]),
    }));

  const handleDonate = async () => {
    setIsLoading(true);

    await donateCampaign(state.pId, amount);

    setIsLoading(false);
    navigate("/");
    setMenuActive("Dashboard");
  };
  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-8">
        <div className="flex-1 flex-col">
          <img
            src={state.image}
            alt="campaign"
            className="w-full h-[410px] object-cover rounded-xl"
          />
          <div className={`relative w-full h-1 ${"bg-[#3a3a43]"} mt-2"`}>
            <div
              className={`absolute h-full ${
                isEnded ? "bg-red-700" : "bg-[#4acd8d]"
              }`}
              style={{
                width: `${calculateBarPercentage(
                  state.target,
                  state.amountCollected
                )}%`,
                maxWidth: "100%",
              }}
            ></div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-8">
          <CountBox
            title={
              !isEnded
                ? "Days Left"
                : `on ${new Date(
                    parseInt(state.deadline)
                  ).toLocaleDateString()}`
            }
            value={!isEnded ? remainingDays : "Ended"}
          />
          <CountBox
            title={`Raised of ${state.target}`}
            value={state.amountCollected}
          />
          <CountBox title={"Total Backers"} value={numberOfDonations} />
        </div>
      </div>

      <div className="mt-16 flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-10">
          <div>
            <h4 className="font-epilogue font-semibold text-lg text-white uppercase">
              Creator
            </h4>
            <div className="mt-5 flex items-center flex-wrap gap-4">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img
                  src={thirdweb}
                  alt="user"
                  className="w-[60%] h-[60%] object-contain"
                />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-sm text-white break-all">
                  {state.owner}
                </h4>
                <p className="mt-1 font-epilogue font-normal text-xs text-[#818191]">
                  10 Campaigns
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-lg text-white uppercase">
              Story
            </h4>
            <div className="mt-5">
              <p className="font-epilogue font-normal text-base text-[#818191] leading-7 text-justify">
                {state.description}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-lg text-white uppercase">
              Donators
            </h4>
            <div className="mt-5 flex flex-col gap-4">
              {parsedDonations && parsedDonations.length > 0 ? (
                parsedDonations.map((donator, index) => (
                  <div
                    key={`${donator.donator}-${index}`}
                    className="flex justify-between items-center gap-4"
                  >
                    <p className="font-epilogue font-normal text-base text-[#b2b3bd] leading-7 break-all">
                      {index + 1}. {donator.donator}
                    </p>
                    <p className="font-epilogue font-normal text-base text-[#808191] leading-7">
                      {donator.donation}
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-epilogue font-normal text-base text-[#818191] leading-7 text-justify">
                  No donators yet. Be the first one!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-lg text-white uppercase">
            Fund
          </h4>

          <div className="mt-5 flex flex-col p-4 bg-[#1c1c24] rounded-xl">
            <p className="font-epilogue font-medium text-xl leading-8 text-center text-[#808191]">
              Fund the campaign
            </p>
            <div className="mt-8">
              <input
                type="number"
                placeholder="ETH 0.1"
                step={"0.01"}
                className="w-full py-3 sm:px-5 px-4 outline-none border border-[#3a3a43] bg-transparent font-epilogue text-white text-lg leading-8 placeholder:text-[#4b5264] rounded-xl"
                value={amount}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAmount(e.target.value)
                }
                disabled={isEnded}
              />

              <div className="my-5 p-4 bg-[#13131a] rounded-xl">
                <h4 className="font-epilogue font-semibold text-sm leading-6 text-white">
                  Back it because you believe it.
                </h4>
                <p className="mt-5 font-epilogue font-normal leading-6 text-[#808191]">
                  Support the project for no reward, just because it speaks to
                  you.
                </p>
              </div>

              <CustomButton
                btnType={"button"}
                title={
                  !isEnded ||
                  amount === "" ||
                  amount === "0" ||
                  amount.includes("-")
                    ? "Fund Campaign"
                    : "Campaign Ended"
                }
                styles={`w-full ${
                  isEnded ||
                  amount === "" ||
                  amount === "0" ||
                  amount.includes("-")
                    ? "bg-[#4b5264] text-[#28282e]"
                    : "bg-[#8c6dfd]"
                }`}
                disabled={
                  isEnded ||
                  amount === "" ||
                  amount === "0" ||
                  amount.includes("-")
                }
                handleClick={handleDonate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
