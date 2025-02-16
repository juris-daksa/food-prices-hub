import React, { useEffect, useState, useMemo, useCallback } from 'react';
import api from '../../api';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/App.css';
import SearchBar from './SearchBar';
import ProductsTable from './ProductsTable';
import Pagination from './Pagination';
import { debounce, customSort } from '../../utils';

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
        sortType: customSort
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
      <div className="spinner-container">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  const productsTableProps = {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page
  };

  const paginationProps = {
    pageIndex,
    pageOptions,
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
    gotoPage,
    pageSize,
    setPageSize
  };

  return (
    <div className="container mt-4">
      <div className="search-container">
        <SearchBar
          searchValue={searchValue}
          handleSearchChange={handleSearchChange}
          handleClearSearch={handleClearSearch}
        />
      </div>

      <div className="table-responsive">
        <ProductsTable {...productsTableProps} />
      </div>

      <Pagination {...paginationProps} />
    </div>
  );
};

export default FoodPricesTable;
