import React from "react";
import FoodPricesTable from "./components/FoodPricesTable/FoodPricesTable.component";
import "./styles/App.scss";
import useFetchProducts from "./hooks/useFetchProducts";

function App() {
  const { products, loading, error } = useFetchProducts();

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
    <div className="App">
      <FoodPricesTable products={products} />
    </div>
  );
}

export default App;