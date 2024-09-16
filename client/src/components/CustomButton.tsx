import { FC } from "react";

interface CustomButtonProps {
  btnType: "submit" | "reset" | "button";
  title: String;
  disabled?: boolean;
  handleClick?: () => void;
  styles?: string;
}

const CustomButton: FC<CustomButtonProps> = ({
  btnType,
  title,
  disabled,
  handleClick,
  styles,
}) => {
  return (
    <button
      type={btnType}
      className={`font-epilogue font-semibold text-base leading-7 text-white min-h-14 px-4 rounded-xl ${styles}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

export default CustomButton;
