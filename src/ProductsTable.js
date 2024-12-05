import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Produkts',
        accessor: 'title',
      },
      {
        Header: 'Kategorija',
        accessor: 'category'
      },
      {
        Header: 'Cena, EUR',
        accessor: 'price',
        Cell: ({ value }) => (typeof value === 'number' ? `$${value.toFixed(2)}` : value)
      },
      {
        Header: 'Cena pret vienību',
        accessor: 'comparable_price',
        Cell: ({ row }) => 
          `${typeof row.original.comparable_price === 'number' ? row.original.comparable_price.toFixed(2) : row.original.comparable_price} EUR/${row.original.unit}`
      },
      {
        Header: 'Atlaide',
        accessor: 'discount',
        Cell: ({ value }) => (typeof value === 'number' ? `-${value}%` : value)
      }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter
  } = useTable(
    {
      columns,
      data: products,
      initialState: { pageIndex: 0 }
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const handleClearSearch = () => {
    setGlobalFilter('');
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">...</span>
        </div>
      </div>
    );
  }

  const renderPageNumbers = () => {
    const pageNumberItems = [];
    const totalPages = pageOptions.length;
    const numberOfPageButtons = 5;
    if (pageIndex < Math.floor(numberOfPageButtons/2)) {
      for (let i = 0; i < Math.min(numberOfPageButtons, totalPages); i++) {
        pageNumberItems.push(
          <li key={i} className={"page-item " + (pageIndex === i ? 'active' : '')}>
            <a className="page-number" onClick={() => gotoPage(i)} href="#!" aria-label={`Lapa ${i + 1}`}>
              {i + 1}
            </a>
          </li>
        );
      }
    } else if (pageIndex >= totalPages - Math.floor(numberOfPageButtons/2)) {
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
      for (let i = pageIndex - Math.floor(numberOfPageButtons/2); i < (pageIndex - Math.floor(numberOfPageButtons/2) + numberOfPageButtons); i++) {
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
    <div className="container mt-4">
      <div className='w-50'>
        <div className="search-container mb-2 mx-2 py-3 w-75 position-relative">
          <input
            className="form-control"
            value={globalFilter || ''}
            onChange={e => setGlobalFilter(e.target.value || undefined)}
            placeholder="Meklēt"
          />
          {globalFilter && (
            <i className="bi bi-x-lg clear-button" onClick={handleClearSearch}></i>
          )}
        </div>
      </div>
          
      <table className="table table-hover" {...getTableProps()}>
        <thead className="thead-dark">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <i className="bi bi-arrow-down px-2"></i>
                        : <i className="bi bi-arrow-up px-2"></i>
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="table-group-divider" {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} className={cell.column.id === 'title' ? 'text-start px-4' : ''}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
        <div className="d-flex justify-content-between">
          {'Lapa ' + (pageIndex + 1) + ' no ' + pageOptions.length}
          <div className="justify-content-center">
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
          <div className="d-flex justify-content-end">
            <select
              className="form-select form-select-sm mt-2 mb-4"
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}>
              {[10, 25, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Rādīt {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
    </div>
  );
};

export default ProductsTable;
