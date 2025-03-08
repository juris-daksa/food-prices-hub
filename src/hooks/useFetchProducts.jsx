import { useEffect, useState } from "react";
import api from "../api";

const useFetchProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        const data = response.data;

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setError("Data is not an array");
          console.error("Data is not an array:", data);
        }
      } catch (error) {
        setError(error);
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

export default useFetchProducts;
