import React, { useState, useMemo } from "react";
import { useSearch } from "../../context/SearchProvider";
import "./SearchBar.styles.scss";

const SearchBar = () => {
  const { setSearchValue } = useSearch();
  const [localSearch, setLocalSearch] = useState("");

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const debouncedSetSearchValue = useMemo(
    () => debounce(setSearchValue, 300),
    [setSearchValue]
  );

  const handleChange = (e) => {
    setLocalSearch(e.target.value);
    debouncedSetSearchValue(e.target.value);
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    setSearchValue(""); // Clear immediately
  };

  return (
    <div className="search-bar-container">
      <input
        className="form-control"
        value={localSearch}
        onChange={handleChange}
        placeholder="Meklēt"
      />
      {localSearch && (
        <i className="bi bi-x-lg clear-button" onClick={handleClearSearch}></i>
      )}
    </div>
  );
};

export default SearchBar;
