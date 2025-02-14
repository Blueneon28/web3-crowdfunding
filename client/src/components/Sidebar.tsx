import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logo, sun } from "../assets";
import { navlinks } from "../constants";
import { useStateContext } from "../context";

interface IconProps {
  styles?: string;
  name?: string;
  imgUrl?: string;
  isActive?: string;
  disabled?: boolean;
  handleClick?: () => void;
}

const Icon: FC<IconProps> = ({
  styles,
  name,
  imgUrl,
  isActive,
  disabled,
  handleClick,
}) => {
  return (
    <div
      className={`w-12 h-12 rounded-xl ${
        isActive && isActive === name && "bg-[#2c2f32]"
      } flex justify-center items-center ${
        !disabled && "cursor-pointer"
      } ${styles}`}
      onClick={handleClick}
    >
      {!isActive ? (
        <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
      ) : (
        <img
          src={imgUrl}
          alt="fund_logo"
          className={`w-1/2 h-1/2 ${isActive !== name && "grayscale"}`}
        />
      )}
    </div>
  );
};

const Sidebar: FC = () => {
  const navigate = useNavigate();
  const { menuActive, setMenuActive } = useStateContext();
  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <Link to="/">
        <Icon
          styles="w-14 h-14 bg-[#2c2f32]"
          imgUrl={logo}
          handleClick={() => setMenuActive("Dashboard")}
        />
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <Icon
              key={link.name}
              {...link}
              isActive={menuActive}
              handleClick={() => {
                if (!link.disabled) {
                  setMenuActive(link.name);
                  navigate(link.link);
                }
              }}
            />
          ))}
        </div>

        <div>
          <Icon styles="bg-[#1c1c24] shadow-secondary" imgUrl={sun} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
