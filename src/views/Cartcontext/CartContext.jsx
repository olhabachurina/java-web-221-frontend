import React, { createContext, useState, useEffect } from "react";
export default function Shop({ products }) {
  return (
    <div style={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  );
}


export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    console.log("🛒 Добавляем в корзину:", product);
    setCartItems((prev) => {
      const exists = prev.find((item) => item.productId === product.productId);
      let updatedCart;
      if (exists) {
        updatedCart = prev.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prev, { ...product, quantity: 1 }];
      }
      console.log("✅ Обновленный cartItems:", updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (productId) => {
    console.log("❌ Удаляем товар:", productId);
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    console.log("🗑️ Очищаем корзину");
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems: cartItems.reduce((acc, item) => acc + item.quantity, 0),
        totalPrice: cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
const styles = {
  grid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
};