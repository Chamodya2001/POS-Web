import React, { createContext, useContext, useEffect, useState } from "react";
import { API } from "../services/appService";
import config from "../helper/config";
import { useAuth } from "./AuthContext";


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
  const { user } = useAuth();

  // Extract candidate_id from user. Try plural variants if needed, or 'id' as fallback
  const candidate_id = user?.candidate_id || user?.id;

  

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [candidateAllData, setCandidateAllData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const measurements ={
      1: "kg",
      2: "liters",
      3: "pieces",
      4: "packs",
      5: "boxes",
      6: "meters",
      7: "feet",
      8: "yards",
      9: "dozens",
      10: "gallons",
      11: "ounces",
      12: "pounds",
      13: "milliliters",
      14: "grams",
      15: "count"

  }


  /* ================= FETCH DATA ================= */
  useEffect(() => {
   
    if (!candidate_id) {
      console.warn("ProductContext: No candidate_id found. Skipping fetch.");
      setLoading(false);
      setProducts([]);
      setCategories([]);
      return;
    }

   fetchData();
  }, [candidate_id]);

  const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await API.getCandidateFullData(candidate_id);

        const data = res?.data;
        

        if (!data || Object.keys(data).length === 0) {
          throw new Error("No data returned from API for this candidate.");
        }

        // Map categories
        const mappedCategories = [
          { id: "all", name: "All Items", count: 0 },
          ...(data.categories || []).map(cat => ({
            id: slugify(cat.category_name),
            name: cat.category_name,
            count: 0,
            originalId: cat.category_id,
          }))
        ];

        // Create a mapping from category_id → slug
        const categoryMap = {};
        mappedCategories.forEach(cat => {
          console.log("Mapping category:", cat.originalId, "to", cat.id);
          if (cat.originalId) categoryMap[cat.originalId] = cat.id;
        });

        // Map products
        const mappedProducts = (data.items || []).map(item => ({
          id: String(item.item_id),
          name: item.item_name,
          sinhala_name: item.sinhala_name,
          category: categoryMap[item.category_id] || "all",
          price: item.sale_price,
          cost: item.cost_price,
          stock: item.current_quantity,
          sku: item.bar_code || "",
          status: item.current_quantity > 0 ? "active" : "out_of_stock",
          image: item.image_code
            ? API.getProductImageUrl(item.image_code)
            : "/placeholder.png",
          bar_code: item.bar_code,
          discount: item.discount,
          measurement_id: item.measurement_id,
          stoke_price: item.stoke_price,
          stoke_ubdate_date: item.stoke_ubdate_date
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
        setCandidateAllData(data);
        setCategories(categoriesWithCounts);
        setProducts(mappedProducts);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

  /* ================= CRUD HELPERS ================= */
  const addProduct = async (product) => {
    try {
      // Prepare backend payload from UI product shape
      const payload = buildBackendPayload(product);
      const response = await API.addProduct(payload);
      
      await fetchData();
      alert("Product saved successfully");
    
    } catch (err) {
      console.error("Failed to add product:", err);
      throw err;
    }
  };

  // Helper: build backend payload from normalized UI product or form data
  const buildBackendPayload = (data, original = {}) => {
    // merged source: original then new data (data may be form values)
    const merged = { ...original, ...data };

    // Resolve category_id: prefer explicit category_id, else look up from categories by slug
    let category_id = merged.category_id;
    if (!category_id && merged.category) {
      const found = categories.find((c) => c.id === String(merged.category));
      category_id = found?.originalId || merged.category;
    }

    return {
      candidate_id: candidate_id,
      category_id: category_id ? Number(category_id) : undefined,
      item_name: merged.name || merged.item_name,
      description: merged.description,
      measurement: merged.measurement,
      bar_code: merged.bar_code || merged.sku,
      sale_price: Number(merged.price ?? merged.sale_price ?? 0),
      stoke_price: Number(merged.cost_price ?? merged.stoke_price ?? 0),
      low_stock_alert: Number(merged.low_stock_alert ?? 0),
      discount: Number(merged.discount ?? 0),
      image_code: merged.image_code,
      status_id: (merged.status === "active" || merged.status === "Active") ? 1 : 2,
      //item_id: merged.item_id || merged.id,
    };
  };

  const updateProduct = async (id, updates) => {
    try {
      const original = products.find((p) => p.id === id) || {};
      const payload = buildBackendPayload(updates, original);
      await API.updateProduct(id, payload);
      // Update local normalized state with merged values
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  };

  const deleteProduct = (id) => {
    try {
      API.deleteProduct(id);
    } catch (err) {     
       console.error("Failed to delete product:", err);
    }
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addCategory = async (categoryData) => {
    try {
      const res = await API.saveCategory(categoryData);
      if (res) {
        // Refresh full data to get updated categories
        const fullData = await API.getCandidateFullData(candidate_id);
        if (fullData?.data?.categories) {
          const mappedCategories = [
            { id: "all", name: "All Items", count: 0 },
            ...fullData.data.categories.map(cat => ({
              id: slugify(cat.category_name),
              name: cat.category_name,
              count: 0,
              originalId: cat.category_id,
            }))
          ];
          setCategories(mappedCategories);
        }
        return res;
      }
    } catch (err) {
      console.error("Failed to add category:", err);
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await API.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.originalId !== id));
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const uploadCategoryImage = async (formData) => {
    try {
      return await API.uploadItemImage(formData); // Using item image upload for categories as per AppService
    } catch (err) {
      console.error("Failed to upload category image:", err);
      throw err;
    }
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
        deleteProduct,
        addCategory,
        deleteCategory,
        uploadCategoryImage,
        measurements,
        setProducts
        
        
      }}
    >

      {children}
    </ProductContext.Provider>
  );
};
