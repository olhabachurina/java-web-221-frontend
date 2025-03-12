import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import "./Admin.css"; // ✅ Подключаем стили

export default function Admin() {
  const { user, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Admin component mounted. User:", user);
    if (!user || !token) {
      console.warn("Пользователь не авторизован, перенаправление на /signin");
      navigate("/signin");
      return;
    }

    if (user.role !== "ADMIN") {
      console.warn("Доступ дозволено лише адміністраторам, перенаправлення на /");
      navigate("/");
      return;
    }

    fetchCategories();
    fetchProducts();
  }, [user, token, navigate]);

  const fetchCategories = () => {
    console.log("Fetching categories...");
    fetch("http://localhost:8081/Java_Web_211_war/products?type=categories", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log("Categories response status:", res.status);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched categories:", data);
        setCategories(data);
        setMessage("✅ Категорії завантажено.");
      })
      .catch((error) => {
        console.error("❌ Помилка при завантаженні категорій:", error);
        setMessage("❌ Не вдалося завантажити категорії.");
      });
  };

  const fetchProducts = () => {
    console.log("Fetching products...");
    fetch("http://localhost:8081/Java_Web_211_war/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log("Products response status:", res.status);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched products:", data);
        setProducts(data);
        setMessage("✅ Товари завантажено.");
      })
      .catch((error) => {
        console.error("❌ Помилка при завантаженні товарів:", error);
        setMessage("❌ Не вдалося завантажити товари.");
      })
      .finally(() => setLoading(false));
  };

  const addProduct = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    console.log("Adding product with data:", Object.fromEntries(formData));

    fetch("http://localhost:8081/Java_Web_211_war/products", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => {
        console.log("Add product response status:", res.status);
        return res.json();
      })
      .then((result) => {
        console.log("Add product result:", result);
        if (result.status === "success") {
          setMessage("✅ Товар успішно додано!");
          fetchProducts();
          form.reset();
        } else {
          setMessage(result.message || "❌ Не вдалося додати товар.");
        }
      })
      .catch((error) => {
        console.error("❌ Сталася помилка при додаванні товару:", error);
        setMessage("❌ Сталася помилка при додаванні товару.");
      });
  };

  return (
    <div className="admin-panel">
      <h1 className="title">🛠️ Панель адміністратора</h1>

      {message && <div className="message">{message}</div>}

      <section className="block categories">
        <h2>📁 Категорії</h2>
        <div className="grid">
          {categories.length > 0 ? (
            categories.map((c) => (
              <div key={c.categoryId} className="card category">
                <img
                  src={`/Java_Web_211_war/images/${c.categoryImageId}`}
                  alt={c.categoryTitle}
                />
                <p>{c.categoryTitle}</p>
              </div>
            ))
          ) : (
            <p>🤷‍♂️ Немає категорій</p>
          )}
        </div>
      </section>

      <section className="block add-product">
        <h2>➕ Додати продукт</h2>
        <form onSubmit={addProduct} className="form" encType="multipart/form-data">
          <input name="name" placeholder="Назва" required />
          <textarea name="description" placeholder="Опис" required></textarea>
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

          <button type="submit" className="btn-submit">
            🚀 Додати продукт
          </button>
        </form>
      </section>

      <section className="block products">
        <h2>🛍️ Товари</h2>
        {loading ? (
          <p>⏳ Завантаження товарів...</p>
        ) : products.length === 0 ? (
          <p>🤷‍♀️ Товарів поки немає!</p>
        ) : (
          <div className="grid">
            {products.map((p) => (
              <div key={p.productId} className="card product">
                <img
                  src={`/Java_Web_211_war/images/${p.imageId}`}
                  alt={p.name}
                />
                <div className="info">
                  <h3>{p.name}</h3>
                  <p>💰 {p.price} грн</p>
                  <p>📦 {p.stock} шт.</p>
                  <p>🏷️ {p.code}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
