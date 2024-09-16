import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useConnect } from "thirdweb/react";
import { logo, menu, thirdweb } from "../assets";
import CustomButton from "./CustomButton";
import { navlinks } from "../constants";
import { useStateContext } from "../context";
import { injectedProvider } from "thirdweb/wallets";
import SearchBox from "./SearchBox";

const Navbar: FC = () => {
  const navigate = useNavigate();
  const {
    campaignsData,
    setCampaignsData,
    menuActive,
    setMenuActive,
    client,
    wallet,
    address,
  } = useStateContext();
  const { connect, isConnecting } = useConnect();

  const [toggleDrawer, setToggleDrawer] = useState(false);

  const handleSearchResult = (results: any[], keyword: string) => {
    setCampaignsData(results);
    navigate("/search", { state: { data: results, key: keyword } });
  };

  const handleClearSearch = () => {
    navigate("/");
    setMenuActive("Dashboard");
  };

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-9 gap-6">
      <SearchBox
        items={campaignsData}
        onSearchResult={handleSearchResult}
        onClearSearch={handleClearSearch}
      />

      <div className="sm:flex hidden justify-end gap-4">
        <CustomButton
          btnType="button"
          title={
            address
              ? "Create a campaign"
              : isConnecting
              ? "Connecting..."
              : "Connect"
          }
          styles={address ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
          handleClick={async () => {
            if (address) navigate("create-campaign");
            else
              connect(async () => {
                if (injectedProvider("io.metamask")) {
                  await wallet.connect({ client });
                } else {
                  await wallet.connect({
                    client,
                    walletConnect: { showQrModal: true },
                  });
                }
                return wallet;
              });
          }}
        />

        <Link to="/profile">
          <div className="w-14 h-14 rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <img
              src={thirdweb}
              alt="user"
              className="w-[60%] h-[60%] object-contain"
              onClick={() => setMenuActive("Profile")}
            />
          </div>
        </Link>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-10 h-10 rounded-xl bg-[#2c2f32] flex justify-center items-center cursor-pointer">
          <img
            src={logo}
            alt="user"
            className="w-[60%] h-[60%] object-contain"
            onClick={() => {
              navigate("/");
              setMenuActive("Dashboard");
            }}
          />
        </div>

        <img
          src={menu}
          alt="menu"
          className="w-9 h-9 object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute top-16 right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${
            !toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"
          } transition-all duration-700`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${
                  menuActive === link.name && "bg-[#3a3a43]"
                }`}
                onClick={() => {
                  if (!link.disabled) {
                    setMenuActive(link.name);
                    setToggleDrawer(false);
                    navigate(link.link);
                  }
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-6 h-6 object-contain ${
                    menuActive === link.name ? "grayscale-0" : "grayscale"
                  }`}
                />
                <p
                  className={`ml-5 font-epilogue font-semibold text-sm ${
                    menuActive === link.name
                      ? "text-[#1dc071]"
                      : "text-[#808191]"
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mx-4">
            <CustomButton
              btnType="button"
              title={
                address
                  ? "Create a campaign"
                  : isConnecting
                  ? "Connecting..."
                  : "Connect"
              }
              styles={address ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
              handleClick={async () => {
                if (address) navigate("create-campaign");
                else
                  connect(async () => {
                    if (injectedProvider("io.metamask")) {
                      await wallet.connect({ client });
                    } else {
                      await wallet.connect({
                        client,
                        walletConnect: { showQrModal: true },
                      });
                    }

                    return wallet;
                  });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
