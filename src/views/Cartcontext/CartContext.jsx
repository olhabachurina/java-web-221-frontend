import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:8081/Java_Web_211_war";

  const showSuccess = (message) => toast.success(message);
  const showError = (message) => toast.error(message);
  const showInfo = (message) => toast.info(message);

  const fetchWrapper = async (endpoint, method = "GET", body = null) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showInfo("🚫 Жетон забув? Увійди заново, шановний!");
      return null;
    }

    try {
      console.log(`➡️ Йде запит ${method} на ${endpoint}`);
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : null,
      });

      const contentType = response.headers.get("content-type");
      let data = contentType && contentType.includes("application/json") 
        ? await response.json() 
        : await response.text();

      if (!response.ok) {
        console.error(`❌ Біда! ${response.status}:`, data);
        showError(`Помилка ${response.status}: ${data.error || data}`);
        return null;
      }

      console.log("✅ Відповідь прийшла:", data);
      return data;

    } catch (error) {
      console.error("❌ Щось пішло не так:", error);
      showError("❌ Сервер не відповідає, перевір Wi-Fi!");
      return null;
    }
  };

  const fetchCartFromServer = useCallback(async () => {
    setLoading(true);
    const data = await fetchWrapper("/users/cart");

    if (data && Array.isArray(data.items)) {
      setCartItems(data.items);
      showSuccess("🛒 Корзина під'їхала!");
    } else {
      showInfo("Корзина пуста, як холодильник в кінці місяця");
      setCartItems([]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCartFromServer();
  }, [fetchCartFromServer]);

  const saveCartToServer = useCallback(async (updatedCartItems) => {
    const result = await fetchWrapper("/users/cart", "PUT", { items: updatedCartItems });

    if (result) {
      showSuccess("✅ Корзина збережена!");
    }
  }, []);

  const addToCart = useCallback((product) => {
    setCartItems((prevItems) => {
      const exists = prevItems.find((item) => item.productId === product.productId);
      let updatedCart;

      if (exists) {
        updatedCart = prevItems.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prevItems, { ...product, quantity: 1 }];
      }

      saveCartToServer(updatedCart);
      showSuccess(`Додали ${product.name} в корзину!`);
      return updatedCart;
    });
  }, [saveCartToServer]);

  const decreaseFromCart = useCallback((productId) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);

      saveCartToServer(updatedCart);
      showInfo("➖ Кількість зменшено");
      return updatedCart;
    });
  }, [saveCartToServer]);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item.productId !== productId);

      saveCartToServer(updatedCart);
      showInfo("❌ Видалено з корзини");
      return updatedCart;
    });
  }, [saveCartToServer]);

  const clearCart = useCallback(async () => {
    setCartItems([]);
    const result = await fetchWrapper("/users/cart", "DELETE");

    if (result) {
      showSuccess("🗑️ Корзина очищена!");
    }
  }, []);

  const totalItems = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        decreaseFromCart,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
        loading,
      }}
    >
      {children}
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    </CartContext.Provider>
  );
};
