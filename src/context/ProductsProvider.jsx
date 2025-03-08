import React, { createContext, useContext } from "react";
import useFetchProducts from "../hooks/useFetchProducts";

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const { products, loading } = useFetchProducts();

  return (
    <ProductsContext.Provider value={{ products, loading }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  return useContext(ProductsContext);
};