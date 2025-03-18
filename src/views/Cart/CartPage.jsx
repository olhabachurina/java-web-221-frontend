import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Cartcontext/CartContext";
import { ThemeContext } from "../../ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../../Modal/Modal";

const BASE_URL = "http://localhost:8081/Java_Web_211_war";

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    addToCart,
    decreaseFromCart,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
    loading,
  } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("➡️ Перешли на страницу корзины");
    console.log("🛒 Текущее содержимое корзины:", cartItems);
  }, [cartItems]);

  const handleCheckout = () => {
    console.log("✅ Переход к оформлению заказа");
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    console.log("🛍️ Продолжаем покупки");
    navigate("/shop");
  };

  if (loading) {
    return <div style={styles(theme).container}>Загрузка корзины...</div>;
  }

  if (!cartItems || cartItems.length === 0) {
    console.log("🛒 Корзина пуста");
    return (
      <div style={styles(theme).container}>
        <h1 style={styles(theme).title}>🛒 Кошик порожній</h1>
        <p style={styles(theme).emptyMessage}>
          Додайте товари до кошика, щоб побачити їх тут.
        </p>
        <button onClick={handleContinueShopping} style={styles(theme).continueBtn}>
          🛍️ Продовжити покупки
        </button>
      </div>
    );
  }

  return (
    <div style={styles(theme).container}>
      <h1 style={styles(theme).title}>🛒 Ваш кошик</h1>

      <AnimatePresence>
        {cartItems.map((item) => (
          <motion.div
            key={item.productId}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            style={styles(theme).item}
          >
            <div style={styles(theme).imageContainer}>
              <img
                src={
                  item.imageId
                    ? `${BASE_URL}/storage/${item.imageId}`
                    : "/images/no-image.png"
                }
                alt={item.name}
                style={styles(theme).image}
                onError={(e) => {
                  e.target.src = "/images/no-image.png";
                }}
              />
            </div>

            <div style={styles(theme).details}>
              <h2 style={styles(theme).itemName}>{item.name}</h2>
              <p style={styles(theme).text}>
                Ціна: <strong>{item.price} грн</strong>
              </p>

              <div style={styles(theme).quantityControl}>
                <button
                  onClick={() => decreaseFromCart(item.productId)}
                  style={styles(theme).qtyBtn}
                >
                  −
                </button>
                <span style={styles(theme).qtyText}>{item.quantity}</span>
                <button
                  onClick={() => addToCart(item)}
                  style={styles(theme).qtyBtn}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.productId)}
                style={styles(theme).removeBtn}
              >
                ❌ Видалити
              </button>

              <p style={styles(theme).funnyText}>
                Та бери ще! Воно тобі треба! 😄
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div style={styles(theme).summary}>
        <h3>🧺 Товарів: {totalItems}</h3>
        <h3>💰 Загальна сума: {totalPrice} грн</h3>
      </div>

      <div style={styles(theme).actions}>
        <button onClick={handleContinueShopping} style={styles(theme).continueBtn}>
          🛍️ Продовжити покупки
        </button>
        <button onClick={handleCheckout} style={styles(theme).checkoutBtn}>
          ✅ Оформити замовлення
        </button>
      </div>

      <button
        onClick={() => {
          console.log("🗑️ Открытие модального окна для очистки корзины");
          setIsModalOpen(true);
        }}
        style={styles(theme).clearBtn}
      >
        🗑️ Очистити кошик
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          console.log("❌ Закрытие модального окна");
          setIsModalOpen(false);
        }}
        onConfirm={() => {
          console.log("🗑️ Очищаем корзину через модальное окно");
          clearCart();
          setIsModalOpen(false);
        }}
        theme={theme}
        title="Очистити кошик?"
        description="Ви дійсно бажаєте видалити всі товари з кошика?"
      />
    </div>
  );
}


const styles = (theme) => ({
  container: {
    padding: "20px",
    maxWidth: "900px",
    margin: "30px auto",
    backgroundColor: theme === "night" ? "#1a1a1a" : "#f9f9f9",
    color: theme === "night" ? "#fff" : "#333",
    borderRadius: "10px",
    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
  },
  title: {
    textAlign: "center",
    fontSize: "2.5rem",
    marginBottom: "30px",
    color: theme === "night" ? "#61dafb" : "#ff9800",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: theme === "night" ? "#ccc" : "#555",
  },
  item: {
    display: "flex",
    alignItems: "center",
    marginBottom: "25px",
    borderBottom: `1px solid ${theme === "night" ? "#444" : "#ddd"}`,
    paddingBottom: "15px",
  },
  imageContainer: {
    width: "120px",
    height: "120px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "10px",
    marginRight: "25px",
    overflow: "hidden",
    padding: "8px",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  details: {
    flex: 1,
  },
  itemName: {
    marginBottom: "10px",
    color: theme === "night" ? "#61dafb" : "#333",
    fontSize: "1.5rem",
  },
  text: {
    marginBottom: "10px",
    fontSize: "1.1rem",
  },
  quantityControl: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "15px",
  },
  qtyBtn: {
    padding: "10px 14px",
    backgroundColor: theme === "night" ? "#4caf50" : "#2196f3",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1.2rem",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  qtyText: {
    fontSize: "1.2rem",
    minWidth: "30px",
    textAlign: "center",
  },
  removeBtn: {
    padding: "10px 20px",
    backgroundColor: "#ff4b4b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  funnyText: {
    marginTop: "10px",
    color: theme === "night" ? "#ffc107" : "#ff5722",
    fontStyle: "italic",
  },
  summary: {
    textAlign: "right",
    marginTop: "30px",
    fontSize: "1.2rem",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  continueBtn: {
    padding: "12px 24px",
    backgroundColor: "#03a9f4",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1.1rem",
    transition: "background 0.3s ease",
  },
  checkoutBtn: {
    padding: "12px 24px",
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1.1rem",
    transition: "background 0.3s ease",
  },
  clearBtn: {
    marginTop: "20px",
    padding: "14px 24px",
    backgroundColor: "#ff4b4b",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
    fontSize: "1.1rem",
    transition: "background 0.3s ease",
  },
});