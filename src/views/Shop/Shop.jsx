import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // додали Link для breadcrumbs
import "./Shop.css";

const BASE_URL = "http://localhost:8081/Java_Web_211_war";

export default function Shop() {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("🛍️ Виберіть категорію для перегляду товарів");
  const [loadingCategories, setLoadingCategories] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleCategoryClick = (categorySlug) => {
    console.log(`➡️ Переходимо до категорії: ${categorySlug}`);
    navigate(`/category/${categorySlug}`);
  };

  return (
    <div className="shop-container">
      {/* Хлібні крихти */}
      <nav className="breadcrumbs">
        <Link to="/">Головна</Link> &gt; <span>Крамниця</span>
      </nav>

      <h1 className="shop-title">🛒 Крамниця</h1>

      {/* Info / Loading Message */}
      {message && <div className="shop-message">{message}</div>}

      {/* Категорії */}
      <section className="categories-section">
        <h2 className="section-title">📂 Категорії</h2>

        {loadingCategories && <p>⏳ Завантаження категорій...</p>}

        <div className="categories-grid">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.categoryId}
                className="category-card"
                onClick={() => handleCategoryClick(category.categorySlug)}
              >
                <div className="category-image-container">
                  <img
                    src={`${BASE_URL}/storage/${category.categoryImageId}`}
                    alt={category.categoryTitle}
                    className="category-image"
                  />
                </div>
                <h3 className="category-title">{category.categoryTitle}</h3>
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