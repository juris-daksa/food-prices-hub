
/**
 * Debounce function to delay the processing of the input until the user has stopped typing.
 * @param {Function} func - The function to be debounced.
 * @param {number} wait - The amount of time to wait before invoking the function.
 * @returns {Function} - Returns a new debounced function.
 */
export const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };
  
/**
 * Custom sorting function to handle null values and sort numbers in ascending order.
 * @param {Object} rowA - The first row to compare.
 * @param {Object} rowB - The second row to compare.
 * @param {string} accessor - The accessor for the value to sort by.
 * @returns {number} - Returns the comparison result.
 */
const customSort = (rowA, rowB, accessor) => {
  const getValue = (row) => accessor.split('.').reduce((obj, key) => obj && obj[key], row.original) ?? Infinity;
  const a = getValue(rowA);
  const b = getValue(rowB);
  return parseFloat(a) - parseFloat(b);
};

/**
 * Wrapper function to create custom sort function for columns.
 * @param {string} accessor - The accessor for the value to sort by.
 * @returns {Function} - Returns the custom sort function.
 */
export const createCustomSort = (accessor) => (rowA, rowB) => customSort(rowA, rowB, accessor);
