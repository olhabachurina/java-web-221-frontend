import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useOutletContext } from "react-router-dom";
import { AppContext } from "../../AppContext.jsx";
import { CartContext } from "../../views/Cartcontext/CartContext.jsx";
import Toast from "../../views/Toast.jsx";
import "./Prodect.css";

export default function Product() {
  const { id } = useParams();
  const { request } = useContext(AppContext);
  const { addToCart } = useContext(CartContext);
  const { cartIconRef } = useOutletContext(); // доступ к иконке корзины

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inCart, setInCart] = useState(false);
  const [inFavorites, setInFavorites] = useState(false);
  const [rating, setRating] = useState(0);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const BASE_URL = "http://localhost:8081/Java_Web_211_war";

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id]);

  const fetchProduct = async (productId) => {
    setLoading(true);
    try {
      const productData = await request(`/products?type=product&id=${productId}`);
      setProduct(productData);
    } catch (error) {
      console.error("❌ Помилка при завантаженні товару:", error);
    } finally {
      setLoading(false);
    }
  };

  // Подгружаем название категории, если его нет
  useEffect(() => {
    if (product && product.categorySlug && !product.categoryTitle) {
      fetchCategoryInfo(product.categorySlug);
    }
  }, [product]);

  const fetchCategoryInfo = async (slug) => {
    try {
      const categoryData = await request(`/products?type=category&slug=${slug}`);
      setProduct((prev) => ({
        ...prev,
        categoryTitle: categoryData.categoryTitle || "Категорія"
      }));
    } catch (error) {
      console.error("❌ Не вдалося отримати назву категорії:", error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      productId: product.productId,
      name: product.name,
      price: product.price,
      image: productImageUrl,
      quantity: 1
    });

    setInCart(true);

    if (cartIconRef?.current) {
      flyToCart(cartIconRef.current);
    }

    const humor = [
      "Ой, да ви шо! Уже в кошику!",
      "Та беріть два! За таку ціну гріх не взяти!",
      "Після шостої вечора дешевше не буде!",
      "А шо ви думали? Таке тільки на Привозі!",
      "Такий товар — як з маминих рук!"
    ];
    const randomJoke = humor[Math.floor(Math.random() * humor.length)];

    setToastMessage(`✅ Додано до кошика! ${randomJoke}`);
    setToastVisible(true);

    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleAddToFavorites = () => {
    setInFavorites(!inFavorites);
  };

  const handleRating = (star) => {
    setRating(star);
  };

  const productImageUrl = product?.imageId?.startsWith("http")
    ? product.imageId
    : `${BASE_URL}/storage/${product?.imageId}`;

  const flyToCart = (cartIcon) => {
    const productImage = document.querySelector(".product-image");
    if (!productImage) return;

    const flyImage = productImage.cloneNode(true);
    const imageRect = productImage.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    flyImage.style.position = "fixed";
    flyImage.style.top = `${imageRect.top}px`;
    flyImage.style.left = `${imageRect.left}px`;
    flyImage.style.width = `${imageRect.width}px`;
    flyImage.style.height = `${imageRect.height}px`;
    flyImage.style.zIndex = 1000;
    flyImage.style.transition = "all 1s ease-in-out";

    document.body.appendChild(flyImage);

    requestAnimationFrame(() => {
      flyImage.style.top = `${cartRect.top + cartRect.height / 2}px`;
      flyImage.style.left = `${cartRect.left + cartRect.width / 2}px`;
      flyImage.style.width = "20px";
      flyImage.style.height = "20px";
      flyImage.style.opacity = 0.5;
    });

    flyImage.addEventListener("transitionend", () => {
      flyImage.remove();
    });
  };

  if (loading) return <p className="loading">⏳ Завантаження товару...</p>;
  if (!product) return <p className="error">❌ Товар не знайдено!</p>;

  return (
    <div className="product-page">

      {/* ✅ Хлебные крошки */}
      <nav className="breadcrumbs animated-breadcrumbs">
        <Link to="/">
          <span role="img" aria-label="home">🏠</span> Головна
        </Link>
        <span className="separator">➜</span>

        <Link to="/shop">
          <span role="img" aria-label="shop">🛍️</span> Крамниця
        </Link>
        <span className="separator">➜</span>

        {product.categorySlug ? (
          <>
            <Link to={`/category/${product.categorySlug}`}>
              <span role="img" aria-label="category">📁</span>{" "}
              {product.categoryTitle || "Категорія"}
            </Link>
            <span className="separator">➜</span>
          </>
        ) : (
          <>
            <span><span role="img" aria-label="category">📁</span> Категорія</span>
            <span className="separator">➜</span>
          </>
        )}

        <span className="current-page">
          <span role="img" aria-label="product">🛒</span> {product.name}
        </span>
      </nav>

      <h1 className="product-title">🛍️ {product.name}</h1>

      <div className="product-info">
        <div className="image-container">
          <img
            src={productImageUrl}
            alt={product.name}
            className="product-image"
          />
        </div>

        <div className="product-details">
          <p className="product-price">💰 {product.price} грн</p>
          <p className="product-stock">📦 На складі: {product.stock} шт</p>
          <p className="product-code">🏷️ Код товару: {product.code}</p>

          <div className="product-description">
            {product.description || "Опис відсутній, але то не біда! 😉"}
          </div>

          <div className="rating">
            <p>⭐ Рейтинг товару:</p>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${rating >= star ? "filled" : ""}`}
                  onClick={() => handleRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="product-actions">
            <button
              className={`btn-add-to-cart ${inCart ? "in-cart" : ""}`}
              onClick={handleAddToCart}
              disabled={inCart}
            >
              {inCart ? "✅ У кошику" : "➕ Додати до кошика"}
            </button>

            <button
              className={`btn-favorite ${inFavorites ? "favorite" : ""}`}
              onClick={handleAddToFavorites}
            >
              {inFavorites ? "💖 В улюблених" : "🤍 Додати в улюблені"}
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Toast notification */}
      <Toast message={toastMessage} visible={toastVisible} />

    </div>
  );
}
