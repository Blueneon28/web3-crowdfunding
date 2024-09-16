import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import {
  CampaignDetails,
  CreateCampaign,
  Home,
  Profile,
  SearchResult,
} from "./pages";
import { Navbar, Sidebar } from "./components";

const App: FC = () => {
  return (
    <div className="relative p-4 bg-[#13131a] min-h-screen flex">
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>

      <nav className="flex-1 max-sm:w-full max-w-7xl mx-auto sm:pr-5">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/campaign-details/:id" element={<CampaignDetails />} />
          <Route path="/search" element={<SearchResult />} />
        </Routes>
      </nav>
    </div>
  );
};

export default App;
