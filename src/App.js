import React from "react";
import "./styles/App.scss";
import { ProductsProvider } from "./context/ProductsProvider";
import { SearchProvider } from "./context/SearchProvider";
import FoodPricesTable from "./components/FoodPricesTable/FoodPricesTable.component";
import SearchBar from "./components/SearchBar/SearchBar.component";

const App = () => {
  return (
    <ProductsProvider>
      <SearchProvider>
        <div className="container table-wrap">
          <div class="row">
            <div className="col-12 col-sm-8 col-md-5">
            <SearchBar />
            </div>
          </div>
          <FoodPricesTable />
        </div>
      </SearchProvider>
    </ProductsProvider>
  );
};

export default App;