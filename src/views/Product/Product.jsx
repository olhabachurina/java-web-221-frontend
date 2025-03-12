import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../AppContext.jsx";

export default function Product() {
  const { id } = useParams(); // productId из URL
  const { request } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:8081/Java_Web_211_war";

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId) => {
    setLoading(true);
    try {
      console.log(`🔎 Загружаем товар с ID: ${productId}`);
      const productData = await request(`/products?type=product&id=${productId}`);
      console.log("✅ Товар получен:", productData);
      setProduct(productData);
    } catch (error) {
      console.error("❌ Ошибка при загрузке товара:", error);
    } finally {
      setLoading(false);
    }
  };

  const productImageUrl = product?.imageId?.startsWith("http")
    ? product.imageId
    : `${BASE_URL}/storage/${product?.imageId}`;

  if (loading) {
    return <p style={styles.loading}>⏳ Завантаження товару...</p>;
  }

  if (!product) {
    return <p style={styles.error}>❌ Товар не знайдено!</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛍️ {product.name}</h1>

      <div style={styles.productInfo}>
        <img
          src={productImageUrl}
          alt={product.name}
          style={styles.productImage}
        />

        <div style={styles.details}>
          <p style={styles.price}>💰 {product.price} грн</p>
          <p style={styles.stock}>📦 На складі: {product.stock} шт</p>
          <p style={styles.code}>🏷️ Код товару: {product.code}</p>
          <p style={styles.description}>📝 {product.description || "Опис відсутній, але то не біда! 😉"}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: "32px",
    marginBottom: "20px",
  },
  productInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  productImage: {
    width: "400px",
    height: "400px",
    objectFit: "cover",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  details: {
    textAlign: "center",
  },
  price: {
    fontSize: "24px",
    color: "#28a745",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  stock: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  code: {
    fontSize: "16px",
    color: "#999",
    marginBottom: "10px",
  },
  description: {
    fontSize: "16px",
    color: "#333",
    marginTop: "20px",
  },
  loading: {
    textAlign: "center",
    fontSize: "20px",
  },
  error: {
    textAlign: "center",
    fontSize: "20px",
    color: "red",
  },
};