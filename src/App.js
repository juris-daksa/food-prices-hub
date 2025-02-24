import React from "react";
import "./styles/App.scss";
import FoodPricesTable from "./components/FoodPricesTable/FoodPricesTable.component";
import { ProductsProvider } from "./context/ProductsProvider";

function App() {
  return (
    <div className="App">
      <ProductsProvider>
        <FoodPricesTable />
      </ProductsProvider>
    </div>
  );
}

export default App;