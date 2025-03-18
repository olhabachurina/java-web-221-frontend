

import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";

// Адреса API
const BASE_URL = "http://localhost:8081/Java_Web_211_war";

// Контекст додатку
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [cart, setCart] = useState(null);

  // Вихід
  const logout = useCallback(() => {
    console.log("👋 Вихід із системи");
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setCart(null);
  }, []);

  // Отримання профілю користувача
  const fetchUser = useCallback(async () => {
    if (!token) {
      console.warn("🚫 Нема токена - обнуляємо користувача і корзину");
      return;
    }

    try {
      console.log("➡️ Отправляем запрос на /users/me");

      const res = await fetch(`${BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        console.warn("⛔️ Токен недійсний. Виконую вихід...");
        logout();
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ HTTP ${res.status}: ${errorText}`);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log("✅ Профіль користувача отримано:", data);

      const fetchedUser = data.user ?? {};
      setUser({
        ...fetchedUser,
        id: fetchedUser.user_id || fetchedUser.id,
        role: fetchedUser.role_id || fetchedUser.role || "USER",
      });

      if (data.cart) {
        console.log("🛒 Отримана корзина:", data.cart);
        setCart(data.cart);
      } else {
        console.warn("⚠️ У користувача немає активної корзини");
        setCart(null);
      }

    } catch (error) {
      console.error("❌ Помилка отримання профілю:", error);
      logout();
    }
  }, [token, logout]);

  // Вхід
  const login = useCallback((newToken) => {
    console.log("🔐 Токен збережено:", newToken);
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }, []);

  // Запит до сервера
  const request = useCallback(async (endpoint, conf = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const headers = conf.headers ? { ...conf.headers } : {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      console.log(`➡️ Запит до API: ${url}`);

      const res = await fetch(url, { ...conf, headers });

      if (res.status === 401) {
        console.warn("⛔️ Авторизація неуспішна. Виконується вихід...");
        logout();
        throw new Error("401 Unauthorized");
      }

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`❌ HTTP error ${res.status}:`, errorBody);
        throw new Error(`HTTP error! Status: ${res.status}. ${errorBody}`);
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const json = await res.json();
        console.log("✅ Відповідь JSON:", json);
        return json;
      } else {
        const text = await res.text();
        console.warn("⚠️ Очікувався JSON, але прийшов інший формат:", text);
        throw new Error("Response is not JSON");
      }

    } catch (error) {
      console.error("❌ Помилка запиту:", error.message || error);
      throw error;
    }
  }, [token, logout]);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      console.log("ℹ️ Токен отсутствует, очистка пользователя і корзини");
      setUser(null);
      setCart(null);
    }
  }, [token, fetchUser]);

  const contextValue = useMemo(() => ({
    user,
    setUser,
    token,
    login,
    logout,
    request,
    cart,
    setCart,
  }), [user, token, cart, login, logout, request]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export { AppProvider, AppContext };