
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
   * @returns {number} - Returns the comparison result.
   */
  export const customSort = (rowA, rowB) => {
    const a = rowA.original.comparable_price != null ? parseFloat(rowA.original.comparable_price) : Infinity;
    const b = rowB.original.comparable_price != null ? parseFloat(rowB.original.comparable_price) : Infinity;
    return a - b;
  };
  