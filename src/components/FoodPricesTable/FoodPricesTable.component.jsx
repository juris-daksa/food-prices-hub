import React, { useMemo, useEffect, useState, useCallback } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/FoodPricesTable.styles.scss";
import ProductsTable from "./ProductsTable.component";
import Pagination from "./Pagination.component";
import FilterSection from "./FilterSection.component";
import { useProducts } from "../../context/ProductsProvider";
import { useSearch } from "../../context/SearchProvider";

const storeColorMap = {
  barbora: "bg-primary",
  rimi: "bg-danger",
  gemoss: "bg-info",
  cesars: "bg-success",
};

const FoodPricesTable = () => {
  const { products } = useProducts();
  const { searchValue } = useSearch();
  const [showDiscountPrice, setShowDiscountPrice] = useState(true);
  const [showLoyaltyPrice, setShowLoyaltyPrice] = useState(true);
  const [filterDiscounts, setFilterDiscounts] = useState(true);
  const [priceSortMode, setPriceSortMode] = useState(null);
  const [savedPageIndex, setSavedPageIndex] = useState(0);

  useEffect(() => {
    if (searchValue.trim() !== "") {
      setFilterDiscounts(false);
    }
  }, [searchValue]);

  const cycleSortMode = useCallback(() => {
    let newMode;
    if (priceSortMode === null) newMode = "priceAsc";
    else if (priceSortMode === "priceAsc") newMode = "priceDesc";
    else if (priceSortMode === "priceDesc") newMode = "discountDesc";
    else if (priceSortMode === "discountDesc") newMode = null;
    setPriceSortMode(newMode);
  }, [priceSortMode]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) => {
      const titleMatch = product.title
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      if (!filterDiscounts) return titleMatch;
      const hasAvailableDiscount =
        (showDiscountPrice && product.prices.discount?.price != null) ||
        (showLoyaltyPrice && product.prices.loyalty?.price != null);
      return titleMatch && hasAvailableDiscount;
    });
  }, [products, searchValue, filterDiscounts, showDiscountPrice, showLoyaltyPrice]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.map((product) => {
      const displayPrice =
        showDiscountPrice && product.prices.discount?.price != null
          ? product.prices.discount.price
          : showLoyaltyPrice && product.prices.loyalty?.price != null
          ? product.prices.loyalty.price
          : product.prices.retail.price;
      const displayComparablePrice =
        showDiscountPrice && product.prices.discount?.comparable != null
          ? product.prices.discount.comparable
          : showLoyaltyPrice && product.prices.loyalty?.comparable != null
          ? product.prices.loyalty.comparable
          : product.prices.retail.comparable;
      return {
        ...product,
        displayPrice,
        displayComparablePrice,
      };
    });
  }, [filteredProducts, showDiscountPrice, showLoyaltyPrice]);

  const columns = useMemo(
    () => [
      {
        Header: "Discount",
        accessor: "discountPercentage",
      },
      {
        Header: () => <span title="Kārtot pēc alfabēta">Produkts</span>,
        accessor: "title",
        width: "4",
        Cell: ({ row }) => (
          <div>
            <span
              className={`badge me-2 ${
                storeColorMap[row.original.store_name] || "bg-info"
              }`}
              style={{ fontSize: "0.75em" }}
            >
              {row.original.store_name}
            </span>
            {row.original.title}
          </div>
        ),
      },
      {
        Header: () => <span title="Kārtot pēc kategorijas">Kategorija</span>,
        accessor: "category",
        width: "2",
      },
      {
        Header: () => {
          let iconComponent = null;
          if (priceSortMode === "priceAsc") {
            iconComponent = (
              <span className="ms-2">
                <i className="bi bi-arrow-up"></i>
                <span className="ms-1">€</span>
              </span>
            );
          } else if (priceSortMode === "priceDesc") {
            iconComponent = (
              <span className="ms-2">
                <i className="bi bi-arrow-down"></i>
                <span className="ms-1">€</span>
              </span>
            );
          } else if (priceSortMode === "discountDesc") {
            iconComponent = (
              <span className="ms-2">
                <i className="bi bi-arrow-down"></i>
                <span className="ms-1">%</span>
              </span>
            );
          }
          return (
            <div
              onClick={(e) => {
                e.stopPropagation();
                cycleSortMode();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              title="Kārtot pēc cenas/atlaides"
            >
              <span>Cena</span>
              {iconComponent}
            </div>
          );
        },
        accessor: "displayPrice",
        disableSortBy: true,
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
                    style={{ fontSize: "0.75em" }}
                  >
                    -{row.original.prices.discount.discount_percentage}%
                  </span>
                )}
              {showLoyaltyPrice &&
                row.original.prices.loyalty &&
                row.original.prices.loyalty.loyalty_discount_percentage && (
                  <span
                    className="badge bg-warning ms-2"
                    style={{ fontSize: "0.75em" }}
                  >
                    -{row.original.prices.loyalty.loyalty_discount_percentage}%
                  </span>
                )}
            </div>
          );
        },
        width: "1",
        sortType: (rowA, rowB, columnId) => {
          if (priceSortMode === "priceAsc" || priceSortMode === "priceDesc") {
            const a = parseFloat(rowA.values[columnId]) || 0;
            const b = parseFloat(rowB.values[columnId]) || 0;
            return a - b;
          } else if (priceSortMode === "discountDesc") {
            const getActiveDiscount = (product) => {
              let disc = 0;
              if (showDiscountPrice && product.prices.discount?.discount_percentage) {
                disc = product.prices.discount.discount_percentage;
              }
              if (showLoyaltyPrice && product.prices.loyalty?.loyalty_discount_percentage) {
                disc = Math.max(
                  disc,
                  product.prices.loyalty.loyalty_discount_percentage
                );
              }
              return disc;
            };
            const a = getActiveDiscount(rowA.original);
            const b = getActiveDiscount(rowB.original);
            return a - b;
          } else {
            return 0;
          }
        },
      },
      {
        Header: () => (
          <span title="Kārtot pēc cenas par vienību">Par vienību</span>
        ),
        accessor: "displayComparablePrice",
        width: "1",
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
        sortType: (rowA, rowB, columnId) => {
          const a = parseFloat(rowA.values[columnId]) || 0;
          const b = parseFloat(rowB.values[columnId]) || 0;
          return a - b;
        },
      },
    ],
    [priceSortMode, cycleSortMode, showDiscountPrice, showLoyaltyPrice]
  );

  const tableInstance = useTable(
    {
      columns,
      data: displayedProducts,
      initialState: {
        pageIndex: savedPageIndex,
        pageSize: 10,
        sortBy: [], 
        hiddenColumns: ["discountPercentage"],
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    if (priceSortMode === "priceAsc") {
      tableInstance.setSortBy([{ id: "displayPrice", desc: false }]);
    } else if (priceSortMode === "priceDesc") {
      tableInstance.setSortBy([{ id: "displayPrice", desc: true }]);
    } else if (priceSortMode === "discountDesc") {
      tableInstance.setSortBy([{ id: "displayPrice", desc: true }]);
    } else {
      tableInstance.setSortBy([]);
    }
  }, [priceSortMode, tableInstance]);

  useEffect(() => {
    tableInstance.setGlobalFilter(searchValue);
    setSavedPageIndex(0);
    tableInstance.gotoPage(0);
  }, [searchValue, tableInstance]);

  useEffect(() => {
    tableInstance.gotoPage(savedPageIndex);
  }, [savedPageIndex, tableInstance]);

  useEffect(() => {
    setSavedPageIndex(tableInstance.state.pageIndex);
  }, [showDiscountPrice, showLoyaltyPrice, tableInstance.state.pageIndex]);

  return (
    <div>
      <div className="table-action-container">
        <FilterSection
          showDiscountPrice={showDiscountPrice}
          setShowDiscountPrice={setShowDiscountPrice}
          showLoyaltyPrice={showLoyaltyPrice}
          setShowLoyaltyPrice={setShowLoyaltyPrice}
          filterDiscounts={filterDiscounts}
          setFilterDiscounts={setFilterDiscounts}
          disableDiscountFilterToggle={searchValue.trim() !== ""}
        />
      </div>
      <div className="table-responsive">
        <ProductsTable
          getTableProps={tableInstance.getTableProps}
          getTableBodyProps={tableInstance.getTableBodyProps}
          headerGroups={tableInstance.headerGroups}
          prepareRow={tableInstance.prepareRow}
          page={tableInstance.page}
        />
      </div>
      <Pagination
        pageIndex={tableInstance.state.pageIndex}
        pageOptions={tableInstance.pageOptions}
        canPreviousPage={tableInstance.canPreviousPage}
        canNextPage={tableInstance.canNextPage}
        previousPage={tableInstance.previousPage}
        nextPage={tableInstance.nextPage}
        gotoPage={tableInstance.gotoPage}
        pageSize={tableInstance.state.pageSize}
        setPageSize={tableInstance.setPageSize}
      />
    </div>
  );
};

export default FoodPricesTable;
