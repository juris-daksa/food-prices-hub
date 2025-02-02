import React from 'react';

const Pagination = ({
  pageIndex,
  pageOptions,
  canPreviousPage,
  canNextPage,
  previousPage,
  nextPage,
  gotoPage,
  pageSize,
  setPageSize
}) => {
  const renderPageNumbers = () => {
    const pageNumberItems = [];
    const totalPages = pageOptions.length;
    const numberOfPageButtons = window.innerWidth < 1000 ? 3 : 5;

    if (pageIndex < Math.floor(numberOfPageButtons / 2)) {
      for (let i = 0; i < Math.min(numberOfPageButtons, totalPages); i++) {
        pageNumberItems.push(
          <li key={i} className={"page-item " + (pageIndex === i ? 'active' : '')}>
            <a className="page-number" onClick={() => gotoPage(i)} href="#!" aria-label={`Lapa ${i + 1}`}>
              {i + 1}
            </a>
          </li>
        );
      }
    } else if (pageIndex >= totalPages - Math.floor(numberOfPageButtons / 2)) {
      for (let i = totalPages - numberOfPageButtons; i < totalPages; i++) {
        if (i >= 0) {
          pageNumberItems.push(
            <li key={i} className={"page-item " + (pageIndex === i ? 'active' : '')}>
              <a className="page-number" onClick={() => gotoPage(i)} href="#!" aria-label={`Lapa ${i + 1}`}>
                {i + 1}
              </a>
            </li>
          );
        }
      }
    } else {
      for (let i = pageIndex - Math.floor(numberOfPageButtons / 2); i < (pageIndex - Math.floor(numberOfPageButtons / 2) + numberOfPageButtons); i++) {
        pageNumberItems.push(
          <li key={i} className={"page-item " + (pageIndex === i ? 'active' : '')}>
            <a className="page-number" onClick={() => gotoPage(i)} href="#!" aria-label={`Lapa ${i + 1}`}>
              {i + 1}
            </a>
          </li>
        );
      }
    }

    return pageNumberItems;
  };

  return (
    <div className="pagination-container">
      <div className="page-count">
        <span>{'Lapa ' + (pageIndex + 1) + ' no ' + pageOptions.length}</span>
      </div>
      <div className="pagination justify-content-center">
        <ul className="pagination" aria-label="Table pagination">
          <li className={"page-item " + (canPreviousPage ? '' : 'disabled')}>
            <a className="page-link" onClick={() => previousPage()} href="#!" aria-label="Previous page">Atpakaļ</a>
          </li>
          {renderPageNumbers()}
          <li className={"page-item " + (canNextPage ? '' : 'disabled')}>
            <a className="page-link" onClick={() => nextPage()} href="#!" aria-label="Next page">Uz priekšu</a>
          </li>
        </ul>
      </div>
      <div className={`page-size-selector ${window.innerWidth < 1000 ? 'hidden' : ''}`}>
        <select
          className="form-select form-select-sm mt-2 mb-4"
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
        >
          {[10, 25, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Rādīt {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
