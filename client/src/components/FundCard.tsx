import { FC } from "react";
import { tagType, thirdweb } from "../assets";
import { daysLeft } from "../utils";

interface FundCardProps {
  owner: string;
  title: string;
  description: string;
  target: number;
  deadline: number | bigint;
  amountCollected: number;
  image: string;
  handleClick: () => void;
}

const FundCard: FC<FundCardProps> = ({
  owner,
  title,
  description,
  target,
  deadline,
  amountCollected,
  image,
  handleClick,
}) => {
  const deadlineTime =
    typeof deadline === "bigint" ? Number(deadline) : deadline;
  const remainingDays = daysLeft(deadlineTime);

  return (
    <div
      className="sm:w-72 w-full rounded-2xl bg-[#1c1c24] cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={image}
        alt="fund"
        className="w-full h-40 object-cover rounded-2xl"
      />

      <div className="flex flex-col p-4">
        <div className="flex items-center mb-5">
          <img src={tagType} alt="tag" className="w-4 h-4 object-contain" />
          <p className="ml-3 mt-1 font-epilogue font-medium text-xs text-[#808191]">
            Other
          </p>
        </div>

        <div className="block">
          <h3 className="font-epilogue font-semibold text-base text-white text-left leading-7 truncate">
            {title}
          </h3>
          <p className="mt-1 font-epilogue font-normal text-[#808191] text-left leading-5 truncate">
            {description}
          </p>
        </div>

        <div className="flex justify-between flex-wrap mt-4 gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-sm text-[#b2b3bd] leading-6">
              {amountCollected}
            </h4>
            <p className="mt-1 font-epilogue font-normal text-xs leading-5 text-[#808191] sm:max-w-32 truncate">
              Raised of {target}
            </p>
          </div>
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-sm text-[#b2b3bd] leading-6">
              {remainingDays > 0 ? remainingDays : "Campaign Ended"}
            </h4>
            <p className="mt-1 font-epilogue font-normal text-xs leading-5 text-[#808191] sm:max-w-32 truncate">
              {remainingDays > 0
                ? "Days Left"
                : `on ${new Date(deadlineTime).toLocaleDateString()}`}
            </p>
          </div>
        </div>

        <div className="flex items-center mt-5 gap-3">
          <div className="w-8 h-8 rounded-full flex justify-center items-center bg-[#13131a]">
            <img
              src={thirdweb}
              alt="user"
              className="w-1/2 h-1/2 object-contain"
            />
          </div>
          <p className="flex-1 font-epilogue font-normal text-xs text-[#808191] truncate">
            by <span className="text-[#b2b3bd]">{owner}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
