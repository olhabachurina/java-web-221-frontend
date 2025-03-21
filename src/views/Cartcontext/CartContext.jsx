import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ✅ Состояния корзины и загрузки
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:8081/Java_Web_211_war";

  // ✅ Уведомления
  const showSuccess = (message) => toast.success(message);
  const showError = (message) => toast.error(message);
  const showInfo = (message) => toast.info(message);

  // ✅ Универсальный fetch-запрос
  const fetchWrapper = useCallback(async (endpoint, method = "GET", body = null) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showInfo("🚫 Жетон забув? Увійди заново, шановний!");
      return null;
    }

    try {
      console.log(`➡️ Запрос ${method} на ${endpoint}`);
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : null,
      });

      const contentType = response.headers.get("content-type");
      const data = contentType && contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        console.error(`❌ ${response.status}:`, data);
        showError(`Помилка ${response.status}: ${data.error || data}`);
        return null;
      }

      console.log("✅ Ответ получен:", data);
      return data;

    } catch (error) {
      console.error("❌ Сервер не відповідає:", error);
      showError("❌ Сервер не отвечает, проверь Wi-Fi!");
      return null;
    }
  }, []);

  // ✅ Получение корзины с сервера
  const fetchCartFromServer = useCallback(async () => {
    setLoading(true);
    const data = await fetchWrapper("/users/cart");

    if (data && Array.isArray(data.items)) {
      setCartItems(data.items);
      showSuccess("🛒 Корзина загружена!");
    } else {
      setCartItems([]);
      showInfo("🛒 Корзина пуста");
    }

    setLoading(false);
  }, [fetchWrapper]);

  // ✅ Инициализация корзины при монтировании
  useEffect(() => {
    fetchCartFromServer();
  }, [fetchCartFromServer]);

  // ✅ Сохранение корзины на сервер
  const saveCartToServer = useCallback(async (updatedCartItems) => {
    const result = await fetchWrapper("/users/cart", "PUT", { items: updatedCartItems });

    if (result && result.items) {
      setCartItems(result.items);
      showSuccess("✅ Корзина сохранена!");
    } else if (result) {
      // Если сервер не вернул items, просто подтверждаем успех
      showSuccess("✅ Корзина сохранена!");
    }
  }, [fetchWrapper]);

  // ✅ Добавление товара в корзину
  const addToCart = useCallback((product) => {
    setCartItems((prevItems) => {
      const index = prevItems.findIndex((item) => item.productId === product.productId);
      let updatedCart = [...prevItems];

      if (index !== -1) {
        updatedCart[index] = {
          ...updatedCart[index],
          quantity: updatedCart[index].quantity + 1,
        };
      } else {
        updatedCart.push({ ...product, quantity: 1 });
      }

      saveCartToServer(updatedCart);
      showSuccess(`✅ ${product.name} добавлен в корзину!`);
      return updatedCart;
    });
  }, [saveCartToServer]);

  // ✅ Уменьшение количества товара в корзине
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
      showInfo("➖ Товар уменьшен в количестве");
      return updatedCart;
    });
  }, [saveCartToServer]);

  // ✅ Удаление товара из корзины
  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item.productId !== productId);

      saveCartToServer(updatedCart);
      showInfo("❌ Товар удалён из корзины");
      return updatedCart;
    });
  }, [saveCartToServer]);

  // ✅ Очистка корзины
  const clearCart = useCallback(async () => {
    setCartItems([]);
    const result = await fetchWrapper("/users/cart", "DELETE");

    if (result) {
      showSuccess("🗑️ Корзина очищена!");
    }
  }, [fetchWrapper]);

  // ✅ Количество и стоимость
  const totalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  // ✅ Возвращаем провайдер
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
