import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import "./Admin.css";

export default function Admin() {
  const { user, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState("default");

  const BASE_URL = "http://localhost:8081/Java_Web_211_war";

  
  useEffect(() => {
    console.log("🔧 [Admin Init] Перевірка авторизації...");
    if (!user || !token) {
      console.warn("🚫 [Admin Init] Користувач не авторизований! Перехід на /signin");
      navigate("/signin");
      return;
    }

    if (user.role !== "ADMIN") {
      console.warn("🚫 [Admin Init] Доступ дозволено лише адміністраторам! Перехід на /");
      navigate("/");
      return;
    }

    console.log("✅ [Admin Init] Користувач авторизований, завантажуємо дані...");
    fetchCategories();
    fetchProducts();
  }, [user, token, navigate]);

  
  const fetchCategories = async () => {
    setLoading(true);
    console.log("🔄 [fetchCategories] Початок завантаження категорій...");
    try {
      const res = await fetch(`${BASE_URL}/products?type=categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(`[fetchCategories] Статус відповіді: ${res.status}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      console.log("✅ [fetchCategories] Отримано категорії:", data);

      setCategories(data);
      setMessage("✅ Категорії завантажено.");
    } catch (error) {
      console.error("❌ [fetchCategories] Помилка при завантаженні категорій:", error);
      setMessage("❌ Не вдалося завантажити категорії.");
    } finally {
      setLoading(false);
    }
  };

  
  const fetchProducts = async () => {
    setLoading(true);
    console.log("🔄 [fetchProducts] Початок завантаження товарів...");
    try {
      const res = await fetch(`${BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(`[fetchProducts] Статус відповіді: ${res.status}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      console.log("✅ [fetchProducts] Отримано товари:", data);

      setProducts(data);
      setMessage("✅ Товари завантажено.");
    } catch (error) {
      console.error("❌ [fetchProducts] Помилка при завантаженні товарів:", error);
      setMessage("❌ Не вдалося завантажити товари.");
    } finally {
      setLoading(false);
    }
  };

  
  const addProduct = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    console.log("📝 [addProduct] Спроба додати товар з даними:");
    formData.forEach((value, key) => {
      console.log(`   ${key}:`, value);
    });

    try {
      const res = await fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, 
        body: formData,
      });

      console.log(`[addProduct] Статус відповіді: ${res.status}`);

      const result = await res.json();
      console.log("✅ [addProduct] Відповідь сервера:", result);

      if (result.status === "success") {
        setMessage("✅ Товар додано успішно!");
        form.reset();
        fetchProducts();
      } else {
        setMessage(result.message || "❌ Не вдалося додати товар.");
      }
    } catch (error) {
      console.error("❌ [addProduct] Помилка при додаванні товару:", error);
      setMessage("❌ Сталася помилка при додаванні товару.");
    }
  };

  
  const sortedProducts = () => {
    console.log("🔽 [sortedProducts] Сортування:", sortType);
    let sorted = [...products];

    switch (sortType) {
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
        console.log("⚠️ [sortedProducts] Використовується стандартне сортування");
    }

    return sorted;
  };

  
  return (
    <div className="admin-panel">
      <h1 className="title">🛠️ Панель адміністратора</h1>

      {message && <div className="message">{message}</div>}

      {/* КАТЕГОРІЇ */}
      <section className="block categories">
        <h2>📁 Категорії</h2>
        {loading && <p>⏳ Завантаження...</p>}

        <div className="grid">
          {categories.length > 0 ? (
            categories.map((c) => (
              <div key={c.categoryId} className="card category">
                <img
                  src={`${BASE_URL}/storage/${c.categoryImageId}`}
                  alt={c.categoryTitle}
                />
                <p>{c.categoryTitle}</p>
              </div>
            ))
          ) : (
            <p>🤷‍♂️ Категорій немає</p>
          )}
        </div>
      </section>

      {/* ДОДАТИ ТОВАР */}
      <section className="block add-product">
        <h2>➕ Додати продукт</h2>
        <form onSubmit={addProduct} className="form" encType="multipart/form-data">
          <input name="name" placeholder="Назва товару" required />
          <textarea name="description" placeholder="Опис товару" required />
          <input name="price" type="number" placeholder="Ціна" required />
          <input name="stock" type="number" placeholder="Кількість на складі" required />
          <input name="code" placeholder="Код товару" required />
          <input name="file1" type="file" accept="image/*" required />

          <select name="categoryId" required>
            <option value="">🗂️ Обрати категорію</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryTitle}
              </option>
            ))}
          </select>

          <button type="submit" className="btn-submit">🚀 Додати</button>
        </form>
      </section>

      {/* ТОВАРИ */}
      <section className="block products">
        <h2>🛍️ Товари</h2>

        <div className="sort-block">
          <label>🔽 Сортувати: </label>
          <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
            <option value="default">Без сортування</option>
            <option value="price_asc">Ціна ↑</option>
            <option value="price_desc">Ціна ↓</option>
            <option value="name_asc">Назва A-Z</option>
            <option value="name_desc">Назва Z-A</option>
          </select>
        </div>

        {loading ? (
          <p>⏳ Завантаження товарів...</p>
        ) : sortedProducts().length === 0 ? (
          <p>🤷‍♀️ Товарів немає!</p>
        ) : (
          <div className="grid">
            {sortedProducts().map((p) => (
              <div key={p.productId} className="card product">
                <img
                  src={`${BASE_URL}/storage/${p.imageId}`}
                  alt={p.name}
                />
                <div className="info">
                  <h3>{p.name}</h3>
                  <p>💰 {p.price} грн</p>
                  <p>📦 {p.stock} шт.</p>
                  <p>🏷️ Код: {p.code}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}