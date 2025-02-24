import React from 'react';

const FilterSection = ({
  showDiscountPrice,
  handleDiscountCheckboxChange
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
    </div>
  );
};

export default FilterSection;
