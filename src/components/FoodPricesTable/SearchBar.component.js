import React from 'react';

const SearchBar = ({ searchValue, handleSearchChange, handleClearSearch }) => {
  return (
    <div className="search-bar-container">
      <input
        className="form-control"
        value={searchValue}
        onChange={e => handleSearchChange(e.target.value)}
        placeholder="Meklēt"
      />
      {searchValue && (
        <i className="bi bi-x-lg clear-button" onClick={handleClearSearch}></i>
      )}
    </div>
  );
};

export default SearchBar;
