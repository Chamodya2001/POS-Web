import React, { createContext, useContext, useEffect, useState } from "react";
import candidateFullData_service from "./service/candidateFullData_service";
import config from "../helper/config";

const ProductContext = createContext(null);
export const useProducts = () => useContext(ProductContext);

// Helper function to create URL-friendly slugs
const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");

export const ProductProvider = ({ children }) => {
  const candidate_id =4;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [candidateAllData, setCandidateAllData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await candidateFullData_service(candidate_id);
        const data = res?.data;
        console.log(data)

        if (!data) throw new Error("No data returned from API");

        // Map categories
        const mappedCategories = [
          { id: "all", name: "All Items", count: 0 },
          ...(data.categories || []).map(cat => ({
            id: slugify(cat.category_name),
            name: cat.category_name,
            count: 0, // will update later
            originalId: cat.category_id, // optional, keep reference
          }))
        ];

        // Create a mapping from category_id → slug
        const categoryMap = {};
        mappedCategories.forEach(cat => {
          if (cat.originalId) categoryMap[cat.originalId] = cat.id;
        });

        // Map products
        const mappedProducts = (data.items || []).map(item => ({
          id: String(item.item_id),
          name: item.item_name,
          category: categoryMap[item.category_id] || "all",
          price: item.sale_price,
          cost: item.cost_price,
          stock: item.current_quantity,
          sku: item.bar_code || "",
          status: item.current_quantity > 0 ? "active" : "out_of_stock",
          image: item.image_code
            ? `${config.pos_api_url}/static/images/products/${item.image_code}`
            : "/placeholder.png",
          bar_code:item.bar_code,
          discount:item.discount,
          measurement_id:item.measurement_id,
          stoke_price:item.stoke_price,
          stoke_ubdate_date:item.stoke_ubdate_date

        }));

        // Update category counts
        const categoriesWithCounts = mappedCategories.map(cat => ({
          ...cat,
          count:
            cat.id === "all"
              ? mappedProducts.length
              : mappedProducts.filter(p => p.category === cat.id).length
        }));


        // Set states
        setCandidateAllData(res);
        setCategories(categoriesWithCounts);
        setProducts(mappedProducts);

      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [candidate_id]);





  /* ================= CRUD HELPERS ================= */
  const addProduct = (product) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (id, updates) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  /* ================= CONTEXT VALUE ================= */



  return (
    <ProductContext.Provider
      value={{
        candidateAllData,
        products,
        categories,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
