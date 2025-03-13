import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8081/Java_Web_211_war";

export default function Shop() {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("🛍️ Виберіть категорію для перегляду товарів");
  const [loadingCategories, setLoadingCategories] = useState(false);

  const navigate = useNavigate();

  
  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Получение категорий
  const fetchCategories = async () => {
    setLoadingCategories(true);
    setMessage("⏳ Завантаження категорій...");

    try {
      const response = await fetch(`${BASE_URL}/products?type=categories`);
      const data = await response.json();

      setCategories(data);
      setMessage("✅ Категорії завантажено");
    } catch (error) {
      console.error("❌ Помилка при завантаженні категорій:", error);
      setMessage("❌ Не вдалося завантажити категорії");
    } finally {
      setLoadingCategories(false);
    }
  };

  // Навигация при выборе категории (используем slug)
  const handleCategoryClick = (categorySlug) => {
    console.log(`➡️ Переходим в категорию: ${categorySlug}`);
    navigate(`/category/${categorySlug}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛒 Крамниця</h1>

      {/* Сообщение */}
      {message && <div style={styles.message}>{message}</div>}

      {/*  Блок категорий */}
      <section style={styles.categoriesBlock}>
        <h2>📂 Категорії</h2>

        {loadingCategories && <p>⏳ Завантаження категорій...</p>}

        <div style={styles.categoriesGrid}>
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.categoryId}
                style={styles.categoryCard}
                onClick={() => handleCategoryClick(category.categorySlug)} 
              >
                <img
                  src={`${BASE_URL}/storage/${category.categoryImageId}`}
                  alt={category.categoryTitle}
                  style={styles.categoryImage}
                />
                <h3>{category.categoryTitle}</h3>
              </div>
            ))
          ) : !loadingCategories ? (
            <p>🤷‍♂️ Категорії не знайдено</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px",
  },
  message: {
    marginBottom: "20px",
    fontSize: "1rem",
    color: "#444",
  },
  categoriesBlock: {
    marginBottom: "40px",
  },
  categoriesGrid: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  categoryCard: {
    width: "200px",
    padding: "10px",
    border: "2px solid #ccc",
    borderRadius: "10px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    transition: "transform 0.3s, border-color 0.3s",
  },
  categoryImage: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px",
  },
};