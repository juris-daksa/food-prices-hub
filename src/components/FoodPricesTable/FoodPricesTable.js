// src/components/FoodPricesTable/FoodPricesTable.js
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import api from '../../api';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchBar from './SearchBar';
import ProductsTable from './ProductsTable';
import Pagination from './Pagination';

const storeColorMap = {
  'barbora': 'bg-primary',
  'rimi': 'bg-danger'
};

const FoodPricesTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        const data = response.data;

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Data is not an array:', data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'Produkts',
        accessor: 'title',
        width: '4',
        Cell: ({ row }) => (
          <div>
            <span
              className={`badge me-2 ${storeColorMap[row.original.store_name] || 'bg-info'}`}
              style={{ fontSize: '0.75em' }}
            >
              {row.original.store_name}
            </span>
            {row.original.title}
          </div>
        )
      },
      {
        Header: 'Kategorija',
        accessor: 'category',
        width: '2'
      },
      {
        Header: 'Cena',
        accessor: 'price',
        Cell: ({ row }) => {
          const price = parseFloat(row.original.price);
          return (
            <div>
              {!isNaN(price) ? `€${price.toFixed(2)}` : row.original.price}
              {row.original.discount && (
                <span className="badge bg-success ms-2" style={{ fontSize: '0.75em' }}>-{row.original.discount}%</span>
              )}
            </div>
          );
        },
        width: '1'
      },
      {
        Header: 'Cena/vienība',
        accessor: 'comparable_price',
        Cell: ({ row }) => {
          const comparablePrice = row.original.comparable_price != null ? row.original.comparable_price : '-';
          return comparablePrice !== '-'
            ? `${typeof comparablePrice === 'number' ? comparablePrice.toFixed(2) : comparablePrice} €/${row.original.unit}`
            : '-';
        },
        width: '1',
        sortType: (rowA, rowB) => {
          const a = rowA.original.comparable_price != null ? parseFloat(rowA.original.comparable_price) : Infinity;
          const b = rowB.original.comparable_price != null ? parseFloat(rowB.original.comparable_price) : Infinity;
          return a - b;
        }
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
    state: { pageIndex, pageSize },
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

  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const debouncedSetGlobalFilter = useMemo(
    () =>
      debounce((value) => {
        setGlobalFilter(value || undefined);
      }, 300),
    [debounce, setGlobalFilter]
  );

  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
    debouncedSetGlobalFilter(value);
  }, [debouncedSetGlobalFilter]);

  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    setGlobalFilter('');
  }, [setGlobalFilter]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className='w-50'>
        <SearchBar
          searchValue={searchValue}
          handleSearchChange={handleSearchChange}
          handleClearSearch={handleClearSearch}
        />
      </div>
          
      <ProductsTable
        getTableProps={getTableProps}
        getTableBodyProps={getTableBodyProps}
        headerGroups={headerGroups}
        prepareRow={prepareRow}
        page={page}
      />

      <Pagination
        pageIndex={pageIndex}
        pageOptions={pageOptions}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        previousPage={previousPage}
        nextPage={nextPage}
        gotoPage={gotoPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </div>
  );
};

export default FoodPricesTable;
