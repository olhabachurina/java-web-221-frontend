import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./Cartcontext/CartContext";
import { ThemeContext } from "../ThemeContext";
import { AppContext } from "../AppContext";

const BASE_URL = "http://localhost:8081/Java_Web_211_war";

export default function CheckoutPage() {
  const { user, token } = useContext(AppContext);
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [orderDetails, setOrderDetails] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Если пользователь не авторизован, перенаправляем на страницу входа
  useEffect(() => {
    if (!user) {
      console.warn("🚫 Пользователь не авторизован, отправляем на /signin");
      navigate("/signin");
    }
  }, [user, navigate]);

  // Если пользователь авторизован, подставляем его данные в форму
  useEffect(() => {
    if (user) {
      setOrderDetails({
        name: user.name || "",
        address: user.address || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(`✏️ Изменено ${name}:`, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация полей
    if (!orderDetails.name || !orderDetails.address || !orderDetails.phone) {
      alert("Пожалуйста, заполните все поля!");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      alert("Ваша корзина пуста!");
      return;
    }

    try {
      const orderPayload = {
        customer: orderDetails,
        items: cartItems,
        total: totalPrice,
      };

      console.log("🚀 Отправляем заказ на сервер:", orderPayload);

      const res = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include", 
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        console.error(`❌ Ошибка оформления заказа! Код ответа: ${res.status}`);
        throw new Error(`Ошибка оформления заказа (${res.status})`);
      }

      const data = await res.json();
      console.log("✅ Заказ успешно оформлен:", data);

      setIsSubmitted(true);
      clearCart();

      setTimeout(() => {
        navigate("/order-confirmation");
      }, 3000);

    } catch (error) {
      console.error("❌ Ошибка при оформлении заказа:", error);
      alert("Не удалось оформить заказ. Попробуйте позже!");
    }
  };

  return (
    <div style={{ padding: "20px", ...styles(theme).container }}>
      <h1 style={styles(theme).title}>Оформление заказа</h1>
      {isSubmitted ? (
        <div>
          <p style={styles(theme).text}>
            Спасибо за заказ! Мы свяжемся с вами в ближайшее время.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={styles(theme).form}>
          <div style={styles(theme).formGroup}>
            <label style={styles(theme).label}>Имя:</label>
            <input
              type="text"
              name="name"
              value={orderDetails.name}
              onChange={handleChange}
              style={styles(theme).input}
              required
            />
          </div>
          <div style={styles(theme).formGroup}>
            <label style={styles(theme).label}>Адрес:</label>
            <input
              type="text"
              name="address"
              value={orderDetails.address}
              onChange={handleChange}
              style={styles(theme).input}
              required
            />
          </div>
          <div style={styles(theme).formGroup}>
            <label style={styles(theme).label}>Телефон:</label>
            <input
              type="text"
              name="phone"
              value={orderDetails.phone}
              onChange={handleChange}
              style={styles(theme).input}
              required
            />
          </div>
          <div style={styles(theme).summary}>
            <p style={styles(theme).text}>Общая сумма: {totalPrice} грн</p>
          </div>
          <button type="submit" style={styles(theme).checkoutBtn}>
            Подтвердить заказ
          </button>
        </form>
      )}
    </div>
  );
}

const styles = (theme) => ({
  container: {
    backgroundColor: theme === "dark" ? "#333" : "#fff",
    color: theme === "dark" ? "#fff" : "#333",
    borderRadius: "8px",
    maxWidth: "500px",
    margin: "0 auto",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    display: "block",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  summary: {
    marginTop: "20px",
  },
  text: {
    fontSize: "16px",
  },
  checkoutBtn: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
});

/*const styles = (theme) => ({
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: theme.background,
    color: theme.text,
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  text: {
    fontSize: "16px",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
    display: "block",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
  },
  summary: {
    marginBottom: "20px",
  },
  checkoutBtn: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: theme.buttonBackground,
    color: theme.buttonText,
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
});
*/