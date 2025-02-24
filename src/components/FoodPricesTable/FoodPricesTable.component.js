import React, { useMemo, useCallback, useEffect, useState } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import { debounce, createCustomSort } from "./utils/utils.js";
import { useProducts } from "../../context/ProductsProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/FoodPricesTable.styles.scss";
import SearchBar from "./SearchBar.component";
import ProductsTable from "./ProductsTable.component";
import Pagination from "./Pagination.component";
import FilterSection from "./FilterSection.component";

const storeColorMap = {
  barbora: "bg-primary",
  rimi: "bg-danger",
};

const accessors = {
  title: "title",
  category: "category",
  retailPrice: "prices.retail.price",
  comparablePrice: "prices.retail.comparable",
};

const FoodPricesTable = () => {
  const { products, loading, error } = useProducts();   
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [showDiscountPrice, setShowDiscountPrice] = useState(true);
  const [showLoyaltyPrice, setShowLoyaltyPrice] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSizeState] = useState(10);

  const updateDisplayedProducts = useCallback((data, showDiscount, showLoyalty) => {
    const updatedData = data.map((product) => ({
      ...product,
      displayPrice:
        showDiscount && product.prices.discount?.price != null
          ? product.prices.discount.price
          : showLoyalty && product.prices.loyalty?.price != null
          ? product.prices.loyalty.price
          : product.prices.retail.price,
      displayComparablePrice:
        showDiscount && product.prices.discount?.comparable != null
          ? product.prices.discount.comparable
          : showLoyalty && product.prices.loyalty?.comparable != null
          ? product.prices.loyalty.comparable
          : product.prices.retail.comparable,
    }));
    setDisplayedProducts(updatedData);
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: () => <span title="Kārtot pēc alfabēta">Produkts</span>,
        accessor: accessors.title,
        width: "4",
        Cell: ({ row }) => (
          <div>
            <span
              className={`badge me-2 ${
                storeColorMap[row.original.store_name] || "bg-info"
              }`}
              style={{ fontSize: "0.75em" }}>
              {row.original.store_name}
            </span>
            {row.original.title}
          </div>
        ),
      },
      {
        Header: () => <span title="Kārtot pēc kategorijas">Kategorija</span>,
        accessor: accessors.category,
        width: "2",
      },
      {
        Header: () => <span title="Kārtot pēc cenas">Cena</span>,
        accessor: "displayPrice",
        Cell: ({ row }) => {
          const price = parseFloat(row.original.displayPrice);
          return (
            <div>
              {!isNaN(price) ? `€${price.toFixed(2)}` : "-"}
              {showDiscountPrice &&
                row.original.prices.discount &&
                row.original.prices.discount.discount_percentage && (
                  <span
                    className="badge bg-success ms-2"
                    style={{ fontSize: "0.75em" }}>
                    -{row.original.prices.discount.discount_percentage}%
                  </span>
                )}
              {showLoyaltyPrice &&
                row.original.prices.loyalty &&
                row.original.prices.loyalty.loyalty_discount_percentage && (
                  <span
                    className="badge bg-warning ms-2"
                    style={{ fontSize: "0.75em" }}>
                    -{row.original.prices.loyalty.loyalty_discount_percentage}%
                  </span>
                )}
            </div>
          );
        },
        width: "1",
        sortType: createCustomSort("displayPrice"),
      },
      {
        Header: () => (
          <span title="Kārtot pēc cenas par vienību">Par vienību</span>
        ),        
        accessor: "displayComparablePrice",
        Cell: ({ row }) => {
          const comparablePrice =
            row.original.displayComparablePrice != null
              ? parseFloat(row.original.displayComparablePrice)
              : "-";
          return comparablePrice !== "-"
            ? `${
                typeof comparablePrice === "number"
                  ? comparablePrice.toFixed(2)
                  : comparablePrice
              } €/${row.original.prices.unit}`
            : "-";
        },
        width: "1",
        sortType: createCustomSort("displayComparablePrice"),
      },
    ],
    [showDiscountPrice, showLoyaltyPrice]
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
    state,
    setGlobalFilter,
    setPageSize: setTablePageSize,
  } = useTable(
    {
      columns,
      data: displayedProducts,
      initialState: { pageIndex, pageSize },
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
    [setGlobalFilter]
  );

  useEffect(() => {
    updateDisplayedProducts(products, showDiscountPrice, showLoyaltyPrice);
    debouncedSetGlobalFilter(searchValue);
  }, [
    products,
    showDiscountPrice,
    showLoyaltyPrice,
    searchValue,
    updateDisplayedProducts,
    debouncedSetGlobalFilter,
  ]);

  const handleDiscountCheckboxChange = useCallback(() => {
    setShowDiscountPrice((prev) => !prev);
  }, []);

  const handleLoyaltyCheckboxChange = useCallback(() => {
    setShowLoyaltyPrice((prev) => !prev);
  }, []);

  const handleSearchChange = useCallback(
    (value) => {
      setSearchValue(value);
      setPageIndex(0);
      gotoPage(0);
      debouncedSetGlobalFilter(value);
    },
    [debouncedSetGlobalFilter, gotoPage]
  );

  const handleClearSearch = useCallback(() => {
    setSearchValue("");
    setPageIndex(0);
    gotoPage(0);
    setGlobalFilter("");
  }, [setGlobalFilter, gotoPage]);

  const handlePageSizeChange = useCallback(
    (newPageSize) => {
      setPageSizeState(newPageSize);
      setTablePageSize(newPageSize);
    },
    [setTablePageSize]
  );

  useEffect(() => {
    setPageIndex(state.pageIndex);
  }, [state.pageIndex]);

  const productsTableProps = useMemo(
    () => ({
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page,
    }),
    [getTableProps, getTableBodyProps, headerGroups, prepareRow, page]
  );

  const paginationProps = useMemo(
    () => ({
      pageIndex,
      pageOptions,
      canPreviousPage,
      canNextPage,
      previousPage,
      nextPage,
      gotoPage,
      pageSize,
      setPageSize: handlePageSizeChange,
    }),
    [
      pageIndex,
      pageOptions,
      canPreviousPage,
      canNextPage,
      previousPage,
      nextPage,
      gotoPage,
      pageSize,
      handlePageSizeChange,
    ]
  );

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message || error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="table-action-container row">
        <div class="col-sm-8 col-md-5 col-12">
          <SearchBar
            searchValue={searchValue}
            handleSearchChange={handleSearchChange}
            handleClearSearch={handleClearSearch}
          />
        </div>
        <div class="col-sm-8 col-md-7 col-12">
          <FilterSection
            showDiscountPrice={showDiscountPrice}
            handleDiscountCheckboxChange={handleDiscountCheckboxChange}
            showLoyaltyPrice={showLoyaltyPrice}
            handleLoyaltyCheckboxChange={handleLoyaltyCheckboxChange}
          />
        </div>
      </div>

      <div className="table-responsive">
        <ProductsTable {...productsTableProps} />
      </div>

      <Pagination {...paginationProps} />
    </div>
  );
};

export default FoodPricesTable;
