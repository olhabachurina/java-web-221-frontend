import React, { createContext, useState, useEffect, useMemo } from "react";

// ✅ Адрес API
const BASE_URL = "http://localhost:8081/Java_Web_211_war";

// ✅ Создаем контекст приложения
const AppContext = createContext();

// ✅ Провайдер приложения
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // ✅ Получить профиль пользователя
  const fetchUser = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/users/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        console.warn("⛔️ Токен недействителен. Автовыход...");
        logout();
        return;
      }

      if (!res.ok) {
        throw new Error(`❌ HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ Профіль користувача:", data);

      setUser({
        ...data,
        id: data.user_id || data.id,
        role: data.role_id || data.role || "USER",
      });

    } catch (error) {
      console.error("❌ Помилка отримання профілю:", error);
      logout();
    }
  };

  // ✅ Загружаем профиль при изменении токена
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  // ✅ Логин пользователя
  const login = (newToken) => {
    console.log("🔐 Токен збережено", newToken);
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  // ✅ Выход пользователя
  const logout = () => {
    console.log("👋 Вихід із системи");
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // ✅ Универсальный запрос с авторизацией
  const request = async (endpoint, conf = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const headers = conf.headers || {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      console.log(`➡️ Запрос к API: ${url}`);
      const res = await fetch(url, {
        ...conf,
        headers,
      });

      if (res.status === 401) {
        console.warn("⛔️ Авторизація неуспішна. Виконується вихід...");
        logout();
        throw new Error("❌ 401 Unauthorized");
      }

      if (!res.ok) {
        console.error(`❌ HTTP error: ${res.status}`);
        throw new Error(`HTTP error! Status: ${res.status}`);
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
  };

  // ✅ Контекст, доступный детям
  const contextValue = useMemo(() => ({
    user,
    token,
    login,
    logout,
    request,
  }), [user, token]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export { AppProvider, AppContext };