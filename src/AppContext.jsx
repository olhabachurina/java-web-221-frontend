import React, { createContext, useState, useEffect, useMemo, useCallback } from "react";

// 📌 Базовый URL API
const BASE_URL = "http://localhost:8081/Java_Web_211_war";

// 📌 Создаем контекст
const AppContext = createContext();

// 📌 Провайдер
function AppProvider({ children }) {
  // 👉 Состояния
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [cart, setCart] = useState(null);

  // ✅ ВЫХОД пользователя
  const logout = useCallback(() => {
    console.warn("👋 ВЫХОД: очищаем токен, пользователя и корзину!");
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setCart(null);
  }, []);

  // ✅ ЗАПРОС ПРОФИЛЯ пользователя
  const fetchUser = useCallback(async (authToken = token) => {
    console.log("🚀 [fetchUser] Стартуем с токеном:", authToken);
  
    if (!authToken) {
      console.warn("🚫 [fetchUser] Токен отсутствует! Прерываем запрос профиля...");
      return;
    }
  
    try {
      const res = await fetch(`${BASE_URL}/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
                  
        credentials: "include", // 🔥 опционально, зависит от сервера
      });
  
      console.log("ℹ️ [fetchUser] Ответ от сервера:", res.status);
  
      if (res.status === 401) {
        console.error("⛔️ [fetchUser] Токен протух или невалиден. Логаут!");
        logout();
        return;
      }
  
      const data = await res.json();
      console.log("✅ [fetchUser] Данные получены:", data);
  
      setUser({
        ...data.user,
        id: data.user.user_id || data.user.id,
        role: data.user.role_id || data.user.role || "USER",
      });
  
      setCart(data.cart ?? null);
  
    } catch (error) {
      console.error("❌ [fetchUser] Ошибка получения профиля:", error.message || error);
      logout();
    }
  }, [token, logout])
  
  // ✅ ВХОД пользователя
  const login = useCallback((newToken) => {
    console.log("🔐 [login] Сохраняем токен в localStorage и state:", newToken);

    localStorage.setItem("token", newToken);
    setToken(newToken);

    console.log("📥 [login] Вызываем fetchUser сразу после установки токена");
    fetchUser(newToken);
  }, [fetchUser]);

  // ✅ Запросы к серверу
  const request = useCallback(async (endpoint, conf = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const headers = conf.headers ? { ...conf.headers } : {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    console.log(`🚀 [request] Отправляем запрос к API: ${url}`);
    console.log("📝 [request] Конфиг запроса:", { ...conf, headers });

    try {
      const res = await fetch(url, { ...conf, headers });

      console.log("ℹ️ [request] Ответ от сервера:", res.status);

      if (res.status === 401) {
        console.error("⛔️ [request] Токен невалидный. Выполняем logout...");
        logout();
        throw new Error("401 Unauthorized");
      }

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`❌ [request] HTTP error ${res.status}:`, errorBody);
        throw new Error(`HTTP error! Status: ${res.status}. ${errorBody}`);
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const json = await res.json();
        console.log("✅ [request] Получен JSON:", json);
        return json;
      } else {
        const text = await res.text();
        console.warn("⚠️ [request] Ожидали JSON, получили:", text);
        throw new Error("Response is not JSON");
      }

    } catch (error) {
      console.error("❌ [request] Ошибка выполнения запроса:", error.message || error);
      throw error;
    }
  }, [token, logout]);

  // ✅ Эффект для автоматического фетчинга при наличии токена
  useEffect(() => {
    if (token) {
      console.log("🔄 [useEffect] Есть токен, пробуем получить пользователя");
      fetchUser(token);
    } else {
      console.log("ℹ️ [useEffect] Токена нет, чистим пользователя и корзину");
      setUser(null);
      setCart(null);
    }
  }, [token, fetchUser]);

  // ✅ Значения контекста
  const contextValue = useMemo(() => ({
    user,
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