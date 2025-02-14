import { FC } from "react";

interface CountBoxProps {
  title: string | number;
  value: string | number;
}

const CountBox: FC<CountBoxProps> = ({ title, value }) => {
  return (
    <div className="flex flex-col items-center w-[150px]">
      <h4 className="font-epilogue font-bold text-3xl text-white p-3 bg-[#1c1c24] rounded-t-xl w-full text-center truncate">
        {value}
      </h4>
      <p className="font-epilogue font-normal text-base text-[#808191] bg-[#28282e] px-3 py-2 w-full rounded-b-xl text-center">
        {title}
      </p>
    </div>
  );
};

export default CountBox;
