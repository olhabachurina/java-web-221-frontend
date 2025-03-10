import React, { createContext, useState, useEffect, useMemo } from "react";

// Создаем контекст приложения
const AppContext = createContext();

// Провайдер приложения
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Получить профиль пользователя по токену
  const fetchUser = () => {
    if (!token) return;

    fetch("http://localhost:8081/Java_Web_211_war/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`❌ HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("✅ Профіль користувача:", data);
        setUser({
          ...data,
          id: data.user_id || data.id,
          role: data.role_id || data.role || "USER",
        });
      })
      .catch((error) => {
        console.error("❌ Помилка отримання профілю:", error);
        logout();
      });
  };

  // Загружаем профиль при изменении токена
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  // Логин пользователя — сохраняем токен и загружаем профиль
  const login = (newToken) => {
    console.log("🔐 Токен збережено", newToken);
    localStorage.setItem("token", newToken);
    setToken(newToken);
    fetchUser(); // Подтягиваем профиль сразу
  };

  // Выход пользователя
  const logout = () => {
    console.log("👋 Вихід із системи");
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Утилита для запросов с токеном
  const request = (url, conf = {}) => {
    const headers = conf.headers || {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(url, { ...conf, headers })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      });
  };

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