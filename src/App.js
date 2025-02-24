import React from "react";
import "./styles/App.scss";
import { ProductsProvider, useProducts } from "./context/ProductsProvider";
import { SearchProvider } from "./context/SearchProvider";
import FoodPricesTable from "./components/FoodPricesTable/FoodPricesTable.component";
import SearchBar from "./components/SearchBar/SearchBar.component";

const App = () => {
  return (
    <ProductsProvider>
      <SearchProvider>
        <AppContent />
      </SearchProvider>
    </ProductsProvider>
  );
};

const AppContent = () => {
  const { loading, error } = useProducts();

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message || "Something went wrong"}</div>;
  }

  return (
    <div className="container table-wrap">
      <div className="row">
        <div className="col-12 col-sm-8 col-md-5">
          <SearchBar />
        </div>
      </div>
      <FoodPricesTable />
    </div>
  );
};

export default App;
