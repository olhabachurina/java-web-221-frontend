import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext.jsx";
import "../../PrivozTheme.css"; // Стилі, які наведу нижче

const BASE_URL = "http://localhost:8081/Java_Web_211_war";

export default function Category() {
  const { id } = useParams(); // slug з URL
  const navigate = useNavigate();
  const { request } = useContext(AppContext);

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("none");

  // Нічна тема + автоматичне вмикання після 18:00
  const [isNightMode, setIsNightMode] = useState(
    new Date().getHours() >= 18
  );

  useEffect(() => {
    loadCategoryBySlug(id);
  }, [id]);

  useEffect(() => {
    sortProducts(sortOption);
  }, [products, sortOption]);

  const loadCategoryBySlug = async (slug) => {
    setLoading(true);
    try {
      const categoryData = await request(`/products?type=category&slug=${slug}`);
      setCategory(categoryData);

      if (categoryData?.categoryId) {
        await loadProductsByCategoryId(categoryData.categoryId);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("❌ Помилка при завантаженні категорії:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProductsByCategoryId = async (categoryId) => {
    try {
      const productsData = await request(
        `/products?type=paged&limit=50&offset=0&categoryId=${categoryId}`
      );
      setProducts(productsData);
    } catch (error) {
      console.error("❌ Помилка при завантаженні товарів:", error);
    }
  };

  const sortProducts = (option) => {
    let sorted = [...products];
    switch (option) {
      case "price_asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name_asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        sorted = products;
    }
    setSortedProducts(sorted);
  };

  const handleProductClick = (productId) => {
    const opaSound = new Audio("/sounds/opa.mp3");
    opaSound.play();
    navigate(`/product/${productId}`);
  };

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
  };

  const getOdessaHumor = () => {
    return `Ну шо я вам скажу... Це "${category?.categoryTitle}" – така краса, шо аж дух захоплює! А ціни – як на Привозі після 18:00! 😉`;
  };

  return (
    <div className={`privoz-container ${isNightMode ? "night" : "day"}`}>
      <div className="top-bar">
        <button onClick={toggleNightMode} className="toggle-btn">
          {isNightMode ? "🌙 Нічний Привоз" : "☀️ Денний Привоз"}
        </button>
      </div>

      {loading || !category ? (
        <div className="loading">⏳ Завантаження даних з Привозу...</div>
      ) : (
        <>
          <h1 className="category-title">📁 {category.categoryTitle}</h1>

          <div className="category-image-block">
            <img
              src={category.categoryImageId}
              alt={category.categoryTitle}
              className="category-image"
            />
          </div>

          <p className="category-description">
            {category.categoryDescription || "Опис відсутній..."}
          </p>

          <p className="odessa-humor">{getOdessaHumor()}</p>

          <p className="product-count">
            🔢 Загальна кількість товарів: {products.length}
          </p>

          <div className="sort-container">
            <label>
              🔽 Сортувати:
              <select
                onChange={(e) => setSortOption(e.target.value)}
                className="sort-select"
              >
                <option value="none">Без сортування</option>
                <option value="price_asc">Ціна ↑</option>
                <option value="price_desc">Ціна ↓</option>
                <option value="name_asc">Назва A-Z</option>
                <option value="name_desc">Назва Z-A</option>
              </select>
            </label>
          </div>

          <div className="products-grid">
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <div
                  key={product.productId}
                  className="product-card"
                  onClick={() => handleProductClick(product.productId)}
                >
                  <img
                    src={`${BASE_URL}/storage/${product.imageId}`}
                    alt={product.name}
                    className="product-image"
                  />
                  <h3>{product.name}</h3>
                  <p className="price">💰 {product.price} грн</p>
                  <p>📦 {product.stock} шт в наявності</p>
                  <p>🏷️ Код товару: {product.code}</p>
                </div>
              ))
            ) : (
              <p>🤷‍♂️ Товарів поки нема! А шо ви хотіли? Приходьте завтра!</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
