import React, { useMemo, useEffect, useState } from "react";
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
import { createCustomSort } from "./utils/utils";
import { useProducts } from "../../context/ProductsProvider"
import { useSearch } from "../../context/SearchProvider";


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
  const { searchValue } = useSearch();
  const [showDiscountPrice, setShowDiscountPrice] = useState(true);
  const [showLoyaltyPrice, setShowLoyaltyPrice] = useState(true);

  const displayedProducts = useMemo(() => {
    if (!products) return [];
    return products.map((product) => ({
      ...product,
      displayPrice:
        showDiscountPrice && product.prices.discount?.price != null
          ? product.prices.discount.price
          : showLoyaltyPrice && product.prices.loyalty?.price != null
          ? product.prices.loyalty.price
          : product.prices.retail.price,
      displayComparablePrice:
        showDiscountPrice && product.prices.discount?.comparable != null
          ? product.prices.discount.comparable
          : showLoyaltyPrice && product.prices.loyalty?.comparable != null
          ? product.prices.loyalty.comparable
          : product.prices.retail.comparable,
    }));
  }, [products, showDiscountPrice, showLoyaltyPrice]);

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
        accessor: "displayComparablePrice",
        width: "1",
        sortType: createCustomSort("displayComparablePrice"),
      },
    ],
    [showDiscountPrice, showLoyaltyPrice]
  );

  const tableInstance = useTable(
    {
      columns,
      data: displayedProducts,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    tableInstance.setGlobalFilter(searchValue);
  }, [searchValue, tableInstance]);


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
    <div>
      <div className="table-action-container">
          <FilterSection
            showDiscountPrice={showDiscountPrice}
            setShowDiscountPrice={setShowDiscountPrice}
            showLoyaltyPrice={showLoyaltyPrice}
            setShowLoyaltyPrice={setShowLoyaltyPrice}
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
