import React from 'react';

const FilterSection = ({
  showDiscountPrice,
  handleDiscountCheckboxChange,
  showLoyaltyPrice,
  handleLoyaltyCheckboxChange      
}) => {
  return (
    <div className="filter-section">
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          checked={showDiscountPrice}
          onChange={handleDiscountCheckboxChange}
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
          onChange={handleLoyaltyCheckboxChange}
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
