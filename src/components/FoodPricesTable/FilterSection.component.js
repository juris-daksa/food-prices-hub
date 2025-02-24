import React from 'react';

const FilterSection = ({
  showDiscountPrice,
  setShowDiscountPrice,
  showLoyaltyPrice,
  setShowLoyaltyPrice      
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
          htmlFor="showDiscountPriceCheckbox">
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
          htmlFor="showLoyaltyPriceCheckbox">
          Klienta cenas
        </label>
      </div>
    </div>
  );
};

export default FilterSection;
