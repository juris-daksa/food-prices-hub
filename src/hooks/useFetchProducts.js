import { useState, useEffect, useCallback } from "react";
import api from "../api";

const useFetchProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await api.get("/products");
      const data = response.data;

      if (Array.isArray(data)) {
        setProducts(
          data.map((product) => ({
            ...product,
            displayPrice: product.prices.retail.price,
            displayComparablePrice: product.prices.retail.comparable,
          }))
        );
      } else {
        console.error("Data is not an array:", data);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading };
};

export default useFetchProducts;
