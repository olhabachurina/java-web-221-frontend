import React, { useContext, useEffect } from "react";
import { CartContext } from "../Cartcontext/CartContext";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  } = useContext(CartContext);

  useEffect(() => {
    console.log("➡️ Перешли на страницу корзини");
    console.log("🛒 Текущее содержимое cartItems:", cartItems);
  }, [cartItems]);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>🛒 Кошик порожній</h1>
        <p style={styles.emptyMessage}>
          Додайте товари до кошика, щоб побачити їх тут.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛒 Ваш кошик</h1>

      {cartItems.map((item) => (
        <div key={item.productId} style={styles.item}>
          <div style={styles.imageContainer}>
            <img
              src={item.image}
              alt={item.name}
              style={styles.image}
            />
          </div>

          <div style={styles.details}>
            <h2 style={styles.itemName}>{item.name}</h2>
            <p style={styles.text}>Ціна: <strong>{item.price} грн</strong></p>
            <p style={styles.text}>Кількість: {item.quantity}</p>

            <button
              onClick={() => removeFromCart(item.productId)}
              style={styles.removeBtn}
            >
              ❌ Видалити
            </button>
          </div>
        </div>
      ))}

      <div style={styles.summary}>
        <h3>🧺 Товарів: {totalItems}</h3>
        <h3>💰 Загальна сума: {totalPrice} грн</h3>
      </div>

      <button onClick={clearCart} style={styles.clearBtn}>
        🗑️ Очистити кошик
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "900px",
    margin: "30px auto",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
  },
  title: {
    textAlign: "center",
    fontSize: "2.5rem",
    marginBottom: "30px",
    color: "#61dafb",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#ccc",
  },
  item: {
    display: "flex",
    alignItems: "center",
    marginBottom: "25px",
    borderBottom: "1px solid #444",
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
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain", // Можно заменить на "cover" если нужно заполнять всё пространство
  },
  details: {
    flex: 1,
  },
  itemName: {
    marginBottom: "10px",
    color: "#61dafb",
    fontSize: "1.5rem",
  },
  text: {
    marginBottom: "10px",
    fontSize: "1.1rem",
  },
  removeBtn: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#ff4b4b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  summary: {
    textAlign: "right",
    marginTop: "30px",
    fontSize: "1.2rem",
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
};
