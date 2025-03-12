import React from "react";

const FilterSection = ({
  showDiscountPrice,
  setShowDiscountPrice,
  showLoyaltyPrice,
  setShowLoyaltyPrice,
  filterDiscounts,
  setFilterDiscounts,
}) => {
  return (
    <div className="filter-section">
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          checked={showDiscountPrice}
          onChange={() => setShowDiscountPrice((prev) => !prev)}
          id="showDiscountPriceCheckbox"
        />
        <label
          className="form-check-label"
          htmlFor="showDiscountPriceCheckbox"
        >
          Atlaižu cenas
        </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          checked={showLoyaltyPrice}
          onChange={() => setShowLoyaltyPrice((prev) => !prev)}
          id="showLoyaltyPriceCheckbox"
        />
        <label
          className="form-check-label"
          htmlFor="showLoyaltyPriceCheckbox"
        >
          Klienta cenas
        </label>
      </div>
      
      <div className="mb-2">
        {filterDiscounts ? (
          <button
            type="button"
            className="btn btn-sm badge bg-success me-2"
            style={{ fontSize: "0.75em", cursor: "pointer" }}
            onClick={() => setFilterDiscounts(false)}
          >
            Atlaides %
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-sm badge bg-secondary me-2"
            style={{ fontSize: "0.75em", cursor: "pointer" }}
            onClick={() => setFilterDiscounts(true)}
          >
            Atlaides %
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterSection;