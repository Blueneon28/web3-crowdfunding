import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { getContract, prepareContractCall, toWei } from "thirdweb";
import { createWallet } from "thirdweb/wallets";
import { sepolia } from "thirdweb/chains";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { client } from "../client";

interface CampaignForm {
  title: string;
  description: string;
  target: number | bigint;
  deadline: string;
  image: string;
}

interface StateContextProps {
  menuActive: string;
  setMenuActive: Dispatch<SetStateAction<string>>;
  campaignsData: any[];
  setCampaignsData: Dispatch<SetStateAction<any[]>>;
  client: typeof client;
  address: string | undefined;
  wallet: any;
  contract: any;
  createCampaign: (form: CampaignForm) => void;
  donateCampaign: (pId: number, amount: string) => void;
}

const StateContext = createContext<StateContextProps | undefined>(undefined);

interface StateContextProviderProps {
  children: ReactNode;
}

export const StateContextProvider: FC<StateContextProviderProps> = ({
  children,
}) => {
  const [menuActive, setMenuActive] = useState<string>("Dashboard");
  const [campaignsData, setCampaignsData] = useState<any[]>([]);

  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;

  const wallet = createWallet("io.metamask");

  const contract = getContract({
    client,
    chain: sepolia,
    address: import.meta.env.VITE_SMART_CONTRACT_ADDRESS as string,
  });

  const { mutate: sendTransaction } = useSendTransaction();

  const createCampaign = (form: CampaignForm) => {
    if (!address) {
      throw new Error("Address is undefined.");
    }

    const transaction = prepareContractCall({
      contract,
      method:
        "function createCampaign(address _owner, string _title, string _description, uint256 _target, uint256 _deadline, string _image) returns (uint256)",
      params: [
        address,
        form.title,
        form.description,
        BigInt(form.target),
        BigInt(new Date(form.deadline).getTime()),
        form.image,
      ],
    });

    sendTransaction(transaction);
  };

  const donateCampaign = (pId: number, amount: string) => {
    const transaction = prepareContractCall({
      contract,
      method: "function donateCampaign(uint256 _id) payable",
      params: [BigInt(pId)],
      value: toWei(amount),
    });
    sendTransaction(transaction);
  };

  return (
    <StateContext.Provider
      value={{
        menuActive,
        setMenuActive,
        campaignsData,
        setCampaignsData,
        client,
        address,
        wallet,
        contract,
        createCampaign,
        donateCampaign,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = (): StateContextProps => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error(
      "useStateContext must be used within a StateContextProvider"
    );
  }
  return context;
};
