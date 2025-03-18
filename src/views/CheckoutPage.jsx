import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Cartcontext/CartContext";
import { ThemeContext } from "../../ThemeContext";

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [orderDetails, setOrderDetails] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Обробник зміни полів форми
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(`✏️ Змінюємо ${name}:`, value);
  };

  // Обробник відправки форми
  const handleSubmit = (e) => {
    e.preventDefault();

    // Валідація форми
    if (!orderDetails.name || !orderDetails.address || !orderDetails.phone) {
      alert("Будь ласка, заповніть всі поля!");
      return;
    }

    console.log("✅ Замовлення підтверджено:", orderDetails);
    console.log("🛒 Корзина на момент замовлення:", cartItems);
    console.log("💰 Загальна сума замовлення:", totalPrice);

    // Симуляція підтвердження замовлення
    setIsSubmitted(true);
    clearCart();

    // Перенаправлення на сторінку підтвердження через 3 сек.
    setTimeout(() => {
      navigate("/order-confirmation");
    }, 3000);
  };

  return (
    <div style={{ padding: "20px", ...styles(theme).container }}>
      <h1 style={styles(theme).title}>Оформлення замовлення</h1>
      {isSubmitted ? (
        <div>
          <p style={styles(theme).text}>
            Дякуємо за замовлення! Ми зв’яжемося з вами найближчим часом.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={styles(theme).form}>
          <div style={styles(theme).formGroup}>
            <label style={styles(theme).label}>Ім'я:</label>
            <input
              type="text"
              name="name"
              value={orderDetails.name}
              onChange={handleChange}
              style={styles(theme).input}
            />
          </div>
          <div style={styles(theme).formGroup}>
            <label style={styles(theme).label}>Адреса:</label>
            <input
              type="text"
              name="address"
              value={orderDetails.address}
              onChange={handleChange}
              style={styles(theme).input}
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
            />
          </div>
          <div style={styles(theme).summary}>
            <p style={styles(theme).text}>Загальна сума: {totalPrice} грн</p>
          </div>
          <button type="submit" style={styles(theme).checkoutBtn}>
            Підтвердити замовлення
          </button>
        </form>
      )}
    </div>
  );
}

const styles = (theme) => ({
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