import {
  ChangeEvent,
  FC,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CustomButton from "./CustomButton";

interface Item {
  id: string;
  title: string;
}

interface SearchBoxProps {
  items: Item[];
  onSearchResult: (results: Item[], keyword: string) => void;
  onClearSearch: () => void;
}

const useClickOutside = (
  ref: RefObject<HTMLDivElement>,
  handler: () => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

const SearchBox: FC<SearchBoxProps> = ({
  items,
  onSearchResult,
  onClearSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedSearches = localStorage.getItem("crowdfunding-recentSearches");
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  const recommendations = useMemo(() => {
    if (searchTerm.trim() === "") {
      return [];
    }
    return items
      .filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5)
      .map((item) => item.title);
  }, [searchTerm, items]);

  const handleSearch = (term: string) => {
    const results = items.filter((item) =>
      item.title.toLowerCase().includes(term.toLowerCase())
    );
    onSearchResult(results, term);

    const updatedSearches = [
      term,
      ...recentSearches.filter((s) => s !== term),
    ].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem(
      "crowdfunding-recentSearches",
      JSON.stringify(updatedSearches)
    );

    setSearchTerm(term);
    setShowRecentSearches(false);
    setShowRecommendations(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    setShowRecommendations(true);
    if (newTerm.trim() === "") {
      setShowRecommendations(false);
    }
  };

  const handleFocus = () => {
    if (searchTerm.trim() === "") {
      setShowRecentSearches(true);
    } else {
      setShowRecommendations(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowRecentSearches(false);
      setShowRecommendations(false);
    }, 200);
  };

  const handleClickOutside = () => {
    setShowRecentSearches(false);
    setShowRecommendations(false);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setShowRecommendations(false);
    setShowRecentSearches(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    onClearSearch();
  };

  useClickOutside(wrapperRef, handleClickOutside);

  return (
    <div ref={wrapperRef} className="relative lg:flex-1 w-full md:w-3/4 flex">
      <div className="relative flex-1 flex items-center w-full md:w-80 py-2 pl-4 pr-2 h-14 bg-[#1c1c24] rounded-full">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="flex w-full font-epilogue font-normal text-sm placeholder:text-[#4b5264] text-white bg-transparent outline-none"
          placeholder="Search for campaigns"
        />
        {searchTerm && (
          <CustomButton
            btnType="button"
            title={"Clear"}
            styles={
              "p-1 rounded-full hover:bg-[#3a3a43] transition-colors duration-200 w-20"
            }
            handleClick={handleClearSearch}
          />
        )}
      </div>
      {(showRecentSearches || showRecommendations) && (
        <div className="absolute z-10 w-full md:w-1/2 mt-1 bg-[#28282e] border border-[#3a3a43] rounded-lg shadow-lg top-full">
          {showRecentSearches &&
            searchTerm.trim() === "" &&
            recentSearches.length > 0 && (
              <>
                <div className="px-4 py-2 text-[#4b5264] font-epilogue text-[12px] flex items-center">
                  Recent Searches
                </div>
                <ul>
                  {recentSearches.map((search, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-[#3a3a43] cursor-pointer text-white font-epilogue text-sm"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSearch(search)}
                    >
                      {search}
                    </li>
                  ))}
                </ul>
              </>
            )}
          {showRecommendations && (
            <>
              <div className="px-4 py-2 text-[#4b5264] font-epilogue text-xs flex items-center">
                Recommendations
              </div>
              {recommendations.length > 0 ? (
                <ul>
                  {recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-[#3a3a43] cursor-pointer text-white font-epilogue text-sm"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSearch(rec)}
                    >
                      {rec}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-2 font-epilogue text-sm text-white">
                  No results found.
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
