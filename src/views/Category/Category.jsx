import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link, useOutletContext } from "react-router-dom";
import { AppContext } from "../../AppContext.jsx";
import { CartContext } from "../Cartcontext/CartContext.jsx";
import "../../PrivozTheme.css";

const BASE_URL = "http://localhost:8081/Java_Web_211_war";

export default function Category() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { request } = useContext(AppContext);
  const { addToCart } = useContext(CartContext);

  const { cartIconRef } = useOutletContext();

  const [category, setCategory] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]); // ✅ список усіх категорій
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("none");

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isNightMode, setIsNightMode] = useState(new Date().getHours() >= 18);

  const productImageRefs = useRef([]);

  // ✅ завантаження всіх категорій разом з конкретною категорією
  useEffect(() => {
    loadAllCategories();
    loadCategoryBySlug(id);
  }, [id]);

  useEffect(() => {
    sortProducts(sortOption);
  }, [products, sortOption]);

  useEffect(() => {
    productImageRefs.current = sortedProducts.map(
      (_, index) => productImageRefs.current[index] || React.createRef()
    );
  }, [sortedProducts]);

  const loadAllCategories = async () => {
    try {
      const categoriesData = await request(`/products?type=categories`);
      setCategoriesList(categoriesData);
    } catch (error) {
      console.error("❌ Помилка при завантаженні всіх категорій:", error);
    }
  };

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

  const handleAddToCartClick = (e, product, productImageRef) => {
    e.stopPropagation();
    addToCart(product);

    const addSound = new Audio("/sounds/add-to-cart.mp3");
    addSound.play();

    showToastMessage(`🛒 "${product.name}" додано до кошика!`);

    if (cartIconRef?.current && productImageRef?.current) {
      flyToCart(productImageRef.current, cartIconRef.current);
    }
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
  };

  const getOdessaHumor = () => {
    return `Ну шо я вам скажу... Це "${category?.categoryTitle}" – така краса, шо аж дух захоплює! 😉`;
  };

  const flyToCart = (imageElement, cartIcon) => {
    const imageRect = imageElement.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const flyingImage = imageElement.cloneNode(true);
    flyingImage.style.position = "fixed";
    flyingImage.style.top = `${imageRect.top}px`;
    flyingImage.style.left = `${imageRect.left}px`;
    flyingImage.style.width = `${imageRect.width}px`;
    flyingImage.style.height = `${imageRect.height}px`;
    flyingImage.style.transition = "all 1s ease-in-out";
    flyingImage.style.zIndex = 1000;

    document.body.appendChild(flyingImage);

    requestAnimationFrame(() => {
      flyingImage.style.top = `${cartRect.top + cartRect.height / 2}px`;
      flyingImage.style.left = `${cartRect.left + cartRect.width / 2}px`;
      flyingImage.style.width = "30px";
      flyingImage.style.height = "30px";
      flyingImage.style.opacity = "0.5";
    });

    flyingImage.addEventListener("transitionend", () => {
      flyingImage.remove();
    });
  };

  return (
    <div className={`privoz-container ${isNightMode ? "night" : "day"}`}>
      <div className="top-bar">
        <button onClick={toggleNightMode} className="toggle-btn">
          {isNightMode ? "🌙 Нічний Привоз" : "☀️ Денний Привоз"}
        </button>
      </div>

      {/* ✅ Хлебные крошки */}
      <nav className="breadcrumbs animated-breadcrumbs">
        <Link to="/">🏠 Головна</Link> <span className="separator">➜</span>{" "}
        <Link to="/shop">🛍️ Крамниця</Link> <span className="separator">➜</span>{" "}
        <span>📁 {category?.categoryTitle}</span>
      </nav>

      <div className="categories-sidebar">
        <h3>📚 Інші категорії</h3>
        <ul className="category-list">
          {categoriesList.map((cat) => (
            <li key={cat.categoryId}>
              <Link to={`/category/${cat.categorySlug}`}>
                📁 {cat.categoryTitle}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {loading || !category ? (
        <div className="loading">⏳ Завантаження даних...</div>
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
              sortedProducts.map((product, index) => (
                <div
                  key={product.productId}
                  className="product-card"
                  onClick={() => handleProductClick(product.productId)}
                >
                  <img
                    ref={productImageRefs.current[index]}
                    src={`${BASE_URL}/storage/${product.imageId}`}
                    alt={product.name}
                    className="product-image"
                  />
                  <h3>{product.name}</h3>
                  <p className="price">💰 {product.price} грн</p>
                  <p>📦 {product.stock} шт в наявності</p>
                  <p>🏷️ Код товару: {product.code}</p>

                  <button
                    className="btn-cart-add"
                    onClick={(e) =>
                      handleAddToCartClick(e, product, productImageRefs.current[index])
                    }
                    title="Додати до кошика"
                  >
                    🛒➕
                  </button>
                </div>
              ))
            ) : (
              <p>🤷‍♂️ Товарів поки нема! Приходьте завтра!</p>
            )}
          </div>
        </>
      )}

      {showToast && <div className="toast">{toastMessage}</div>}
    </div>
  );
}
